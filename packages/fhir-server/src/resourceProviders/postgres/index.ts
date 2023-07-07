import pg from "pg";
import { v4 } from "uuid";
import jsonpatch, { Operation } from "fast-json-patch";

import { FHIRURL, ParsedParameter } from "@genfhi/fhir-query";
import {
  Address,
  HumanName,
  Resource,
  ResourceType,
  SearchParameter,
} from "@genfhi/fhir-types/r4/types";
import { evaluateWithMeta } from "@genfhi/fhirpath";

import { FHIRServerCTX } from "../../fhirServer.js";
import { FHIRClientAsync } from "../../client/interface";
import { AsynchronousClient } from "../../client/index.js";
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "../../client/middleware/index.js";
import { MetaValueSingular } from "@genfhi/meta-value";
import { SystemSearchRequest, TypeSearchRequest } from "../../client/types";

function searchResources(
  resourceType?: ResourceType
): (ResourceType | string)[] {
  const searchTypes = ["Resource", "DomainResource"];
  if (resourceType) {
    searchTypes.push(resourceType);
  }
  return searchTypes;
}

async function getAllParametersForResource<CTX extends FHIRServerCTX>(
  ctx: CTX,
  resourceType?: ResourceType,
  names?: string[]
): Promise<SearchParameter[]> {
  let parameters: FHIRURL = {
    resourceType: "SearchParameter",
    parameters: {
      type: {
        name: "type",
        value: ["string"],
      },
      base: {
        name: "base",
        value: searchResources(resourceType),
      },
    },
  };
  if (names) {
    parameters = {
      ...parameters,
      parameters: {
        ...parameters.parameters,
        name: { name: "name", value: names },
      },
    };
  }

  return await ctx.database.search_type(ctx, "SearchParameter", parameters);
}
// ---------------------------------------------------------
// [DATA TYPE CONVERSIONS]
// ---------------------------------------------------------
// https://hl7.org/fhir/r4/search.html#table
// ---------------------------------------------------------

function toStringParameters(
  value: MetaValueSingular<NonNullable<unknown>>
): string[] {
  switch (value.meta()?.type) {
    case "string": {
      return [value.valueOf() as string];
    }
    case "HumanName": {
      const humanName = value.valueOf() as HumanName;
      return [
        humanName.text ? [humanName.text] : [],
        humanName.family ? [humanName.family] : [],
        humanName.given ? humanName.given : [],
        humanName.prefix ? humanName.prefix : [],
        humanName.suffix ? humanName.suffix : [],
      ].flat();
    }
    case "Address": {
      const address = value.valueOf() as Address;
      return [
        address.text ? [address.text] : [],
        address.line ? address.line : [],
        address.city ? [address.city] : [],
        address.district ? [address.district] : [],
        address.state ? [address.state] : [],
        address.postalCode ? [address.postalCode] : [],
        address.country ? [address.country] : [],
      ].flat();
    }
    default:
      throw new Error(`Unknown string parameter '${value.meta()?.type}}'`);
  }
}

async function indexSearchParameter<CTX extends FHIRServerCTX>(
  client: pg.Client,
  ctx: CTX,
  parameter: SearchParameter,
  resource: Resource,
  evaluation: MetaValueSingular<NonNullable<unknown>>[]
) {
  switch (parameter.type) {
    case "string":
      await Promise.all(
        evaluation
          .map(toStringParameters)
          .flat()
          .map(async (value) => {
            client.query(
              "INSERT INTO search_string(workspace, r_id, r_version_id, parameter_name, parameter_url, value) VALUES($1, $2, $3, $4, $5, $6)",
              [
                ctx.workspace,
                resource.id,
                resource.meta?.versionId,
                parameter.name,
                parameter.url,
                value,
              ]
            );
          })
      );
      return;
    default:
      throw new Error(`Not implemented '${parameter.type}'`);
  }
}

async function removeIndices(
  client: pg.Client,
  _ctx: FHIRServerCTX,
  resource: Resource
) {
  await client.query("DELETE FROM search_string WHERE r_id = $1", [
    resource.id,
  ]);
}

async function indexResource<CTX extends FHIRServerCTX>(
  client: pg.Client,
  ctx: CTX,
  resource: Resource
) {
  await removeIndices(client, ctx, resource);
  const searchParameters = await getAllParametersForResource(
    ctx,
    resource.resourceType
  );
  for (const searchParameter of searchParameters) {
    if (searchParameter.expression === undefined) continue;
    const evaluation = evaluateWithMeta(searchParameter.expression, resource, {
      meta: { getSD: (type: string) => ctx.resolveSD(ctx, type) },
    });
    indexSearchParameter(client, ctx, searchParameter, resource, evaluation);
  }
}

async function saveResource<CTX extends FHIRServerCTX>(
  client: pg.Client,
  ctx: CTX,
  resource: Resource
): Promise<Resource> {
  try {
    await client.query("BEGIN");
    const queryText =
      "INSERT INTO resources(workspace, author, resource) VALUES($1, $2, $3) RETURNING resource";
    const res = await client.query(queryText, [
      ctx.workspace,
      ctx.author,
      resource,
    ]);
    await indexResource(client, ctx, res.rows[0].resource as Resource);
    await client.query("COMMIT");
    return res.rows[0].resource as Resource;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    // Finally
    // client.release() when switching to pool
  }
}

async function getResource<CTX extends FHIRServerCTX>(
  client: pg.Client,
  ctx: CTX,
  resourceType: ResourceType,
  id: string
): Promise<Resource> {
  const queryText =
    "SELECT resource FROM resources WHERE workspace = $1 AND resource_type = $2 AND id = $3 ORDER BY version_id DESC LIMIT 1";
  const res = await client.query(queryText, [ctx.workspace, resourceType, id]);
  console.log(res);
  if (res.rows.length === 0) {
    throw new Error(`Resource not found`);
  }
  return res.rows[0].resource as Resource;
}

async function patchResource<CTX extends FHIRServerCTX>(
  client: pg.Client,
  ctx: CTX,
  resourceType: ResourceType,
  id: string,
  patches: Operation[]
): Promise<Resource> {
  try {
    await client.query("BEGIN");
    const resource = await getResource(client, ctx, resourceType, id);
    // [TODO] CHECK VALIDATION
    const newResource = jsonpatch.applyPatch(resource, patches)
      .newDocument as Resource;
    if (
      newResource.resourceType !== resource.resourceType ||
      newResource.id !== resource.id
    ) {
      throw new Error("Invalid Patch");
    }
    const queryText =
      "INSERT INTO resources(workspace, author, resource, prev_version_id, patches) VALUES($1, $2, $3, $4, $5) RETURNING resource";
    const res = await client.query(queryText, [
      ctx.workspace,
      ctx.author,
      newResource,
      resource.meta?.versionId,
      JSON.stringify(patches),
    ]);
    await indexResource(client, ctx, res.rows[0].resource as Resource);
    await client.query("COMMIT");
    return res.rows[0].resource as Resource;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    // Finally
    // client.release() when switching to pool
  }
}

function buildParameters(
  search_parameters: SearchParameter[],
  parameters: ParsedParameter<string | number>[],
  index: number,
  values: any[]
): { index: number; query: string; values: any[] } {
  let query = [];
  let i = 0;
  for (let parameter of parameters) {
    const searchParameter = search_parameters.find(
      (p) => p.name === parameter.name
    );
    if (searchParameter === undefined)
      throw new Error(`Unknown parameter '${parameter.name}'`);
    const search_table = `search_${searchParameter.type}`;
    const alias = `${searchParameter.type}${i++}`;
    const paramJoin = `JOIN ${search_table} ${alias} on ${alias}.r_version_id=resources.version_id AND ${alias}.parameter_url= $${index++}`;
    values = [...values, searchParameter.url];

    let parameterClause = parameter.value
      .map((value) => `${alias}.value = $${index++}`)
      .join(" OR ");
    values = [...values, ...parameter.value];

    query.push(
      `${paramJoin} ${
        parameter.value.length > 0 ? "AND" : ""
      } ${parameterClause}`
    );
  }
  return { index, query: query.join("\n"), values };
}

async function executeSearchQuery(
  client: pg.Client,
  request: SystemSearchRequest | TypeSearchRequest,
  ctx: FHIRServerCTX
): Promise<Resource[]> {
  let values: any[] = [];
  let index = 1;
  const searchParameters = await getAllParametersForResource(
    ctx,
    request.level === "type"
      ? (request.resourceType as ResourceType)
      : undefined,
    Object.keys(request.query.parameters)
  );

  const parameters = Object.values(request.query.parameters);
  let parameterQuery = buildParameters(
    searchParameters,
    parameters,
    index,
    values
  );

  values = parameterQuery.values;
  index = parameterQuery.index;

  let queryText = `
     SELECT DISTINCT resources.resource
     FROM resources 
     ${parameterQuery.query}
     WHERE 
  `;

  if (request.level === "type") {
    values.push(request.resourceType);
    queryText = `${queryText} resources.resource_type = $${index++}`;
  } else {
    queryText = `${queryText} resources.resource_type is not null`;
  }

  console.log(queryText, values);

  const res = await client.query(queryText, values);
  return res.rows.map((row) => row.resource) as Resource[];
}

function createPostgresMiddleware<
  State extends { client: pg.Client },
  CTX extends FHIRServerCTX
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (request, args, next) => {
      const client = args.state.client;
      switch (request.type) {
        case "read-request": {
          const resource = await getResource(
            client,
            args.ctx,
            request.resourceType as ResourceType,
            request.id
          );
          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              level: "instance",
              type: "read-response",
              resourceType: request.resourceType,
              id: request.id,
              body: resource,
            },
          };
        }
        case "search-request": {
          const result = await executeSearchQuery(client, request, args.ctx);
          switch (request.level) {
            case "system": {
              return {
                state: args.state,
                ctx: args.ctx,
                response: {
                  type: "search-response",
                  query: request.query,
                  level: "system",
                  body: result,
                },
              };
            }
            case "type": {
              return {
                state: args.state,
                ctx: args.ctx,
                response: {
                  type: "search-response",
                  query: request.query,
                  level: "type",
                  resourceType: request.resourceType,
                  body: result,
                },
              };
            }
          }
        }
        case "create-request":
          const savedResource = await saveResource(client, args.ctx, {
            ...request.body,
            id: v4(),
          });
          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              level: "type",
              resourceType: request.resourceType,
              type: "create-response",
              body: savedResource,
            },
          };
        case "patch-request":
          throw new Error("Not implemented");
        case "update-request": {
          const savedResource = await patchResource(
            client,
            args.ctx,
            request.resourceType as ResourceType,
            request.id,
            [{ op: "replace", path: "", value: request.body }]
          );
          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              level: "instance",
              resourceType: request.resourceType,
              id: request.id,
              type: "update-response",
              body: savedResource,
            },
          };
        }
        default:
          throw new Error(`Not implemented ${request.type}`);
      }
    },
  ]);
}

export function createPostgresClient<CTX extends FHIRServerCTX>(
  config: pg.ClientConfig
): FHIRClientAsync<CTX> {
  const client = new pg.Client(config);
  client.connect();
  return new AsynchronousClient<{ client: pg.Client }, CTX>(
    { client: client },
    createPostgresMiddleware()
  );
}
