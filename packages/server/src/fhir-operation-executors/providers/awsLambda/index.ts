import {
  CreateFunctionCommand,
  DeleteFunctionCommand,
  GetFunctionCommand,
  InvokeCommand,
  LambdaClient,
} from "@aws-sdk/client-lambda";
import {
  GetResourcesCommand,
  ResourceGroupsTaggingAPI,
} from "@aws-sdk/client-resource-groups-tagging-api";
import AdmZip from "adm-zip";
import { configDotenv } from "dotenv";

import { AsynchronousClient } from "@iguhealth/client";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { FHIRRequest } from "@iguhealth/client/types";
import { InvokeRequest } from "@iguhealth/client/types";
import {
  OperationDefinition,
  Parameters,
  ResourceType,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { Operation } from "@iguhealth/operation-execution";
import {
  OperationError,
  outcome,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../fhir-context/types.js";
import logAuditEvent, {
  MINOR_FAILURE,
} from "../../../fhir-logging/auditEvents.js";
import {
  getOpCTX,
  getOperationCode,
  resolveOperationDefinition,
  validateInvocationContext,
} from "../../utilities.js";

configDotenv();
function getLambdaFunctionName(
  ctx: FHIRServerCTX,
  operation: Operation<unknown, unknown>,
): string {
  const definition = operation.operationDefinition;
  if (!definition.meta)
    throw new OperationError(
      outcomeFatal("invalid", "OperationDefinition.meta is required"),
    );

  return `iguhealth_custom_op_${definition.id}`;
}

function getLambdaTags(
  ctx: FHIRServerCTX,
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
  ctx: FHIRServerCTX,
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
    return undefined;
  }
}

type Payload = {
  ctx: {
    SEC_TOKEN: string;
    API_URL: string;
    tenant: FHIRServerCTX["tenant"];
    level: FHIRRequest["level"];
    resourceType?: ResourceType;
    id?: id;
  };
  input: Record<string, unknown>;
};

// Used within lambda code for setup.
async function handler(event: Payload, _context: Payload["ctx"]) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const userHandler = require("./user");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
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

async function createEnvironmentVariables(
  ctx: FHIRServerCTX,
  operationDefinition: OperationDefinition,
): Promise<Record<string, string>> {
  const environment = (
    await Promise.all(
      (operationDefinition.extension || [])
        .filter(
          (ext) =>
            ext.url ===
            "https://iguhealth.app/Extension/OperationDefinition/environment-variable",
        )
        .map(async (ext) => {
          const key = ext.valueString;
          const valueExt = ext.extension?.find(
            (ext) =>
              ext.url ===
              "https://iguhealth.app/Extension/OperationDefinition/environment-variable-value",
          );

          let value;
          if (
            valueExt?._valueString?.extension?.find(
              (e) => e.url === "https://iguhealth.app/Extension/encrypt-value",
            ) &&
            valueExt?.valueString
          ) {
            value = await ctx.encryptionProvider?.decrypt(
              { workspace: ctx.tenant },
              valueExt.valueString,
            );
          } else {
            value = valueExt?.valueString;
          }
          return [key, value];
        }),
    )
  ).reduce((acc, [key, value]) => {
    if (!key || !value) return acc;
    return { ...acc, [key]: value };
  }, {});

  return environment;
}

async function createOrUpdateLambda(
  client: {
    lambda: LambdaClient;
    tagging: ResourceGroupsTaggingAPI;
  },
  layers: string[],
  role: string,
  ctx: FHIRServerCTX,
  operation: Operation<unknown, unknown>,
) {
  const lambdaName = getLambdaFunctionName(ctx, operation);
  await ctx.lock.withLock(lambdaName, async () => {
    // Confirm lambda does not exist when lock taken.
    const lambda = await getLambda(client, ctx, operation);
    if (
      lambda?.Tags?.["versionId"] ===
      operation.operationDefinition.meta?.versionId
    )
      return;

    const operationCode = await getOperationCode(
      ctx,
      operation.operationDefinition,
    );

    if (!operationCode)
      throw new OperationError(
        outcomeFatal("invalid", "Could not get operation code"),
      );

    const zip = createZipFile(operationCode);

    // If lambda exists means misaligned versions so delete existing lambda to replace with new.
    if (lambda) {
      await client.lambda.send(
        new DeleteFunctionCommand({
          FunctionName: lambdaName,
        }),
      );
    }
    const createFunction = new CreateFunctionCommand({
      FunctionName: lambdaName,
      Runtime: "nodejs18.x",
      Layers: layers,
      Handler: "index.handler",
      Role: role,
      Tags: getLambdaTags(ctx, operation.operationDefinition),
      Code: {
        ZipFile: zip,
      },
      Timeout: 10,
      Environment: {
        Variables: await createEnvironmentVariables(
          ctx,
          operation.operationDefinition,
        ),
      },
    });

    const _response = await client.lambda.send(createFunction);

    return;
  });
}

async function createPayload(
  ctx: FHIRServerCTX,
  op: Operation<Record<string, unknown>, Record<string, unknown>>,
  request: InvokeRequest,
): Promise<Payload> {
  const parsedBody = op.parseToObject("in", request.body);
  const opCTX = getOpCTX(ctx, request);

  const issues = await op.validate(opCTX, "in", parsedBody);
  if (issues.length > 0) throw new OperationError(outcome(issues));

  if (!process.env.API_URL)
    throw new OperationError(outcomeFatal("invalid", "API_URL is not set"));

  return {
    ctx: {
      SEC_TOKEN: ctx.user.accessToken || "not-sec",
      API_URL: new URL(`/w/${ctx.tenant}/api/v1/fhir/r4`, process.env.API_URL)
        .href,
      tenant: ctx.tenant,
      level: request.level,
      resourceType:
        request.level === "type" || request.level === "instance"
          ? request.resourceType
          : undefined,
      id: request.level === "instance" ? request.id : undefined,
    },
    input: parsedBody,
  };
}

async function confirmLambdaExistsAndReady(
  client: {
    lambda: LambdaClient;
    tagging: ResourceGroupsTaggingAPI;
  },
  layers: string[],
  role: string,
  ctx: FHIRServerCTX,
  op: Operation<unknown, unknown>,
) {
  let lambda = await getLambda(client, ctx, op);
  // Setup creation if lambda does not exist.
  if (
    !lambda ||
    lambda.Tags?.versionId !== op.operationDefinition.meta?.versionId
  ) {
    await createOrUpdateLambda(client, layers, role, ctx, op);
    lambda = await getLambda(client, ctx, op);
  }

  // Confirm the lambda is found and that the versionID in tag align.
  // Confirm state is not pending and then proceed to the invocation.
  while (
    lambda?.Configuration?.LastUpdateStatus !== "Successful" ||
    lambda.Tags?.versionId !== op.operationDefinition.meta?.versionId
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    lambda = await getLambda(client, ctx, op);
    if (lambda?.Configuration?.LastUpdateStatus === "Failed") {
      throw new OperationError(
        outcomeFatal("exception", "Lambda failed to update."),
      );
    }
  }

  return lambda;
}

function createExecutor(
  layers: string[],
  role: string,
  client: {
    lambda: LambdaClient;
    tagging: ResourceGroupsTaggingAPI;
  },
): MiddlewareAsync<unknown, FHIRServerCTX> {
  return createMiddlewareAsync<unknown, FHIRServerCTX>([
    async (context) => {
      try {
        /* eslint-disable no-fallthrough */
        switch (context.request.type) {
          case "invoke-request": {
            const operationDefinition = await resolveOperationDefinition(
              context.ctx.client,
              context.ctx,
              context.request.operation,
            );

            const op = new Operation<
              Record<string, unknown>,
              Record<string, unknown>
            >(operationDefinition);

            const opCTX = getOpCTX(context.ctx, context.request);

            const invocationContextOperation = validateInvocationContext(
              op.operationDefinition,
              context.request,
            );

            const payload = await createPayload(
              context.ctx,
              op,
              context.request,
            );

            if (invocationContextOperation)
              throw new OperationError(invocationContextOperation);
            const lambda = await confirmLambdaExistsAndReady(
              client,
              layers,
              role,
              context.ctx,
              op,
            );

            const invoke = new InvokeCommand({
              FunctionName: lambda.Configuration?.FunctionArn,
              Payload: Buffer.from(JSON.stringify(payload)),
            });

            const invokeResponse = await client.lambda.send(invoke);
            const payloadString = invokeResponse.Payload?.transformToString();
            if (!payloadString)
              throw new OperationError(
                outcomeFatal(
                  "invalid",
                  "No payload returned from lambda invocation",
                ),
              );
            const output = JSON.parse(payloadString);

            if (invokeResponse.FunctionError) {
              const auditEvent = await logAuditEvent(
                context.ctx.client,
                context.ctx,
                MINOR_FAILURE,
                { reference: `OperationDefinition/${operationDefinition.id}` },
                output.trace ? output.trace.join("\n") : "No trace present.",
              );
              throw new OperationError(
                outcomeFatal(
                  "invalid",
                  `Lambda function returned error: '${invokeResponse.FunctionError}' More info captured in 'AuditEvent/${auditEvent.id}'`,
                ),
              );
            }

            const issues = await op.validate(opCTX, "out", output);
            if (issues.length > 0) throw new OperationError(outcome(issues));

            const outputParameters = op.parseToParameters(
              "out",
              output,
            ) as unknown as Parameters;

            switch (context.request.level) {
              case "instance": {
                return {
                  ...context,
                  response: {
                    fhirVersion: "4.0",
                    operation: context.request.operation,
                    type: "invoke-response",
                    level: context.request.level,
                    body: outputParameters,
                    resourceType: context.request.resourceType,
                    id: context.request.id,
                  },
                };
              }
              case "type": {
                return {
                  ...context,
                  response: {
                    fhirVersion: "4.0",
                    operation: context.request.operation,
                    type: "invoke-response",
                    resourceType: context.request.resourceType,
                    level: context.request.level,
                    body: outputParameters,
                  },
                };
              }
              case "system": {
                return {
                  ...context,
                  response: {
                    fhirVersion: "4.0",
                    operation: context.request.operation,
                    type: "invoke-response",
                    level: context.request.level,
                    body: outputParameters,
                  },
                };
              }
            }
          }
          default:
            throw new OperationError(
              outcomeFatal(
                "invalid",
                `Invocation client only supports invoke-request not '${context.request.type}'`,
              ),
            );
        }
      } catch (e) {
        context.ctx.logger.error(e);
        throw e;
      }
    },
  ]);
}

type Config = {
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_ACCESS_KEY_SECRET: string;
  LAMBDA_ROLE: string;
  LAYERS: string[];
};

export default function createLambdaExecutioner({
  AWS_REGION,
  LAYERS,
  LAMBDA_ROLE,
  AWS_ACCESS_KEY_ID,
  AWS_ACCESS_KEY_SECRET,
}: Config): AsynchronousClient<unknown, FHIRServerCTX> {
  const lambdaClient = new LambdaClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_ACCESS_KEY_SECRET,
    },
  });
  const taggingClient = new ResourceGroupsTaggingAPI({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_ACCESS_KEY_SECRET,
    },
  });

  return new AsynchronousClient<unknown, FHIRServerCTX>(
    {},
    createExecutor(LAYERS, LAMBDA_ROLE, {
      lambda: lambdaClient,
      tagging: taggingClient,
    }),
  );
}
