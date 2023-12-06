import React, { useRef, useState, useEffect } from "react";
import { openSearchModalAtom } from "./SearchModal";
import { useSetRecoilState } from "recoil";

interface SearchProps {
  //onChange?: (value: string) => void;
}

function Search(props: SearchProps) {
  const searchRef: React.MutableRefObject<HTMLButtonElement | null> =
    useRef(null);
  const [searchPosition, setSearchPosition] = useState<DOMRect | undefined>(
    undefined
  );
  const openSearchModal = useSetRecoilState(openSearchModalAtom);

  useEffect(() => {
    setSearchPosition(() => searchRef.current?.getBoundingClientRect());
  }, [searchRef, setSearchPosition]);

  useEffect(() => {
    const keyboardSearch = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openSearchModal((open) => !open);
      }
    };
    window.addEventListener("keydown", keyboardSearch);
    return () => {
      window.removeEventListener("keydown", keyboardSearch);
    };
  }, [openSearchModal]);

  return (
    <>
      <button
        ref={searchRef}
        onClick={() => openSearchModal((open) => !open)}
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
