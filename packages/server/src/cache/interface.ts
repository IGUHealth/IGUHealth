import type { TenantId } from "../fhir/context.js";

export interface IOCache<CTX extends { tenant: TenantId }> {
  get(ctx: CTX, key: string): Promise<string | number | null>;
  set(ctx: CTX, key: string, value: string | number): Promise<void>;
}
