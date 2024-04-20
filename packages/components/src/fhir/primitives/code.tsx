import React, { useEffect } from "react";

import {
  ValueSet,
  ValueSetExpansionContains,
  code,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { ValueSetExpand } from "@iguhealth/generated-ops/r4";

import { Option, Select } from "../../base/select";
import { ClientProps, EditableProps } from "../types";

export type FHIRCodeEditableProps = EditableProps<code> &
  ClientProps & {
    system?: uri;
    open?: boolean;
    filter?: (option: Option) => boolean;
  };

function flatten(item: ValueSetExpansionContains): Option[] {
  const children = item.contains?.map(flatten).flat() || [];
  if (item.code) {
    return [
      { value: item.code, label: item.display || item.code },
      ...children,
    ];
  }
  return children;
}

function valueSetToOptions(valueSet: ValueSet): Option[] {
  return valueSet.expansion?.contains?.map(flatten).flat() || [];
}

export const FHIRCodeEditable = ({
  fhirVersion,
  value,
  onChange,
  issue,
  label,
  client,
  open = false,
  system,
  filter,
}: FHIRCodeEditableProps) => {
  const [options, setOptions] = React.useState<Option[]>([]);
  useEffect(() => {
    if (system) {
      client
        .invoke_type(ValueSetExpand.Op, { fhirVersion }, "ValueSet", {
          url: system,
        })
        .then((valueSet) => {
          setOptions(valueSetToOptions(valueSet));
        });
    }
  }, [system, client]);
  return (
    <Select
      value={value}
      onChange={(option) =>
        option
          ? onChange?.call(this, option.value as code)
          : onChange?.call(this, undefined)
      }
      issue={issue}
      label={label}
      open={open}
      options={filter ? options.filter(filter) : options}
    />
  );
};
