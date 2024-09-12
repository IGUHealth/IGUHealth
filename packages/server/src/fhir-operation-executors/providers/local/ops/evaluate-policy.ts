import * as accessPolicyV2 from "@iguhealth/access-control/v2";
import { IguhealthEvaluatePolicy } from "@iguhealth/generated-ops/r4";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { httpRequestToFHIRRequest } from "../../../../fhir-http/index.js";
import InlineOperation from "../interface.js";

export const EvaluatePolicyInvoke = InlineOperation(
  IguhealthEvaluatePolicy.Op,
  async (ctx, request, input) => {
    const url = input.request.entry?.[0]?.request?.url;
    const method = input.request.entry?.[0]?.request?.method;
    const body = input.request.entry?.[0]?.resource;

    if (!url || !method) {
      throw new OperationError(outcomeError("exception", "Invalid request"));
    }

    switch (request.level) {
      case "instance": {
        const policy = await ctx.client.read(
          ctx,
          request.fhirVersion,
          "AccessPolicyV2",
          request.id,
        );
        if (!policy) {
          throw new OperationError(
            outcomeFatal("not-found", "AccessPolicyV2 not found"),
          );
        }

        const result = await accessPolicyV2.pdp.evaluate(
          {
            clientCTX: ctx,
            client: ctx.client,
            environment: {
              user: ctx.user,
              request: httpRequestToFHIRRequest(request.fhirVersion, {
                url,
                method,
                body,
              }),
            },
            attributes: {},
          },
          policy,
        );

        return result;
      }
      default: {
        throw new OperationError(
          outcomeFatal(
            "invalid",
            "Operation must be invoked on AccessPolicyV2 instance.",
          ),
        );
      }
    }
  },
);
