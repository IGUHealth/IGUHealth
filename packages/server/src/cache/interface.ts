export interface IOCache<CTX extends { workspace: string }> {
  get(ctx: CTX, key: string): Promise<string | number | null>;
  set(ctx: CTX, key: string, value: string | number): Promise<void>;
}
