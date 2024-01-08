import type { Tenant } from "../fhir/context.js";

export interface IOCache<CTX extends { tenant: Tenant }> {
  get(ctx: CTX, key: string): Promise<string | number | null>;
  set(ctx: CTX, key: string, value: string | number): Promise<void>;
}
