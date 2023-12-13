import React, { useEffect } from "react";

import { ValueSetExpand } from "@iguhealth/generated-ops/r4";
import {
  ValueSet,
  ValueSetExpansionContains,
} from "@iguhealth/fhir-types/r4/types";

import { EditableProps, ClientProps } from "../types";
import { Select, Option } from "../../base/select";

export type FHIRCodeEditableProps = EditableProps<string> & {
  system?: string;
  open?: boolean;
} & ClientProps;

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
  value,
  onChange,
  issue,
  label,
  client,
  open = false,
  system,
}: FHIRCodeEditableProps) => {
  const [options, setOptions] = React.useState<Option[]>([]);
  useEffect(() => {
    if (system) {
      client
        .invoke_type(ValueSetExpand.Op, {}, "ValueSet", { url: system })
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
          ? onChange?.call(this, option.value as string)
          : onChange?.call(this, undefined)
      }
      issue={issue}
      label={label}
      open={open}
      options={options}
    />
  );
};
