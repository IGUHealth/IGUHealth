import React, { useEffect, useMemo } from "react";

import { useRecoilValue } from "recoil";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

import { Base } from "@iguhealth/components";
import { Resource, ResourceType } from "@iguhealth/fhir-types/r4/types";

import { getClient } from "../data/client";

const initialQuery = "_count=20&_sort=-_lastUpdated";

export default function ResourceTypeView() {
  const client = useRecoilValue(getClient);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams({
    query: initialQuery,
  });
  const params = useParams();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<Resource[] | undefined>(undefined);
  const search = useMemo(
    () => (query: string) => {
      setIsLoading(true);
      client
        .search_type({}, params.resourceType as ResourceType, query)
        .then((response) => {
          setIsLoading(false);
          setData(response.resources);
        })
        .catch((e) => console.error(e));
    },
    [setIsLoading, setData, client, params.resourceType]
  );

  useEffect(() => {
    search(searchParams.get("query") || "");
  }, [params.resourceType]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-center mb-2">
        <h2 className="flex text-2xl font-semibold mr-4">
          {params.resourceType}
        </h2>
        <div className="flex flex-grow border hover:border-indigo-700 h-10 focus:border-indigo-700">
          <Base.Input
            hideBorder
            placeholder="Enter search query e.g. _count=10&_sort=_lastUpdated"
            className="h-full rounded-md overflow-hidden flex flex-grow px-4 mr-1 text-xl font-light outline-none"
            value={searchParams.get("query") || ""}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                search(searchParams.get("query") || "");
              }
            }}
            onChange={(e) => {
              setSearchParams({ query: e.target.value });
            }}
          />
          <Base.Button
            className="border-l ring-0 shadow-none rounded-none"
            buttonSize="small"
            buttonType="secondary"
            onClick={() => {
              search(searchParams.get("query") || "");
            }}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </Base.Button>
        </div>
      </div>
      <div className="mt-2 mb-4 flex justify-start">
        <Base.Button
          className="ml-2 font-medium"
          buttonSize="small"
          buttonType="secondary"
          onClick={() => navigate(`/resources/${params.resourceType}/new`)}
        >
          <div className="flex items-center justify-center ">
            <PlusIcon className="w-4 h-4 mr-1" /> <span>New</span>
          </div>
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
