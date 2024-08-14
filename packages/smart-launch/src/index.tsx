import React from "react";
import { createRoot } from "react-dom/client";

import createHTTPClient from "@iguhealth/client/lib/http";
import { FHIRGenerativeSearchTable } from "@iguhealth/components";

declare global {
  interface Window {
    API_URL: string;
    ACCESS_TOKEN: string;
    FHIR_VERSION: any;
    RESOURCE_TYPE: any;
  }
}

function SMARTSelector() {
  const client = createHTTPClient({
    url: window.API_URL,
    getAccessToken: async () => window.ACCESS_TOKEN,
  });

  return (
    <h1>
      <FHIRGenerativeSearchTable
        fhirVersion={window.FHIR_VERSION}
        client={client}
        resourceType={window.RESOURCE_TYPE}
      />
    </h1>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <SMARTSelector />,
);
