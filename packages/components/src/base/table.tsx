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
  onRowClick?: (row: any) => void;
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

export function Table({ columns, data, onRowClick = () => {} }: TableProps) {
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
        {data.map((row) => (
          <tr
            className="border-b cursor-pointer hover:bg-slate-100"
            onClick={(e) => onRowClick(row)}
          >
            {columns.map((column) => (
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                {extract(row, column.selector, column.selectorType)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
