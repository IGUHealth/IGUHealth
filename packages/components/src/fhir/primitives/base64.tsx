import React, { useState, useEffect } from "react";
import fileDownload from "js-file-download";

import { EditableProps } from "../types";
import { InputContainer } from "../../base/containers";
import { Button } from "../../base/button";
import { Input } from "../../base/input";

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const data = reader.result;
      if (typeof data === "string") {
        resolve(data.split(",")[1]);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export type FHIRBase64BinaryEditableProps = EditableProps<string>;

const base64Regex = /^(\s*([0-9a-zA-Z+=]){4}\s*)+$/;

export const FHIRBase64BinaryEditable = ({
  value,
  onChange,
  issue,
  label,
}: FHIRBase64BinaryEditableProps) => {
  const [issues, setIssues] = useState<string[]>([]);
  useEffect(() => {
    const issues: string[] = [];
    if (value && !base64Regex.test(value)) {
      issues.push(`Invalid base64 format`);
    }
    if (issue) issues.push(issue);

    setIssues(issues);
  }, [value, issue]);
  return (
    <InputContainer label={label} issues={issues}>
      <div className="flex">
        <Input
          type="file"
          hideBorder={true}
          onChange={(e) => {
            const file = e.target?.files?.[0];
            if (!file) return;
            convertFileToBase64(file).then((data) => {
              onChange && onChange(data);
            });
          }}
        />
        {value && (
          <Button
            className="ml-1"
            buttonType="secondary"
            buttonSize="medium"
            onClick={() => {
              fileDownload(value, "data");
            }}
            children="Download"
          />
        )}
      </div>
    </InputContainer>
  );
};
