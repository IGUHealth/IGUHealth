import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export interface BreadCrumbsProps {
  breadcrumbs: React.ReactNode[];
}

export const BreadCrumbs = ({ breadcrumbs }: BreadCrumbsProps) => {
  return (
    <div className="flex spacing-x-4 items-center">
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <div className="flex items-center mr-1">
            {index === breadcrumbs.length - 1 ? (
              breadcrumb
            ) : (
              <>
                {breadcrumb}
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
