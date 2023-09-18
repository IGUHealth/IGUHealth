# IGUHealth Client

HTTPClient and classes + middleware to define your own clients to conform to the FHIR specification.

## Client Types

Clients are built using middleware. To define a client you create a middleware handler and pass it in as an argument to either the SynchronousClient, AsynchronousClient constructor.

## Middleware

### Arguments

Middleware is built using an array of functions each function is passed the following arguments:

| Name       | Description                                            | type        |
| ---------- | ------------------------------------------------------ | ----------- |
| request    | A FHIRRequest object information varies based on type. | FHIRRequest |
| args       | Object contains state and ctx                          | {state,ctx} |
| args.state | Internal state of the middleware.                      | unknown     |
| args.ctx   | Context of the call (will vary based on client).       | unknown     |

### Response

Middleware should return the following object:

```typescript
{
  ctx: CTX;
  state: State;
  response: FHIRResponse;
}
```

Depending on whether client is asynchronous or syncrhonous will either be the object directly or a promise resolving to this object.

### AsynchronousClient

Constructor that allows you to create asynchronous FHIR clients.

```typescript
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "@iguhealth/client/lib/middleware/index.js";
import { AsynchronousClient } from "@iguhealth/client/lib/index.js";

return new AsynchronousClient<StateType, CTX>(
  initialState,
  createMiddlewareAsync<State, CTX>(middlewarefunctions)
);
```

### SynchronousClient

Constructor that allows you to create synchronous FHIR clients.

```typescript
import {
  createMiddlewareSync,
  MiddlewareSync,
} from "@iguhealth/client/lib/middleware/index.js";
import { SynchronousClient } from "@iguhealth/client";

return new SynchronousClient<StateType, CTX>(
  initialState,
  createMiddlewareSync<State, CTX>(middlewarefunctions)
);
```

## HTTPClient

We provide an HTTP client by default that allows you to call FHIR servers via API calls.
Supports all the method calls within the AsynchronousClient interface:

```typescript
export interface FHIRClientAsync<CTX> {
  request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse>;
  search_system(
    ctx: CTX,
    parameters: ParsedParameter<string | number>[]
  ): Promise<{ total?: number; resources: Resource[] }>;
  search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    parameters: ParsedParameter<string | number>[]
  ): Promise<{ total?: number; resources: AResource<T>[] }>;
  create<T extends Resource>(ctx: CTX, resource: T): Promise<T>;
  update<T extends Resource>(ctx: CTX, resource: T): Promise<T>;
  patch<T extends Resource>(ctx: CTX, resource: T, patches: any): Promise<T>;
  read<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id
  ): Promise<AResource<T> | undefined>;
  vread<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    versionId: id
  ): Promise<AResource<T> | undefined>;
  delete(ctx: CTX, resourceType: ResourceType, id: id): Promise<void>;
  historySystem(ctx: CTX): Promise<Resource[]>;
  historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T
  ): Promise<AResource<T>[]>;
  historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id
  ): Promise<AResource<T>[]>;
  invoke_system<Op extends IOperation<any, any>>(
    op: Op,
    ctx: CTX,
    input: OPMetadata<Op>["Input"]
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_type<Op extends IOperation<any, any>, Type extends ResourceType>(
    op: Op,
    ctx: CTX,
    resourceType: Type,
    input: OPMetadata<Op>["Input"]
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_instance<Op extends IOperation<any, any>, Type extends ResourceType>(
    op: Op,
    ctx: CTX,
    resourceType: Type,
    id: id,
    input: OPMetadata<Op>["Input"]
  ): Promise<OPMetadata<Op>["Output"]>;
}
```

### Usage

```typescript
import { expect, test } from "@jest/globals";
import { OperationDefinition } from "@iguhealth/fhir-types/r4/types";

import HTTPClient from "@iguhealth/client/http";

const client = HTTPClient({
  url: "FHIR_API_ROOT_URL",
  getAccessToken: async function () {
    return "API TOKEN";
  },
});

const operationDefinition: OperationDefinition = {
  resourceType: "OperationDefinition",
  name: "test",
  status: "draft",
  kind: "operation",
  code: "my-operation",
  system: false,
  instance: false,
  type: false,
  parameter: [],
};
const response = await client.create({}, operationDefinition);
expect(response).toMatchObject({
  resourceType: "OperationDefinition",
  name: "test",
  status: "draft",
  kind: "operation",
  code: "my-operation",
  system: false,
  instance: false,
  type: false,
  parameter: [],
});

await client.delete({}, "OperationDefinition", response.id as string);
```
