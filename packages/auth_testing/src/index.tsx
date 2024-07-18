import FHIR from "fhirclient";
import Client from "fhirclient/lib/Client";
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

function IGUHealthAuth() {
  return (
    <IGUHealthProvider
      tenant={"system"}
      domain={"http://localhost:3000"}
      clientId="admin-app"
      redirectUrl="http://system.localhost:3002"
    >
      <App />
    </IGUHealthProvider>
  );
}

function IGUHealthSMART() {
  const [client, setClient] = useState<Client | undefined>();
  useEffect(() => {
    console.log("FHIR TRIGGER");
    FHIR.oauth2
      .init({
        iss: "http://localhost:3000/w/fbv7dwlc1szcpc9613e89/api/v1/fhir/r4",
        clientId: "kzQN-TQkHVzRsPEVm3MLUU",
        scope: "openid launch patient/*.read",
      })
      .then((client) => {
        console.log(client);
        client.request("Patient").then((p) => console.log(p));
        setClient(client);
      });
  }, [setClient]);

  return <div>Done</div>;
}

root.render(
  <React.StrictMode>
    <IGUHealthSMART />
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
