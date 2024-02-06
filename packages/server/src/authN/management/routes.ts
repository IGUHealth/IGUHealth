import Router from "@koa/router";
import type * as Koa from "koa";

import { KoaFHIRContext } from "../../fhir/koa.js";

/**
 * Management api for creating tenants and managing tenant owners.
 */
export function createManagementRouter(prefix: string) {
  const managementRouter = new Router<
    Koa.DefaultState,
    KoaFHIRContext<Koa.DefaultContext>
  >({
    prefix,
  });

  /**
   * Signup a new user with an associated tenant.
   * Need to also validate the user's email.
   */
  managementRouter.post("/user/signup", async (ctx) => {
    try {
      // const tenant = await createTenant(client, ctx.request.body);
      // ctx.body = tenant;
      ctx.status = 201;
    } catch (e) {
      ctx.body = e;
      ctx.status = 500;
    } finally {
      //client.release();
    }
  });

  /**
   * Signup a new user with an associated tenant.
   * Need to also validate the user's email.
   */
  managementRouter.post("/user/login", async (ctx) => {
    try {
      // const tenant = await createTenant(client, ctx.request.body);
      // ctx.body = tenant;
      ctx.status = 201;
    } catch (e) {
      ctx.body = e;
      ctx.status = 500;
    } finally {
      //client.release();
    }
  });

  return managementRouter;
}
