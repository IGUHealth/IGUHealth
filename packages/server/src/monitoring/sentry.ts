import type Koa from "koa";
import pg from "pg";
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import { stripUrlQueryAndFragment } from "@sentry/utils";

export function enableSentry(
  sentryDSN: string,
  release: string,
  debug = false
) {
  Sentry.init({
    dsn: sentryDSN,
    integrations: [
      // Automatically instrument Node.js libraries and frameworks
      new Sentry.Integrations.Postgres({ module: pg }),
      new ProfilingIntegration(),
    ],
    debug,
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });
}

export function disableSentry() {
  Sentry.close();
}

export const logError = (err: unknown, ctx: Koa.DefaultContext) => {
  Sentry.withScope((scope) => {
    scope.addEventProcessor((event) => {
      return Sentry.addRequestDataToEvent(event, ctx.request);
    });
    Sentry.captureException(err);
  });
};

export const onKoaError = (err: unknown, ctx: Koa.DefaultContext) => {
  logError(err, ctx);
};

// this tracing middleware creates a transaction per request
export const tracingMiddleWare =
  (dsn: string | undefined) =>
  async (ctx: Koa.DefaultContext, next: Koa.Next) => {
    if (dsn) {
      const reqMethod = (ctx.method || "").toUpperCase();
      const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);

      // connect to trace of upstream app
      let traceparentData;
      if (ctx.request.get("sentry-trace")) {
        traceparentData = Sentry.extractTraceparentData(
          ctx.request.get("sentry-trace")
        );
      }

      const transaction = Sentry.startTransaction({
        name: `${reqMethod} ${reqUrl}`,
        op: "http.server",
        ...traceparentData,
      });

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
              `${reqMethod} ${mountPath}${ctx._matchedRoute}`
            );
          }
          transaction.setHttpStatus(ctx.status);
          transaction.finish();
        });
      });
    }

    await next();
  };
