/* eslint-disable @typescript-eslint/no-explicit-any */
import serverless from "serverless-http";

import { createConsumerServices } from "@iguhealth/server/consumer/services";
import { Message, MessageHandler } from "@iguhealth/server/consumer/types";

function convertEvent(event: any): Message {
  return {
    headers: event.headers as Record<string, string>,
    value: event.value,
    key: event.key ?? undefined,
    created_at: event.created_at as string,
    topic_id: event.topic_id,
    offset: event.id.toString(),
  };
}

export default async function createHandler(
  handler: MessageHandler<Awaited<ReturnType<typeof createConsumerServices>>>,
): Promise<serverless.Handler> {
  const services = await createConsumerServices();

  return async (event) => {
    const message = convertEvent(event);
    await handler(services, { topic: message.topic_id, messages: [message] });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "ok" }),
    };
  };
}
