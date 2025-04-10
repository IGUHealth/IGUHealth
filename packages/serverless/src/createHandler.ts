/* eslint-disable @typescript-eslint/no-explicit-any */

import Ajv from "ajv";
import serverless from "serverless-http";

import { createConsumerServices } from "@iguhealth/server/consumer/services";
import { Message, MessageHandler } from "@iguhealth/server/consumer/types";

import { QueueEvent } from "./schemas/worker-event.js";
import workerEventSchema from "./schemas/worker-event.json" with { type: "json" };

const ajv = new Ajv.default({});
const eventValidator = ajv.compile(workerEventSchema);

function convertEvent(event: QueueEvent): Message {
  return {
    headers: event.headers as Record<string, string>,
    value: event.value,
    key: event.key ?? undefined,
    created_at: event.created_at,
    topic_id: event.topic_id,
    offset: event.id.toString(),
  };
}

function validateEvent(event: any): event is QueueEvent {
  const envValid = eventValidator(event);
  if (!envValid) throw new Error(ajv.errorsText(eventValidator.errors));
  return true;
}

export default async function createHandler(
  handler: MessageHandler<Awaited<ReturnType<typeof createConsumerServices>>>,
): Promise<serverless.Handler> {
  const services = await createConsumerServices();

  return async (event) => {
    if (validateEvent(event)) {
      const message = convertEvent(event);
      await handler(services, { topic: message.topic_id, messages: [message] });

      return {
        message: "ok",
      };
    }
    throw new Error("Invalid event");
  };
}
