import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

const USER_QUERY_COLS = <const>["email", "first_name", "last_name", "email_verified"];
type USER_RETURN = s.tenant_owners.OnlyCols<typeof USER_QUERY_COLS>;

export async function findManagementUserByEmailPassword(
  client: db.Queryable,
  email: string,
  password: string,
): Promise<USER_RETURN | undefined> {
  const where: s.tenant_owners.Whereable = {
    email: email,
    password: db.sql`${db.self} = crypt(${db.param(password)}, ${db.self})`,
  };
  const user = await db.sql<
    s.tenant_owners.SQL,
    USER_RETURN[]
  >`SELECT ${db.cols(USER_QUERY_COLS)} FROM ${"tenant_owners"} WHERE ${where}`.run(client);

  // Sanity check should never happen given unique check on email.
  if(user.length > 1) throw new Error("Multiple users found with the same email and password");

  return user[0];
}


export async function findManagementUserByEmail(
  client: db.Queryable,
  email: string,
): Promise<USER_RETURN | undefined> {
  const where: s.tenant_owners.Whereable = {
    email: email,
  };
  const user = await db.sql<
    s.tenant_owners.SQL,
    USER_RETURN[]
  >`SELECT ${db.cols(USER_QUERY_COLS)} FROM ${"tenant_owners"} WHERE ${where}`.run(client);

  // Sanity check should never happen given unique check on email.
  if(user.length > 1) throw new Error("Multiple users found with the same email and password");

  return user[0];
}

export async function createManagementUser(user: s.tenant_owners.Insertable, client: db.Queryable) {
  const insertedUser = await db.insert("tenant_owners", user).run(client);
  return insertedUser;
}

/**
 * Update a given user by email (note email is used for the Update query and will not update here).
 * @param client Queryable client
 * @param email email of user to update
 * @param user values to update
 * @returns tenant_owner
 */
export async function updateManagementUser(client: db.Queryable, email: string, values: s.tenant_owners.OnlyCols<["first_name", "last_name", "password"]>): Promise<s.tenant_owners.JSONSelectable> {
   const updatedUser =  await db.update("tenant_owners", values, {email}).run(client);
   return updatedUser[0];
}

