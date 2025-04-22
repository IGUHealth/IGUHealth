import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { AllResourceTypes } from "@iguhealth/fhir-types/versions";

import { encryptValue } from "../../encryption/index.js";
import { IGUHealthServerCTX } from "../types.js";

function createEncryptionMiddleware<State>(
  resourceTypesToEncrypt: AllResourceTypes[],
): MiddlewareAsyncChain<State, IGUHealthServerCTX> {
  return async function encryptionMiddleware(state, context, next) {
    if (!context.ctx.encryptionProvider) {
      return next(state, context);
    }
    if (
      "resource" in context.request &&
      resourceTypesToEncrypt.includes(context.request.resource)
    ) {
      switch (context.request.type) {
        case "create-request":
        case "update-request": {
          const encrypted = await encryptValue(
            context.ctx,
            context.request.body,
          );
          return next(state, {
            ...context,
            // @ts-ignore
            request: { ...context.request, body: encrypted },
          });
        }
        case "patch-request": {
          const encrypted = await encryptValue(
            context.ctx,
            // Should be safe as given patch should be validated.
            context.request.body as object,
          );
          return next(state, {
            ...context,
            request: { ...context.request, body: encrypted },
          });
        }
        default: {
          return next(state, context);
        }
      }
    } else {
      return next(state, context);
    }
  };
}

export default createEncryptionMiddleware;
