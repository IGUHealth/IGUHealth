import { OperationOutcome } from "@iguhealth/fhir-types/r4/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(error: any): string {
  if ("response" in error) {
    const message = (error.response.body as OperationOutcome).issue
      .map((issue) => issue.diagnostics)
      .join("\n");

    console.log("MESSAGE:", message, error);

    return message;
  }
  return "Unknown Error";
}
