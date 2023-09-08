import React from "react";
import * as fhirpath from "@iguhealth/fhirpath";

export type SelectorType = "fhirpath";

export interface Columns {
  name: string;
  selectorType: SelectorType;
  selector: string;
}

export interface TableProps {
  columns: Columns[];
  data: any[];
}

function extract(
  data: any,
  selector: string,
  selectorType: SelectorType
): string {
  switch (selectorType) {
    case "fhirpath": {
      return fhirpath.evaluate(selector, data).join(",");
    }
    default:
      throw new Error(`Unknown selector type: ${selectorType}`);
  }
}

export function Table({ columns, data }: TableProps) {
  return (
    <table className="table-auto min-w-full text-left text-sm font-light">
      <thead className="border-b font-medium">
        <tr>
          {columns.map((column) => (
            <th className="px-6 py-4">{column.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((data) => (
          <tr className="border-b dark:border-neutral-500">
            {columns.map((column) => (
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                {extract(data, column.selector, column.selectorType)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
