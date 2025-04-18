import {
  AllInteractions,
  FHIRRequest,
  FHIRResponse,
  toInteraction,
} from "@iguhealth/client/lib/types";
import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../fhir-server/types.js";
import {
  OperationsTopic,
  TenantTopic,
} from "../../queue/topics/tenant-topics.js";

function confirmTypeResponse<
  I extends AllInteractions,
  Version extends FHIR_VERSION,
>(
  req: FHIRRequest<Version, I>,
  res: FHIRResponse<FHIR_VERSION, AllInteractions>,
): res is FHIRResponse<Version, I> {
  return (
    req.fhirVersion === res.fhirVersion &&
    req.type.replace("-request", "") === res?.type.replace("-response", "")
  );
}

export default function sendQueueMiddleweare<
  CTX extends IGUHealthServerCTX,
  State = unknown,
>(): MiddlewareAsyncChain<State, CTX> {
  return async function storageMiddleware(context, next) {
    const res = await next(context);

    switch (res.request.type) {
      case "create-request":
      case "delete-request":
      case "update-request":
      case "patch-request": {
        if (res.response?.type === "error-response") {
          return res;
        }

        if (!res.response) {
          throw new OperationError(
            outcomeError(
              "invalid",
              `Response not found for request type '${res.request.type}'`,
            ),
          );
        }

        if (!confirmTypeResponse(res.request, res.response)) {
          throw new OperationError(
            outcomeError(
              "invalid",
              `Response type does not match request type.`,
            ),
          );
        }

        await context.ctx.queue.sendTenant(
          res.ctx.tenant,
          TenantTopic(res.ctx.tenant, OperationsTopic),
          [
            {
              value: [
                {
                  fhirVersion: res.response.fhirVersion,
                  type: toInteraction(res.request.type),
                  request: res.request,
                  // eslint-disable-next-line
                  response: res.response as any,
                  author: {
                    [CUSTOM_CLAIMS.RESOURCE_TYPE]:
                      res.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
                    [CUSTOM_CLAIMS.RESOURCE_ID]:
                      res.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
                  },
                },
              ],
            },
          ],
        );
        return res;
      }
      default: {
        return res;
      }
    }
  };
}
