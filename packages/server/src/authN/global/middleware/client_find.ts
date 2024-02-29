import * as Koa from "koa";

import { ClientApplication } from "@iguhealth/fhir-types/r4/types";
import { id } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaContext, asSystemCTX } from "../../../fhir-context/types.js";

// /**
//  * Creates koa middleware that injects the current ClientApplication under ctx.oidc.client.
//  * Used in subsequent oidc routes.
//  * @returns Koa.Middleware
//  */
// export function clientTenantInjectMiddleware<State, Context>(): Koa.Middleware<
//   State,
//   Context & KoaContext.OIDC
// > {
//   return async (ctx, next) => {
//     const clientId = ctx.oidc.parameters.client_id;

//     switch (clientId) {
//       case "iguhealth-admin-app": {
//         ctx.oidc = { ...ctx.oidc, client };
//         break;
//       }
//       case "iguhealth-tenant-app": {
//         ctx.oidc = { ...ctx.oidc, client };
//         break;
//       }
//       default: {
//         throw new OperationError();
//       }
//     }

//     ctx.oidc = { ...ctx.oidc, client };

//     await next();
//   };
// }
