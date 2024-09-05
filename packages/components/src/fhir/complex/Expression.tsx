import { minimalSetup } from "codemirror";
import React from "react";

import { Expression, code } from "@iguhealth/fhir-types/r4/types";
import fp from "@iguhealth/lang-fp";

import { CodeMirror, InputContainer } from "../../base";
import { EditableProps } from "../types";

export type FHIRExpressionEditableProps = EditableProps<Expression>;

const extensions = [minimalSetup, fp()];

export function FHIRExpressionEditable({
  value,
  label,
  issue,
  onChange,
}: FHIRExpressionEditableProps) {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <CodeMirror
        extensions={extensions}
        value={value?.expression}
        theme={{
          "&": {
            height: "100%",
            width: "100%",
          },
        }}
        onChange={(expression) => {
          onChange?.call(undefined, {
            ...value,
            language: "text/fhirpath" as code,
            expression: expression,
          });
        }}
      />
    </InputContainer>
  );
}
