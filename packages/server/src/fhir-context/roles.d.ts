/**
 * Role Bypasses authorization middleware.
 */
export type SUPER_ADMIN_ROLE = "SUPER_ADMIN";

/**
 * Standard Role that goes through all authorization middleware.
 */
export type USER_ROLE = "USER";

/**
 * All roles available.
 */
export type ROLE = USER_ROLE | SUPER_ADMIN_ROLE;
