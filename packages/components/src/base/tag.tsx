import classNames from "classnames";
import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface TagProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  className?: string;
  children: React.ReactNode;
  color?:
    | "blue"
    | "gray"
    | "red"
    | "green"
    | "yellow"
    | "indigo"
    | "purple"
    | "pink";
}

export function Tag({
  className,
  children,
  color = "blue",
  ...spanProps
}: Readonly<TagProps>) {
  return (
    <span
      {...spanProps}
      className={classNames(
        className,
        "text-xs font-medium me-2 px-2.5 py-0.5",

        {
          "hover:bg-blue-200 hover:text-blue-900 bg-blue-100 text-blue-800 rounded dark:bg-blue-900 dark:text-blue-300 hover:dark:bg-blue-800 hover:dark:text-blue-200":
            color === "blue",
          "hover:bg-gray-200 hover:text-gray-900 bg-gray-100 text-gray-800 rounded dark:bg-gray-900 dark:text-gray-300 hover:dark:bg-gray-800 hover:dark:text-gray-200":
            color === "gray",
          "hover:bg-red-200 hover:text-red-900 bg-red-100 text-red-800 rounded dark:bg-red-900 dark:text-red-300 hover:dark:bg-red-800 hover:dark:text-red-200":
            color === "red",
          "hover:bg-green-200 hover:text-green-900 bg-green-100 text-green-800 rounded dark:bg-green-900 dark:text-green-300 hover:dark:bg-green-800 hover:dark:text-green-200":
            color === "green",
          "hover:bg-yellow-200 hover:text-yellow-900 bg-yellow-100 text-yellow-800 rounded dark:bg-yellow-900 dark:text-yellow-300 hover:dark:bg-yellow-800 hover:dark:text-yellow-200":
            color === "yellow",
          "hover:bg-indigo-200 hover:text-indigo-900 bg-indigo-100 text-indigo-800 rounded dark:bg-indigo-900 dark:text-indigo-300 hover:dark:bg-indigo-800 hover:dark:text-indigo-200":
            color === "indigo",
          "hover:bg-purple-200 hover:text-purple-900 bg-purple-100 text-purple-800 rounded dark:bg-purple-900 dark:text-purple-300 hover:dark:bg-purple-800 hover:dark:text-purple-200":
            color === "purple",
          "hover:bg-pink-200 hover:text-pink-900 bg-pink-100 text-pink-800 rounded dark:bg-pink-900 dark:text-pink-300 hover:dark:bg-pink-800 hover:dark:text-pink-200":
            color === "pink",
        },
      )}
    >
      {children}
    </span>
  );
}
