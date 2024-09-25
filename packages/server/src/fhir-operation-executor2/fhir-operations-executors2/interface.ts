import { R4InvokeRequest, R4InvokeResponse } from "@iguhealth/client/lib/types";
import { Operation } from "@iguhealth/operation-execution";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";

export interface CustomCodeExecutor {
  deploy<I, O>(
    ctx: IGUHealthServerCTX,
    operation: Operation<I, O>,
    environment: Record<string, string>,
    code: string | Buffer,
  ): Promise<boolean>;
  execute<I, O>(
    ctx: IGUHealthServerCTX,
    operation: Operation<I, O>,
    input: R4InvokeRequest,
  ): Promise<R4InvokeResponse>;
}
