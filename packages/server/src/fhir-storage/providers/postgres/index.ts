import jsonpatch, { Operation } from "fast-json-patch";
import dayjs from "dayjs";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIRClient } from "@iguhealth/client/interface";
import { AsynchronousClient } from "@iguhealth/client";
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "@iguhealth/client/middleware";
import { code, id, unsignedInt, uri } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { evaluateWithMeta } from "@iguhealth/fhirpath";
import { MetaValueSingular } from "@iguhealth/meta-value";
import {
  isOperationError,
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";
import {
  FHIRResponse,
  R4BHistoryInstanceRequest,
  R4BSystemHistoryRequest,
  R4BSystemSearchRequest,
  R4BTypeHistoryRequest,
  R4BTypeSearchRequest,
  R4HistoryInstanceRequest,
  R4SystemHistoryRequest,
  R4SystemSearchRequest,
  R4TypeHistoryRequest,
  R4TypeSearchRequest,
} from "@iguhealth/client/lib/types";

import dataConversion from "../../utilities/search/dataConversion.js";
import {
  searchResources,
  deriveLimit,
  searchParameterToTableName,
} from "../../utilities/search/parameters.js";
import { fhirResourceToBundleEntry, fhirResponseToBundleEntry, fullUrl } from "../../utilities/bundle.js";
import { httpRequestToFHIRRequest } from "../../../fhir-http/index.js";
import { asSystemCTX, FHIRServerCTX } from "../../../fhir-api/types.js";
import { param_types_supported } from "./constants.js";
import { executeSearchQuery } from "./search/index.js";
import { ParsedParameter } from "@iguhealth/client/url";
import {
  buildTransactionTopologicalGraph,
  FHIRTransaction,
} from "../../transactions.js";
import { validateResource } from "../../../fhir-operation-executors/providers/local/resource_validate.js";
import { createResolverRemoteCanonical } from "../../utilities/canonical.js";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
import { toDBFHIRVersion } from "../../utilities/version.js";
import { generateId } from "../../utilities/generateId.js";

async function getAllParametersForResource<
  CTX extends FHIRServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resourceTypes: ResourceType<Version>[],
): Promise<Resource<Version, "SearchParameter">[]> {
  const parameters = [
    {
      name: "type",
      value: param_types_supported,
    },
    {
      name: "base",
      value: searchResources(resourceTypes),
    },
  ];

  return (
    await ctx.client.search_type(
      asSystemCTX(ctx),
      fhirVersion,
      "SearchParameter",
      parameters,
    )
  ).resources;
}

async function indexSearchParameter<
  CTX extends FHIRServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  parameter: Resource<Version, "SearchParameter">,
  resource: Resource<Version, AllResourceTypes> & {
    id: id;
    meta: { versionId: id };
  },
  evaluation: MetaValueSingular<NonNullable<unknown>>[],
) {
  switch (parameter.type) {
    case "quantity": {
      const quantity_indexes = (
        await dataConversion(fhirVersion, parameter, "quantity", evaluation)
      ).map(
        (
          value,
        ): s.r4_quantity_idx.Insertable | s.r4b_quantity_idx.Insertable => ({
          tenant: ctx.tenant,
          r_id: resource.id,
          resource_type: resource.resourceType,
          r_version_id: parseInt(resource.meta.versionId),
          parameter_name: parameter.name,
          parameter_url: parameter.url,
          // Note because I can use string -infinity for the start value, I need to cast it to number here even though technically string,
          start_value: value.start?.value as number | undefined,
          start_system: value.start?.system,
          start_code: value.start?.code,
          // Note because I can use string infinity for the start value, I need to cast it to number here even though technically string,
          end_value: value.end?.value as number | undefined,
          end_system: value.end?.system,
          end_code: value.end?.code,
        }),
      );
      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_quantity_idx",
              quantity_indexes,
              db.constraint("quantity_idx_pkey"),
              { updateColumns: db.doNothing },
            )
            .run(ctx.db);
          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_quantity_idx",
              quantity_indexes as s.r4b_quantity_idx.Insertable[],
              db.constraint("r4b_quantity_idx_pkey"),
              { updateColumns: db.doNothing },
            )
            .run(ctx.db);
          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }
    case "date": {
      const date_indexes = (await dataConversion(fhirVersion, parameter, "date", evaluation))
        .flat()
        .map((value): s.r4_date_idx.Insertable | s.r4b_date_idx.Insertable => ({
          tenant: ctx.tenant,
          r_id: resource.id,
          resource_type: resource.resourceType,
          r_version_id: parseInt(resource.meta.versionId),
          parameter_name: parameter.name,
          parameter_url: parameter.url,
          start_date: value.start as unknown as Date,
          end_date: value.end as unknown as Date,
        }));
      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_date_idx",
              date_indexes,
              db.constraint("date_idx_pkey"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);
          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_date_idx",
              date_indexes as s.r4b_date_idx.Insertable[],
              db.constraint("r4b_date_idx_pkey"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);
          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }

    case "reference": {
      const references = (
        await dataConversion(
          fhirVersion,
          parameter,
          "reference",
          evaluation,
          createResolverRemoteCanonical(ctx),
        )
      ).flat();

      const reference_indexes = references
        .filter(({ reference }) => {
          if (!reference.reference) {
            ctx.logger.warn("Cannot index logical reference.");
            return false;
          }
          return true;
        })
        .map(
          ({
            reference,
            resourceType,
            id,
          }):
            | s.r4_reference_idx.Insertable
            | s.r4b_reference_idx.Insertable => {
            if (!resourceType || !id) {
              throw new OperationError(
                outcomeError(
                  "exception",
                  "Resource type or id not found when indexing the resource.",
                ),
              );
            }
            return {
              tenant: ctx.tenant,
              r_id: resource.id,
              resource_type: resource.resourceType,
              r_version_id: parseInt(resource.meta.versionId),
              parameter_name: parameter.name,
              parameter_url: parameter.url,
              reference: reference as db.JSONValue,
              reference_type: resourceType,
              reference_id: id,
            };
          },
        );

      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_reference_idx",
              reference_indexes,
              db.constraint("reference_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);

          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_reference_idx",
              reference_indexes as s.r4b_reference_idx.Insertable[],
              db.constraint("r4b_reference_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);

          return;
        }

        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }
    case "uri": {
      const uri_indexes = (await dataConversion(fhirVersion, parameter, "uri", evaluation))
        .flat()
        .map((value): s.r4_uri_idx.Insertable | s.r4b_uri_idx.Insertable => ({
          tenant: ctx.tenant,
          r_id: resource.id,
          resource_type: resource.resourceType,
          r_version_id: parseInt(resource.meta.versionId),
          parameter_name: parameter.name,
          parameter_url: parameter.url,
          value,
        }));

      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_uri_idx",
              uri_indexes,
              db.constraint("uri_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);

          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_uri_idx",
              uri_indexes as s.r4b_uri_idx.Insertable[],
              db.constraint("r4b_uri_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);
          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }
    case "token": {
      const token_indexes = (
        await dataConversion(fhirVersion, parameter, "token", evaluation)
      )
        .flat()
        .map(
          (value): s.r4_token_idx.Insertable | s.r4b_token_idx.Insertable => ({
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            system: value.system,
            value: value.code,
          }),
        );
      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_token_idx",
              token_indexes,
              db.constraint("token_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);

          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_token_idx",
              token_indexes as s.r4b_token_idx.Insertable[],
              db.constraint("r4b_token_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);

          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }
    case "number": {
      const number_indexes = (
        await dataConversion(fhirVersion, parameter, "number", evaluation)
      ).map(
        (value): s.r4_number_idx.Insertable | s.r4b_number_idx.Insertable => {
          if (typeof value !== "number")
            throw new OperationError(
              outcomeError(
                "invalid",
                "Failed to index number. Value found is not a number.",
              ),
            );
          return {
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            value,
          };
        },
      );
      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_number_idx",
              number_indexes,
              db.constraint("number_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);
          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_number_idx",
              number_indexes as s.r4b_number_idx.Insertable[],
              db.constraint("r4b_number_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);
          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }

    case "string": {
      const string_indexes = (
        await dataConversion(fhirVersion, parameter, "string", evaluation)
      )
        .flat()
        .map(
          (
            value,
          ): s.r4_string_idx.Insertable | s.r4b_string_idx.Insertable => ({
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            value,
          }),
        );
      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_string_idx",
              string_indexes,
              db.constraint("string_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);

          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_string_idx",
              string_indexes as s.r4b_string_idx.Insertable[],
              db.constraint("r4b_string_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(ctx.db);

          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Parameters of type '${parameter.type}' are not yet supported.`,
        ),
      );
  }
}

async function removeIndices<Version extends FHIR_VERSION>(
  ctx: FHIRServerCTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
) {
  await Promise.all(
    param_types_supported.map((type) => {
      return db.sql<
        | s.r4_number_idx.SQL
        | s.r4_string_idx.SQL
        | s.r4_uri_idx.SQL
        | s.r4_date_idx.SQL
        | s.r4_token_idx.SQL
        | s.r4_reference_idx.SQL
        | s.r4_quantity_idx.SQL
        | s.r4b_number_idx.SQL
        | s.r4b_string_idx.SQL
        | s.r4b_uri_idx.SQL
        | s.r4b_date_idx.SQL
        | s.r4b_token_idx.SQL
        | s.r4b_reference_idx.SQL
        | s.r4b_quantity_idx.SQL
      >`DELETE FROM ${searchParameterToTableName(fhirVersion, type)} WHERE ${{
        r_id: resource.id,
      }}`.run(ctx.db);
    }),
  );
}

function resourceIsValidForIndexing<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
): resource is Resource<Version, AllResourceTypes> & {
  id: id;
  meta: { versionId: id };
} {
  if (
    !resource.id ||
    (!resource.meta?.versionId &&
      isNaN(parseInt(resource.meta?.versionId || "")))
  ) {
    return false;
  }
  return true;
}

async function indexResource<
  CTX extends FHIRServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
) {
  await removeIndices(ctx, fhirVersion, resource);
  const searchParameters = await getAllParametersForResource(ctx, fhirVersion, [
    resource.resourceType as ResourceType<Version>,
  ]);
  await Promise.all(
    searchParameters.map((searchParameter) => {
      if (searchParameter.expression === undefined) return;
      const evaluation = evaluateWithMeta(
        searchParameter.expression,
        resource,
        {
          meta: {
            fhirVersion,
            getSD: (fhirVersion, type: uri) => {
              const canonicalURL = ctx.resolveTypeToCanonical(
                fhirVersion,
                type,
              );
              if (!canonicalURL)
                throw new OperationError(
                  outcomeFatal(
                    "exception",
                    `Could not resolve canonical url for type '${type}'`,
                  ),
                );
              return ctx.resolveCanonical(
                fhirVersion,
                "StructureDefinition",
                canonicalURL,
              );
            },
          },
        },
      );

      if (!resourceIsValidForIndexing(fhirVersion, resource)) {
        throw new OperationError(
          outcomeFatal(
            "exception",
            "Resource id or versionId not found when indexing the resource.",
          ),
        );
      }
      return indexSearchParameter(
        ctx,
        fhirVersion,
        searchParameter,
        resource,
        evaluation,
      );
    }),
  );
}

async function createResource<
  CTX extends FHIRServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
): Promise<Resource<Version, AllResourceTypes>> {
  return FHIRTransaction(ctx, db.IsolationLevel.ReadCommitted, async (ctx) => {
    const data: s.resources.Insertable = {
      tenant: ctx.tenant,
      fhir_version: toDBFHIRVersion(fhirVersion),
      request_method: "POST",
      author_id: ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_ID],
      author_type: ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_TYPE],
      resource: resource as unknown as db.JSONObject,
      
    };
    // the <const> prevents generalization to string[]
    const resourceCol = <const>["resource"];
    type ResourceReturn = s.resources.OnlyCols<typeof resourceCol>;
    const res = await db.sql<s.resources.SQL, ResourceReturn[]>`
    INSERT INTO ${"resources"}(${db.cols(data)}) VALUES(${db.vals(
      data,
    )}) RETURNING ${db.cols(resourceCol)}
    `.run(ctx.db);

    await indexResource(
      ctx,
      fhirVersion,
      res[0].resource as unknown as Resource<Version, AllResourceTypes>,
    );
    return res[0].resource as unknown as Resource<Version, AllResourceTypes>;
  });
}

async function getResourceById<Version extends FHIR_VERSION>(
  ctx: FHIRServerCTX,
  fhirVersion: Version,
  id: string,
): Promise<Resource<Version, AllResourceTypes> | undefined> {
  const latestCols = <const>["resource", "deleted"];
  type ResourceReturn = s.resources.OnlyCols<typeof latestCols>;
  const getLatestVersionSQLFragment = db.sql<s.resources.SQL, ResourceReturn[]>`
    SELECT ${db.cols(latestCols)} FROM ${"resources"} WHERE ${{
      tenant: ctx.tenant,
      id: id,
      fhir_version: toDBFHIRVersion(fhirVersion),
    }} ORDER BY ${"version_id"} DESC LIMIT 1
  `;

  const res = await db.sql<s.resources.SQL, s.resources.Selectable[]>`
  SELECT * FROM (${getLatestVersionSQLFragment}) as t WHERE t.deleted = false
  `.run(ctx.db);

  return res[0]?.resource as unknown as Resource<Version, AllResourceTypes> | undefined;
}

async function getResource<Version extends FHIR_VERSION, Type extends ResourceType<Version>>(
  ctx: FHIRServerCTX,
  fhirVersion: Version,
  resourceType: Type,
  id: string,
): Promise<Resource<Version, Type>> {
  const resource = await getResourceById(ctx, fhirVersion, id);
  if(resource === undefined || resource.resourceType !== resourceType){
    throw new OperationError(
      outcomeError(
        "not-found",
        `'${resourceType}' with id '${id}' was not found`,
      ),
    );
  }

  return resource as Resource<Version, Type>;
}

async function getVersionedResource<Version extends FHIR_VERSION>(  ctx: FHIRServerCTX,
  fhirVersion: Version,
  resourceType: ResourceType<Version>,
  id: string,
versionId: string){
  const res = await db.select("resources", {
    tenant: ctx.tenant,
    resource_type: resourceType,
    id: id,
    version_id: parseInt(versionId),
    fhir_version: toDBFHIRVersion(fhirVersion),
  }).run(ctx.db);

  if (res.length === 0) {
    throw new OperationError(
      outcomeError(
        "not-found",
        `'${resourceType}' with id '${id}' was not found`,
      ),
    );
  }

  return res[0].resource as unknown as Resource<Version, AllResourceTypes>;
}

const validHistoryParameters = ["_count", "_since", "_since-version"]; // "_at", "_list"]
function processHistoryParameters(
  parameters: ParsedParameter<string | number>[],
): s.resources.Whereable {
  const sqlParams: s.resources.Whereable = {};
  const _since = parameters.find((p) => p.name === "_since");
  const _since_versionId = parameters.find((p) => p.name === "_since-version");

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
    sqlParams["created_at"] = db.sql`${db.self} >= ${db.param(
      dayjs(_since.value[0], "YYYY-MM-DDThh:mm:ss+zz:zz").toDate(),
    )}`;
  }

  if (_since_versionId?.value[0]) {
    sqlParams["version_id"] = db.sql`${db.self} > ${db.param(
      parseInt(_since_versionId.value[0].toString()),
    )}`;
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
        resource_type: request.resourceType,
        id: request.id,
      };
    }
    case "type": {
      return {
        resource_type: request.resourceType,
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
  CTX extends FHIRServerCTX,
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
  }} ORDER BY ${"version_id"} DESC LIMIT ${db.param(limit)}`;

  const history = await historySQL.run(ctx.db);



  const resourceHistory = history.map((row) => {
    const resource = row.resource as unknown as Resource<Version, AllResourceTypes>
    return ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resource: resource as any,
      fullUrl: fullUrl(fhirVersion, ctx.tenant, `${(resource).resourceType}/${resource.id}`),
      request: {
        url: `resource.resourceType}/${resource.id}` as uri,
        method: row.request_method as code,
      },
      response: {
        location: `resource.resourceType}/${resource.id}` as uri,
        status: "200",
        etag: resource.meta?.versionId as id,
        lastModified: resource.meta?.lastUpdated 
      }
    })
  });

  return resourceHistory;
}

async function patchResource<Version extends FHIR_VERSION>(
  ctx: FHIRServerCTX,
  fhirVersion: Version,
  resourceType: ResourceType<Version>,
  id: string,
  patches: Operation[],
): Promise<Resource<Version, AllResourceTypes>> {
  return FHIRTransaction(ctx, db.IsolationLevel.Serializable, async (ctx) => {
    const existingResource = await getResource(
      ctx,
      fhirVersion,
      resourceType,
      id,
    );

    try {
      const newResource = jsonpatch.applyPatch(existingResource, patches, true, false)
        .newDocument as Resource<Version, AllResourceTypes>;

      const outcome = await validateResource(ctx, fhirVersion, resourceType, {
        resource: newResource,
      });

      // Need to revaluate post application of patch to ensure that the resource is still valid.
      if (
        outcome.issue.filter(
          (i) => i.severity === "error" || i.severity === "fatal",
        ).length > 0
      ) {
        throw new OperationError(outcome);
      }

      if (newResource.id !== existingResource.id) {
        newResource.id = existingResource.id;
      }

      const data: s.resources.Insertable = {
        tenant: ctx.tenant,
        fhir_version: toDBFHIRVersion(fhirVersion),
        request_method: "PATCH",
        author_id: ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_ID],
        author_type: ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_TYPE],
        resource: newResource as unknown as db.JSONObject,
        prev_version_id: parseInt(existingResource.meta?.versionId as string),
        patches: JSON.stringify(patches),
      };

      const resourceCol = <const>["resource"];
      type ResourceReturn = s.resources.OnlyCols<typeof resourceCol>;
      const res = await db.sql<s.resources.SQL, ResourceReturn[]>`
        INSERT INTO ${"resources"}(${db.cols(data)}) VALUES(${db.vals(
          data,
        )}) RETURNING ${db.cols(resourceCol)}`.run(ctx.db);

      const patchedResource = res[0].resource as unknown as Resource<
        Version,
        AllResourceTypes
      >;

      await indexResource(ctx, fhirVersion, patchedResource);
      return patchedResource;
    } catch (e) {
      if (isOperationError(e)) throw e;
      else {
        ctx.logger.error(e);
        throw new OperationError(
          outcomeError(
            "structure",
            `Patch could not be applied to the given resource '${resourceType}/${id}'`,
          ),
        );
      }
    }
  });
}

async function updateResource<
  CTX extends FHIRServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
): Promise<Resource<Version, AllResourceTypes>> {
  return FHIRTransaction(ctx, db.IsolationLevel.Serializable, async (ctx) => {
    if (!resource.id)
      throw new OperationError(
        outcomeError("invalid", "Resource id not found on resource"),
      );

    const existingResource = await getResourceById(
      ctx,
      fhirVersion,
      resource.id,
    );

    if(existingResource && existingResource.resourceType !== resource.resourceType){
      throw new OperationError(
        outcomeError(
          "invalid",
          `'${existingResource.resourceType}' is not the same as '${resource.resourceType}'`,
        ),
      );
    }

    // https://hl7.org/fhir/R4/http.html#upsert
    // Allow clients to define their own ids.
    // Necessary for certain external test suites.
    // Note we automatically set id to be the request.id from update.
    
    if(!existingResource){
      ctx.logger.warn({message: "Resource not found. Creating new resource with id.", id: resource.id});
    }

    const data: s.resources.Insertable = {
      tenant: ctx.tenant,
      fhir_version: toDBFHIRVersion(fhirVersion),
      request_method: "PUT",
      author_id: ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_ID],
      author_type: ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_TYPE],
      resource: resource as unknown as db.JSONObject,
      prev_version_id: existingResource ? parseInt(existingResource.meta?.versionId as string) : undefined,
      // [TODO] probably uneccessary to insert this and can instead derive in case of syncing.
      patches: JSON.stringify([{ op: "replace", path: "", value: resource }]),
    };

    const res = await db.insert("resources", data, {returning: ["resource"]}).run(ctx.db);

    const updatedResource = res.resource as unknown as Resource<
      Version,
      AllResourceTypes
    >;

    await indexResource(ctx, fhirVersion, updatedResource);

    return updatedResource;
  });
}

async function deleteResource<
  CTX extends FHIRServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resourceType: ResourceType<Version>,
  id: string,
) {
  return FHIRTransaction(ctx, db.IsolationLevel.RepeatableRead, async (ctx) => {
    const resource = await getResource(ctx, fhirVersion, resourceType, id);
    if (!resource)
      throw new OperationError(
        outcomeError(
          "not-found",
          `'${resourceType}' with id '${id}' was not found`,
        ),
      );

    const data: s.resources.Insertable = {
      tenant: ctx.tenant,
      fhir_version: toDBFHIRVersion(fhirVersion),
      request_method: "DELETE",
      author_id: ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_ID],
      author_type: ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_TYPE],
      resource: resource as unknown as db.JSONObject,
      prev_version_id: parseInt(resource.meta?.versionId as string),
      deleted: true,
    };

    const resourceCol = <const>["resource"];
    type ResourceReturn = s.resources.OnlyCols<typeof resourceCol>;

    const deleteResource = await db.sql<s.resources.SQL, ResourceReturn[]>`
      INSERT INTO ${"resources"}(${db.cols(data)}) VALUES(${db.vals(
        data,
      )}) RETURNING ${db.cols(resourceCol)}`;

    await deleteResource.run(ctx.db);
    await removeIndices(ctx, fhirVersion, resource);
  });
}

async function conditionalDelete(ctx: FHIRServerCTX, searchRequest:R4TypeSearchRequest | R4BTypeSearchRequest | R4SystemSearchRequest | R4BSystemSearchRequest) {
  const limit = parseInt(process.env.FHIR_DELETE_CONDITIONAL_LIMIT ?? "20");
  searchRequest.parameters = [...searchRequest.parameters.filter(p => p.name !== "_total" && p.name !== "_count"), 
    {"name": "_total", value: ["accurate"]},
    {"name": "_count", value: [limit]}
  ];

  const result = await executeSearchQuery(ctx.db, ctx, searchRequest);

  if((result.total ?? limit+1) > limit) 
    throw new OperationError(outcomeError("too-costly", "The operation is too costly to perform."))
  
  for(const resource of result.resources){
    await deleteResource(
      ctx,
      searchRequest.fhirVersion,
      resource.resourceType,
      resource.id as id,
    );
  }

  switch(searchRequest.level){
    case "type":{
      switch(searchRequest.fhirVersion){
        case R4:
        case R4B:{
          return {
            fhirVersion: searchRequest.fhirVersion,
            type: "delete-response",
            level: "type",
            resourceType: searchRequest.resourceType,
          } as FHIRResponse;
        }
        default: {
          throw new OperationError(outcomeError("not-supported", `Unknown FHIR version.`));
        }
      }
    }
    case "system":{
      return {
        fhirVersion: searchRequest.fhirVersion,
        type: "delete-response",
        level: "system",
      } as FHIRResponse;
    }
  }
}



function createPostgresMiddleware<
  State extends {
    transaction_entry_limit: number;
  },
  CTX extends FHIRServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (context) => {
      switch (context.request.type) {
        case "read-request": {
          const resource = await getResource(
            context.ctx,
            context.request.fhirVersion,
            context.request.resourceType,
            context.request.id,
          );
          return {
            state: context.state,
            ctx: context.ctx,
            request: context.request,
            response: {
              fhirVersion: context.request.fhirVersion,
              level: "instance",
              type: "read-response",
              resourceType: context.request.resourceType,
              id: context.request.id,
              body: resource,
            } as FHIRResponse,
          };
        }
        case "vread-request": {
          const resource = await getVersionedResource(
            context.ctx,
            context.request.fhirVersion,
            context.request.resourceType,
            context.request.id,
            context.request.versionId,
          );

          return {
            state: context.state,
            ctx: context.ctx,
            request: context.request,
            response: {
              fhirVersion: context.request.fhirVersion,
              level: "instance",
              type: "vread-response",
              resourceType: context.request.resourceType,
              id: context.request.id,
              versionId: context.request.versionId,
              body: resource,
            } as FHIRResponse,
          };

        }
        case "search-request": {
          const result = await executeSearchQuery(
            context.ctx.db,
            context.ctx,
            context.request,
          );
          switch (context.request.level) {
            case "system": {
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
                  fhirVersion: context.request.fhirVersion,
                  type: "search-response",
                  parameters: context.request.parameters,
                  level: "system",
                  body: {
                    total: result.total as unsignedInt | undefined,
                    resourceType: "Bundle",
                    type: "searchset",
                    entry: result.resources.map(r => fhirResourceToBundleEntry(context.request.fhirVersion, context.ctx.tenant, r))
                  },
                } as FHIRResponse,
              };
            }
            case "type": {
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
                  fhirVersion: context.request.fhirVersion,
                  type: "search-response",
                  parameters: context.request.parameters,
                  level: "type",
                  resourceType: context.request.resourceType,
                  body: {
                    total: result.total as unsignedInt | undefined,
                    resourceType: "Bundle",
                    type: "searchset",
                    entry: result.resources.map(r => fhirResourceToBundleEntry(context.request.fhirVersion, context.ctx.tenant, r))
                  },
                } as FHIRResponse,
              };
            }
            default: {
              throw new Error("Invalid search level");
            }
          }
        }
        case "create-request": {
          const savedResource = await createResource(
            context.ctx,
            context.request.fhirVersion,
            {
              ...context.request.body,
              // If the id is allowed to be set, use the id from the request body, otherwise generate a new id.
              id: context.request.allowIdSet
                ? context.request.body.id ?? generateId()
                : generateId(),
            },
          );

          return {
            request: context.request,
            state: context.state,
            ctx: context.ctx,
            response: {
              fhirVersion: R4,
              level: "type",
              resourceType: context.request.resourceType,
              type: "create-response",
              body: savedResource,
            } as FHIRResponse,
          };
        }

        case "patch-request": {
          const savedResource = await patchResource(
            context.ctx,
            context.request.fhirVersion,
            context.request.resourceType,
            context.request.id,
            context.request.body as Operation[],
          );

          return {
            request: context.request,
            state: context.state,
            ctx: context.ctx,
            response: {
              fhirVersion: R4,
              level: "instance",
              resourceType: context.request.resourceType,
              id: context.request.id,
              type: "patch-response",
              body: savedResource,
            } as FHIRResponse,
          };
        }
        case "update-request": {
          const savedResource = await updateResource(
            context.ctx,
            context.request.fhirVersion,
            // Set the id for the request body to ensure that the resource is updated correctly.
            // Should be pased on the request.id and request.resourceType
            {
              ...context.request.body,
              id: context.request.id,
            },
          );

          return {
            request: context.request,
            state: context.state,
            ctx: context.ctx,
            response: {
              fhirVersion: context.request.fhirVersion,
              level: "instance",
              resourceType: context.request.resourceType,
              id: context.request.id,
              type: "update-response",
              body: savedResource,
            } as FHIRResponse,
          };
        }
        case "delete-request": {
          switch(context.request.level){
            case "instance": {
              await deleteResource(
                context.ctx,
                context.request.fhirVersion,
                context.request.resourceType,
                context.request.id,
              );
    
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
                  fhirVersion: context.request.fhirVersion,
                  type: "delete-response",
                  level: "instance",
                  resourceType: context.request.resourceType,
                  id: context.request.id,
                } as FHIRResponse,
              };
            }
            case "type": {
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: await conditionalDelete(context.ctx, {
                  type: "search-request",
                  fhirVersion: context.request.fhirVersion,
                  level: "type",
                  resourceType: context.request.resourceType,
                  parameters: context.request.parameters,
                } as R4BTypeSearchRequest | R4TypeSearchRequest)
              }
            }
            case "system": {
              return {
                  request: context.request,
                  state: context.state,
                  ctx: context.ctx,
                  response: await conditionalDelete(context.ctx, {
                    type: "search-request",
                    fhirVersion: context.request.fhirVersion,
                    level: "system",
                    parameters: context.request.parameters,
                  } as R4BSystemSearchRequest | R4SystemSearchRequest)
              };
            }
            default: {
              throw new OperationError(outcomeError("not-supported", `Invalid level.`));
            }
          }
        }

        case "history-request": {
          const history = await getHistory(
            context.ctx,
            context.request.fhirVersion,
            historyLevelFilter(context.request),
            context.request.parameters || [],
          );

          switch (context.request.level) {
            case "instance": {
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
                  fhirVersion: context.request.fhirVersion,
                  type: "history-response",
                  level: "instance",
                  resourceType: context.request.resourceType,
                  id: context.request.id,
                  body: {
                    resourceType: "Bundle",
                    type: "history",
                    entry: history
                  },
                } as FHIRResponse,
              };
            }
            case "type": {
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
                  fhirVersion: context.request.fhirVersion,
                  type: "history-response",
                  level: "type",
                  resourceType: context.request.resourceType,
                  body: {
                    resourceType: "Bundle",
                    type: "history",
                    entry: history
                  },
                } as FHIRResponse,
              };
            }
            case "system": {
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
                  fhirVersion: context.request.fhirVersion,
                  type: "history-response",
                  level: "system",
                  body: {
                    resourceType: "Bundle",
                    type: "history",
                    entry: history
                  },
                } as FHIRResponse,
              };
            }
            default: {
              throw new OperationError(
                outcomeError("invalid", "Invalid history level"),
              );
            }
          }
        }

        case "transaction-request": {
          let transactionBundle = context.request.body;
          const { locationsToUpdate, order } = buildTransactionTopologicalGraph(
            context.ctx,
            context.request.fhirVersion,
            transactionBundle,
          );
          if (
            (transactionBundle.entry || []).length >
            context.state.transaction_entry_limit
          ) {
            throw new OperationError(
              outcomeError(
                "invalid",
                `Transaction bundle only allowed to have '${
                  context.state.transaction_entry_limit
                }' entries. Current bundle has '${
                  (transactionBundle.entry || []).length
                }'`,
              ),
            );
          }
          const responseEntries = [
            ...new Array((transactionBundle.entry || []).length),
          ];

          return FHIRTransaction(
            context.ctx,
            db.IsolationLevel.RepeatableRead,
            async (ctx: FHIRServerCTX) => {
              for (const index of order) {
                const entry = transactionBundle.entry?.[parseInt(index)];
                if (!entry)
                  throw new OperationError(
                    outcomeFatal(
                      "exception",
                      "invalid entry in transaction processing.",
                    ),
                  );

                if (!entry.request?.method) {
                  throw new OperationError(
                    outcomeError(
                      "invalid",
                      `No request.method found at index '${index}'`,
                    ),
                  );
                }
                if (!entry.request?.url) {
                  throw new OperationError(
                    outcomeError(
                      "invalid",
                      `No request.url found at index '${index}'`,
                    ),
                  );
                }

                const fhirRequest = httpRequestToFHIRRequest(
                  context.request.fhirVersion,
                  {
                    url: entry.request?.url || "",
                    method: entry.request?.method,
                    body: entry.resource,
                  },
                );

                const fhirResponse = await ctx.client.request(ctx, fhirRequest);

                const responseEntry = fhirResponseToBundleEntry(ctx.tenant, fhirResponse);
                responseEntries[parseInt(index)] = responseEntry;
                // Generate patches to update the transaction references.
                const patches = entry.fullUrl
                  ? (locationsToUpdate[entry.fullUrl] || []).map(
                      (loc): Operation => {
                        if (!responseEntry.response?.location)
                          throw new OperationError(
                            outcomeFatal(
                              "exception",
                              "response location not found during transaction processing",
                            ),
                          );
                        return {
                          path: `/${loc.join("/")}`,
                          op: "replace",
                          value: {
                            reference: responseEntry.response?.location,
                          },
                        };
                      },
                    )
                  : [];

                // End of loop and operation
                // Now update transaction bundle with applied references.
                transactionBundle = jsonpatch.applyPatch(
                  transactionBundle,
                  patches,
                ).newDocument;
              }

              const transactionResponse: Resource<
                typeof context.request.fhirVersion,
                "Bundle"
              > = {
                resourceType: "Bundle",
                type: "transaction-response" as code,
                entry: responseEntries,
              };

              return {
                state: context.state,
                ctx: context.ctx,
                request: context.request,
                response: {
                  fhirVersion: context.request.fhirVersion,
                  type: "transaction-response",
                  level: "system",
                  body: transactionResponse,
                } as FHIRResponse,
              };
            },
          );
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Requests of type '${context.request.type}' are not yet supported`,
            ),
          );
        }
      }
    },
  ]);
}

export function createPostgresClient<CTX extends FHIRServerCTX>(
  { transaction_entry_limit }: { transaction_entry_limit: number } = {
    transaction_entry_limit: 20,
  },
): FHIRClient<CTX> {
  return new AsynchronousClient<{ transaction_entry_limit: number }, CTX>(
    { transaction_entry_limit },
    createPostgresMiddleware(),
  );
}
