import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { Menu } from "@headlessui/react";
import classNames from "classnames";

interface Link
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  label: React.ReactNode;
}

export interface DropdownMenuProps {
  links: Link[];
  children: React.ReactNode;
}

function DropDownMenu({ links, children }: DropdownMenuProps) {
  return (
    <Menu>
      <div className="relative">
        <Menu.Button>{children}</Menu.Button>
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {links.map((link) => (
            <Menu.Item key={link.key}>
              {({ active }) => (
                <a
                  {...link}
                  className={classNames(
                    "cursor-pointer block px-4 py-2 text-sm",
                    active
                      ? "bg-indigo-600 text-white"
                      : "text-indigo-600 hover:bg-indigo-600 hover:text-white",
                    link.className
                  )}
                >
                  {link.label}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </div>
    </Menu>
  );
}

export { Menu, DropDownMenu };
