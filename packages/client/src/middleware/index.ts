import { FHIRRequest, FHIRResponse } from "../types.js";

export type MiddlewareAsync<State, CTX> = (
  request: FHIRRequest,
  args: { ctx: CTX; state: State },
  next?: MiddlewareAsync<State, CTX>
) => Promise<{ ctx: CTX; state: State; response: FHIRResponse }>;

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
