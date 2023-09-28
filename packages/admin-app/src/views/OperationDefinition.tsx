import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Base } from "@iguhealth/components";

import ResourceEditorComponent from "../components/ResourceEditor";

const extensions = [basicSetup, javascript()];

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

export default function DefaultResourceEditorView() {
  return (
    <ResourceEditorComponent
      leftSide={[
        {
          id: 0,
          title: "Code",
          content: (
            <OperationCodeEditor
              value={""}
              setValue={(v: string) => console.log(v)}
            />
          ),
        },
      ]}
    />
  );
}
