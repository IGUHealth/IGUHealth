import React from "react";
import fileDownload from "js-file-download";
import classNames from "classnames";

import { LabelContainer } from "../base/labelContainer";
import { Button } from "../base/button";

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
  label: string;
}

export const Base64Binary = ({
  value,
  onChange,
  issue,
  label,
}: Base64BinaryProps) => {
  return (
    <LabelContainer label={label} issues={issue ? [issue] : []}>
      <>
        <input
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
            label="Download"
          />
        )}
      </>
    </LabelContainer>
  );
};
