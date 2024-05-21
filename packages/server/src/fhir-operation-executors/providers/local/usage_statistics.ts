import { FHIRRequest } from "@iguhealth/client/types";
import { integer } from "@iguhealth/fhir-types/r4/types";
import { R4, R4B, ResourceType } from "@iguhealth/fhir-types/versions";
import { IguhealthUsageStatistics } from "@iguhealth/generated-ops/r4";

import {
  getResourceCountTotal,
  getTenantLimits,
} from "../../../fhir-api/middleware/usageCheck.js";
import { FHIRServerCTX } from "../../../fhir-api/types.js";
import InlineOperation from "./interface.js";

const IguhealthUsageStatisticsInvoke = InlineOperation(
  IguhealthUsageStatistics.Op,
  async (ctx: FHIRServerCTX, _request: FHIRRequest, _input) => {
    const r4Limits = await getTenantLimits(ctx.db, ctx.tenant, R4);
    const r4bLimits = await getTenantLimits(ctx.db, ctx.tenant, R4B);
    const statistics = [
      ...(await Promise.all(
        r4Limits.map(async (limit) => {
          const usage = await getResourceCountTotal(
            ctx.db,
            ctx.tenant,
            R4,
            (limit.resource_type as ResourceType<R4>) ?? "ALL",
          );
          return {
            name: limit.resource_type ?? "ALL",
            usage: usage as integer,
            version: "r4",
            limit: limit.value as integer,
          };
        }),
      )),
      ...(await Promise.all(
        r4bLimits.map(async (limit) => {
          const usage = await getResourceCountTotal(
            ctx.db,
            ctx.tenant,
            R4B,
            (limit.resource_type as ResourceType<R4B>) ?? "ALL",
          );
          return {
            name: limit.resource_type ?? "ALL",
            usage: usage as integer,
            version: "r4b",
            limit: limit.value as integer,
          };
        }),
      )),
    ];

    return {
      statistics,
    };
  },
);

export default IguhealthUsageStatisticsInvoke;
