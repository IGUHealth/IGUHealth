import React from "react";

import { Container } from "./Container";

export interface ScopeVerifyProps {
  title?: string;
  header?: string;
  scopes?: string[];
  logo?: string;
  acceptURL: string;
  denyURL: string;
}

export const ScopeVerifyForm = ({
  title = "IGUHealth",
  header = "Scopes",
  scopes = [],
  logo,
  acceptURL,
  denyURL,
}: ScopeVerifyProps) => {
  return (
    <Container logo={logo} title={title}>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        {header}
      </h1>
      <div>
        <span>The application is requesting the following scopes:</span>
      </div>
      <div>
        <ul className="list-inside list-disc">
          {scopes.map((scope) => (
            <li key={scope}>{scope}</li>
          ))}
        </ul>
      </div>
      <div className="flex space-x-4">
        <form action={acceptURL} method="POST">
          {scopes.map((scope) => (
            <input
              key={scope}
              name="scopes"
              className="hidden"
              type="text"
              value={scope}
            />
          ))}
          <input
            className="hidden"
            name="accept"
            type="checkbox"
            checked={false}
          />
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Allow
          </button>
        </form>
        <form action={denyURL} method="POST">
          {scopes.map((scope) => (
            <input
              key={scope}
              name="scopes"
              className="hidden"
              type="text"
              value={scope}
            />
          ))}
          <input
            className="hidden"
            name="accept"
            type="checkbox"
            checked={false}
          />
          <button
            type="submit"
            className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Deny
          </button>
        </form>
      </div>
    </Container>
  );
};
