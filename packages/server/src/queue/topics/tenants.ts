import { fhir_version } from "zapatos/schema";

import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import {
  toDBFHIRVersion,
  toFHIRVersion,
} from "../../fhir-clients/utilities/version.js";
import { FHIRMessage } from "../interface.js";
import { ITopic, ITopicPattern } from "./index.js";

export type TopicType = "operations" | "error";

export const OperationsTopic: TopicType = "operations";
export const ErrorsTopic: TopicType = "error";

declare const __tenant: unique symbol;
declare const __topicType: unique symbol;
declare const __fhirVersion: unique symbol;
export type FHIRTopic<
  Tenant extends TenantId,
  Version extends FHIR_VERSION,
  Type extends TopicType,
> = {
  [__tenant]: Tenant;
  [__topicType]: Type;
  [__fhirVersion]: Version;
} & ITopic<FHIRMessage<Version>>;

function _template(tenant: TenantId, version: string, type: TopicType): string {
  return `${tenant}_${version}_${type}`;
}

export const FHIRTopic = <
  Tenant extends TenantId,
  Version extends FHIR_VERSION,
  Type extends TopicType,
>(
  tenant: Tenant,
  fhir_version: Version,
  type: Type,
): FHIRTopic<Tenant, Version, Type> =>
  _template(tenant, toDBFHIRVersion(fhir_version), type) as FHIRTopic<
    Tenant,
    Version,
    Type
  >;

export function FHIR_TOPIC_PATTERN(
  type: TopicType,
  fhirVersion?: fhir_version,
): ITopicPattern {
  return new RegExp(
    _template("(.*)" as TenantId, fhirVersion ?? "(.*)", type),
  ) as ITopicPattern;
}

export function meta<
  Tenant extends TenantId,
  Version extends FHIR_VERSION,
  Type extends TopicType,
>(
  topic: FHIRTopic<Tenant, Version, TopicType>,
): { tenant: Tenant; type: Type; fhirVersion: Version } {
  const [tenant, fhirVersion, type] = topic.split("_") as [
    Tenant,
    fhir_version,
    Type,
  ];
  return { tenant, type, fhirVersion: toFHIRVersion(fhirVersion) as Version };
}
