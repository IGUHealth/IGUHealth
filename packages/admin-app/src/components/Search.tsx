import React from "react";
import { openSearchModalAtom } from "./SearchModal";

import { useSetRecoilState } from "recoil";

function Search() {
  const openSearchModal = useSetRecoilState(openSearchModalAtom);

  return (
    <>
      <button
        onClick={() => openSearchModal(() => true)}
        className="flex flex-1 max-w-screen-sm p-3 border rounded-lg space-x-2 items-center shadow-sm focus:outline-none"
      >
        <span className="text-left flex-1 text-slate-400 text-sm">
          Search...
        </span>
        <span className="flex-none text-slate-400 font-semibold">⌘K</span>
      </button>
      <div>
        <React.Suspense fallback={<div />}></React.Suspense>
      </div>
    </>
  );
}

export default Search;
