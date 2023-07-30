import {
  LambdaClient,
  GetFunctionCommand,
  CreateFunctionCommand,
  InvokeCommand,
} from "@aws-sdk/client-lambda";
import { Operation, OpCTX } from "@iguhealth/operation-execution";

import { AsynchronousClient } from "../client/index.js";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "../client/middleware/index.js";
import { FHIRServerCTX } from "../fhirServer";
import { InvokeRequest } from "./types";
import { resolveOperationDefinition, getOperationCode } from "./utilities.js";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

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

async function createLambdaFunction(
  client: LambdaClient,
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

    const createFunction = new CreateFunctionCommand({
      FunctionName: lambdaName,
      Runtime: "nodejs18.x",
      Handler: "index.handler",
      Role: role,
      Tags: {
        workspace: ctx.workspace,
        id: operation.operationDefinition.id as string,
        versionId: operation.operationDefinition.meta?.versionId as string,
      },
      Code: {
        ZipFile: operationCode,
      },
    });

    const response = await client.send(createFunction);

    return;
  });
}

type Payload = {
  ctx: {};
  input: unknown;
};

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
  op: Operation<unknown, unknown>,
  request: InvokeRequest
): Promise<Payload> {
  const parsedBody = op.parseToObject("in", request.body);
  const opCTX = getOpCTX(ctx, request);
  await op.validate(opCTX, "in", parsedBody);

  return {
    ctx: {
      // Include token here later to allow api calls.
    },
    input: parsedBody,
  };
}

async function confirmLambdaExistsAndReady(
  client: LambdaClient,
  role: string,
  ctx: FHIRServerCTX,
  op: Operation<unknown, unknown>
) {
  let lambda = await getLambda(client, ctx, op);
  // Setup creation if lambda does not exist.
  if (!lambda) {
    await createLambdaFunction(client, role, ctx, op);
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
};

export default function createLambdaExecutioner({
  AWS_REGION,
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
    createExecutor(LAMBDA_ROLE, client)
  );
}
