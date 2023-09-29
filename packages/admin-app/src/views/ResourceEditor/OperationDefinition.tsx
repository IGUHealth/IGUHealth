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

export default function DefaultResourceEditorView() {
  const client = useRecoilValue(getClient);
  const [operation, setOperation] =
    React.useState<OperationDefinition>(DEFAULT_OPERATION);
  const navigate = useNavigate();

  const { resourceType, id } = useParams();

  useEffect(() => {
    console.log(resourceType, id);
    if (id !== "new")
      client
        .read({}, resourceType as ResourceType, id as string)
        .then((response) => {
          setOperation(response as OperationDefinition);
        });
  }, [resourceType, id, setOperation]);

  console.log(JSON.stringify(operation));

  const code: string =
    operation?.extension?.find(
      (e) =>
        e.url ===
        "https://iguhealth.github.io/fhir-operation-definition/operation-code"
    ) !== undefined
      ? operation?.extension?.filter(
          (e) =>
            e.url ===
            "https://iguhealth.github.io/fhir-operation-definition/operation-code"
        )[0].valueString || ""
      : "";

  return (
    <ResourceEditorComponent
      leftSide={[
        {
          id: 0,
          title: "Code",
          content: (
            <OperationCodeEditor
              value={code}
              setValue={(v: string) =>
                setOperation({
                  ...operation,
                  extension: [
                    ...(operation?.extension?.filter(
                      (e) =>
                        e.url !==
                        "https://iguhealth.github.io/fhir-operation-definition/operation-code"
                    ) || []),
                    {
                      url: "https://iguhealth.github.io/fhir-operation-definition/operation-code",
                      valueString: v,
                    },
                  ],
                })
              }
            />
          ),
        },
      ]}
    />
  );
}
