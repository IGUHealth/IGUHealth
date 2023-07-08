import pg from "pg";
import { v4 } from "uuid";
import jsonpatch, { Operation } from "fast-json-patch";

import { FHIRURL, ParsedParameter } from "@genfhi/fhir-query";
import {
  Address,
  CodeableConcept,
  Coding,
  ContactPoint,
  HumanName,
  Identifier,
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
import { descend, MetaValueArray, MetaValueSingular } from "@genfhi/meta-value";
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

const param_types_supported = ["string", "number", "token"];

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
        value: param_types_supported,
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

// Coding	Coding.system	Coding.code
// CodeableConcept	CodeableConcept.coding.system	CodeableConcept.coding.code	Matches against any coding in the CodeableConcept
// Identifier	Identifier.system	Identifier.value	Clients can search by type not system using the :of-type modifier, see below. To search on a CDA II.root - which may appear in either Identifier.system or Identifier.value, use the syntax identifier=|[root],[root]
// ContactPoint		ContactPoint.value	At the discretion of the server, token searches on ContactPoint may use special handling, such as ignoring punctuation, performing partial searches etc.
// code	(implicit)	code	the system is defined in the value set (though it's not usually needed)
// boolean		boolean	The implicit system for boolean values is http://hl7.org/fhir/special-values but this is never actually used
// uri		uri
// string	n/a	string	Token is sometimes used for string to indicate that exact matching is the correct default search strategy

function toTokenParameters(
  value: MetaValueSingular<NonNullable<unknown>>
): Array<{ system?: string; code?: string }> {
  switch (value.meta()?.type) {
    case "Coding": {
      const coding: Coding = value.valueOf() as CodeableConcept;
      return [{ system: coding.system, code: coding.code }];
    }
    case "CodeableConcept": {
      const codings = descend(value, "coding");
      if (codings instanceof MetaValueArray) {
        return codings.toArray().map(toTokenParameters).flat();
      }
      return [];
    }
    case "Identifier": {
      const identifier: Identifier = value.valueOf() as Identifier;
      return [{ system: identifier.system, code: identifier.value }];
    }
    case "ContactPoint": {
      const contactPoint: ContactPoint = value.valueOf() as ContactPoint;
      return [{ code: contactPoint.value }];
    }
    case "code": {
      return [{ code: value.valueOf() as string }];
    }
    case "boolean": {
      return [
        {
          system: "http://hl7.org/fhir/special-values",
          code: (value.valueOf() as boolean).toString(),
        },
      ];
    }
    case "http://hl7.org/fhirpath/System.String":
    case "string": {
      return [
        {
          code: (value.valueOf() as string).toString(),
        },
      ];
    }
    default:
      throw new Error(
        `Unknown token parameter of type '${value.meta()?.type}'`
      );
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
    case "token": {
      evaluation
        .map(toTokenParameters)
        .flat()
        .map(async (value) => {
          client.query(
            "INSERT INTO token_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, system, value) VALUES($1, $2, $3, $4, $5, $6, $7)",
            [
              ctx.workspace,
              resource.id,
              resource.meta?.versionId,
              parameter.name,
              parameter.url,
              value.system,
              value.code,
            ]
          );
        });
      return;
    }
    case "number": {
      await Promise.all(
        evaluation.map(async (value) => {
          client.query(
            "INSERT INTO number_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, value) VALUES($1, $2, $3, $4, $5, $6)",
            [
              ctx.workspace,
              resource.id,
              resource.meta?.versionId,
              parameter.name,
              parameter.url,
              value.valueOf(),
            ]
          );
        })
      );
      return;
    }

    case "string": {
      await Promise.all(
        evaluation
          .map(toStringParameters)
          .flat()
          .map(async (value) => {
            client.query(
              "INSERT INTO string_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, value) VALUES($1, $2, $3, $4, $5, $6)",
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
    }
    default:
      throw new Error(`Not implemented '${parameter.type}'`);
  }
}

async function removeIndices(
  client: pg.Client,
  _ctx: FHIRServerCTX,
  resource: Resource
) {
  await Promise.all(
    param_types_supported.map((type) => {
      return client.query(`DELETE FROM ${type}_idx WHERE r_id = $1`, [
        resource.id,
      ]);
    })
  );
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
    const search_table = `${searchParameter.type}_idx`;
    const alias = `${searchParameter.type}${i++}`;
    const paramJoin = `JOIN ${search_table} ${alias} on ${alias}.r_version_id=resources.version_id AND ${alias}.parameter_url= $${index++}`;
    values = [...values, searchParameter.url];
    let parameterClause;
    switch (searchParameter.type) {
      case "token": {
        parameterClause = parameter.value
          .map((value) => {
            const parts = value.toString().split("|");
            if (parts.length === 1) {
              values = [...values, value];
              return `${alias}.value = $${index++}`;
            }
            if (parts.length === 2) {
              if (parts[0] !== "" && parts[1] !== "") {
                values = [...values, parts[0], parts[1]];
                return `${alias}.system = $${index++} AND ${alias}.value = $${index++}`;
              } else if (parts[0] !== "" && parts[1] === "") {
                values = [...values, parts[0]];
                return `${alias}.system = $${index++}`;
              } else if (parts[0] === "" && parts[1] !== "") {
                values = [...values, parts[1]];
                return `${alias}.value = $${index++}`;
              }
            }
            throw new Error(`Invalid token value found '${value}'`);
          })
          .join(" OR ");
        break;
      }
      case "number":
      case "string:": {
        parameterClause = parameter.value
          .map((value) => `${alias}.value = $${index++}`)
          .join(" OR ");
        values = [...values, ...parameter.value];
        break;
      }
    }

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
