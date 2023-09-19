import {
  ValueSet,
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

// export class TerminologyProviderAWSLambda implements TerminologyProvider {
//     constructor(){

//     }
// }

// (defn- flatten-codes [expansion-entry]
//     (let [expansion-entry-contains (mapcat flatten-codes (get expansion-entry :contains []))]
//       (conj  expansion-entry-contains (:code expansion-entry))))

//   (defn valueset->set-codes
//     "Given a terminology provider fully expand valueset-uri and flatten codes into a set."
//     [expanded-vs]
//     (into
//      #{}
//      (comp
//       (mapcat flatten-codes))
//      (get-in expanded-vs [:expansion :contains] [])))

//   (defn expand-to-set
//     "Given a terminology provider fully expand valueset-uri and flatten codes into a set."
//     [terminology-provider valueset-url]
//     (let [expanded-vs (expand terminology-provider {:url valueset-url})]
//       (valueset->set-codes expanded-vs)))

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
      const valuesetSearch = await ctx.client.search_type(ctx, "ValueSet", [
        { name: "url", value: [input.url] },
      ]);
      if (valuesetSearch.resources.length === 1) {
        valueset = valuesetSearch.resources[0];
      }
    }

    if (!valueset) {
      throw new OperationError(
        outcomeError("not-found", "ValueSet was not found.")
      );
    }

    return valueset;
  }
}
