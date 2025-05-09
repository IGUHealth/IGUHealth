import { IMessage } from "../providers/interface.js";

export * from "./tenant-topics.js";

declare const __topic: unique symbol;
declare const __message_type: unique symbol;
export type ITopic<M extends IMessage<unknown> = IMessage<unknown>> = string & {
  [__topic]: boolean;
  [__message_type]: M;
};

export type ITopicMessage<T> = T extends ITopic<infer M> ? M : never;

export type ITopicPattern = RegExp & {
  [__topic]: boolean;
};

declare const __consumer: unique symbol;
export type IConsumerGroupID = string & {
  [__consumer]: boolean;
};

export const Consumers = <const>{
  Storage: "storage" as IConsumerGroupID,
  SearchIndexing: "search-indexing" as IConsumerGroupID,
  SubscriptionV1: "subscription-v1" as IConsumerGroupID,
};
