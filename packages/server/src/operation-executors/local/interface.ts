import {
  Parameters,
  OperationDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { IOperation, Operation } from "@iguhealth/operation-execution";

import { FHIRServerCTX } from "../../fhirServer.js";
import { InvokeRequest } from "../types.js";
import { getOpCTX } from "../utilities.js";

type Input<T> = T extends IOperation<infer Input, unknown> ? Input : never;
type Output<T> = T extends IOperation<unknown, infer Output> ? Output : never;

export class InlineOp<T, V> extends Operation<T, V> {
  private _execute: (
    ctx: FHIRServerCTX,
    request: InvokeRequest
  ) => Promise<Parameters>;
  constructor(
    definition: OperationDefinition,
    execute: (ctx: FHIRServerCTX, request: InvokeRequest) => Promise<Parameters>
  ) {
    super(definition);
    this._execute = execute;
  }
  execute(ctx: FHIRServerCTX, request: InvokeRequest): Promise<Parameters> {
    return this._execute(ctx, request);
  }
}

export default function InlineOperation<
  OP extends IOperation<unknown, unknown>
>(
  op: OP,
  executor: (ctx: FHIRServerCTX, v: Input<OP>) => Promise<Output<OP>>
): InlineOp<Input<OP>, Output<OP>> {
  return new InlineOp(
    op.operationDefinition,
    async (ctx: FHIRServerCTX, request: InvokeRequest) => {
      const input = op.parseToObject("in", request.body) as Input<OP>;
      await op.validate(getOpCTX(ctx, request), "in", input);
      const result = await executor(ctx, input);
      await op.validate(getOpCTX(ctx, request), "out", result);
      return op.parseToParameters("out", result) as Parameters;
    }
  );
}
