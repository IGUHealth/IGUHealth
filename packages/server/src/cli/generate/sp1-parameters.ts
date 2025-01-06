import * as prettier from "prettier";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { code, uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
} from "@iguhealth/fhir-types/versions";
import analyze from "@iguhealth/fhirpath/analyze";

import { toSQLString } from "../../storage/log_sql.js";
import { getSp1Column } from "../../storage/search-stores/postgres/clauses/db_singular_clauses/shared.js";
import { searchParameterToTableName } from "../../storage/utilities/search/parameters.js";

export function getSp1Name(
  version: FHIR_VERSION,
): "r4_sp1_idx" | "r4b_sp1_idx" {
  switch (version) {
    case R4: {
      return "r4_sp1_idx";
    }
    case R4B: {
      return "r4b_sp1_idx";
    }
    default: {
      throw new Error(`Unsupported FHIR version: ${version}`);
    }
  }
}

type SP1_Tables = Set<uri>;

async function getParameterCardinality<Version extends FHIR_VERSION>(
  version: Version,
  searchParameter: Resource<Version, "SearchParameter">,
): Promise<"unknown" | "single" | "array"> {
  for (const base of searchParameter.base) {
    const evalResult = await analyze(
      version,
      base as unknown as uri,
      searchParameter.expression as string,
    );

    if (evalResult.length === 0) {
      return "unknown";
    }

    for (const v of evalResult) {
      const cardinality = "cardinality" in v ? v.cardinality() : "unknown";
      if (cardinality === "array" || cardinality === "unknown") {
        return cardinality;
      }

      const types = v.types();
      if (!types) {
        return "unknown";
      }
      for (const meta of types) {
        switch (meta.type) {
          case "http://hl7.org/fhirpath/System.String":
          case "markdown":
          case "string":
          case "code":
          case "boolean":
          case "id":
          case "uri":
          case "url":
          case "uuid":
          case "canonical":
          case "decimal":
          case "integer":
          case "instant":
          case "date":
          case "dateTime":
          case "Identifier":
          case "ContactPoint":
          case "Reference":
          case "Coding":
          case "Period":
          case "Range":
          case "Age":
          case "Money":
          case "Duration":
          case "Quantity": {
            break;
          }
          case "CodeableReference":
          case "HumanName":
          case "Address":
          case "CodeableConcept":
          case "Timing": {
            return "array";
          }
          case "SampledData":
          case undefined: {
            console.log("invalid Type", searchParameter.expression);
            return "unknown";
          }
          default: {
            throw new Error(
              `Unsupported type for:'${meta.type}' expression:'${searchParameter.expression}'`,
            );
          }
        }
      }
    }
  }

  return "single";
}

async function generateSP1MetaSets<Version extends FHIR_VERSION>(
  version: Version,
  searchParameters: Resource<Version, "SearchParameter">[],
): Promise<Readonly<SP1_Tables>> {
  const res: SP1_Tables = new Set();
  for (const parameter of searchParameters) {
    switch (parameter.type) {
      // Skipping references as singular for now.
      case "reference": {
        break;
      }
      default: {
        const cardinality = await getParameterCardinality(version, parameter);
        switch (cardinality) {
          case "unknown":
          case "array": {
            break;
          }
          case "single": {
            res.add(parameter.url);
            break;
          }
          default: {
            throw new Error(`Unsupported cardinality: ${cardinality}`);
          }
        }
      }
    }
  }
  return res;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sqlSafeIdentifier(url: string) {
  // 63 byte limit so splitting the last piece.
  const chunks = url.split("/");
  const last = chunks[chunks.length - 1];

  return last.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
}

async function generateSp1CanonicalCode<Version extends FHIR_VERSION>(
  version: Version,
  parameters: Resource<Version, "SearchParameter">[],
) {
  const uriParameters = parameters.filter(
    (p) => p.type === "uri" && p.code === "url",
  );

  const typeToColumn = uriParameters.reduce(
    (acc: Record<code, uri[]>, parameter) => {
      return parameter.base.reduce(
        (acc, base) => ({
          ...acc,
          [base]: [...(acc[base] ?? []), parameter.url],
        }),
        acc,
      );
    },
    {},
  );

  return `export const canonicalColumns = ${JSON.stringify(typeToColumn)}\n`;
}

export async function generateSP1TSCode<Version extends FHIR_VERSION>(
  version: Version,
  searchParameterUrls: Readonly<Set<string>>,
  allSearchParameters: Resource<Version, "SearchParameter">[],
): Promise<string> {
  const searchParameters = allSearchParameters.filter((p) =>
    searchParameterUrls.has(p.url),
  );
  const name = getSp1Name(version);
  const parametersByType = Object.groupBy(searchParameters, (p) => p.type);

  let code = `// This code is generated do not edit\n 
import { uri } from "@iguhealth/fhir-types/r4/types";

export ${sqlSafeIdentifier.toString().replace("url", "url: string")}\n`;

  const fullSet = `export const ${name}: Set<string>  = new Set([${searchParameters
    .map((s) => s.url)
    .map((uri) => `\n  "${uri}",`)
    .join("")}\n])\n`;

  code = `${code}\n ${fullSet} \n${await generateSp1CanonicalCode(version, searchParameters)}`;

  for (const type of Object.keys(parametersByType)) {
    const paramsOfType = parametersByType[type as code];
    const tsSqlTypes = (paramsOfType ?? [])
      .map((s) => s.url)
      .map(sqlSafeIdentifier);

    const SQLType = `export type ${name}_${type} = "${tsSqlTypes.join(
      '" | "',
    )}"\n`;

    const setOfTypeCode = `const ${name}_${type}_set: Set<string>  = new Set([${(
      paramsOfType ?? []
    )
      .map((s) => s.url)
      .map((uri) => `\n  "${uri}",`)
      .join("")}\n])\n`;

    code = `
    ${code}
    ${SQLType}
    ${setOfTypeCode}
    `;

    code = `${code}\n export function asSP1${capitalize(type)}(url: uri): ${name}_${type} | undefined {
    if(!${name}_${type}_set.has(url)) return undefined;
    return sqlSafeIdentifier(url) as ${name}_${type};
    }\n`;
  }

  return prettier.format(code, { parser: "typescript" });
}

export async function generateSP1SQLTable<Version extends FHIR_VERSION>(
  version: Version,
  sp1Urls: Readonly<Set<string>>,
  searchParameters: Resource<Version, "SearchParameter">[],
): Promise<string> {
  const parameterHash = searchParameters.reduce(
    (acc: Record<string, Resource<Version, "SearchParameter">>, parameter) => {
      acc[parameter.url] = parameter;
      return acc;
    },
    {},
  );

  if (
    sp1Urls.size !== new Set([...sp1Urls].map((s) => sqlSafeIdentifier(s))).size
  ) {
    throw new Error("Duplicate parameter names detected");
  }

  let sql = `
CREATE TABLE IF NOT EXISTS ${getSp1Name(version)} (
  r_id           TEXT         NOT NULL,
  r_version_id   INTEGER      NOT NULL PRIMARY KEY,
  resource_type  TEXT         NOT NULL,
  tenant         TEXT         NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),


  UNIQUE (tenant, r_id),
  CONSTRAINT sp1_fk_resource
      FOREIGN KEY(r_version_id) 
	REFERENCES resources(version_id)
);
`;

  sql = `${sql}
CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_tenant ON ${getSp1Name(
    version,
  )} USING hash(tenant);
CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_resource_type ON ${getSp1Name(
    version,
  )}USING hash(resource_type);
  `;

  for (const sp1Url of sp1Urls) {
    const parameter = parameterHash[sp1Url];
    switch (parameter.type) {
      case "number": {
        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)} NUMERIC;`;

        sql = `${sql} \n 
        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)} 
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)});`;
        break;
      }
      case "date": {
        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)}_start TIMESTAMP WITH TIME ZONE;`;
        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)}_end TIMESTAMP WITH TIME ZONE;`;

        sql = `${sql} \n 
        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)}_start
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)}_start);
        
        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)}_end
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)}_end);
        `;
        break;
      }
      case "quantity": {
        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)}_start_value NUMERIC;`;
        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)}_start_system TEXT;`;
        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)}_start_code TEXT;`;

        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)}_end_value NUMERIC;`;
        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)}_end_system TEXT;`;
        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)}_end_code TEXT;`;

        sql = `${sql} \n 
        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)}_start_value
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)}_start_value);
        
        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)}_start_system
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)}_start_system);

        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)}_start_code
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)}_start_code);

        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)}_end_value
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)}_end_value);
        
        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)}_end_system
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)}_end_system);

        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)}_end_code
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)}_end_code);
        `;
        break;
      }

      case "token": {
        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)}_system TEXT;`;
        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)}_value TEXT;`;

        sql = `${sql} \n 
        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)}_system
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)}_system);

        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)}_value
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)}_value);
        `;
        break;
      }

      case "string":
      case "uri": {
        sql = `${sql} \n ALTER TABLE ${getSp1Name(version)} ADD COLUMN IF NOT EXISTS ${sqlSafeIdentifier(parameter.url)} TEXT;`;
        sql = `${sql} \n 
        CREATE INDEX IF NOT EXISTS ${getSp1Name(version)}_${sqlSafeIdentifier(parameter.url)} 
        ON ${getSp1Name(version)} 
        USING btree (tenant, ${sqlSafeIdentifier(parameter.url)});`;

        break;
      }

      default: {
        throw new Error(
          `Parameter type not supported to generate table: '${parameter.type}'`,
        );
      }
    }
  }

  return sql;
}

export function sp1Migration<Version extends FHIR_VERSION>(
  version: Version,
  sp1Urls: Readonly<Set<string>>,
  searchParameters: Resource<Version, "SearchParameter">[],
) {
  const tableName = getSp1Name(version);
  const parameterHash = searchParameters.reduce(
    (acc: Record<string, Resource<Version, "SearchParameter">>, parameter) => {
      acc[parameter.url] = parameter;
      return acc;
    },
    {},
  );

  if (
    sp1Urls.size !== new Set([...sp1Urls].map((s) => sqlSafeIdentifier(s))).size
  ) {
    throw new Error("Duplicate parameter names detected");
  }

  let sql = "";
  for (const sp1Url of sp1Urls) {
    const parameter = parameterHash[sp1Url];

    const whereable:
      | s.r4_number_idx.Whereable
      | s.r4b_number_idx.Whereable
      | s.r4_date_idx.Whereable
      | s.r4b_date_idx.Whereable
      | s.r4_token_idx.Whereable
      | s.r4b_token_idx.Whereable
      | s.r4_quantity_idx.Whereable
      | s.r4b_quantity_idx.Whereable
      | s.r4_string_idx.Whereable
      | s.r4b_string_idx.Whereable
      | s.r4_uri_idx.Whereable
      | s.r4b_uri_idx.Whereable = {
      parameter_url: parameter.url,
    };

    switch (parameter.type) {
      case "number": {
        const manyTableName = searchParameterToTableName(version, "number");
        const column = getSp1Column(version, "number", parameter.url);
        const numberSQL = db.sql`
        INSERT INTO ${tableName} (${"tenant"}, ${"r_id"}, ${"resource_type"}, ${"r_version_id"}, ${column})
        ( SELECT ${"tenant"}, ${"r_id"}, ${"resource_type"}, ${"r_version_id"}, ${"value"}
          FROM ${manyTableName} 
          WHERE ${whereable})
        ON CONFLICT(${"tenant"}, ${"r_id"}) DO UPDATE SET 
        ${column} = EXCLUDED.${column},
        ${"resource_type"} = EXCLUDED.${"resource_type"};`;

        sql = `${sql}\n ${toSQLString(numberSQL)}`;
        break;
      }
      case "date": {
        const manyTableName = searchParameterToTableName(version, "date");
        const column = getSp1Column(version, "date", parameter.url);
        const numberSQL = db.sql`
        INSERT INTO ${tableName} (${"tenant"}, ${"r_id"}, ${"resource_type"},  ${"r_version_id"}, ${`${column}_start`}, ${`${column}_end`})
        ( SELECT ${"tenant"}, ${"r_id"}, ${"resource_type"}, ${"r_version_id"}, ${"start_date"}, ${"end_date"}
          FROM ${manyTableName} 
          WHERE ${whereable})
        ON CONFLICT(${"tenant"}, ${"r_id"}) DO UPDATE SET
        ${"resource_type"} = EXCLUDED.${"resource_type"},
        ${`${column}_start`} = EXCLUDED.${`${column}_start`}, 
        ${`${column}_end`} = EXCLUDED.${`${column}_end`};`;

        sql = `${sql}\n ${toSQLString(numberSQL)}`;
        break;
      }
      case "quantity": {
        const manyTableName = searchParameterToTableName(version, "quantity");
        const column = getSp1Column(version, "quantity", parameter.url);
        const numberSQL = db.sql`
        INSERT INTO ${tableName} (
          ${"tenant"},
          ${"r_id"}, 
          ${"resource_type"},
          ${"r_version_id"}, 
          ${`${column}_start_system`}, 
          ${`${column}_start_code`}, 
          ${`${column}_start_value`}, 
          ${`${column}_end_system`},
          ${`${column}_end_code`},
          ${`${column}_end_value`}
        )
        ( SELECT 
         ${"tenant"},
         ${"r_id"}, 
         ${"resource_type"},
         ${"r_version_id"}, 
         ${"start_system"}, 
         ${"start_code"},
         ${"start_value"},
         ${"end_system"}, 
         ${"end_code"},
         ${"end_value"} 
          FROM ${manyTableName} 
          WHERE ${whereable})
        ON CONFLICT(${"tenant"}, ${"r_id"}) DO UPDATE SET 
        ${"resource_type"} = EXCLUDED.${"resource_type"},
        ${`${column}_start_system`} = EXCLUDED.${`${column}_start_system`}, 
        ${`${column}_start_code`} =   EXCLUDED.${`${column}_start_code`},
        ${`${column}_start_value`} =  EXCLUDED.${`${column}_start_value`},
        ${`${column}_end_system`} =   EXCLUDED.${`${column}_end_system`}, 
        ${`${column}_end_code`} =     EXCLUDED.${`${column}_end_code`},
        ${`${column}_end_value`} =    EXCLUDED.${`${column}_end_value`};`;

        sql = `${sql}\n ${toSQLString(numberSQL)}`;

        break;
      }
      case "token": {
        const manyTableName = searchParameterToTableName(version, "token");
        const column = getSp1Column(version, "token", parameter.url);
        const numberSQL = db.sql`
        INSERT INTO ${tableName} (${"tenant"}, ${"r_id"}, ${"resource_type"},  ${"r_version_id"}, ${`${column}_system`}, ${`${column}_value`})
        ( SELECT ${"tenant"}, ${"r_id"}, ${"resource_type"},  ${"r_version_id"}, ${"system"}, ${"value"}
          FROM ${manyTableName} 
          WHERE ${whereable})
        ON CONFLICT(${"tenant"}, ${"r_id"}) DO UPDATE SET 
        ${"resource_type"} = EXCLUDED.${"resource_type"},
        ${`${column}_system`} = EXCLUDED.${`${column}_system`}, 
        ${`${column}_value`} = EXCLUDED.${`${column}_value`};`;

        sql = `${sql}\n ${toSQLString(numberSQL)}`;

        break;
      }
      case "string": {
        const manyTableName = searchParameterToTableName(version, "string");
        const column = getSp1Column(version, "string", parameter.url);
        const numberSQL = db.sql`
        INSERT INTO ${tableName} (${"tenant"}, ${"r_id"}, ${"resource_type"}, ${"r_version_id"}, ${column})
        ( SELECT ${"tenant"}, ${"r_id"}, ${"resource_type"}, ${"r_version_id"}, ${"value"}
          FROM ${manyTableName} 
          WHERE ${whereable})
        ON CONFLICT(${"tenant"}, ${"r_id"})
        DO UPDATE SET 
        ${"resource_type"} = EXCLUDED.${"resource_type"},
        ${column} = EXCLUDED.${column};`;

        sql = `${sql}\n ${toSQLString(numberSQL)}`;
        break;
      }
      case "uri": {
        const manyTableName = searchParameterToTableName(version, "uri");
        const column = getSp1Column(version, "uri", parameter.url);
        const numberSQL = db.sql`
        INSERT INTO ${tableName} (${"tenant"}, ${"r_id"}, ${"resource_type"},  ${"r_version_id"}, ${column})
        ( SELECT ${"tenant"}, ${"r_id"}, ${"resource_type"}, ${"r_version_id"}, ${"value"}
          FROM ${manyTableName} 
          WHERE ${whereable})
        ON CONFLICT(${"tenant"}, ${"r_id"}) DO UPDATE SET 
        ${"resource_type"} = EXCLUDED.${"resource_type"},
        ${column} = EXCLUDED.${column};`;

        sql = `${sql}\n ${toSQLString(numberSQL)}`;
        break;
      }
      default: {
        throw new Error(
          `Parameter type not supported to generate table: '${parameter.type}'`,
        );
      }
    }
  }
  return sql;
}

export const generateSP1Sets = async <Version extends FHIR_VERSION>(
  version: Version,
  searchParameters: Resource<Version, "SearchParameter">[],
) => {
  const set = await generateSP1MetaSets(version, searchParameters);
  return set;
};
