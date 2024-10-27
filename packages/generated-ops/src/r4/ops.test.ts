import { expect, test } from "@jest/globals";
import path from "node:path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import {
  ValueSet,
  canonical,
  uri,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  R4,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/lib/versions";
import { Invocation } from "@iguhealth/operation-execution";
import { OpCTX } from "@iguhealth/operation-execution";

import { ValueSetExpand } from "./ops.js";

const sds = loadArtifacts({
  fhirVersion: R4,
  loadDevelopmentPackages: true,
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), "../../"),
});

test("Test ValueSet Expands", async () => {
  const ctx: OpCTX = {
    async resolveCanonical<
      FHIRVersion extends FHIR_VERSION,
      Type extends ResourceType<FHIRVersion>,
    >(
      fhirVersion: FHIRVersion,
      type: Type,
      url: canonical,
    ): Promise<Resource<FHIRVersion, Type> | undefined> {
      const sd = sds.find((sd) => sd.url === url);
      if (!sd) throw new Error(`Could not resolve type ${type}`);
      return sd as Resource<FHIRVersion, Type>;
    },
    async resolveTypeToCanonical(
      version: FHIR_VERSION,
      type: uri,
    ): Promise<canonical> {
      const sd = sds.find((sd) => sd.type === type);
      if (!sd) throw new Error(`Could not resolve type ${type}`);
      return sd.url as canonical;
    },
    level: "instance",
    fhirVersion: R4,
  };

  const valueSet: ValueSet = {
    resourceType: "ValueSet",
    status: "final",
  } as ValueSet;
  const output = valueSet;

  const invoke: Invocation = async (op, ctx, input) => {
    const inputIssues = await op.validate(ctx, "in", input);
    if (inputIssues.length > 0) throw new Error("Input is invalid");

    const outputIssues = await op.validate(ctx, "out", output);
    if (outputIssues.length > 0) throw new Error("Output is invalid");

    return output;
  };

  expect(
    invoke(ValueSetExpand.Op, ctx, { url: "asdf" as uri }),
  ).resolves.toEqual(output);

  expect(
    invoke(
      ValueSetExpand.Op,
      ctx,
      // @ts-ignore
      { url: 5 },
    ),
  ).rejects.toThrow();

  const badOutput: Invocation = async (op, ctx, input) => {
    const inputIssues = await op.validate(ctx, "in", input);
    if (inputIssues.length > 0) throw new Error("Input is invalid");

    const output = { return: 5 };

    const outputIssues = await op.validate(ctx, "out", output);
    if (outputIssues.length > 0) throw new Error("Output is invalid");

    return output;
  };

  expect(
    badOutput(ValueSetExpand.Op, ctx, { url: "asdf" as uri }),
  ).rejects.toThrow();
});
