/* eslint-disable no-console, camelcase, no-unused-vars */
import { strict as assert } from "node:assert";
import * as querystring from "node:querystring";
import * as crypto from "node:crypto";
import { inspect } from "node:util";

import isEmpty from "lodash/isEmpty.js";
import bodyParser from "koa-body";
import Router from "@koa/router";

import * as defaults from "./defaults.js"; // make your own, you'll need it anyway
import Account from "./accounts.js";
import { errors } from "oidc-provider";
import type Provider from "oidc-provider";

const keys = new Set();
const debug = (obj: any) =>
  querystring.stringify(
    Object.entries(obj).reduce(
      (acc: { [key: string]: string }, [key, value]) => {
        keys.add(key);
        if (isEmpty(value)) return acc;
        acc[key] = inspect(value, { depth: null });
        return acc;
      },
      {}
    ),
    "<br/>",
    ": ",
    {
      encodeURIComponent(value) {
        return keys.has(value) ? `<strong>${value}</strong>` : value;
      },
    }
  );

const { SessionNotFound } = errors;

export default (provider: Provider) => {
  const router = new Router();

  const body = bodyParser({
    text: false,
    json: false,
    patchNode: true,
    patchKoa: true,
  });

  router.use(async (ctx, next) => {
    ctx.set("cache-control", "no-store");
    try {
      await next();
    } catch (err) {
      if (err instanceof SessionNotFound) {
        ctx.status = err.status;
        const { message: error, error_description } = err;
        await defaults.renderError(ctx, { error, error_description }, err);
      } else {
        throw err;
      }
    }
  });

  router.get("/interaction/:uid", async (ctx, next) => {
    const { uid, prompt, params, session } = await provider.interactionDetails(
      ctx.req,
      ctx.res
    );
    if (typeof params.client_id !== "string")
      throw new Error("No ClientID found");

    const client = await provider.Client.find(params.client_id);

    switch (prompt.name) {
      case "login": {
        return ctx.render("login", {
          client,
          uid,
          details: prompt.details,
          params,
          title: "Sign-in",
          google: ctx.google,
          session: session ? debug(session) : undefined,
          dbg: {
            params: debug(params),
            prompt: debug(prompt),
          },
        });
      }
      case "consent": {
        return ctx.render("interaction", {
          client,
          uid,
          details: prompt.details,
          params,
          title: "Authorize",
          session: session ? debug(session) : undefined,
          dbg: {
            params: debug(params),
            prompt: debug(prompt),
          },
        });
      }
      default:
        return next();
    }
  });

  // Federation for google
  //   router.get("/interaction/callback/google", (ctx) => {
  //     const nonce = ctx.res.locals.cspNonce;
  //     return ctx.render("repost", { layout: false, upstream: "google", nonce });
  //   });

  router.post("/interaction/:uid/login", body, async (ctx) => {
    const {
      prompt: { name },
    } = await provider.interactionDetails(ctx.req, ctx.res);
    assert.equal(name, "login");

    const account = await Account.findByLogin(ctx.request.body.login);

    const result = {
      login: {
        accountId: account.accountId,
      },
    };

    return provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });
  });

  router.post("/interaction/:uid/federated", body, async (ctx) => {
    const {
      prompt: { name },
    } = await provider.interactionDetails(ctx.req, ctx.res);
    assert.equal(name, "login");

    const path = `/interaction/${ctx.params.uid}/federated`;

    switch (ctx.request.body.upstream) {
      case "google": {
        const callbackParams = ctx.google.callbackParams(ctx.req);

        // init
        if (!Object.keys(callbackParams).length) {
          const state = `${ctx.params.uid}|${crypto
            .randomBytes(32)
            .toString("hex")}`;
          const nonce = crypto.randomBytes(32).toString("hex");

          ctx.cookies.set("google.state", state, { path, sameSite: "strict" });
          ctx.cookies.set("google.nonce", nonce, { path, sameSite: "strict" });

          ctx.status = 303;
          return ctx.redirect(
            ctx.google.authorizationUrl({
              state,
              nonce,
              scope: "openid email profile",
            })
          );
        }

        // callback
        const state = ctx.cookies.get("google.state");
        ctx.cookies.set("google.state", null, { path });
        const nonce = ctx.cookies.get("google.nonce");
        ctx.cookies.set("google.nonce", null, { path });

        const tokenset = await ctx.google.callback(undefined, callbackParams, {
          state,
          nonce,
          response_type: "id_token",
        });
        const account = await Account.findByFederated(
          "google",
          tokenset.claims()
        );

        const result = {
          login: {
            accountId: account.accountId,
          },
        };
        return provider.interactionFinished(ctx.req, ctx.res, result, {
          mergeWithLastSubmission: false,
        });
      }
      default:
        return undefined;
    }
  });

  router.post("/interaction/:uid/confirm", body, async (ctx) => {
    const interactionDetails = await provider.interactionDetails(
      ctx.req,
      ctx.res
    );
    const {
      prompt: { name, details },
      params,
      session,
    } = interactionDetails;
    const { accountId } = session || {};

    assert.equal(name, "consent");

    let { grantId } = interactionDetails;
    let grant;

    if (grantId) {
      // we'll be modifying existing grant in existing session
      grant = await provider.Grant.find(grantId);
    } else {
      // we're establishing a new grant
      if (typeof params.client_id !== "string")
        throw new Error("No ClientID found");
      grant = new provider.Grant({
        accountId,
        clientId: params.client_id,
      });
    }

    if (!grant) throw new Error("grant not found");

    if (details.missingOIDCScope) {
      grant.addOIDCScope((details.missingOIDCScope as string[]).join(" "));
    }
    if (details.missingOIDCClaims) {
      grant.addOIDCClaims(details.missingOIDCClaims as string[]);
    }
    if (details.missingResourceScopes) {
      for (const [indicator, scope] of Object.entries(
        details.missingResourceScopes
      )) {
        grant.addResourceScope(indicator, scope.join(" "));
      }
    }

    grantId = await grant.save();

    const consent: { grantId?: string } = {};

    if (!interactionDetails.grantId) {
      // we don't have to pass grantId to consent, we're just modifying existing one
      consent.grantId = grantId;
    }

    const result = { consent };
    return provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: true,
    });
  });

  router.get("/interaction/:uid/abort", async (ctx) => {
    const result = {
      error: "access_denied",
      error_description: "End-User aborted interaction",
    };

    return provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });
  });

  return router;
};
