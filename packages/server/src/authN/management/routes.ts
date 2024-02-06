import Router from "@koa/router";
import type * as Koa from "koa";

import { KoaFHIRContext } from "../../fhir/koa.js";

/**
 * Management api for creating tenants and managing tenant owners.
 */
export function createManagementRouter() {
  const managementRouter = new Router<
    Koa.DefaultState,
    KoaFHIRContext<Koa.DefaultContext>
  >({
    prefix: "/management",
  });

  /**
   * Signup a new user with an associated tenant.
   * Need to also validate the user's email.
   */
  managementRouter.post("/signup", async (ctx) => {
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
