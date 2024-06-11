import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";

type Operation<Version extends FHIR_VERSION> = NonNullable<
  NonNullable<Resource<Version, "TestScript">["setup"]>["action"][number]
>["operation"];

export function evaluateOperation<Version extends FHIR_VERSION>(
  operation: Operation<Version>,
): boolean {
  return false;
}

export function run<Version extends FHIR_VERSION>(
  testscript: Resource<Version, "TestScript">,
): Resource<Version, "TestReport"> {
  throw new Error("Not implemented");
}
