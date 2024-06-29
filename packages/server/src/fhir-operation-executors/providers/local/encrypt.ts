import { FHIRRequest } from "@iguhealth/client/types";
import { IguhealthEncrypt } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import InlineOperation from "./interface.js";

const IguhealthEncryptInvoke = InlineOperation(
  IguhealthEncrypt.Op,
  async (ctx: IGUHealthServerCTX, request: FHIRRequest, input) => {
    if (!ctx.encryptionProvider)
      throw new OperationError(
        outcomeError("exception", "Encryption provider not configured"),
      );
    return {
      encryptedValue: await ctx.encryptionProvider.encrypt(
        { workspace: ctx.tenant },
        input.value,
      ),
    };
  },
);

export default IguhealthEncryptInvoke;
