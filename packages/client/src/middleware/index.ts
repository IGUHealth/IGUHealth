import { FHIRRequest, FHIRResponse } from "../types/index.js";

export type MiddlewareAsyncChain<State, CTX> = (
  ctx: { state: State; ctx: CTX; request: FHIRRequest },
  next: MiddlewareAsync<State, CTX>,
) => Promise<{
  ctx: CTX;
  state: State;
  response?: FHIRResponse;
  request: FHIRRequest;
}>;

export type MiddlewareAsync<State, CTX> = (ctx: {
  state: State;
  ctx: CTX;
  request: FHIRRequest;
}) => Promise<{
  ctx: CTX;
  state: State;
  response?: FHIRResponse;
  request: FHIRRequest;
}>;

export function createMiddlewareAsync<State, CTX>(
  middleware: MiddlewareAsyncChain<State, CTX>[],
): MiddlewareAsync<State, CTX> {
  return (request) => {
    const [first, ...rest] = middleware;
    if (rest[0]) {
      return first(request, (req) => {
        return createMiddlewareAsync(rest)(req);
      });
    } else {
      return first(request, async (v) => v);
    }
  };
}
