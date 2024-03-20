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
 * Render a react element to a Koa context with base html wrapped.
 * @param ctx Koa context (will set body with rendered react).
 * @param element The react element to render.
 */
export function renderPipe(
  ctx: Koa.Context,
  element: React.ReactElement,
  status = 200,
) {
  const stream = new PassThrough();

  const { pipe } = renderToPipeableStream(wrapComponent(element), {
    // bootstrapScripts: ["/main.js"],
    onShellReady() {
      ctx.respond = false;
      ctx.status = status;
      ctx.set("content-type", "text/html");
      pipe(stream);
      stream.end();
    },
  });
  ctx.body = stream;
}

/**
 * Render element to string with wrapped base html.
 * @param element The react element to render.
 */
export function renderString(element: React.ReactElement) {
  return renderToString(wrapComponent(element));
}
