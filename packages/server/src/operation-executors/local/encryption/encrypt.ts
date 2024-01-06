import { FHIRRequest } from "@iguhealth/client/types";
import { IguhealthEncrypt } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../../fhir/types.js";
import InlineOperation from "../interface.js";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

const IguhealthEncryptInvoke = InlineOperation(
  IguhealthEncrypt.Op,
  async (ctx: FHIRServerCTX, request: FHIRRequest, input) => {
    if (!ctx.encryptionProvider)
      throw new OperationError(
        outcomeError("exception", "Encryption provider not configured")
      );
    return {
      encryptedValue: await ctx.encryptionProvider.encrypt(
        { workspace: ctx.tenant.id },
        input.value
      ),
    };
  }
);

export default IguhealthEncryptInvoke;
