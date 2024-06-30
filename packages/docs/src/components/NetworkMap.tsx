import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Sigma from "sigma";

import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";

export default function NetworkMap<Version extends FHIR_VERSION>({
  version,
}: {
  version: Version;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [resourceSds, setResourceSds] = useState<
    Resource<Version, "StructureDefinition">[]
  >([]);
  useEffect(() => {
    fetch(
      `https://open-api.iguhealth.app/w/system/api/v1/fhir/${version}/StructureDefinition?_count=1000&kind=resource`,
    )
      .then((res) => res.json())
      .then((bundle) =>
        setResourceSds(
          bundle.entry.map((e) => e.resource).filter((r) => !r.abstract),
        ),
      );
  }, [setResourceSds, version]);
  //   const resourceSds = fetch(
  //     "https://open-api.iguhealth.app/w/system/api/v1/fhir/r4/StructureDefinition?_count=1000&type=resource",
  //   );

  const graph = useMemo(() => {
    const g = new Graph({ multi: true });

    let xpos = 0;
    let ypos = 0;
    for (const resourceSd of resourceSds) {
      if (xpos === 50) {
        xpos = 0;
        ypos += 5;
      } else {
        xpos += 5;
      }
      g.addNode(resourceSd.id, {
        label: resourceSd.name,
        x: xpos,
        y: ypos,
        size: 3,
        color: "blue",
      });
    }

    for (const resourceSd of resourceSds) {
      for (const element of resourceSd.snapshot.element) {
        if (element.type) {
          for (const type of element.type) {
            if (type.code === "Reference" || type.code === "canonical") {
              const target = type.targetProfile?.[0];
              const targetId = target?.split("/").pop();
              if (resourceSds.find((r) => r.id === targetId)) {
                g.addEdge(resourceSd.id, targetId, {
                  type: "arrow",
                  label: element.path,
                });
              }
            }
          }
        }
      }
    }

    const layout = new FA2Layout(g, {
      settings: { gravity: 30, adjustSizes: true },
    });

    // To start the layout
    layout.start();

    setTimeout(() => {
      layout.stop();
    }, 1000);

    return g;
  }, [resourceSds]);

  useEffect(() => {
    if (ref.current) {
      const sigmaInstance = new Sigma(graph, ref.current, {
        renderEdgeLabels: true,
      });
    }
  }, [ref, graph]);

  return (
    <div
      style={{ minHeight: "500px", minWidth: "500px" }}
      className="w-full h-full"
      ref={ref}
    ></div>
  );
}
