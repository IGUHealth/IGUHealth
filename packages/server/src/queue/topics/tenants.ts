export type TopicType = "operations" | "error";

export const OperationsTopic: TopicType = "operations";
export const ErrorsTopic: TopicType = "error";

declare const __topicType: unique symbol;
export type OperationTopic<Type extends TopicType> = `${Type}` & {
  [__topicType]: Type;
};

export const Topic = <Type extends TopicType>(
  type: Type,
): OperationTopic<Type> => `${type}` as OperationTopic<Type>;

export function meta<Type extends TopicType>(
  topic: OperationTopic<TopicType>,
): { type: Type } {
  const [type] = topic.split("_") as [Type];
  return { type };
}
