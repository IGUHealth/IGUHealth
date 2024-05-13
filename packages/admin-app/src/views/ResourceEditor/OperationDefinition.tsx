import { indentLess, insertTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import {
  Button,
  CodeMirror,
  Input,
  Loading,
  Modal,
  Table,
  Tabs,
  Toaster,
} from "@iguhealth/components";
import * as fpb from "@iguhealth/fhir-patch-building";
import * as fpt from "@iguhealth/fhir-pointer";
import {
  AuditEvent,
  Extension,
  OperationDefinition,
  OperationOutcome,
  ResourceType,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { Operation } from "@iguhealth/operation-execution";

import ResourceEditorComponent, {
  AdditionalContent,
} from "../../components/ResourceEditor";
import { getClient } from "../../db/client";

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
      <div className="flex justify-start py-2 px-1">
        <Modal
          modalTitle={`Invoke ${operation?.code}`}
          ModalContent={(setOpen) => (
            <InvocationModal operation={operation} setOpen={setOpen} />
          )}
        >
          {(setOpen) => (
            <Button
              buttonType="primary"
              onClick={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
            >
              Invoke
            </Button>
          )}
        </Modal>
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
      .search_type({}, R4, "AuditEvent", [
        { name: "entity", value: [operationId] },
      ])
      .then((response) => {
        setAuditEvents(response.resources);
        setLoading(false);
        return response;
      });
  }, [operationId, setAuditEvents]);

  return (
    <Table
      isLoading={loading}
      data={auditEvents || []}
      columns={[
        {
          id: "Outcome",
          content: "Outcome",
          selector: "$this.outcome",
          selectorType: "fhirpath",
        },
        {
          id: "Agent",
          content: "Agent",
          selector: "$this.agent.name",
          selectorType: "fhirpath",
        },
        {
          id: "Description",
          content: "Description",
          selector: "$this.outcomeDesc",
          selectorType: "fhirpath",
        },
      ]}
    />
  );
}

interface OperationEditorProps extends AdditionalContent {
  resource: OperationDefinition | undefined;
  onChange: NonNullable<AdditionalContent["onChange"]>;
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
    <Tabs
      tabs={[
        {
          id: "input",
          title: "Input",
          content: (
            <div className="flex flex-col h-56 w-full">
              <div className="flex flex-1 border overflow-auto">
                <CodeMirror
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
                <Button
                  className="mr-1"
                  buttonType="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    try {
                      if (!operation) {
                        throw new Error(
                          "Must have operation to trigger invocation",
                        );
                      }
                      const invocation = client.invoke_system(
                        new Operation(operation),
                        {},
                        R4,
                        JSON.parse(parameters),
                      );
                      Toaster.promise(invocation, {
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
                      Toaster.error(`${e}`);
                    }
                  }}
                >
                  Send
                </Button>
                <Button
                  buttonType="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
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
                <CodeMirror
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

function EnvironmentVariables({
  operation,
  onChange,
}: {
  operation: OperationDefinition;
  onChange: OperationEditorProps["onChange"];
}) {
  const pointer = fpt.pointer("OperationDefinition", operation.id as id);
  const operationExtensions = fpt.descend(pointer, "extension");
  const environmentExtensions = operation.extension
    ?.map((e, i): [Extension, number] => [e, i])
    .filter(
      ([e]) =>
        e.url ===
        "https://iguhealth.app/Extension/OperationDefinition/environment-variable",
    )
    .map(([, i]) => fpt.descend(operationExtensions, i));

  return (
    <table>
      <thead>
        <tr>
          <th className="text-left">Name</th>
          <th className="text-left">Value</th>
          <th>Secret</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {environmentExtensions?.map((pointer) => {
          const ext = fpt.get(pointer, operation);
          if (!ext) throw new Error("Ext not on pointer");
          const valuePointer = fpt.descend(
            fpt.descend(pointer, "extension"),
            0,
          );

          const isSecret = ext.extension?.[0]._valueString !== undefined;

          return (
            <tr key={pointer}>
              <td>
                <Input
                  value={ext.valueString}
                  onChange={(e) => {
                    onChange(
                      fpb.applyMutationImmutable(operation, {
                        op: "replace",
                        path: fpt.descend(pointer, "valueString"),
                        value: e.target.value,
                      }),
                    );
                  }}
                />
              </td>
              <td>
                <Input
                  type={isSecret ? "password" : "text"}
                  value={ext.extension?.[0].valueString}
                  onChange={(e) => {
                    onChange(
                      fpb.applyMutationImmutable(operation, {
                        op: "replace",
                        path: valuePointer,
                        value: {
                          ...ext.extension?.[0],
                          url: "https://iguhealth.app/Extension/OperationDefinition/environment-variable-value" as id,
                          valueString: e.target.value,
                        },
                      }),
                    );
                  }}
                />
              </td>
              <td>
                <Input
                  type="checkbox"
                  checked={isSecret}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange(
                        fpb.applyMutationImmutable(operation, {
                          op: "add",
                          path: fpt.descend(valuePointer, "_valueString"),
                          value: {
                            extension: [
                              {
                                url: "https://iguhealth.app/Extension/encrypt-value" as id,
                                valueString: "",
                              },
                            ],
                          },
                        }),
                      );
                    } else {
                      onChange(
                        fpb.applyMutationImmutable(operation, {
                          op: "remove",
                          path: fpt.descend(valuePointer, "_valueString"),
                        }),
                      );
                    }
                  }}
                />
              </td>
              <td>
                <span
                  onClick={() => {
                    onChange(
                      fpb.applyMutationImmutable(operation, {
                        op: "remove",
                        path: pointer,
                      }),
                    );
                  }}
                  className="text-red-600 font-semibold cursor-pointer hover:text-red-500"
                >
                  Remove
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td>
            <Button
              onClick={() => {
                onChange(
                  fpb.applyMutationImmutable(operation, {
                    op: "add",
                    path: fpt.descend(
                      operationExtensions,
                      operationExtensions.length,
                    ),
                    value: {
                      extension: [
                        {
                          url: "https://iguhealth.app/Extension/OperationDefinition/environment-variable-value" as id,
                          valueString: "",
                        },
                      ],
                      url: "https://iguhealth.app/Extension/OperationDefinition/environment-variable" as id,
                      valueString: "",
                    },
                  }),
                );
              }}
            >
              Add Environment Variable
            </Button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default function OperationDefinitionView({
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
        "https://iguhealth.github.io/fhir-operation-definition/operation-code",
    ) !== undefined
      ? resource?.extension?.filter(
          (e) =>
            e.url ===
            "https://iguhealth.github.io/fhir-operation-definition/operation-code",
        )[0].valueString || ""
      : "";
  return (
    <ResourceEditorComponent
      id={id as id}
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
                onChange({
                  ...resource,
                  resourceType: "OperationDefinition",
                  extension: [
                    ...(resource?.extension?.filter(
                      (e) =>
                        e.url !==
                        "https://iguhealth.github.io/fhir-operation-definition/operation-code",
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
        {
          id: "environment",
          title: "Environment",
          content: resource ? (
            <EnvironmentVariables
              operation={resource}
              onChange={(v) => {
                onChange(v);
              }}
            />
          ) : (
            <div className="flex justify-center items-center">
              <Loading />
            </div>
          ),
        },
      ]}
    />
  );
}
