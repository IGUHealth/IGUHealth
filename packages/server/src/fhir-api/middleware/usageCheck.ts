import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { FHIRRequest } from "@iguhealth/client/lib/types";
import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import {
  FHIR_VERSION,
  R4,
  R4B,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { toDBFHIRVersion } from "../../fhir-storage/utilities/version.js";
import { IGUHealthServerCTX } from "../types.js";

export async function getResourceCountTotal<Version extends FHIR_VERSION>(
  pg: db.Queryable,
  tenant: TenantId,
  fhirVersion: Version,
  type: ResourceType<Version> | "ALL",
): Promise<number> {
  const whereAble: s.r4_token_idx.Whereable | s.r4b_token_idx.Whereable = {
    tenant: tenant,
    parameter_name: "_id",
    resource_type: type === "ALL" ? db.sql`${db.self} IS NOT NULL` : type,
  };
  switch (fhirVersion) {
    case R4: {
      return db.count("r4_token_idx", whereAble).run(pg);
    }
    case R4B: {
      return db.count("r4b_token_idx", whereAble).run(pg);
    }
    default: {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `FHIR version '${fhirVersion}' is not supported in this middleware.`,
        ),
      );
    }
  }
}

export async function getTenantLimits(
  client: db.Queryable,
  tenant: TenantId,
  fhirVersion: FHIR_VERSION,
) {
  const limitations = await db.sql<
    s.limitations.SQL | s.subscription_tier.SQL | s.tenants.SQL,
    s.limitations.JSONSelectable[]
  >`
  SELECT * FROM ${"limitations"} where ${{ fhir_version: toDBFHIRVersion(fhirVersion) }} AND tier = (SELECT id FROM ${"subscription_tier"} WHERE ${"id"} = (SELECT ${"subscription_tier"} FROM ${"tenants"} where ${{ id: tenant }}));
`.run(client);

  return limitations;
}

async function checkTenantUsage(
  pg: db.Queryable,
  tenant: TenantId,
  fhirRequest: FHIRRequest,
): Promise<void> {
  switch (fhirRequest.type) {
    case "create-request": {
      const limitations = await getTenantLimits(
        pg,
        tenant,
        fhirRequest.fhirVersion,
      );
      const typeLimitation = limitations.find(
        (limitation) => limitation.resource_type === fhirRequest.resourceType,
      );

      // Check if the resource type has a limitation
      if (typeLimitation) {
        const resourceOfTypeTotal = await getResourceCountTotal(
          pg,
          tenant,
          fhirRequest.fhirVersion,
          fhirRequest.resourceType,
        );

        if (resourceOfTypeTotal >= typeLimitation.value) {
          throw new OperationError(
            outcomeError(
              "exception",
              `Resource type limit of '${typeLimitation.value}' exceeded for ${fhirRequest.resourceType} `,
            ),
          );
        }
      }

      const allLimitation = limitations.find(
        (limitation) => limitation.resource_type === "ALL",
      );

      if (allLimitation) {
        const allResourceTotal = await getResourceCountTotal(
          pg,
          tenant,
          fhirRequest.fhirVersion,
          "ALL",
        );

        if (allResourceTotal >= allLimitation.value) {
          throw new OperationError(
            outcomeError(
              "exception",
              `Resource limit of '${allLimitation.value}' exceeded`,
            ),
          );
        }
      }
    }
  }
}

/**
 * Middleware to evaluate limitations by tenant.
 * @param context Current state, server context and request information.
 * @param next Next middleware
 * @returns context with response.
 */
export function checkTenantUsageMiddleware<T>(): MiddlewareAsyncChain<
  T,
  IGUHealthServerCTX
> {
  return async (context, next) => {
    await checkTenantUsage(context.ctx.db, context.ctx.tenant, context.request);

    return next(context);
  };
}
