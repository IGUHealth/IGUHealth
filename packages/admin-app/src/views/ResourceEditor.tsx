import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { Base } from "@iguhealth/components";

import { getClient } from "../data/client";

export default function ResourceEditor() {
  const client = useRecoilValue(getClient);
  const [value, setValue] = React.useState("Hello World");

  let { resourceType, id } = useParams();

  return (
    <Base.CodeMirror
      value="Hello World"
      onChange={(value, _vu) => {
        setValue(value);
      }}
    />
  );
}
