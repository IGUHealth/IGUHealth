import { Command } from "commander";

import {
  AllResourceTypes,
  R4,
  R4B,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { ResourceValidate } from "@iguhealth/generated-ops/r4";

import { createClient } from "../client.js";
import { CONFIG_LOCATION } from "../config.js";
import { conversion, dataCommand } from "../utilities.js";

export function validate(command: Command) {
  dataCommand.command(
    command
      .command("validate")
      .argument("<fhirVersion>", "FHIR Version")
      .action(async (userFHIRVersion, options) => {
        const resource = dataCommand.readData(options) as Resource<
          R4,
          AllResourceTypes
        >;
        const FHIRVersion = conversion.asFHIRType(userFHIRVersion);
        const client = createClient(CONFIG_LOCATION);

        switch (FHIRVersion) {
          case R4: {
            const result = await client.invoke_type(
              ResourceValidate.Op,
              {},
              FHIRVersion,
              resource.resourceType,
              { resource },
            );

            console.log(JSON.stringify(result, null, 2));
            return;
          }
          case R4B:
          default: {
            throw new Error("Unsupported FHIR Version");
          }
        }
      }),
  );
}
