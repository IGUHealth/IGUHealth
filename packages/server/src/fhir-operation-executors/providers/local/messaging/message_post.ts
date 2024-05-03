import { FHIRRequest } from "@iguhealth/client/types";
import { code } from "@iguhealth/fhir-types/r4/types";
import { IguhealthMessagePost } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../fhir-api/types.js";
import InlineOperation from "../interface.js";

const IguhealthMessagePostInvoke = InlineOperation(
  IguhealthMessagePost.Op,
  async (ctx: FHIRServerCTX, request: FHIRRequest, input) => {
    return {
      result: "success" as code,
    };
  },
);

export default IguhealthMessagePostInvoke;
