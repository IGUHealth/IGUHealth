import React, { useEffect, useRef, useState } from "react";
import {
  Annotation,
  EditorState,
  StateEffect,
  Extension,
} from "@codemirror/state";
import { EditorView, placeholder } from "@codemirror/view";

export interface CodeMirrorProps {
  value?: string;
  autoFocus?: boolean;
  extensions?: Extension[];
  theme?: Parameters<typeof EditorView.theme>[0];
}

export const CodeMirror = ({
  value,
  autoFocus,
  extensions = [],
  theme = {},
}: CodeMirrorProps) => {
  const [view, setView] = useState<EditorView>();
  const [state, setState] = useState<EditorState>();
  const root = useRef(null);
  useEffect(() => {
    if (root.current) {
      const state = EditorState.create({
        doc: value || "",
        extensions: [...extensions, EditorView.theme(theme)],
      });
      const view = new EditorView({
        state: state,
        parent: root.current,
      });
      if (autoFocus) {
        view.focus();
      }

      setView(view);
      setState(state);
    }
  }, [root, setView, setState]);
  return <div className="border" ref={root} />;
};
