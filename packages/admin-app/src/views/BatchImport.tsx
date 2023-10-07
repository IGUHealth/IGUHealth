import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { Bundle, OperationOutcome } from "@iguhealth/fhir-types/r4/types";
import { Base } from "@iguhealth/components";

import { getClient } from "../data/client";

const getData = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const data = reader.result;
      if (typeof data === "string") {
        resolve(data.split(",")[1]);
      } else {
        reject("FileReader result was not a string");
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function BatchImportView() {
  const navigate = useNavigate();
  const client = useRecoilValue(getClient);
  const [batch, setBatch] = useState<Bundle>();
  const [issues, setIssues] = useState<string[]>([]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div>
        <Base.Input
          label="Select Batch file to import"
          issues={issues}
          type="file"
          onChange={(e) => {
            const file = e.target?.files?.[0];

            if (!file) return;
            getData(file).then((data) => {
              try {
                const json = JSON.parse(atob(data));
                if (json.resourceType !== "Bundle" && json.type !== "batch")
                  throw new Error("Not a batch bundle");
                setBatch(json);
              } catch (e) {
                setIssues([`${e}`]);
              }
            });
          }}
        />

        <div className="flex justify-end">
          <Base.Button
            disabled={batch === undefined}
            className="mt-2"
            buttonSize="medium"
            onClick={() => {
              if (batch) {
                const batchPromise = client.batch({}, batch);
                Base.Toaster.promise(batchPromise, {
                  loading: "Uploading Batch bundle",
                  success: (success) => `Batch bundle was uploaded`,
                  error: (error) => {
                    const message = (
                      error.operationOutcome as OperationOutcome
                    ).issue
                      .map((issue) => issue.diagnostics)
                      .join("\n");
                    return message;
                  },
                }).then((v) => {
                  navigate("/");
                });
              }
            }}
          >
            Import
          </Base.Button>
        </div>
      </div>
    </div>
  );
}
