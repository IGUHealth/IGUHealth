import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import classNames from "classnames";

export interface Tab {
  id: number;
  title: string;
  content: React.ReactNode;
}

export interface TabsProps {
  selectedTab?: number;
  onTab?: (tab: Tab) => void;
  tabs: Tab[];
}

export const Tabs = ({ tabs, selectedTab, onTab }: TabsProps) => {
  return (
    <div className="w-full px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b ">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                classNames(
                  "py-2.5 text-sm font-medium leading-5 border-b-2 ",
                  selected
                    ? "text-indigo-600  border-indigo-600"
                    : "text-slate-600 hover:text-slate-700 border-transparent"
                )
              }
            >
              {tab.title}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab) => (
            <Tab.Panel key={tab.id}>{tab.content}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
