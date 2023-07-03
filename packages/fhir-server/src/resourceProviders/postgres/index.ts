import * as pg from "pg";
import { v4 } from "uuid";

import { FHIRURL } from "@genfhi/fhir-query";
import {
  Address,
  HumanName,
  Resource,
  ResourceType,
  SearchParameter,
} from "@genfhi/fhir-types/r4/types";
import { evaluateWithMeta } from "@genfhi/fhirpath";

import { FHIRServerCTX } from "../../fhirServer";
import { FHIRClientAsync } from "../../client/interface";
import { AsynchronousClient } from "../../client";
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "../../client/middleware";
import { MetaValue, MetaValueSingular } from "@genfhi/meta-value";

function searchResources(resource: Resource): (ResourceType | string)[] {
  return ["Resource", "DomainResource", resource.resourceType];
}

async function getParametersForResource<CTX extends FHIRServerCTX>(
  ctx: CTX,
  resource: Resource
): Promise<SearchParameter[]> {
  const parameters: FHIRURL = {
    resourceType: "SearchParameter",
    parameters: {
      type: {
        name: "type",
        value: ["string"],
      },
      base: {
        name: "base",
        value: searchResources(resource),
      },
    },
  };
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
        humanName.text,
        humanName.family,
        humanName.given,
        humanName.prefix,
        humanName.suffix,
      ].filter((v): v is string => v !== undefined);
    }
    case "Address": {
      const address = value.valueOf() as Address;
      return [
        address.text,
        address.line,
        address.city,
        address.district,
        address.state,
        address.postalCode,
        address.country,
      ].filter((v): v is string => v !== undefined);
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

async function indexResource<CTX extends FHIRServerCTX>(
  client: pg.Client,
  ctx: CTX,
  resource: Resource
) {
  const searchParameters = await getParametersForResource(ctx, resource);
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

function createPostgresMiddleware<
  State extends { client: pg.Client },
  CTX extends FHIRServerCTX
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (request, args, next) => {
      const client = args.state.client;
      switch (request.type) {
        case "search-request":
          throw new Error("Not implemented");
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
        default:
          throw new Error(`Not implemented ${request.type}`);
      }
    },
  ]);
}

// const client = new pg.Client();

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
