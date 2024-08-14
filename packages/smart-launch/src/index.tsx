import React from "react";
import { createRoot } from "react-dom/client";

import { FHIRAddressEditable } from "@iguhealth/components";

function App() {
  return (
    <h1>
      <FHIRAddressEditable />
    </h1>
  );
}

createRoot(document.getElementById("root")).render(<App />);
