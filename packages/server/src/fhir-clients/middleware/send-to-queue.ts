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
  State = undefined,
>(): MiddlewareAsyncChain<State, CTX> {
  return async function storageMiddleware(state, context, next) {
    const res = await next(state, context);

    switch (res[1].request.type) {
      case "create-request":
      case "delete-request":
      case "update-request":
      case "patch-request":
      case "invoke-request": {
        if (res[1].response?.type === "error-response") {
          return res;
        }

        if (!res[1].response) {
          throw new OperationError(
            outcomeError(
              "invalid",
              `Response not found for request type '${res[1].request.type}'`,
            ),
          );
        }

        if (!confirmTypeResponse(res[1].request, res[1].response)) {
          throw new OperationError(
            outcomeError(
              "invalid",
              `Response type does not match request type.`,
            ),
          );
        }

        await context.ctx.queue.sendTenant(
          res[1].ctx.tenant,
          TenantTopic(res[1].ctx.tenant, OperationsTopic),
          [
            {
              value: [
                {
                  fhirVersion: res[1].response.fhirVersion,
                  type: toInteraction(res[1].request.type),
                  request: res[1].request,
                  // eslint-disable-next-line
                  response: res[1].response as any,
                  author: {
                    [CUSTOM_CLAIMS.RESOURCE_TYPE]:
                      res[1].ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
                    [CUSTOM_CLAIMS.RESOURCE_ID]:
                      res[1].ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
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
