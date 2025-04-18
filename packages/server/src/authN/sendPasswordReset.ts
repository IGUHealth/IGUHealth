import { Membership, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthPasswordReset } from "@iguhealth/generated-ops/lib/r4/ops";

import { IGUHealthServerCTX } from "../fhir-server/types.js";

export async function sendPasswordResetEmail(
  ctx: IGUHealthServerCTX,
  membership: Membership,
  input: IguhealthPasswordReset.Input,
): Promise<IguhealthPasswordReset.Output> {
  return ctx.client.invoke_instance(
    IguhealthPasswordReset.Op,
    ctx,
    R4,
    "Membership",
    membership.id as id,
    input,
  );
}
