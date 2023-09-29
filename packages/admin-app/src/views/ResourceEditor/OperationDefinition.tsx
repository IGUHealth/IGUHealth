import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { insertTab, indentLess } from "@codemirror/commands";
import { keymap } from "@codemirror/view";

import {
  OperationDefinition,
  ResourceType,
  id,
  Resource,
} from "@iguhealth/fhir-types/r4/types";
import { Base } from "@iguhealth/components";

import { getClient } from "../../data/client";
import ResourceEditorComponent from "../../components/ResourceEditor";

const extensions = [
  basicSetup,
  javascript(),
  keymap.of([
    {
      key: "Tab",
      preventDefault: true,
      run: insertTab,
    },
    {
      key: "Shift-Tab",
      preventDefault: true,
      run: indentLess,
    },
  ]),
];

function OperationCodeEditor({
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

const DEFAULT_OPERATION: OperationDefinition = {
  resourceType: "OperationDefinition",
  status: "draft",
  kind: "operation",
  name: "Operation",
  code: "new",
  system: true,
  type: false,
  instance: false,
};

interface OperationEditorProps {
  id: id;
  resourceType: ResourceType;
  resource: OperationDefinition | undefined;
  onChange?: (resource: Resource) => void;
}

export default function OperationEditor({
  id,
  resourceType,
  resource,
  onChange,
}: OperationEditorProps) {
  const code: string =
    resource?.extension?.find(
      (e) =>
        e.url ===
        "https://iguhealth.github.io/fhir-operation-definition/operation-code"
    ) !== undefined
      ? resource?.extension?.filter(
          (e) =>
            e.url ===
            "https://iguhealth.github.io/fhir-operation-definition/operation-code"
        )[0].valueString || ""
      : "";

  return (
    <ResourceEditorComponent
      id={id as string}
      resourceType={resourceType as ResourceType}
      resource={resource}
      onChange={onChange}
      leftSide={[
        {
          id: 0,
          title: "Code",
          content: (
            <OperationCodeEditor
              value={code}
              setValue={(v: string) =>
                onChange &&
                onChange({
                  ...resource,
                  resourceType: "OperationDefinition",
                  extension: [
                    ...(resource?.extension?.filter(
                      (e) =>
                        e.url !==
                        "https://iguhealth.github.io/fhir-operation-definition/operation-code"
                    ) || []),
                    {
                      url: "https://iguhealth.github.io/fhir-operation-definition/operation-code",
                      valueString: v,
                    },
                  ],
                } as OperationDefinition)
              }
            />
          ),
        },
      ]}
    />
  );
}
