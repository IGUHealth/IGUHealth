import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { AllInteractions, FHIRRequest, FHIRResponse } from "../types/index.js";

export type MiddlewareAsyncChain<
  State,
  CTX,
  Request = FHIRRequest<FHIR_VERSION, AllInteractions>,
  Response = FHIRResponse<FHIR_VERSION, AllInteractions | "error">,
> = (
  ctx: { key?: string; state: State; ctx: CTX; request: Request },
  next: MiddlewareAsync<State, CTX, Request, Response>,
) => Promise<{
  key?: string;
  ctx: CTX;
  state: State;
  response?: Response;
  request: Request;
}>;

export type MiddlewareAsync<
  State,
  CTX,
  Request = FHIRRequest<FHIR_VERSION, AllInteractions>,
  Response = FHIRResponse<FHIR_VERSION, AllInteractions | "error">,
> = (ctx: {
  key?: string;
  state: State;
  ctx: CTX;
  response?: Response;
  request: Request;
}) => Promise<{
  key?: string;
  ctx: CTX;
  state: State;
  response?: Response;
  request: Request;
}>;

export function createMiddlewareAsync<
  State,
  CTX,
  Request = FHIRRequest<FHIR_VERSION, AllInteractions>,
  Response = FHIRResponse<FHIR_VERSION, AllInteractions | "error">,
>(
  middleware: MiddlewareAsyncChain<State, CTX, Request, Response>[],
  options: { logging?: boolean } = { logging: false },
): MiddlewareAsync<State, CTX, Request, Response> {
  return async (context) => {
    const [first, ...rest] = middleware;
    context.key = context.key ?? Math.ceil(Math.random() * 10000).toString();
    if (rest[0]) {
      if (options.logging) console.time(`${context.key}:${first.name}`);
      const response = await first(context, (req) => {
        return createMiddlewareAsync(rest, options)(req);
      });
      if (options.logging) console.timeEnd(`${context.key}:${first.name}`);
      return response;
    } else {
      if (options.logging) console.time(`${context.key}:${first.name}`);
      const response = await first(context, async (ctx) => {
        return ctx;
      });
      if (options.logging) console.timeEnd(`${context.key}:${first.name}`);
      return response;
    }
  };
}
