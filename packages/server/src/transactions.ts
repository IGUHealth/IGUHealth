import graphlib from "@dagrejs/graphlib";
import * as db from "zapatos/db";

import { Reference, uri } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";
import { evaluateWithMeta } from "@iguhealth/fhirpath";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "./fhir-server/types.js";
import { PostgresStore } from "./resource-stores/postgres/index.js";

function getTransactionFullUrls(
  transaction: Resource<FHIR_VERSION, "Bundle">,
): Record<string, number> {
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

export async function buildTransactionTopologicalGraph<
  Version extends FHIR_VERSION,
>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  transaction: Resource<Version, "Bundle">,
): Promise<{
  order: string[];
  locationsToUpdate: LocationsToUpdate;
  graph: graphlib.Graph;
}> {
  const entries = transaction.entry || [];
  const graph = new graphlib.Graph({ directed: true });
  const urlToIndice = getTransactionFullUrls(transaction);
  const locationsToUpdate: LocationsToUpdate = {};

  for (const idx in entries) {
    const entry = entries[parseInt(idx)];
    graph.setNode(idx, entry.fullUrl);

    // Pull dependencies from references.
    if (entry.resource) {
      const resourceReferences = await evaluateWithMeta(
        "$this.descendants().ofType(Reference)",
        entry.resource,
        {
          fhirVersion,
          type: entry.resource.resourceType as uri,
        },
      );

      const bundleDependencies = resourceReferences.filter((v) => {
        const ref = (v.getValue() as Reference).reference;
        if (ref && urlToIndice[ref] !== undefined) return true;
        return false;
      });

      for (const dep of bundleDependencies) {
        const ref = (dep.getValue() as Reference).reference as string;
        locationsToUpdate[ref] = locationsToUpdate[ref] || [];
        const location = dep.location();
        if (!location)
          throw new OperationError(
            outcomeFatal(
              "exception",
              "Transaction processing could not find dependents location.",
            ),
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
          .join(", ")}.`,
      ),
    );
  }
  return { locationsToUpdate, graph, order: graphlib.alg.topsort(graph) };
}

export function DBTransaction<CTX extends Pick<IGUHealthServerCTX, "store">, R>(
  ctx: CTX,
  isolationLevel: db.IsolationLevel,
  transaction: (ctx: CTX) => R,
): Promise<R> {
  return db.transaction(
    ctx.store.getClient(),
    isolationLevel,
    async (client) => {
      return transaction({ ...ctx, store: new PostgresStore(client) });
    },
  );
}

export async function QueueBatch<
  CTX extends Pick<IGUHealthServerCTX, "queue">,
  R,
>(ctx: CTX, batchFN: (ctx: CTX) => R): Promise<R> {
  // Avoid nesting transactions.
  if (ctx.queue.isBatch()) {
    const res = await batchFN(ctx);
    return res;
  }

  const queueTransaction = await ctx.queue.batch();
  const transactionCTX = { ...ctx, queue: queueTransaction };

  try {
    const result = await batchFN(transactionCTX);
    await queueTransaction.commit();

    return result;
  } catch (e) {
    await queueTransaction.abort();
    throw e;
  }
}
