import * as dateFns from "date-fns";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import {
  R4BHistoryInstanceRequest,
  R4BSystemHistoryRequest,
  R4BTypeHistoryRequest,
  R4HistoryInstanceRequest,
  R4SystemHistoryRequest,
  R4TypeHistoryRequest,
} from "@iguhealth/client/types";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";
import { toDBFHIRVersion } from "../utilities/version.js";
import { ResourceStore } from "./interface.js";
import { createFHIRURL } from "../../fhir-api/constants.js";
import { ParsedParameter } from "@iguhealth/client/lib/url";
import { deriveLimit } from "../utilities/search/parameters.js";
import { code, id, uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { paramsWithComma } from "../utilities/sql.js";

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
    const value =   dateFns.parseISO(
        _since.value[0],
      );

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
    | R4HistoryInstanceRequest
    | R4TypeHistoryRequest
    | R4SystemHistoryRequest
    | R4BHistoryInstanceRequest
    | R4BTypeHistoryRequest
    | R4BSystemHistoryRequest,
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
  CTX extends Pick<IGUHealthServerCTX, "db" | "tenant">,
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

  const history = await historySQL.run(ctx.db);

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

export class PostgresStore<CTX extends Pick<IGUHealthServerCTX, "db" | "tenant">>
  implements ResourceStore<CTX>
{
  async read<Version extends FHIR_VERSION>(
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
        .run(ctx.db)
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

    return returnOrdered;
  }

  async readLatestResourceById<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    id: id,
  ): Promise<Resource<Version, AllResourceTypes> | undefined> {
    const result = await db
      .selectOne(
        "resources",
        {
          tenant: ctx.tenant,
          id: id,
          fhir_version: toDBFHIRVersion(fhirVersion),
        },
        {
          order: { by: "created_at", direction: "DESC" },
          columns: ["resource"],
        },
      )
      .run(ctx.db);

    return result?.resource as unknown as Promise<
      Resource<Version, AllResourceTypes> | undefined
    >;
  }

  async insert<Version extends FHIR_VERSION>(
    ctx: CTX,
    data: s.resources.Insertable[],
  ): Promise<Resource<Version, AllResourceTypes>[]> {
    const result = await db
      .insert("resources", data, { returning: ["resource"] })
      .run(ctx.db);

    return result.map((r) => r.resource) as unknown as Resource<
      Version,
      AllResourceTypes
    >[];
  }
  async history<Version extends FHIR_VERSION>(
    ctx: CTX,
    request:
      | R4HistoryInstanceRequest
      | R4TypeHistoryRequest
      | R4SystemHistoryRequest
      | R4BHistoryInstanceRequest
      | R4BTypeHistoryRequest
      | R4BSystemHistoryRequest,
  ): Promise<NonNullable<Resource<Version, "Bundle">["entry"]>> {
    return getHistory(
      ctx,
      request.fhirVersion,
      historyLevelFilter(request),
      request.parameters || [],
    );
  }
}
