import React from "react";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

import { EditableProps } from "../types";
import { CodeMirror } from "../../base";
import { InputContainer } from "../../base/containers";
import {
  Annotation,
  markdown as fmarkdown,
} from "@iguhealth/fhir-types/r4/types";

export type FHIRMarkdownEditableProps = EditableProps<Annotation>;

const extensions = [markdown({ base: markdownLanguage })];

export const FHIRAnnotationEditable = ({
  onChange,
  value,
  issue,
  label,
}: FHIRMarkdownEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <CodeMirror
        extensions={extensions}
        value={value?.text}
        onChange={(text) =>
          onChange?.call(this, { ...value, text: text as fmarkdown })
        }
      />
    </InputContainer>
  );
};
