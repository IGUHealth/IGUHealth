import * as inquirer from "@inquirer/prompts";
import { Command } from "commander";
import validator from "validator";
import * as db from "zapatos/db";

import { Membership, code } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import { TenantManagement } from "../authN/db/tenant.js";
import TenantUserManagement from "../authN/db/users/index.js";
import { createFHIRServices } from "../fhir-api/index.js";
import { FHIRServerCTX, asSystemCTX } from "../fhir-api/types.js";
import { createPGPool } from "../fhir-storage/providers/postgres/pg.js";
import { FHIRTransaction } from "../fhir-storage/transactions.js";

async function createTenant(ctx: Omit<FHIRServerCTX, "tenant" | "user">) {
  return await FHIRTransaction(
    ctx,
    db.IsolationLevel.Serializable,
    async (ctx) => {
      const tenantManagement = new TenantManagement();

      const tiers = await db.select("subscription_tier", {}).run(ctx.db);

      const subtier = await inquirer.select({
        message: "Select tenant tier",
        default: tiers[2].id,
        choices: tiers.map((t) => ({
          name: t.name,
          value: t.id,
        })),
      });

      const tenant = await tenantManagement.create(ctx, {
        subscription_tier: subtier,
      });

      const email = await inquirer.input({
        message: "Enter root user email.",
        validate: (input) => {
          return validator.isEmail(input);
        },
      });

      const password = await inquirer.password({
        message: "Enter root user password.",
        // validate: (input) => {
        //   return validator.isStrongPassword(input);
        // },
      });

      const membership: Membership = await ctx.client.create(
        asSystemCTX({ ...ctx, tenant: tenant.id as TenantId }),
        R4,
        { resourceType: "Membership", email, role: "owner" as code },
      );

      const userManagement = new TenantUserManagement(tenant.id as TenantId);

      const user = await userManagement.search(ctx, {
        fhir_user_id: membership.id as string,
      });

      await userManagement.update(ctx, user[0].id, {
        ...user[0],
        password,
        email_verified: true,
      });

      console.log(`Tenant created with id: '${tenant.id}'`);
      console.log(`User created with email: '${user[0].email}'`);
    },
  );
}

function tenantCommands(command: Command) {
  command
    .command("create")
    .description("Create a new tenant.")
    .action(async () => {
      const pool = createPGPool();
      const services = await createFHIRServices(pool);
      await createTenant(services);

      process.exit(0);
    });
}

export function adminCommands(command: Command) {
  tenantCommands(command.command("tenant"));
}
