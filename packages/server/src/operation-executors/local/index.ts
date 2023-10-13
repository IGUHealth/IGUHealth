/*
 ** Sets of custom operations.
 ** Consideration to move these to use operation-executioners?
 **  - Because sets of operations are used in path critical flows like $validate may be to slow.
 */

import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "@iguhealth/client/middleware";

import { InvokeResponse } from "@iguhealth/client/types";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";
import { AsynchronousClient } from "@iguhealth/client";

import { InlineOperation } from "./interface.js";
import { FHIRServerCTX } from "../../fhirServer.js";
import { ValueSetExpandInvoke } from "./expand.js";

function createExecutor(): MiddlewareAsync<unknown, FHIRServerCTX> {
  return createMiddlewareAsync<unknown, FHIRServerCTX>([
    async (request, { ctx, state }, next) => {
      /* eslint-disable no-fallthrough */
      switch (request.type) {
        case "invoke-request": {
          switch (request.operation) {
            case "expand": {
              const expanded = await ValueSetExpandInvoke(ctx, request);
              const response: InvokeResponse = {
                type: "invoke-response",
                level: "system",
                operation: request.operation,
                body: expanded,
              };
              const output = {
                ctx,
                state,
                response,
              };
              return output;
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

class OperationClient extends AsynchronousClient<unknown, FHIRServerCTX> {
  constructor(
    initialState: unknown,
    middleware: MiddlewareAsync<unknown, FHIRServerCTX>
  ) {
    super(initialState, middleware);
  }
  supportedOperations(): string[] {
    return ["expand"];
  }
}

export default function InlineOperations(): OperationClient {
  const client = new OperationClient({}, createExecutor());

  return client;
}
