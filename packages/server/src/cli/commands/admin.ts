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
import { membershipToUser } from "../../authN/db/users/utilities.js";
import RedisCache from "../../cache/providers/redis.js";
import {
  createClient,
  createLogger,
  getRedisClient,
} from "../../fhir-server/index.js";
import resolveCanonical from "../../fhir-server/resolvers/resolveCanonical.js";
import { IGUHealthServerCTX, asRoot } from "../../fhir-server/types.js";
import { TerminologyProvider } from "../../fhir-terminology/index.js";
import createQueue from "../../queue/providers/index.js";
import { DYNAMIC_TOPIC } from "../../queue/topics/dynamic-topic.js";
import { Consumers, TenantTopic } from "../../queue/topics/index.js";
import createResourceStore from "../../resource-stores/index.js";
import { createSearchStore } from "../../search-stores/index.js";
import RedisLock from "../../synchronization/redis.lock.js";
import { DBTransaction, QueueBatch } from "../../transactions.js";

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
    const tiers = await db
      .select("subscription_tier", {})
      .run(ctx.store.getClient());

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
  return QueueBatch(ctx, async (ctx) => {
    const [tenant, membership] = await DBTransaction(
      ctx,
      db.IsolationLevel.RepeatableRead,
      async (ctx) => {
        const tenant = await tenants.create(ctx, await getTenant(ctx, options));
        const membership: Membership = await ctx.client.create(
          asRoot({ ...ctx, tenant: tenant.id as TenantId }),
          R4,
          await getMembership(options),
        );

        const password = options.password
          ? options.password
          : await inquirer.password({
              message: "Enter root user password.",
            });

        const verifiedUser = {
          ...membershipToUser(tenant.id as TenantId, membership),
          email_verified: true,
          password,
        };

        await users.update(
          ctx.store.getClient(),
          tenant.id as TenantId,
          verifiedUser,
        );

        return [tenant, membership];
      },
    );

    await ctx.queue.send(DYNAMIC_TOPIC, [
      {
        value: {
          action: "subscribe",
          topic: TenantTopic(tenant.id as TenantId, "operations"),
          consumer_groups: [
            Consumers.Storage,
            Consumers.SearchIndexing,
            Consumers.SubscriptionV1,
          ],
        },
      },
    ]);

    console.log(`Tenant created with id: '${tenant.id}'`);
    console.log(`User created with email: '${membership.email}'`);
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
        queue: await createQueue(),
        lock: new RedisLock(redis),
        cache: new RedisCache(redis),
        logger: createLogger(),
        terminologyProvider: new TerminologyProvider(),
        store: await createResourceStore({ type: "postgres" }),
        search: await createSearchStore({ type: "postgres" }),
        resolveCanonical,
        client: createClient(),
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
        queue: await createQueue(),
        lock: new RedisLock(redis),
        cache: new RedisCache(redis),
        logger: createLogger(),
        terminologyProvider: new TerminologyProvider(),
        store: await createResourceStore({ type: "postgres" }),
        search: await createSearchStore({ type: "postgres" }),
        client: createClient(),
        resolveCanonical,
      };

      const transaction = await services.client.transaction(
        asRoot({ ...services, tenant: options.tenant }),
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
