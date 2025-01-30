export * from "./tenant-topics.js";

declare const __topic: unique symbol;
export type ITopic = string & {
  [__topic]: boolean;
};

export type ITopicPattern = RegExp & {
  [__topic]: boolean;
};

declare const __consumer: unique symbol;
export type IConsumerGroupID = string & {
  [__consumer]: boolean;
};
