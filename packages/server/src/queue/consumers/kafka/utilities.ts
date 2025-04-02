import { KafkaMessage } from "kafkajs";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { id } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

export function associateResourceVersionId<
  Version extends FHIR_VERSION,
  Type extends AllResourceTypes,
>(resource: Resource<Version, Type>, versionId: id): Resource<Version, Type> {
  return { ...resource, meta: { ...resource.meta, versionId } } as Resource<
    Version,
    Type
  >;
}

/**
 * Given a kafka message, derive a version_id.
 * @param message Kafka Message
 * @returns version_id
 */
export function deriveKafkaVersionId(
  partition: number,
  message: KafkaMessage,
): id {
  if (!message.offset) {
    throw new Error("Kafka message does not have an offset.");
  }

  return `kafka-${partition}-${message.offset}` as id;
}

/**
 * Associate the version_id from the Kafka message to the insertion.
 * @param message the Kafka message
 * @param mutation the insertion
 * @returns insertion
 */
export function associateVersionIdFromKafkaMessage(
  partition: number,
  message: KafkaMessage,
  mutation: s.resources.Insertable,
): s.resources.Insertable {
  const versionId = deriveKafkaVersionId(partition, message);
  let returnVal = { ...mutation, version_id: versionId };
  if (mutation.resource) {
    const resource: Resource<FHIR_VERSION, AllResourceTypes> =
      mutation.resource as unknown as Resource<FHIR_VERSION, AllResourceTypes>;

    returnVal = {
      ...returnVal,
      resource: associateResourceVersionId(
        resource,
        versionId,
      ) as unknown as db.JSONObject,
    };
  }
  return returnVal;
}

export function getTenantId(message: KafkaMessage): TenantId {
  const tenantId = message.headers?.tenant?.toString() as TenantId | undefined;

  if (!tenantId) {
    throw new Error("Tenant ID not found in message headers");
  }

  return tenantId;
}
