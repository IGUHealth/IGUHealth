import {
  CreateFunctionCommand,
  GetFunctionCommand,
  InvokeCommand,
  InvokeCommandOutput,
  LambdaClient,
  ResourceConflictException,
  UpdateFunctionCodeCommand,
  UpdateFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";
import {
  GetResourcesCommand,
  ResourceGroupsTaggingAPI,
} from "@aws-sdk/client-resource-groups-tagging-api";
import AdmZip from "adm-zip";

import { R4InvokeRequest, R4InvokeResponse } from "@iguhealth/client/lib/types";
import {
  OperationDefinition,
  OperationOutcome,
  Parameters,
} from "@iguhealth/fhir-types/r4/types";
import { Operation } from "@iguhealth/operation-execution";
import {
  OperationError,
  outcome,
  outcomeError,
  outcomeFatal,
  outcomeInfo,
} from "@iguhealth/operation-outcomes";

import logAuditEvent, {
  MINOR_FAILURE,
  createAuditEvent,
} from "../../../fhir-logging/auditEvents.js";
import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { getOpCTX, validateInvocationContext } from "../../utilities.js";
import { CustomCodeExecutor, Payload } from "../interface.js";

function getLambdaTags(
  ctx: IGUHealthServerCTX,
  op: OperationDefinition,
): Record<string, string> {
  return {
    tenant: ctx.tenant,
    id: op.id as string,
    versionId: op.meta?.versionId as string,
    operation: op.code,
  };
}

async function getLambda(
  client: {
    lambda: LambdaClient;
    tagging: ResourceGroupsTaggingAPI;
  },
  ctx: IGUHealthServerCTX,
  operation: Operation<unknown, unknown>,
) {
  try {
    const getResources = new GetResourcesCommand({
      ResourceTypeFilters: ["lambda"],
      TagFilters: [
        { Key: "tenant", Values: [ctx.tenant] },
        { Key: "id", Values: [operation.operationDefinition.id as string] },
      ],
    });
    const taggingResponse = await client.tagging.send(getResources);

    if (
      !taggingResponse.ResourceTagMappingList ||
      taggingResponse.ResourceTagMappingList.length < 1
    ) {
      return undefined;
    }

    if (taggingResponse.ResourceTagMappingList.length > 1) {
      throw new OperationError(
        outcomeFatal("invalid", "Duplicate functions found for operation"),
      );
    }

    const resource = taggingResponse.ResourceTagMappingList[0];

    const getFunction = new GetFunctionCommand({
      FunctionName: resource?.ResourceARN,
    });

    const response = await client.lambda.send(getFunction);

    return response;
  } catch (e) {
    ctx.logger.error(e);
    return undefined;
  }
}

function getLambdaFunctionName(
  ctx: IGUHealthServerCTX,
  operation: Operation<unknown, unknown>,
) {
  return `${ctx.environment}-${ctx.tenant}-${operation.operationDefinition.id}`;
}

async function createPayload<I, O>(
  ctx: IGUHealthServerCTX,
  op: Operation<I, O>,
  request: R4InvokeRequest,
): Promise<Payload<I>> {
  const parsedBody = op.parseToObject("in", request.body);
  const opCTX = getOpCTX(ctx, request);

  const issues = await op.validate(opCTX, "in", parsedBody);
  if (issues.length > 0) throw new OperationError(outcome(issues));

  return {
    ctx: {
      SEC_TOKEN: ctx.user.accessToken ?? "not-sec",
      API_URL: new URL(`/w/${ctx.tenant}`, process.env.API_URL).href,
      tenant: ctx.tenant,
      level: request.level,
      resourceType:
        request.level === "type" || request.level === "instance"
          ? request.resource
          : undefined,
      id: request.level === "instance" ? request.id : undefined,
    },
    input: parsedBody,
  };
}

function parseOutput(
  output: InvokeCommandOutput,
): ReturnType<typeof JSON.parse> {
  const payloadString = output.Payload?.transformToString();
  if (!payloadString)
    throw new OperationError(
      outcomeFatal("invalid", "No payload returned from lambda invocation"),
    );
  try {
    return JSON.parse(payloadString);
  } catch {
    throw new OperationError(
      outcomeFatal(
        "invalid",
        "Invalid payload returned from lambda invocation",
      ),
    );
  }
}

// Used within lambda code for setup.
async function handler<I>(event: Payload<I>) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const userHandler = require("./user");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const client = await import("@iguhealth/client/http");
  // Pass in token here and instantiate client. Later.

  const HTTPClient = client.default({
    getAccessToken: async function () {
      return event.ctx.SEC_TOKEN;
    },
    url: event.ctx.API_URL,
  });

  const ctx = {
    tenant: event.ctx.tenant,
    level: event.ctx.level,
    resourceType: event.ctx.resourceType,
    id: event.ctx.id,
    client: HTTPClient,
  };

  const output = await userHandler.handler(ctx, event.input);
  return output;
}

function createZipFile(code: string): Buffer {
  const setupCode = `exports.handler = ${handler.toString()}`;

  const zip = new AdmZip();

  zip.addFile("user.js", Buffer.alloc(code.length, code), "usercode");
  zip.addFile(
    "index.js",
    Buffer.alloc(setupCode.length, setupCode),
    "executable",
  );

  return zip.toBuffer();
}

export class AWSLambdaExecutioner implements CustomCodeExecutor {
  private lambdaClient: LambdaClient;
  private taggingClient: ResourceGroupsTaggingAPI;
  private layers: string[];
  private role: string;
  constructor({
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_ACCESS_KEY_SECRET,
    AWS_LAMBDA_LAYERS,
    AWS_ROLE,
  }: {
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_ACCESS_KEY_SECRET: string;
    AWS_LAMBDA_LAYERS: string[];
    AWS_ROLE: string;
  }) {
    this.lambdaClient = new LambdaClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_ACCESS_KEY_SECRET,
      },
    });
    this.taggingClient = new ResourceGroupsTaggingAPI({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_ACCESS_KEY_SECRET,
      },
    });
    this.layers = AWS_LAMBDA_LAYERS;
    this.role = AWS_ROLE;
  }

  async deploy<I, O>(
    ctx: IGUHealthServerCTX,
    operation: Operation<I, O>,
    environment: Record<string, string>,
    code: string,
  ): Promise<OperationOutcome> {
    const lambdaName = getLambdaFunctionName(ctx, operation);

    // Confirm lambda does not exist when lock taken.
    const existingLambda = await getLambda(
      { lambda: this.lambdaClient, tagging: this.taggingClient },
      ctx,
      operation,
    );

    const zip = createZipFile(code);

    // If lambda exists means misaligned versions so delete existing lambda to replace with new.
    if (existingLambda) {
      try {
        // Update the environment variables.
        await this.lambdaClient.send(
          new UpdateFunctionConfigurationCommand({
            FunctionName: existingLambda.Configuration?.FunctionArn,
            Environment: {
              Variables: environment,
            },
          }),
        );
        let lambda = await getLambda(
          { lambda: this.lambdaClient, tagging: this.taggingClient },
          ctx,
          operation,
        );
        // Waiting for state transition.
        while (lambda?.Configuration?.LastUpdateStatus === "InProgress") {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          lambda = await getLambda(
            { lambda: this.lambdaClient, tagging: this.taggingClient },
            ctx,
            operation,
          );
        }

        if (lambda?.Configuration?.LastUpdateStatus !== "Successful") {
          throw new OperationError(
            outcomeError(
              "exception",
              "Failed to update environment variables.",
            ),
          );
        }

        // Update function code.
        await this.lambdaClient.send(
          new UpdateFunctionCodeCommand({
            FunctionName: existingLambda.Configuration?.FunctionArn,
            ZipFile: zip as Uint8Array<ArrayBufferLike>,
          }),
        );

        return outcomeInfo("informational", "Deployment was successful.");
      } catch (err) {
        ctx.logger.error(err);
        if (err instanceof OperationError) {
          return err.operationOutcome;
        }
        if (err instanceof ResourceConflictException) {
          return outcomeError(
            "exception",
            "Failed to update function. An Update is already in progress.",
          );
        }

        return outcomeInfo("exception", "Failed to update lambda function.");
      }
    } else {
      const createFunction = new CreateFunctionCommand({
        FunctionName: lambdaName,
        Runtime: "nodejs18.x",
        Layers: this.layers,
        Handler: "index.handler",
        Role: this.role,
        Tags: getLambdaTags(ctx, operation.operationDefinition),
        Code: {
          ZipFile: zip as Uint8Array<ArrayBufferLike>,
        },
        Timeout: 10,
        Environment: {
          Variables: environment,
        },
      });
      try {
        await this.lambdaClient.send(createFunction);
        return outcomeInfo("informational", "Deployment was successful.");
      } catch (err) {
        ctx.logger.error(err);
        if (err instanceof OperationError) {
          return err.operationOutcome;
        }
        return outcomeError("exception", "Deployment failed.");
      }
    }
  }

  async execute<I, O>(
    ctx: IGUHealthServerCTX,
    operation: Operation<I, O>,
    request: R4InvokeRequest,
  ): Promise<R4InvokeResponse> {
    const invocationContextOperation = validateInvocationContext(
      operation.operationDefinition,
      request,
    );

    if (invocationContextOperation)
      throw new OperationError(invocationContextOperation);

    const payload = await createPayload(ctx, operation, request);

    const lambda = await getLambda(
      { lambda: this.lambdaClient, tagging: this.taggingClient },
      ctx,
      operation,
    );

    if (!lambda) {
      throw new OperationError(
        outcomeError(
          "not-found",
          "Operation has not been deployed. Deploy operation via $deploy op.",
        ),
      );
    }
    if (lambda?.Configuration?.LastUpdateStatus !== "Successful") {
      throw new OperationError(
        outcomeError(
          "exception",
          "Lambda is not ready to be executed either wait or redeploy.",
        ),
      );
    }

    const response = await this.lambdaClient.send(
      new InvokeCommand({
        FunctionName: lambda.Configuration?.FunctionArn,
        Payload: Buffer.from(JSON.stringify(payload)),
      }),
    );

    const output = parseOutput(response);

    if (response.FunctionError) {
      const auditEvent = await logAuditEvent(
        ctx.client,
        ctx,
        request.fhirVersion,
        createAuditEvent(
          ctx.user.payload,
          MINOR_FAILURE,
          {
            reference: `OperationDefinition/${operation.operationDefinition.id}`,
          },
          output.trace ? output.trace.join("\n") : "No trace present.",
        ),
      );
      throw new OperationError(
        outcomeFatal(
          "invalid",
          `Lambda function returned error: '${response.FunctionError}' More info captured in 'AuditEvent/${auditEvent.id}'`,
        ),
      );
    } else {
      const issues = await operation.validate(
        getOpCTX(ctx, request),
        "out",
        output,
      );
      if (issues.length > 0) throw new OperationError(outcome(issues));
      const outputParameters = operation.parseToParameters(
        "out",
        output,
      ) as unknown as Parameters;

      switch (request.level) {
        case "instance": {
          return {
            fhirVersion: request.fhirVersion,
            operation: request.operation,
            type: "invoke-response",
            level: request.level,
            body: outputParameters,
            resource: request.resource,
            id: request.id,
          };
        }
        case "type": {
          return {
            fhirVersion: request.fhirVersion,
            operation: request.operation,
            type: "invoke-response",
            resource: request.resource,
            level: request.level,
            body: outputParameters,
          };
        }
        case "system": {
          return {
            fhirVersion: request.fhirVersion,
            operation: request.operation,
            type: "invoke-response",
            level: request.level,
            body: outputParameters,
          };
        }
      }
    }
  }
}
