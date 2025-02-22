import { canonical, uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../types.js";

export default async function resolveTypeToCanonical(
  ctx: IGUHealthServerCTX,
  version: FHIR_VERSION,
  type: uri,
): Promise<canonical | undefined> {
  const result = await ctx.client.search_type(
    ctx,
    version,
    "StructureDefinition",
    [
      { name: "type", value: [type] },
      { name: "derivation", value: ["specialization"] },
    ],
  );

  return result.resources[0]?.url as canonical | undefined;
}
