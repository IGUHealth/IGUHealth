import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import {
  CreateResponse,
  FHIRResponse,
  InstanceDeleteResponse,
  PatchResponse,
  ResponseType,
  UpdateResponse,
} from "@iguhealth/client/lib/types";
import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS, TOKEN_RESOURCE_TYPES, TenantId } from "@iguhealth/jwt";

import { toFHIRVersion } from "../../fhir-clients/utilities/version.js";
import { IGUHealthServices } from "../../fhir-server/types.js";
import { StorageTransaction } from "../../transactions.js";
import { wait } from "../../utilities.js";
import { Operations } from "../implementations/providers/interface.js";
import {
  OperationsTopic,
  TenantTopic,
} from "../implementations/topics/tenant-topics.js";

function toResponse(
  row: s.resources.JSONSelectable,
): FHIRResponse<FHIR_VERSION, s.fhir_method> {
  const responseType = ResponseType(row.fhir_method);
  switch (responseType) {
    case "patch-response":
    case "update-response":
    case "create-response": {
      return {
        id: row.id,
        fhirVersion: toFHIRVersion(row.fhir_version),
        level: "instance",
        type: responseType,
        resource: row.resource_type as ResourceType<FHIR_VERSION>,
        body: row.resource as unknown as Resource<
          FHIR_VERSION,
          AllResourceTypes
        >,
      } as
        | UpdateResponse<FHIR_VERSION>
        | CreateResponse<FHIR_VERSION>
        | PatchResponse<FHIR_VERSION>;
    }
    case "delete-response": {
      return {
        id: row.id as id,
        fhirVersion: toFHIRVersion(row.fhir_version),
        level: "instance",
        type: "delete-response",
        resource: row.resource_type as ResourceType<FHIR_VERSION>,
        body: row.resource as unknown as Resource<
          FHIR_VERSION,
          AllResourceTypes
        >,
      } as InstanceDeleteResponse<FHIR_VERSION>;
    }
  }
}

const STORE_QUEUE = "push-to-queue";

export async function pushFromStoreHandler(ctx: IGUHealthServices) {
  StorageTransaction(ctx, db.IsolationLevel.ReadCommitted, async (ctx) => {
    const currentSequence = (await ctx.lock.get("system", [STORE_QUEUE]))[0]
      ?.value;

    if (currentSequence === undefined) return;

    const next = await ctx.store.fhir.getSequence(currentSequence.offset, 50);
    if (next.length === 0) {
      return;
    }

    const tenantResults = Object.groupBy(next, (item) => item.tenant);

    for (const tenant of Object.keys(tenantResults)) {
      const tenantMessages = tenantResults[tenant];
      const operations: Operations = (tenantMessages ?? [])?.map(
        (item): Operations[number] => {
          return {
            fhirVersion: toFHIRVersion(item.fhir_version),
            type: item.fhir_method,
            response: toResponse(item),
            author: {
              [CUSTOM_CLAIMS.RESOURCE_TYPE]:
                item.author_type as TOKEN_RESOURCE_TYPES,
              [CUSTOM_CLAIMS.RESOURCE_ID]: item.author_id as id,
            },
          };
        },
      );
      await ctx.queue.sendTenant(
        tenant as TenantId,
        TenantTopic(tenant as TenantId, OperationsTopic),
        [
          {
            value: operations,
          },
        ],
      );
    }

    const nextOffset = next[next.length - 1]?.sequence;
    await ctx.lock.update("system", STORE_QUEUE, {
      id: STORE_QUEUE,
      type: "system",
      value: {
        ...currentSequence,
        offset: nextOffset,
      },
    });
  });
}

export async function pushFromStoreWorker<CTX extends IGUHealthServices>(
  ctx: CTX,
) {
  let isRunning = true;
  await ctx.lock.create([
    { id: STORE_QUEUE, type: "system", value: { offset: 0 } },
  ]);

  const run = async () => {
    while (isRunning) {
      await pushFromStoreHandler(ctx);
      await wait(50);
    }
  };

  // Run on seperate.
  setTimeout(() => run());

  return () => {
    isRunning = false;
  };
}
