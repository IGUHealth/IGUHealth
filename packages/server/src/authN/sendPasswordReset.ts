import { Membership, Parameters, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthPasswordReset } from "@iguhealth/generated-ops/lib/r4/ops";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";

import { IGUHealthServerCTX } from "../fhir-server/types.js";
import { OperationsTopic, TenantTopic } from "../queue/topics/index.js";

export async function sendPasswordResetEmail(
  ctx: Pick<IGUHealthServerCTX, "queue" | "tenant" | "user">,
  membership: Membership,
  input: IguhealthPasswordReset.Input,
): Promise<void> {
  await ctx.queue.sendTenant(
    ctx.tenant,
    TenantTopic(ctx.tenant, OperationsTopic),
    [
      {
        key: membership.id as id,
        value: [
          {
            author: {
              [CUSTOM_CLAIMS.RESOURCE_TYPE]:
                ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
              [CUSTOM_CLAIMS.RESOURCE_ID]:
                ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
            },
            type: "invoke",
            request: {
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
            response: undefined,
          },
        ],
      },
    ],
  );
}
