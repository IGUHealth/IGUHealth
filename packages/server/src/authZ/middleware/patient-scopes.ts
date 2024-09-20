import { FHIRRequest } from "@iguhealth/client/lib/types";
import { AccessPolicyV2, code, id } from "@iguhealth/fhir-types/r4/types";
import { AllResourceTypes } from "@iguhealth/fhir-types/versions";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { SMARTResourceScope } from "../../authN/oidc/scopes/parse.js";
import { IGUHealthServerCTX, asRoot } from "../../fhir-api/types.js";
import { searchResources } from "../../fhir-storage/utilities/search/parameters.js";

// Pulled from patient compartments definition here: [https://hl7.org/fhir/R4/compartmentdefinition-patient.html].
const patientCompartments: Record<string, string[] | undefined> = {
  Account: ["subject"],
  AdverseEvent: ["subject"],
  AllergyIntolerance: ["patient", "recorder", "asserter"],
  Appointment: ["actor"],
  AppointmentResponse: ["actor"],
  AuditEvent: ["patient"],
  Basic: ["patient", "author"],
  BodyStructure: ["patient"],
  CarePlan: ["patient", "performer"],
  CareTeam: ["patient", "participant"],
  ChargeItem: ["subject"],
  Claim: ["patient", "payee"],
  ClaimResponse: ["patient"],
  ClinicalImpression: ["subject"],
  Communication: ["subject", "sender", "recipient"],
  CommunicationRequest: ["subject", "sender", "recipient", "requester"],
  Composition: ["subject", "author", "attester"],
  Condition: ["patient", "asserter"],
  Consent: ["patient"],
  Coverage: ["policy-holder", "subscriber", "beneficiary orpayor"],
  CoverageEligibilityRequest: ["patient"],
  CoverageEligibilityResponse: ["patient"],
  DetectedIssue: ["patient"],
  DeviceRequest: ["subject", "performer"],
  DeviceUseStatement: ["subject"],
  DiagnosticReport: ["subject", "patient"],
  DocumentManifest: ["subject", "author", "recipient"],
  DocumentReference: ["subject", "author", "patient"],
  Encounter: ["patient"],
  EnrollmentRequest: ["subject"],
  EpisodeOfCare: ["patient"],
  ExplanationOfBenefit: ["patient", "payee"],
  FamilyMemberHistory: ["patient"],
  Flag: ["patient"],
  Goal: ["patient"],
  Group: ["member"],
  ImagingStudy: ["patient"],
  Immunization: ["patient"],
  ImmunizationEvaluation: ["patient"],
  ImmunizationRecommendation: ["patient"],
  Invoice: ["subject", "patient", "recipient"],
  List: ["subject", "source"],
  MeasureReport: ["patient"],
  Media: ["subject"],
  MedicationAdministration: ["patient", "performer", "subject"],
  MedicationDispense: ["subject", "patient", "receiver"],
  MedicationRequest: ["subject", "patient"],
  MedicationStatement: ["subject"],
  MolecularSequence: ["patient"],
  NutritionOrder: ["patient"],
  Observation: ["subject", "performer", "patient"],
  Patient: ["link", "_id"],
  Person: ["patient"],
  Procedure: ["patient", "performer"],
  Provenance: ["patient"],
  QuestionnaireResponse: ["subject", "author"],
  RelatedPerson: ["patient"],
  RequestGroup: ["subject", "participant"],
  ResearchSubject: ["individual"],
  RiskAssessment: ["subject"],
  Schedule: ["actor"],
  ServiceRequest: ["subject", "performer"],
  Specimen: ["subject"],
  SupplyDelivery: ["patient"],
  SupplyRequest: ["subject"],
  VisionPrescription: ["patient"],

  // Added Resources from outside of the Patient compartment definition.
  Device: ["patient"],
};

function getResourceFilter(
  id: string,
  request: FHIRRequest,
): NonNullable<AccessPolicyV2["attribute"]>[number] {
  if (!("resource" in request)) {
    throw new OperationError(outcomeFatal("exception", "Invalid request"));
  }

  // Use _id parameter for patient.
  const params =
    request.resource === "Patient"
      ? ["_id"]
      : patientCompartments[request.resource];
  if (!params) {
    throw new OperationError(outcomeFatal("exception", "Invalid resource"));
  }
  return {
    attributeId: id as id,
    operation: {
      type: "search-type",
      path: {
        language: "application/x-fhir-query",
        expression: "{{%request.resource}}",
      },
      params: {
        language: "application/x-fhir-query",
        expression: `${params[0]}={{%user.payload.patient}}&_count=100`,
      },
    },
  } as NonNullable<AccessPolicyV2["attribute"]>[number];
}

export async function generatePatientScopePolicy(
  ctx: IGUHealthServerCTX,
  scope: SMARTResourceScope,
  request: FHIRRequest,
): Promise<AccessPolicyV2> {
  if (scope.level !== "patient") {
    throw new OperationError(outcomeFatal("exception", "Invalid scope level"));
  }

  switch (request.type) {
    case "read-request": {
      return {
        name: "Patient Scope access",
        engine: "rule-engine" as code,
        resourceType: "AccessPolicyV2",
        attribute: [getResourceFilter("resourceFilter", request)],
        rule: [
          {
            name: "Access",
            target: {
              expression: {
                language: "text/fhirpath",
                expression: "%request.type = 'read-request'",
              },
            },
            condition: {
              expression: {
                language: "text/fhirpath",
                expression:
                  "%resourceFilter.body.entry.resource.where(id = %request.id).exists()",
              },
            },
          },
        ],
      } as AccessPolicyV2;
    }
    case "update-request":
    case "create-request": {
      const params = patientCompartments[request.resource];
      if (!params) {
        throw new OperationError(outcomeFatal("exception", "Invalid resource"));
      }
      const searchParameters = await ctx.client.search_type(
        await asRoot(ctx),
        request.fhirVersion,
        "SearchParameter",
        [
          {
            name: "base",
            value: searchResources([request.resource] as AllResourceTypes[]),
          },
          { name: "code", value: params },
        ],
      );

      return {
        name: "Patient Scope access",
        engine: "rule-engine" as code,
        resourceType: "AccessPolicyV2",
        rule: [
          {
            name: "Access",
            target: {
              expression: {
                language: "text/fhirpath",
                expression:
                  "%request.type = 'update-request' or %request.type = 'create-request'",
              },
            },
            condition: {
              expression: {
                language: "text/fhirpath",
                expression: searchParameters.resources
                  .filter((param) => param.expression !== undefined)
                  .map((searchParameter) => {
                    if (!searchParameter.expression) {
                      throw new OperationError(
                        outcomeFatal("exception", "Invalid search parameter"),
                      );
                    }
                    // Run projection from search parameters and check that user patient is in the references.
                    return `('Patient/' + %user.payload.patient) in (%request.body.select(${searchParameter.expression}).ofType(Reference).reference)`;
                  })
                  .join(" or "),
              },
            },
          },
        ],
      } as AccessPolicyV2;
    }
    case "delete-request": {
      return {
        name: "Patient Scope access",
        engine: "rule-engine" as code,
        resourceType: "AccessPolicyV2",
        attribute: [getResourceFilter("resourceFilter", request)],
        rule: [
          {
            name: "Access",
            target: {
              expression: {
                language: "text/fhirpath",
                expression: "%request.type = 'delete-request'",
              },
            },
            condition: {
              expression: {
                language: "text/fhirpath",
                expression:
                  "%resourceFilter.body.entry.resource.where(id = %request.id).exists()",
              },
            },
          },
        ],
      } as AccessPolicyV2;
    }
    case "search-request": {
      if (request.level === "system") {
        throw new OperationError(
          outcomeError(
            "forbidden",
            "System search is not supported for patient access.",
          ),
        );
      }
      const params = patientCompartments[request.resource];
      return {
        name: "Patient Scope access",
        engine: "rule-engine" as code,
        resourceType: "AccessPolicyV2",
        rule: [
          {
            name: "Access",
            target: {
              expression: {
                language: "text/fhirpath",
                // Only going to support type access as system not possible to filter
                expression:
                  "%request.type = 'search-request' and %request.level = 'type'",
              },
            },
            condition: {
              expression: {
                language: "text/fhirpath",
                expression: params
                  ?.map(
                    (param) =>
                      `%request.parameters.where($this.name='${param}').value = %user.payload.patient or 
                       %request.parameters.where($this.name='${param}').value = 'Patient' + %user.payload.patient`,
                  )
                  .join(" or "),
              },
            },
          },
        ],
      } as AccessPolicyV2;
    }
    case "patch-request": {
      throw new OperationError(
        outcomeError(
          "forbidden",
          "Patch request is not supported for patient access.",
        ),
      );
    }
    default: {
      throw new OperationError(
        outcomeError(
          "forbidden",
          "Request is not supported for patient access.",
        ),
      );
    }
  }
}
