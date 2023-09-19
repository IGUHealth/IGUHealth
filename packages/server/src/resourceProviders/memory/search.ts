import { Resource, SearchParameter } from "@iguhealth/fhir-types/r4/types";
import { evaluateWithMeta } from "@iguhealth/fhirpath";
import { ParsedParameter } from "@iguhealth/client/url";

import { FHIRServerCTX } from "../../fhirServer.js";

function fitsSearchCriteria(
  ctx: FHIRServerCTX,
  resource: Resource,
  parameter: ParsedParameter<string | number>,
  searchParameter: SearchParameter
) {
  if (searchParameter.expression) {
    const evaluation = evaluateWithMeta(searchParameter.expression, resource, {
      meta: { getSD: (type: string) => ctx.resolveSD(ctx, type) },
    });
    return (
      evaluation.find((v) => v.valueOf() === parameter.value) !== undefined
    );
  }
  return false;
}
