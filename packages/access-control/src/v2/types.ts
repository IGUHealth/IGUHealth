import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { FHIRRequest, FHIRResponse } from "@iguhealth/client/lib/types";
import {
  ClientApplication,
  Membership,
  OperationDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { AccessTokenPayload } from "@iguhealth/jwt";

export type Result<CTX, Role, Result> = {
  context: PolicyContext<CTX, Role>;
  result: Result;
};

export interface PolicyContext<CTX, Role> {
  clientCTX: CTX;
  client: FHIRClientAsync<CTX>;
  environment: {
    request: FHIRRequest;
    user: {
      payload: AccessTokenPayload<Role>;
      resource: Membership | ClientApplication | OperationDefinition;
    };
  };
  attributes: {
    [key: string]: FHIRResponse;
  };
}
