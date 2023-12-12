import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useRecoilCallback } from "recoil";
import { basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import {
  StructureDefinition,
  BundleEntry,
  Resource,
  ResourceType,
  id,
} from "@iguhealth/fhir-types/r4/types";
import {
  CodeMirror,
  DropDownMenu,
  Button,
  Tabs,
  Table,
  FHIRGenerativeForm,
} from "@iguhealth/components";

import { getValueSetExpansion } from "../data/terminology";
import { getClient } from "../data/client";

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
      .historyInstance({}, resourceType as ResourceType, id as id)
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
  const setValue = useMemo(
    () => (getResource: (r: Resource) => Resource) => {
      onChange &&
        onChange((resource) => {
          const newResource = getResource(
            resource
              ? resource
              : ({
                  resourceType: structureDefinition?.type,
                } as Resource)
          );
          return newResource;
        });
    },
    [structureDefinition, onChange]
  );

  const expansion = useRecoilCallback(
    ({ snapshot }) =>
      async (url: string) => {
        const valueSetExpansion = await snapshot.getPromise(
          getValueSetExpansion(url)
        );
        return valueSetExpansion;
      },
    []
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
                value={resource}
                structureDefinition={structureDefinition}
                setValue={setValue}
                expand={expansion}
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
