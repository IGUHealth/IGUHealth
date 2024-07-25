import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import React from "react";

import { Container } from "./Container";

export interface ScopeVerifyProps {
  title?: string;
  header?: string;
  scopes?: string[];
  logo?: string;
  actionURL: string;
}

export const ScopeVerifyForm = ({
  title = "IGUHealth",
  header = "Scopes",
  scopes = [],
  logo,
  actionURL,
}: ScopeVerifyProps) => {
  return (
    <Container logo={logo} title={title}>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        {header}
      </h1>
      <div>
        <span>The application is requesting the following scopes:</span>
      </div>
      <div className="max-h-72 overflow-auto">
        <table className="border-collapse  list-inside list-disc w-full">
          {scopes.map((scope) => (
            <tr className="border" key={scope}>
              <td className="p-4">{scope}</td>
              <td>
                <div className="items-center justify-center flex">
                  <ExclamationCircleIcon className="w-6 h-6 text-gray-300" />
                </div>
              </td>
            </tr>
          ))}
        </table>
      </div>
      <div className="justify-center items-center flex space-x-4">
        <form action={actionURL} method="POST">
          {scopes.map((scope) => (
            <input
              readOnly
              key={scope}
              name="scopes"
              className="hidden"
              type="text"
              value={scope}
            />
          ))}
          <input
            readOnly
            className="hidden"
            name="accept"
            type="checkbox"
            checked={true}
          />
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Allow
          </button>
        </form>
        <form action={actionURL} method="POST">
          {scopes.map((scope) => (
            <input
              readOnly
              key={scope}
              name="scopes"
              className="hidden"
              type="text"
              value={scope}
            />
          ))}
          <input
            readOnly
            className="hidden"
            name="accept"
            type="checkbox"
            checked={false}
          />
          <button
            type="submit"
            className="w-full text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Deny
          </button>
        </form>
      </div>
    </Container>
  );
};
