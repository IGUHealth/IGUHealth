import * as dateFns from "date-fns";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import {
  HistoryInstanceRequest,
  SystemHistoryRequest,
  TypeHistoryRequest,
} from "@iguhealth/client/types";

import { IGUHealthServerCTX } from "../../fhir-server/types.js";
import { toDBFHIRVersion } from "../../fhir-clients/utilities/version.js";
import { Insertable, ResourceStore } from "../interface.js";
import { createFHIRURL } from "../../fhir-server/constants.js";
import { ParsedParameter } from "@iguhealth/client/lib/url";
import { deriveLimit } from "../../search-stores/parameters.js";
import { code, id, uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { paramsWithComma } from "../../search-stores/sql.js";

const validHistoryParameters = ["_count", "_since"]; // "_at", "_list"]
function processHistoryParameters(
  parameters: ParsedParameter<string | number>[],
): s.resources.Whereable {
  const sqlParams: s.resources.Whereable = {};
  const _since = parameters.find((p) => p.name === "_since");

  const invalidParameters = parameters.filter(
    (p) => validHistoryParameters.indexOf(p.name) === -1,
  );

  if (invalidParameters.length !== 0) {
    throw new OperationError(
      outcomeError(
        "invalid",
        `Invalid parameters: ${invalidParameters.map((p) => p.name).join(", ")}`,
      ),
    );
  }

  if (_since?.value[0] && typeof _since?.value[0] === "string") {
    const value = dateFns.parseISO(_since.value[0]);

    if (!dateFns.isValid(value)) {
      throw new OperationError(
        outcomeError("invalid", "_since must be a valid date time."),
      );
    }
    sqlParams["created_at"] = db.sql`${db.self} >= ${db.param(value)}`;
  }

  return sqlParams;
}

function historyLevelFilter(
  request:
    | HistoryInstanceRequest<FHIR_VERSION>
    | TypeHistoryRequest<FHIR_VERSION>
    | SystemHistoryRequest<FHIR_VERSION>,
): s.resources.Whereable {
  switch (request.level) {
    case "instance": {
      return {
        resource_type: request.resource,
        id: request.id,
      };
    }
    case "type": {
      return {
        resource_type: request.resource,
      };
    }
    case "system": {
      return {};
    }
    default:
      throw new OperationError(
        outcomeError("invalid", "Invalid history level"),
      );
  }
}

async function getHistory<
  CTX extends Pick<IGUHealthServerCTX, "store" | "tenant">,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  filters: s.resources.Whereable,
  parameters: ParsedParameter<string | number>[],
): Promise<NonNullable<Resource<Version, "Bundle">["entry"]>> {
  const _count = parameters.find((p) => p.name === "_count");
  const limit = deriveLimit([0, 50], _count);

  const historyCols = <const>["resource", "request_method"];
  type HistoryReturn = s.resources.OnlyCols<typeof historyCols>;
  const historySQL = await db.sql<s.resources.SQL, HistoryReturn[]>`
  SELECT ${db.cols(historyCols)}
  FROM ${"resources"} 
  WHERE
  ${{
    fhir_version: toDBFHIRVersion(fhirVersion),
    tenant: ctx.tenant,
    ...filters,
    ...processHistoryParameters(parameters),
  }} ORDER BY ${"created_at"} DESC LIMIT ${db.param(limit)}`;

  const history = await historySQL.run(ctx.store.getClient());

  const resourceHistory = history.map((row) => {
    const resource = row.resource as unknown as Resource<
      Version,
      AllResourceTypes
    >;
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resource: resource as any,
      fullUrl: createFHIRURL(
        fhirVersion,
        ctx.tenant,
        `${resource.resourceType}/${resource.id}`,
      ),
      request: {
        url: `resource.resourceType}/${resource.id}` as uri,
        method: row.request_method as code,
      },
      response: {
        location: `${resource.resourceType}/${resource.id}` as uri,
        status: "200",
        etag: resource.meta?.versionId as id,
        lastModified: resource.meta?.lastUpdated,
      },
    };
  });

  return resourceHistory;
}

export class PostgresStore<CTX extends Pick<IGUHealthServerCTX, "tenant">>
  implements ResourceStore<CTX>
{
  private readonly _pgClient;
  constructor(pgClient: db.Queryable) {
    this._pgClient = pgClient;
  }
  async readResourcesByVersionId<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    version_ids: string[],
  ): Promise<Resource<Version, AllResourceTypes>[]> {
    if (version_ids.length === 0) return [];

    const fhir_version = toDBFHIRVersion(fhirVersion);
    const whereable = db.sql<s.resources.SQL>`
      ${"tenant"} = ${db.param(ctx.tenant)}
      AND ${"fhir_version"} = ${db.param(fhir_version)}
      AND ${"version_id"} IN (${paramsWithComma(version_ids)})
    `;

    const res = (
      await db
        .select("resources", whereable, { columns: ["resource"] })
        .run(this.getClient())
    ).map((r) => r.resource) as unknown as Resource<
      Version,
      AllResourceTypes
    >[];

    const version_ids_to_index = version_ids.reduce(
      (acc: Record<string, number>, id, index) => {
        acc[id] = index;
        return acc;
      },
      {},
    );

    const returnOrdered = [...new Array(version_ids.length)];

    res.forEach((resource) => {
      const versionId = resource.meta?.versionId;
      if (!versionId)
        throw new OperationError(
          outcomeError(
            "exception",
            "postgres store could not derive versionId from resource meta.",
          ),
        );
      const index = version_ids_to_index[versionId];
      returnOrdered[index] = resource;
    });

    return returnOrdered.filter((r) => r !== undefined);
  }

  async readLatestResourceById<Version extends FHIR_VERSION, Type extends ResourceType<Version>>(
    ctx: CTX,
    fhirVersion: Version,
    resourceType: Type,
    id: id,
  ): Promise<Resource<Version, Type> | undefined> {
    const result = await db
      .selectOne(
        "resources",
        {
          tenant: ctx.tenant,
          id: id,
          resource_type: resourceType,
          fhir_version: toDBFHIRVersion(fhirVersion),
        },
        {
          order: { by: "created_at", direction: "DESC" },
          columns: ["resource"],
        },
      )
      .run(this.getClient());

    return result?.resource as unknown as Promise<
      Resource<Version, Type> | undefined
    >;
  }

  async insert<T extends Insertable>(
    ctx: CTX,
    type: T,
    data: s.InsertableForTable<T>,
  ): Promise<s.JSONSelectableForTable<T>> {
    switch (type) {
      case "resources": {
        const res = await db
          .upsert(
            "resources",
            [data as s.InsertableForTable<"resources">],
            db.constraint("resources_pkey"),
            {
              updateColumns: Object.keys(data) as s.resources.Column[],
            },
          )
          .run(this.getClient());

        return res[0] as unknown as s.JSONSelectableForTable<T>;
      }
      case "users":
      case "tenants": {
        const res = await db.insert(type, [data]).run(this.getClient());
        return res[0];
      }
      default: {
        throw new OperationError(
          outcomeError("invalid", `Invalid insertion type '${type}'`),
        );
      }
    }
  }

  async history<Version extends FHIR_VERSION>(
    ctx: CTX,
    request:
      | HistoryInstanceRequest<FHIR_VERSION>
      | TypeHistoryRequest<FHIR_VERSION>
      | SystemHistoryRequest<FHIR_VERSION>,
  ): Promise<NonNullable<Resource<Version, "Bundle">["entry"]>> {
    return getHistory(
      { ...ctx, store: this },
      request.fhirVersion,
      historyLevelFilter(request),
      request.parameters || [],
    );
  }

  getClient(): db.Queryable {
    return this._pgClient;
  }
}
