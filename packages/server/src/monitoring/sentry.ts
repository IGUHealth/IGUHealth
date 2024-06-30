import * as Sentry from "@sentry/node";
import { stripUrlQueryAndFragment } from "@sentry/utils";
import type Koa from "koa";
import pg from "pg";

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
      new Sentry.Integrations.Postgres({ module: pg }),
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

export async function sentryTransaction<T>(
  dsn: string | undefined,
  transactionContext: Parameters<typeof Sentry.startTransaction>[0],
  body: (transaction: Sentry.Transaction | undefined) => Promise<T>,
): Promise<T> {
  if (!dsn) return body(undefined);
  const transaction = Sentry.startTransaction(transactionContext);
  try {
    const value = await body(transaction);
    return value;
  } finally {
    transaction.finish();
  }
}

export async function sentrySpan<T>(
  transaction: Sentry.Transaction | Sentry.Span | undefined,
  spanContext: Parameters<typeof Sentry.startSpan>[0],
  body: (span: Sentry.Span | undefined) => Promise<T>,
): Promise<T> {
  if (!transaction) return body(undefined);
  const span = transaction.startChild(spanContext);
  try {
    const value = await body(span);
    return value;
  } finally {
    span.finish();
  }
}

// this tracing middleware creates a transaction per request
export function tracingMiddleWare<
  State extends KoaExtensions.IGUHealth,
  Context extends KoaExtensions.DefaultContext,
>(dsn: string | undefined): Koa.Middleware<State, Context> {
  return async (
    ctx: Koa.ParameterizedContext<State, Context>,
    next: Koa.Next,
  ) => {
    if (dsn) {
      const reqMethod = (ctx.method || "").toUpperCase();
      const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);

      // connect to trace of upstream app
      let traceparentData;
      if (ctx.request.get("sentry-trace")) {
        traceparentData = Sentry.extractTraceparentData(
          ctx.request.get("sentry-trace"),
        );
      }

      const transaction = Sentry.startTransaction({
        name: `${reqMethod} ${reqUrl}`,
        op: "http.server",
        ...traceparentData,
      });

      // [FIXME]
      // @ts-ignore
      ctx.__sentry_transaction = transaction;

      // We put the transaction on the scope so users can attach children to it
      Sentry.getCurrentHub().configureScope((scope) => {
        scope.setSpan(transaction);
      });
      ctx.res.on("finish", () => {
        // Push `transaction.finish` to the next event loop so open spans have a chance to finish before the transaction closes
        setImmediate(() => {
          // if using koa router, a nicer way to capture transaction using the matched route
          if (ctx._matchedRoute) {
            const mountPath = ctx.mountPath || "";
            transaction.setName(
              `${reqMethod} ${mountPath}${ctx._matchedRoute}`,
            );
          }
          transaction.setHttpStatus(ctx.status);
          transaction.finish();
        });
      });
    }

    await next();
  };
}
