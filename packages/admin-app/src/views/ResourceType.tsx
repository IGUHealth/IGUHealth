import React, { useEffect, useMemo } from "react";

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
  const [data, setData] = React.useState<Resource[] | undefined>(undefined);
  const [query, setQuery] = React.useState("_count=20&_sort=-_lastUpdated");
  const search = useMemo(
    () => (query: string) => {
      setIsLoading(true);
      c.search_type({}, params.resourceType as ResourceType, query)
        .then((response) => {
          setIsLoading(false);
          setData(response.resources);
        })
        .catch((e) => console.error(e));
    },
    [setIsLoading, setData, c]
  );

  useEffect(() => {
    if (!data) {
      search(query);
    }
  }, [query]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-center mb-4">
        <h2 className="text-2xl font-semibold">{params.resourceType}</h2>

        <Base.Input
          placeholder="Enter search query e.g. _count=10&_sort=_lastUpdated"
          className="rounded overflow-hidden flex flex-grow px-1 ml-4 text-xl font-light border border-white hover:border-indigo-700 focus:border-indigo-700"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Base.Button
          className="ml-2"
          size="small"
          label="Search"
          onClick={(_e) => search(query)}
        />
      </div>
      <Base.Table
        isLoading={isLoading}
        data={data || []}
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
