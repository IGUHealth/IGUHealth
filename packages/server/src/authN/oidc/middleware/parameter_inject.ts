import * as Koa from "koa";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaContext } from "../../../fhir-api/types.js";
import { getClientId } from "../../utilities.js";

type Parameters = KoaContext.OIDC["oidc"]["parameters"];
type ParameterKey = keyof Parameters;

/**
 * Finds the state parameter from the request. Using either query or body.
 * @param request Koa request
 * @returns
 */
function findParam(request: Koa.Request, parameter: ParameterKey): unknown {
  // ClientID could also come from the basic auth header.
  if (parameter === "client_id") return getClientId(request);

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
export function createValidateInjectOIDCParameters<
  State,
  C extends Koa.DefaultContext & KoaContext.OIDC,
>({
  required,
  optional,
}: {
  required?: ParameterKey[];
  optional?: ParameterKey[];
}): Koa.Middleware<State, KoaContext.FHIR<C>> {
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

    ctx.oidc = {
      ...ctx.oidc,
      parameters: { ...requiredParams },
    };

    await next();
  };
}
