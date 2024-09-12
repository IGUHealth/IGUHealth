import * as accessPolicyV2 from "@iguhealth/access-control/v2";
import { IguhealthEvaluatePolicy } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { httpRequestToFHIRRequest } from "../../../../fhir-http/index.js";
import InlineOperation from "../interface.js";

export const ResourceValidateInvoke = InlineOperation(
  IguhealthEvaluatePolicy.Op,
  async (ctx, request, input) => {
    const url = input.request.entry?.[0]?.request?.url;
    const method = input.request.entry?.[0]?.request?.method;
    const body = input.request.entry?.[0]?.resource;

    if (!url || !method) {
      throw new OperationError(outcomeError("exception", "Invalid request"));
    }

    const result = await accessPolicyV2.pdp.evaluate(
      {
        environment: {
          claims: ctx.user.payload,
          membership: ctx.user.resource,
        },
        request: httpRequestToFHIRRequest(request.fhirVersion, {
          url: url,
          method: method,
          body: input.request.entry?.[0]?.resource,
        }),
      },
      input.policy,
    );

    return result;
  },
);
