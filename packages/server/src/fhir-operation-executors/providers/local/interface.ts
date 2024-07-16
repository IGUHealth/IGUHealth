import { R4FHIRRequest, R4InvokeRequest } from "@iguhealth/client/types";
import {
  OperationDefinition,
  Parameters,
} from "@iguhealth/fhir-types/r4/types";
import { IOperation, Operation } from "@iguhealth/operation-execution";
import { OperationError, outcome } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import { getOpCTX } from "../../utilities.js";
import { validateInvocationContext } from "../../utilities.js";

type Input<T> = T extends IOperation<infer Input, unknown> ? Input : never;
type Output<T> = T extends IOperation<unknown, infer Output> ? Output : never;

export class InlineOp<T, V> extends Operation<T, V> {
  private _execute: (
    ctx: IGUHealthServerCTX,
    request: R4InvokeRequest,
  ) => Promise<Parameters>;
  constructor(
    definition: OperationDefinition,
    execute: (
      ctx: IGUHealthServerCTX,
      request: R4InvokeRequest,
    ) => Promise<Parameters>,
  ) {
    super(definition);
    this._execute = execute;
  }
  execute(
    ctx: IGUHealthServerCTX,
    request: R4InvokeRequest,
  ): Promise<Parameters> {
    return this._execute(ctx, request);
  }
}

export default function InlineOperation<
  OP extends IOperation<unknown, unknown>,
>(
  op: OP,
  executor: (
    ctx: IGUHealthServerCTX,
    request: R4FHIRRequest,
    v: Input<OP>,
  ) => Promise<Output<OP>>,
): InlineOp<Input<OP>, Output<OP>> {
  return new InlineOp(
    op.operationDefinition,
    async (ctx: IGUHealthServerCTX, request: R4InvokeRequest) => {
      const invocationOperationOutcome = validateInvocationContext(
        op.operationDefinition,
        request,
      );

      if (invocationOperationOutcome) {
        throw new OperationError(invocationOperationOutcome);
      }

      const input = op.parseToObject("in", request.body) as Input<OP>;
      const inputIssues = await op.validate(
        getOpCTX(ctx, request),
        "in",
        input,
      );
      if (inputIssues.length > 0)
        throw new OperationError(outcome(inputIssues));

      const result = await executor(ctx, request, input);

      const outputIssues = await op.validate(
        getOpCTX(ctx, request),
        "out",
        result,
      );

      if (outputIssues.length > 0) {
        console.log(JSON.stringify(result));
        throw new OperationError(outcome(outputIssues));
      }

      return op.parseToParameters("out", result) as Parameters;
    },
  );
}
