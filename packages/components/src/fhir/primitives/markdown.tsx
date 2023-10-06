import React from "react";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { CodeMirror } from "../../base";
import { InputContainer } from "../../base/labelContainer";

export interface MarkdownProps {
  /**
   * The value of the input.
   */
  value: string;
  /**
   * The value of the input.
   */
  issue?: string;
  /**
   * Call back triggered when input changes.
   */
  onChange?: (value: string) => void;
  /**
   * Label string.
   */
  label?: string;
}

const extensions = [markdown({ base: markdownLanguage })];

export const Markdown = ({ onChange, value, issue, label }: MarkdownProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <CodeMirror extensions={extensions} value={value} onChange={onChange} />
    </InputContainer>
  );
};
