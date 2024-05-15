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
  renderer?: (data: unknown[]) => React.ReactNode;
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
): unknown[] {
  switch (selectorType) {
    case "fhirpath": {
      return fhirpath.evaluate(selector, data);
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
            {!isLoading &&
              data.map((row, index) => (
                <tr
                  key={index}
                  className="border cursor-pointer hover:bg-slate-100"
                  onClick={() => onRowClick(row)}
                >
                  {columns.map((column) => {
                    const data = extract(
                      row,
                      column.selector,
                      column.selectorType,
                    );
                    return (
                      <td
                        key={column.id}
                        className="overflow-auto whitespace-nowrap px-4 py-2 font-medium"
                      >
                        {column.renderer
                          ? column.renderer(data)
                          : data.join(" ")}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
        {isLoading && (
          <div className="w-full mt-4 flex justify-center items-center flex-col">
            <Loading className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
