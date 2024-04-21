import { json } from "@codemirror/lang-json";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { basicSetup } from "codemirror";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import {
  Button,
  CodeMirror,
  DropDownMenu,
  FHIRGenerativeForm,
  Table,
  Tabs,
} from "@iguhealth/components";
import {
  BundleEntry,
  Resource,
  ResourceType,
  StructureDefinition,
  id,
} from "@iguhealth/fhir-types/r4/types";

import { getClient } from "../db/client";

const extensions = [basicSetup, json()];

function JSONEditor({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <div className="flex flex-1 border overflow-auto">
      <CodeMirror
        extensions={extensions}
        value={value}
        theme={{
          "&": {
            height: "100%",
            width: "100%",
          },
        }}
        onChange={(value) => {
          setValue(value);
        }}
      />
    </div>
  );
}

function ResourceHistory() {
  const client = useRecoilValue(getClient);
  const { resourceType, id } = useParams();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<BundleEntry[]>([]);

  useEffect(() => {
    setLoading(true);
    client
      .historyInstance({}, "4.0", resourceType as ResourceType, id as id)
      .then((response) => {
        setHistory(response);
        setLoading(false);
        return response;
      });
  }, [resourceType, id, setHistory]);

  return (
    <Table
      isLoading={loading}
      data={history || []}
      columns={[
        {
          name: "Interaction",
          selector: "$this.request.method",
          selectorType: "fhirpath",
        },
        {
          name: "Version",
          selector: "$this.resource.meta.versionId",
          selectorType: "fhirpath",
        },
        {
          name: "Author",
          selector:
            "$this.resource.meta.extension.where(url='https://iguhealth.app/author').valueString",
          selectorType: "fhirpath",
        },
        {
          name: "Updated at",
          selector: "$this.resource.meta.lastUpdated",
          selectorType: "fhirpath",
        },
      ]}
    />
  );
}

export interface AdditionalContent {
  id: id;
  resourceType: ResourceType;
  resource: Resource | undefined;
  structureDefinition: StructureDefinition | undefined;
  onChange?: React.Dispatch<React.SetStateAction<Resource | undefined>>;
  actions: Parameters<typeof DropDownMenu>[0]["links"];
  leftTabs?: Parameters<typeof Tabs>[0]["tabs"];
  rightTabs?: Parameters<typeof Tabs>[0]["tabs"];
}
export default function ResourceEditorComponent({
  id,
  actions,
  resource,
  structureDefinition,
  onChange,
  leftTabs: leftSide = [],
  rightTabs: rightSide = [],
}: AdditionalContent) {
  const client = useRecoilValue(getClient);
  const setValue = useMemo(
    () => (getResource: (r: Resource) => Resource) => {
      onChange &&
        onChange((resource) => {
          const newResource = getResource(
            resource
              ? resource
              : ({
                  resourceType: structureDefinition?.type,
                } as Resource),
          );
          return newResource;
        });
    },
    [structureDefinition, onChange],
  );

  return (
    <Tabs
      tabs={[
        ...leftSide,
        ...[
          {
            id: "editor",
            title: "Editor",
            content: structureDefinition && (
              <FHIRGenerativeForm
                fhirVersion="4.0"
                value={resource}
                structureDefinition={structureDefinition}
                setValue={setValue}
                client={client}
              />
            ),
          },
          {
            id: "json",
            title: "JSON",
            content: (
              <JSONEditor
                value={JSON.stringify(resource, null, 2)}
                setValue={(v) => {
                  try {
                    const resource = JSON.parse(v);
                    onChange && onChange(resource);
                  } catch (e) {
                    return;
                  }
                }}
              />
            ),
          },
        ],
        ...(id !== "new"
          ? [
              {
                id: "history",
                title: "History",
                content: <ResourceHistory />,
              },
            ]
          : []),
        // {
        //   id: 1,
        //   title: "Audit events",
        //   content: <span> Audit Events </span>,
        // },
        ...rightSide,
      ]}
      rightSide={
        <DropDownMenu links={actions}>
          <Button buttonType="secondary" buttonSize="small" onClick={() => {}}>
            <div className="flex items-center">
              <span>Actions</span> <ChevronDownIcon className="ml-1 w-3 h-3" />
            </div>
          </Button>
        </DropDownMenu>
      }
    />
  );
}
