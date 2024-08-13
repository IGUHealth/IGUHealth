import React from "react";
import ReactDom from "react-dom/server";

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
  return ReactDom.renderToString(wrapComponent(element));
}

export function renderPipe(
  element: React.ReactElement,
  options?: ReactDom.RenderToPipeableStreamOptions,
) {
  const reactPipe = ReactDom.renderToPipeableStream(
    wrapComponent(element),
    options,
  );

  return reactPipe;
}
