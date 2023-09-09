import React from "react";
import * as fhirpath from "@iguhealth/fhirpath";

export type SelectorType = "fhirpath";

export interface Columns {
  name: string;
  selectorType: SelectorType;
  selector: string;
}

export interface TableProps {
  isLoading?: boolean;
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

function Loading() {
  return (
    <svg
      className="animate-spin h-8 w-8 text-indigo-700"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

export function Table({
  columns,
  data,
  onRowClick = () => {},
  isLoading = false,
}: TableProps) {
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
        {isLoading ? (
          <tr>
            <td className="p-4" colSpan={columns.length}>
              <div className="flex justify-center items-center flex-col">
                <Loading />
                <div className="mt-1 font-medium text-indigo-700">
                  <span>Loading</span>
                </div>
              </div>
            </td>
          </tr>
        ) : (
          <>
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
          </>
        )}
      </tbody>
    </table>
  );
}
