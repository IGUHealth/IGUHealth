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
  options: { logging?: boolean } = { logging: false },
): MiddlewareAsync<State, CTX> {
  return async (context) => {
    const [first, ...rest] = middleware;
    context.request.key =
      context.request.key ?? Math.ceil(Math.random() * 10000).toString();
    if (rest[0]) {
      if (options.logging) console.time(`${context.request.key}:${first.name}`);
      const response = await first(context, (req) => {
        return createMiddlewareAsync(rest, options)(req);
      });
      if (options.logging)
        console.timeEnd(`${context.request.key}:${first.name}`);
      return response;
    } else {
      if (options.logging) console.time(`${context.request.key}:${first.name}`);
      const response = await first(context, async (v) => v);
      if (options.logging)
        console.timeEnd(`${context.request.key}:${first.name}`);
      return response;
    }
  };
}
