import {
  ArrowDownIcon,
  ArrowUpIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";

import { ParsedParameter } from "@iguhealth/client/url";
import {
  Address,
  CodeableConcept,
  Coding,
  HumanName,
  Identifier,
  Period,
  Quantity,
  Range,
  Reference,
  Timing,
  code,
  date,
  decimal,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

import { Button, Modal, Select, Tag } from "../../base";
import { Pagination } from "../../base/pagination";
import { Table, TableProps } from "../../base/table";
import {
  FHIRAddressReadOnly,
  FHIRCodingReadOnly,
  FHIRHumanNameReadOnly,
  FHIRIdentifierReadOnly,
  FHIRPeriodReadOnly,
  FHIRRangeReadOnly,
  FHIRReferenceReadOnly,
} from "../complex";
import { FHIRCodeableConceptReadOnly } from "../complex/CodeableConceptReadOnly";
import { FHIRQuantityReadOnly } from "../complex/QuantityReadOnly";
import { FHIRTimingReadOnly } from "../complex/TimingReadOnly";
import {
  FHIRCodeEditable,
  FHIRDateEditable,
  FHIRDecimalEditable,
  FHIRStringEditable,
  FHIRUriEditable,
} from "../primitives";
import { ClientProps } from "../types";

interface FHIRGenerativeSearchTableProps<Version extends FHIR_VERSION>
  extends Partial<TableProps>,
    ClientProps {
  fhirVersion: Version;
  resourceType: ResourceType<Version>;
}

const modifiers: Record<string, string[]> = {
  all: ["missing"],
  string: ["exact", "contains"],
};

interface SearchColumnModalBodyInputProps extends ClientProps {
  value: ParsedParameter<string | number | undefined>;
  index: number;
  onChange: (v: ParsedParameter<string | number | undefined>) => void;
  searchParameter: Resource<FHIR_VERSION, "SearchParameter">;
}

function SearchColumnModalBodyInput({
  value,
  index,
  onChange: onChangeProp,
  searchParameter,
  fhirVersion,
  client,
}: Readonly<SearchColumnModalBodyInputProps>) {
  const onChange = useMemo(() => {
    return (v: string | number | undefined) => {
      onChangeProp({
        ...value,
        value: value.value
          ?.slice(0, index)
          .concat(v)
          .concat(value.value?.slice(index + 1)),
      });
    };
  }, [value, index, onChangeProp]);

  switch (searchParameter.type) {
    case "number": {
      return (
        <FHIRDecimalEditable
          value={parseFloat(value.value[index]?.toString() ?? "") as decimal}
          onChange={onChange}
        />
      );
    }
    case "date":
      return (
        <FHIRDateEditable
          value={(value.value[index]?.toString() ?? "") as date}
          onChange={onChange}
        />
      );
    case "string":
      return (
        <FHIRStringEditable
          value={(value.value[index]?.toString() ?? "") as string}
          onChange={onChange}
        />
      );
    case "token":
      return (
        <FHIRCodeEditable
          open
          value={(value.value[index]?.toString() ?? "") as code}
          fhirVersion={fhirVersion}
          client={client}
          onChange={onChange}
        />
      );
    case "reference":
      return (
        <FHIRStringEditable
          value={(value.value[index]?.toString() ?? "") as string}
          onChange={onChange}
        />
      );
    case "quantity":
      return (
        <FHIRStringEditable
          value={(value.value[index]?.toString() ?? "") as string}
          onChange={onChange}
        />
      );
    case "uri":
      return (
        <FHIRUriEditable
          value={(value.value[index]?.toString() ?? "") as uri}
          onChange={onChange}
        />
      );
  }
}

interface SearchColumnModalBodyProps extends ClientProps {
  value: ParsedParameter<string | number | undefined>;
  onChange: (v: ParsedParameter<string | number | undefined>) => void;
  searchParameter: Resource<FHIR_VERSION, "SearchParameter">;
}
function SearchColumnModalBody({
  value,
  ...props
}: Readonly<SearchColumnModalBodyProps>) {
  return (
    <div className="space-y-1 text-slate-600">
      <div className="text-sm">
        <div className="mb-1">
          <label>Modifiers</label>
        </div>
        <div>
          <Select
            value={value.modifier}
            options={[
              ...modifiers["all"],
              ...(modifiers[props.searchParameter.type] ?? []),
            ].map((v) => ({
              label: v,
              value: v,
            }))}
            onChange={(option) => {
              if (!option) props.onChange({ ...value, modifier: undefined });
              props.onChange({ ...value, modifier: option.value.toString() });
            }}
          />
        </div>
      </div>

      <div className="text-sm">
        <div className="mb-1">
          <label>Value</label>
        </div>
        <div className="space-y-1">
          {value.value.map((v, i) => {
            return (
              <SearchColumnModalBodyInput value={value} index={i} {...props} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SearchColumnModalProps extends ClientProps {
  searchParameter: Resource<FHIR_VERSION, "SearchParameter">;
  parameters: ParsedParameter<string | number | undefined>[];
  onChange: (v: ParsedParameter<string | number | undefined>[]) => void;
}

function searchParameterTypeToColor(
  type: string | undefined,
): "blue" | "green" | "indigo" | "gray" | "purple" | "pink" | "yellow" {
  switch (type) {
    case "number": {
      return "blue";
    }
    case "date": {
      return "green";
    }

    case "token": {
      return "indigo";
    }

    case "reference": {
      return "gray";
    }

    case "quantity": {
      return "purple";
    }

    case "uri": {
      return "pink";
    }

    case "string": {
      return "yellow";
    }
    default: {
      return "blue";
    }
  }
}

function SearchColumnModal(props: Readonly<SearchColumnModalProps>) {
  const parameter = props.parameters.find(
    (p) => p.name === props.searchParameter.code,
  ) ?? { name: props.searchParameter.code, value: [undefined] };

  const [curValue, setCurValue] = useState(parameter);

  return (
    <div>
      <div className="mb-2">
        <div>
          <span className="font-semibold text-base">
            {props.searchParameter.name}
          </span>
          <span className="ml-2 text-slate-400 text-sm">
            {props.searchParameter.type}
          </span>
        </div>
        <div className="mt-1 text-xs text-nowrap truncate">
          <span className="ml-2 text-slate-400 ">
            {props.searchParameter.expression}
          </span>
        </div>
      </div>
      <div className="p-2">
        <SearchColumnModalBody
          value={curValue}
          searchParameter={props.searchParameter}
          fhirVersion={props.fhirVersion}
          client={props.client}
          onChange={(d) => {
            setCurValue(d);
          }}
        />

        <div className="flex mt-8">
          <Button
            className="mr-2"
            buttonType="danger"
            onClick={() => {
              props.onChange([
                ...props.parameters.filter(
                  (p) => p.name !== props.searchParameter.code,
                ),
              ]);
            }}
          >
            Delete
          </Button>
          <div className="flex flex-1" />
          <Button
            onClick={() => {
              props.onChange([
                ...props.parameters.filter(
                  (p) => p.name !== props.searchParameter.code,
                ),
                curValue,
              ]);
            }}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Conversion pulled from https://hl7.org/fhir/search.html#table.
 * @param searchType The Search Parameter Type
 * @param value Some Value
 */
function DataDisplay(searchType: string, value: unknown[]) {
  switch (searchType) {
    case "number": {
      return (value as number[]).map((v, i) => {
        return <div key={i}>{v}</div>;
      });
    }
    case "date": {
      return value.map((v, i) => {
        if (typeof v === "object") {
          if (Object.hasOwnProperty.call(v, "start")) {
            return (
              <div key={i}>
                <FHIRPeriodReadOnly value={v as Period} />
              </div>
            );
          } else {
            return (
              <div key={i}>
                <FHIRTimingReadOnly value={v as Timing} />
              </div>
            );
          }
        }
        return <div key={i}>{`${v}`}</div>;
      });
    }
    case "string": {
      return value.map((v, i) => {
        if (typeof v === "object") {
          if (
            Object.hasOwnProperty.call(v, "family") ||
            Object.hasOwnProperty.call(v, "given")
          ) {
            return (
              <div key={i}>
                <FHIRHumanNameReadOnly value={v as HumanName} />
              </div>
            );
          } else {
            return (
              <div key={i}>
                <FHIRAddressReadOnly value={v as Address} />
              </div>
            );
          }
        }
        return <div key={i}>{`${v}`}</div>;
      });
    }
    case "token": {
      return value.map((v, i) => {
        if (typeof v === "object") {
          if (Object.hasOwnProperty.call(v, "coding")) {
            return (
              <div key={i}>
                <FHIRCodeableConceptReadOnly value={v as CodeableConcept} />
              </div>
            );
          } else if (Object.hasOwnProperty.call(v, "code")) {
            return (
              <div key={i}>
                <FHIRCodingReadOnly value={v as Coding} />
              </div>
            );
          } else {
            return (
              <div key={i}>
                <FHIRIdentifierReadOnly value={v as Identifier} />
              </div>
            );
          }
        }
        return <div key={i}>{`${v}`}</div>;
      });
    }
    case "reference": {
      return value.map((v, i) => {
        if (typeof v === "object") {
          return (
            <div key={i}>
              <FHIRReferenceReadOnly value={v as Reference} />
            </div>
          );
        }
        return <div key={i}>{`${v}`}</div>;
      });
    }
    case "quantity": {
      return value.map((v, i) => {
        if (typeof v === "object") {
          if (Object.hasOwnProperty.call(v, "value")) {
            return (
              <div key={i}>
                <FHIRQuantityReadOnly value={v as Quantity} />
              </div>
            );
          } else {
            return (
              <div key={i}>
                <FHIRRangeReadOnly value={v as Range} />
              </div>
            );
          }
        }
        return <div key={i}>{`${v}`}</div>;
      });
    }
    case "uri": {
      return value.map((v, i) => {
        return <div key={i}>{`${v}`}</div>;
      });
    }
    default: {
      throw new Error(`Invalid search type '${searchType}'`);
    }
  }
}

interface SortIconProps {
  searchParameter: Resource<FHIR_VERSION, "SearchParameter">;
  sortParam: ParsedParameter<string | number | undefined> | undefined;
  onChange: (
    v: ParsedParameter<string | number | undefined> | undefined,
  ) => void;
}
function SearchParameterSortControl({
  sortParam,
  searchParameter,
  onChange,
}: Readonly<SortIconProps>) {
  const value = sortParam?.value?.find((v): v is string | undefined => {
    return v === searchParameter.code || v === `-${searchParameter.code}`;
  });

  switch (true) {
    case value === searchParameter.code: {
      return (
        <ArrowUpIcon
          className={classNames(
            "cursor-pointer w-4 h-4 hover:text-blue-400 text-blue-400",
          )}
          onClick={() => {
            const values = [
              ...(sortParam?.value ?? []).filter(
                (v) => v !== searchParameter.code,
              ),
            ];
            if (values.length === 0) {
              onChange(undefined);
            } else {
              onChange({
                ...sortParam,
                name: "_sort",
                value: values,
              });
            }
          }}
        />
      );
    }
    case value?.startsWith("-"):
    default: {
      return (
        <ArrowDownIcon
          className={classNames("cursor-pointer w-4 h-4 hover:text-blue-400", {
            "text-blue-400": (sortParam?.value ?? []).includes(
              `-${searchParameter.code}`,
            ),
          })}
          onClick={() => {
            if (sortParam?.value.includes(`-${searchParameter.code}`)) {
              onChange({
                ...sortParam,
                name: "_sort",
                value: [
                  ...(sortParam?.value ?? []).filter(
                    (v) => v !== `-${searchParameter.code}`,
                  ),
                  `${searchParameter.code}`,
                ],
              });
            } else {
              onChange({
                ...sortParam,
                name: "_sort",
                value: [
                  ...(sortParam?.value ?? []).filter(
                    (v) => v !== `-${searchParameter.code}`,
                  ),
                  `-${searchParameter.code}`,
                ],
              });
            }
          }}
        />
      );
    }
  }
}

export function FHIRGenerativeSearchTable<Version extends FHIR_VERSION>(
  props: Readonly<FHIRGenerativeSearchTableProps<Version>>,
) {
  const pagination = 20;
  const [loading, setLoading] = useState<boolean>(true);
  const [parameters, setParameters] = useState<
    ParsedParameter<string | number | undefined>[]
  >([
    { name: "_total", value: ["estimate"] },
    { name: "_count", value: [pagination] },
    { name: "_sort", value: ["-_lastUpdated"] },
  ]);
  const [searchParameters, setSearchParameters] =
    useState<Resource<Version, "SearchParameter">[]>();
  const [selectedSearchParameter, setSelectedSearchParameter] =
    useState<number>(0);
  const [data, setData] = useState<{
    total?: number;
    resources: Resource<Version, ResourceType<Version>>[];
  }>({ total: 0, resources: [] });

  const sortParam = parameters.find((p) => p.name === "_sort");

  useEffect(() => {
    setLoading(true);
    props.client
      .search_type(
        {},
        props.fhirVersion,
        props.resourceType,
        parameters.map((p) => ({
          ...p,
          name: p.name,
          value: p.value.filter((v): v is string | number => v !== undefined),
        })),
      )
      .then((bundle) => {
        setData(bundle);
        setLoading(false);
      });
  }, [parameters, props.resourceType, props.fhirVersion, setLoading]);

  useEffect(() => {
    props.client
      .search_type({}, props.fhirVersion, "SearchParameter", [
        { name: "base", value: ["Resource", props.resourceType as string] },
        { name: "_count", value: ["100"] },
      ])
      .then((params) =>
        setSearchParameters(
          params.resources.filter(
            (s) =>
              s.expression && s.type !== "composite" && s.type !== "special",
          ),
        ),
      );
  }, [props.resourceType, props.fhirVersion]);

  return (
    <Modal
      ModalContent={(setOpen) => (
        <SearchColumnModal
          parameters={parameters}
          onChange={(params) => {
            setParameters(params);
            setOpen(false);
          }}
          searchParameter={(searchParameters ?? [])[selectedSearchParameter]}
          fhirVersion={props.fhirVersion}
          client={props.client}
        />
      )}
    >
      {(openParamModal) => (
        <>
          <div className="flex items-center w-full overflow-x-auto">
            <div className="flex flex-1  space-x-1 mr-1">
              {parameters
                .filter((p) => searchParameters?.find((s) => s.code === p.name))
                .map((p) => {
                  const paramIndex = searchParameters?.findIndex(
                    (sp) => sp.code === p.name,
                  );
                  return (
                    <Tag
                      color={searchParameterTypeToColor(
                        searchParameters?.[paramIndex ?? 0]?.type,
                      )}
                      onClick={() => {
                        setSelectedSearchParameter(paramIndex ?? 0);
                        openParamModal(true);
                      }}
                      className="cursor-pointer"
                    >
                      {p.name}
                      {p.modifier ? `:${p.modifier} ` : " "} ={" "}
                      {p.value.join(", ")}
                    </Tag>
                  );
                })}
            </div>
            <div className="flex items-center">
              {sortParam && (
                <Tag className="pointer" color={"blue"}>
                  _sort: {sortParam.value.join(",")}
                </Tag>
              )}
            </div>
          </div>
          <Table
            isLoading={loading}
            data={data.resources}
            onRowClick={props.onRowClick}
            columns={[
              ...(searchParameters ?? []).map(
                (searchParameter, i) =>
                  ({
                    id: searchParameter.id,
                    content: (
                      <div className="space-x-2 flex items-center">
                        <div
                          className="flex flex-1"
                          onClick={() => {
                            setSelectedSearchParameter(i);
                            openParamModal(true);
                          }}
                        >
                          <div className="mr-2">{searchParameter.code}</div>
                          <FunnelIcon className="hover:text-blue-400 cursor-pointer w-4 h-4" />
                        </div>
                        <div className="flex justify-end">
                          <SearchParameterSortControl
                            sortParam={sortParam}
                            searchParameter={searchParameter}
                            onChange={(v) => {
                              setParameters([
                                ...parameters.filter((p) => p.name !== "_sort"),
                                ...(v ? [v] : []),
                              ]);
                            }}
                          />
                        </div>
                      </div>
                    ),
                    selector: searchParameter.expression as string,
                    selectorType: "fhirpath",
                    renderer(data: unknown[]) {
                      return DataDisplay(searchParameter.type, data);
                    },
                  }) as Parameters<typeof Table>[0]["columns"][number],
              ),
              ...(props.columns ?? []),
            ]}
          />
          <div className="mt-2 flex justify-end">
            <Pagination
              currentPage={
                Math.floor(
                  parseInt(
                    (
                      parameters.find((p) => p.name === "_offset")?.value[0] ??
                      0
                    ).toString(),
                  ) / pagination,
                ) + 1
              }
              totalPages={Math.ceil((data.total ?? 0) / pagination)}
              onPagination={(pageNumber) => {
                setParameters([
                  ...parameters.filter((p) => p.name !== "_offset"),
                  {
                    name: "_offset",
                    value: [(pageNumber - 1) * pagination],
                  },
                ]);
              }}
            />
          </div>
        </>
      )}
    </Modal>
  );
}
