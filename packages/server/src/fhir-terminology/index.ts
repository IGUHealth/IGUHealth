import * as db from "zapatos/db";

import { splitParameter } from "@iguhealth/client/url";
import {
  CodeSystemConcept,
  ValueSetComposeInclude,
  ValueSetExpansionContains,
  canonical,
  code,
  dateTime,
} from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, R4, Resource } from "@iguhealth/fhir-types/versions";
import {
  CodeSystemLookup,
  ValueSetExpand,
  ValueSetValidateCode,
} from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../fhir-api/types.js";
import { TerminologyProvider as ITerminologyProvider } from "./interface.js";

import ExpandInput = ValueSetExpand.Input;
import ExpandOutput = ValueSetExpand.Output;

import ValidateInput = ValueSetValidateCode.Input;
import ValidateOutput = ValueSetValidateCode.Output;

function inlineCodesetToValuesetExpansion(
  include: ValueSetComposeInclude,
): ValueSetExpansionContains[] | undefined {
  return include.concept?.map((concept) => {
    return {
      system: include.system,
      code: concept.code,
      display: concept.display,
      designation: concept.designation,
    };
  });
}

function areCodesInline(include: ValueSetComposeInclude) {
  return include.concept !== undefined;
}

function codeSystemConceptToValuesetExpansion(
  url: Resource<FHIR_VERSION, "CodeSystem">["url"],
  version: Resource<FHIR_VERSION, "CodeSystem">["version"],
  concepts: CodeSystemConcept[],
): ValueSetExpansionContains[] {
  return concepts.map((concept) => {
    return {
      system: url,
      code: concept.code,
      version: version,
      display: concept.display,
      designation: concept.designation,
      extension: concept.extension,
      contains: concept.concept
        ? codeSystemConceptToValuesetExpansion(url, version, concept.concept)
        : undefined,
    };
  });
}

async function getConcepts<Version extends FHIR_VERSION>(
  pg: db.Queryable,
  codeSystem: Resource<Version, "CodeSystem">,
): Promise<CodeSystemConcept[]> {
  switch (codeSystem.content) {
    case "not-present": {
      const system = await db
        .selectOne("terminology_systems", { url: codeSystem.url })
        .run(pg);
      if (system) {
        const codes = await db
          .select("terminology_codes", { system: codeSystem.url })
          .run(pg);
        return codes.map((code) => {
          return {
            code: code.code as code,
            display: code.display,
          };
        });
      } else {
        throw new OperationError(
          outcomeError(
            "not-found",
            `Could not find code system ${codeSystem.url}`,
          ),
        );
      }
    }
    case "example": {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Example code systems are not supported for expansion.`,
        ),
      );
    }
    case "fragment":
    case "complete":
    case "supplement":
    default: {
      return codeSystem.concept || [];
    }
  }
}

async function getValueSetExpansion<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  include: NonNullable<
    NonNullable<Resource<Version, "ValueSet">["compose"]>
  >["include"][number],
): Promise<ValueSetExpansionContains[]> {
  switch (true) {
    case areCodesInline(include): {
      const inlineExpansion = inlineCodesetToValuesetExpansion(include);
      return inlineExpansion ? inlineExpansion : [];
    }
    // [TODO] Check for infinite recursion here.
    // Users could exploit creation of valueset that refers to itself.
    case include.valueSet !== undefined: {
      return (
        await Promise.all(
          include.valueSet.map(async (includeValueSet) => {
            const expandedValueSet = await ctx.client.invoke_type(
              ValueSetExpand.Op,
              ctx,
              fhirVersion,
              "ValueSet",
              { url: includeValueSet },
            );

            return expandedValueSet?.expansion?.contains
              ? expandedValueSet?.expansion?.contains
              : [];
          }),
        )
      ).flat();
    }
    case include.system !== undefined: {
      const codeSystem = await ctx.resolveCanonical(
        fhirVersion,
        "CodeSystem",
        include.system as canonical,
      );

      if (!codeSystem) {
        throw new OperationError(
          outcomeError(
            "not-found",
            `Could not find codesystem ${include.system}`,
          ),
        );
      }

      const codesystemExpansion = codeSystemConceptToValuesetExpansion(
        codeSystem.url,
        codeSystem.version,
        await getConcepts(ctx.db, codeSystem),
      );

      return codesystemExpansion ? codesystemExpansion : [];
    }
    default: {
      throw new OperationError(
        outcomeError("not-supported", `Could not expand valueset`),
      );
    }
  }
}

async function getValuesetExpansionContains<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  valueSet: Resource<Version, "ValueSet">,
): Promise<
  NonNullable<Resource<Version, "ValueSet">["expansion"]>["contains"]
> {
  return (
    await Promise.all(
      (valueSet.compose?.include || []).map(async (include) =>
        getValueSetExpansion(ctx, fhirVersion, include),
      ),
    )
  ).flat();
}

function checkforCode(
  contains: ValueSetExpansionContains[] | undefined,
  code: string | undefined,
): boolean {
  if (!code) return false;
  if (!contains) {
    return false;
  }
  if (contains.find((v) => v.code === code)) return true;
  for (const c of contains) {
    if (checkforCode(c.contains, code)) return true;
  }
  return false;
}

function findConceptLocal(
  concepts: CodeSystemConcept[],
  code: string,
): CodeSystemConcept | undefined {
  for (const concept of concepts) {
    if (concept.code === code) {
      return concept;
    }
    if (concept.concept) {
      const foundConcept = findConceptLocal(concept.concept, code);
      if (foundConcept) return foundConcept;
    }
  }
  return undefined;
}

async function findConcept<Version extends FHIR_VERSION>(
  pg: db.Queryable,
  codeSystem: Resource<Version, "CodeSystem">,
  code: string,
): Promise<CodeSystemConcept | undefined> {
  switch (codeSystem.content) {
    case "not-present": {
      const system = await db
        .selectOne("terminology_systems", { url: codeSystem.url })
        .run(pg);
      if (!system) {
        throw new OperationError(
          outcomeError(
            "not-found",
            `Could not find code system ${codeSystem.url}`,
          ),
        );
      }

      const foundCode = await db
        .selectOne("terminology_codes", { system: codeSystem.url, code })
        .run(pg);
      if (!foundCode) return undefined;

      return {
        code: foundCode.code as code,
        display: foundCode.display,
      };
    }

    case "example": {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Example code systems are not supported for expansion.`,
        ),
      );
    }
    case "fragment":
    case "complete":
    case "supplement":
    default: {
      return findConceptLocal(codeSystem.concept || [], code);
    }
  }
}

export class TerminologyProvider implements ITerminologyProvider {
  constructor() {}
  async validate(
    ctx: IGUHealthServerCTX,
    fhirVersion: FHIR_VERSION,
    input: ValidateInput,
  ): Promise<ValidateOutput> {
    const valueset = await this.expand(ctx, fhirVersion, {
      url: input.url,
      valueSet: input.valueSet,
      valueSetVersion: input.valueSetVersion,
    });

    if (!valueset) {
      throw new OperationError(
        outcomeError("not-found", "ValueSet was not found."),
      );
    }

    const doesCodeExists = checkforCode(
      valueset.expansion?.contains,
      input.code,
    );

    return {
      result: doesCodeExists,
    };
  }
  async expand<Version extends FHIR_VERSION>(
    ctx: IGUHealthServerCTX,
    fhirVersion: Version,
    input: ExpandInput,
  ): Promise<ExpandOutput> {
    let valueset: Resource<Version, "ValueSet"> | undefined;
    if (input.valueSet) {
      valueset = input.valueSet as Resource<Version, "ValueSet"> | undefined;
    } else if (input.url) {
      const [url, url_version] = splitParameter(input.url, "|");
      const version = url_version ? url_version : input.valueSetVersion;

      valueset = await ctx.resolveCanonical(
        fhirVersion,
        "ValueSet",
        url as canonical,
      );
    }

    if (!valueset) {
      throw new OperationError(
        outcomeError("not-found", "ValueSet was not found."),
      );
    }

    if (!valueset.expansion) {
      const contains = await getValuesetExpansionContains(
        ctx,
        fhirVersion,
        valueset,
      );
      valueset = {
        ...valueset,
        expansion: {
          timestamp: new Date().toISOString() as dateTime,
          // @ts-ignore
          contains,
        },
      };
    }
    return valueset as Resource<R4, "ValueSet">;
  }
  async lookup(
    ctx: IGUHealthServerCTX,
    fhirVersion: FHIR_VERSION,
    input: CodeSystemLookup.Input,
  ): Promise<CodeSystemLookup.Output> {
    if (!input.system || !input.code) {
      throw new OperationError(
        outcomeError("invalid", "Invalid input must have both system and code"),
      );
    }
    const codeSystem = input.system
      ? await ctx.resolveCanonical(
          fhirVersion,
          "CodeSystem",
          input.system as canonical,
        )
      : undefined;

    if (!codeSystem) {
      throw new OperationError(
        outcomeError(
          "not-found",
          `Could not find code system with url: '${input.system}'`,
        ),
      );
    }

    const found = await findConcept(ctx.db, codeSystem, input.code);

    if (!found)
      throw new OperationError(
        outcomeError(
          "not-found",
          `Could not find code '${input.code}' in code system '${input.system}'`,
        ),
      );

    return {
      name: codeSystem.name || `CodeSystem/${codeSystem.id}`,
      version: codeSystem.version,
      display: found.display || found.code,
      designation: found.designation ? found.designation : [],
      property: found.property ? found.property : [],
    };
  }
}
