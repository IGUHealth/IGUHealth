import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
// import { javascript } from "@codemirror/lang-javascript";

import { Resource } from "@iguhealth/fhir-types";
import { Base } from "@iguhealth/components";

import { getClient } from "../data/client";
import { ResourceType, id } from "@iguhealth/fhir-types";

const extensions = [basicSetup, json()];

function JSONEditor({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
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

export default function ResourceEditorView() {
  const client = useRecoilValue(getClient);
  const [value, setValue] = React.useState("");

  const { resourceType } = useParams();

  return (
    <Base.Tabs
      tabs={[
        {
          id: 1,
          title: "Editor",
          content: <JSONEditor value={value} setValue={setValue} />,
        },
      ]}
    />
  );
}
