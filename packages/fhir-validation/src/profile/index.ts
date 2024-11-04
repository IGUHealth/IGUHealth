/* eslint-disable @typescript-eslint/no-explicit-any */

import { Loc, toJSONPointer, typedPointer } from "@iguhealth/fhir-pointer";
import {
  canonical,
  ElementDefinition,
  OperationOutcome,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import * as fp from "@iguhealth/fhirpath";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";
import { IMetaValue } from "@iguhealth/meta-value/interface";

import { ValidationCTX } from "../types.js";
import {
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { conformsToPattern } from "./validators.js";

async function compress(value: string, encoding: CompressionFormat) {
  const byteArray = new TextEncoder().encode(value);
  const cs = new CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  const decoder = new TextDecoder();
  const buf = await new Response(cs.readable).arrayBuffer();

  return decoder.decode(buf);
}

type Discriminator = NonNullable<
  NonNullable<ElementDefinition["slicing"]>["discriminator"]
>[number];

function convertPathToElementPointer(discriminator: Discriminator) {
  if (
    discriminator.path.includes("ofType(") ||
    discriminator.path.includes("resolve()") ||
    discriminator.path.includes("extension(")
  ) {
    throw new OperationError(
      outcomeFatal(
        "not-supported",
        `Discriminator path '${discriminator.path}' is not supported`,
      ),
    );
  }

  return discriminator.path.replace("$this", "");
}

/**
 * Removes the type from the path.
 * @param path The ElementDefinition path to remove the type from.
 */
function removeTypeOnPath(path: string) {
  path.substring(path.indexOf(".") + 1);
}

function findDiscriminatorValue(
  sliceElement: ElementDefinition,
  discriminator: Discriminator,
) {
  if (!sliceElement.sliceName) {
    throw new OperationError(
      outcomeFatal("not-supported", `Slice element does not have a slice name`),
    );
  }
  const path = convertPathToElementPointer(discriminator);
}

/**
 * Methods of discriminator for slices pulled from <https://build.fhir.org/profiling.html#discriminator>
 * value:	The slices have different values in the nominated element, as determined by the applicable fixed value, pattern, or required ValueSet binding.
 * exists:	The slices are differentiated by the presence or absence of the nominated element. There SHALL be no more than two slices. The slices are differentiated by the fact that one must have a max of 0 and the other must have a min of 1 (or more). The order in which the slices are declared doesn't matter.
 * pattern:	The slices have different values in the nominated element, as determined by the applicable fixed value, pattern, or required ValueSet binding. This has the same meaning as 'value' and is deprecated.
 * type:	The slices are differentiated by type of the nominated element.
 * profile:	The slices are differentiated by conformance of the nominated element to a specified profile. Note that if the path specifies .resolve() then the profile is the target profile on the reference. In this case, validation by the possible profiles is required to differentiate the slices.
 * position:	The slices are differentiated by their index. This is only possible if all but the last slice have min=max cardinality, and the (optional) last slice contains other undifferentiated elements.
 * @param value The single value from the array to check if conformant to the slice.
 * @param elementDefinition The element definition of the slice.
 */
async function generateKeyHash<T>(
  elementDefinition: ElementDefinition,
  value: T,
): Promise<string> {
  const discrminators = elementDefinition.slicing?.discriminator || [];
  let key: string = "";

  for (const discriminator of discrminators) {
    switch (discriminator.type) {
      case "value": {
        const v = await fp.evaluate(discriminator.path, value);
        key = `${key}:${JSON.stringify(v)}`;
        break;
      }
      case "exists": {
        const v = await fp.evaluate(discriminator.path, value);
        key = `${key}:${v.length !== 0 ? "true" : "false"}`;
        break;
      }
      case "pattern":
      case "type":
      case "profile": {
        throw new Error("Not supported");
      }
    }
  }

  return compress(key, "deflate-raw");
}

/**
 * https://hl7.org/fhir/R4/profiling.html#discriminator
 * @param elementDefinition
 * @param values
 * @returns
 */
async function splitBySliceDiscrminator<T>(
  elementDefinition: ElementDefinition,
  values: T[],
): Promise<T[][]> {
  const slices: Record<string, T[]> = {};
  for (let i = 0; i < values.length; i++) {
    const key = await generateKeyHash(elementDefinition, values[i]);
    slices[key] = [...(slices[key] ?? []), values[i]];
  }

  return Object.values(slices);
}

function modifyValidationContextToCacheProfiles(
  ctx: ValidationCTX,
): ValidationCTX {
  const resolvedSds: Record<
    FHIR_VERSION,
    Record<canonical, StructureDefinition>
  > = { [R4]: {}, [R4B]: {} };

  return {
    ...ctx,
    resolveCanonical: async <
      FHIRVersion extends FHIR_VERSION,
      Type extends ResourceType<FHIRVersion>,
    >(
      fhirVersion: FHIRVersion,
      type: Type,
      url: canonical,
    ) => {
      if (type === "StructureDefinition") {
        const checkedSD = resolvedSds[fhirVersion][url];
        if (!checkedSD) {
          const external = ctx.resolveCanonical(fhirVersion, type, url);
          resolvedSds[fhirVersion] = {
            ...resolvedSds[fhirVersion],
            [url]: external,
          };
        }

        // return resolvedSds[fhirVersion][url];
      }
      return ctx.resolveCanonical(fhirVersion, type, url) as Promise<
        Resource<FHIRVersion, Type>
      >;
    },
  };
}

async function validateElement(
  ctx: ValidationCTX,
  sd: StructureDefinition,
  value: IMetaValue<unknown>,
  path: Loc<any, any, any>,
) {}

type IsTemplateKey<Pattern, T> = T extends Pattern ? T : never;

type TemplateKeys<Pattern, T> = IsTemplateKey<Pattern, keyof T>;

type TypesByTemplate<Pattern, T> = Pick<T, TemplateKeys<Pattern, T>>[keyof Pick<
  T,
  TemplateKeys<Pattern, T>
>];

type ElementDefinitionPatternTypes = TypesByTemplate<
  `pattern${string}`,
  ElementDefinition
>;

async function matchesPattern(
  elementDefinition: ElementDefinition,
  value: IMetaValue<unknown>,
) {
  const pattern = (await fp.evaluate("$this.pattern", elementDefinition))[0];

  // Could throw error here but that would require validating that the pattern field is empty aot.
  if (!pattern) return true;

  return conformsToPattern(pattern, value.getValue());
}

async function validateProfile(
  ctx: ValidationCTX,
  sd: StructureDefinition,
  value: IMetaValue<unknown>,
  path: Loc<any, any, any>,
): Promise<OperationOutcome["issue"]> {
  const index = 0;
  const element = sd.differential?.element[index];

  throw new Error("not implemented");
}

/**
 *
 * @param _ctx Validation CTX
 * @param profileURL Profile canonical to validate
 * @param value the value to check
 * @param path The current path of the value.
 */
export default async function (
  _ctx: ValidationCTX,
  profileURL: canonical,
  value: IMetaValue<unknown>,
  path: Loc<any, any, any> = typedPointer<any, any>(),
): Promise<OperationOutcome> {
  const ctx = modifyValidationContextToCacheProfiles(_ctx);
  const profile = await ctx.resolveCanonical(
    ctx.fhirVersion,
    "StructureDefinition",
    profileURL,
  );

  if (!profile) {
    throw new OperationError(
      outcomeFatal(
        "not-found",
        `Unable to resolve canonical for profile '${profileURL}'`,
        [toJSONPointer(path)],
      ),
    );
  }

  throw new Error("not implemented");
}
