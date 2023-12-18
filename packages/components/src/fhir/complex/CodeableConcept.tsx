import React from "react";
import { CodeableConcept, Coding } from "@iguhealth/fhir-types/r4/types";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { ClientProps, EditableProps } from "../types";
import { InputContainer, Label } from "../../base/containers";
import { Add } from "../../base";
import { FHIRCodingEditable } from ".";

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

export type FHIRCodeableConceptEditableProps = EditableProps<CodeableConcept> &
  ClientProps;

export const FhirCodeableConceptEditable = ({
  client,
  value,
  onChange,
  issue,
  label,
}: FHIRCodeableConceptEditableProps) => {
  return (
    <InputContainer
      hideBorder={true}
      label={label}
      issues={issue ? [issue] : []}
    >
      <div className="flex flex-col space-y-1">
        {value?.coding?.map((coding, index) => (
          <div
            key={`${index}:${coding.code}-${coding.system}`}
            className="relative"
          >
            <FHIRCodingEditable
              client={client}
              value={coding}
              onChange={(coding) => {
                if (coding) {
                  const newCoding: Coding[] = [...(value?.coding || [])];
                  newCoding.splice(index, 1, coding);
                  onChange?.call(this, { ...value, coding: newCoding });
                }
              }}
            />
            <div
              className="absolute top-1 right-1 text-slate-400 cursor-pointer hover:text-slate-500 "
              onClick={() => {
                const newCoding: Coding[] = [...(value?.coding || [])];
                newCoding.splice(index, 1);
                onChange?.call(this, { ...value, coding: newCoding });
              }}
            >
              <XMarkIcon className="h-4 w-4" />
            </div>
          </div>
        ))}
        <div>
          <Add
            onChange={() => {
              const newCoding: Coding[] = [...(value?.coding || [])];
              newCoding.push({});
              onChange?.call(this, { ...value, coding: newCoding });
            }}
          />
        </div>
      </div>
    </InputContainer>
  );
};
