import React, { useState, Fragment } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { Dialog, Transition } from "@headlessui/react";

import { getCapabilities } from "../data/capabilities";
import { useNavigate } from "react-router-dom";

export const openSearchModalAtom = atom({
  key: "openSearchModal",
  default: false,
});

function SearchModal({
  position,
  value = "",
}: {
  value?: string;
  position?: DOMRect;
}) {
  const [search, setSearch] = useState(value);
  const capabilities = useRecoilValue(getCapabilities);
  const [openModal, setOpenModal] = useRecoilState(openSearchModalAtom);
  const navigate = useNavigate();

  return (
    <Transition appear show={openModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setOpenModal((v: boolean) => !v)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0">
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
              <Dialog.Panel className="absolute top-12 max-w-lg w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-opacity">
                <div className="flex flex-1 p-3 rounded-lg space-x-2 items-center focus:outline-none">
                  <input
                    className="focus:outline-none text-left flex-1 text-slate-400 text-sm"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    onClick={(e) => {
                      setOpenModal(false);
                    }}
                    className="shadow-sm cursor flex-none text-xs text-slate-400 p-1 border"
                  >
                    ESC
                  </button>
                </div>
                <div className="w-full border-b" />
                <div className="text-slate-600 space-y-2 px-2 py-2 max-h-64 overflow-y-auto">
                  {capabilities?.rest?.[0].resource
                    ?.filter((r) => {
                      return (
                        r.type.toLowerCase().includes(search.toLowerCase()) ||
                        r.profile?.toLowerCase().includes(search.toLowerCase())
                      );
                    })
                    .map((resource) => {
                      return (
                        <div
                          onClick={(e) => {
                            navigate(`/resources/${resource.type}`);
                            setOpenModal(false);
                          }}
                          className="group cursor-pointer px-1 py-1 rounded hover:bg-blue-100"
                        >
                          <div>
                            <span className="text-sm group-hover:text-slate-700 font-weight">
                              {resource.type}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 group-hover:text-slate-500">
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

export default SearchModal;
