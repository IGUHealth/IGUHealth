import * as s from "zapatos/schema";
import * as db from "zapatos/db";
import { LoginParameters, User } from "./types.js";

export interface UserManagement {
  login<T extends keyof LoginParameters>(
    client: db.Queryable,
    type: T,
    parameters: LoginParameters[T],
  ): Promise<User | undefined>;
  get(client: db.Queryable, id: string): Promise<User | undefined>;
  search(client: db.Queryable, where: s.users.Whereable): Promise<User[]>;
  create(client: db.Queryable, user: s.users.Insertable): Promise<User>;
  update(
    client: db.Queryable,
    id: string,
    update: s.users.Updatable,
  ): Promise<User>;
  delete(client: db.Queryable, where: s.users.Whereable): Promise<void>;
}
