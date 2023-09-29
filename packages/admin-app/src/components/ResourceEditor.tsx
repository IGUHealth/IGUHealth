import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
// import { javascript } from "@codemirror/lang-javascript";

import {
  BundleEntry,
  Resource,
  OperationOutcome,
  ResourceType,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { Base } from "@iguhealth/components";

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
      <Base.CodeMirror
        extensions={extensions}
        value={value}
        theme={{
          "&": {
            height: "100%",
            width: "100%",
          },
        }}
        onChange={(value, _vu) => {
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
    <Base.Table
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
  onChange?: (resource: Resource) => void;
  actions: Parameters<typeof Base.DropDownMenu>[0]["links"];
  leftTabs?: Parameters<typeof Base.Tabs>[0]["tabs"];
  rightTabs?: Parameters<typeof Base.Tabs>[0]["tabs"];
}
export default function ResourceEditorComponent({
  id,
  actions,
  resourceType,
  resource,
  onChange = (r: Resource) => {},
  leftTabs: leftSide = [],
  rightTabs: rightSide = [],
}: AdditionalContent) {
  const client = useRecoilValue(getClient);
  //const [value, setValue] = React.useState("");
  const navigate = useNavigate();

  // const { resourceType, id } = useParams();

  // useEffect(() => {
  //   if (id !== "new")
  //     client
  //       .read({}, resourceType as ResourceType, id as id)
  //       .then((response) => {
  //         setValue(JSON.stringify(response, null, 2));
  //         return response;
  //       });
  // }, [resourceType, id]);

  return (
    <Base.Tabs
      tabs={[
        ...leftSide,
        ...[
          {
            id: 1,
            title: "Editor",
            content: (
              <JSONEditor
                value={JSON.stringify(resource, null, 2)}
                setValue={(v) => {
                  try {
                    const resource = JSON.parse(v);
                    onChange(resource);
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
                id: 2,
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
        <Base.DropDownMenu links={actions}>
          <Base.Button
            buttonType="secondary"
            buttonSize="small"
            onClick={(_e) => {}}
          >
            <div className="flex items-center">
              <span>Actions</span> <ChevronDownIcon className="ml-1 w-3 h-3" />
            </div>
          </Base.Button>
        </Base.DropDownMenu>
      }
    />
  );
}
