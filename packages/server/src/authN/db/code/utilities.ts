import * as db from "zapatos/db";
import * as s from "zapatos/schema";

/**
 * SQL eval that returns true if the code has expired.
 * Generally used in extras parameter for select queries.
 */
export const is_expired = db.sql<
  s.authorization_code.SQL,
  boolean
>`NOW() > ${"created_at"} + ${"expires_in"}`;
