import { json } from "@codemirror/lang-json";
import { basicSetup } from "codemirror";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import {
  Button,
  CodeMirror,
  Modal,
  Tabs,
  Toaster,
} from "@iguhealth/components";
import {
  AccessPolicyV2,
  ResourceType,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthEvaluatePolicy } from "@iguhealth/generated-ops/lib/r4/ops";

import ResourceEditorComponent, {
  AdditionalContent,
} from "../../components/ResourceEditor";
import { getClient } from "../../db/client";
import { getErrorMessage } from "../../utilities";

interface AccessPolicyV2EditorProps extends AdditionalContent {
  resource: AccessPolicyV2 | undefined;
  onChange: NonNullable<AdditionalContent["onChange"]>;
}

const AccessPolicyInvoke = ({
  accessPolicy,
  setOpen,
}: {
  accessPolicy: AccessPolicyV2 | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const client = useRecoilValue(getClient);
  const [parameters, setParameters] = useState("{}");
  const [output, setOutput] = useState<unknown | undefined>(undefined);

  return (
    <div>
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
      <div className="mt-1 flex justify-end px-2">
        <Button
          className="mr-1"
          buttonType="primary"
          onClick={(e) => {
            e.preventDefault();
            try {
              const invocation = client.invoke_instance(
                IguhealthEvaluatePolicy.Op,
                {},
                R4,
                "AccessPolicyV2",
                accessPolicy?.id as id,
                JSON.parse(parameters),
              );
              Toaster.promise(invocation, {
                loading: "Invocation",
                success: (success) => {
                  setOutput(success);
                  return `Invocation succeeded`;
                },
                error: (error) => {
                  return getErrorMessage(error);
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
  );
};

export default function AccessPolicyView({
  id,
  resourceType,
  resource,
  actions,
  structureDefinition,
  onChange,
}: AccessPolicyV2EditorProps) {
  return (
    <div className="flex justify-center items-center py-2 px-1">
      <Modal
        modalTitle="Evaluate Policy"
        ModalContent={(setOpen) => (
          <AccessPolicyInvoke accessPolicy={resource} setOpen={setOpen} />
        )}
      >
        {(setOpen) => (
          <ResourceEditorComponent
            id={id as id}
            actions={[
              {
                key: "EvaluatePolicy",
                label: "Test policy",
                onClick: () => {
                  setOpen(true);
                },
              },
              ...actions,
            ]}
            structureDefinition={structureDefinition}
            resourceType={resourceType as ResourceType}
            resource={resource}
            onChange={onChange}
          />
        )}
      </Modal>
    </div>
  );
}
