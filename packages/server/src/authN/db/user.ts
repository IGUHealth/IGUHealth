import { nanoid } from "nanoid";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";


const USER_QUERY_COLS = <const>["id", "email", "first_name", "last_name", "email_verified"];
export type User = s.users.OnlyCols<typeof USER_QUERY_COLS>;


export async function login(
  client: db.Queryable,
  scope: s.users.Selectable["scope"],
  email: string,
  password: string,

): Promise<User | undefined> {
  const where: s.users.Whereable = {
    email: email,
    password: db.sql`${db.self} = crypt(${db.param(password)}, ${db.self})`,
    scope,
  };
  const user = await db.sql<
    s.users.SQL,
    User[]
  >`SELECT ${db.cols(USER_QUERY_COLS)} FROM ${"users"} WHERE ${where}`.run(client);

  // Sanity check should never happen given unique check on email.
  if(user.length > 1) throw new Error("Multiple users found with the same email and password");

  return user[0];
}


export async function findUserByEmail(
  client: db.Queryable,
  email: string,
): Promise<User | undefined> {
  const where: s.users.Whereable = {
    email: email,
  };
  const user = await db.sql<
    s.users.SQL,
    User[]
  >`SELECT ${db.cols(USER_QUERY_COLS)} FROM ${"users"} WHERE ${where}`.run(client);

  // Sanity check should never happen given unique check on email.
  if(user.length > 1) throw new Error("Multiple users found with the same email.");

  return user[0];
}

/**
 * Update a given user by email (note email is used for the Update query and will not update here).
 * @param client Queryable client
 * @param email email of user to update
 * @param user values to update
 * @returns users
 */
export async function updateUser(client: db.Queryable, email: string, values: s.users.OnlyCols<["first_name", "last_name", "password"]>): Promise<s.users.JSONSelectable> {
   const updatedUser =  await db.update("users", values, {email}).run(client);
   return updatedUser[0];
}

/**
 * Creates a new user + tenant and associates user to tenant as owner within a transaction.
 * @param client Queryable postgres instance
 * @param email New users email
 * @returns Newly created user object.
 */
export async function createUser(client: db.Queryable, email: string): Promise<s.users.JSONSelectable> {
  return await db.serializable(client, async (txnClient) => {
    const tenant = await db
      .insert("tenants", {
        id: nanoid(),
        tenant: {
          id: nanoid(),
          name: "Default",
        },
      })
      .run(txnClient);

    const user = await db
      .insert("users", {
        scope: "global",
        email: email,
        email_verified: false,
      })
      .run(txnClient);

    await db
      .insert("users", {
        scope: "tenant",
        role: "owner",
        tenant: tenant.id,
        email: user.email,
        root_user: user.id,
      })
      .run(txnClient);

    return user;
  });
}
