export interface Message {
  topic_id: string;
  key?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  headers?: Record<string, string>;
  created_at: string;
  offset: string;
}

export type MessageHandler<CTX> = (
  iguhealthServices: CTX,
  input: { topic: string; messages: Message[] },
) => Promise<void>;
