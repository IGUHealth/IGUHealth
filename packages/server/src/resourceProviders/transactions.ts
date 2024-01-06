import graphlib from "@dagrejs/graphlib";
import pg from "pg";

import { evaluateWithMeta } from "@iguhealth/fhirpath";
import { Bundle, Reference, uri } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";
import { FHIRServerCTX } from "../fhir/types.js";

function getTransactionFullUrls(transaction: Bundle): Record<string, number> {
  const record: Record<string, number> = {};

  for (const idx in transaction.entry) {
    const entry = transaction.entry[parseInt(idx)];
    if (entry.fullUrl) {
      record[entry.fullUrl] = parseInt(idx);
    }
  }
  return record;
}

type LocationsToUpdate = {
  [key: string]: (string | number)[][] | undefined;
};

export function buildTransactionTopologicalGraph(
  ctx: FHIRServerCTX,
  transaction: Bundle
): {
  order: string[];
  locationsToUpdate: LocationsToUpdate;
  graph: graphlib.Graph;
} {
  const entries = transaction.entry || [];
  const graph = new graphlib.Graph({ directed: true });
  const urlToIndice = getTransactionFullUrls(transaction);
  const locationsToUpdate: LocationsToUpdate = {};

  for (const idx in entries) {
    const entry = entries[parseInt(idx)];
    graph.setNode(idx, entry.fullUrl);

    // Pull dependencies from references.
    if (entry.resource) {
      const resourceReferences = evaluateWithMeta(
        "$this.descendants().ofType(Reference)",
        entry.resource,
        {
          meta: {
            type: entry.resource.resourceType as uri,
            getSD: (type) => {
              const canonical = ctx.resolveTypeToCanonical(type);
              if (!canonical)
                throw new OperationError(
                  outcomeFatal(
                    "exception",
                    `Could not resolve canonical for type '${type}'.`
                  )
                );
              return ctx.resolveCanonical("StructureDefinition", canonical);
            },
          },
        }
      );

      const bundleDependencies = resourceReferences.filter((v) => {
        const ref = (v.valueOf() as Reference).reference;
        if (ref && urlToIndice[ref] !== undefined) return true;
        return false;
      });

      for (const dep of bundleDependencies) {
        const ref = (dep.valueOf() as Reference).reference as string;
        locationsToUpdate[ref] = locationsToUpdate[ref] || [];
        const location = dep.location();
        if (!location)
          throw new OperationError(
            outcomeFatal(
              "exception",
              "Transaction processing could not find dependents location."
            )
          );

        const bundleEntryLocation = ["entry", idx, "resource", ...location];
        (locationsToUpdate[ref] || []).push(bundleEntryLocation);
        graph.setEdge(urlToIndice[ref as string].toString(), idx);
      }
    }
  }
  if (!graphlib.alg.isAcyclic(graph)) {
    const cycles = graphlib.alg.findCycles(graph);
    throw new OperationError(
      outcomeFatal(
        "exception",
        `Transaction bundle has cycles at following indice paths ${cycles
          .map((cycle) => cycle.join("->"))
          .join(", ")}.`
      )
    );
  }
  return { locationsToUpdate, graph, order: graphlib.alg.topsort(graph) };
}

async function retryFailedTransactions<ReturnType>(
  ctx: FHIRServerCTX,
  numberOfRetries: number,
  execute: () => Promise<ReturnType>
): Promise<ReturnType> {
  for (let i = 0; i < numberOfRetries; i++) {
    try {
      const res = await execute();
      return res;
    } catch (e) {
      if (!(e instanceof pg.DatabaseError)) {
        ctx.logger.error("Error during transaction:", e);
        throw e;
      }
      // Only going to retry on failed transactions
      if (e.code !== "40001") {
        ctx.logger.error("Postgres error threw :", e);
        throw e;
      }
      ctx.logger.warn(`Retrying transaction : ${i + 1}`, { retry: i + 1 });
    }
  }

  ctx.logger.error(`Max number of retries exceeded '${numberOfRetries}'`);
  throw new OperationError(
    outcomeFatal(
      "lock-error",
      `Could not apply transaction after '${numberOfRetries}' retries.`
    )
  );
}

/*
 ** Postgres transactional isolation levels.
 */
export enum ISOLATION_LEVEL {
  /*
   ** Dirty Read:            Not possible
   ** Nonrepeatable Read:	 Possible
   ** Phantom Read:          Possible
   ** Serialization Anomaly: Possible
   */
  ReadCommitted = 0,
  /*
   ** Dirty Read:            Not possible
   ** Nonrepeatable Read:	 Not possible
   ** Phantom Read:          Allowed, but not in PG
   ** Serialization Anomaly: Possible
   */
  RepeatableRead = 1,
  /*
   ** Dirty Read:            Not possible
   ** Nonrepeatable Read:	 Not possible
   ** Phantom Read:          Not possible
   ** Serialization Anomaly: Not possible
   */
  Serializable = 2,
}

function begin(isolation_level: ISOLATION_LEVEL) {
  switch (isolation_level) {
    case ISOLATION_LEVEL.ReadCommitted: {
      return "BEGIN";
    }
    case ISOLATION_LEVEL.RepeatableRead: {
      return "BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ";
    }
    case ISOLATION_LEVEL.Serializable: {
      return "BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE";
    }
    default: {
      throw new OperationError(
        outcomeFatal("exception", `Invalid isolation level ${isolation_level}`)
      );
    }
  }
}

export async function transaction<T>(
  isolation_level: ISOLATION_LEVEL,
  ctx: FHIRServerCTX,

  client: pg.PoolClient,
  body: (ctx: FHIRServerCTX) => Promise<T>
): Promise<T> {
  if (ctx.inTransaction) return body(ctx);
  return retryFailedTransactions(ctx, 5, async () => {
    try {
      await client.query(begin(isolation_level));
      const returnV = await body({ ...ctx, inTransaction: true });
      await client.query("END");
      return returnV;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  });
}
