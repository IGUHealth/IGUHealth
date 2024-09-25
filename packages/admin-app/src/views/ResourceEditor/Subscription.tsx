import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { FHIRCodeEditable, Input, Select } from "@iguhealth/components";
import {
  ConcreteType,
  ResourceType,
  Subscription,
  code,
  id,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";

import ResourceEditorComponent, {
  AdditionalContent,
} from "../../components/ResourceEditor";
import { getClient } from "../../db/client";

interface SubscriptionEditorProps extends AdditionalContent {
  resource: Subscription | undefined;
  onChange: NonNullable<AdditionalContent["onChange"]>;
}

function ChannelParameters({
  channel,
  resource,
  onChange,
}: Readonly<{
  channel: code | undefined;
  resource: Subscription | undefined;
  onChange: React.Dispatch<React.SetStateAction<ConcreteType | undefined>>;
}>) {
  switch (channel) {
    case "rest-hook":
    case "message": {
      return (
        <>
          <Input
            required
            label="Endpoint"
            value={resource?.channel.endpoint}
            onChange={(e) =>
              onChange({
                ...resource,
                resourceType: "Subscription",
                channel: {
                  ...resource?.channel,
                  endpoint: e.target.value,
                },
              } as Subscription)
            }
          />

          <div>
            <div>
              <label>Headers</label>
            </div>
            <div className="space-y-1">
              {resource?.channel.header?.map((header, index) => (
                <div key={index} className="relative">
                  <Input
                    value={header}
                    onChange={(e) => {
                      const header = (resource?.channel.header ?? [])
                        .slice(0, index)
                        .concat(
                          e.target.value,
                          (resource?.channel.header ?? []).slice(index + 1),
                        );

                      onChange({
                        ...resource,
                        resourceType: "Subscription",
                        channel: {
                          ...resource?.channel,
                          header: header,
                        },
                      } as Subscription);
                    }}
                  />
                  <div
                    className="absolute top-1 right-1 text-slate-400 cursor-pointer hover:text-slate-500 "
                    onClick={() => {
                      const header = (resource?.channel.header ?? [])
                        .slice(0, index)
                        .concat(
                          (resource?.channel.header ?? []).slice(index + 1),
                        );

                      onChange({
                        ...resource,
                        resourceType: "Subscription",
                        channel: {
                          ...resource?.channel,
                          header: header,
                        },
                      } as Subscription);
                    }}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-1">
              <span
                className="flex items-center cursor-pointer text-xs hover:text-blue-600 text-blue-500"
                onClick={(e) => {
                  onChange({
                    ...resource,
                    resourceType: "Subscription",
                    channel: {
                      ...resource?.channel,
                      header: [...(resource?.channel.header ?? []), ""],
                    },
                  } as Subscription);
                }}
              >
                + Add Header
              </span>
            </div>
          </div>
        </>
      );
    }
    case "operation": {
      return (
        <div>
          <Input
            required
            label="Operation"
            value={
              resource?.channel._type?.extension?.find(
                (e) =>
                  e.url === "https://iguhealth.app/Subscription/operation-code",
              )?.valueCode
            }
            onChange={(e) =>
              onChange({
                ...resource,
                resourceType: "Subscription",
                channel: {
                  ...resource?.channel,
                  _type: {
                    extension: [
                      ...(resource?.channel._type?.extension ?? []).filter(
                        (e) =>
                          e.url !==
                          "https://iguhealth.app/Subscription/operation-code",
                      ),
                      {
                        url: "https://iguhealth.app/Subscription/operation-code" as id,
                        valueCode: e.target.value as code,
                      },
                    ],
                  },
                },
              } as Subscription)
            }
          />
        </div>
      );
    }
  }
}

function SimpleSubscriptionView({
  resource,
  onChange,
}: Readonly<{
  resource: Subscription | undefined;
  onChange: React.Dispatch<React.SetStateAction<ConcreteType | undefined>>;
}>) {
  const client = useRecoilValue(getClient);
  const [channel, setChannel] = useState<
    Subscription["channel"]["type"] | undefined
  >();
  useEffect(() => {
    const channel =
      resource?.channel?.type ??
      resource?.channel?._type?.extension?.find(
        (e) => e.url === "https://iguhealth.app/Subscription/channel-type",
      )?.valueCode;
    setChannel(channel);
  }, [resource]);
  return (
    <div className="space-y-2 p-2">
      <FHIRCodeEditable
        required
        client={client}
        fhirVersion={R4}
        system={"http://hl7.org/fhir/ValueSet/subscription-status" as uri}
        label="Status"
        value={resource?.status}
        onChange={(e) =>
          onChange({
            ...resource,
            resourceType: "Subscription",
            status: e,
          } as Subscription)
        }
      />
      <Input
        label="Criteria"
        required
        value={resource?.criteria}
        onChange={(e) =>
          onChange({
            ...resource,
            resourceType: "Subscription",
            criteria: e.target.value,
          } as Subscription)
        }
      />
      <Input
        label="Reason"
        required
        value={resource?.reason}
        onChange={(e) =>
          onChange({
            ...resource,
            resourceType: "Subscription",
            reason: e.target.value,
          } as Subscription)
        }
      />
      <Select
        required
        label="Channel"
        value={channel}
        options={[
          {
            label: "Rest Hook",
            value: "rest-hook",
          },
          {
            label: "Message",
            value: "message",
          },
          {
            label: "Operation",
            value: "operation",
          },
        ]}
        onChange={(option) => {
          if (option.value === "operation") {
            onChange({
              ...resource,
              resourceType: "Subscription",
              channel: {
                _type: {
                  extension: [
                    {
                      url: "https://iguhealth.app/Subscription/channel-type" as id,
                      valueCode: option.value as code,
                    },
                  ],
                },
              },
            } as Subscription);
          } else {
            onChange({
              ...resource,
              resourceType: "Subscription",
              channel: { type: option.value as code },
            } as Subscription);
          }
        }}
      />
      <ChannelParameters
        channel={channel}
        resource={resource}
        onChange={onChange}
      />
    </div>
  );
}

export default function SubscriptionView({
  id,
  resourceType,
  resource,
  actions,
  structureDefinition,
  onChange,
}: Readonly<SubscriptionEditorProps>) {
  return (
    <ResourceEditorComponent
      id={id as id}
      actions={actions}
      structureDefinition={structureDefinition}
      resourceType={resourceType as ResourceType}
      resource={resource}
      onChange={onChange}
      leftTabs={[
        {
          id: "simple-editor",
          title: "Quick Editor",
          content: (
            <SimpleSubscriptionView resource={resource} onChange={onChange} />
          ),
        },
      ]}
    />
  );
}
