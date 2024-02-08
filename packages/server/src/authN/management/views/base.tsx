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
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>IGUHealth Login</title>
        <link rel="icon" href="/public/img/logo.svg" />
        <link rel="stylesheet" href="/public/css/index.css"></link>
        <style>{indexCSS}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
