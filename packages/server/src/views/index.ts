import React from "react";
import { renderToString } from "react-dom/server";

import Base from "./base.js";

export function wrapComponent(element: React.ReactElement) {
  return React.createElement(Base, {
    children: element,
  });
}

/**
 * Render element to string with wrapped base html.
 * @param element The react element to render.
 */
export function renderString(element: React.ReactElement) {
  return renderToString(wrapComponent(element));
}
