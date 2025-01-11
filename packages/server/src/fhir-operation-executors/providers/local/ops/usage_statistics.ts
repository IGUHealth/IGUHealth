import { FHIRRequest } from "@iguhealth/client/types";
import { integer } from "@iguhealth/fhir-types/r4/types";
import { R4, R4B, ResourceType } from "@iguhealth/fhir-types/versions";
import { IguhealthUsageStatistics } from "@iguhealth/generated-ops/r4";

import {
  getResourceCountTotal,
  getTenantLimits,
} from "../../../../fhir-api/middleware/usageCheck.js";
import { IGUHealthServerCTX } from "../../../../fhir-api/types.js";
import InlineOperation from "../interface.js";

export const IguhealthUsageStatisticsInvoke = InlineOperation(
  IguhealthUsageStatistics.Op,
  async (ctx: IGUHealthServerCTX, _request: FHIRRequest, _input) => {
    const r4Limits = await getTenantLimits(
      ctx.store.getClient(),
      ctx.tenant,
      R4,
    );
    const r4bLimits = await getTenantLimits(
      ctx.store.getClient(),
      ctx.tenant,
      R4B,
    );
    const statistics = [
      ...(await Promise.all(
        r4Limits.map(async (limit) => {
          const usage = await getResourceCountTotal(
            ctx.store.getClient(),
            ctx.tenant,
            R4,
            (limit.resource_type as ResourceType<R4>) ?? "ALL",
          );
          return {
            name:
              limit.resource_type === "ALL" ? "Resource" : limit.resource_type,
            usage: usage as integer,
            version: "R4",
            limit: limit.value as integer,
            description: limit.name,
          };
        }),
      )),
      ...(await Promise.all(
        r4bLimits.map(async (limit) => {
          const usage = await getResourceCountTotal(
            ctx.store.getClient(),
            ctx.tenant,
            R4B,
            (limit.resource_type as ResourceType<R4B>) ?? "ALL",
          );
          return {
            name:
              limit.resource_type === "ALL" ? "Resource" : limit.resource_type,
            usage: usage as integer,
            version: "R4B",
            limit: limit.value as integer,
            description: limit.name,
          };
        }),
      )),
    ];

    return {
      statistics,
    };
  },
);
