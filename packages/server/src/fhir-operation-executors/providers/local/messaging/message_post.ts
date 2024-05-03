import { Kafka } from "kafkajs";

import { FHIRRequest } from "@iguhealth/client/types";
import { code } from "@iguhealth/fhir-types/r4/types";
import { IguhealthMessagePost } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../fhir-api/types.js";
import InlineOperation from "../interface.js";

const IguhealthMessagePostInvoke = InlineOperation(
  IguhealthMessagePost.Op,
  async (ctx: FHIRServerCTX, request: FHIRRequest, input) => {
    switch (request.level) {
      case "instance": {
        switch (request.resourceType) {
          case "MessageTopic": {
            const topicAndBroker = await ctx.client.search_type(
              ctx,
              request.fhirVersion,
              "MessageTopic",
              [
                {
                  name: "_id",
                  value: [request.id],
                },
                {
                  name: "_include",
                  value: ["MessageTopic:broker"],
                },
              ],
            );

            return {
              result: topicAndBroker.resources?.[1]?.id as unknown as code,
            };
          }
          default: {
            throw new OperationError(
              outcomeError("invalid", "Invalid resource type"),
            );
          }
        }
      }
      default:
        throw new OperationError(outcomeError("invalid", "Invalid level"));
    }
  },
);

export default IguhealthMessagePostInvoke;
