import React, { useEffect, useMemo } from "react";

import { useRecoilValue } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Base } from "@iguhealth/components";
import { Resource, ResourceType } from "@iguhealth/fhir-types/r4/types";

import { getClient } from "../data/client";

const initialQuery = "_count=20&_sort=-_lastUpdated";

export default function ResourceTypeView() {
  const navigate = useNavigate();
  const params = useParams();
  const c = useRecoilValue(getClient);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<Resource[] | undefined>(undefined);
  const [query, setQuery] = React.useState(initialQuery);
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
    setQuery(initialQuery);
    search(initialQuery);
  }, [params]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-center mb-4">
        <h2 className="flex text-2xl font-semibold mr-4">
          {params.resourceType}
        </h2>
        <Base.Input
          placeholder="Enter search query e.g. _count=10&_sort=_lastUpdated"
          className="h-full rounded-md overflow-hidden flex flex-grow px-4 mr-1 text-xl font-light border hover:border-indigo-700 focus:border-indigo-700 outline-none"
          value={query}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              search(query);
            }
          }}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <Base.Button
          buttonSize="small"
          buttonType="primary"
          onClick={(_e) => search(query)}
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
        </Base.Button>
      </div>
      <div className="mt-2 mb-1 flex justify-end">
        <Base.Button
          className="ml-2"
          buttonSize="small"
          buttonType="secondary"
          onClick={(_e) => navigate(`/resources/${params.resourceType}/new`)}
        >
          Create
        </Base.Button>
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
