import Koa from "koa";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "stream";

import Base from "./base.js";

export function render(ctx: Koa.Context, Component: React.ReactElement) {
  const stream = new PassThrough();

  const { pipe } = renderToPipeableStream(
    React.createElement(Base, {
      children: Component,
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
