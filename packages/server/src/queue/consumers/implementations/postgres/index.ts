import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import {
  IConsumerGroupID,
  ITopic,
  ITopicPattern,
} from "../../../topics/index.js";
import { Message, MessageHandler } from "../../types.js";
import * as locks from "./locks.js";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function convertPgMessagetoMessage(
  pgMessage: s.sub_queue.JSONSelectable[],
): Message[] {
  return pgMessage.map(
    (m: s.sub_queue.JSONSelectable): Message => ({
      headers: m.headers as Record<string, string>,
      value: m.value,
      key: m.key ?? undefined,
      created_at: m.created_at as string,
      topic_id: m.topic_id,
      offset: m.id.toString(),
    }),
  );
}

export default async function createPGWorker<CTX>(
  pg: db.Queryable,
  topic: ITopicPattern | ITopic,
  groupId: IConsumerGroupID,
  ctx: CTX,
  handler: MessageHandler<CTX>,
) {
  await locks.ensureLocksCreated(pg, [
    {
      type: "queue-loc",
      id: groupId,
      value: {
        isPattern: topic instanceof RegExp,
        topic: topic instanceof RegExp ? topic.source : topic,
        offset: 0,
      },
    },
  ]);

  let isRunning = true;
  const run = async () => {
    while (isRunning) {
      db.transaction(pg, db.IsolationLevel.ReadCommitted, async (tx) => {
        const offsetLock = (
          await locks.getAvailableLocks(pg, "queue-loc", [groupId])
        )[0];
        if (!offsetLock) {
          throw new Error(`No offset lock found for groupId: '${groupId}'`);
        }

        const { topic, offset, isPattern } = offsetLock.value;

        const messages = await db
          .select(
            "sub_queue",
            {
              topic_id: isPattern
                ? db.sql<s.sub_queue.SQL>`${db.self} SIMILAR TO ${db.param(topic.replace(".*", "%"))}`
                : topic,
              id: db.sql<s.sub_queue.SQL>`${db.self} > ${db.param(offset)}`,
            },
            {
              order: [{ by: "id", direction: "ASC" }],
              limit: 50,
            },
          )
          .run(tx);

        const lastOffset = messages[messages.length - 1]?.id ?? offset;
        const groupby = Object.groupBy(messages, (item) => item.topic_id);

        await Promise.all(
          Object.keys(groupby).map(async (topic) => {
            handler(ctx, {
              topic: topic,
              messages: convertPgMessagetoMessage(groupby[topic] ?? []),
            });
          }),
        );

        await locks.updateLock(tx, "queue-loc", groupId, {
          value: { ...offsetLock.value, offset: lastOffset },
        });
      });

      await wait(50);
    }
  };

  // Run on seperate.
  setTimeout(() => run());

  return () => {
    isRunning = false;
  };
}
