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

function ResourceHistory() {
  const client = useRecoilValue(getClient);
  const { resourceType, id } = useParams();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Resource[] | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    client
      .historyInstance({}, resourceType as ResourceType, id as id)
      .then((response) => {
        setHistory(response);
        setLoading(false);
        return response;
      });
  }, [resourceType, id, setHistory]);

  return (
    <Base.Table
      isLoading={loading}
      data={history || []}
      columns={[
        {
          name: "Version",
          selector: "$this.meta.versionId",
          selectorType: "fhirpath",
        },
        {
          name: "Author",
          selector:
            "$this.meta.extension.where(url='https://iguhealth.app/author').valueString",
          selectorType: "fhirpath",
        },
        {
          name: "Last Updated",
          selector: "$this.meta.lastUpdated",
          selectorType: "fhirpath",
        },
      ]}
    />
  );
}

export default function ResourceEditorView() {
  const client = useRecoilValue(getClient);
  const [value, setValue] = React.useState("");

  const { resourceType, id } = useParams();

  useEffect(() => {
    client.read({}, resourceType as ResourceType, id as id).then((response) => {
      setValue(JSON.stringify(response, null, 2));
      return response;
    });
  }, [resourceType, id]);

  return (
    <Base.Tabs
      tabs={[
        {
          id: 1,
          title: "Editor",
          content: <JSONEditor value={value} setValue={setValue} />,
        },
        {
          id: 1,
          title: "History",
          content: <ResourceHistory />,
        },
        // {
        //   id: 1,
        //   title: "Audit events",
        //   content: <span> Audit Events </span>,
        // },
      ]}
    />
  );
}
