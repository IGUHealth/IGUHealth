import { ValueSetExpand } from "@iguhealth/generated-ops/r4";
import { FHIRServerCTX } from "../../fhirServer.js";
import { InvokeRequest } from "../types.js";

export default function ValueSetExpansionInvoker(
  ctx: FHIRServerCTX,
  executor: (v: any) => Promise<any>
) {
  async (request: InvokeRequest) => {
    const input = ValueSetExpand.Op.parseToParameters("in", request.body);
    ValueSetExpand.Op.validate(
      { level: request.levels, ...ctx },
      "in",
      request.body
    );
    const result = await executor(input);
    return result;
  };
}
