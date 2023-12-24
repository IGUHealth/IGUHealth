import React from "react";
import {
  Reference,
  StructureDefinition,
  Resource,
  ResourceType,
  Bundle,
  uri,
  code,
} from "@iguhealth/fhir-types/r4/types";

import {
  MagnifyingGlassIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/outline";

import { EditableProps, ClientProps } from "../types";
import { InputContainer } from "../../base/containers";
import { Modal } from "../../base/modal";
import { FHIRGenerativeForm } from "../generative/form";
import { Input, Loading } from "../../base";
import { FHIRCodeEditable } from "..";

export type FHIRReferenceEditableProps = EditableProps<Reference> &
  ClientProps & {
    resourceTypesAllowed?: ResourceType[];
  };

const ReferenceView = ({
  value,
  client,
}: { value: Reference | undefined } & ClientProps) => {
  const [sd, setSd] = React.useState<StructureDefinition>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [resource, setResource] = React.useState<Resource>();
  React.useEffect(() => {
    setLoading(true);
    if (value?.reference) {
      const resourceType = value.reference.split("/")[0];
      const id = value.reference.split("/")[1];
      client
        .batch({}, {
          resourceType: "Bundle",
          type: "batch",
          entry: [
            { request: { method: "GET", url: `${resourceType}/${id}` } },
            {
              request: {
                method: "GET",
                url: `StructureDefinition/${resourceType}`,
              },
            },
          ],
        } as Bundle)
        .then((batchResponse) => {
          if (
            batchResponse.entry?.[0].resource?.resourceType === resourceType ||
            batchResponse.entry?.[0].resource?.id === id
          ) {
            setResource(batchResponse.entry?.[0].resource);
          }
          setSd(batchResponse.entry?.[1].resource as StructureDefinition);
        })
        .then(() => setLoading(false))
        .catch((e) => {
          console.error(e);
        });
    }
  }, [value]);

  return loading ? (
    <div className="flex justify-center items-center">
      <Loading />
    </div>
  ) : resource && sd ? (
    <FHIRGenerativeForm
      client={client}
      value={resource}
      structureDefinition={sd}
    />
  ) : (
    <div className="flex justify-center items-center">
      <span className="font-semibold text-slate-600">Resource not found</span>
    </div>
  );
};

const SearchResult = ({
  resource,
  onChange,
}: {
  resource: Resource;
  onChange: FHIRReferenceEditableProps["onChange"];
}) => {
  return (
    <div
      className="hover:bg-blue-100 py-2 px-4 cursor-pointer border "
      onClick={(e) =>
        onChange?.call(this, {
          reference: `${resource.resourceType}/${resource.id}`,
        })
      }
    >
      <span className="font-semibold text-slate-700">
        {resource.resourceType}/{resource.id}
      </span>
    </div>
  );
};

const ReferenceSearch = ({
  client,
  onChange,
  resourceTypesAllowed,
}: ClientProps & {
  resourceTypesAllowed?: ResourceType[];
  onChange: FHIRReferenceEditableProps["onChange"];
}) => {
  const [results, setResults] = React.useState<Resource[]>([]);
  const [query, setQuery] = React.useState<string>("");
  const [resourceType, setResourceType] = React.useState<
    ResourceType | undefined
  >(resourceTypesAllowed?.[0]);

  React.useEffect(() => {
    if (resourceType) {
      client.search_type({}, resourceType, query).then((bundle) => {
        setResults(bundle.resources);
      });
    }
  }, [client, resourceType, query]);

  return (
    <div>
      <div className="flex space-x-1 text-slate-700  ">
        <div className="w-36">
          <FHIRCodeEditable
            client={client}
            value={resourceType as code}
            filter={(option) =>
              !resourceTypesAllowed ||
              resourceTypesAllowed.includes(
                option.value.toString() as ResourceType
              )
            }
            onChange={(value) => setResourceType(value as ResourceType)}
            system={"http://hl7.org/fhir/ValueSet/resource-types" as uri}
          />
        </div>
        <div className="flex flex-1">
          <Input
            placeholder="Search query string ..."
            icon={<MagnifyingGlassIcon className="w-5 h-5" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4 h-96 space-y-2 overflow-auto">
        {results.map((resource) => (
          <SearchResult
            key={resource.id}
            onChange={onChange}
            resource={resource}
          />
        ))}
      </div>
    </div>
  );
};

export const FHIRReferenceEditable = ({
  value,
  onChange,
  issue,
  client,
  label,
  resourceTypesAllowed,
}: FHIRReferenceEditableProps) => {
  return (
    <Modal
      ModalContent={(setOpen) => (
        <ReferenceSearch
          onChange={(ref) => {
            onChange?.call(this, ref);
            setOpen(false);
          }}
          client={client}
          resourceTypesAllowed={resourceTypesAllowed}
        />
      )}
    >
      {(openSearch) => (
        <Modal
          ModalContent={(_setOpen) => (
            <ReferenceView value={value} client={client} />
          )}
        >
          {(openDisplay) => (
            <InputContainer label={label} issues={issue ? [issue] : []}>
              <div className="flex space-x-1">
                <div onClick={() => openDisplay(true)}>
                  <a className="text-blue-400 hover:text-blue-500 cursor-pointer">
                    {value?.reference}
                  </a>
                </div>
                <span onClick={() => openSearch(true)}>
                  <a className="text-slate-700 hover:text-blue-700 cursor-pointer font-semibold">
                    {<MagnifyingGlassCircleIcon className="w-5 h-5" />}
                  </a>
                </span>
              </div>
            </InputContainer>
          )}
        </Modal>
      )}
    </Modal>
  );
};
