import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { ReportHandler } from "web-vitals";

import { IGUHealthProvider, useIGUHealth } from "@iguhealth/components";
import { Patient } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

function App() {
  const iguhealth = useIGUHealth();
  const [patients, setPatients] = useState<Patient[]>([]);
  useEffect(() => {
    async function fetchPatients() {
      const patients = await iguhealth
        .getClient()
        .search_type({}, R4, "Patient", []);
      setPatients(patients.resources);
    }
    if (iguhealth.isAuthenticated) fetchPatients();
  }, [iguhealth.isAuthenticated]);

  if (!iguhealth.isAuthenticated) {
    return <div>Not authenticated</div>;
  }
  return <div>{JSON.stringify(patients)}</div>;
}

root.render(
  <React.StrictMode>
    <IGUHealthProvider
      tenant={"system"}
      domain={"http://localhost:3000"}
      clientId="admin-app"
      redirectUrl="http://system.localhost:3002"
    >
      <App />
    </IGUHealthProvider>
  </React.StrictMode>,
);

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
