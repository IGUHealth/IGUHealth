import React, { useState } from "react";
import classNames from "classnames";

export interface SideBarItemProps
  extends React.DetailedHTMLProps<
    React.LiHTMLAttributes<HTMLLIElement>,
    HTMLLIElement
  > {
  active?: boolean;
  logo?: React.ReactNode;
  children: React.ReactNode;
}

export function SideBarItem(props: SideBarItemProps) {
  const { active = false, logo, children } = props;
  return (
    <li {...props}>
      <div
        className={classNames(
          "cursor-pointer flex items-center p-2 group rounded-lg hover:text-white group hover:bg-indigo-700",
          { "text-indigo-100": !active, "text-white  bg-indigo-700": active }
        )}
      >
        <div className="w-5 h-5 text-white transition duration-75  group-hover:text-indigo-50 ">
          {logo}
        </div>
        <span className="flex-1 ml-3 whitespace-nowrap">{children}</span>
      </div>
    </li>
  );
}

export interface SideBarItemGroupProps
  extends React.DetailedHTMLProps<
    React.LiHTMLAttributes<HTMLLIElement>,
    HTMLLIElement
  > {
  label?: string;
}

export function SideBarItemGroup(props: SideBarItemGroupProps) {
  return (
    <li {...props}>
      <div className="px-2 text-indigo-100 text-xs">{props.label}</div>
      <div className="mt-1">
        <ul className="space-y-1">{props.children}</ul>
      </div>
    </li>
  );
}

export function SideBar({
  top,
  isOpen = true,
  children,
}: {
  isOpen?: boolean;
  top?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <aside
      id="sidebar-multi-level-sidebar"
      className={classNames(
        "flex fixed top-0 left-0 z-40 w-64 h-screen transition-transform",
        { "translate-x-0": isOpen, "-translate-x-full": !isOpen }
      )}
      aria-label="Sidebar"
    >
      <nav className="flex flex-1 flex-col px-3 py-4 overflow-y-auto bg-indigo-600">
        {top}
        <ul role="list" className="gap-y-2 flex flex-1 flex-col font-medium">
          {children}
        </ul>
      </nav>
    </aside>
  );
}

export const SidebarLayout = ({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      {/* <button
        onClick={(e) => {
          setSidebarOpen(!sidebarOpen);
        }}
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button> */}
      {sidebar}
      <div className="sm:ml-64 flex flex-col flex-grow">{children}</div>
    </>
  );
};
