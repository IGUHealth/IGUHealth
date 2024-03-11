import * as db from "zapatos/db";
import * as s from "zapatos/schema";

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
    client: db.Queryable,
    type: T,
    parameters: LoginParameters[T],
  ): Promise<User | undefined>;
  getTenantUsers(client: db.Queryable, id: string): Promise<User[]>;
}
