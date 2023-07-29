import {
  LambdaClient,
  GetFunctionCommand,
  CreateFunctionCommand,
  InvokeCommand,
} from "@aws-sdk/client-lambda";
import { Operation, OpCTX, Invocation } from "@iguhealth/operation-execution";

import { FHIRServerCTX } from "../fhirServer";
import { Executioner, InvokeRequest, InvokeResponse } from "./types";
import { resolveOperationDefinition, getOperationCode } from "./utilities";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

const client = new LambdaClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_LAMBDA_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_LAMBDA_ACCESS_KEY_SECRET as string,
  },
});

function getLambdaFunctionName(
  ctx: FHIRServerCTX,
  operation: Operation<unknown, unknown>
): string {
  const definition = operation.operationDefinition;
  if (!definition.meta)
    throw new OperationError(
      outcomeFatal("invalid", "OperationDefinition.meta is required")
    );

  return `${ctx.workspace}/${definition.meta.versionId}`;
}

async function getLambda(
  ctx: FHIRServerCTX,
  operation: Operation<unknown, unknown>
) {
  const getFunction = new GetFunctionCommand({
    FunctionName: getLambdaFunctionName(ctx, operation),
  });

  const response = await client.send(getFunction);

  return response;
}

async function createLambdaFunction(
  ctx: FHIRServerCTX,
  operation: Operation<unknown, unknown>
) {
  const lambdaName = getLambdaFunctionName(ctx, operation);
  ctx.lock.withLock(lambdaName, async () => {
    // Confirm lambda does not exist when lock taken.
    const lambda = await getLambda(ctx, operation);
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
      Role: process.env.AWS_LAMBDA_ROLE_ARN as string,
      Code: {
        ZipFile: Buffer.from(operationCode),
      },
    });

    const response = await client.send(createFunction);
    console.log(response);

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

const executor: Executioner = async (
  ctx: FHIRServerCTX,
  request: InvokeRequest
): Promise<InvokeResponse> => {
  const operationDefinition = await resolveOperationDefinition(ctx, request);
  const op = new Operation(operationDefinition);
  const opCTX = getOpCTX(ctx, request);

  const getFunction = new GetFunctionCommand({
    FunctionName: getLambdaFunctionName(ctx, op),
  });

  const response = await client.send(getFunction);
  if (!response) await createLambdaFunction(ctx, op);

  const payload = await createPayload(ctx, op, request);

  const invoke = new InvokeCommand({
    FunctionName: getLambdaFunctionName(ctx, op),
    Payload: Buffer.from(JSON.stringify(payload)),
  });

  const invokeResponse = await client.send(invoke);
  const payloadString = invokeResponse.Payload?.toString();
  if (!payloadString)
    throw new OperationError(
      outcomeFatal("invalid", "No payload returned from lambda invocation")
    );
  const output = JSON.parse(payloadString);
  await op.validate(opCTX, "out", output);

  const outputParameters = op.parseToParameters("out", output);

  switch (request.level) {
    case "instance": {
      return {
        operation: request.operation,
        type: "invoke-response",
        level: request.level,
        body: outputParameters,
        resourceType: request.resourceType,
        id: request.id,
      };
    }
    case "type": {
      return {
        operation: request.operation,
        type: "invoke-response",
        resourceType: request.resourceType,
        level: request.level,
        body: outputParameters,
      };
    }
    case "system": {
      return {
        operation: request.operation,
        type: "invoke-response",
        level: request.level,
        body: outputParameters,
      };
    }
  }
};

export default executor;
