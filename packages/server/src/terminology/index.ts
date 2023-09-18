import { ValueSet } from "@iguhealth/fhir-types/r4/types";
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

export class TerminologyProviderInline implements TerminologyProvider {
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
