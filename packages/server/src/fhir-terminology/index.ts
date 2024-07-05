import { splitParameter } from "@iguhealth/client/url";
import {
  CodeSystemConcept,
  ValueSetComposeInclude,
  ValueSetExpansionContains,
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
  codesystem: Resource<FHIR_VERSION, "CodeSystem">,
  concepts: CodeSystemConcept[],
): ValueSetExpansionContains[] {
  return concepts.map((concept) => {
    return {
      system: codesystem.url,
      code: concept.code,
      version: codesystem.version,
      display: concept.display,
      designation: concept.designation,
      extension: concept.extension,
      contains: concept.concept
        ? codeSystemConceptToValuesetExpansion(codesystem, concept.concept)
        : undefined,
    };
  });
}

async function getValuesetExpansionContains<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  valueSet: Resource<Version, "ValueSet">,
): Promise<
  NonNullable<Resource<Version, "ValueSet">["expansion"]>["contains"]
> {
  let expansion: ValueSetExpansionContains[] = [];
  for (const include of valueSet.compose?.include || []) {
    if (areCodesInline(include)) {
      const inlineExpansion = inlineCodesetToValuesetExpansion(include);
      expansion = expansion.concat(inlineExpansion ? inlineExpansion : []);
    }
    // [TODO] Check for infinite recursion here.
    // Users could exploit creation of valueset that refers to itself.
    else if (include.valueSet) {
      for (const includeValueSet of include.valueSet) {
        const expandedValueSet = await ctx.client.invoke_type(
          ValueSetExpand.Op,
          ctx,
          fhirVersion,
          "ValueSet",
          { url: includeValueSet },
        );
        expansion = expansion.concat(
          expandedValueSet?.expansion?.contains
            ? expandedValueSet?.expansion?.contains
            : [],
        );
      }
    } else if (include.system) {
      let codeSystem;
      const search = await ctx.client.search_type(
        ctx,
        fhirVersion,
        "CodeSystem",
        [{ name: "system", value: [include.system] }],
      );
      if (search.resources.length === 1) {
        codeSystem = search.resources[0];
      }

      if (!codeSystem) {
        throw new OperationError(
          outcomeError(
            "not-found",
            `Could not find codesystem ${include.system}`,
          ),
        );
      }

      const codesystemExpansion = codeSystemConceptToValuesetExpansion(
        codeSystem,
        codeSystem.concept ? codeSystem.concept : [],
      );

      expansion = expansion.concat(
        codesystemExpansion ? codesystemExpansion : [],
      );
    } else {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Could not expand valueset ${valueSet.id}`,
        ),
      );
    }
  }

  return expansion;
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

function findConcept(
  concepts: CodeSystemConcept[],
  code: string,
): CodeSystemConcept | undefined {
  for (const concept of concepts) {
    if (concept.code === code) {
      return concept;
    }
    if (concept.concept) {
      const foundConcept = findConcept(concept.concept, code);
      if (foundConcept) return foundConcept;
    }
  }
  return undefined;
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
    const id = Math.floor(Math.random() * 1000);
    let valueset: Resource<Version, "ValueSet"> | undefined;
    if (input.valueSet) {
      valueset = input.valueSet as Resource<Version, "ValueSet"> | undefined;
    } else if (input.url) {
      const [url, url_version] = splitParameter(input.url, "|");
      const version = url_version ? url_version : input.valueSetVersion;
      const parameters = [{ name: "url", value: [url] }];
      if (version) {
        parameters.concat([{ name: "version", value: [version] }]);
      }

      console.time(`${id}RETRIEVE VALUESET`);
      const search = await ctx.client.search_type(
        ctx,
        fhirVersion,
        "ValueSet",
        parameters,
      );
      console.timeEnd(`${id}RETRIEVE VALUESET`);

      if (search.resources.length === 1) {
        valueset = search.resources[0];
      }
    }

    if (!valueset) {
      throw new OperationError(
        outcomeError("not-found", "ValueSet was not found."),
      );
    }

    if (!valueset.expansion) {
      console.time(`${id}GET EXPANSIONS`);
      const contains = await getValuesetExpansionContains(
        ctx,
        fhirVersion,
        valueset,
      );
      console.timeEnd(`${id}GET EXPANSIONS`);
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

    const codeSystem = await ctx.client.search_type(
      ctx,
      fhirVersion,
      "CodeSystem",
      [{ name: "url", value: [input.system] }],
    );

    if (codeSystem.resources.length < 1) {
      throw new OperationError(
        outcomeError(
          "not-found",
          `Could not find code system with url: '${input.system}'`,
        ),
      );
    }
    if (codeSystem.resources.length > 1) {
      throw new OperationError(
        outcomeError(
          "invalid",
          `Found conflicting code systems with url: '${input.system}'`,
        ),
      );
    }

    const codeSystemResource = codeSystem.resources[0];

    const found = findConcept(codeSystemResource.concept || [], input.code);

    if (!found)
      throw new OperationError(
        outcomeError(
          "not-found",
          `Could not find code '${input.code}' in code system '${input.system}'`,
        ),
      );

    return {
      name: codeSystemResource.name || `CodeSystem/${codeSystemResource.id}`,
      version: codeSystemResource.version,
      display: found.display || found.code,
      designation: found.designation ? found.designation : [],
      property: found.property ? found.property : [],
    };
  }
}
