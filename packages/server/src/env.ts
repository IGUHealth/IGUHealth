import Ajv from "ajv";
import dotEnv from "dotenv";

import type { IGUHealthEnvironment } from "./json-schemas/schemas/environment.schema.js";

export default function loadEnv(schema: object) {
  dotEnv.config();
  const ajv = new Ajv.default({});
  const environmentValidator = ajv.compile(schema);
  const envValid = environmentValidator(process.env);
  if (!envValid) throw new Error(ajv.errorsText(environmentValidator.errors));
}

export function getEnvironment<Environment, K extends keyof Environment>(
  env: Environment,
  k: K,
): Environment[K] {
  return (env as Environment)[k] as Environment[K];
}
