import { Batch, KafkaMessage } from "kafkajs";

export type MessageHandler<CTX> = (
  iguhealthServices: CTX,
  input: { topic: string; partition: number; message: KafkaMessage },
) => Promise<void>;

export type BatchHandler<CTX> = (
  iguhealthServices: CTX,
  input: { batch: Batch },
) => Promise<void>;

export type Handler<CTX> =
  | { eachMessage: MessageHandler<CTX> }
  | { eachBatch: BatchHandler<CTX> };
