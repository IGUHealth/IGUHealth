import { TenantId } from "@iguhealth/jwt";

import { Message } from "../types.js";

export function getTenantId(message: Message): TenantId {
  const tenantId = message.headers?.tenant?.toString() as TenantId | undefined;

  if (!tenantId) {
    throw new Error("Tenant ID not found in message headers");
  }

  return tenantId;
}
