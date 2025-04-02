import { TenantId } from "@iguhealth/jwt";

import { TenantMessage } from "../provider/interface.js";
import { ITopic, ITopicPattern } from "./index.js";

export type TopicType = "operations" | "error";

export const OperationsTopic: TopicType = "operations";
export const ErrorsTopic: TopicType = "error";

declare const __tenant: unique symbol;
declare const __topicType: unique symbol;
export type TenantTopic<Tenant extends TenantId, Type extends TopicType> = {
  [__tenant]: Tenant;
  [__topicType]: Type;
} & ITopic<TenantMessage>;

export const TenantTopic = <Tenant extends TenantId, Type extends TopicType>(
  tenant: Tenant,
  type: Type,
): TenantTopic<Tenant, Type> =>
  `${tenant}_${type}` as TenantTopic<Tenant, Type>;

export function TENANT_TOPIC_PATTERN(type: TopicType): ITopicPattern {
  return new RegExp(TenantTopic("(.*)" as TenantId, type)) as ITopicPattern;
}

export function meta<Tenant extends TenantId, Type extends TopicType>(
  topic: TenantTopic<Tenant, TopicType>,
): { tenant: Tenant; type: Type } {
  const [tenant, type] = topic.split("_") as [Tenant, Type];
  return { tenant, type };
}
