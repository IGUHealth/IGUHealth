import { ClientApplication, id } from "@iguhealth/fhir-types/r4/types";

import { KoaExtensions } from "../../../fhir-api/types.js";
import { OIDCRouteHandler } from "../index.js";
import * as parseScopes from "../scopes/parse.js";
import { GET_LAUNCH_SESSION_KEY } from "./constants.js";

export function getLaunchContext(
  ctx: Parameters<OIDCRouteHandler>[0],
  clientApplication: ClientApplication,
  type: parseScopes.LaunchTypeScope["launchType"],
): id | undefined {
  const id: id | undefined =
    ctx.session?.[GET_LAUNCH_SESSION_KEY(clientApplication, type)];

  return id;
}

export function setLaunchContext(
  ctx: KoaExtensions.KoaIGUHealthContext,
  clientApplication: ClientApplication,
  type: parseScopes.LaunchTypeScope["launchType"],
  id: id,
): void {
  if (!ctx.session) {
    throw new Error("Session not available");
  }
  ctx.session[GET_LAUNCH_SESSION_KEY(clientApplication, type)] = id;
}

export function deleteLaunchContext(
  ctx: KoaExtensions.KoaIGUHealthContext,
  clientApplication: ClientApplication,
  type: parseScopes.LaunchTypeScope["launchType"],
): void {
  if (!ctx.session) {
    throw new Error("Session not available");
  }
  ctx.session[GET_LAUNCH_SESSION_KEY(clientApplication, type)] = undefined;
}
