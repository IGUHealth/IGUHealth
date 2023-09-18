import { FHIRRequest, FHIRResponse } from "../types.js";

export type MiddlewareAsync<State, CTX> = (
  request: FHIRRequest,
  args: { ctx: CTX; state: State },
  next?: MiddlewareAsync<State, CTX>
) => Promise<{ ctx: CTX; state: State; response: FHIRResponse }>;

export type MiddlewareSync<State, CTX> = (
  request: FHIRRequest,
  args: { ctx: CTX; state: State },
  next?: MiddlewareSync<State, CTX>
) => { ctx: CTX; state: State; response: FHIRResponse };

export function createMiddlewareSync<State, CTX>(
  middleware: MiddlewareSync<State, CTX>[]
): MiddlewareSync<State, CTX> {
  return (request, args) => {
    const [first, ...rest] = middleware;
    if (rest[0]) {
      return first(request, args, (req, arg) => {
        return createMiddlewareSync(rest)(req, arg);
      });
    } else {
      return first(request, args);
    }
  };
}

export function createMiddlewareAsync<State, CTX>(
  middleware: MiddlewareAsync<State, CTX>[]
): MiddlewareAsync<State, CTX> {
  return (request, args) => {
    const [first, ...rest] = middleware;
    if (rest[0]) {
      return first(request, args, (req, arg) => {
        return createMiddlewareAsync(rest)(req, arg);
      });
    } else {
      return first(request, args);
    }
  };
}
