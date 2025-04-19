import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";

import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import * as queue from "../../providers/interface.js";
import { MessageHandler } from "../types.js";
import { getTenantId } from "./utilities.js";

async function handleMutation(
  ctx: Omit<IGUHealthServerCTX, "user">,
  mutation: queue.Operations[number],
) {
  switch (true) {
    case queue.isOperationType("create", mutation):
    case queue.isOperationType("update", mutation):
    case queue.isOperationType("patch", mutation): {
      await ctx.search.index(
        asRoot(ctx),
        mutation.response.fhirVersion,
        mutation.response.body,
      );
      return;
    }
    case queue.isOperationType("delete", mutation): {
      switch (mutation.response.level) {
        case "instance": {
          await ctx.search.removeIndex(
            asRoot(ctx),
            mutation.response.fhirVersion,
            mutation.response.id,
            mutation.response.resource,
          );
          return;
        }
        case "type":
        case "system": {
          await Promise.all(
            (mutation.response.deletion ?? []).map(async (r) => {
              await ctx.search.removeIndex(
                asRoot(ctx),
                mutation.response.fhirVersion,
                r.id as id,
                r.resourceType,
              );
            }),
          );
        }
      }
    }
  }
}

const searchIndexingHandler: MessageHandler<
  Omit<IGUHealthServerCTX, "user" | "tenant">
> = async (iguhealthServices, { messages }) => {
  for (const message of messages) {
    iguhealthServices.logger.info(
      `[Indexing], Processing message '${message.key?.toString() ?? "[no-key]"}'`,
    );

    const tenant = getTenantId(message);

    if (message.value) {
      const mutations: queue.Operations = message.value as queue.Operations;
      for (const mutation of mutations) {
        await handleMutation({ ...iguhealthServices, tenant }, mutation);
      }
    }
  }
};

export default searchIndexingHandler;
