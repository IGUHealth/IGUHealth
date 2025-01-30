import { ITopic } from "./index.js";

export type DynamicTopic = ITopic & {
  __dynamic: true;
};

export const DYNAMIC_TOPIC: DynamicTopic = "dynamic" as DynamicTopic;
