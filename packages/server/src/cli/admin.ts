import * as inquirer from "@inquirer/prompts";
import { Command } from "commander";
import validator from "validator";
import * as db from "zapatos/db";

import {
  AccessPolicy,
  Bundle,
  ClientApplication,
  Membership,
  code,
} from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import { TenantManagement } from "../authN/db/tenant.js";
import TenantUserManagement from "../authN/db/users/index.js";
import { createFHIRServices } from "../fhir-api/index.js";
import { FHIRServerCTX, asSystemCTX } from "../fhir-api/types.js";
import { createPGPool } from "../fhir-storage/providers/postgres/pg.js";
import { FHIRTransaction } from "../fhir-storage/transactions.js";

async function getTenant(
  ctx: Omit<FHIRServerCTX, "tenant" | "user">,
  options: {
    id?: string;
    tier?: string;
  },
): Promise<Parameters<TenantManagement["create"]>[1]> {
  const tenant: Parameters<TenantManagement["create"]>[1] = {
    id: options.id,
    subscription_tier: options.tier,
  };

  console.log(options, tenant);
  if (!tenant.subscription_tier) {
    const tiers = await db.select("subscription_tier", {}).run(ctx.db);

    tenant.subscription_tier = await inquirer.select({
      message: "Select tenant tier",
      default: tiers[2].id,
      choices: tiers.map((t) => ({
        name: t.name,
        value: t.id,
      })),
    });
  }

  return tenant;
}

async function getMembership(options: {
  email?: string;
  password?: string;
}): Promise<Membership> {
  const email = options.email
    ? options.email
    : await inquirer.input({
        message: "Enter root user email.",
        validate: (input) => {
          return validator.isEmail(input);
        },
      });

  return {
    resourceType: "Membership",
    role: "owner" as code,
    email,
  };
}

async function createTenant(
  options: {
    id?: string;
    tier?: string;
    email?: string;
    password?: string;
  },
  ctx: Omit<FHIRServerCTX, "tenant" | "user">,
) {
  return await FHIRTransaction(
    ctx,
    db.IsolationLevel.Serializable,
    async (ctx) => {
      const tenantManagement = new TenantManagement();
      const tenant = await tenantManagement.create(
        ctx,
        await getTenant(ctx, options),
      );
      const password = options.password
        ? options.password
        : await inquirer.password({
            message: "Enter root user password.",
          });

      const membership: Membership = await ctx.client.create(
        asSystemCTX({ ...ctx, tenant: tenant.id as TenantId }),
        R4,
        await getMembership(options),
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
    .option("-i, --id <id>", "Id for tenant")
    .option("-t, --tier <tier>", "tier for tenant")
    .option("-e, --email <email>", "Email for root user")
    .option("-p, --password <password>", "Password for root user")
    .action(async (options) => {
      const pool = createPGPool();
      const services = await createFHIRServices(pool);

      await createTenant(options, services);

      process.exit(0);
    });
}

function clientAppCommands(command: Command) {
  command
    .command("create")
    .description("Create a new clientapp.")
    .requiredOption("-t, --tenant <tenant>", "Id for tenant")
    .requiredOption("-s, --secret <secret>", "Secret for client app")
    .action(async (options) => {
      const pool = createPGPool();
      const services = await createFHIRServices(pool);

      const transaction = await services.client.transaction(
        asSystemCTX({ ...services, tenant: options.tenant }),
        R4,
        {
          resourceType: "Bundle",
          type: "transaction",
          entry: [
            {
              request: { method: "POST", url: "AccessPolicy" },
              resource: {
                name: "Admin Access",
                code: "admin-access",
                type: "full-access",
                resourceType: "AccessPolicy",
                target: [
                  {
                    link: {
                      reference: "clientapp",
                    },
                  },
                ],
              } as AccessPolicy,
            },
            {
              fullUrl: "clientapp",
              request: { method: "POST", url: "ClientApplication" },
              resource: {
                name: "Tester",
                secret: options.secret,
                grantType: ["client_credentials"],
                resourceType: "ClientApplication",
                responseTypes: "token",
              } as ClientApplication,
            },
          ],
        } as Bundle,
      );

      console.log(
        JSON.stringify(transaction.entry?.[1]?.resource, undefined, 2),
      );

      process.exit(0);
    });
}

export function adminCommands(command: Command) {
  tenantCommands(command.command("tenant"));
  clientAppCommands(command.command("client-app"));
}
