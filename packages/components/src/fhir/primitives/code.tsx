import React, { useEffect } from "react";
import {
  ValueSet,
  ValueSetExpansionContains,
} from "@iguhealth/fhir-types/r4/types";

import { EditableProps } from "../types";
import { Select, Option } from "../../base/select";

export type FHIRCodeEditableProps = EditableProps<string> & {
  system?: string;
  expand?: (value: string) => Promise<ValueSet>;
  open?: boolean;
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
  value,
  onChange,
  issue,
  label,
  expand,
  open = false,
  system,
}: FHIRCodeEditableProps) => {
  const [options, setOptions] = React.useState<Option[]>([]);
  useEffect(() => {
    if (expand && system) {
      expand(system).then((valueset) => {
        setOptions(valueSetToOptions(valueset));
      });
    }
  }, [system, expand]);
  return (
    <Select
      value={value}
      onChange={(option) =>
        option
          ? onChange && onChange(option.value as string)
          : onChange && onChange(undefined)
      }
      issue={issue}
      label={label}
      open={open}
      options={options}
    />
  );
};
