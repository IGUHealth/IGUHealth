import { FHIRServerCTX } from "../../fhirServer.js";
import { InvokeRequest } from "../types.js";
import { IOperation } from "@iguhealth/operation-execution";

type Input<T> = T extends IOperation<infer Input, unknown> ? Input : never;
type Output<T> = T extends IOperation<unknown, infer Output> ? Output : never;

export default function InlineOperation<OP extends IOperation<any, any>>(
  op: OP,
  executor: (ctx: FHIRServerCTX, v: Input<OP>) => Promise<Output<OP>>
) {
  return async (ctx: FHIRServerCTX, request: InvokeRequest) => {
    const input = op.parseToObject("in", request.body);
    op.validate({ level: request.levels, ...ctx }, "in", input);
    const result = await executor(ctx, input);
    op.validate({ level: request.levels, ...ctx }, "out", result);
    return op.parseToParameters("out", result);
  };
}
