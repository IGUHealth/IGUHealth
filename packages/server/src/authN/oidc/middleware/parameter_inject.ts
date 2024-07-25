import * as Koa from "koa";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaExtensions } from "../../../fhir-api/types.js";

type Parameters = KoaExtensions.OIDC["oidc"]["parameters"];
type ParameterKey = keyof Parameters;

/**
 * Finds the state parameter from the request. Using either query or body.
 * @param request Koa request
 * @returns
 */
function findParam(request: Koa.Request, parameter: ParameterKey): unknown {
  const value =
    request.query[parameter] ||
    (request.body as Record<string, unknown>)?.[parameter];

  return value;
}

function isValidParam(param: ParameterKey, value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (param === "response_type" && !["code", "token"].includes(value))
    return false;
  return true;
}

/**
 * Middleware that finds+validates and injects oidc parameters.
 * @returns Koa.Middleware
 */
export function createValidateInjectOIDCParameters({
  required,
  optional,
}: {
  required?: ParameterKey[];
  optional?: ParameterKey[];
}): Koa.Middleware<KoaExtensions.IGUHealth, KoaExtensions.KoaIGUHealthContext> {
  return async (ctx, next) => {
    const params = [
      ...(required ?? []).map((p) => ({ required: true, param: p })),
      ...(optional ?? []).map((p) => ({ required: false, param: p })),
    ];
    const requiredParams = params.reduce((acc, { required, param }) => {
      const value = findParam(ctx.request, param);
      if (!value) {
        if (required)
          throw new OperationError(
            outcomeError("invalid", `'${param}' parameter must be present.`),
          );
        else return acc;
      }
      if (!isValidParam(param, value)) {
        throw new OperationError(
          outcomeError("invalid", `Invalid '${param}' parameter.`),
        );
      }

      return { ...acc, [param]: value };
    }, {});

    ctx.state.oidc = {
      ...ctx.state.oidc,
      parameters: { ...requiredParams },
    };

    await next();
  };
}
