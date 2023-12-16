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
  ElementDefinitionType,
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
  Annotation,
  Quantity,
  Reference,
} from "@iguhealth/fhir-types/r4/types";
import { descend, ascend, Loc, pointer, root } from "@iguhealth/fhir-pointer";
import generateJSONPatches, { Mutation } from "@iguhealth/fhir-patch-building";

import { ClientProps } from "../types";
import * as ComplexTypes from "../complex";
import * as Primitives from "../primitives";
import { Select } from "../../base";

function EditorComponent({
  element,
  value,
  onChange,
  showLabel,
  pointer,
  client,
}: {
  element: ElementDefinition;
  value: unknown;
  onChange: (patches: Mutation<any, any>) => void;
  showLabel: boolean;
  pointer: Loc<any, any, any>;
} & ClientProps) {
  const label = showLabel ? capitalize(getFieldName(element.path)) : undefined;
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
            label={label}
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
          label={label}
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
          label={label}
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
          label={label}
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
          label={label}
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
          label={label}
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
          label={label}
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
          client={client}
          value={value as code}
          label={label}
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
          label={label}
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
          label={label}
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
          label={label}
          onChange={(v: Address | undefined) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "Annotation":
      return (
        <ComplexTypes.FHIRAnnotationEditable
          value={value as Annotation}
          label={label}
          onChange={(v: Annotation | undefined) => {
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
          client={client}
          value={value as Identifier}
          label={label}
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
      return (
        <div className="px-2">
          <ComplexTypes.FHIRMetaReadOnly value={value as Meta} />
        </div>
      );
    case "ContactPoint":
      return (
        <ComplexTypes.FHIRContactPointEditable
          client={client}
          value={value as ContactPoint}
          label={label}
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
          label={label}
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
          client={client}
          label={label}
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
          label={label}
          onChange={(v) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "Quantity":
      return (
        <ComplexTypes.FHIRSimpleQuantityEditable
          value={value as Quantity}
          label={label}
          onChange={(v) => {
            onChange({
              op: "replace",
              path: pointer,
              value: v,
            });
          }}
        />
      );
    case "Reference":
      return (
        <ComplexTypes.FHIRReferenceEditable
          client={client}
          resourceTypesAllowed={element.type?.[0]?.targetProfile?.map((tp) => {
            const parts = tp.split("/");
            return parts[parts.length - 1] as ResourceType;
          })}
          value={value as Reference}
          label={label}
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

function isLeaf(type: string | undefined): boolean {
  if (!type) return false;
  return (
    primitiveTypes.has(type) ||
    complexTypes.has(type) ||
    // Specialized primitive for .id and other strings that don't allow extensions.
    type === "http://hl7.org/fhirpath/System.String"
  );
}

function TypeChoiceTypeSelect({
  onChange,
  element,
  type,
}: {
  element: ElementDefinition;
  onChange: (type: ElementDefinitionType) => void;
  type: ElementDefinitionType | undefined;
}) {
  if (!element.type || element.type?.length <= 1) return undefined;
  return (
    <div className="flex flex-1">
      <Select
        value={type?.code}
        onChange={(option) => {
          const newType = element.type?.find((t) => t.code === option.value);
          if (newType) {
            onChange(newType);
          }
        }}
        options={(element.type || []).map((t) => ({
          value: t.code,
          label: t.code,
        }))}
      />
    </div>
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

  const childRegex = new RegExp(`^${element.path}\\.[^\\.]+$`);

  for (let i = elementIndex + 1; i < (sd.snapshot?.element.length || 0); i++) {
    if (
      sd.snapshot?.element[i]?.path &&
      childRegex.test(sd.snapshot?.element[i]?.path)
    ) {
      childIndices.push(i);
    }
  }

  return childIndices;
}

function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

function getFieldName(path: string) {
  return path.substring(path.lastIndexOf(".") + 1).replace("[x]", "");
}

type MetaProps<T, R> = {
  sd: StructureDefinition;
  elementIndex: number;
  value: unknown;
  pointer: Loc<T, R, any>;
  showLabel?: boolean;
  showInvalid?: boolean;
  onChange: (patches: Mutation<T, R>) => void;
  type: ElementDefinitionType | undefined;
} & ClientProps;

function getElementDefinition(
  sd: StructureDefinition,
  elementIndex: number
): ElementDefinition {
  const element = sd.snapshot?.element?.[elementIndex];
  if (!element)
    throw new Error(`SD did not have element at index ${elementIndex}`);
  return element;
}

function isTypeChoice(element: ElementDefinition): boolean {
  return (element.type || []).length > 1;
}

function isIndexableObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function findTypeChoiceTypeBasedOnField(
  element: ElementDefinition,
  value: Record<string, unknown>
): ElementDefinitionType {
  if (!element.type?.[0]) throw new Error("No Type found.");

  if (!isTypeChoice(element)) return element.type?.[0];
  const fieldName = getFieldName(element.path);
  for (const type of element.type || []) {
    const typeChoiceFieldName = `${fieldName}${capitalize(type.code)}`;
    if (value[typeChoiceFieldName] !== undefined) return type;
  }
  return element.type?.[0];
}

function getTypedFieldName(
  element: ElementDefinition,
  type: ElementDefinitionType
) {
  const fieldName = getFieldName(element.path);
  if (!isTypeChoice(element)) return fieldName;
  return `${fieldName}${capitalize(type.code)}`;
}

function getValueAndPointer(
  element: ElementDefinition,
  pointer: Loc<any, any, any>,
  value: unknown
): {
  value: unknown;
  pointer: Loc<any, any, any>;
  type: ElementDefinitionType;
} {
  if (Array.isArray(value))
    throw new Error("invalid value must be object to descend");

  const type = findTypeChoiceTypeBasedOnField(
    element,
    value as Record<string, unknown>
  );

  const field = getTypedFieldName(element, type);

  return {
    value: isIndexableObject(value) ? value[field] : undefined,
    pointer: descend(pointer, field),
    type: type,
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

function LabelWrapper({
  sd,
  elementIndex,
  type,
  onChange,
  children,
  pointer,
  showLabel = true,
}: MetaProps<any, any> & { children: React.ReactNode }) {
  const element = getElementDefinition(sd, elementIndex);
  return (
    <div>
      {showLabel && (
        <div className="">{capitalize(getFieldName(element.path))}</div>
      )}
      {(element.type || []).length > 1 && (
        <TypeChoiceTypeSelect
          element={element}
          type={type}
          onChange={(selectedType) => {
            if (selectedType.code !== type?.code) {
              onChange({
                op: "replace",
                path: pointer,
                value: undefined,
              });
              const fieldName = getTypedFieldName(element, selectedType);
              const newPointer = descend(
                ascend(pointer)?.parent as Loc<any, any, any>,
                fieldName
              );
              onChange({
                op: "replace",
                path: newPointer,
                value: {},
              });
            }
          }}
        />
      )}

      {children}
    </div>
  );
}

const MetaValueSingular = React.memo((props: MetaProps<any, any>) => {
  const {
    sd,
    elementIndex,
    value,
    pointer,
    showLabel = true,
    showInvalid = false,
    client,
    onChange,
  } = props;

  const element = getElementDefinition(sd, elementIndex);

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
      <div className="mt-2">
        <LabelWrapper {...props}>
          <EditorComponent
            element={element}
            pointer={pointer}
            client={client}
            value={value}
            showLabel={false}
            onChange={onChange}
          />
        </LabelWrapper>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <LabelWrapper {...props}>
        <div className="px-2 border space-y-2">
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
            const {
              value: childValue,
              pointer: childPointer,
              type,
            } = getValueAndPointer(childElement, pointer, value);

            return childElement.max === "1" ? (
              <MetaValueSingular
                client={client}
                type={type}
                key={childPointer}
                sd={sd}
                elementIndex={childIndex}
                onChange={onChange}
                showInvalid={showInvalid}
                pointer={childPointer}
                value={childValue}
              />
            ) : (
              <MetaValueArray
                client={client}
                type={type}
                key={childPointer}
                sd={sd}
                elementIndex={childIndex}
                showInvalid={showInvalid}
                onChange={onChange}
                pointer={childPointer}
                value={childValue}
              />
            );
          })}
        </div>
      </LabelWrapper>
    </div>
  );
});

const MetaValueArray = React.memo((props: MetaProps<any, any>) => {
  const {
    sd,
    elementIndex,
    value = [],
    pointer,
    onChange,
    client,
    showInvalid = false,
    type,
  } = props;
  const element = getElementDefinition(sd, elementIndex);
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
      <label>{capitalize(getFieldName(element.path))}</label>
      {value.map((v, i) => (
        <div
          className={classNames("mt-1 relative", {
            "bg-gray-50": i % 2 === 1,
            "bg-white": i % 2 === 0,
          })}
          key={`${descend(pointer, i)}`}
        >
          <MetaValueSingular
            client={client}
            type={type}
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

export type Setter = (resource: Resource) => Resource;

export type FHIRGenerativeFormProps = {
  structureDefinition: StructureDefinition;
  value: Resource | undefined;
  setValue?: (s: Setter) => void;
} & ClientProps;

export const FHIRGenerativeForm = ({
  structureDefinition,
  value,
  client,
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
      client={client}
      sd={structureDefinition}
      elementIndex={0}
      value={value}
      type={structureDefinition.snapshot?.element?.[0]?.type?.[0]}
      pointer={pointer(
        structureDefinition.type as ResourceType,
        value?.id || "new"
      )}
      onChange={onChange}
      showLabel={false}
      showInvalid={true}
    />
  );
};
