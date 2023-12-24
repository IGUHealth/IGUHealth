import React from "react";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

import { EditableProps } from "../types";
import { CodeMirror } from "../../base";
import { InputContainer } from "../../base/containers";
import { markdown as fmarkdown } from "@iguhealth/fhir-types/r4/types";

export type FHIRMarkdownEditableProps = EditableProps<fmarkdown>;

const extensions = [markdown({ base: markdownLanguage })];

export const FHIRMarkdownEditable = ({
  onChange,
  value,
  issue,
  label,
}: FHIRMarkdownEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <CodeMirror
        extensions={extensions}
        value={value}
        onChange={(v) => onChange?.call(this, v as fmarkdown | undefined)}
      />
    </InputContainer>
  );
};
