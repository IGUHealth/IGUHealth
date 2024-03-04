import { ReportHandler } from "web-vitals";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import { Patient } from "@iguhealth/fhir-types/r4/types";

import IGUHealthProvider from "./IGUHealthProvider";
import useIGUHealth from "./useIGUHealth";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

function App() {
  const state = useIGUHealth();
  const [patients, setPatients] = useState<Patient[]>([]);
  useEffect(() => {
    async function fetchPatients() {
      const patients = await state.getClient().search_type({}, "Patient");
      setPatients(patients.resources);
    }
    if (state.isAuthenticated) fetchPatients();
  }, [state.isAuthenticated]);

  if (!state.isAuthenticated) {
    return <div>Not authenticated</div>;
  }
  return <div>{JSON.stringify(patients)}</div>;
}

root.render(
  <React.StrictMode>
    <IGUHealthProvider
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
