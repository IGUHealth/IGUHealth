import Router from "@koa/router";
import type * as Koa from "koa";

import { KoaFHIRServicesContext } from "../../fhir/koa.js";

/**
 * Management api for creating tenants and managing tenant owners.
 */
export function createManagementRouter(prefix: string) {
  const managementRouter = new Router<
    Koa.DefaultState,
    KoaFHIRServicesContext<Koa.DefaultContext>
  >({
    prefix,
  });

  /**
   * Quick test to see if the management router is working.
   */
  managementRouter.get("/test", async (ctx) => {
    ctx.body = "HELLO WORLD";
    ctx.status = 200;
  });

  /**
   * Signup a new user with an associated tenant.
   * Need to also validate the user's email.
   */
  managementRouter.post("/user/signup", async (ctx) => {
    try {
      ctx.status = 201;
    } catch (e) {
      ctx.status = 500;
    } finally {
      // console.log()
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
      ctx.status = 500;
    } finally {
      // console.log()
    }
  });

  return managementRouter;
}
