export * from "./tenant-topics.js";

declare const __topic: unique symbol;
export type Topic = string & {
  [__topic]: boolean;
};

export type TopicPattern = RegExp & {
  [__topic]: boolean;
};

declare const __consumer: unique symbol;
export type ConsumerGroupID = string & {
  [__consumer]: boolean;
};
