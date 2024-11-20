import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { FHIRResponse } from "@iguhealth/client/lib/types";
import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import {
  CapabilityStatementRestResource,
  code,
} from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, R4, Resource } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../types.js";

async function createResourceRestCapabilities(
  ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  memdb: FHIRClientAsync<IGUHealthServerCTX>,
  sd: Resource<FHIR_VERSION, "StructureDefinition">,
): Promise<CapabilityStatementRestResource> {
  const resourceParameters = await memdb.search_type(
    ctx,
    fhirVersion,
    "SearchParameter",
    [
      { name: "_count", value: [1000] },
      {
        name: "base",
        value: ["Resource", "DomainResource", sd.type],
      },
    ],
  );

  return {
    type: sd.type as unknown as code,
    profile: sd.url,
    interaction: [
      { code: "read" },
      { code: "update" },
      { code: "delete" },
      { code: "search-type" },
      { code: "create" },
      { code: "history-instance" },
    ],
    versioning: "versioned",
    updateCreate: false,
    searchParam: resourceParameters.resources.map((resource) => ({
      name: resource.name,
      definition: resource.url,
      type: resource.type,
      documentation: resource.description,
    })),
  } as CapabilityStatementRestResource;
}

async function serverCapabilities<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  client: FHIRClientAsync<IGUHealthServerCTX>,
): Promise<Resource<Version, "CapabilityStatement">> {
  const sds = (
    await client.search_type(ctx, fhirVersion, "StructureDefinition", [
      { name: "_count", value: [1000] },
      { name: "kind", value: ["resource"] },
      { name: "abstract", value: ["false"] },
      { name: "derivation", value: ["specialization"] },
    ])
  ).resources;

  const rootParameters = await client.search_type(
    ctx,
    fhirVersion,
    "SearchParameter",
    [
      { name: "_count", value: [1000] },
      {
        name: "base",
        value: ["Resource", "DomainResource"],
      },
    ],
  );

  return {
    resourceType: "CapabilityStatement",
    status: "active",
    fhirVersion: fhirVersion === R4 ? "4.0.1" : "4.3.0",
    date: new Date().toISOString(),
    kind: "capability",
    format: ["json"],
    rest: [
      {
        mode: "server",
        security: {
          cors: true,
        },
        interaction: [{ code: "search-system" }],
        searchParam: rootParameters.resources.map((resource) => ({
          name: resource.name,
          definition: resource.url,
          type: resource.type,
          documentation: resource.description,
        })),
        resource: await Promise.all(
          sds.map((sd) =>
            createResourceRestCapabilities(ctx, fhirVersion, client, sd),
          ),
        ),
      },
    ],
  } as Resource<Version, "CapabilityStatement">;
}

function createCapabilitiesMiddleware<State>(): MiddlewareAsyncChain<
  State,
  IGUHealthServerCTX
> {
  return async (context, next) => {
    if (context.request.type === "capabilities-request") {
      return {
        ...context,
        response: {
          fhirVersion: context.request.fhirVersion,
          level: "system",
          type: "capabilities-response",
          body: await serverCapabilities(
            context.ctx,
            context.request.fhirVersion,
            context.ctx.client,
          ),
        } as FHIRResponse,
      };
    }

    return next(context);
  };
}

export default createCapabilitiesMiddleware;
