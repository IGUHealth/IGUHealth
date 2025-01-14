import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { id } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import * as fhirpath from "@iguhealth/fhirpath";
import { IMetaValue } from "@iguhealth/meta-value/interface";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { getSp1Name } from "../../../cli/generate/sp1-parameters.js";
import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import {
  SEARCH_TABLE_TYPES,
  search_table_types,
  search_types_supported,
} from "../../constants.js";
import * as r4Sp1 from "../../schemas/generated/sp1-parameters/r4.sp1parameters.js";
import * as r4bSp1 from "../../schemas/generated/sp1-parameters/r4b.sp1parameters.js";
import { createResolverRemoteCanonical } from "../../utilities/canonical.js";
import dataConversion from "../../utilities/search/dataConversion.js";
import {
  searchParameterToTableName,
  searchResources,
} from "../../utilities/search/parameters.js";
import { isSearchParameterInSingularTable } from "./utilities.js";

type Insertables = {
  quantity: s.r4b_quantity_idx.Insertable | s.r4_quantity_idx.Insertable;
  date: s.r4b_date_idx.Insertable | s.r4_date_idx.Insertable;
  reference: s.r4b_reference_idx.Insertable | s.r4_reference_idx.Insertable;
  uri: s.r4b_uri_idx.Insertable | s.r4_uri_idx.Insertable;
  token: s.r4b_token_idx.Insertable | s.r4_token_idx.Insertable;
  number: s.r4b_number_idx.Insertable | s.r4_number_idx.Insertable;
  string: s.r4b_string_idx.Insertable | s.r4_string_idx.Insertable;
};

async function toInsertableIndex<
  Version extends FHIR_VERSION,
  Type extends SEARCH_TABLE_TYPES,
>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  type: Type,
  parameter: Resource<Version, "SearchParameter">,
  resource: Resource<Version, AllResourceTypes> & {
    id: id;
    meta: { versionId: id };
  },
  evaluation: IMetaValue<NonNullable<unknown>>[],
): Promise<Insertables[Type][]> {
  switch (type) {
    case "quantity": {
      return (
        await dataConversion<Version, "quantity">(
          fhirVersion,
          parameter,
          evaluation,
        )
      ).map(
        (
          value,
        ): s.r4_quantity_idx.Insertable | s.r4b_quantity_idx.Insertable => ({
          tenant: ctx.tenant,
          r_id: resource.id,
          resource_type: resource.resourceType,
          r_version_id: resource.meta.versionId,
          parameter_name: parameter.name,
          parameter_url: parameter.url,
          // Note because I can use string -infinity for the start value, I need to cast it to number here even though technically string,
          start_value: value.start?.value as number | undefined,
          start_system: value.start?.system,
          start_code: value.start?.code,
          // Note because I can use string infinity for the start value, I need to cast it to number here even though technically string,
          end_value: value.end?.value as number | undefined,
          end_system: value.end?.system,
          end_code: value.end?.code,
        }),
      ) as Insertables[Type][];
    }
    case "date": {
      return (
        await dataConversion<Version, "date">(
          fhirVersion,
          parameter,
          evaluation,
        )
      )
        .flat()
        .map((value): s.r4_date_idx.Insertable | s.r4b_date_idx.Insertable => ({
          tenant: ctx.tenant,
          r_id: resource.id,
          resource_type: resource.resourceType,
          r_version_id: resource.meta.versionId,
          parameter_name: parameter.name,
          parameter_url: parameter.url,
          start_date: value.start as unknown as Date,
          end_date: value.end as unknown as Date,
        })) as Insertables[Type][];
    }
    case "reference": {
      const references = (
        await dataConversion<Version, "reference">(
          fhirVersion,
          parameter,
          evaluation,
          createResolverRemoteCanonical(ctx.client, ctx),
        )
      ).flat();

      return references.map(
        ({
          resourceType,
          id,
        }): s.r4_reference_idx.Insertable | s.r4b_reference_idx.Insertable => {
          if (!resourceType || !id) {
            throw new OperationError(
              outcomeError(
                "exception",
                "Resource type or id not found when indexing the resource.",
              ),
            );
          }
          return {
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: resource.meta.versionId,
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            reference_type: resourceType,
            reference_id: id,
          };
        },
      ) as Insertables[Type][];
    }
    case "uri": {
      return (
        await dataConversion<Version, "uri">(fhirVersion, parameter, evaluation)
      )
        .flat()
        .map((value): s.r4_uri_idx.Insertable | s.r4b_uri_idx.Insertable => ({
          tenant: ctx.tenant,
          r_id: resource.id,
          resource_type: resource.resourceType,
          r_version_id: resource.meta.versionId,
          parameter_name: parameter.name,
          parameter_url: parameter.url,
          value,
        })) as Insertables[Type][];
    }
    case "token": {
      return (
        await dataConversion<Version, "token">(
          fhirVersion,
          parameter,
          evaluation,
        )
      )
        .flat()
        .map(
          (value): s.r4_token_idx.Insertable | s.r4b_token_idx.Insertable => ({
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: resource.meta.versionId,
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            system: value.system,
            value: value.code,
          }),
        ) as Insertables[Type][];
    }
    case "number": {
      return (
        await dataConversion<Version, "number">(
          fhirVersion,
          parameter,
          evaluation,
        )
      ).map(
        (value): s.r4_number_idx.Insertable | s.r4b_number_idx.Insertable => {
          if (typeof value !== "number")
            throw new OperationError(
              outcomeError(
                "invalid",
                "Failed to index number. Value found is not a number.",
              ),
            );
          return {
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: resource.meta.versionId,
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            value,
          };
        },
      ) as Insertables[Type][];
    }

    case "string": {
      return (
        await dataConversion<Version, "string">(
          fhirVersion,
          parameter,
          evaluation,
        )
      )
        .flat()
        .map(
          (
            value,
          ): s.r4_string_idx.Insertable | s.r4b_string_idx.Insertable => ({
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: resource.meta.versionId,
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            value,
          }),
        ) as Insertables[Type][];
    }

    default: {
      throw new Error();
    }
  }
}

async function getAllParametersForResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resourceTypes: ResourceType<Version>[],
): Promise<Resource<Version, "SearchParameter">[]> {
  const parameters = [
    {
      name: "type",
      value: search_types_supported,
    },
    {
      name: "base",
      value: searchResources(resourceTypes),
    },
  ];

  return (
    await ctx.client.search_type(
      asRoot(ctx),
      fhirVersion,
      "SearchParameter",
      parameters,
    )
  ).resources;
}

export async function removeIndices<Version extends FHIR_VERSION>(
  pg: db.Queryable,
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  id: id,
  resourceType: ResourceType<Version>,
) {
  await Promise.all([
    db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`
      DELETE FROM ${getSp1Name(fhirVersion)}
      WHERE ${{
        tenant: ctx.tenant,
        r_id: id,
        resource_type: resourceType,
      }}`.run(pg),
    ...search_table_types.map((type) =>
      db.sql<
        | s.r4_number_idx.SQL
        | s.r4_string_idx.SQL
        | s.r4_uri_idx.SQL
        | s.r4_date_idx.SQL
        | s.r4_token_idx.SQL
        | s.r4_reference_idx.SQL
        | s.r4_quantity_idx.SQL
        | s.r4b_number_idx.SQL
        | s.r4b_string_idx.SQL
        | s.r4b_uri_idx.SQL
        | s.r4b_date_idx.SQL
        | s.r4b_token_idx.SQL
        | s.r4b_reference_idx.SQL
        | s.r4b_quantity_idx.SQL
      >`DELETE FROM ${searchParameterToTableName(fhirVersion, type)} WHERE ${{
        tenant: ctx.tenant,
        r_id: id,
        resource_type: resourceType,
      }}`.run(pg),
    ),
  ]);
}

function resourceIsValidForIndexing<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
): resource is Resource<Version, AllResourceTypes> & {
  id: id;
  meta: { versionId: id };
} {
  if (!resource.id || !resource.meta?.versionId) {
    return false;
  }
  return true;
}

type Sp1Insertable<Version extends FHIR_VERSION> = Version extends R4
  ? s.r4_sp1_idx.Insertable
  : s.r4b_sp1_idx.Insertable;

async function indexSingularParameters<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  pg: db.Queryable,
  ctx: CTX,
  fhirVersion: Version,
  parameters: Resource<Version, "SearchParameter">[],
  resource: Resource<Version, AllResourceTypes> & {
    id: id;
    meta: { versionId: id };
  },
) {
  let insertable: Sp1Insertable<Version> = {
    tenant: ctx.tenant,
    r_id: resource.id,
    resource_type: resource.resourceType,
    r_version_id: resource.meta.versionId,
  };
  for (const parameter of parameters) {
    const evaluation = await fhirpath.evaluateWithMeta(
      parameter.expression as string,
      resource,
      {
        fhirVersion,
      },
    );

    const result = await indexSingularParameter(
      fhirVersion,
      parameter,
      evaluation,
    );

    insertable = {
      ...insertable,
      ...result,
    };
  }

  switch (fhirVersion) {
    case R4: {
      await db
        .upsert("r4_sp1_idx", [insertable], db.constraint("r4_sp1_idx_pkey"), {
          updateColumns: db.doNothing,
        })
        .run(pg);
      return;
    }
    case R4B: {
      await db
        .upsert(
          "r4b_sp1_idx",
          [insertable],
          db.constraint("r4b_sp1_idx_pkey"),
          {
            updateColumns: db.doNothing,
          },
        )
        .run(pg);
      return;
    }
    default: {
      throw new Error(`Unsupported FHIR version: ${fhirVersion}`);
    }
  }
}

async function indexSingularParameter<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  parameter: Resource<Version, "SearchParameter">,
  evaluation: IMetaValue<NonNullable<unknown>>[],
): Promise<Partial<Sp1Insertable<Version>>> {
  if (evaluation.length > 1) {
    throw new Error("Evaluation length is greater than 1");
  }
  if (evaluation.length === 0) {
    return {};
  }

  switch (parameter.type) {
    case "quantity": {
      const data = await dataConversion<Version, "quantity">(
        fhirVersion,
        parameter,
        evaluation,
      );
      switch (fhirVersion) {
        case R4: {
          const sp1Quantity = r4Sp1.asSP1Quantity(parameter.url);
          if (!sp1Quantity) {
            throw new Error("Failed to convert parameter url to column.");
          }

          const start_col_system: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_start_system`;
          const start_col_value: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_start_value`;
          const start_col_code: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_start_code`;

          const end_col_system: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_end_system`;
          const end_col_code: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_end_code`;
          const end_col_value: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_end_value`;

          const quantityIndex: Partial<s.r4_sp1_idx.Insertable> = {
            [start_col_system]: data[0].start?.system,
            [start_col_value]: data[0].start?.value,
            [start_col_code]: data[0].start?.code,
            [end_col_system]: data[0].end?.system,
            [end_col_value]: data[0].end?.value,
            [end_col_code]: data[0].end?.code,
          };

          return quantityIndex;
        }
        case R4B: {
          const sp1Quantity = r4bSp1.asSP1Quantity(parameter.url);
          if (!sp1Quantity) {
            throw new Error("Failed to convert parameter url to column.");
          }

          const start_col_system: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_start_system`;
          const start_col_value: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_start_value`;
          const start_col_code: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_start_code`;

          const end_col_system: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_end_system`;
          const end_col_code: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_end_code`;
          const end_col_value: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Quantity}_end_value`;

          const quantityIndex: Partial<s.r4b_sp1_idx.Insertable> = {
            [start_col_system]: data[0].start?.system,
            [start_col_value]: data[0].start?.value,
            [start_col_code]: data[0].start?.code,
            [end_col_system]: data[0].end?.system,
            [end_col_value]: data[0].end?.value,
            [end_col_code]: data[0].end?.code,
          };

          return quantityIndex;
        }
        default: {
          throw new Error(`Unsupported FHIR version: ${fhirVersion}`);
        }
      }
    }
    case "date": {
      const data = await dataConversion<Version, "date">(
        fhirVersion,
        parameter,
        evaluation,
      );
      switch (fhirVersion) {
        case R4: {
          const sp1Date = r4Sp1.asSP1Date(parameter.url);
          if (!sp1Date) {
            throw new Error("Failed to convert parameter url to column.");
          }

          const start_col_date: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Date}_start`;
          const end_col_date: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Date}_end`;

          const dateIndex: Partial<s.r4_sp1_idx.Insertable> = {
            [start_col_date]: data[0]?.start,
            [end_col_date]: data[0]?.end,
          };

          return dateIndex;
        }
        case R4B: {
          const sp1Date = r4bSp1.asSP1Date(parameter.url);
          if (!sp1Date) {
            throw new Error("Failed to convert parameter url to column.");
          }
          const start_col_date: keyof Partial<s.r4b_sp1_idx.Insertable> = `${sp1Date}_start`;
          const end_col_date: keyof Partial<s.r4b_sp1_idx.Insertable> = `${sp1Date}_end`;

          const dateIndex: Partial<s.r4b_sp1_idx.Insertable> = {
            [start_col_date]: data[0]?.start,
            [end_col_date]: data[0]?.end,
          };

          return dateIndex;
        }
        default: {
          throw new Error(`Unsupported FHIR version: ${fhirVersion}`);
        }
      }
    }
    case "uri": {
      const data = await dataConversion<Version, "uri">(
        fhirVersion,
        parameter,
        evaluation,
      );
      switch (fhirVersion) {
        case R4: {
          const sp1URI = r4Sp1.asSP1Uri(parameter.url);
          if (!sp1URI) {
            throw new Error("Failed to convert parameter url to column.");
          }

          const uri_col: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1URI}`;

          const uriIndex: Partial<s.r4_sp1_idx.Insertable> = {
            [uri_col]: data[0],
          };

          return uriIndex;
        }
        case R4B: {
          const sp1URI = r4bSp1.asSP1Uri(parameter.url);
          if (!sp1URI) {
            throw new Error("Failed to convert parameter url to column.");
          }

          const uri_col: keyof Partial<s.r4b_sp1_idx.Insertable> = `${sp1URI}`;

          const uriIndex: Partial<s.r4b_sp1_idx.Insertable> = {
            [uri_col]: data[0],
          };

          return uriIndex;
        }
        default: {
          throw new Error(`Unsupported FHIR version: ${fhirVersion}`);
        }
      }
    }

    case "token": {
      const data = await dataConversion<Version, "token">(
        fhirVersion,
        parameter,
        evaluation,
      );
      switch (fhirVersion) {
        case R4: {
          const sp1Token = r4Sp1.asSP1Token(parameter.url);
          if (!sp1Token) {
            throw new Error("Failed to convert parameter url to column.");
          }

          const token_col_system: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Token}_system`;
          const token_col_value: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Token}_value`;

          const tokenIndex: Partial<s.r4_sp1_idx.Insertable> = {
            [token_col_system]: data[0]?.system,
            [token_col_value]: data[0]?.code,
          };

          return tokenIndex;
        }
        case R4B: {
          const sp1Token = r4bSp1.asSP1Token(parameter.url);
          if (!sp1Token) {
            throw new Error("Failed to convert parameter url to column.");
          }

          const token_col_system: keyof Partial<s.r4b_sp1_idx.Insertable> = `${sp1Token}_system`;
          const token_col_value: keyof Partial<s.r4b_sp1_idx.Insertable> = `${sp1Token}_value`;

          const tokenIndex: Partial<s.r4b_sp1_idx.Insertable> = {
            [token_col_system]: data[0]?.system,
            [token_col_value]: data[0]?.code,
          };

          return tokenIndex;
        }
        default: {
          throw new Error(`Unsupported FHIR version: ${fhirVersion}`);
        }
      }
    }

    case "number": {
      const data = await dataConversion<Version, "number">(
        fhirVersion,
        parameter,
        evaluation,
      );
      switch (fhirVersion) {
        case R4: {
          const sp1Number = r4Sp1.asSP1Number(parameter.url);
          if (!sp1Number) {
            throw new Error("Failed to convert parameter url to column.");
          }

          const number_col: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1Number}`;

          const numberIndex: Partial<s.r4_sp1_idx.Insertable> = {
            [number_col]: data[0],
          };

          return numberIndex;
        }
        case R4B: {
          const sp1Number = r4bSp1.asSP1Number(parameter.url);
          if (!sp1Number) {
            throw new Error("Failed to convert parameter url to column.");
          }

          const number_col: keyof Partial<s.r4b_sp1_idx.Insertable> = `${sp1Number}`;

          const numberIndex: Partial<s.r4b_sp1_idx.Insertable> = {
            [number_col]: data[0],
          };

          return numberIndex;
        }
        default: {
          throw new Error(`Unsupported FHIR version: ${fhirVersion}`);
        }
      }
    }
    case "string": {
      const data = await dataConversion<Version, "string">(
        fhirVersion,
        parameter,
        evaluation,
      );
      switch (fhirVersion) {
        case R4: {
          const sp1String = r4Sp1.asSP1String(parameter.url);
          if (!sp1String) {
            throw new Error("Failed to convert parameter url to column.");
          }

          const string_col: keyof Partial<s.r4_sp1_idx.Insertable> = `${sp1String}`;

          const stringIndex: Partial<s.r4_sp1_idx.Insertable> = {
            [string_col]: data[0],
          };

          return stringIndex;
        }
        case R4B: {
          const sp1String = r4bSp1.asSP1String(parameter.url);
          if (!sp1String) {
            throw new Error("Failed to convert parameter url to column.");
          }

          const string_col: keyof Partial<s.r4b_sp1_idx.Insertable> = `${sp1String}`;

          const stringIndex: Partial<s.r4b_sp1_idx.Insertable> = {
            [string_col]: data[0],
          };

          return stringIndex;
        }
        default: {
          throw new Error(`Unsupported FHIR version: ${fhirVersion}`);
        }
      }
    }

    default: {
      throw new Error();
    }
  }
}

async function indexMultiSearchParameter<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  pg: db.Queryable,
  ctx: CTX,
  fhirVersion: Version,
  parameter: Resource<Version, "SearchParameter">,
  resource: Resource<Version, AllResourceTypes> & {
    id: id;
    meta: { versionId: id };
  },
) {
  const evaluation = await fhirpath.evaluateWithMeta(
    parameter.expression as string,
    resource,
    {
      fhirVersion,
    },
  );

  switch (parameter.type) {
    case "composite": {
      // const _composite_indexes = await dataConversion<Version, "composite">(
      //   fhirVersion,
      //   parameter,
      //   evaluation,
      //   (fhirVersion, types, url) =>
      //     ctx.resolveCanonical(fhirVersion, types[0], url),
      // );
      return;
    }
    case "quantity": {
      const quantity_indexes = await toInsertableIndex(
        ctx,
        fhirVersion,
        "quantity",
        parameter,
        resource,
        evaluation,
      );

      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_quantity_idx",
              quantity_indexes,
              db.constraint("quantity_idx_pkey"),
              { updateColumns: db.doNothing },
            )
            .run(pg);
          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_quantity_idx",
              quantity_indexes as s.r4b_quantity_idx.Insertable[],
              db.constraint("r4b_quantity_idx_pkey"),
              { updateColumns: db.doNothing },
            )
            .run(pg);
          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }
    case "date": {
      const date_indexes = await toInsertableIndex(
        ctx,
        fhirVersion,
        "date",
        parameter,
        resource,
        evaluation,
      );

      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_date_idx",
              date_indexes,
              db.constraint("date_idx_pkey"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);
          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_date_idx",
              date_indexes as s.r4b_date_idx.Insertable[],
              db.constraint("r4b_date_idx_pkey"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);
          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }

    case "reference": {
      const reference_indexes = await toInsertableIndex(
        ctx,
        fhirVersion,
        "reference",
        parameter,
        resource,
        evaluation,
      );

      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_reference_idx",
              reference_indexes,
              db.constraint("reference_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);

          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_reference_idx",
              reference_indexes as s.r4b_reference_idx.Insertable[],
              db.constraint("r4b_reference_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);

          return;
        }

        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }
    case "uri": {
      const uri_indexes = await toInsertableIndex(
        ctx,
        fhirVersion,
        "uri",
        parameter,
        resource,
        evaluation,
      );

      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_uri_idx",
              uri_indexes,
              db.constraint("uri_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);

          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_uri_idx",
              uri_indexes as s.r4b_uri_idx.Insertable[],
              db.constraint("r4b_uri_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);
          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }
    case "token": {
      const token_indexes = await toInsertableIndex(
        ctx,
        fhirVersion,
        "token",
        parameter,
        resource,
        evaluation,
      );

      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_token_idx",
              token_indexes,
              db.constraint("token_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);

          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_token_idx",
              token_indexes as s.r4b_token_idx.Insertable[],
              db.constraint("r4b_token_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);

          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }
    case "number": {
      const number_indexes = await toInsertableIndex(
        ctx,
        fhirVersion,
        "number",
        parameter,
        resource,
        evaluation,
      );

      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_number_idx",
              number_indexes,
              db.constraint("number_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);
          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_number_idx",
              number_indexes as s.r4b_number_idx.Insertable[],
              db.constraint("r4b_number_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);
          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }

    case "string": {
      const string_indexes = await toInsertableIndex(
        ctx,
        fhirVersion,
        "string",
        parameter,
        resource,
        evaluation,
      );

      switch (fhirVersion) {
        case R4: {
          await db
            .upsert(
              "r4_string_idx",
              string_indexes,
              db.constraint("string_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);

          return;
        }
        case R4B: {
          await db
            .upsert(
              "r4b_string_idx",
              string_indexes as s.r4b_string_idx.Insertable[],
              db.constraint("r4b_string_idx_unique"),
              {
                updateColumns: db.doNothing,
              },
            )
            .run(pg);

          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `FHIR version ${fhirVersion} is not supported.`,
            ),
          );
        }
      }
    }
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Parameters of type '${parameter.type}' are not yet supported.`,
        ),
      );
  }
}

export default async function indexResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  pg: db.Queryable,
  ctx: CTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
) {
  if (!resourceIsValidForIndexing(fhirVersion, resource)) {
    throw new OperationError(
      outcomeFatal(
        "exception",
        "Resource id or versionId not found when indexing the resource.",
      ),
    );
  }

  await removeIndices(
    pg,
    ctx,
    fhirVersion,
    resource.id,
    resource.resourceType as ResourceType<Version>,
  );

  const searchParameters = await getAllParametersForResource(ctx, fhirVersion, [
    resource.resourceType as ResourceType<Version>,
  ]);

  const sp1Parameters: Resource<Version, "SearchParameter">[] = [];
  const manyParameters: Resource<Version, "SearchParameter">[] = [];

  for (const parameter of searchParameters) {
    if (isSearchParameterInSingularTable(fhirVersion, parameter)) {
      sp1Parameters.push(parameter);
    } else {
      manyParameters.push(parameter);
    }
  }

  await Promise.all([
    indexSingularParameters(pg, ctx, fhirVersion, sp1Parameters, resource),
    ...manyParameters
      .filter((v) => v.expression !== undefined)
      .map(async (searchParameter) =>
        indexMultiSearchParameter(
          pg,
          ctx,
          fhirVersion,
          searchParameter,
          resource,
        ),
      ),
  ]);
}
