import {
  CreateFunctionCommand,
  GetFunctionCommand,
  InvokeCommand,
  InvokeCommandOutput,
  LambdaClient,
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
  Parameters,
} from "@iguhealth/fhir-types/r4/types";
import { Operation } from "@iguhealth/operation-execution";
import {
  OperationError,
  outcome,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";
import logAuditEvent, {
  MINOR_FAILURE,
  createAuditEvent,
} from "../../fhir-logging/auditEvents.js";
import { getOpCTX } from "../../fhir-operation-executors/utilities.js";
import { CustomCodeExecutor } from "./interface.js";
import { Payload } from "./types.js";

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
  return `${ctx.environment}:${ctx.tenant}:${operation.operationDefinition.id}`;
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

function createZipFile(code: string | Buffer): Buffer {
  const zip = new AdmZip();
  let buffer: Buffer;
  if (typeof code === "string") {
    buffer = Buffer.alloc(code.length, code);
  } else {
    buffer = code;
  }

  zip.addFile("index.js", buffer, "executable");
  return zip.toBuffer();
}

export class AWSLambdaExecutioner implements CustomCodeExecutor {
  private lambdaClient: LambdaClient;
  private taggingClient: ResourceGroupsTaggingAPI;
  private layers: string[];
  private role: string;
  constructor(
    AWS_REGION: string,
    AWS_ACCESS_KEY_ID: string,
    AWS_ACCESS_KEY_SECRET: string,
    layers: string[],
    role: string,
  ) {
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
    this.layers = layers;
    this.role = role;
  }

  async deploy<I, O>(
    ctx: IGUHealthServerCTX,
    operation: Operation<I, O>,
    environment: Record<string, string>,
    code: string | Buffer,
  ): Promise<boolean> {
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
        await Promise.all([
          await this.lambdaClient.send(
            new UpdateFunctionCodeCommand({
              FunctionName: existingLambda.Configuration?.FunctionArn,
              ZipFile: zip,
            }),
          ),
          // Update the environment variables.
          await this.lambdaClient.send(
            new UpdateFunctionConfigurationCommand({
              FunctionName: existingLambda.Configuration?.FunctionArn,
              Environment: {
                Variables: environment,
              },
            }),
          ),
        ]);
        return true;
      } catch {
        return false;
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
          ZipFile: zip,
        },
        Timeout: 10,
        Environment: {
          Variables: environment,
        },
      });
      try {
        const _response = await this.lambdaClient.send(createFunction);
        return true;
      } catch {
        return false;
      }
    }
  }

  async execute<I, O>(
    ctx: IGUHealthServerCTX,
    operation: Operation<I, O>,
    request: R4InvokeRequest,
  ): Promise<R4InvokeResponse> {
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

    const payload = await createPayload(ctx, operation, request);

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
