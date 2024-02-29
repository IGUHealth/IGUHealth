import * as s from "zapatos/schema";
import * as db from "zapatos/db";

import { LoginParameters, User } from "./types.js";
import { ModelManagement } from "../interface.js";

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
}
