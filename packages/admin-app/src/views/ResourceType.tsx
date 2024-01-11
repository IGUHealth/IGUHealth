import React, { useEffect, useMemo } from "react";

import { useRecoilValue } from "recoil";
import {
  generatePath,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

import { Table, Button, Input } from "@iguhealth/components";
import {
  SearchParameter,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/r4/types";

import { getClient } from "../db/client";

const initialQuery = "_count=20&_sort=-_lastUpdated";

export default function ResourceTypeView() {
  const client = useRecoilValue(getClient);
  const params = useParams();
  const navigate = useNavigate();
  const [queryParameter, setQueryParameter] = useSearchParams({
    query: initialQuery,
  });
  const [searchParameters, setSearchParameters] =
    React.useState<SearchParameter[]>();
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
    client
      .search_type({}, "SearchParameter", [
        { name: "base", value: ["Resource", params.resourceType as string] },
        { name: "_count", value: ["100"] },
        // { name: "type", value: ["string", "number", "code"] },
      ])
      .then((response) => {
        setSearchParameters(response.resources);
      });
    search(queryParameter.get("query") || "");
  }, [params.resourceType]);

  return (
    <div className="flex flex-col flex-1 w-full text-slate-700">
      <div className="flex items-center justify-center mb-2">
        <h2 className="flex text-xl font-semibold mr-4 ">
          {params.resourceType}
        </h2>
        <div className="flex flex-grow border hover:border-blue-700 h-10 focus:border-blue-700 overflow-hidden">
          <Input
            hideBorder
            placeholder="Enter search query e.g. _count=10&_sort=_lastUpdated"
            className="h-full rounded-md overflow-hidden flex flex-grow px-4 mr-1 text-xl font-light outline-none"
            value={queryParameter.get("query") || ""}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                search(queryParameter.get("query") || "");
              }
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => {
              setQueryParameter({ query: e.target.value });
            }}
          />
          <Button
            className="border-l ring-0 shadow-none rounded-none"
            buttonSize="small"
            buttonType="secondary"
            onClick={() => {
              search(queryParameter.get("query") || "");
            }}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="mt-2 mb-4 flex justify-start">
        <Button
          className="ml-2 font-medium"
          buttonSize="small"
          buttonType="secondary"
          onClick={() =>
            navigate(
              generatePath("/w/:tenant/resources/:resourceType/:id", {
                tenant: params.tenant as string,
                resourceType: params.resourceType as string,
                id: "new",
              })
            )
          }
        >
          <div className="flex items-center justify-center ">
            <PlusIcon className="w-4 h-4 mr-1" /> <span>New</span>
          </div>
        </Button>
      </div>
      <div className="overflow-auto">
        <Table
          isLoading={isLoading}
          data={data || []}
          onRowClick={(row) => {
            navigate(
              generatePath("/w/:tenant/resources/:resourceType/:id", {
                tenant: params.tenant as string,
                resourceType: params.resourceType as string,
                id: (row as Resource).id as string,
              })
            );
          }}
          columns={[
            ...(searchParameters || [])
              .filter((s) => s.expression)
              .map(
                (
                  searchParameter
                ): {
                  selectorType: "fhirpath";
                  selector: string;
                  name: string;
                } => ({
                  name: searchParameter.name,
                  selector: searchParameter.expression as string,
                  selectorType: "fhirpath",
                })
              ),
          ]}
        />
      </div>
    </div>
  );
}
