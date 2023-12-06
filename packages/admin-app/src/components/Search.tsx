import React, { useRef, useState, Fragment, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Dialog, Transition } from "@headlessui/react";
import { Base } from "@iguhealth/components";

import { getCapabilities } from "../data/capabilities";

function SearchModal({
  position,
  isOpen,
  closeModal,
  value = "",
}: {
  value?: string;
  position: DOMRect | undefined;
  isOpen: boolean;
  closeModal: () => void;
}) {
  const [search, setSearch] = useState(value);
  const capabilities = useRecoilValue(getCapabilities);

  console.log(capabilities);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                style={{
                  left: position?.left + "px",
                  width: position?.width + "px",
                  top: (position?.top || 0) + "px",
                  position: "absolute",
                }}
                className="w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
              >
                <div className="flex flex-1 max-w-screen-sm p-3 rounded-lg space-x-2 items-center  focus:outline-none">
                  <input
                    className="focus:outline-none text-left flex-1 text-slate-400 text-sm"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <span className="flex-none text-slate-400 font-semibold">
                    ⌘K
                  </span>
                </div>
                <div className="text-slate-600 space-y-2 px-2 py-2 ">
                  {capabilities?.rest?.[0].resource
                    ?.filter((r) => {
                      return (
                        r.type.toLowerCase().includes(search.toLowerCase()) ||
                        r.profile?.toLowerCase().includes(search.toLowerCase())
                      );
                    })
                    .map((resource) => {
                      return (
                        <div className="cursor-pointer px-1 py-1 border-b hover:bg-blue-100">
                          <div>
                            <span className="text-sm">{resource.type}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">
                              {resource.profile}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

interface SearchProps {
  //onChange?: (value: string) => void;
}

function Search(props: SearchProps) {
  const searchRef: React.MutableRefObject<HTMLButtonElement | null> =
    useRef(null);
  const [searchPosition, setSearchPosition] = useState<DOMRect | undefined>(
    undefined
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSearchPosition(() => searchRef.current?.getBoundingClientRect());
  }, [searchRef, setSearchPosition]);

  useEffect(() => {
    const keyboardSearch = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", keyboardSearch);
    return () => {
      window.removeEventListener("keydown", keyboardSearch);
    };
  }, [setIsOpen]);

  return (
    <>
      <button
        ref={searchRef}
        onClick={() => setIsOpen((open) => !open)}
        className="flex flex-1 max-w-screen-sm p-3 border rounded-lg space-x-2 items-center shadow-sm focus:outline-none"
      >
        <span className="text-left flex-1 text-slate-400 text-sm">
          Search...
        </span>
        <span className="flex-none text-slate-400 font-semibold">⌘K</span>
      </button>
      <div>
        <React.Suspense fallback={<div />}>
          <SearchModal
            position={searchPosition}
            isOpen={isOpen}
            closeModal={() => setIsOpen(false)}
          />
        </React.Suspense>
      </div>
    </>
  );
}

export default Search;
