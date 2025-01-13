import { AsynchronousClient } from "@iguhealth/client";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { R4, R4B } from "@iguhealth/fhir-types/versions";
import { Operation } from "@iguhealth/operation-execution";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../fhir-server/types.js";
import { resolveOperationDefinition } from "../utilities.js";
import { CustomCodeExecutor } from "./interface.js";

function middleware(
  provider: CustomCodeExecutor,
): MiddlewareAsync<unknown, IGUHealthServerCTX> {
  return createMiddlewareAsync<unknown, IGUHealthServerCTX>([
    async (context) => {
      try {
        switch (context.request.fhirVersion) {
          case R4B: {
            throw new OperationError(
              outcomeFatal("invalid", "FHIR version 4.3 is not supported"),
            );
          }
          case R4: {
            switch (context.request.type) {
              case "invoke-request": {
                const operationDefinition = await resolveOperationDefinition(
                  context.ctx.client,
                  context.ctx,
                  context.request.fhirVersion,
                  context.request.operation,
                );

                const op = new Operation<
                  Record<string, unknown>,
                  Record<string, unknown>
                >(operationDefinition);

                return {
                  ...context,
                  response: await provider.execute(
                    context.ctx,
                    op,
                    context.request,
                  ),
                };
              }
              default:
                throw new OperationError(
                  outcomeFatal(
                    "invalid",
                    `Invocation client only supports invoke-request not '${context.request.type}'`,
                  ),
                );
            }
          }
        }
      } catch (e) {
        context.ctx.logger.error(e);
        throw e;
      }
    },
  ]);
}

export default function createOperationExecutioner(
  provider: CustomCodeExecutor,
): AsynchronousClient<unknown, IGUHealthServerCTX> {
  return new AsynchronousClient<unknown, IGUHealthServerCTX>(
    {},
    middleware(provider),
  );
}
