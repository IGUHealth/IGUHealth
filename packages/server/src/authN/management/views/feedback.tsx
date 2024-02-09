import React from "react";

import { Feedback } from "@iguhealth/components";

import Base from "../../../views/base.js";

export default function ({
  title,
  logo,
  header,
  content,
}: {
  title: string;
  logo: string;
  header: string;
  content: string;
}) {
  return (
    <Base>
      <Feedback title={title} logo={logo} header={header} content={content} />
    </Base>
  );
}
