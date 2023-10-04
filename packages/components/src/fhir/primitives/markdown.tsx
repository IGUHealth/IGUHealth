import React from "react";

import { markdownLanguage } from "@codemirror/lang-markdown";
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

export const Markdown = ({ onChange, value, issue, label }: MarkdownProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <CodeMirror
        extensions={[markdownLanguage]}
        value={value}
        onChange={onChange}
      />
    </InputContainer>
  );
};
