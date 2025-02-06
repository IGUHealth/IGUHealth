import { SubscribeMessage } from "../interface.js";
import { ITopic } from "./index.js";

declare const __dynamic: unique symbol;
export type SubscribeTopic = ITopic<SubscribeMessage> & {
  [__dynamic]: true;
};

export const DYNAMIC_TOPIC: SubscribeTopic = "dynamic" as SubscribeTopic;
