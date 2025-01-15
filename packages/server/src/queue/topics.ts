import { TenantId } from "@iguhealth/jwt";

export type TopicType = "operations" | "error";

declare const __tenant: unique symbol;
declare const __topicType: unique symbol;
export type TenantTopic<
  Tenant extends TenantId,
  Type extends TopicType,
> = `${Tenant}_${Type}` & {
  [__tenant]: Tenant;
  [__topicType]: Type;
};

export const Topic = <Tenant extends TenantId, Type extends TopicType>(
  tenant: Tenant,
  type: Type,
): TenantTopic<Tenant, Type> =>
  `${tenant}_${type}` as TenantTopic<Tenant, Type>;

export function TOPIC_PATTERN(type: TopicType): RegExp {
  return new RegExp(Topic("(.*)" as TenantId, type));
}

export function meta<Tenant extends TenantId, Type extends TopicType>(
  topic: TenantTopic<Tenant, TopicType>,
): { tenant: Tenant; type: Type } {
  const [tenant, type] = topic.split("_") as [Tenant, Type];
  return { tenant, type };
}
