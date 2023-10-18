import { evaluateWithMeta } from "@iguhealth/fhirpath";
import {
  Bundle,
  Reference,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { Graph, alg } from "@dagrejs/graphlib";

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
  [key: string]: (string | number)[][];
};

export function buildTransactionTopologicalGraph(
  getSD: (type: string) => StructureDefinition | undefined,
  transaction: Bundle
): {
  locationsToUpdate: LocationsToUpdate;
  graph: Graph;
} {
  const entries = transaction.entry || [];
  const graph = new Graph({ directed: true });
  const urlToIndice = getTransactionFullUrls(transaction);
  const locationsToUpdate: LocationsToUpdate = {};
  for (const idx in entries) {
    const entry = entries[parseInt(idx)];
    graph.setNode(idx, entry.fullUrl);

    // Pull dependencies from references.
    if (entry.resource) {
      const dependencies = evaluateWithMeta(
        "$this.descendants().ofType(Reference)",
        entry.resource,
        { meta: { type: entry.resource.resourceType, getSD } }
      ).filter((v) => {
        const ref = (v.valueOf() as Reference).reference;
        if (ref && urlToIndice[ref] !== undefined) return true;
        return false;
      });

      locationsToUpdate[idx] = dependencies.map((dep) => dep.location() || []);

      for (const dep of dependencies) {
        const ref = (dep.valueOf() as Reference).reference;
        graph.setEdge(urlToIndice[ref as string].toString(), idx);
      }
    }
  }

  return { locationsToUpdate, graph };
}
