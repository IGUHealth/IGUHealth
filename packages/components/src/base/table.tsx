import React from "react";

import * as fhirpath from "@iguhealth/fhirpath";

import { Loading } from "./loading";

export type SelectorType = "fhirpath";

export interface Columns {
  id: string;
  content: React.ReactNode;
  selectorType: SelectorType;
  selector: string;
  onClick?: (column: Columns) => void;
}

export interface TableProps {
  isLoading?: boolean;
  columns: Columns[];
  data: unknown[];
  onRowClick?: (row: unknown) => void;
}

function extract(
  data: unknown,
  selector: string,
  selectorType: SelectorType,
): string {
  switch (selectorType) {
    case "fhirpath": {
      return fhirpath.evaluate(selector, data).join(", ");
    }
    default:
      throw new Error(`Unknown selector type: ${selectorType}`);
  }
}

export function Table({
  columns,
  data,
  onRowClick = () => {},
  isLoading = false,
}: TableProps) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto overflow-y-auto">
        <table className="text-left text-xs text-slate-600 w-full">
          <thead className="border-b font-medium">
            <tr>
              {columns.map((column, i) => (
                <th
                  onClick={(_e) => column.onClick?.call(undefined, column)}
                  key={i}
                  className="px-4 py-2 whitespace-nowrap "
                >
                  {column.content}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-2" colSpan={columns.length}>
                  <div className="flex justify-center items-center flex-col">
                    <Loading />
                    <div className="mt-1 font-medium text-blue-700">
                      <span>Loading</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {data.map((row, index) => (
                  <tr
                    key={index}
                    className="border cursor-pointer hover:bg-slate-100"
                    onClick={() => onRowClick(row)}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className="overflow-auto whitespace-nowrap px-4 py-2 font-medium"
                      >
                        {extract(row, column.selector, column.selectorType)}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
