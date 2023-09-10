import React, { useEffect } from "react";

import { useRecoilValue } from "recoil";
import { useNavigate, useParams } from "react-router-dom";

import { Base } from "@iguhealth/components";
import { Resource, ResourceType } from "@iguhealth/fhir-types";

import { getClient } from "../data/client";

export default function ResourceTypeView() {
  const navigate = useNavigate();
  const params = useParams();
  const c = useRecoilValue(getClient);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<Resource[]>([]);

  useEffect(() => {
    c.search_type({}, params.resourceType as ResourceType, [
      { name: "_count", value: [10] },
      { name: "_sort", value: ["-_lastUpdated"] },
    ]).then((response) => {
      setIsLoading(false);
      setData(response.resources);
    });
  }, []);
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-semibold mb-4">{params.resourceType}</h2>
      <Base.Table
        isLoading={isLoading}
        data={data}
        onRowClick={(row: Resource) => {
          navigate(`/resources/${row.resourceType}/${row.id}`);
        }}
        columns={[
          {
            name: "Id",
            selector: "$this.id",
            selectorType: "fhirpath",
          },
          {
            name: "Resource Type",
            selector: "$this.resourceType",
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
    </div>
  );
}
