import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { AllInteractions, FHIRRequest, FHIRResponse } from "../types/index.js";

export type MiddlewareContext<
  CTX,
  Request = FHIRRequest<FHIR_VERSION, AllInteractions>,
  Response = FHIRResponse<FHIR_VERSION, AllInteractions | "error">,
> = {
  key?: string;
  ctx: CTX;
  request: Request;
  response?: Response;
};

export type MiddlewareAsyncChain<
  State,
  CTX,
  Request = FHIRRequest<FHIR_VERSION, AllInteractions>,
  Response = FHIRResponse<FHIR_VERSION, AllInteractions | "error">,
> = (
  state: State,
  ctx: MiddlewareContext<CTX, Request, Response>,
  next: Next<State, CTX, Request, Response>,
) => Promise<[State, MiddlewareContext<CTX, Request, Response>]>;

type Next<
  State,
  CTX,
  Request = FHIRRequest<FHIR_VERSION, AllInteractions>,
  Response = FHIRResponse<FHIR_VERSION, AllInteractions | "error">,
> = (
  state: State,
  context: MiddlewareContext<CTX, Request, Response>,
) => Promise<[State, MiddlewareContext<CTX, Request, Response>]>;

export type MiddlewareAsync<
  CTX,
  Request = FHIRRequest<FHIR_VERSION, AllInteractions>,
  Response = FHIRResponse<FHIR_VERSION, AllInteractions | "error">,
> = (
  ctx: MiddlewareContext<CTX, Request, Response>,
) => Promise<MiddlewareContext<CTX, Request, Response>>;

function createNext<
  State,
  CTX,
  Request = FHIRRequest<FHIR_VERSION, AllInteractions>,
  Response = FHIRResponse<FHIR_VERSION, AllInteractions | "error">,
>(
  middlewareChain: MiddlewareAsyncChain<State, CTX, Request, Response>[],
  options: { logging?: boolean } = { logging: false },
): Next<State, CTX, Request, Response> {
  const [first, ...rest] = middlewareChain;

  if (first) {
    return async (state, context) => {
      if (options.logging) console.time(`${context.key}:${first.name}`);
      const response = await first(state, context, createNext(rest));
      if (options.logging) console.timeEnd(`${context.key}:${first.name}`);
      return response;
    };
  } else {
    // placeholder.
    return async (state, context) => {
      return [state, context];
    };
  }
}

export function createMiddlewareAsync<
  State,
  CTX,
  Request = FHIRRequest<FHIR_VERSION, AllInteractions>,
  Response = FHIRResponse<FHIR_VERSION, AllInteractions | "error">,
>(
  _state: State,
  middlewareChain: MiddlewareAsyncChain<State, CTX, Request, Response>[],
  options: { logging?: boolean } = { logging: false },
): MiddlewareAsync<CTX, Request, Response> {
  let state = _state;

  return async (context) => {
    const [first, ...rest] = middlewareChain;
    context.key = context.key ?? Math.ceil(Math.random() * 10000).toString();

    if (options.logging) console.time(`${context.key}:${first.name}`);

    const [nextState, response] = await first(
      state,
      context,
      createNext(rest, options),
    );
    state = nextState;

    if (options.logging) console.timeEnd(`${context.key}:${first.name}`);
    return response;
  };
}
