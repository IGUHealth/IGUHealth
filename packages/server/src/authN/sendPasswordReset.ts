import { Membership, Parameters, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthPasswordReset } from "@iguhealth/generated-ops/lib/r4/ops";

import { IGUHealthServerCTX } from "../fhir-server/types.js";
import { OperationsTopic, Topic } from "../queue/topics.js";

export async function sendPasswordResetEmail(
  ctx: Pick<IGUHealthServerCTX, "queue" | "tenant">,
  membership: Membership,
  input: IguhealthPasswordReset.Input,
): Promise<void> {
  await ctx.queue.send(ctx.tenant, Topic(ctx.tenant, OperationsTopic), [
    {
      value: [
        {
          type: "invoke",
          value: {
            level: "instance",
            fhirVersion: R4,
            resource: "Membership",
            id: membership.id as id,
            type: "invoke-request",
            operation: IguhealthPasswordReset.Op.code,
            body: IguhealthPasswordReset.Op.parseToParameters(
              "in",
              input,
            ) as Parameters,
          },
        },
      ],
    },
  ]);
}
