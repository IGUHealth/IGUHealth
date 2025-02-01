import {
  InvokeRequest,
  InvokeResponse,
  RequestLevel,
} from "@iguhealth/client/lib/types";
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
    level: RequestLevel[keyof RequestLevel];
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
    input: InvokeRequest<R4>,
  ): Promise<InvokeResponse<R4>>;
}
