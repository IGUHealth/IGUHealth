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
import { FHIRServerCTX } from "../../fhir/types.js";

function createExecutor(): MiddlewareAsync<
  InlineOp<unknown, unknown>[],
  FHIRServerCTX
> {
  return createMiddlewareAsync<InlineOp<unknown, unknown>[], FHIRServerCTX>([
    async (context) => {
      /* eslint-disable no-fallthrough */
      switch (context.request.type) {
        case "invoke-request": {
          for (const op of context.state) {
            if (op.code === context.request.operation) {
              const parameterOutput = await op.execute(
                context.ctx,
                context.request
              );
              return {
                ...context,
                response: {
                  type: "invoke-response",
                  level: "system",
                  operation: context.request.operation,
                  body: parameterOutput,
                },
              };
            }
          }
          throw new OperationError(
            outcomeFatal(
              "not-supported",
              `Operation '${context.request.operation}' is not supported`
            )
          );
        }
        default:
          throw new OperationError(
            outcomeFatal(
              "invalid",
              `Invocation client only supports invoke-request not '${context.request.type}'`
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
