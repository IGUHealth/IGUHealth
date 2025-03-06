import { canonical } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import { resolveInlineSearch } from "@iguhealth/search-parameters/api/parameter-resolution";

import { IGUHealthServerCTX } from "../types.js";

/**
 * Avoid chicken egg problem by resolving SearchParameters own SearchParameters inline.
 * @param urls
 * @returns
 */
async function resolveSearchParameters<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  urls: canonical[],
): Promise<Resource<Version, "SearchParameter">[]> {
  const returnParams: Resource<Version, "SearchParameter">[] = [
    ...new Array(urls.length),
  ];

  const notFoundIndices = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const param = resolveInlineSearch(fhirVersion, url);

    if (param) {
      returnParams[i] = param;
    } else {
      notFoundIndices.push(i);
    }
  }

  if (notFoundIndices.length > 0) {
    const canonicalsNotFound = notFoundIndices.map((i) => urls[i]);
    const response = await ctx.client.search_type(
      ctx,
      fhirVersion,
      "SearchParameter",
      [
        {
          name: "url",
          value: canonicalsNotFound,
        },
      ],
    );

    if (response.resources.length !== canonicalsNotFound.length) {
      throw new OperationError(
        outcomeError(
          "not-found",
          `Could not resolve all canonicals ${canonicalsNotFound.join(", ")}`,
        ),
      );
    }

    notFoundIndices.forEach((i, j) => {
      returnParams[i] = response.resources[j];
    });
  }
  return returnParams;
}

export default async function resolveCanonical<
  Version extends FHIR_VERSION,
  Type extends ResourceType<Version>,
>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  type: Type,
  url: canonical[],
): Promise<Resource<Version, Type>[]> {
  switch (type) {
    case "SearchParameter": {
      return resolveSearchParameters(ctx, fhirVersion, url) as Promise<
        Resource<Version, Type>[]
      >;
    }
    default: {
      const response = await ctx.client.search_type(ctx, fhirVersion, type, [
        {
          name: "url",
          value: url,
        },
      ]);

      return response.resources;
    }
  }
}
