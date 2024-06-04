import classNames from "classnames";
import React from "react";

import { TenantClaim } from "@iguhealth/jwt";

import { Container } from "./Container";

export interface TenantSelectProps {
  title?: string;
  logo?: string;
  tenants: TenantClaim<string>[];
}

function generateTailwindColorFromValue(value: string) {
  const colors = ["red", "yellow", "green", "blue", "indigo", "purple", "pink"];

  // Generate tailwind color using value
  const index = value.charCodeAt(0) % colors.length;

  return colors[index];
}

export const InitialDisplay = ({ value }: { value: string }) => {
  const initial = value.substring(0, 1).toUpperCase();
  const color = generateTailwindColorFromValue(value);

  return (
    <div
      className={classNames(
        "w-8 h-8 flex justify-center items-center rounded-full",
        `bg-${color}-100`,
        `text-${color}-800`,
        `dark:bg-${color}-800`,
        `dark:text-${color}-100`,
      )}
    >
      <span className="font-bold">{initial}</span>
    </div>
  );
};

export const TenantSelect = ({ tenants, title, logo }: TenantSelectProps) => {
  return (
    <Container logo={logo} title={title}>
      <ul className="spacing-y-2">
        {tenants.map((t) => {
          return (
            <li>
              <a className="p-2 flex cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-800">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <InitialDisplay value={t.id as string} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {t.id}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {t.userRole}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"></div>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </Container>
  );
};
