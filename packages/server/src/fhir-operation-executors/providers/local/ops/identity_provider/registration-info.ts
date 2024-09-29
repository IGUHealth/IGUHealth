import { IguhealthIdpRegistrationInfo } from "@iguhealth/generated-ops/lib/r4/ops";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import InlineOperation from "../../interface.js";

export const IdentityProviderRegistrationInvoke = InlineOperation(
  IguhealthIdpRegistrationInfo.Op,
  async (ctx, request) => {
    switch (request.level) {
      case "instance": {
        const idp = await ctx.client.read(
          ctx,
          request.fhirVersion,
          "IdentityProvider",
          request.id,
        );

        if (!idp) {
          throw new OperationError(outcomeFatal("not-found", "IDP not found"));
        }

        return {
          information: [
            {
              name: "Redirect URL",
              value: new URL(
                `/w/${ctx.tenant}/oidc/federated/${idp.id}/callback`,
                process.env.API_URL,
              ).toString(),
            },
          ],
        };
      }
      default: {
        throw new OperationError(
          outcomeFatal(
            "invalid",
            "Operation must be invoked on IdentityProvider instance.",
          ),
        );
      }
    }
  },
);
