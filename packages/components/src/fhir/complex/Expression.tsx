import React from "react";

import { Expression, code } from "@iguhealth/fhir-types/r4/types";
import fp from "@iguhealth/lang-fp";

import { CodeMirror } from "../../base";
import { EditableProps } from "../types";

export type FHIRExpressionEditableProps = EditableProps<Expression>;

const extensions = [fp()];

export function FHIRExpressionEditable(props: FHIRExpressionEditableProps) {
  return (
    <div className="flex flex-1 border overflow-auto">
      <CodeMirror
        extensions={extensions}
        value={props.value?.expression}
        theme={{
          "&": {
            height: "100%",
            width: "100%",
          },
        }}
        onChange={(value) => {
          props.onChange?.call(undefined, {
            ...props.value,
            language: "text/fhirpath" as code,
            expression: value,
          });
        }}
      />
    </div>
  );
}
