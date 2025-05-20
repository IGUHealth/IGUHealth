import Ajv from "ajv";
import dotEnv from "dotenv";

import type { ConfigSchema } from "./json-schemas/schemas/config.schema.js";
import IGUHealthEnvironmentSchema from "./json-schemas/schemas/config.schema.json" with { type: "json" };

export default function loadEnv() {
  dotEnv.config();
  const ajv = new Ajv.default({});
  const environmentValidator = ajv.compile(IGUHealthEnvironmentSchema);
  const envValid = environmentValidator(process.env);
  if (!envValid) throw new Error(ajv.errorsText(environmentValidator.errors));
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ConfigSchema {
      [k: string]: unknown;
    }
  }
}
