import React, { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { LabelContainer } from "./labelContainer";

type Option = { value: string | number; label: string };
export interface SelectProps {
  value?: string | number;
  options: Array<Option>;
  onChange?: (value: Option) => void;
  issue?: string;
  label?: string;
  open?: boolean;
}

export const Select = ({
  value,
  options,
  label,
  issue,
  open = false,
  onChange,
}: SelectProps) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((person) =>
          person.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox
      value={
        value
          ? options.filter((o) => o.value === value)[0] || {
              value,
              label: value,
            }
          : undefined
      }
      onChange={onChange}
      nullable
    >
      <div className="relative mt-1">
        <LabelContainer label={label} issues={issue ? [issue] : []}>
          <Combobox.Input
            className="outline-none w-full border-none text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(option: Option) => option.label}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </LabelContainer>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {query.length > 0 && open && (
              <Combobox.Option
                value={{ value: query, label: query }}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-teal-600 text-white" : "text-gray-900"
                  }`
                }
              >
                Create "{query}"
              </Combobox.Option>
            )}
            {filteredOptions.map((option: Option) => (
              <Combobox.Option
                key={option.value}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-teal-600 text-white" : "text-gray-900"
                  }`
                }
                value={option}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-white" : "text-teal-600"
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};
