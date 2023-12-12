import React from "react";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

import { EditableProps } from "../types";
import { CodeMirror } from "../../base";
import { InputContainer } from "../../base/containers";

export type FHIRMarkdownEditableProps = EditableProps<string>;

const extensions = [markdown({ base: markdownLanguage })];

export const FHIRMarkdownEditable = ({
  onChange,
  value,
  issue,
  label,
}: FHIRMarkdownEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <CodeMirror extensions={extensions} value={value} onChange={onChange} />
    </InputContainer>
  );
};
