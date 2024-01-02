import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export function Add({
  onChange,
  children,
}: Readonly<{ onChange: () => void; children?: React.ReactNode }>) {
  return (
    <span
      className="flex items-center  text-slate-400 cursor-pointer hover:text-slate-500"
      onClick={() => {
        onChange();
      }}
    >
      <PlusIcon className=" h-4 w-4" /> {children ? children : "Add"}
    </span>
  );
}
