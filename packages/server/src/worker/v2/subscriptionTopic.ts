import { randomUUID } from "crypto";

import { Basic } from "@iguhealth/fhir-types/r4/types";
import { SubscriptionTopic } from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION, R4 } from "@iguhealth/fhir-types/versions";

type SubscriptionTopicVersion<FHIR_VERSION> = FHIR_VERSION extends R4
  ? Basic
  : SubscriptionTopic;

function retrieveSubscriptionTopics<Version extends FHIR_VERSION>(
  fhirVersion: Version,
): SubscriptionTopicVersion<Version>[] {
  switch (fhirVersion) {
    case R4:
      return [];
    default:
      throw new Error("Invalid FHIR version");
  }
}

/**
 * Loops over history and filters to send messages to queue.
 * @param workerID The workers ID for logging
 * @param fhirVersion the FHIR version to use
 * @param loopInterval the loop interval in milliseconds
 */
export default async function subscriptionTopicWorker(
  _workerID = randomUUID(),
  _fhirVersion: FHIR_VERSION = R4,
  loopInterval = 500,
) {
  let isRunning = true;

  while (isRunning) {
    try {
      console.log("test");
    } finally {
      await new Promise((resolve) => setTimeout(resolve, loopInterval));
    }
  }

  return () => {
    isRunning = false;
  };
}
