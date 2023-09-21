import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
// import { javascript } from "@codemirror/lang-javascript";

import {
  Resource,
  OperationOutcome,
  ResourceType,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { Base } from "@iguhealth/components";

import { getClient } from "../data/client";

const extensions = [basicSetup, json()];

function JSONEditor({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <div className="flex flex-1 border overflow-auto">
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
  const navigate = useNavigate();

  const { resourceType, id } = useParams();

  useEffect(() => {
    if (id !== "new")
      client
        .read({}, resourceType as ResourceType, id as id)
        .then((response) => {
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
      rightSide={
        <Base.DropDownMenu
          links={[
            {
              label: id === "new" ? "Create" : "Update",
              onClick: (_e) => {
                try {
                  const resource = JSON.parse(value);
                  const editPromise =
                    id === "new"
                      ? client.create({}, { ...resource, resourceType })
                      : client.update({}, resource);
                  Base.Toaster.promise(editPromise, {
                    loading: "Creating Resource",
                    success: (success) =>
                      `Updated ${(success as Resource).resourceType}`,
                    error: (error) => {
                      const message = (
                        error.operationOutcome as OperationOutcome
                      ).issue
                        .map((issue) => issue.diagnostics)
                        .join("\n");

                      return message;
                    },
                  }).then((value) =>
                    navigate(
                      `/resources/${resourceType}/${(value as Resource).id}`,
                      { replace: true }
                    )
                  );
                } catch (e) {
                  Base.Toaster.error(`${e}`);
                }
              },
            },
            {
              className: "text-red-600 hover:bg-red-600 hover:text-white",
              label: "Delete",
              onClick: (_e) => {
                const deletingResource = client.delete(
                  {},
                  resourceType as ResourceType,
                  id as id
                );
                Base.Toaster.promise(deletingResource, {
                  loading: "Deleting Resource",
                  success: (success) => `Deleted ${resourceType}`,
                  error: (error) => {
                    return `${error}`;
                  },
                }).then((v) => navigate(`/resources/${resourceType}`));
              },
            },
          ]}
        >
          <Base.Button
            buttonType="secondary"
            buttonSize="small"
            onClick={(_e) => {}}
          >
            <div className="flex items-center">
              <span>Actions</span> <ChevronDownIcon className="ml-1 w-3 h-3" />
            </div>
          </Base.Button>
        </Base.DropDownMenu>
      }
    />
  );
}
