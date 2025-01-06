import * as inquirer from "@inquirer/prompts";
import { Command } from "commander";
import validator from "validator";
import * as db from "zapatos/db";

import {
  AccessPolicyV2,
  Bundle,
  ClientApplication,
  Membership,
  code,
} from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt/types";

import * as tenants from "../../authN/db/tenant.js";
import * as users from "../../authN/db/users/index.js";
import RedisCache from "../../cache/providers/redis.js";
import {
  createClient,
  createLogger,
  getRedisClient,
} from "../../fhir-api/index.js";
import { IGUHealthServerCTX, asRoot } from "../../fhir-api/types.js";
import { createPGPool } from "../../storage/pg.js";
import { PostgresStore } from "../../storage/resource-stores/postgres/index.js";
import { PostgresSearchEngine } from "../../storage/search-stores/postgres/index.js";
import { Transaction } from "../../storage/transactions.js";
import { TerminologyProvider } from "../../fhir-terminology/index.js";
import RedisLock from "../../synchronization/redis.lock.js";

async function getTenant(
  ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
  options: {
    id?: string;
    tier?: string;
  },
): Promise<Parameters<(typeof tenants)["create"]>[1]> {
  const tenant: Parameters<(typeof tenants)["create"]>[1] = {
    id: options.id,
    subscription_tier: options.tier,
  };

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
  ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
) {
  return await Transaction(ctx, db.IsolationLevel.Serializable, async (ctx) => {
    const tenant = await tenants.create(ctx, await getTenant(ctx, options));

    const membership: Membership = await ctx.client.create(
      await asRoot({ ...ctx, tenant: tenant.id as TenantId }),
      R4,
      await getMembership(options),
    );

    const password = options.password
      ? options.password
      : await inquirer.password({
          message: "Enter root user password.",
        });

    const user = await users.search(ctx.db, tenant.id as TenantId, {
      fhir_user_id: membership.id as string,
    });

    await users.update(ctx.db, tenant.id as TenantId, user[0].id, {
      ...user[0],
      password,
      email_verified: true,
    });

    console.log(`Tenant created with id: '${tenant.id}'`);
    console.log(`User created with email: '${user[0].email}'`);
  });
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
      const redis = getRedisClient();
      const services: Omit<IGUHealthServerCTX, "user" | "tenant"> = {
        environment: process.env.IGUHEALTH_ENVIRONMENT,
        db: createPGPool(),
        lock: new RedisLock(redis),
        cache: new RedisCache(redis),
        logger: createLogger(),
        terminologyProvider: new TerminologyProvider(),
        store: new PostgresStore(),
        search: new PostgresSearchEngine(),
        ...createClient(),
      };

      await createTenant(options, services);

      process.exit(0);
    });
}

function clientAppCommands(command: Command) {
  command
    .command("create")
    .description("Create a new clientapp.")
    .requiredOption("-t, --tenant <tenant>", "Id for tenant")
    .requiredOption("-i, --id <id>", "Id for client app")
    .requiredOption("-s, --secret <secret>", "Secret for client app")
    .action(async (options) => {
      const redis = getRedisClient();
      const services: Omit<IGUHealthServerCTX, "user" | "tenant"> = {
        environment: process.env.IGUHEALTH_ENVIRONMENT,
        db: createPGPool(),
        lock: new RedisLock(redis),
        cache: new RedisCache(redis),
        logger: createLogger(),
        terminologyProvider: new TerminologyProvider(),
        store: new PostgresStore(),
        search: new PostgresSearchEngine(),
        ...createClient(),
      };

      const transaction = await services.client.transaction(
        await asRoot({ ...services, tenant: options.tenant }),
        R4,
        {
          resourceType: "Bundle",
          type: "transaction",
          entry: [
            {
              request: { method: "POST", url: "AccessPolicyV2" },
              resource: {
                name: "Admin Access",
                engine: "full-access",
                resourceType: "AccessPolicyV2",
                target: [
                  {
                    link: {
                      reference: "clientapp",
                    },
                  },
                ],
              } as AccessPolicyV2,
            },
            {
              fullUrl: "clientapp",
              request: {
                method: "PUT",
                url: `ClientApplication/${options.id}`,
              },
              resource: {
                id: options.id,
                name: "Tester",
                secret: options.secret,
                grantType: ["client_credentials"],
                resourceType: "ClientApplication",
                responseTypes: "token",
                scope: "system/*.*",
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
