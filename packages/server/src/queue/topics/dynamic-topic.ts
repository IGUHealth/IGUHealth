import { DynamicMessage } from "../interface.js";
import { ITopic } from "./index.js";

export type DynamicTopic = ITopic<DynamicMessage> & {
  __dynamic: true;
};

export const DYNAMIC_TOPIC: DynamicTopic = "dynamic" as DynamicTopic;
