import { KafkaMessage } from "kafkajs";

export type MessageHandler<CTX> = (
  iguhealthServices: CTX,
  { message }: { topic: string; partition: number; message: KafkaMessage },
) => Promise<void>;
