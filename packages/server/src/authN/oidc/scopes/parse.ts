import * as r4Sets from "@iguhealth/fhir-types/r4/sets";
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
  if (methods === "*") {
    return {
      create: true,
      read: true,
      update: true,
      delete: true,
      search: true,
    };
  }

  const methodsObj = {
    create: false,
    read: false,
    update: false,
    delete: false,
    search: false,
  };
  for (const method of methods.split("")) {
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

export function toString(scopes: Scope[]): string {
  return scopes
    .reduce((scopeString, scope: Scope) => {
      switch (scope.type) {
        case "online_access":
        case "offline_access":
        case "openid":
        case "profile":
        case "email": {
          return `${scopeString} ${scope.type}`;
        }
        case "fhirUser": {
          return `${scopeString} fhirUser`;
        }
        case "launch-type": {
          return `${scopeString} launch/${scope.launchType}`;
        }
        case "launch": {
          return `${scopeString} launch`;
        }
        case "smart-resource": {
          return `${scopeString} ${scope.level}/${scope.scope === "all" ? "*" : scope.resourceType}.${scope.permissions.create ? "c" : ""}${scope.permissions.read ? "r" : ""}${scope.permissions.update ? "u" : ""}${scope.permissions.delete ? "d" : ""}${scope.permissions.search ? "s" : ""}`;
        }
      }
    }, "")
    .slice(1);
}
