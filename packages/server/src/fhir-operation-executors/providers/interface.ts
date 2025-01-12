import { R4InvokeRequest, R4InvokeResponse } from "@iguhealth/client/lib/types";
import { FHIRRequest } from "@iguhealth/client/lib/types";
import {
  OperationOutcome,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4, ResourceType } from "@iguhealth/fhir-types/versions";
import { Operation } from "@iguhealth/operation-execution";

import { IGUHealthServerCTX } from "../../fhir-server/types.js";

export interface Payload<I> {
  ctx: {
    SEC_TOKEN: string;
    API_URL: string;
    tenant: IGUHealthServerCTX["tenant"];
    level: FHIRRequest["level"];
    resourceType?: ResourceType<R4>;
    id?: id;
  };
  input: I;
}

export interface CustomCodeExecutor {
  deploy<I, O>(
    ctx: IGUHealthServerCTX,
    operation: Operation<I, O>,
    environment: Record<string, string>,
    code: string | Buffer,
  ): Promise<OperationOutcome>;
  execute<I, O>(
    ctx: IGUHealthServerCTX,
    operation: Operation<I, O>,
    input: R4InvokeRequest,
  ): Promise<R4InvokeResponse>;
}
