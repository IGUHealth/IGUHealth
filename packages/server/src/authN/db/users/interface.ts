import * as s from "zapatos/schema";

import { TenantClaim } from "@iguhealth/jwt";

import { KoaState } from "../../../fhir-api/types.js";
import { ModelManagement } from "../interface.js";
import { LoginParameters, User } from "./types.js";

export interface UserManagement
  extends ModelManagement<
    User,
    s.users.Whereable,
    s.users.Insertable,
    s.users.Updatable
  > {
  login<T extends keyof LoginParameters>(
    ctx: KoaState.IGUHealthServices["iguhealth"],
    type: T,
    parameters: LoginParameters[T],
  ): Promise<User | undefined>;
  getTenantClaims(
    ctx: KoaState.IGUHealthServices["iguhealth"],
    id: string,
  ): Promise<TenantClaim<s.user_role>[]>;
}
