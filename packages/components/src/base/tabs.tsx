import React from "react";
import { Tab } from "@headlessui/react";
import classNames from "classnames";

export interface Tab {
  id: number | string;
  title: string;
  content: React.ReactNode;
}

export interface TabsProps {
  selectedTab?: number;
  onTab?: (tab: Tab) => void;
  tabs: Tab[];
  rightSide?: React.ReactNode;
}

export const Tabs = ({ tabs, rightSide }: TabsProps) => {
  return (
    <div className="flex flex-1 flex-col px-2 sm:px-0 overflow-auto">
      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b items-center">
          <div className="flex space-x-4 flex-grow">
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                className={({ selected }) =>
                  classNames(
                    "py-2.5 text-sm font-medium leading-5 border-b-2 outline-none",
                    selected
                      ? "text-blue-600  border-blue-600"
                      : "text-slate-600 hover:text-slate-700 border-transparent"
                  )
                }
              >
                {tab.title}
              </Tab>
            ))}
          </div>
          {rightSide}
        </Tab.List>
        <Tab.Panels className="mt-2 flex flex-grow flex-col overflow-auto">
          {tabs.map((tab) => (
            <Tab.Panel className="flex flex-grow flex-col" key={tab.id}>
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
