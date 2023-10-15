/*
 ** Sets of custom operations.
 ** Consideration to move these to use operation-executioners?
 **  - Because sets of operations are used in path critical flows like $validate may be to slow.
 */

import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "@iguhealth/client/middleware";
import { OperationDefinition } from "@iguhealth/fhir-types/r4/types";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";
import { AsynchronousClient } from "@iguhealth/client";

import { InlineOp } from "./interface.js";
import { FHIRServerCTX } from "../../fhirServer.js";

function createExecutor(): MiddlewareAsync<
  InlineOp<unknown, unknown>[],
  FHIRServerCTX
> {
  return createMiddlewareAsync<InlineOp<unknown, unknown>[], FHIRServerCTX>([
    async (request, { ctx, state }, _next) => {
      /* eslint-disable no-fallthrough */
      switch (request.type) {
        case "invoke-request": {
          for (const op of state) {
            if (op.code === request.operation) {
              const parameterOutput = await op.execute(ctx, request);
              return {
                ctx,
                state,
                response: {
                  type: "invoke-response",
                  level: "system",
                  operation: request.operation,
                  body: parameterOutput,
                },
              };
            }
          }
          throw new OperationError(
            outcomeFatal(
              "not-supported",
              `Operation '${request.operation}' is not supported`
            )
          );
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

class OperationClient extends AsynchronousClient<
  InlineOp<unknown, unknown>[],
  FHIRServerCTX
> {
  _state: InlineOp<unknown, unknown>[];
  constructor(
    initialState: InlineOp<unknown, unknown>[],
    middleware: MiddlewareAsync<InlineOp<unknown, unknown>[], FHIRServerCTX>
  ) {
    super(initialState, middleware);
    this._state = initialState;
  }
  supportedOperations(): OperationDefinition[] {
    return this._state.map((op) => op.operationDefinition);
  }
}

export default function InlineOperations(
  ops: InlineOp<unknown, unknown>[]
): OperationClient {
  const client = new OperationClient(ops, createExecutor());

  return client;
}
