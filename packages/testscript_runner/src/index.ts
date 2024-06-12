import createHTTPClient from "@iguhealth/client/http";
import { FHIRRequest, FHIRResponse } from "@iguhealth/client/lib/types";
import { code, id, markdown } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

type TestScriptState<Version extends FHIR_VERSION> = {
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
      if (!operation.targetId)
        throw new OperationError(
          outcomeFatal("invalid", "targetId is required for read operation"),
        );

      return {
        fhirVersion: state.version,
        level: "instance",
        type: "delete-request",
        resourceType: getFixtureResource(state, operation.targetId)
          ?.resourceType,
        id: getFixtureResource(state, operation.targetId)?.id as id,
      } as FHIRRequest;
    }
    case "history":
    case "search":
    case "batch":
    case "transaction":
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

function getFHIRResponseFixture<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  assertion: NonNullable<TestScriptAction<Version>["assert"]>,
): FHIRResponse {
  const response = assertion.sourceId
    ? state.fixtures[assertion.sourceId]
    : state.latestResponse;

  if (response && "type" in response && "level" in response) {
    return response as FHIRResponse;
  }

  throw new OperationError(
    outcomeFatal("invalid", "response fixture not found"),
  );
}

async function evaluateAssertion<Version extends FHIR_VERSION>(
  state: TestScriptState<Version>,
  assertion: NonNullable<TestScriptAction<Version>["assert"]>,
): Promise<{
  state: TestScriptState<Version>;
  result: NonNullable<TestReportAction<Version>["assert"]>;
}> {
  const response: FHIRResponse = getFHIRResponseFixture(state, assertion);
  const request = state.latestRequest;

  if (assertion.resource) {
    if (
      response.level !== "type" ||
      response.resourceType !== assertion.resource
    ) {
      return {
        state,
        result: {
          result: "fail",
          message: `Expected resource type '${assertion.resource}' but got '${response.level === "type" ? response.resourceType : "not a resource"}'`,
        } as NonNullable<TestReportAction<Version>["assert"]>,
      };
    }
  }

  return {
    state,
    result: { result: "pass", message: "Assertions passed" } as NonNullable<
      TestReportAction<Version>["assert"]
    >,
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
      result: {
        result: "pass" as code,
        message:
          `Operation '${operation.label}' succeeded with operation '${operation.type?.code}'` as markdown,
      },
    };
  } catch (e) {
    return {
      state,
      result: {
        result: "fail" as code,
        message:
          `Operation '${operation.label}' failed with operation '${operation.type?.code}'` as markdown,
      },
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
    const output = await evaluateAction(curState, action);
    curState = output.state;
    testReports.push(output.result);
  }

  return { state: curState, result: testReports };
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
    const output = await evaluateTest(state, test);
    curState = output.state;
    testResults.push({
      name: test.name,
      action: output.result,
    });
  }

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

    return testReport;
  } finally {
    const output = await runTeardown(state, testscript.teardown);
    testReport.teardown = output.result;
  }
}
