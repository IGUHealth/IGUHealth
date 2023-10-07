import React, { useEffect, useRef, useMemo } from "react";
import { applyPatch, Operation } from "fast-json-patch";
import { produce } from "immer";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { resourceTypes, complexTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  StructureDefinition,
  Resource,
  ElementDefinition,
} from "@iguhealth/fhir-types/r4/types";

import * as ComplexTypes from "../complex";
import * as Primitives from "../primitives";

import generateJSONPatches, { Mutation } from "./generatePatches";

const EditTypeToComponent: Record<string, React.FC<any>> = {
  "http://hl7.org/fhirpath/System.String": (props: any) => (
    <Primitives.String disabled={true} {...props} />
  ),
  string: Primitives.String,
  boolean: Primitives.Boolean,
  url: Primitives.Url,
  date: Primitives.Date,
  dateTime: Primitives.DateTime,
  uri: Primitives.Uri,
  code: Primitives.Code,
  Address: ComplexTypes.AddressEditable,
  Identifier: ComplexTypes.IdentifierEditable,
  Meta: ComplexTypes.MetaReadOnly,
  ContactPoint: ComplexTypes.ContactPointEditable,
  HumanName: ComplexTypes.HumanNameEditable,
};

const OnChange = React.createContext<(r: Resource) => void>((_r) => {});

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

interface MetaProps {
  sd: StructureDefinition;
  elementIndex: number;
  value: unknown;
  pointer: string;
  showLabel?: boolean;
  showInvalid?: boolean;
  onChange: (patches: Mutation) => void;
}

function getElementDefinition(
  sd: StructureDefinition,
  elementIndex: number
): ElementDefinition {
  const element = sd.snapshot?.element?.[elementIndex];
  if (!element)
    throw new Error(`SD did not have element at index ${elementIndex}`);
  return element;
}

const MetaValueArray = React.memo((props: MetaProps) => {
  const {
    sd,
    elementIndex,
    value = [],
    pointer,
    onChange,
    showInvalid = false,
  } = props;
  const element = getElementDefinition(sd, elementIndex);
  if (showInvalid && element.type?.length && element.type.length < 1) {
    return <span>TYPE CHOICES NOT SUPPORTED YET</span>;
  }
  if (!Array.isArray(value))
    throw new Error("Value must be an array or undefined");

  const Comp = element.type && EditTypeToComponent[element.type[0].code];
  if (!Comp) {
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
      {(value.length === 0 ? [undefined] : value).map((v, i) => (
        <div className="mt-1 relative" key={`${pointer}/${i}`}>
          <MetaValueSingular
            sd={sd}
            elementIndex={elementIndex}
            pointer={`${pointer}/${i}`}
            value={v}
            showLabel={false}
            showInvalid={showInvalid}
            onChange={onChange}
          />
          {value.length > 0 && (
            <div
              className="absolute top-1 right-1 text-slate-400 cursor-pointer hover:text-slate-500 "
              onClick={(e) => {
                onChange({
                  path: `${pointer}/${i}`,
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
          onClick={(_e) => {
            onChange({
              path: `${pointer}/${value.length}`,
              op: "add",
              value: null,
            });
            if (value.length === 0) {
              onChange({
                path: `${pointer}/${value.length + 1}`,
                op: "add",
                value: null,
              });
            }
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
  pointer: string,
  value: unknown
): { value: unknown; pointer: string } {
  const field = elementDefinition.path.substring(
    elementDefinition.path.lastIndexOf(".") + 1
  );
  if (Array.isArray(value))
    throw new Error("invalid value must be object to descend");

  return {
    value: isIndexableObject(value) ? value[field] : value,
    pointer: `${pointer}/${field}`,
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

const MetaValueSingular = React.memo((props: MetaProps) => {
  const {
    sd,
    elementIndex,
    value,
    pointer,
    showLabel = true,
    showInvalid = false,
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
    const Comp = element.type && EditTypeToComponent[element.type[0].code];
    if (!Comp) {
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
        <Comp
          value={value}
          label={showLabel && getFieldName(element.path)}
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
              key={childProps.pointer}
              sd={sd}
              elementIndex={childIndex}
              onChange={onChange}
              showInvalid={showInvalid}
              {...childProps}
            />
          ) : (
            <MetaValueArray
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

export interface GenerativeFormProps {
  structureDefinition: StructureDefinition;
  value: Resource | undefined;
  setValue?: (s: Setter) => void;
}

export const GenerativeForm = ({
  structureDefinition,
  value,
  setValue = (_r) => {},
}: GenerativeFormProps) => {
  const pointer = "/";
  const onChange = useMemo(() => {
    return (mutation: Mutation) => {
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
      sd={structureDefinition}
      elementIndex={0}
      value={value}
      pointer={""}
      onChange={onChange}
      showLabel={false}
      showInvalid={false}
    />
  );
};
