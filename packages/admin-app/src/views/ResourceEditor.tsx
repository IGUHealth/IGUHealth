import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup } from "codemirror";
// import { json } from "@codemirror/lang-json";

import { Base } from "@iguhealth/components";

import { getClient } from "../data/client";
import { ResourceType, id } from "@iguhealth/fhir-types";

const extensions = [basicSetup, javascript()];

console.log("exts:", extensions);

export default function ResourceEditor() {
  const client = useRecoilValue(getClient);
  const [value, setValue] = React.useState("");

  const { resourceType, id } = useParams();

  useEffect(() => {
    client.read({}, resourceType as ResourceType, id as id).then((response) => {
      setValue(JSON.stringify(response, null, 2));
    });
  }, [resourceType, id]);

  return (
    <div className="flex flex-1">
      <Base.CodeMirror
        extensions={extensions}
        value={value}
        theme={{
          "&": {
            height: "100%",
            width: "100%",
          },
        }}
        onChange={(value, _vu) => {
          setValue(value);
        }}
      />
    </div>
  );
}
