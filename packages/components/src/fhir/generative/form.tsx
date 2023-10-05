import React from "react";
import {
  StructureDefinition,
  Resource,
  ElementDefinition,
} from "@iguhealth/fhir-types/r4/types";
import * as Primitives from "../primitives";

const EditTypeToComponent: Record<string, React.FC<any>> = {
  "http://hl7.org/fhirpath/System.String": Primitives.String,
  string: Primitives.String,
  boolean: Primitives.Boolean,
  url: Primitives.Url,
  date: Primitives.Date,
  dateTime: Primitives.DateTime,
  uri: Primitives.Uri,
  code: Primitives.Code,
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

function getFieldName(path: string) {
  return path.substring(path.lastIndexOf(".") + 1);
}

interface MetaProps {
  sd: StructureDefinition;
  elementIndex: number;
  value: unknown;
  pointer: string;
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

function MetaValueArray({
  sd,
  elementIndex,
  value = [undefined],
  pointer,
}: MetaProps) {
  const element = getElementDefinition(sd, elementIndex);
  if (element.type?.length && element.type.length < 1) {
    return <span>TYPE CHOICES NOT SUPPORTED YET</span>;
  }
  if (!Array.isArray(value))
    throw new Error("Value must be an array or undefined");

  return value.map((v, i) => {
    return (
      <MetaValueSingular
        key={i}
        sd={sd}
        elementIndex={elementIndex}
        pointer={`${pointer}/${i}`}
        value={v}
      />
    );
  });
}

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

function MetaValueSingular({ sd, elementIndex, value, pointer }: MetaProps) {
  const element = getElementDefinition(sd, elementIndex);
  if (element.type?.length && element.type?.length < 1) {
    return (
      <div>
        <span>{element.path}</span>
        TYPE CHOICES NOT SUPPORTED YET{" "}
        {JSON.stringify(element.type?.map((t) => t.code))}
      </div>
    );
  }
  const children = getChildrenElementIndices({ sd, elementIndex });
  if (children.length === 0) {
    const Comp = element.type && EditTypeToComponent[element.type[0].code];
    return (
      <div className="">
        {Comp ? (
          <Comp value={value} label={getFieldName(element.path)} />
        ) : (
          <div>
            <span className="font-semibold"> {element.path}</span>
            <span>
              {element.type && element.type[0].code}: {JSON.stringify(value)}
            </span>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="">
      <div className="font-semibold">{element.path}</div>
      <div className="p-2 border">
        {children.map((childIndex) => {
          const childElement = getElementDefinition(sd, childIndex);
          const childProps = getValueAndPointer(childElement, pointer, value);
          return childElement.max === "1" ? (
            <MetaValueSingular
              key={childIndex}
              sd={sd}
              elementIndex={childIndex}
              {...childProps}
            />
          ) : (
            <MetaValueArray
              key={childIndex}
              sd={sd}
              elementIndex={childIndex}
              {...childProps}
            />
          );
        })}
      </div>
    </div>
  );
}

export interface GenerativeFormProps {
  structureDefinition: StructureDefinition;
  value: Resource;
  onChange?: (resource: Resource) => void;
}

export const GenerativeForm = ({
  structureDefinition,
  value,
  onChange = (_r) => {},
}: GenerativeFormProps) => {
  const pointer = "/";
  return (
    <OnChange.Provider value={onChange}>
      <MetaValueSingular
        sd={structureDefinition}
        elementIndex={0}
        value={value}
        pointer={"/"}
      />
    </OnChange.Provider>
  );
};
