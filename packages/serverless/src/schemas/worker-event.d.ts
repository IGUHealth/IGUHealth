/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface QueueEvent {
  /**
   * The id of the event
   */
  id: string;
  /**
   * Message headers.
   */
  headers: {
    [k: string]: unknown;
  };
  /**
   * Value of the event. This will be the response request.
   */
  value: {
    [k: string]: unknown;
  };
  /**
   * The message key. Similiar to kafka message.
   */
  key?: string;
  /**
   * When the event was created.
   */
  created_at: string;
  /**
   * The topic for the given message.
   */
  topic_id: string;
}
