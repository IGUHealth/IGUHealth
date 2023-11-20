import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { insertTab, indentLess } from "@codemirror/commands";
import { keymap } from "@codemirror/view";

import * as fpt from "@iguhealth/fhir-pointer";
import { Operation } from "@iguhealth/operation-execution";
import {
  OperationOutcome,
  OperationDefinition,
  ResourceType,
  AuditEvent,
  Extension,
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
  operation,
  value,
  setValue,
}: {
  operation: OperationDefinition | undefined;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="border flex-1 flex">
        <Base.CodeMirror
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
      <div className="flex justify-start py-2 px-1">
        <Base.Modal
          modalTitle={`Invoke ${operation?.code}`}
          ModalContent={(setOpen) => (
            <InvocationModal operation={operation} setOpen={setOpen} />
          )}
        >
          {(setOpen) => (
            <Base.Button
              buttonType="primary"
              onClick={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
            >
              Invoke
            </Base.Button>
          )}
        </Base.Modal>
      </div>
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

const InvocationModal = ({
  operation,
  setOpen,
}: {
  operation: OperationDefinition | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const client = useRecoilValue(getClient);
  const [parameters, setParameters] = useState("{}");
  const [output, setOutput] = useState<unknown | undefined>(undefined);

  return (
    <Base.Tabs
      tabs={[
        {
          id: "input",
          title: "Input",
          content: (
            <div className="flex flex-col h-56 w-full">
              <div className="flex flex-1 border overflow-auto">
                <Base.CodeMirror
                  extensions={[basicSetup, json()]}
                  value={parameters}
                  theme={{
                    "&": {
                      height: "100%",
                      width: "100%",
                    },
                  }}
                  onChange={(value) => {
                    setParameters(value);
                  }}
                />
              </div>

              <div className="mt-1 flex justify-end">
                <Base.Button
                  className="mr-1"
                  buttonType="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    try {
                      if (!operation) {
                        throw new Error(
                          "Must have operation to trigger invocation"
                        );
                      }
                      const invocation = client.invoke_system(
                        new Operation(operation),
                        {},
                        JSON.parse(parameters)
                      );
                      Base.Toaster.promise(invocation, {
                        loading: "Invocation",
                        success: (success) => {
                          setOutput(success);
                          return `Invocation succeeded`;
                        },
                        error: (error) => {
                          console.log(error);
                          const message = (
                            error.operationOutcome as OperationOutcome
                          ).issue
                            .map((issue) => issue.diagnostics)
                            .join("\n");

                          return message;
                        },
                      });
                    } catch (e) {
                      Base.Toaster.error(`${e}`);
                    }
                  }}
                >
                  Send
                </Base.Button>
                <Base.Button
                  buttonType="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Base.Button>
              </div>
            </div>
          ),
        },
        {
          id: "output",
          title: "Output",
          content: (
            <div className="flex flex-col h-56 w-full">
              <div className="flex flex-1 border  overflow-auto">
                <Base.CodeMirror
                  readOnly
                  extensions={[basicSetup, json()]}
                  value={JSON.stringify(output, null, 2)}
                  theme={{
                    "&": {
                      height: "100%",
                      width: "100%",
                    },
                  }}
                />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

function OperationSecrets({ operation }: { operation: OperationDefinition }) {
  const client = useRecoilValue(getClient);
  const pointer = fpt.pointer("OperationDefinition", operation.id as string);
  const secretPointers = operation.extension
    ?.map((e, i): [Extension, number] => [e, i])
    .filter(
      ([e, _i]) => e.url === "https://iguhealth.app/Extension/operation-secret"
    )
    .map(([_e, i]) => fpt.descend(fpt.descend(pointer, "extension"), i));

  return (
    <div>
      {secretPointers?.map((s) => {
        const ext = fpt.get(s, operation);
        if (!ext) throw new Error("Ext not on pointer");

        return (
          <div className="flex space-x-1 mb-2">
            <Base.Input
              value={ext.valueString}
              label="Name"
              onChange={(e) => {}}
            />
            <Base.Input
              type="password"
              value={ext.extension?.[0].valueString}
              label="Value"
            />
            <Base.Input
              type="checkbox"
              label="Is Secret"
              checked={ext.extension?.[0]._valueString !== undefined}
              onChange={(e) => {
                if (ext.extension?.[0]) {
                  if (e.target.checked) {
                    ext.extension[0]._valueString = {
                      extension: [
                        {
                          url: "https://iguhealth.app/Extension/encrypt-value",
                          valueString: "",
                        },
                      ],
                    };
                  } else {
                    delete ext.extension?.[0]._valueString;
                  }
                }
              }}
            />
          </div>
        );
      })}
      {/* {secrets?.map(([e, i]) => {
        const name = e.valueString;
        const value = e.extension?.find(
          (e) =>
            e.url === "https://iguhealth.app/Extension/operation-secret-value"
        )?.valueString;

        return (
          <div className="flex space-x-1 mb-2">
            <Base.Input value={name} label="Name" />
            <Base.Input type="password" value={value} label="Value" />
          </div>
        );
      })} */}
      <Base.Button
        onClick={async (e) => {
          const response = await client.patch({}, operation, [
            {
              op: "add",
              path: "/extension/-",
              value: {
                extension: [
                  {
                    url: "https://iguhealth.app/Extension/operation-secret-value",
                    valueString: "",
                  },
                ],
                url: "https://iguhealth.app/Extension/operation-secret",
                valueString: "",
              },
            },
          ]);
        }}
      >
        Add
      </Base.Button>
    </div>
  );
}

export default function OperationEditor({
  id,
  resourceType,
  resource,
  actions,
  structureDefinition,
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
      actions={actions}
      structureDefinition={structureDefinition}
      resourceType={resourceType as ResourceType}
      resource={resource}
      onChange={onChange}
      rightTabs={[
        {
          id: "logs",
          title: "Logs",
          content: <OperationAuditEvents operationId={id as string} />,
        },
      ]}
      leftTabs={[
        {
          id: "code",
          title: "Code",
          content: (
            <OperationCodeEditor
              value={code}
              operation={resource}
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
        // {
        //   id: "secret",
        //   title: "Secrets",
        //   content: resource ? (
        //     <OperationSecrets operation={resource} />
        //   ) : (
        //     <div className="flex justify-center items-center">
        //       <Base.Loading />
        //     </div>
        //   ),
        // },
      ]}
    />
  );
}
