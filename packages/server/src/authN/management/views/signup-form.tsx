import React from "react";

import { SignupForm } from "@iguhealth/components";

import Base from "../../../views/base.js";

export default function ({ action }: { action: string }) {
  return (
    <Base>
      <SignupForm logo="/public/img/logo.svg" action={action} />
    </Base>
  );
}
