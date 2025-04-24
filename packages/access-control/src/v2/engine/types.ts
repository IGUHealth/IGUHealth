import { FHIRClient } from "@iguhealth/client/lib/interface";
import {
  AllInteractions,
  FHIRRequest,
  FHIRResponse,
} from "@iguhealth/client/lib/types";
import {
  ClientApplication,
  Membership,
  OperationDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { AccessTokenPayload } from "@iguhealth/jwt";

export type PolicyResult<CTX, Role, Result> = {
  context: PolicyContext<CTX, Role>;
  result: Result;
};

export interface PolicyContext<CTX, Role> {
  clientCTX: CTX;
  client: FHIRClient<CTX>;
  environment: {
    request: FHIRRequest<FHIR_VERSION, AllInteractions>;
    user: {
      payload: AccessTokenPayload<Role>;
      resource: Membership | ClientApplication | OperationDefinition;
    };
  };
  attributes: {
    [key: string]: FHIRResponse<FHIR_VERSION, AllInteractions | "error">;
  };
}
