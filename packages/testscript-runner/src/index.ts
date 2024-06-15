import { Logger } from "pino";

import createHTTPClient from "@iguhealth/client/http";
import { FHIRRequest, FHIRResponse } from "@iguhealth/client/lib/types";
import { parseQuery } from "@iguhealth/client/url";
import { code, id, markdown } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import * as fp from "@iguhealth/fhirpath";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

type TestScriptState<Version extends FHIR_VERSION> = {
  logger: Logger<string>;
  result: "pass" | "fail" | "pending";
  version: Version;
  fixtures: Record<
    string,
    Resource<Version, AllResourceTypes> | FHIRRequest | FHIRResponse
  >;
  latestResponse?: FHIRResponse;
  latestRequest?: FHIRRequest;
  client: ReturnType<typeof createHTTPClient>;
};

type TestScriptAction<Version extends FHIR_VERSION> = NonNullable<
  Resource<Version, "TestScript">["setup"]
>["action"][number];

type TestReportAction<Version extends FHIR_VERSION> = NonNullable<
  Resource<Version, "TestReport">["setup"]
>["action"][number];

function getFixtureResource<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  id: id,
): Resource<Version, AllResourceTypes> {
  const v = state.fixtures[id];
  if (
    (v as unknown as Record<string, unknown>).resourceType &&
    (v as unknown as Record<string, unknown>).id
  ) {
    return v as Resource<Version, AllResourceTypes>;
  }
  throw new OperationError(
    outcomeFatal("invalid", `fixture with id '${id}' not found`),
  );
}

function operationToFHIRRequest<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  operation: NonNullable<TestScriptAction<Version>["operation"]>,
): FHIRRequest {
  // See https://hl7.org/fhir/r4/valueset-testscript-operation-codes.html
  // case "updateCreate":
  switch (operation?.type?.code) {
    case "read": {
      if (!operation.targetId)
        throw new OperationError(
          outcomeFatal("invalid", "targetId is required for read operation"),
        );
      return {
        fhirVersion: state.version,
        level: "instance",
        type: "read-request",
        resourceType: getFixtureResource(state, operation.targetId)
          ?.resourceType as unknown as ResourceType<Version>,
        id: getFixtureResource(state, operation.targetId)?.id as id,
      } as FHIRRequest;
    }
    case "create": {
      if (!operation.sourceId)
        throw new OperationError(
          outcomeFatal("invalid", "sourceId is required for read operation"),
        );
      return {
        fhirVersion: state.version,
        level: "type",
        type: "create-request",
        resourceType: getFixtureResource(state, operation.sourceId)
          .resourceType,
        body: getFixtureResource(state, operation.sourceId),
      } as FHIRRequest;
    }
    case "vread": {
      if (!operation.targetId)
        throw new OperationError(
          outcomeFatal("invalid", "targetId is required for read operation"),
        );

      return {
        fhirVersion: state.version,
        level: "instance",
        type: "vread-request",
        resourceType: operation.resource as unknown as ResourceType<Version>,
        id: getFixtureResource(state, operation.targetId)?.id as id,
        versionId: getFixtureResource(state, operation.targetId)?.meta
          ?.versionId as id,
      } as FHIRRequest;
    }

    case "update": {
      if (!operation.sourceId)
        throw new OperationError(
          outcomeFatal("invalid", "sourceId is required for read operation"),
        );
      if (!operation.targetId)
        throw new OperationError(
          outcomeFatal("invalid", "targetId is required for read operation"),
        );

      return {
        fhirVersion: state.version,
        level: "instance",
        type: "update-request",
        resourceType: getFixtureResource(state, operation.targetId)
          ?.resourceType as unknown as ResourceType<Version>,
        id: getFixtureResource(state, operation.targetId)?.id as id,
        body: getFixtureResource(state, operation.sourceId),
      } as FHIRRequest;
    }
    case "delete": {
      switch (true) {
        case operation.targetId !== undefined: {
          return {
            fhirVersion: state.version,
            level: "instance",
            type: "delete-request",
            resourceType: getFixtureResource(state, operation.targetId)
              ?.resourceType,
            id: getFixtureResource(state, operation.targetId)?.id as id,
          } as FHIRRequest;
        }
        case operation.resource !== undefined: {
          return {
            fhirVersion: state.version,
            level: "type",
            type: "delete-request",
            resourceType: operation.resource,
            parameters: parseQuery(operation.params ?? ""),
          } as FHIRRequest;
        }
        case operation.params !== undefined: {
          return {
            fhirVersion: state.version,
            level: "system",
            type: "delete-request",
            parameters: parseQuery(operation.params ?? ""),
          } as FHIRRequest;
        }
        default: {
          throw new OperationError(
            outcomeFatal("invalid", "Delete request is invalid."),
          );
        }
      }
    }

    case "search": {
      if (operation.resource) {
        return {
          fhirVersion: state.version,
          level: "type",
          type: "search-request",
          resourceType: operation.resource,
          parameters: parseQuery(operation.params ?? ""),
        } as FHIRRequest;
      } else {
        return {
          fhirVersion: state.version,
          level: "system",
          type: "search-request",
          parameters: parseQuery(operation.params ?? ""),
        } as FHIRRequest;
      }
    }
    case "batch": {
      if (!operation.sourceId)
        throw new OperationError(
          outcomeFatal("invalid", "sourceId is required for read operation"),
        );

      const batch = getFixtureResource(state, operation.sourceId);

      if (batch.resourceType !== "Bundle" || batch.type !== "batch") {
        throw new OperationError(
          outcomeFatal(
            "invalid",
            "Batch request must be a bundle and a of type batch.",
          ),
        );
      }

      return {
        fhirVersion: state.version,
        level: "system",
        type: "batch-request",
        body: batch,
      } as FHIRRequest;
    }
    case "transaction": {
      if (!operation.sourceId)
        throw new OperationError(
          outcomeFatal("invalid", "sourceId is required for read operation"),
        );

      const transaction = getFixtureResource(state, operation.sourceId);

      if (
        transaction.resourceType !== "Bundle" ||
        transaction.type !== "transaction"
      ) {
        throw new OperationError(
          outcomeFatal(
            "invalid",
            "Transaction request must be a bundle and a of type transaction.",
          ),
        );
      }

      return {
        fhirVersion: state.version,
        level: "system",
        type: "transaction-request",
        body: transaction,
      } as FHIRRequest;
    }
    case "history":
    default: {
      throw new OperationError(
        outcomeFatal(
          "not-supported",
          `operation of type '${operation?.type?.code}' is not supported`,
        ),
      );
    }
  }
}

function isResponseOrRequest<T extends FHIRRequest | FHIRResponse>(
  v: unknown,
): v is T {
  return v !== null && typeof v === "object" && "type" in v && "level" in v;
}

function getFHIRResponseFixture<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  assertion: NonNullable<TestScriptAction<Version>["assert"]>,
): FHIRResponse {
  const response = assertion.sourceId
    ? state.fixtures[assertion.sourceId]
    : state.latestResponse;

  if (isResponseOrRequest<FHIRResponse>(response)) {
    return response;
  }

  state.logger.error(response);

  throw new OperationError(
    outcomeFatal("invalid", "response fixture not found"),
  );
}

async function deriveComparision<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  assertion: NonNullable<TestScriptAction<Version>["assert"]>,
): Promise<unknown> {
  if (assertion.sourceId) {
    const data = state.fixtures[assertion.sourceId];

    switch (true) {
      case assertion.compareToSourceExpression !== undefined: {
        return fp.evaluate(assertion.compareToSourceExpression, data)[0];
      }
    }
  } else if (assertion.value) {
    return assertion.value;
  }
  return true;
}

/**
 * [https://hl7.org/fhir/r4/valueset-assert-operator-codes.html]
 * equals	equals	Default value. Equals comparison.
 * notEquals	notEquals	Not equals comparison.
 * in	in	Compare value within a known set of values.
 * notIn	notIn	Compare value not within a known set of values.
 * greaterThan	greaterThan	Compare value to be greater than a known value.
 * lessThan	lessThan	Compare value to be less than a known value.
 * empty	empty	Compare value is empty.
 * notEmpty	notEmpty	Compare value is not empty.
 * contains	contains	Compare value string contains a known value.
 * notContains	notContains	Compare value string does not contain a known value.
 * eval	evaluate	Evaluate the FHIRPath expression as a boolean condition.
 */
function evaluateOperator(
  v1: unknown,
  v2: unknown,
  operator: code = "equals" as code,
): boolean {
  switch (operator) {
    case "equals":
      return JSON.stringify(v1) === JSON.stringify(v2);
    case "notEquals":
      return JSON.stringify(v1) !== JSON.stringify(v2);
    case "in":
      return Array.isArray(v2) ? v2.includes(v1) : false;
    case "notIn":
      return Array.isArray(v2) ? !v2.includes(v1) : false;
    case "greaterThan":
      return parseInt(v1?.toString() ?? "") > parseInt(v2?.toString() ?? "");
    case "lessThan":
      return parseInt(v1?.toString() ?? "") < parseInt(v2?.toString() ?? "");
    case "empty":
      return Array.isArray(v1)
        ? v1.length === 0
        : v1 === undefined || v1 === null;
    case "notEmpty":
      return Array.isArray(v1)
        ? v1.length !== 0
        : v1 !== undefined && v1 !== null;
    case "contains":
      return typeof v1 === "string" && typeof v2 === "string"
        ? v1.includes(v2)
        : false;
    case "notContains":
      return typeof v1 === "string" && typeof v2 === "string"
        ? !v1.includes(v2)
        : false;
    case "eval":
      return v1 === v2;
    default:
      return false;
  }
}

function assertionFailureMessage(
  v1: unknown,
  v2: unknown,
  operator: code = "equals" as code,
): string {
  return `Failed Assertion <'${JSON.stringify(v1)}' ${operator} '${v2 ? JSON.stringify(v2) : ""}'>`;
}

function getSource<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  assertion: NonNullable<TestScriptAction<Version>["assert"]>,
  requestOrResponse: FHIRRequest | FHIRResponse,
): Resource<Version, AllResourceTypes> | undefined {
  const source = assertion.sourceId
    ? state.fixtures[assertion.sourceId]
    : requestOrResponse;
  if (isResponseOrRequest(source)) {
    if ("body" in source) {
      return source.body as Resource<Version, AllResourceTypes>;
    }
    return undefined;
  }

  return source;
}

async function evaluateAssertion<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  assertion: NonNullable<TestScriptAction<Version>["assert"]>,
): Promise<{
  state: TestScriptState<Version>;
  result: NonNullable<TestReportAction<Version>["assert"]>;
}> {
  const response: FHIRResponse = getFHIRResponseFixture(state, assertion);
  const request = state.latestRequest as FHIRRequest;
  const requestOrResponse =
    (assertion.direction ?? "response") === "response" ? response : request;

  const source = getSource(state, assertion, requestOrResponse);

  if (assertion.resource) {
    if (
      source === undefined ||
      !("resourceType" in source) ||
      !evaluateOperator(
        source.resourceType,
        assertion.resource,
        assertion.operator,
      )
    ) {
      const result = {
        result: "fail",
        message: assertionFailureMessage(
          source?.resourceType ?? "InvalidResourceType",
          assertion.resource,
          assertion.operator,
        ),
      } as NonNullable<TestReportAction<Version>["assert"]>;
      state.logger.error(result);

      return {
        state: { ...state, result: "fail" },
        result,
      };
    }
  }
  if (assertion.expression) {
    const compValue = await deriveComparision(state, assertion);
    const fpEvaluation = fp.evaluate(assertion.expression, source)[0];

    if (!evaluateOperator(fpEvaluation, compValue, assertion.operator)) {
      const result = {
        result: "fail",
        message: assertionFailureMessage(
          fpEvaluation,
          compValue,
          assertion.operator,
        ),
      } as NonNullable<TestReportAction<Version>["assert"]>;

      state.logger.error(result);

      return {
        state: { ...state, result: "fail" },
        result,
      };
    }
  }

  const result = {
    result: "pass",
    message: "Assertions passed",
  } as NonNullable<TestReportAction<Version>["assert"]>;
  state.logger.info(result);

  return {
    state,
    result,
  };
}

function associateResponseRequestVariables<Version extends FHIR_VERSION>(
  _fixtures: TestScriptState<Version>["fixtures"],
  operation: NonNullable<TestScriptAction<Version>["operation"]>,
  request: FHIRRequest,
  response: FHIRResponse,
) {
  let fixtures = { ..._fixtures };
  if (operation.responseId) {
    fixtures = { ...fixtures, [operation.responseId]: response };
  }
  if (operation.requestId) {
    fixtures = { ...fixtures, [operation.requestId]: request };
  }

  return fixtures;
}

async function evaluateOperation<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  operation: NonNullable<TestScriptAction<Version>["operation"]>,
): Promise<{
  state: TestScriptState<Version>;
  result: NonNullable<TestReportAction<Version>["operation"]>;
}> {
  try {
    const request = operationToFHIRRequest(state, operation);
    const response = await state.client.request({}, request);

    // In event of an update or create operation, store the response body back as a fixture
    if (
      operation.sourceId &&
      "body" in response &&
      "resourceType" in response.body
    ) {
      state.fixtures[operation.sourceId] = response.body as Resource<
        Version,
        AllResourceTypes
      >;
    }

    const result = {
      result: "pass" as code,
      message:
        `[SUCCEEDED]<${operation.type?.code}> label: '${operation.label ?? ""}'` as markdown,
    };

    state.logger.info(result);
    return {
      state: {
        ...state,
        fixtures: associateResponseRequestVariables(
          state.fixtures,
          operation,
          request,
          response,
        ),
        latestRequest: request,
        latestResponse: response,
      },
      result,
    };
  } catch (e) {
    const result = {
      result: "fail" as code,
      message:
        `[FAILED]<${operation.type?.code}> label: '${operation.label ?? ""}'` as markdown,
      outcome: e instanceof OperationError ? e.operationOutcome : undefined,
    };
    state.logger.error(result);
    return {
      state: { ...state, result: "fail" },
      result,
    };
  }
}

async function evaluateAction<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  action: TestScriptAction<Version>,
): Promise<{
  state: TestScriptState<Version>;
  result: TestReportAction<Version>;
}> {
  if (action.operation && action.assert) {
    throw new OperationError(
      outcomeFatal(
        "invalid",
        "Must have either operation or assert but not both.",
      ),
    );
  }
  switch (true) {
    case action.operation !== undefined: {
      const output = await evaluateOperation(state, action.operation);
      return {
        state: output.state,
        result: { operation: output.result },
      };
    }
    case action.assert !== undefined: {
      const output = await evaluateAssertion(state, action.assert);
      return {
        state: output.state,
        result: { assert: output.result },
      };
    }
    default: {
      throw new OperationError(
        outcomeFatal(
          "code-invalid",
          "Unreachable case in evaluation action hit.",
        ),
      );
    }
  }
}

async function evaluateTest<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  test: NonNullable<Resource<Version, "TestScript">["test"]>[number],
): Promise<{
  state: TestScriptState<Version>;
  result: TestReportAction<Version>[];
}> {
  let curState = state;
  const testReports: TestReportAction<Version>[] = [];

  for (const action of test.action) {
    const output = await evaluateAction(
      {
        ...curState,
        logger: state.logger.child({
          test: test.name,
          description: test.description,
        }),
      },
      action,
    );
    curState = output.state;
    testReports.push(output.result);
  }

  return { state: { ...curState, logger: state.logger }, result: testReports };
}

async function evaluateTests<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  tests: Resource<Version, "TestScript">["test"],
): Promise<{
  state: TestScriptState<Version>;
  result: Resource<Version, "TestReport">["test"];
}> {
  let curState = state;
  const testResults = [];

  for (const test of tests ?? []) {
    const output = await evaluateTest(curState, test);
    curState = output.state;
    testResults.push({
      name: test.name,
      action: output.result,
    });
  }

  curState =
    curState.result === "pending" ? { ...curState, result: "pass" } : curState;

  return { state: curState, result: testResults };
}

async function runSetup<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  setup: Resource<Version, "TestScript">["setup"],
): Promise<{
  state: TestScriptState<Version>;
  result: Resource<Version, "TestReport">["setup"];
}> {
  let curState = state;
  const setupResults = [];

  for (const action of setup?.action ?? []) {
    const output = await evaluateAction(state, action);
    curState = output.state;
    setupResults.push(output.result);
  }

  return { state: curState, result: { action: setupResults } };
}

async function runTeardown<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  teardown: Resource<Version, "TestScript">["teardown"],
): Promise<{
  state: TestScriptState<Version>;
  result: Resource<Version, "TestReport">["teardown"];
}> {
  let curState = state;
  const teardownResults = [];

  for (const action of teardown?.action ?? []) {
    const output = await evaluateOperation(state, action.operation);
    curState = output.state;
    teardownResults.push({ operation: output.result });
  }
  return { state: curState, result: { action: teardownResults } };
}

async function resolveFixtures<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  testScript: Resource<Version, "TestScript">,
): Promise<{ state: TestScriptState<Version> }> {
  for (const fixture of testScript.fixture ?? []) {
    if (!fixture.id) {
      throw new OperationError(
        outcomeFatal("invalid", "fixture must have an id"),
      );
    }

    const resource = fixture.resource;
    if (!resource) {
      throw new OperationError(
        outcomeFatal("invalid", "fixture must have a resource"),
      );
    }

    let resolvedResource;

    switch (true) {
      case fixture.resource?.reference?.startsWith("#"): {
        const id = (fixture.resource?.reference ?? "").slice(1);
        resolvedResource = testScript.contained?.find((r) => r.id === id);
        break;
      }
      default: {
        const [type, id] = fixture.resource?.reference?.split("/") ?? [];

        if (!type || !id) {
          throw new OperationError(
            outcomeFatal(
              "invalid",
              `invalid reference '${fixture.resource?.reference}'`,
            ),
          );
        }

        resolvedResource = await state.client.read(
          {},
          state.version,
          type as ResourceType<Version>,
          id as id,
        );
      }
    }

    if (!resolvedResource) {
      throw new OperationError(
        outcomeFatal(
          "invalid",
          `contained resource with reference '${fixture.resource?.reference}' not found`,
        ),
      );
    }

    state = {
      ...state,
      fixtures: {
        ...state.fixtures,
        [fixture.id]: resolvedResource as Resource<Version, AllResourceTypes>,
      },
    };
  }

  return { state };
}

/**
 * Execute a TestScript and return results as TestReport.
 * @param client IGUHealth client instance
 * @param version FHIR Version
 * @param testscript The testscript to run.
 * @returns TestReport of results from testscript.
 */
export async function run<Version extends FHIR_VERSION>(
  logger: Logger<string>,
  client: ReturnType<typeof createHTTPClient>,
  version: Version,
  testscript: Resource<Version, "TestScript">,
): Promise<Resource<Version, "TestReport">> {
  const testReport = {
    testScript: { reference: `TestScript/${testscript.id}` },
    result: "pending",
    resourceType: "TestReport",
  } as Resource<Version, "TestReport">;

  let { state } = await resolveFixtures(
    {
      logger,
      result: "pending",
      version,
      fixtures: {},
      client,
    },
    testscript,
  );

  try {
    const output = await runSetup(state, testscript.setup);
    state = output.state;
    testReport.setup = output.result;

    const testsOutput = await evaluateTests(state, testscript.test);
    testReport.test = testsOutput.result;
    state = testsOutput.state;

    testReport.result = state.result as code;

    return testReport;
  } finally {
    const output = await runTeardown(state, testscript.teardown);
    testReport.teardown = output.result;
  }
}
