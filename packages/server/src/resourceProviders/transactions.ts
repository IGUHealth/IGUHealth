import graphlib from "@dagrejs/graphlib";
import pg from "pg";

import { evaluateWithMeta } from "@iguhealth/fhirpath";
import { Bundle, Reference } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";
import { FHIRServerCTX } from "../fhirServer.js";

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
            type: entry.resource.resourceType,
            getSD: (type) => ctx.resolveSD(ctx, type),
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
      ctx.logger.warn("Retrying transaction :", i);
    }
  }
  throw new OperationError(
    outcomeFatal(
      "internal",
      `Could not apply transaction after '${numberOfRetries}' retries.`
    )
  );
}

export async function transaction<T>(
  ctx: FHIRServerCTX,
  client: pg.PoolClient,
  body: (ctx: FHIRServerCTX) => Promise<T>
): Promise<T> {
  if (ctx.inTransaction) return body(ctx);
  return retryFailedTransactions(ctx, 5, async () => {
    try {
      // client.query("BEGIN");
      await client.query("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE");
      const returnV = await body({ ...ctx, inTransaction: true });
      await client.query("END");
      return returnV;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  });
}
