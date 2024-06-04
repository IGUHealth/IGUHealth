/**
 * Global login is to redirect user to their tenant login page.
 * To do this filter to see what tenants a user is a member of display tenant select screen if multiple
 * If none redirect to signup page.
 */

import { ManagementRouteHandler } from "../../oidc/index.js";

const loginGET = (): ManagementRouteHandler => async (ctx) => {};
