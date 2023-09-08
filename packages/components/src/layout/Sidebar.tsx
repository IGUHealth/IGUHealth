import React, { useState } from "react";
import classNames from "classnames";

export function SideBarItem({
  logo,
  children,
}: {
  logo: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li>
      <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
        {logo}
        <span className="flex-1 ml-3 whitespace-nowrap">{children}</span>
      </div>
    </li>
  );
}

export function SideBar({
  isOpen = true,
  children,
}: {
  isOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <aside
      id="sidebar-multi-level-sidebar"
      className={classNames(
        "fixed top-0 left-0 z-40 w-64 h-screen transition-transform",
        { "translate-x-0": isOpen, "-translate-x-full": !isOpen }
      )}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">{children}</ul>
      </div>
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
  console.log(sidebarOpen);
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
      <div className="p-4 sm:ml-64">{children}</div>
    </>
  );
};
