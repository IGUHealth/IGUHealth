import Ajv from "ajv";
import dotEnv from "dotenv";

import type { IGUHealthEnvironment } from "./json-schemas/schemas/environment.schema.js";
import IGUHealthEnvironmentSchema from "./json-schemas/schemas/environment.schema.json" with { type: "json" };

export default function loadEnv() {
  dotEnv.config();
  const ajv = new Ajv.default({});
  const environmentValidator = ajv.compile(IGUHealthEnvironmentSchema);
  const envValid = environmentValidator(process.env);
  if (!envValid) throw new Error(ajv.errorsText(environmentValidator.errors));
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IGUHealthEnvironment {}
  }
}
