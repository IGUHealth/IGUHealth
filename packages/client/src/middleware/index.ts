import { FHIRRequest, FHIRResponse } from "../types/index.js";

type MiddlewareContext<State, CTX, Request, Response> = {
  key?: string;
  state: State;
  ctx: CTX;
  response?: Response;
  request: Request;
};

export type MiddlewareAsyncChain<
  State,
  CTX,
  Request = FHIRRequest,
  Response = FHIRResponse,
> = (
  ctx: { key?: string; state: State; ctx: CTX; request: Request },
  next: MiddlewareAsync<State, CTX, Request, Response>,
) => Promise<MiddlewareContext<State, CTX, Request, Response>>;

export type MiddlewareAsync<
  State,
  CTX,
  Request = FHIRRequest,
  Response = FHIRResponse,
> = (
  ctx: MiddlewareContext<State, CTX, Request, Response>,
) => Promise<MiddlewareContext<State, CTX, Request, Response>>;

export function createMiddlewareAsync<
  State,
  CTX,
  Request = FHIRRequest,
  Response = FHIRResponse,
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
