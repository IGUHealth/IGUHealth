import { FHIRRequest } from "@iguhealth/client/lib/types";
import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4, ResourceType } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../fhir-server/types.js";

export type Payload<I> = {
  ctx: {
    SEC_TOKEN: string;
    API_URL: string;
    tenant: IGUHealthServerCTX["tenant"];
    level: FHIRRequest["level"];
    resourceType?: ResourceType<R4>;
    id?: id;
  };
  input: I;
};
