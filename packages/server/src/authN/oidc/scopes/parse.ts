import * as r4Sets from "@iguhealth/fhir-types/r4/sets";
import { id } from "@iguhealth/fhir-types/r4/types";
import * as r4bSets from "@iguhealth/fhir-types/r4b/sets";

import { OIDCError } from "../middleware/oauth_error_handling.js";

export type OIDCScope = {
  type: "openid" | "profile" | "email" | "offline_access" | "online_access";
};

export type LaunchScope = {
  type: "launch";
};

export type LaunchTypeScope = {
  type: "launch-type";
  launchType: "encounter" | "patient";
};

export type SMARTResourceScope = {
  type: "smart-resource";
  level: "user" | "system" | "patient";
  scope: "resource" | "all";
  resourceType?: string;
  permissions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    search: boolean;
  };
};

type SMARTScope =
  | SMARTResourceScope
  | LaunchTypeScope
  | LaunchScope
  | {
      type: "fhirUser";
    };

export type Scope = OIDCScope | SMARTScope;

/**
 * Validates a resource type from scope.
 * @param type some chunk from scope
 * @returns boolean if the resource type is valid.
 */
function validateResourceType(type: string): boolean {
  return r4Sets.resourceTypes.has(type) || r4bSets.resourceTypes.has(type);
}

function parsePermissions(methods: string): {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  search: boolean;
} {
  switch (methods) {
    // Perm v1 which are conveted to v2 scopes.
    case "*": {
      return {
        create: true,
        read: true,
        update: true,
        delete: true,
        search: true,
      };
    }
    case "write": {
      return {
        create: true,
        update: true,
        delete: true,
        read: false,
        search: false,
      };
    }
    case "read": {
      return {
        read: true,
        search: true,
        create: false,
        update: false,
        delete: false,
      };
    }
    default: {
      const methodsObj = {
        create: false,
        read: false,
        update: false,
        delete: false,
        search: false,
      };
      // Scope requests with undefined or out of order interactions MAY be ignored, replaced with server default scopes, or rejected.
      // per [https://build.fhir.org/ig/HL7/smart-app-launch/scopes-and-launch-context.html#scopes-for-requesting-fhir-resources].
      let loc = -1;
      const order = ["c", "r", "u", "d", "s"];
      for (const method of methods.split("")) {
        // ----------------------------------------------------------------------------------------
        // See above verifying ordering is correct so as to disallow dus which is out of order.
        if (order.indexOf(method) <= loc) {
          throw new OIDCError({
            error: "invalid_scope",
            error_description: `Invalid scope access type methods: '${methods}' not supported.`,
          });
        }
        loc = order.indexOf(method);
        // ----------------------------------------------------------------------------------------

        switch (method) {
          /**
           * Type level create
           */
          case "c": {
            methodsObj.create = true;
            break;
          }
          /**
           * Instance level read
           * Instance level vread
           * Instance level history
           */
          case "r": {
            methodsObj.read = true;
            break;
          }
          /**
           * Instance level update Note that some servers allow for an update operation to create a new instance,
           * and this is allowed by the update scope
           * Instance level patch
           */
          case "u": {
            methodsObj.update = true;
            break;
          }
          /**
           * Instance level delete
           */
          case "d": {
            methodsObj.delete = true;
            break;
          }
          /**
           * Type level search
           * Type level history
           * System level search
           * System level history
           */
          case "s": {
            methodsObj.search = true;
            break;
          }
          default: {
            throw new OIDCError({
              error: "invalid_scope",
              error_description: `Invalid scope access type methods: '${methods}' not supported.`,
            });
          }
        }
      }
      return methodsObj;
    }
  }
}

function isOIDCScope(
  scope: string,
): scope is
  | "openid"
  | "profile"
  | "email"
  | "offline_access"
  | "online_access" {
  return [
    "openid",
    "profile",
    "email",
    "offline_access",
    "online_access",
  ].includes(scope);
}

function validateSmartResourceLevel(
  level: string,
): level is "user" | "system" | "patient" {
  return ["user", "system", "patient"].includes(level);
}

/**
 * Launch scopes are parsed into sep rec without launch/ prefix
 * This converts them back to query parameters for the redirect.
 * @param launchScopes The launch scopes to derive query parameters.
 * @returns
 */
export function launchScopesToQuery(
  launchScopes: Record<string, id> | undefined,
): Record<string, string> {
  return Object.entries(launchScopes ?? {}).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`launch/${key}`]: value,
    }),
    {},
  );
}

export function parseScopes(scopes: string): Scope[] {
  return scopes
    .split(/\s/)
    .filter((scope) => scope !== "")
    .map((scope): Scope => {
      switch (true) {
        case isOIDCScope(scope): {
          return { type: scope };
        }
        case scope === "fhirUser": {
          return { type: scope };
        }
        case scope === "launch": {
          return { type: "launch" };
        }
        case scope.startsWith("launch"): {
          const chunks = scope.split("/");
          switch (chunks[1]) {
            case "patient":
            case "encounter": {
              return { type: "launch-type", launchType: chunks[1] };
            }
            default: {
              throw new OIDCError({
                error: "invalid_scope",
                error_description: `Invalid scope: '${scope}'.`,
              });
            }
          }
        }
        case scope.startsWith("user/"):
        case scope.startsWith("system/"):
        case scope.startsWith("patient/"): {
          const [level, permissionString] = scope.split("/");
          if (!permissionString) {
            throw new OIDCError({
              error: "invalid_scope",
              error_description: `Invalid scope: '${scope}'.`,
            });
          }
          if (!validateSmartResourceLevel(level)) {
            throw new OIDCError({
              error: "invalid_scope",
              error_description: `Invalid scope: '${scope}'.`,
            });
          }

          const permissions = permissionString.split(".");
          if (permissions.length !== 2) {
            throw new OIDCError({
              error: "invalid_scope",
              error_description: `Invalid scope: '${scope}'.`,
            });
          }

          const [resourceType, methods] = permissions;

          switch (true) {
            case resourceType === "*": {
              return {
                type: "smart-resource",
                level,
                scope: "all",
                permissions: parsePermissions(methods),
              };
            }
            case validateResourceType(resourceType): {
              return {
                type: "smart-resource",
                level,
                scope: "resource",
                resourceType,
                permissions: parsePermissions(methods),
              };
            }
            default: {
              throw new OIDCError({
                error: "invalid_scope",
                error_description: `Invalid scope: '${scope}'.`,
              });
            }
          }
        }
        default: {
          throw new OIDCError({
            error: "invalid_scope",
            error_description: `Invalid scope: '${scope}' not supported.`,
          });
        }
      }
    });
}

function scopeToString(scope: Scope): string {
  switch (scope.type) {
    case "online_access":
    case "offline_access":
    case "openid":
    case "profile":
    case "fhirUser":
    case "email": {
      return scope.type;
    }

    case "launch-type": {
      return `launch/${scope.launchType}`;
    }
    case "launch": {
      return `launch`;
    }
    case "smart-resource": {
      return `${scope.level}/${scope.scope === "all" ? "*" : scope.resourceType}.${scope.permissions.create ? "c" : ""}${scope.permissions.read ? "r" : ""}${scope.permissions.update ? "u" : ""}${scope.permissions.delete ? "d" : ""}${scope.permissions.search ? "s" : ""}`;
    }
  }
}

export function toString(scopes: Scope[]): string {
  return scopes.map(scopeToString).join(" ");
}
