import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { Base } from "@iguhealth/components";
import {
  CapabilityStatementRestResource,
  Resource,
} from "@iguhealth/fhir-types";

import { getClient } from "../data/client";
import { getCapabilities } from "../data/capabilities";

const DisplayResources = () => {
  const capabilities = useRecoilValue(getCapabilities);
  console.log(capabilities);
  const navigate = useNavigate();
  const c = useRecoilValue(getClient);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<Resource[]>([]);

  useEffect(() => {
    c.search_system({}, [
      { name: "_count", value: [10] },
      { name: "_sort", value: ["-_lastUpdated"] },
    ]).then((response) => {
      setIsLoading(false);
      setData(response.resources);
    });
  }, []);
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-semibold">Resources</h2>
      <Base.Table
        isLoading={isLoading}
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
