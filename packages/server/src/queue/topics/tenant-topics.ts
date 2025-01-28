import { TenantId } from "@iguhealth/jwt";
import { Topic, TopicPattern } from "./index.js";

export type TopicType = "operations" | "error";

export const OperationsTopic: TopicType = "operations";
export const ErrorsTopic: TopicType = "error";

declare const __tenant: unique symbol;
declare const __topicType: unique symbol;
export type TenantTopic<
  Tenant extends TenantId,
  Type extends TopicType,
> = `${Tenant}_${Type}` & {
  [__tenant]: Tenant;
  [__topicType]: Type;
} & Topic;

export const TenantTopic = <Tenant extends TenantId, Type extends TopicType>(
  tenant: Tenant,
  type: Type,
): TenantTopic<Tenant, Type> =>
  `${tenant}_${type}` as TenantTopic<Tenant, Type>;

export function TENANT_TOPIC_PATTERN(type: TopicType): TopicPattern {
  return new RegExp(TenantTopic("(.*)" as TenantId, type)) as TopicPattern;
}

export function meta<Tenant extends TenantId, Type extends TopicType>(
  topic: TenantTopic<Tenant, TopicType>,
): { tenant: Tenant; type: Type } {
  const [tenant, type] = topic.split("_") as [Tenant, Type];
  return { tenant, type };
}
