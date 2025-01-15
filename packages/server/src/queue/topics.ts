import { TenantId } from "@iguhealth/jwt";

export type Topic<T extends TenantId> = `${T}_operations` | `${T}_error`;

export const OPERATIONS_QUEUE = <T extends TenantId>(tenant: T): Topic<T> =>
  `${tenant}_operations`;

export const OPERATION_PATTERN = new RegExp(
  OPERATIONS_QUEUE("(.*)" as TenantId),
);

export const ERROR_QUEUE = <T extends TenantId>(tenant: T): Topic<T> =>
  `${tenant}_error`;
