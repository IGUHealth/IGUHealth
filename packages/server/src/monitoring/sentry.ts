import { stripUrlQueryAndFragment } from "@sentry/core";
import * as Sentry from "@sentry/node";
import type Koa from "koa";

import { KoaExtensions } from "../fhir-api/types.js";

export function enableSentry(
  sentryDSN: string,
  release: string,
  options: Partial<Sentry.NodeOptions> = {},
) {
  Sentry.init({
    dsn: sentryDSN,
    release,
    integrations: [
      // Automatically instrument Node.js libraries and frameworks
      Sentry.postgresIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
    ...options,
  });
}

export function disableSentry() {
  Sentry.close();
}

export const logError = (err: unknown) => {
  Sentry.withScope((_scope) => {
    Sentry.captureException(err);
  });
};

export const onKoaError = (err: unknown) => {
  logError(err);
};

// this tracing middleware creates a transaction per request
export function tracingMiddleWare<
  State extends KoaExtensions.IGUHealth,
  Context extends KoaExtensions.KoaIGUHealthContext,
>(dsn: string | undefined): Koa.Middleware<State, Context> {
  return async (
    ctx: Koa.ParameterizedContext<State, Context>,
    next: Koa.Next,
  ) => {
    if (dsn) {
      const reqMethod = (ctx.method || "").toUpperCase();
      const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);

      await Sentry.startSpan(
        {
          name: `${reqMethod} ${reqUrl}`,
          op: "http.server",
        },
        async (_span) => {
          return next();
        },
      );
    }
  };
}
