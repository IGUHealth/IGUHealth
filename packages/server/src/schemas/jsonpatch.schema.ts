export default {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    path: {
      description: "A JSON Pointer path.",
      type: "string",
    },
  },
  items: {
    oneOf: [
      {
        additionalProperties: false,
        type: "object",
        required: ["value", "op", "path"],
        properties: {
          path: {
            $ref: "#/definitions/path",
          },
          op: {
            description: "The operation to perform.",
            type: "string",
            enum: ["add", "replace", "test"],
          },
          value: {
            description: "The value to add, replace or test.",
          },
        },
      },
      {
        additionalProperties: false,
        type: "object",
        required: ["op", "path"],
        properties: {
          path: {
            $ref: "#/definitions/path",
          },
          op: {
            description: "The operation to perform.",
            type: "string",
            const: "remove",
          },
        },
      },
      {
        additionalProperties: false,
        type: "object",
        required: ["from", "op", "path"],
        properties: {
          path: {
            $ref: "#/definitions/path",
          },
          op: {
            description: "The operation to perform.",
            type: "string",
            enum: ["move", "copy"],
          },
          from: {
            $ref: "#/definitions/path",
            description:
              "A JSON Pointer path pointing to the location to move/copy from.",
          },
        },
      },
    ],
  },
  title: "JSON schema for JSONPatch files",
  type: "array",
  $id: "https://json.schemastore.org/json-patch.json",
};
