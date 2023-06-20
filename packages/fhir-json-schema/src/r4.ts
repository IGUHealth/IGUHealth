import schema from "@genfhi/artifacts/r4/fhir.schema.json";
import draft6MetaSchema from "ajv/lib/refs/json-schema-draft-06.json";
import Ajv from "ajv";
// discriminator: true, strict: false
const ajv = new Ajv({}); // options can be passed, e.g. {allErrors: true}
ajv.addMetaSchema(draft6MetaSchema);

const validator = ajv.compile(schema);

// const validator2 = ajv.compile({
//   ...schema,
//   discriminator: undefined,
//   $id: "date",
//   oneOf: [
//     {
//       $ref: "#/definitions/date",
//     },
//   ],
// });

// console.log(validator2("1980-01-01"));

export default validator;
