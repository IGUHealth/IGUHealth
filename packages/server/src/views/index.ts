import Koa from "koa";
import React from "react";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { PassThrough } from "stream";

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
