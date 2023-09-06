import React from "react";

import { Resource } from "@iguhealth/fhir-types";
import { Layout } from "@iguhealth/components";
import "@iguhealth/components/dist/index.css";

function App() {
  return (
    <div className="App">
      <Layout.Navigation
        active="Dashboard"
        navigation={[{ name: "Dashboard" }, { name: "Resources" }]}
        userNavigation={[{ name: "Settings" }, { name: "Sign out" }]}
      />
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
