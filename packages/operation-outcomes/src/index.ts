import { OperationOutcome } from "@iguhealth/fhir-types/r4/types";

export class OperationError extends Error {
  public readonly operationOutcome: OperationOutcome;
  constructor(operationOtucome: OperationOutcome) {
    super();
    this.operationOutcome = operationOtucome;
  }
  get outcome() {
    return this.operationOutcome;
  }
}

export function issueSeverityToStatusCodes(
  severity: Issue["severity"]
): number {
  switch (severity) {
    case "fatal":
      return 500;
    case "error":
      return 400;
    case "warning":
      return 200;
    case "information":
      return 200;
    default:
      throw new Error("unknown severity");
  }
}

export function isOperationError(e: unknown): e is OperationError {
  return e instanceof OperationError;
}

export function outcome(issues: OperationOutcome["issue"]): OperationOutcome {
  return { resourceType: "OperationOutcome", issue: issues };
}

type Issue = OperationOutcome["issue"][number];

export function issue(
  severity: Issue["severity"],
  code: Issue["code"],
  diagnostics: Issue["diagnostics"],
  expression?: Issue["expression"]
): Issue {
  const issue = { severity, code, diagnostics, expression };
  if (expression) return { ...issue, expression };
  return issue;
}

export function issueError(
  code: Issue["code"],
  diagnostics: Issue["diagnostics"],
  expression?: Issue["expression"]
): Issue {
  return issue("error", code, diagnostics, expression);
}

export function issueFatal(
  code: Issue["code"],
  diagnostics: Issue["diagnostics"],
  expression?: Issue["expression"]
): Issue {
  return issue("fatal", code, diagnostics, expression);
}

export function issueWarning(
  code: Issue["code"],
  diagnostics: Issue["diagnostics"],
  expression?: Issue["expression"]
): Issue {
  return issue("warning", code, diagnostics, expression);
}

export function issueInfo(
  code: Issue["code"],
  diagnostics: Issue["diagnostics"],
  expression?: Issue["expression"]
): Issue {
  return issue("information", code, diagnostics, expression);
}

export function outcomeError(
  code: Issue["code"],
  diagnostics: Issue["diagnostics"],
  expression?: Issue["expression"]
): OperationOutcome {
  return outcome([issueError(code, diagnostics, expression)]);
}

export function outcomeFatal(
  code: Issue["code"],
  diagnostics: Issue["diagnostics"],
  expression?: Issue["expression"]
): OperationOutcome {
  return outcome([issueFatal(code, diagnostics, expression)]);
}

export function outcomeWarning(
  code: Issue["code"],
  diagnostics: Issue["diagnostics"],
  expression?: Issue["expression"]
): OperationOutcome {
  return outcome([issueWarning(code, diagnostics, expression)]);
}

export function outcomeInfo(
  code: Issue["code"],
  diagnostics: Issue["diagnostics"],
  expression?: Issue["expression"]
): OperationOutcome {
  return outcome([issueInfo(code, diagnostics, expression)]);
}
