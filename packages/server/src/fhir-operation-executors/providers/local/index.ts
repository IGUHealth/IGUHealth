/*
 ** Sets of custom operations.
 ** Consideration to move these to use operation-executioners?
 **  - Because sets of operations are used in path critical flows like $validate may be to slow.
 */
import { AsynchronousClient } from "@iguhealth/client";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { OperationDefinition } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../fhir-context/types.js";
import { InlineOp } from "./interface.js";

function createExecutor(): MiddlewareAsync<
  InlineOp<unknown, unknown>[],
  FHIRServerCTX
> {
  return createMiddlewareAsync<InlineOp<unknown, unknown>[], FHIRServerCTX>([
    async (context) => {
      switch (context.request.fhirVersion) {
        case "4.3": {
          throw new OperationError(
            outcomeFatal("not-supported", "FHIR 4.3 is not supported"),
          );
        }
        case "4.0": {
          switch (context.request.type) {
            case "invoke-request": {
              for (const op of context.state) {
                if (op.code === context.request.operation) {
                  const parameterOutput = await op.execute(
                    context.ctx,
                    context.request,
                  );
                  return {
                    ...context,
                    response: {
                      fhirVersion: "4.0",
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
                  `Operation '${context.request.operation}' is not supported`,
                ),
              );
            }
            default:
              throw new OperationError(
                outcomeFatal(
                  "invalid",
                  `Invocation client only supports invoke-request not '${context.request.type}'`,
                ),
              );
          }
        }
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
    middleware: MiddlewareAsync<InlineOp<unknown, unknown>[], FHIRServerCTX>,
  ) {
    super(initialState, middleware);
    this._state = initialState;
  }
  supportedOperations(): OperationDefinition[] {
    return this._state.map((op) => op.operationDefinition);
  }
}

export default function InlineOperations(
  ops: InlineOp<unknown, unknown>[],
): OperationClient {
  const client = new OperationClient(ops, createExecutor());

  return client;
}
