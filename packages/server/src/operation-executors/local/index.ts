/*
 ** Sets of custom operations.
 ** Consideration to move these to use operation-executioners?
 **  - Because sets of operations are used in path critical flows like $validate may be to slow.
 */

import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "@iguhealth/client/middleware";

import { AsynchronousClient } from "@iguhealth/client";
import { FHIRServerCTX } from "../../fhirServer.js";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";
import ValueSetExpansionOperation from "./expand.js";

function createExecutor(): MiddlewareAsync<{}, FHIRServerCTX> {
  return createMiddlewareAsync<{}, FHIRServerCTX>([
    async (request, { ctx, state }, next) => {
      switch (request.type) {
        case "invoke-request": {
          switch (request.operation) {
            case "expand": {
              return ValueSetExpansionOperation(ctx, request);
            }
          }
        }
        default:
          throw new OperationError(
            outcomeFatal(
              "invalid",
              `Invocation client only supports invoke-request not '${request.type}'`
            )
          );
      }
    },
  ]);
}

export default function InlineOperations(): AsynchronousClient<
  {},
  FHIRServerCTX
> {
  return new AsynchronousClient<{}, FHIRServerCTX>({}, createExecutor());
}
