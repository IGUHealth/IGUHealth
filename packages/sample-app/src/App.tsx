import React, { useState } from "react";
import { FhirApp, Integer } from "@iguhealth/components";
import "@iguhealth/components/dist/output.css";

function App() {
  const [weight, setWeight] = useState(undefined as number | undefined);

  return (
    <FhirApp>
      <div>Please enter patient's weight in pounds (lbs):</div>
      <Integer
        value={weight}
        onChange={(val: number | undefined) => setWeight(val)}
      />
    </FhirApp>
  );
}

export default App;
