import { createRequire } from "module";
import fs from "node:fs";
import React from "react";

const require = createRequire(import.meta.url);
const indexCSS = fs
  .readFileSync(require.resolve("@iguhealth/components/dist/index.css"))
  .toString();

export default function Base({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
      React.createElement("title", null, "IGUHealth Login"),
      React.createElement("link", {
        rel: "icon",
        href: "/public/img/logo.svg",
      }),
      React.createElement("link", {
        rel: "stylesheet",
        href: "/public/css/index.css",
      }),
      React.createElement("style", {
        dangerouslySetInnerHTML: { __html: indexCSS },
      }),
    ),
    React.createElement("body", null, children),
  );
}
