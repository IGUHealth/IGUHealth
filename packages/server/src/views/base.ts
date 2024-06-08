import { createRequire } from "module";
import fs from "node:fs";
import React from "react";

const require = createRequire(import.meta.url);

export default function Base({
  title = "IGUHealth",
  children,
}: Readonly<{ children: React.ReactNode; title?: string }>) {
  return React.createElement(
    "html",
    { lang: "en" },
    React.createElement(
      "head",
      null,
      React.createElement("meta", { charSet: "utf-8" }),
      React.createElement("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      }),
      React.createElement("title", null, title),
      React.createElement("link", {
        rel: "icon",
        href: "/public/img/logo.svg",
      }),
      React.createElement("link", {
        rel: "stylesheet",
        href: "/public/css/index.css",
      }),
    ),
    React.createElement("body", null, children),
  );
}
