import React from "react";

import { SignupForm } from "@iguhealth/components";

export default function ({ action }: { action: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>IGUHealth Login</title>
        <link rel="icon" href="/public/img/logo.svg" />
        <link rel="stylesheet" href="/public/css/index.css"></link>
      </head>
      <body>
        <SignupForm logo="/public/img/logo.svg" action={action} />
      </body>
    </html>
  );
}
