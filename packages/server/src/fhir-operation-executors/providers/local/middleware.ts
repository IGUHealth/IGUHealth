/*
 ** Sets of custom operations.
 ** Consideration to move these to use operation-executioners?
 **  - Because sets of operations are used in path critical flows like $validate may be to slow.
 */
import { AsynchronousClient } from "@iguhealth/client";
import { InvokeRequest } from "@iguhealth/client/lib/types";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { OperationDefinition } from "@iguhealth/fhir-types/r4/types";
import { R4, R4B } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { InlineOp } from "./interface.js";

type ExecutorState = InlineOp<unknown, unknown>[];

function createExecutor(
  state: ExecutorState,
): MiddlewareAsync<IGUHealthServerCTX> {
  return createMiddlewareAsync<ExecutorState, IGUHealthServerCTX>(state, [
    async (state, context) => {
      switch (context.request.fhirVersion) {
        case R4B: {
          throw new OperationError(
            outcomeFatal("not-supported", "FHIR 4.3 is not supported"),
          );
        }
        case R4: {
          switch (context.request.type) {
            case "invoke-request": {
              for (const op of state) {
                if (op.code === context.request.operation) {
                  const parameterOutput = await op.execute(
                    context.ctx,
                    context.request as InvokeRequest<R4>,
                  );
                  return [
                    state,
                    {
                      ...context,
                      response: {
                        fhirVersion: R4,
                        type: "invoke-response",
                        level: "system",
                        operation: context.request.operation,
                        body: parameterOutput,
                      },
                    },
                  ];
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

class OperationClient extends AsynchronousClient<IGUHealthServerCTX> {
  private readonly _ops: InlineOp<unknown, unknown>[];
  constructor(ops: InlineOp<unknown, unknown>[]) {
    super(createExecutor(ops));
    this._ops = ops;
  }

  supportedOperations(): OperationDefinition[] {
    return this._ops.map((op) => op.operationDefinition);
  }
}

export default function InlineOperations(
  ops: InlineOp<unknown, unknown>[],
): OperationClient {
  const client = new OperationClient(ops);

  return client;
}
