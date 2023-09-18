import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { Base } from "@iguhealth/components";
import {
  CapabilityStatementRestResource,
  Resource,
} from "@iguhealth/fhir-types/r4/types";

import { getCapabilities } from "../data/capabilities";

const DisplayResources = () => {
  const capabilities = useRecoilValue(getCapabilities);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-semibold mb-4">Supported Resources</h2>
      <Base.Table
        data={capabilities?.rest?.[0].resource || []}
        onRowClick={(row: CapabilityStatementRestResource) => {
          navigate(`/resources/${row.type}`);
        }}
        columns={[
          {
            name: "Resource Type",
            selector: "$this.type",
            selectorType: "fhirpath",
          },
          {
            name: "Interactions Supported",
            selector: "$this.interaction.code",
            selectorType: "fhirpath",
          },
          {
            name: "Profile",
            selector: "$this.profile",
            selectorType: "fhirpath",
          },
        ]}
      />
    </div>
  );
};

export default function ResourcesView() {
  return (
    <React.Suspense
      fallback={
        <div className="h-screen flex flex-1 justify-center items-center flex-col">
          <Base.Loading />
          <div className="mt-1 ">Loading...</div>
        </div>
      }
    >
      <DisplayResources />
    </React.Suspense>
  );
}
