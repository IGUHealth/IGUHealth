// import { FHIRRequest } from "@iguhealth/client/lib/types";
// import {
//   AccessPolicyV2,
//   Membership,
//   Patient,
//   code,
// } from "@iguhealth/fhir-types/r4/types";
// import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

// import { SMARTResourceScope } from "../../authN/oidc/scopes/parse.js";
// import { IGUHealthServerCTX } from "../../fhir-api/types.js";

// // Pulled from patient compartments definition here: [https://hl7.org/fhir/R4/compartmentdefinition-patient.html].
// const patientCompartments: Record<string, string[] | undefined> = {
//   Account: ["subject"],
//   AdverseEvent: ["subject"],
//   AllergyIntolerance: ["patient", "recorder", "asserter"],
//   Appointment: ["actor"],
//   AppointmentResponse: ["actor"],
//   AuditEvent: ["patient"],
//   Basic: ["patient", "author"],
//   BodyStructure: ["patient"],
//   CarePlan: ["patient", "performer"],
//   CareTeam: ["patient", "participant"],
//   ChargeItem: ["subject"],
//   Claim: ["patient", "payee"],
//   ClaimResponse: ["patient"],
//   ClinicalImpression: ["subject"],
//   Communication: ["subject", "sender", "recipient"],
//   CommunicationRequest: ["subject", "sender", "recipient", "requester"],
//   Composition: ["subject", "author", "attester"],
//   Condition: ["patient", "asserter"],
//   Consent: ["patient"],
//   Coverage: ["policy-holder", "subscriber", "beneficiary orpayor"],
//   CoverageEligibilityRequest: ["patient"],
//   CoverageEligibilityResponse: ["patient"],
//   DetectedIssue: ["patient"],
//   DeviceRequest: ["subject", "performer"],
//   DeviceUseStatement: ["subject"],
//   DiagnosticReport: ["subject"],
//   DocumentManifest: ["subject", "author", "recipient"],
//   DocumentReference: ["subject", "author"],
//   Encounter: ["patient"],
//   EnrollmentRequest: ["subject"],
//   EpisodeOfCare: ["patient"],
//   ExplanationOfBenefit: ["patient", "payee"],
//   FamilyMemberHistory: ["patient"],
//   Flag: ["patient"],
//   Goal: ["patient"],
//   Group: ["member"],
//   ImagingStudy: ["patient"],
//   Immunization: ["patient"],
//   ImmunizationEvaluation: ["patient"],
//   ImmunizationRecommendation: ["patient"],
//   Invoice: ["subject", "patient", "recipient"],
//   List: ["subject", "source"],
//   MeasureReport: ["patient"],
//   Media: ["subject"],
//   MedicationAdministration: ["patient", "performer", "subject"],
//   MedicationDispense: ["subject", "patient", "receiver"],
//   MedicationRequest: ["subject"],
//   MedicationStatement: ["subject"],
//   MolecularSequence: ["patient"],
//   NutritionOrder: ["patient"],
//   Observation: ["subject", "performer"],
//   Patient: ["link"],
//   Person: ["patient"],
//   Procedure: ["patient", "performer"],
//   Provenance: ["patient"],
//   QuestionnaireResponse: ["subject", "author"],
//   RelatedPerson: ["patient"],
//   RequestGroup: ["subject", "participant"],
//   ResearchSubject: ["individual"],
//   RiskAssessment: ["subject"],
//   Schedule: ["actor"],
//   ServiceRequest: ["subject", "performer"],
//   Specimen: ["subject"],
//   SupplyDelivery: ["patient"],
//   SupplyRequest: ["subject"],
//   VisionPrescription: ["patient"],
// };

// export async function generatePatientScopePolicy(
//   patient: Patient,
//   scope: SMARTResourceScope,
//   request: FHIRRequest,
// ): Promise<AccessPolicyV2> {
//   if (scope.level !== "patient") {
//     throw new OperationError(outcomeFatal("exception", "Invalid scope level"));
//   }

//   switch (request.type) {
//     case "read-request": {
//       const params = patientCompartments[request.resource];
//       if (!params) {
//         throw new OperationError(outcomeFatal("exception", "Invalid resource"));
//       }

//       return {
//         name: "Patient Scope access",
//         engine: "rule-engine" as code,
//         resourceType: "AccessPolicyV2",
//         attribute: [
//           {
//             attributeId: "resourceFilter" as id,
//             operation: {
//               type: "search-request" as code,
//               path: {
//                 language: "text/fhirpath" as code,
//                 expression: `'${request.resource}'`,
//               },
//               params: {
//                 language: "text/fhirpath" as code,
//                 expression: `_id=${request.id} and ${params[0]}=Patient/${patient.id}`,
//               },
//             },
//           },
//         ],
//         rule: [
//           {
//             name: "Access",
//             condition: {
//               expression: {
//                 language: "text/fhirpath",
//                 expression: "%resourceFilter.result",
//               },
//             },
//           },
//         ],
//       } as AccessPolicyV2;
//     }
//     case "create-request": {
//     }
//     case "delete-request": {
//     }
//     case "search-request": {
//     }
//     case "patch-request": {
//       throw new OperationError(
//         outcomeError(
//           "forbidden",
//           "Patch requests are not supported for patient access.",
//         ),
//       );
//     }
//     case "update-request": {
//     }
//   }
// }
