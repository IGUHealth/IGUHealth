import * as Koa from "koa";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaFHIRContext, OIDCKoaContext } from "../../../fhir-context/koa.js";
import { getClientId } from "../../utilities.js";

type Parameters = OIDCKoaContext<unknown>["oidc"]["parameters"];
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

function isValidParam(_param: ParameterKey, value: unknown): value is string {
  if (typeof value !== "string") return false;
  return true;
}

/**
 * Middleware that finds+validates and injects oidc parameters.
 * @returns Koa.Middleware
 */
export function createValidateInjectOIDCParameters<
  State,
  C extends Koa.DefaultContext,
>(parameters: ParameterKey[]): Koa.Middleware<State, KoaFHIRContext<C>> {
  return async (ctx, next) => {
    ctx.oidc = {
      ...ctx.oidc,
      parameters: parameters.reduce((acc, param) => {
        const value = findParam(ctx.request, param);
        if (!value) {
          throw new OperationError(
            outcomeError("invalid", `'${param}' parameter must be present.`),
          );
        }
        if (!isValidParam(param, value)) {
          throw new OperationError(
            outcomeError("invalid", `Invalid '${param}' parameter.`),
          );
        }

        return { ...acc, [param]: value };
      }, {}),
    };

    await next();
  };
}
