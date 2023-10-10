import {
  ValueSet,
  ValueSetComposeInclude,
  ValueSetExpansionContains,
} from "@iguhealth/fhir-types/r4/types";
import {
  ValueSetValidateCode,
  ValueSetExpand,
} from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../fhirServer.js";
import { TerminologyProvider } from "./interface.js";

import ExpandInput = ValueSetExpand.Input;
import ExpandOutput = ValueSetExpand.Output;

import ValidateInput = ValueSetValidateCode.Input;
import ValidateOutput = ValueSetValidateCode.Output;
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

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
      const codeSystemExapnsion: ValueSetExpansionContains[] | undefined =
        codesystem.concept?.map((concept) => {
          return {
            system: include.system,
            code: concept.code,
            version: codesystem.version,
            display: concept.display,
            designation: concept.designation,
            extension: concept.extension,
          };
        });
      expansion = expansion.concat(
        codeSystemExapnsion ? codeSystemExapnsion : []
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

export class TerminologyProviderMemory implements TerminologyProvider {
  constructor() {}
  async validate(
    ctx: FHIRServerCTX,
    input: ValidateInput
  ): Promise<ValidateOutput> {
    const valueset = await ctx.client.invoke_type(
      ValueSetExpand.Op,
      ctx,
      "ValueSet",
      {
        url: input.url,
        valueSet: input.valueSet,
      }
    );

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
      const [url, version] = input.url.split("|");
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
        expansion: { timestamp: new Date().toISOString(), contains },
      };
    }
    return valueset;
  }
}
