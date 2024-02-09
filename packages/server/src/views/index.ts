import Koa from "koa";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "stream";

import Base from "./base.js";

/**
 * Render a react element to a Koa context with base html wrapped.
 * @param ctx Koa context (will set body with rendered react).
 * @param element The react element to render.
 */
export function render(ctx: Koa.Context, element: React.ReactElement) {
  const stream = new PassThrough();

  const { pipe } = renderToPipeableStream(
    React.createElement(Base, {
      children: element,
    }),
    {
      // bootstrapScripts: ["/main.js"],
      onShellReady() {
        ctx.respond = false;
        ctx.status = 200;
        ctx.set("content-type", "text/html");
        pipe(stream);
        stream.end();
      },
    },
  );
  ctx.body = stream;
}
