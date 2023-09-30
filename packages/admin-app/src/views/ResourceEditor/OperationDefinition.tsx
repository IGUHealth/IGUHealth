import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { insertTab, indentLess } from "@codemirror/commands";
import { keymap } from "@codemirror/view";

import { Operation } from "@iguhealth/operation-execution";
import {
  OperationOutcome,
  OperationDefinition,
  ResourceType,
  id,
  AuditEvent,
  Resource,
} from "@iguhealth/fhir-types/r4/types";
import { Base } from "@iguhealth/components";

import { getClient } from "../../data/client";
import ResourceEditorComponent, {
  AdditionalContent,
} from "../../components/ResourceEditor";

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

function OperationAuditEvents({ operationId }: { operationId: string }) {
  const client = useRecoilValue(getClient);
  const [loading, setLoading] = useState(true);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    setLoading(true);
    client
      .search_type({}, "AuditEvent", [{ name: "entity", value: [operationId] }])
      .then((response) => {
        setAuditEvents(response.resources);
        setLoading(false);
        return response;
      });
  }, [operationId, setAuditEvents]);

  return (
    <Base.Table
      isLoading={loading}
      data={auditEvents || []}
      columns={[
        {
          name: "Outcome",
          selector: "$this.outcome",
          selectorType: "fhirpath",
        },
        {
          name: "Agent",
          selector: "$this.agent.name",
          selectorType: "fhirpath",
        },
        {
          name: "Description",
          selector: "$this.outcomeDesc",
          selectorType: "fhirpath",
        },
      ]}
    />
  );
}

interface OperationEditorProps extends AdditionalContent {
  resource: OperationDefinition | undefined;
}

const InvocationModal = ({ setOpen }: any) => {
  const [parameters, setParameters] = useState("{}");
  return (
    <div className="flex flex-col h-56 w-full">
      <div className="flex flex-1 border">
        <Base.CodeMirror
          extensions={[basicSetup, json()]}
          value={parameters}
          theme={{
            "&": {
              height: "100%",
              width: "100%",
            },
          }}
          onChange={(value, _vu) => {
            setParameters(value);
          }}
        />
      </div>

      <div className="mt-1 flex justify-end">
        <Base.Button
          buttonType="secondary"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          Close
        </Base.Button>
      </div>
    </div>
  );
};

// onClick: () => {
//   try {
//     const invocation = client.invoke_system(
//       new Operation(resource as OperationDefinition),
//       {},
//       { payload: { resourceType: "Patient" } }
//     );
//     Base.Toaster.promise(invocation, {
//       loading: "Invocation",
//       success: (success) =>
//         `Invocation succeeded ${(success as Resource).resourceType}`,
//       error: (error) => {
//         console.log(error);
//         const message = (error.operationOutcome as OperationOutcome).issue
//           .map((issue) => issue.diagnostics)
//           .join("\n");

//         return message;
//       },
//     });
//   } catch (e) {
//     Base.Toaster.error(`${e}`);
//   }
// },

export default function OperationEditor({
  id,
  resourceType,
  resource,
  actions,
  onChange,
}: OperationEditorProps) {
  const client = useRecoilValue(getClient);
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
  const opActions: Parameters<typeof Base.DropDownMenu>[0]["links"] = [
    {
      label: (
        <Base.Modal modalTitle="Invocation" ModalContent={InvocationModal}>
          {(setOpen) => (
            <span
              className="flex flex-1"
              onClick={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
            >
              Invoke
            </span>
          )}
        </Base.Modal>
      ),
    },
  ];

  return (
    <ResourceEditorComponent
      id={id as string}
      actions={opActions.concat(actions)}
      resourceType={resourceType as ResourceType}
      resource={resource}
      onChange={onChange}
      rightTabs={[
        {
          id: 5,
          title: "Audit Events",
          content: <OperationAuditEvents operationId={id as string} />,
        },
      ]}
      leftTabs={[
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
