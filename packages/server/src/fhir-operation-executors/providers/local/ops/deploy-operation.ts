import { FHIRRequest } from "@iguhealth/client/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthDeployOperation } from "@iguhealth/generated-ops/r4";
import { Operation } from "@iguhealth/operation-execution";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../fhir-api/types.js";
import { CustomCodeExecutor } from "../../interface.js";
import InlineOperation from "../interface.js";

export function createDeployOperation(
  provider: CustomCodeExecutor,
): ReturnType<typeof InlineOperation> {
  return InlineOperation(
    IguhealthDeployOperation.Op,
    async (ctx: IGUHealthServerCTX, request: FHIRRequest, input) => {
      switch (request.level) {
        case "instance": {
          switch (request.resource) {
            case "OperationDefinition": {
              const operationDefinition = await ctx.client.read(
                ctx,
                R4,
                request.resource,
                request.id,
              );
              if (!operationDefinition) {
                throw new OperationError(
                  outcomeError("exception", "Operation not found"),
                );
              }
              const environment = (input.environment ?? []).reduce(
                (record, current) => ({
                  ...record,
                  [current.name]: current.value,
                }),
                {},
              );

              return provider.deploy(
                ctx,
                new Operation<Record<string, unknown>, Record<string, unknown>>(
                  operationDefinition,
                ),
                environment,
                input.code,
              );
            }
            default: {
              throw new OperationError(
                outcomeError("invalid", "Invalid resource"),
              );
            }
          }
        }
        default: {
          throw new OperationError(outcomeError("invalid", "Invalid level"));
        }
      }
    },
  );
}
