import { FHIRRequest } from "@iguhealth/client/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { IguhealthEncrypt } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../fhir-server/types.js";
import InlineOperation from "../interface.js";

export const IguhealthEncryptInvoke = InlineOperation(
  IguhealthEncrypt.Op,
  async (
    ctx: IGUHealthServerCTX,
    request: FHIRRequest<FHIR_VERSION>,
    input,
  ) => {
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
