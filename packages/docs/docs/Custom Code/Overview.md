# Overview

## Extending with RPCs

RPC (Remote Procedure Calls) are the main approach for extending the server.
The main advantages over writing custom code on the server is:

- Can be tied to subscriptions for event driven workflows.
- Do not require recompiling the server.
- Isolated per tenant.

### Authoring

We use [OperationDefinitions](https://hl7.org/fhir/r4/operationdefinition.html) to write RPCs.

#### Writing the interface

Interface for the Operation is defined on Operation.parameter. You specify inputs via parameter.use set to "in"
and the output of your code via parameter.use set to "out"

For example the following:

```json
"parameter": [
    {
      "max": "1",
      "min": 1,
      "use": "in",
      "name": "body",
      "type": "string"
    }
    {
      "max": "1",
      "min": 1,
      "use": "out",
      "name": "test",
      "type": "string"
    },
    {
      "max": "1",
      "min": 1,
      "use": "out",
      "name": "op",
      "type": "OperationDefinition"
    }
  ],
```

Will set the interface to expect a required body parameter (min is set to 1) and limit it's cardinality to be 1..1
It will than output a required test field of type string with cardinality 1..1 and an op field of type OperationDefinition with cardinality 1..1.

##### Output and Input Type

To call the RPC you than send a [Parameters](https://hl7.org/fhir/r4/parameters.html) resource. In the example above you could send and receive the following input and output

###### Input

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "body",
      "valueString": "body value"
    }
  ]
}
```

###### Output

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "test",
      "valueString": "test output"
    },
    {
      "name": "op",
      "resource": {
        "code": "testing",
        "kind": "operation",
        "name": "Test Operation",
        "type": false,
        "status": "active",
        "system": true,
        "instance": false,
        "parameter": [
          {
            "max": "1",
            "min": 1,
            "use": "out",
            "name": "test",
            "type": "string"
          },
          {
            "max": "1",
            "min": 1,
            "use": "out",
            "name": "op",
            "type": "OperationDefinition"
          }
        ],
        "resourceType": "OperationDefinition"
      }
    }
  ]
}
```

With our client library we allow you to send a simplified JS record form which we translate to Parameters above. In the above example this would look as follows:

```js
const output = client.invoke_system(op, ctx, { body: "body value" });
// Output will be following structure: {test: "test output", op: {...op.resource above}}
```

#### Writing Code

Code is written as javascript code and is saved on the OperationDefinition via the extension `https://iguhealth.github.io/fhir-operation-definition/operation-code` for example:

```json
{
  "resourceType": "OperationDefinition",
  "extension": [
    {
      "url": "https://iguhealth.github.io/fhir-operation-definition/operation-code",
      "valueString": "exports.handler = async function(ctx, param){ \n  const fp = await import('@iguhealth/fhirpath');\n  const op = await ctx.client.search({}, 'OperationDefinition', []);\n  return {op: op, test: fp.evaluate('$this.kind', op.resources[0])[0] + \"TESTING\" }\n}"
    }
  ]
}
```

##### Code interface

```js
exports.handler = async function (ctx, param) {
  return; // return {output parameter};
};
```

| Name             | Type       | Description                                                            |
| ---------------- | ---------- | ---------------------------------------------------------------------- |
| ctx.tenant       | string     | The tenant id that called the operation                                |
| ctx.level        | string     | The level of the rpc call, can be system, type or instance             |
| ctx.resourceType | string     | If level is instance or type this will be the resourceType of the call |
| ctx.id           | string     | If level is instance will be the id of the resource called             |
| ctx.client       | HTTPClient | Client that allows you to call API from the RPC example below          |
| param            | JS Object  | Parsed parameters object (see above for example)                       |
| return           | JS Object  | Parsed parameters object for the output (see above for example)        |

An example that satisfies the above interface is as follows:

```js
exports.handler = async function (ctx, param) {
  const fp = await import("@iguhealth/fhirpath");
  const search = await ctx.client.search({}, "OperationDefinition", []);
  return {
    op: op,
    test: "test",
  };
};
```

#### Secrets and Environment Variables

To use environment variables use the following extension on `OperationDefinition.extension`

```json
{
  "url": "https://iguhealth.app/Extension/OperationDefinition/environment-variable",
  "extension": [
    {
      "url": "https://iguhealth.app/Extension/OperationDefinition/environment-variable-value",
      "valueString": "variable-value"
    }
  ],
  "valueString": "variable-name"
}
```

Within code you can then access the value via `process.env[variable-name]`

```javascript
exports.handler = async function (ctx, param) {
  const variablevalue = process.env["variable-value"];
};
```

##### Encryption

If your value is a secret encrypt it automatically via the following extension on variable-value

```json
 "_valueString": {
    "extension": [
      {
        "url": "https://iguhealth.app/Extension/encrypt-value",
        "valueString": ""
      }
    ]
  }
```

In the example above the following will automatically encrypt the value on update for variable-value.

```json
{
  "url": "https://iguhealth.app/Extension/OperationDefinition/environment-variable",
  "extension": [
    {
      "url": "https://iguhealth.app/Extension/OperationDefinition/environment-variable-value",
      "valueString": "variable-value"
      "_valueString": {
         "extension": [
          {
            "url": "https://iguhealth.app/Extension/encrypt-value",
            "valueString": ""
          }
        ]
      }
    }
  ],
  "valueString": "variable-name"
}
```

#### Extending with third party libraries

Libraries we default support in execution environment are as follows:

- "@iguhealth/artifacts": "^0.1.7",
- "@iguhealth/client": "^0.4.0",
- "@iguhealth/fhirpath": "^0.1.11",
- "@iguhealth/operation-execution": "^0.3.6",
- "@iguhealth/operation-outcomes": "^0.1.7",
- "axios": "^1.1.3",
- "twilio": "^3.83.1",
- "uuid": "^9.0.0"

To add additional libraries you can email us or package them within your JS code.
