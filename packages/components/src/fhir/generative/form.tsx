/* eslint @typescript-eslint/no-explicit-any: 0 */
import React, { useMemo } from "react";
import classNames from "classnames";
import { applyPatch } from "fast-json-patch";
import { produce } from "immer";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

import {
  resourceTypes,
  complexTypes,
  primitiveTypes,
} from "@iguhealth/fhir-types/r4/sets";
import {
  ResourceType,
  Address,
  StructureDefinition,
  Resource,
  ElementDefinition,
  url,
  date,
  dateTime,
  uri,
  code,
  decimal,
  integer,
  Identifier,
  Meta,
  ContactPoint,
  ContactDetail,
  HumanName,
  Period,
} from "@iguhealth/fhir-types/r4/types";
import { descend, ascend, Loc, pointer, root } from "@iguhealth/fhir-pointer";
import generateJSONPatches, { Mutation } from "@iguhealth/fhir-patch-building";

import { TerminologyLookupProps } from "../types";
import * as ComplexTypes from "../complex";
import * as Primitives from "../primitives";

function EditorComponent({
  element,
  value,
  onChange,
  showLabel,
  pointer,
  expand,
}: {
  element: ElementDefinition;
  value: unknown;
  onChange: (patches: Mutation<any, any>) => void;
  showLabel: boolean;
  pointer: Loc<any, any, any>;
} & TerminologyLookupProps) {
  switch (element.type?.[0].code) {
    case "http://hl7.org/fhirpath/System.String": {
      // Only render the root element not the ones underneath.
      // id is special primitive string.
      const asc = ascend(pointer);
      if (asc?.field === "id" && asc?.parent === root(pointer))
        return (
          <Primitives.FHIRStringEditable
            disabled={true}
            value={value as string}
            label={showLabel ? getFieldName(element.path) : undefined}
            onChange={(v: unknown) => {
              onChange({
                op: "replace",
                path: pointer,
                value: v,
              });
            }}
          />
        );
      return undefined;
    }
    case "string": {
      return (
        <Primitives.FHIRStringEditable
          value={value as string}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    }

    case "boolean":
      return (
        <Primitives.FHIRBooleanEditable
          value={value as boolean}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "url":
      return (
        <Primitives.FHIRUrlEditable
          value={value as url}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );

    case "date":
      return (
        <Primitives.FHIRDateEditable
          value={value as date}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "dateTime":
      return (
        <Primitives.FHIRDateTimeEditable
          value={value as dateTime}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "uri":
      return (
        <Primitives.FHIRUriEditable
          value={value as uri}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "code":
      return (
        <Primitives.FHIRCodeEditable
          expand={expand}
          value={value as code}
          label={showLabel ? getFieldName(element.path) : undefined}
          open={true}
          system={element.binding?.valueSet}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "decimal":
      return (
        <Primitives.FHIRDecimalEditable
          value={value as decimal}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "integer":
      return (
        <Primitives.FHIRIntegerEditable
          value={value as integer}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "Address":
      return (
        <ComplexTypes.FHIRAddressEditable
          value={value as Address}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "Identifier":
      return (
        <ComplexTypes.FHIRIdentifierEditable
          value={value as Identifier}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "Meta":
      return <ComplexTypes.FHIRMetaReadOnly value={value as Meta} />;
    case "ContactPoint":
      return (
        <ComplexTypes.FHIRContactPointEditable
          value={value as ContactPoint}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "HumanName":
      return (
        <ComplexTypes.FHIRHumanNameEditable
          value={value as HumanName}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v: unknown) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "ContactDetail":
      return (
        <ComplexTypes.FHIRContactDetailEditable
          value={value as ContactDetail}
          expand={expand}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "Period":
      return (
        <ComplexTypes.FHIRPeriodEditable
          value={value as Period}
          label={showLabel ? getFieldName(element.path) : undefined}
          onChange={(v) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    default:
      return undefined;
  }
}

function isLeaf(type: string | undefined) {
  return (
    type &&
    (primitiveTypes.has(type) ||
      complexTypes.has(type) ||
      type === "http://hl7.org/fhirpath/System.String")
  );
}

/*
 ** Given a position return all children indices.
 */
function getChildrenElementIndices({
  sd,
  elementIndex,
}: {
  sd: StructureDefinition;
  elementIndex: number;
}): number[] {
  const childIndices: number[] = [];
  const element = sd.snapshot?.element[elementIndex];
  if (!element?.path) throw new Error("Invalid element when deriving children");

  let childIndex = elementIndex + 1;

  const childRegex = new RegExp(`^${element.path}\\.[^\\.]+$`);

  while (
    sd.snapshot?.element[childIndex]?.path &&
    childRegex.test(sd.snapshot?.element[childIndex]?.path)
  ) {
    childIndices.push(childIndex);
    childIndex++;
  }

  return childIndices;
}

function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

function getFieldName(path: string) {
  return capitalize(path.substring(path.lastIndexOf(".") + 1));
}

type MetaProps<T, R> = {
  sd: StructureDefinition;
  elementIndex: number;
  value: unknown;
  pointer: Loc<T, R, any>;
  showLabel?: boolean;
  showInvalid?: boolean;
  onChange: (patches: Mutation<T, R>) => void;
} & TerminologyLookupProps;

function getElementDefinition(
  sd: StructureDefinition,
  elementIndex: number
): ElementDefinition {
  const element = sd.snapshot?.element?.[elementIndex];
  if (!element)
    throw new Error(`SD did not have element at index ${elementIndex}`);
  return element;
}

const MetaValueArray = React.memo((props: MetaProps<any, any>) => {
  const {
    sd,
    elementIndex,
    value = [],
    pointer,
    onChange,
    expand,
    showInvalid = false,
  } = props;
  const element = getElementDefinition(sd, elementIndex);
  if (showInvalid && element.type?.length && element.type.length < 1) {
    return <span>TYPE CHOICES NOT SUPPORTED YET</span>;
  }
  if (!Array.isArray(value)) {
    throw new Error("Value must be an array or undefined");
  }

  const children = getChildrenElementIndices({ sd, elementIndex });

  if (!isLeaf(element.type?.[0].code) && children.length === 0) {
    return (
      <DisplayInvalid
        element={element}
        value={value}
        showInvalid={showInvalid}
      />
    );
  }
  return (
    <div>
      <label>{getFieldName(element.path)}</label>
      {value.map((v, i) => (
        <div
          className={classNames("mt-1 relative", {
            "bg-gray-50": i % 2 === 1,
            "bg-white": i % 2 === 0,
          })}
          key={`${descend(pointer, i)}`}
        >
          <MetaValueSingular
            expand={expand}
            sd={sd}
            elementIndex={elementIndex}
            pointer={descend(pointer, i)}
            value={v}
            showLabel={false}
            showInvalid={showInvalid}
            onChange={onChange}
          />
          {value.length > 0 && (
            <div
              className="absolute top-1 right-1 text-slate-400 cursor-pointer hover:text-slate-500 "
              onClick={() => {
                onChange({
                  path: descend(pointer, i),
                  op: "remove",
                  value: v,
                });
              }}
            >
              <XMarkIcon className="h-4 w-4" />
            </div>
          )}
        </div>
      ))}
      <div className="ml-1 mt-1">
        <span
          className="flex items-center  text-slate-400 cursor-pointer hover:text-slate-500"
          onClick={() => {
            onChange({
              path: descend(pointer, value.length),
              op: "add",
              value: complexTypes.has(element.type?.[0].code || "") ? {} : null,
            });
          }}
        >
          <PlusIcon className=" h-4 w-4" /> Add
        </span>
      </div>
    </div>
  );
});

function isIndexableObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getValueAndPointer(
  elementDefinition: ElementDefinition,
  pointer: Loc<any, any, any>,
  value: unknown
): { value: unknown; pointer: Loc<any, any, any> } {
  const field = elementDefinition.path.substring(
    elementDefinition.path.lastIndexOf(".") + 1
  );
  if (Array.isArray(value))
    throw new Error("invalid value must be object to descend");

  return {
    value: isIndexableObject(value) ? value[field] : undefined,
    pointer: descend(pointer, field),
  };
}

function DisplayInvalid({
  element,
  value,
  showInvalid,
}: {
  showInvalid: boolean;
  element: ElementDefinition;
  value: unknown;
}) {
  if (showInvalid)
    return (
      <div>
        <span className="font-semibold"> {element.path}</span>
        <span>
          {element.type && element.type[0].code}: {JSON.stringify(value)}
        </span>
      </div>
    );
  return undefined;
}

const MetaValueSingular = React.memo((props: MetaProps<any, any>) => {
  const {
    sd,
    elementIndex,
    value,
    pointer,
    showLabel = true,
    showInvalid = false,
    expand,
    onChange,
  } = props;

  const element = getElementDefinition(sd, elementIndex);

  if (element.type?.length && element.type?.length > 1) {
    return showInvalid ? (
      <div>
        <span>{element.path}</span>
        TYPE CHOICES NOT SUPPORTED YET{" "}
        {JSON.stringify(element.type?.map((t) => t.code))}
      </div>
    ) : undefined;
  }
  const children = getChildrenElementIndices({ sd, elementIndex });
  if (children.length === 0) {
    if (!isLeaf(element.type?.[0].code)) {
      return (
        <DisplayInvalid
          element={element}
          value={value}
          showInvalid={showInvalid}
        />
      );
    }
    return (
      <div className="">
        <EditorComponent
          element={element}
          pointer={pointer}
          expand={expand}
          value={value}
          showLabel={showLabel}
          onChange={onChange}
        />
      </div>
    );
  }
  return (
    <div className="">
      {showLabel && <div className="">{getFieldName(element.path)}</div>}
      <div className="p-2 border space-y-2">
        {children.map((childIndex) => {
          const childElement = getElementDefinition(sd, childIndex);
          // Skipping extensions and nested resources for now
          if (
            childElement.type?.find(
              (t) => t.code === "Extension" || resourceTypes.has(t.code)
            )
          ) {
            return;
          }
          const childProps = getValueAndPointer(childElement, pointer, value);
          return childElement.max === "1" ? (
            <MetaValueSingular
              expand={expand}
              key={childProps.pointer}
              sd={sd}
              elementIndex={childIndex}
              onChange={onChange}
              showInvalid={showInvalid}
              {...childProps}
            />
          ) : (
            <MetaValueArray
              expand={expand}
              key={childProps.pointer}
              sd={sd}
              elementIndex={childIndex}
              showInvalid={showInvalid}
              onChange={onChange}
              {...childProps}
            />
          );
        })}
      </div>
    </div>
  );
});

export type Setter = (resource: Resource) => Resource;

export type FHIRGenerativeFormProps = {
  structureDefinition: StructureDefinition;
  value: Resource | undefined;
  setValue?: (s: Setter) => void;
} & TerminologyLookupProps;

export const FHIRGenerativeForm = ({
  structureDefinition,
  value,
  expand,
  setValue = () => {},
}: FHIRGenerativeFormProps) => {
  const onChange = useMemo(() => {
    return (mutation: Mutation<any, any>) => {
      setValue((resource) => {
        const patches = generateJSONPatches(resource, mutation);
        const newResource = produce(resource, (value) => {
          const newValue = applyPatch(value, patches).newDocument;
          return newValue;
        });
        return newResource;
      });
    };
  }, [setValue]);

  return (
    <MetaValueSingular
      expand={expand}
      sd={structureDefinition}
      elementIndex={0}
      value={value}
      pointer={pointer(
        structureDefinition.type as ResourceType,
        value?.id || "new"
      )}
      onChange={onChange}
      showLabel={false}
      showInvalid={false}
    />
  );
};
