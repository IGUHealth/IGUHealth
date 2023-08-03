import {
  LambdaClient,
  GetFunctionCommand,
  CreateFunctionCommand,
  InvokeCommand,
} from "@aws-sdk/client-lambda";
import { configDotenv } from "dotenv";
import AdmZip from "adm-zip";

import { Operation, OpCTX } from "@iguhealth/operation-execution";
import { AsynchronousClient } from "@iguhealth/client/lib/index.js";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/lib/middleware/index.js";
import { FHIRRequest } from "@iguhealth/client/lib/types.js";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";
import { AuditEvent, ResourceType, id } from "@iguhealth/fhir-types";

import { FHIRServerCTX } from "../fhirServer";
import { InvokeRequest } from "./types";
import { resolveOperationDefinition, getOperationCode } from "./utilities.js";

import logAuditEvent, { MAJOR_FAILURE } from "../logging/auditEvents.js";

configDotenv();

function getLambdaFunctionName(
  ctx: FHIRServerCTX,
  operation: Operation<unknown, unknown>
): string {
  const definition = operation.operationDefinition;
  if (!definition.meta)
    throw new OperationError(
      outcomeFatal("invalid", "OperationDefinition.meta is required")
    );

  return `${ctx.workspace}-${definition.meta.versionId}`;
}

async function getLambda(
  client: LambdaClient,
  ctx: FHIRServerCTX,
  operation: Operation<unknown, unknown>
) {
  try {
    const getFunction = new GetFunctionCommand({
      FunctionName: getLambdaFunctionName(ctx, operation),
    });

    const response = await client.send(getFunction);

    return response;
  } catch (e) {
    return undefined;
  }
}

type Payload = {
  ctx: {
    SEC_TOKEN: string;
    API_URL: string;
    workspace: FHIRServerCTX["workspace"];
    level: FHIRRequest["level"];
    resourceType?: ResourceType;
    id?: id;
  };
  input: Record<string, any>;
};

// Used within lambda code for setup.
async function handler(event: Payload, context: any) {
  const userHandler = require("./user");
  const client = await import("@iguhealth/client/lib/http/index.js");
  // Pass in token here and instantiate client. Later.
  // @ts-ignore
  const HTTPClient = new client.default({
    token: event.ctx.SEC_TOKEN,
    url: event.ctx.API_URL,
  });
  const ctx = {
    workspace: event.ctx.workspace,
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
    "executable"
  );

  return zip.toBuffer();
}

async function createLambdaFunction(
  client: LambdaClient,
  layers: string[],
  role: string,
  ctx: FHIRServerCTX,
  operation: Operation<unknown, unknown>
) {
  const lambdaName = getLambdaFunctionName(ctx, operation);
  await ctx.lock.withLock(lambdaName, async () => {
    // Confirm lambda does not exist when lock taken.
    const lambda = await getLambda(client, ctx, operation);
    if (lambda) return;

    const operationCode = await getOperationCode(
      ctx,
      operation.operationDefinition
    );

    if (!operationCode)
      throw new OperationError(
        outcomeFatal("invalid", "Could not get operation code")
      );

    const zip = createZipFile(operationCode);

    const createFunction = new CreateFunctionCommand({
      FunctionName: lambdaName,
      Runtime: "nodejs18.x",
      Layers: layers,
      Handler: "index.handler",
      Role: role,
      Tags: {
        workspace: ctx.workspace,
        id: operation.operationDefinition.id as string,
        versionId: operation.operationDefinition.meta?.versionId as string,
      },
      Code: {
        ZipFile: zip,
      },
    });

    const response = await client.send(createFunction);

    return;
  });
}

function getOpCTX(ctx: FHIRServerCTX, request: InvokeRequest): OpCTX {
  return {
    level: request.level,
    resolveType: (type: string) => {
      const sd = ctx.resolveSD(ctx, type);
      if (!sd)
        throw new OperationError(
          outcomeFatal("invalid", `Unknown type '${type}'`)
        );
      return sd;
    },
  };
}

async function createPayload(
  ctx: FHIRServerCTX,
  op: Operation<Record<string, any>, Record<string, any>>,
  request: InvokeRequest
): Promise<Payload> {
  const parsedBody = op.parseToObject("in", request.body);
  const opCTX = getOpCTX(ctx, request);
  await op.validate(opCTX, "in", parsedBody);

  return {
    ctx: {
      SEC_TOKEN: "not-sec",
      API_URL: `${process.env.API_URL}/w/${ctx.workspace}/api/v1/fhir/r4`,
      workspace: ctx.workspace,
      level: request.level,
      resourceType:
        request.level === "type" || request.level === "instance"
          ? (request.resourceType as ResourceType)
          : undefined,
      id: request.level === "instance" ? request.resourceType : undefined,
    },
    input: parsedBody,
  };
}

async function confirmLambdaExistsAndReady(
  client: LambdaClient,
  layers: string[],
  role: string,
  ctx: FHIRServerCTX,
  op: Operation<unknown, unknown>
) {
  let lambda = await getLambda(client, ctx, op);
  // Setup creation if lambda does not exist.
  if (!lambda) {
    await createLambdaFunction(client, layers, role, ctx, op);
    lambda = await getLambda(client, ctx, op);
  }

  // Confirm state is not pending and then proceed to the invocation.
  while (lambda?.Configuration?.State === "Pending") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    lambda = await getLambda(client, ctx, op);
  }

  return lambda;
}

function createExecutor(
  layers: string[],
  role: string,
  client: LambdaClient
): MiddlewareAsync<{}, FHIRServerCTX> {
  return createMiddlewareAsync<{}, FHIRServerCTX>([
    async (request, { ctx, state }, next) => {
      try {
        switch (request.type) {
          case "invoke-request": {
            const operationDefinition = await resolveOperationDefinition(
              ctx,
              request
            );
            const op = new Operation(operationDefinition);
            const opCTX = getOpCTX(ctx, request);

            const lambda = await confirmLambdaExistsAndReady(
              client,
              layers,
              role,
              ctx,
              op
            );

            const payload = await createPayload(ctx, op, request);

            const invoke = new InvokeCommand({
              FunctionName: getLambdaFunctionName(ctx, op),
              Payload: Buffer.from(JSON.stringify(payload)),
            });

            const invokeResponse = await client.send(invoke);
            const payloadString = invokeResponse.Payload?.transformToString();
            if (!payloadString)
              throw new OperationError(
                outcomeFatal(
                  "invalid",
                  "No payload returned from lambda invocation"
                )
              );
            const output = JSON.parse(payloadString);

            if (invokeResponse.FunctionError) {
              const auditEvent = await logAuditEvent(
                ctx,
                MAJOR_FAILURE,
                { reference: `OperationDefinition/${operationDefinition.id}` },
                output.trace ? output.trace.join("\n") : "No trace present."
              );
              throw new OperationError(
                outcomeFatal(
                  "invalid",
                  `Lambda function returned error: '${invokeResponse.FunctionError}' More info captured in 'AuditEvent/${auditEvent.id}'`
                )
              );
            }

            await op.validate(opCTX, "out", output);

            const outputParameters = op.parseToParameters("out", output);

            switch (request.level) {
              case "instance": {
                return {
                  ctx,
                  state,
                  response: {
                    operation: request.operation,
                    type: "invoke-response",
                    level: request.level,
                    body: outputParameters,
                    resourceType: request.resourceType,
                    id: request.id,
                  },
                };
              }
              case "type": {
                return {
                  ctx,
                  state,
                  response: {
                    operation: request.operation,
                    type: "invoke-response",
                    resourceType: request.resourceType,
                    level: request.level,
                    body: outputParameters,
                  },
                };
              }
              case "system": {
                return {
                  ctx,
                  state,
                  response: {
                    operation: request.operation,
                    type: "invoke-response",
                    level: request.level,
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
                `Invocation client only supports invoke-request not '${request.type}'`
              )
            );
        }
      } catch (e) {
        console.error(e);
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
}: Config): AsynchronousClient<{}, FHIRServerCTX> {
  const client = new LambdaClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_ACCESS_KEY_SECRET,
    },
  });
  return new AsynchronousClient<{}, FHIRServerCTX>(
    {},
    createExecutor(LAYERS, LAMBDA_ROLE, client)
  );
}
