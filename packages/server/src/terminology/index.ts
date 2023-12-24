import {
  ValueSet,
  ValueSetComposeInclude,
  ValueSetExpansionContains,
  CodeSystemConcept,
  CodeSystem,
  dateTime,
} from "@iguhealth/fhir-types/r4/types";
import {
  ValueSetValidateCode,
  ValueSetExpand,
  CodeSystemLookup,
} from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../ctx/types.js";
import { TerminologyProvider } from "./interface.js";

import ExpandInput = ValueSetExpand.Input;
import ExpandOutput = ValueSetExpand.Output;

import ValidateInput = ValueSetValidateCode.Input;
import ValidateOutput = ValueSetValidateCode.Output;
import {
  OperationError,
  outcome,
  outcomeError,
} from "@iguhealth/operation-outcomes";

function inlineCodesetToValuesetExpansion(
  include: ValueSetComposeInclude
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
  codesystem: CodeSystem,
  concepts: CodeSystemConcept[]
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

async function getValuesetExpansionContains(
  ctx: FHIRServerCTX,
  valueSet: ValueSet
): Promise<ValueSetExpansionContains[]> {
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
          "ValueSet",
          { url: includeValueSet }
        );
        expansion = expansion.concat(
          expandedValueSet?.expansion?.contains
            ? expandedValueSet?.expansion?.contains
            : []
        );
      }
    } else if (include.system) {
      const codeSystemSearch = await ctx.client.search_type(ctx, "CodeSystem", [
        { name: "url", value: [include.system] },
      ]);
      if (codeSystemSearch.resources.length > 1) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `CodeSystem '${include.system}' returned duplicate results so cannot be used to expand valueset '${valueSet.id}'`
          )
        );
      }
      if (codeSystemSearch.resources.length < 1) {
        throw new OperationError(
          outcomeError(
            "not-found",
            `Could not find codesystem ${include.system}`
          )
        );
      }
      const codesystem = codeSystemSearch.resources[0];
      const codesystemExpansion = codeSystemConceptToValuesetExpansion(
        codesystem,
        codesystem.concept ? codesystem.concept : []
      );

      expansion = expansion.concat(
        codesystemExpansion ? codesystemExpansion : []
      );
    } else {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Could not expand valueset ${valueSet.id}`
        )
      );
    }
  }

  return expansion;
}

function checkforCode(
  contains: ValueSetExpansionContains[] | undefined,
  code: string | undefined
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
  code: string
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

export class TerminologyProviderMemory implements TerminologyProvider {
  constructor() {}
  async validate(
    ctx: FHIRServerCTX,
    input: ValidateInput
  ): Promise<ValidateOutput> {
    const valueset = await this.expand(ctx, {
      url: input.url,
      valueSet: input.valueSet,
      valueSetVersion: input.valueSetVersion,
    });

    if (!valueset) {
      throw new OperationError(
        outcomeError("not-found", "ValueSet was not found.")
      );
    }

    const doesCodeExists = checkforCode(
      valueset.expansion?.contains,
      input.code
    );

    return {
      result: doesCodeExists,
    };
  }
  async expand(ctx: FHIRServerCTX, input: ExpandInput): Promise<ExpandOutput> {
    let valueset: ValueSet | undefined;
    if (input.valueSet) {
      valueset = input.valueSet;
    } else if (input.url) {
      const [url, url_version] = input.url.split("|");
      const version = url_version ? url_version : input.valueSetVersion;

      const valuesetSearch = await ctx.client.search_type(
        ctx,
        "ValueSet",
        [{ name: "url", value: [url] }].concat(
          version ? [{ name: "version", value: [version] }] : []
        )
      );

      if (valuesetSearch.resources.length === 1) {
        valueset = valuesetSearch.resources[0];
      }
    }

    if (!valueset) {
      throw new OperationError(
        outcomeError("not-found", "ValueSet was not found.")
      );
    }

    if (!valueset.expansion) {
      const contains = await getValuesetExpansionContains(ctx, valueset);
      valueset = {
        ...valueset,
        expansion: {
          timestamp: new Date().toISOString() as dateTime,
          contains,
        },
      };
    }
    return valueset;
  }
  async lookup(
    ctx: FHIRServerCTX,
    input: CodeSystemLookup.Input
  ): Promise<CodeSystemLookup.Output> {
    if (!input.system || !input.code) {
      throw new OperationError(
        outcomeError("invalid", "Invalid input must have both system and code")
      );
    }
    const codeSystem = await ctx.client.search_type(ctx, "CodeSystem", [
      { name: "url", value: [input.system] },
    ]);
    if (codeSystem.resources.length < 1) {
      throw new OperationError(
        outcomeError(
          "not-found",
          `Could not find code system with url: '${input.system}'`
        )
      );
    }
    if (codeSystem.resources.length > 1) {
      throw new OperationError(
        outcomeError(
          "invalid",
          `Found conflicting code systems with url: '${input.system}'`
        )
      );
    }

    const codeSystemResource = codeSystem.resources[0];

    const found = findConcept(codeSystemResource.concept || [], input.code);

    if (!found)
      throw new OperationError(
        outcomeError(
          "not-found",
          `Could not find code '${input.code}' in code system '${input.system}'`
        )
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
