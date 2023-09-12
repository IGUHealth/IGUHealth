import React, { useState, useEffect } from "react";
import fileDownload from "js-file-download";

import { LabelContainer } from "../../base/labelContainer";
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

export interface Base64BinaryProps {
  value?: string;
  onChange: (value: string) => void;
  issue?: string;
  label?: string;
}

const base64Regex = /^(\s*([0-9a-zA-Z\+\=]){4}\s*)+$/;

export const Base64Binary = ({
  value,
  onChange,
  issue,
  label,
}: Base64BinaryProps) => {
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
    <LabelContainer label={label} issues={issues}>
      <>
        <Input
          type="file"
          onChange={(e) => {
            const file = e.target?.files?.[0];

            if (!file) return;
            const string = convertFileToBase64(file).then((data) => {
              onChange(data);
            });
          }}
        />
        {value && (
          <Button
            type="secondary"
            size="medium"
            onClick={() => {
              fileDownload(value, "data");
            }}
            children="Download"
          />
        )}
      </>
    </LabelContainer>
  );
};
