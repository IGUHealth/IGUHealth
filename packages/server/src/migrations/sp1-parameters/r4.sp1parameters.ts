// This code is generated do not edit

import { uri } from "@iguhealth/fhir-types/r4/types";

export function sqlSafeIdentifier(url: string) {
  // 63 byte limit so splitting the last piece.
  const chunks = url.split("/");
  const last = chunks[chunks.length - 1];
  return last.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
}

export const r4_sp1_idx: Set<string> = new Set([
  "http://hl7.org/fhir/SearchParameter/Resource-id",
  "http://hl7.org/fhir/SearchParameter/Resource-lastUpdated",
  "http://hl7.org/fhir/SearchParameter/Resource-source",
  "http://hl7.org/fhir/SearchParameter/Account-name",
  "http://hl7.org/fhir/SearchParameter/Account-period",
  "http://hl7.org/fhir/SearchParameter/Account-status",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-date",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-description",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-name",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-status",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-title",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-url",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-version",
  "http://hl7.org/fhir/SearchParameter/AdverseEvent-actuality",
  "http://hl7.org/fhir/SearchParameter/AdverseEvent-date",
  "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-criticality",
  "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-last-date",
  "http://hl7.org/fhir/SearchParameter/Appointment-date",
  "http://hl7.org/fhir/SearchParameter/Appointment-status",
  "http://hl7.org/fhir/SearchParameter/AppointmentResponse-part-status",
  "http://hl7.org/fhir/SearchParameter/AuditEvent-action",
  "http://hl7.org/fhir/SearchParameter/AuditEvent-date",
  "http://hl7.org/fhir/SearchParameter/AuditEvent-outcome",
  "http://hl7.org/fhir/SearchParameter/AuditEvent-site",
  "http://hl7.org/fhir/SearchParameter/AuditEvent-type",
  "http://hl7.org/fhir/SearchParameter/Basic-created",
  "http://hl7.org/fhir/SearchParameter/Bundle-identifier",
  "http://hl7.org/fhir/SearchParameter/Bundle-timestamp",
  "http://hl7.org/fhir/SearchParameter/Bundle-type",
  "http://hl7.org/fhir/SearchParameter/conformance-date",
  "http://hl7.org/fhir/SearchParameter/conformance-description",
  "http://hl7.org/fhir/SearchParameter/CapabilityStatement-fhirversion",
  "http://hl7.org/fhir/SearchParameter/conformance-name",
  "http://hl7.org/fhir/SearchParameter/conformance-publisher",
  "http://hl7.org/fhir/SearchParameter/CapabilityStatement-software",
  "http://hl7.org/fhir/SearchParameter/conformance-status",
  "http://hl7.org/fhir/SearchParameter/conformance-title",
  "http://hl7.org/fhir/SearchParameter/conformance-url",
  "http://hl7.org/fhir/SearchParameter/conformance-version",
  "http://hl7.org/fhir/SearchParameter/CarePlan-intent",
  "http://hl7.org/fhir/SearchParameter/CarePlan-status",
  "http://hl7.org/fhir/SearchParameter/CareTeam-status",
  "http://hl7.org/fhir/SearchParameter/ChargeItem-entered-date",
  "http://hl7.org/fhir/SearchParameter/ChargeItem-factor-override",
  "http://hl7.org/fhir/SearchParameter/ChargeItem-price-override",
  "http://hl7.org/fhir/SearchParameter/ChargeItem-quantity",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-date",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-description",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-status",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-title",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-url",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-version",
  "http://hl7.org/fhir/SearchParameter/Claim-created",
  "http://hl7.org/fhir/SearchParameter/Claim-status",
  "http://hl7.org/fhir/SearchParameter/Claim-use",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-created",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-disposition",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-outcome",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-payment-date",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-status",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-use",
  "http://hl7.org/fhir/SearchParameter/ClinicalImpression-status",
  "http://hl7.org/fhir/SearchParameter/CodeSystem-content-mode",
  "http://hl7.org/fhir/SearchParameter/CodeSystem-system",
  "http://hl7.org/fhir/SearchParameter/Communication-received",
  "http://hl7.org/fhir/SearchParameter/Communication-sent",
  "http://hl7.org/fhir/SearchParameter/Communication-status",
  "http://hl7.org/fhir/SearchParameter/CommunicationRequest-authored",
  "http://hl7.org/fhir/SearchParameter/CommunicationRequest-group-identifier",
  "http://hl7.org/fhir/SearchParameter/CommunicationRequest-occurrence",
  "http://hl7.org/fhir/SearchParameter/CommunicationRequest-priority",
  "http://hl7.org/fhir/SearchParameter/CommunicationRequest-status",
  "http://hl7.org/fhir/SearchParameter/CompartmentDefinition-code",
  "http://hl7.org/fhir/SearchParameter/Composition-confidentiality",
  "http://hl7.org/fhir/SearchParameter/Composition-status",
  "http://hl7.org/fhir/SearchParameter/Composition-title",
  "http://hl7.org/fhir/SearchParameter/Condition-abatement-age",
  "http://hl7.org/fhir/SearchParameter/Condition-abatement-date",
  "http://hl7.org/fhir/SearchParameter/Condition-abatement-string",
  "http://hl7.org/fhir/SearchParameter/Condition-onset-age",
  "http://hl7.org/fhir/SearchParameter/Condition-onset-date",
  "http://hl7.org/fhir/SearchParameter/Condition-onset-info",
  "http://hl7.org/fhir/SearchParameter/Condition-recorded-date",
  "http://hl7.org/fhir/SearchParameter/Consent-period",
  "http://hl7.org/fhir/SearchParameter/Consent-status",
  "http://hl7.org/fhir/SearchParameter/Contract-instantiates",
  "http://hl7.org/fhir/SearchParameter/Contract-issued",
  "http://hl7.org/fhir/SearchParameter/Contract-status",
  "http://hl7.org/fhir/SearchParameter/Contract-url",
  "http://hl7.org/fhir/SearchParameter/Coverage-dependent",
  "http://hl7.org/fhir/SearchParameter/Coverage-status",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityRequest-created",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityRequest-status",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-created",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-disposition",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-outcome",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-status",
  "http://hl7.org/fhir/SearchParameter/DetectedIssue-identified",
  "http://hl7.org/fhir/SearchParameter/Device-manufacturer",
  "http://hl7.org/fhir/SearchParameter/Device-model",
  "http://hl7.org/fhir/SearchParameter/Device-status",
  "http://hl7.org/fhir/SearchParameter/Device-url",
  "http://hl7.org/fhir/SearchParameter/DeviceMetric-category",
  "http://hl7.org/fhir/SearchParameter/DeviceRequest-authored-on",
  "http://hl7.org/fhir/SearchParameter/DeviceRequest-event-date",
  "http://hl7.org/fhir/SearchParameter/DeviceRequest-group-identifier",
  "http://hl7.org/fhir/SearchParameter/DeviceRequest-intent",
  "http://hl7.org/fhir/SearchParameter/DeviceRequest-status",
  "http://hl7.org/fhir/SearchParameter/DiagnosticReport-issued",
  "http://hl7.org/fhir/SearchParameter/DiagnosticReport-status",
  "http://hl7.org/fhir/SearchParameter/DocumentManifest-created",
  "http://hl7.org/fhir/SearchParameter/DocumentManifest-description",
  "http://hl7.org/fhir/SearchParameter/DocumentManifest-source",
  "http://hl7.org/fhir/SearchParameter/DocumentManifest-status",
  "http://hl7.org/fhir/SearchParameter/DocumentReference-date",
  "http://hl7.org/fhir/SearchParameter/DocumentReference-description",
  "http://hl7.org/fhir/SearchParameter/DocumentReference-period",
  "http://hl7.org/fhir/SearchParameter/DocumentReference-status",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-date",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-description",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-effective",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-name",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-publisher",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-status",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-title",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-url",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-version",
  "http://hl7.org/fhir/SearchParameter/Encounter-class",
  "http://hl7.org/fhir/SearchParameter/Encounter-length",
  "http://hl7.org/fhir/SearchParameter/Encounter-status",
  "http://hl7.org/fhir/SearchParameter/Endpoint-connection-type",
  "http://hl7.org/fhir/SearchParameter/Endpoint-name",
  "http://hl7.org/fhir/SearchParameter/Endpoint-status",
  "http://hl7.org/fhir/SearchParameter/EnrollmentRequest-status",
  "http://hl7.org/fhir/SearchParameter/EnrollmentResponse-status",
  "http://hl7.org/fhir/SearchParameter/EpisodeOfCare-status",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-date",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-description",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-name",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-status",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-title",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-url",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-version",
  "http://hl7.org/fhir/SearchParameter/Evidence-date",
  "http://hl7.org/fhir/SearchParameter/Evidence-description",
  "http://hl7.org/fhir/SearchParameter/Evidence-effective",
  "http://hl7.org/fhir/SearchParameter/Evidence-name",
  "http://hl7.org/fhir/SearchParameter/Evidence-publisher",
  "http://hl7.org/fhir/SearchParameter/Evidence-status",
  "http://hl7.org/fhir/SearchParameter/Evidence-title",
  "http://hl7.org/fhir/SearchParameter/Evidence-url",
  "http://hl7.org/fhir/SearchParameter/Evidence-version",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-date",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-description",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-effective",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-name",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-publisher",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-status",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-title",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-url",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-version",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-date",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-name",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-publisher",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-status",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-url",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-version",
  "http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-created",
  "http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-disposition",
  "http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-status",
  "http://hl7.org/fhir/SearchParameter/FamilyMemberHistory-status",
  "http://hl7.org/fhir/SearchParameter/Goal-lifecycle-status",
  "http://hl7.org/fhir/SearchParameter/Goal-start-date",
  "http://hl7.org/fhir/SearchParameter/GraphDefinition-start",
  "http://hl7.org/fhir/SearchParameter/Group-actual",
  "http://hl7.org/fhir/SearchParameter/Group-type",
  "http://hl7.org/fhir/SearchParameter/GuidanceResponse-request",
  "http://hl7.org/fhir/SearchParameter/HealthcareService-active",
  "http://hl7.org/fhir/SearchParameter/HealthcareService-name",
  "http://hl7.org/fhir/SearchParameter/ImagingStudy-started",
  "http://hl7.org/fhir/SearchParameter/ImagingStudy-status",
  "http://hl7.org/fhir/SearchParameter/Immunization-lot-number",
  "http://hl7.org/fhir/SearchParameter/Immunization-status",
  "http://hl7.org/fhir/SearchParameter/ImmunizationEvaluation-date",
  "http://hl7.org/fhir/SearchParameter/ImmunizationEvaluation-status",
  "http://hl7.org/fhir/SearchParameter/ImmunizationRecommendation-date",
  "http://hl7.org/fhir/SearchParameter/ImplementationGuide-experimental",
  "http://hl7.org/fhir/SearchParameter/InsurancePlan-phonetic",
  "http://hl7.org/fhir/SearchParameter/InsurancePlan-status",
  "http://hl7.org/fhir/SearchParameter/Invoice-date",
  "http://hl7.org/fhir/SearchParameter/Invoice-status",
  "http://hl7.org/fhir/SearchParameter/Invoice-totalgross",
  "http://hl7.org/fhir/SearchParameter/Invoice-totalnet",
  "http://hl7.org/fhir/SearchParameter/Library-date",
  "http://hl7.org/fhir/SearchParameter/Library-description",
  "http://hl7.org/fhir/SearchParameter/Library-effective",
  "http://hl7.org/fhir/SearchParameter/Library-name",
  "http://hl7.org/fhir/SearchParameter/Library-publisher",
  "http://hl7.org/fhir/SearchParameter/Library-status",
  "http://hl7.org/fhir/SearchParameter/Library-title",
  "http://hl7.org/fhir/SearchParameter/Library-url",
  "http://hl7.org/fhir/SearchParameter/Library-version",
  "http://hl7.org/fhir/SearchParameter/List-status",
  "http://hl7.org/fhir/SearchParameter/List-title",
  "http://hl7.org/fhir/SearchParameter/Location-address-city",
  "http://hl7.org/fhir/SearchParameter/Location-address-country",
  "http://hl7.org/fhir/SearchParameter/Location-address-postalcode",
  "http://hl7.org/fhir/SearchParameter/Location-address-state",
  "http://hl7.org/fhir/SearchParameter/Location-address-use",
  "http://hl7.org/fhir/SearchParameter/Location-operational-status",
  "http://hl7.org/fhir/SearchParameter/Location-status",
  "http://hl7.org/fhir/SearchParameter/Measure-date",
  "http://hl7.org/fhir/SearchParameter/Measure-description",
  "http://hl7.org/fhir/SearchParameter/Measure-effective",
  "http://hl7.org/fhir/SearchParameter/Measure-name",
  "http://hl7.org/fhir/SearchParameter/Measure-publisher",
  "http://hl7.org/fhir/SearchParameter/Measure-status",
  "http://hl7.org/fhir/SearchParameter/Measure-title",
  "http://hl7.org/fhir/SearchParameter/Measure-url",
  "http://hl7.org/fhir/SearchParameter/Measure-version",
  "http://hl7.org/fhir/SearchParameter/MeasureReport-date",
  "http://hl7.org/fhir/SearchParameter/MeasureReport-period",
  "http://hl7.org/fhir/SearchParameter/MeasureReport-status",
  "http://hl7.org/fhir/SearchParameter/Media-created",
  "http://hl7.org/fhir/SearchParameter/Media-status",
  "http://hl7.org/fhir/SearchParameter/Medication-expiration-date",
  "http://hl7.org/fhir/SearchParameter/Medication-lot-number",
  "http://hl7.org/fhir/SearchParameter/Medication-status",
  "http://hl7.org/fhir/SearchParameter/MedicationAdministration-effective-time",
  "http://hl7.org/fhir/SearchParameter/medications-status",
  "http://hl7.org/fhir/SearchParameter/MedicationDispense-whenhandedover",
  "http://hl7.org/fhir/SearchParameter/MedicationDispense-whenprepared",
  "http://hl7.org/fhir/SearchParameter/MedicationKnowledge-status",
  "http://hl7.org/fhir/SearchParameter/MedicationRequest-authoredon",
  "http://hl7.org/fhir/SearchParameter/MedicationRequest-intent",
  "http://hl7.org/fhir/SearchParameter/MedicationRequest-priority",
  "http://hl7.org/fhir/SearchParameter/MedicationStatement-effective",
  "http://hl7.org/fhir/SearchParameter/MessageDefinition-category",
  "http://hl7.org/fhir/SearchParameter/MessageDefinition-event",
  "http://hl7.org/fhir/SearchParameter/MessageHeader-code",
  "http://hl7.org/fhir/SearchParameter/MessageHeader-event",
  "http://hl7.org/fhir/SearchParameter/MessageHeader-response-id",
  "http://hl7.org/fhir/SearchParameter/MessageHeader-source",
  "http://hl7.org/fhir/SearchParameter/MessageHeader-source-uri",
  "http://hl7.org/fhir/SearchParameter/MolecularSequence-type",
  "http://hl7.org/fhir/SearchParameter/MolecularSequence-window-end",
  "http://hl7.org/fhir/SearchParameter/MolecularSequence-window-start",
  "http://hl7.org/fhir/SearchParameter/NamingSystem-kind",
  "http://hl7.org/fhir/SearchParameter/NamingSystem-responsible",
  "http://hl7.org/fhir/SearchParameter/NutritionOrder-datetime",
  "http://hl7.org/fhir/SearchParameter/NutritionOrder-status",
  "http://hl7.org/fhir/SearchParameter/Observation-status",
  "http://hl7.org/fhir/SearchParameter/Observation-value-date",
  "http://hl7.org/fhir/SearchParameter/Observation-value-string",
  "http://hl7.org/fhir/SearchParameter/OperationDefinition-code",
  "http://hl7.org/fhir/SearchParameter/OperationDefinition-instance",
  "http://hl7.org/fhir/SearchParameter/OperationDefinition-kind",
  "http://hl7.org/fhir/SearchParameter/OperationDefinition-system",
  "http://hl7.org/fhir/SearchParameter/OperationDefinition-type",
  "http://hl7.org/fhir/SearchParameter/Organization-active",
  "http://hl7.org/fhir/SearchParameter/Organization-phonetic",
  "http://hl7.org/fhir/SearchParameter/OrganizationAffiliation-active",
  "http://hl7.org/fhir/SearchParameter/OrganizationAffiliation-date",
  "http://hl7.org/fhir/SearchParameter/Patient-active",
  "http://hl7.org/fhir/SearchParameter/individual-birthdate",
  "http://hl7.org/fhir/SearchParameter/Patient-death-date",
  "http://hl7.org/fhir/SearchParameter/individual-gender",
  "http://hl7.org/fhir/SearchParameter/PaymentNotice-created",
  "http://hl7.org/fhir/SearchParameter/PaymentNotice-status",
  "http://hl7.org/fhir/SearchParameter/PaymentReconciliation-created",
  "http://hl7.org/fhir/SearchParameter/PaymentReconciliation-disposition",
  "http://hl7.org/fhir/SearchParameter/PaymentReconciliation-outcome",
  "http://hl7.org/fhir/SearchParameter/PaymentReconciliation-status",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-date",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-description",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-name",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-status",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-title",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-url",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-version",
  "http://hl7.org/fhir/SearchParameter/Practitioner-active",
  "http://hl7.org/fhir/SearchParameter/PractitionerRole-active",
  "http://hl7.org/fhir/SearchParameter/PractitionerRole-date",
  "http://hl7.org/fhir/SearchParameter/Procedure-status",
  "http://hl7.org/fhir/SearchParameter/Provenance-recorded",
  "http://hl7.org/fhir/SearchParameter/Provenance-when",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-date",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-description",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-effective",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-name",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-publisher",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-status",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-title",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-url",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-version",
  "http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-authored",
  "http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-identifier",
  "http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-status",
  "http://hl7.org/fhir/SearchParameter/RelatedPerson-active",
  "http://hl7.org/fhir/SearchParameter/RequestGroup-authored",
  "http://hl7.org/fhir/SearchParameter/RequestGroup-group-identifier",
  "http://hl7.org/fhir/SearchParameter/RequestGroup-intent",
  "http://hl7.org/fhir/SearchParameter/RequestGroup-priority",
  "http://hl7.org/fhir/SearchParameter/RequestGroup-status",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-date",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-description",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-name",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-status",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-title",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-url",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-version",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-date",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-description",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-name",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-status",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-title",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-url",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-version",
  "http://hl7.org/fhir/SearchParameter/ResearchStudy-date",
  "http://hl7.org/fhir/SearchParameter/ResearchStudy-status",
  "http://hl7.org/fhir/SearchParameter/ResearchStudy-title",
  "http://hl7.org/fhir/SearchParameter/ResearchSubject-date",
  "http://hl7.org/fhir/SearchParameter/ResearchSubject-status",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-date",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-description",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-effective",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-name",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-publisher",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-status",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-title",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-url",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-version",
  "http://hl7.org/fhir/SearchParameter/Schedule-active",
  "http://hl7.org/fhir/SearchParameter/Schedule-date",
  "http://hl7.org/fhir/SearchParameter/SearchParameter-code",
  "http://hl7.org/fhir/SearchParameter/SearchParameter-type",
  "http://hl7.org/fhir/SearchParameter/ServiceRequest-authored",
  "http://hl7.org/fhir/SearchParameter/ServiceRequest-intent",
  "http://hl7.org/fhir/SearchParameter/ServiceRequest-priority",
  "http://hl7.org/fhir/SearchParameter/ServiceRequest-requisition",
  "http://hl7.org/fhir/SearchParameter/ServiceRequest-status",
  "http://hl7.org/fhir/SearchParameter/Slot-start",
  "http://hl7.org/fhir/SearchParameter/Slot-status",
  "http://hl7.org/fhir/SearchParameter/Specimen-accession",
  "http://hl7.org/fhir/SearchParameter/Specimen-collected",
  "http://hl7.org/fhir/SearchParameter/Specimen-status",
  "http://hl7.org/fhir/SearchParameter/SpecimenDefinition-identifier",
  "http://hl7.org/fhir/SearchParameter/StructureDefinition-abstract",
  "http://hl7.org/fhir/SearchParameter/StructureDefinition-derivation",
  "http://hl7.org/fhir/SearchParameter/StructureDefinition-experimental",
  "http://hl7.org/fhir/SearchParameter/StructureDefinition-kind",
  "http://hl7.org/fhir/SearchParameter/StructureDefinition-type",
  "http://hl7.org/fhir/SearchParameter/Subscription-criteria",
  "http://hl7.org/fhir/SearchParameter/Subscription-payload",
  "http://hl7.org/fhir/SearchParameter/Subscription-status",
  "http://hl7.org/fhir/SearchParameter/Subscription-type",
  "http://hl7.org/fhir/SearchParameter/Subscription-url",
  "http://hl7.org/fhir/SearchParameter/Substance-status",
  "http://hl7.org/fhir/SearchParameter/SupplyDelivery-status",
  "http://hl7.org/fhir/SearchParameter/SupplyRequest-status",
  "http://hl7.org/fhir/SearchParameter/Task-authored-on",
  "http://hl7.org/fhir/SearchParameter/Task-group-identifier",
  "http://hl7.org/fhir/SearchParameter/Task-intent",
  "http://hl7.org/fhir/SearchParameter/Task-modified",
  "http://hl7.org/fhir/SearchParameter/Task-period",
  "http://hl7.org/fhir/SearchParameter/Task-priority",
  "http://hl7.org/fhir/SearchParameter/Task-status",
  "http://hl7.org/fhir/SearchParameter/TestReport-identifier",
  "http://hl7.org/fhir/SearchParameter/TestReport-issued",
  "http://hl7.org/fhir/SearchParameter/TestReport-result",
  "http://hl7.org/fhir/SearchParameter/TestReport-tester",
  "http://hl7.org/fhir/SearchParameter/TestScript-date",
  "http://hl7.org/fhir/SearchParameter/TestScript-description",
  "http://hl7.org/fhir/SearchParameter/TestScript-identifier",
  "http://hl7.org/fhir/SearchParameter/TestScript-name",
  "http://hl7.org/fhir/SearchParameter/TestScript-publisher",
  "http://hl7.org/fhir/SearchParameter/TestScript-status",
  "http://hl7.org/fhir/SearchParameter/TestScript-title",
  "http://hl7.org/fhir/SearchParameter/TestScript-url",
  "http://hl7.org/fhir/SearchParameter/TestScript-version",
  "http://hl7.org/fhir/SearchParameter/ValueSet-expansion",
  "http://hl7.org/fhir/SearchParameter/VisionPrescription-datewritten",
  "http://hl7.org/fhir/SearchParameter/VisionPrescription-status",
  "https://iguhealth.app/fhir/SearchParameter/AccessPolicyV2-engine",
  "https://iguhealth.app/fhir/SearchParameter/AccessPolicyV2-name",
  "https://iguhealth.app/fhir/SearchParameter/AccessPolicy-code",
  "https://iguhealth.app/fhir/SearchParameter/AccessPolicy-name",
  "https://iguhealth.app/fhir/SearchParameter/AccessPolicy-type",
  "https://iguhealth.app/fhir/SearchParameter/ClientApplication-name",
  "https://iguhealth.app/fhir/SearchParameter/IdentityProvider-accessType",
  "https://iguhealth.app/fhir/SearchParameter/IdentityProvider-name",
  "https://iguhealth.app/fhir/SearchParameter/IdentityProvider-status",
  "https://iguhealth.app/fhir/SearchParameter/Membership-email",
  "https://iguhealth.app/fhir/SearchParameter/Membership-role",
  "https://iguhealth.app/fhir/SearchParameter/MessageBroker-host",
  "https://iguhealth.app/fhir/SearchParameter/MessageBroker-name",
  "https://iguhealth.app/fhir/SearchParameter/MessageBroker-type",
  "https://iguhealth.app/fhir/SearchParameter/MessageTopic-topic",
]);

export const canonicalColumns = {
  ActivityDefinition: [
    "http://hl7.org/fhir/SearchParameter/ActivityDefinition-url",
  ],
  CapabilityStatement: ["http://hl7.org/fhir/SearchParameter/conformance-url"],
  CodeSystem: ["http://hl7.org/fhir/SearchParameter/conformance-url"],
  CompartmentDefinition: [
    "http://hl7.org/fhir/SearchParameter/conformance-url",
  ],
  ConceptMap: ["http://hl7.org/fhir/SearchParameter/conformance-url"],
  GraphDefinition: ["http://hl7.org/fhir/SearchParameter/conformance-url"],
  ImplementationGuide: ["http://hl7.org/fhir/SearchParameter/conformance-url"],
  MessageDefinition: ["http://hl7.org/fhir/SearchParameter/conformance-url"],
  OperationDefinition: ["http://hl7.org/fhir/SearchParameter/conformance-url"],
  SearchParameter: ["http://hl7.org/fhir/SearchParameter/conformance-url"],
  StructureDefinition: ["http://hl7.org/fhir/SearchParameter/conformance-url"],
  StructureMap: ["http://hl7.org/fhir/SearchParameter/conformance-url"],
  TerminologyCapabilities: [
    "http://hl7.org/fhir/SearchParameter/conformance-url",
  ],
  ValueSet: ["http://hl7.org/fhir/SearchParameter/conformance-url"],
  ChargeItemDefinition: [
    "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-url",
  ],
  Contract: ["http://hl7.org/fhir/SearchParameter/Contract-url"],
  Device: ["http://hl7.org/fhir/SearchParameter/Device-url"],
  EffectEvidenceSynthesis: [
    "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-url",
  ],
  EventDefinition: ["http://hl7.org/fhir/SearchParameter/EventDefinition-url"],
  Evidence: ["http://hl7.org/fhir/SearchParameter/Evidence-url"],
  EvidenceVariable: [
    "http://hl7.org/fhir/SearchParameter/EvidenceVariable-url",
  ],
  ExampleScenario: ["http://hl7.org/fhir/SearchParameter/ExampleScenario-url"],
  Library: ["http://hl7.org/fhir/SearchParameter/Library-url"],
  Measure: ["http://hl7.org/fhir/SearchParameter/Measure-url"],
  PlanDefinition: ["http://hl7.org/fhir/SearchParameter/PlanDefinition-url"],
  Questionnaire: ["http://hl7.org/fhir/SearchParameter/Questionnaire-url"],
  ResearchDefinition: [
    "http://hl7.org/fhir/SearchParameter/ResearchDefinition-url",
  ],
  ResearchElementDefinition: [
    "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-url",
  ],
  RiskEvidenceSynthesis: [
    "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-url",
  ],
  Subscription: ["http://hl7.org/fhir/SearchParameter/Subscription-url"],
  TestScript: ["http://hl7.org/fhir/SearchParameter/TestScript-url"],
};

export type r4_sp1_idx_token =
  | "resource_id"
  | "account_status"
  | "activitydefinition_status"
  | "activitydefinition_version"
  | "adverseevent_actuality"
  | "allergyintolerance_criticality"
  | "appointment_status"
  | "appointmentresponse_part_status"
  | "auditevent_action"
  | "auditevent_outcome"
  | "auditevent_site"
  | "auditevent_type"
  | "bundle_identifier"
  | "bundle_type"
  | "capabilitystatement_fhirversion"
  | "conformance_status"
  | "conformance_version"
  | "careplan_intent"
  | "careplan_status"
  | "careteam_status"
  | "chargeitemdefinition_status"
  | "chargeitemdefinition_version"
  | "claim_status"
  | "claim_use"
  | "claimresponse_outcome"
  | "claimresponse_status"
  | "claimresponse_use"
  | "clinicalimpression_status"
  | "codesystem_content_mode"
  | "communication_status"
  | "communicationrequest_group_identifier"
  | "communicationrequest_priority"
  | "communicationrequest_status"
  | "compartmentdefinition_code"
  | "composition_confidentiality"
  | "composition_status"
  | "consent_status"
  | "contract_status"
  | "coverage_status"
  | "coverageeligibilityrequest_status"
  | "coverageeligibilityresponse_outcome"
  | "coverageeligibilityresponse_status"
  | "device_status"
  | "devicemetric_category"
  | "devicerequest_group_identifier"
  | "devicerequest_intent"
  | "devicerequest_status"
  | "diagnosticreport_status"
  | "documentmanifest_status"
  | "documentreference_status"
  | "effectevidencesynthesis_status"
  | "effectevidencesynthesis_version"
  | "encounter_class"
  | "encounter_status"
  | "endpoint_connection_type"
  | "endpoint_status"
  | "enrollmentrequest_status"
  | "enrollmentresponse_status"
  | "episodeofcare_status"
  | "eventdefinition_status"
  | "eventdefinition_version"
  | "evidence_status"
  | "evidence_version"
  | "evidencevariable_status"
  | "evidencevariable_version"
  | "examplescenario_status"
  | "examplescenario_version"
  | "explanationofbenefit_status"
  | "familymemberhistory_status"
  | "goal_lifecycle_status"
  | "graphdefinition_start"
  | "group_actual"
  | "group_type"
  | "guidanceresponse_request"
  | "healthcareservice_active"
  | "imagingstudy_status"
  | "immunization_status"
  | "immunizationevaluation_status"
  | "implementationguide_experimental"
  | "insuranceplan_status"
  | "invoice_status"
  | "library_status"
  | "library_version"
  | "list_status"
  | "location_address_use"
  | "location_operational_status"
  | "location_status"
  | "measure_status"
  | "measure_version"
  | "measurereport_status"
  | "media_status"
  | "medication_lot_number"
  | "medication_status"
  | "medications_status"
  | "medicationknowledge_status"
  | "medicationrequest_intent"
  | "medicationrequest_priority"
  | "messagedefinition_category"
  | "messagedefinition_event"
  | "messageheader_code"
  | "messageheader_event"
  | "messageheader_response_id"
  | "molecularsequence_type"
  | "namingsystem_kind"
  | "nutritionorder_status"
  | "observation_status"
  | "operationdefinition_code"
  | "operationdefinition_instance"
  | "operationdefinition_kind"
  | "operationdefinition_system"
  | "operationdefinition_type"
  | "organization_active"
  | "organizationaffiliation_active"
  | "patient_active"
  | "individual_gender"
  | "paymentnotice_status"
  | "paymentreconciliation_outcome"
  | "paymentreconciliation_status"
  | "plandefinition_status"
  | "plandefinition_version"
  | "practitioner_active"
  | "practitionerrole_active"
  | "procedure_status"
  | "questionnaire_status"
  | "questionnaire_version"
  | "questionnaireresponse_identifier"
  | "questionnaireresponse_status"
  | "relatedperson_active"
  | "requestgroup_group_identifier"
  | "requestgroup_intent"
  | "requestgroup_priority"
  | "requestgroup_status"
  | "researchdefinition_status"
  | "researchdefinition_version"
  | "researchelementdefinition_status"
  | "researchelementdefinition_version"
  | "researchstudy_status"
  | "researchsubject_status"
  | "riskevidencesynthesis_status"
  | "riskevidencesynthesis_version"
  | "schedule_active"
  | "searchparameter_code"
  | "searchparameter_type"
  | "servicerequest_intent"
  | "servicerequest_priority"
  | "servicerequest_requisition"
  | "servicerequest_status"
  | "slot_status"
  | "specimen_accession"
  | "specimen_status"
  | "specimendefinition_identifier"
  | "structuredefinition_abstract"
  | "structuredefinition_derivation"
  | "structuredefinition_experimental"
  | "structuredefinition_kind"
  | "subscription_payload"
  | "subscription_status"
  | "subscription_type"
  | "substance_status"
  | "supplydelivery_status"
  | "supplyrequest_status"
  | "task_group_identifier"
  | "task_intent"
  | "task_priority"
  | "task_status"
  | "testreport_identifier"
  | "testreport_result"
  | "testscript_identifier"
  | "testscript_status"
  | "testscript_version"
  | "visionprescription_status"
  | "accesspolicyv2_engine"
  | "accesspolicy_code"
  | "accesspolicy_type"
  | "identityprovider_accesstype"
  | "identityprovider_status"
  | "membership_email"
  | "membership_role"
  | "messagebroker_type"
  | "messagetopic_topic";

const r4_sp1_idx_token_set: Set<string> = new Set([
  "http://hl7.org/fhir/SearchParameter/Resource-id",
  "http://hl7.org/fhir/SearchParameter/Account-status",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-status",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-version",
  "http://hl7.org/fhir/SearchParameter/AdverseEvent-actuality",
  "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-criticality",
  "http://hl7.org/fhir/SearchParameter/Appointment-status",
  "http://hl7.org/fhir/SearchParameter/AppointmentResponse-part-status",
  "http://hl7.org/fhir/SearchParameter/AuditEvent-action",
  "http://hl7.org/fhir/SearchParameter/AuditEvent-outcome",
  "http://hl7.org/fhir/SearchParameter/AuditEvent-site",
  "http://hl7.org/fhir/SearchParameter/AuditEvent-type",
  "http://hl7.org/fhir/SearchParameter/Bundle-identifier",
  "http://hl7.org/fhir/SearchParameter/Bundle-type",
  "http://hl7.org/fhir/SearchParameter/CapabilityStatement-fhirversion",
  "http://hl7.org/fhir/SearchParameter/conformance-status",
  "http://hl7.org/fhir/SearchParameter/conformance-version",
  "http://hl7.org/fhir/SearchParameter/CarePlan-intent",
  "http://hl7.org/fhir/SearchParameter/CarePlan-status",
  "http://hl7.org/fhir/SearchParameter/CareTeam-status",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-status",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-version",
  "http://hl7.org/fhir/SearchParameter/Claim-status",
  "http://hl7.org/fhir/SearchParameter/Claim-use",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-outcome",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-status",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-use",
  "http://hl7.org/fhir/SearchParameter/ClinicalImpression-status",
  "http://hl7.org/fhir/SearchParameter/CodeSystem-content-mode",
  "http://hl7.org/fhir/SearchParameter/Communication-status",
  "http://hl7.org/fhir/SearchParameter/CommunicationRequest-group-identifier",
  "http://hl7.org/fhir/SearchParameter/CommunicationRequest-priority",
  "http://hl7.org/fhir/SearchParameter/CommunicationRequest-status",
  "http://hl7.org/fhir/SearchParameter/CompartmentDefinition-code",
  "http://hl7.org/fhir/SearchParameter/Composition-confidentiality",
  "http://hl7.org/fhir/SearchParameter/Composition-status",
  "http://hl7.org/fhir/SearchParameter/Consent-status",
  "http://hl7.org/fhir/SearchParameter/Contract-status",
  "http://hl7.org/fhir/SearchParameter/Coverage-status",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityRequest-status",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-outcome",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-status",
  "http://hl7.org/fhir/SearchParameter/Device-status",
  "http://hl7.org/fhir/SearchParameter/DeviceMetric-category",
  "http://hl7.org/fhir/SearchParameter/DeviceRequest-group-identifier",
  "http://hl7.org/fhir/SearchParameter/DeviceRequest-intent",
  "http://hl7.org/fhir/SearchParameter/DeviceRequest-status",
  "http://hl7.org/fhir/SearchParameter/DiagnosticReport-status",
  "http://hl7.org/fhir/SearchParameter/DocumentManifest-status",
  "http://hl7.org/fhir/SearchParameter/DocumentReference-status",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-status",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-version",
  "http://hl7.org/fhir/SearchParameter/Encounter-class",
  "http://hl7.org/fhir/SearchParameter/Encounter-status",
  "http://hl7.org/fhir/SearchParameter/Endpoint-connection-type",
  "http://hl7.org/fhir/SearchParameter/Endpoint-status",
  "http://hl7.org/fhir/SearchParameter/EnrollmentRequest-status",
  "http://hl7.org/fhir/SearchParameter/EnrollmentResponse-status",
  "http://hl7.org/fhir/SearchParameter/EpisodeOfCare-status",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-status",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-version",
  "http://hl7.org/fhir/SearchParameter/Evidence-status",
  "http://hl7.org/fhir/SearchParameter/Evidence-version",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-status",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-version",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-status",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-version",
  "http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-status",
  "http://hl7.org/fhir/SearchParameter/FamilyMemberHistory-status",
  "http://hl7.org/fhir/SearchParameter/Goal-lifecycle-status",
  "http://hl7.org/fhir/SearchParameter/GraphDefinition-start",
  "http://hl7.org/fhir/SearchParameter/Group-actual",
  "http://hl7.org/fhir/SearchParameter/Group-type",
  "http://hl7.org/fhir/SearchParameter/GuidanceResponse-request",
  "http://hl7.org/fhir/SearchParameter/HealthcareService-active",
  "http://hl7.org/fhir/SearchParameter/ImagingStudy-status",
  "http://hl7.org/fhir/SearchParameter/Immunization-status",
  "http://hl7.org/fhir/SearchParameter/ImmunizationEvaluation-status",
  "http://hl7.org/fhir/SearchParameter/ImplementationGuide-experimental",
  "http://hl7.org/fhir/SearchParameter/InsurancePlan-status",
  "http://hl7.org/fhir/SearchParameter/Invoice-status",
  "http://hl7.org/fhir/SearchParameter/Library-status",
  "http://hl7.org/fhir/SearchParameter/Library-version",
  "http://hl7.org/fhir/SearchParameter/List-status",
  "http://hl7.org/fhir/SearchParameter/Location-address-use",
  "http://hl7.org/fhir/SearchParameter/Location-operational-status",
  "http://hl7.org/fhir/SearchParameter/Location-status",
  "http://hl7.org/fhir/SearchParameter/Measure-status",
  "http://hl7.org/fhir/SearchParameter/Measure-version",
  "http://hl7.org/fhir/SearchParameter/MeasureReport-status",
  "http://hl7.org/fhir/SearchParameter/Media-status",
  "http://hl7.org/fhir/SearchParameter/Medication-lot-number",
  "http://hl7.org/fhir/SearchParameter/Medication-status",
  "http://hl7.org/fhir/SearchParameter/medications-status",
  "http://hl7.org/fhir/SearchParameter/MedicationKnowledge-status",
  "http://hl7.org/fhir/SearchParameter/MedicationRequest-intent",
  "http://hl7.org/fhir/SearchParameter/MedicationRequest-priority",
  "http://hl7.org/fhir/SearchParameter/MessageDefinition-category",
  "http://hl7.org/fhir/SearchParameter/MessageDefinition-event",
  "http://hl7.org/fhir/SearchParameter/MessageHeader-code",
  "http://hl7.org/fhir/SearchParameter/MessageHeader-event",
  "http://hl7.org/fhir/SearchParameter/MessageHeader-response-id",
  "http://hl7.org/fhir/SearchParameter/MolecularSequence-type",
  "http://hl7.org/fhir/SearchParameter/NamingSystem-kind",
  "http://hl7.org/fhir/SearchParameter/NutritionOrder-status",
  "http://hl7.org/fhir/SearchParameter/Observation-status",
  "http://hl7.org/fhir/SearchParameter/OperationDefinition-code",
  "http://hl7.org/fhir/SearchParameter/OperationDefinition-instance",
  "http://hl7.org/fhir/SearchParameter/OperationDefinition-kind",
  "http://hl7.org/fhir/SearchParameter/OperationDefinition-system",
  "http://hl7.org/fhir/SearchParameter/OperationDefinition-type",
  "http://hl7.org/fhir/SearchParameter/Organization-active",
  "http://hl7.org/fhir/SearchParameter/OrganizationAffiliation-active",
  "http://hl7.org/fhir/SearchParameter/Patient-active",
  "http://hl7.org/fhir/SearchParameter/individual-gender",
  "http://hl7.org/fhir/SearchParameter/PaymentNotice-status",
  "http://hl7.org/fhir/SearchParameter/PaymentReconciliation-outcome",
  "http://hl7.org/fhir/SearchParameter/PaymentReconciliation-status",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-status",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-version",
  "http://hl7.org/fhir/SearchParameter/Practitioner-active",
  "http://hl7.org/fhir/SearchParameter/PractitionerRole-active",
  "http://hl7.org/fhir/SearchParameter/Procedure-status",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-status",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-version",
  "http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-identifier",
  "http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-status",
  "http://hl7.org/fhir/SearchParameter/RelatedPerson-active",
  "http://hl7.org/fhir/SearchParameter/RequestGroup-group-identifier",
  "http://hl7.org/fhir/SearchParameter/RequestGroup-intent",
  "http://hl7.org/fhir/SearchParameter/RequestGroup-priority",
  "http://hl7.org/fhir/SearchParameter/RequestGroup-status",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-status",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-version",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-status",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-version",
  "http://hl7.org/fhir/SearchParameter/ResearchStudy-status",
  "http://hl7.org/fhir/SearchParameter/ResearchSubject-status",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-status",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-version",
  "http://hl7.org/fhir/SearchParameter/Schedule-active",
  "http://hl7.org/fhir/SearchParameter/SearchParameter-code",
  "http://hl7.org/fhir/SearchParameter/SearchParameter-type",
  "http://hl7.org/fhir/SearchParameter/ServiceRequest-intent",
  "http://hl7.org/fhir/SearchParameter/ServiceRequest-priority",
  "http://hl7.org/fhir/SearchParameter/ServiceRequest-requisition",
  "http://hl7.org/fhir/SearchParameter/ServiceRequest-status",
  "http://hl7.org/fhir/SearchParameter/Slot-status",
  "http://hl7.org/fhir/SearchParameter/Specimen-accession",
  "http://hl7.org/fhir/SearchParameter/Specimen-status",
  "http://hl7.org/fhir/SearchParameter/SpecimenDefinition-identifier",
  "http://hl7.org/fhir/SearchParameter/StructureDefinition-abstract",
  "http://hl7.org/fhir/SearchParameter/StructureDefinition-derivation",
  "http://hl7.org/fhir/SearchParameter/StructureDefinition-experimental",
  "http://hl7.org/fhir/SearchParameter/StructureDefinition-kind",
  "http://hl7.org/fhir/SearchParameter/Subscription-payload",
  "http://hl7.org/fhir/SearchParameter/Subscription-status",
  "http://hl7.org/fhir/SearchParameter/Subscription-type",
  "http://hl7.org/fhir/SearchParameter/Substance-status",
  "http://hl7.org/fhir/SearchParameter/SupplyDelivery-status",
  "http://hl7.org/fhir/SearchParameter/SupplyRequest-status",
  "http://hl7.org/fhir/SearchParameter/Task-group-identifier",
  "http://hl7.org/fhir/SearchParameter/Task-intent",
  "http://hl7.org/fhir/SearchParameter/Task-priority",
  "http://hl7.org/fhir/SearchParameter/Task-status",
  "http://hl7.org/fhir/SearchParameter/TestReport-identifier",
  "http://hl7.org/fhir/SearchParameter/TestReport-result",
  "http://hl7.org/fhir/SearchParameter/TestScript-identifier",
  "http://hl7.org/fhir/SearchParameter/TestScript-status",
  "http://hl7.org/fhir/SearchParameter/TestScript-version",
  "http://hl7.org/fhir/SearchParameter/VisionPrescription-status",
  "https://iguhealth.app/fhir/SearchParameter/AccessPolicyV2-engine",
  "https://iguhealth.app/fhir/SearchParameter/AccessPolicy-code",
  "https://iguhealth.app/fhir/SearchParameter/AccessPolicy-type",
  "https://iguhealth.app/fhir/SearchParameter/IdentityProvider-accessType",
  "https://iguhealth.app/fhir/SearchParameter/IdentityProvider-status",
  "https://iguhealth.app/fhir/SearchParameter/Membership-email",
  "https://iguhealth.app/fhir/SearchParameter/Membership-role",
  "https://iguhealth.app/fhir/SearchParameter/MessageBroker-type",
  "https://iguhealth.app/fhir/SearchParameter/MessageTopic-topic",
]);

export function asSP1Token(url: uri): r4_sp1_idx_token | undefined {
  if (!r4_sp1_idx_token_set.has(url)) return undefined;
  return sqlSafeIdentifier(url) as r4_sp1_idx_token;
}

export type r4_sp1_idx_date =
  | "resource_lastupdated"
  | "account_period"
  | "activitydefinition_date"
  | "activitydefinition_effective"
  | "adverseevent_date"
  | "allergyintolerance_last_date"
  | "appointment_date"
  | "auditevent_date"
  | "basic_created"
  | "bundle_timestamp"
  | "conformance_date"
  | "chargeitem_entered_date"
  | "chargeitemdefinition_date"
  | "chargeitemdefinition_effective"
  | "claim_created"
  | "claimresponse_created"
  | "claimresponse_payment_date"
  | "communication_received"
  | "communication_sent"
  | "communicationrequest_authored"
  | "communicationrequest_occurrence"
  | "condition_abatement_date"
  | "condition_onset_date"
  | "condition_recorded_date"
  | "consent_period"
  | "contract_issued"
  | "coverageeligibilityrequest_created"
  | "coverageeligibilityresponse_created"
  | "detectedissue_identified"
  | "devicerequest_authored_on"
  | "devicerequest_event_date"
  | "diagnosticreport_issued"
  | "documentmanifest_created"
  | "documentreference_date"
  | "documentreference_period"
  | "effectevidencesynthesis_date"
  | "effectevidencesynthesis_effective"
  | "eventdefinition_date"
  | "eventdefinition_effective"
  | "evidence_date"
  | "evidence_effective"
  | "evidencevariable_date"
  | "evidencevariable_effective"
  | "examplescenario_date"
  | "explanationofbenefit_created"
  | "goal_start_date"
  | "imagingstudy_started"
  | "immunizationevaluation_date"
  | "immunizationrecommendation_date"
  | "invoice_date"
  | "library_date"
  | "library_effective"
  | "measure_date"
  | "measure_effective"
  | "measurereport_date"
  | "measurereport_period"
  | "media_created"
  | "medication_expiration_date"
  | "medicationadministration_effective_time"
  | "medicationdispense_whenhandedover"
  | "medicationdispense_whenprepared"
  | "medicationrequest_authoredon"
  | "medicationstatement_effective"
  | "nutritionorder_datetime"
  | "observation_value_date"
  | "organizationaffiliation_date"
  | "individual_birthdate"
  | "patient_death_date"
  | "paymentnotice_created"
  | "paymentreconciliation_created"
  | "plandefinition_date"
  | "plandefinition_effective"
  | "practitionerrole_date"
  | "provenance_recorded"
  | "provenance_when"
  | "questionnaire_date"
  | "questionnaire_effective"
  | "questionnaireresponse_authored"
  | "requestgroup_authored"
  | "researchdefinition_date"
  | "researchdefinition_effective"
  | "researchelementdefinition_date"
  | "researchelementdefinition_effective"
  | "researchstudy_date"
  | "researchsubject_date"
  | "riskevidencesynthesis_date"
  | "riskevidencesynthesis_effective"
  | "schedule_date"
  | "servicerequest_authored"
  | "slot_start"
  | "specimen_collected"
  | "task_authored_on"
  | "task_modified"
  | "task_period"
  | "testreport_issued"
  | "testscript_date"
  | "visionprescription_datewritten";

const r4_sp1_idx_date_set: Set<string> = new Set([
  "http://hl7.org/fhir/SearchParameter/Resource-lastUpdated",
  "http://hl7.org/fhir/SearchParameter/Account-period",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-date",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/AdverseEvent-date",
  "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-last-date",
  "http://hl7.org/fhir/SearchParameter/Appointment-date",
  "http://hl7.org/fhir/SearchParameter/AuditEvent-date",
  "http://hl7.org/fhir/SearchParameter/Basic-created",
  "http://hl7.org/fhir/SearchParameter/Bundle-timestamp",
  "http://hl7.org/fhir/SearchParameter/conformance-date",
  "http://hl7.org/fhir/SearchParameter/ChargeItem-entered-date",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-date",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/Claim-created",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-created",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-payment-date",
  "http://hl7.org/fhir/SearchParameter/Communication-received",
  "http://hl7.org/fhir/SearchParameter/Communication-sent",
  "http://hl7.org/fhir/SearchParameter/CommunicationRequest-authored",
  "http://hl7.org/fhir/SearchParameter/CommunicationRequest-occurrence",
  "http://hl7.org/fhir/SearchParameter/Condition-abatement-date",
  "http://hl7.org/fhir/SearchParameter/Condition-onset-date",
  "http://hl7.org/fhir/SearchParameter/Condition-recorded-date",
  "http://hl7.org/fhir/SearchParameter/Consent-period",
  "http://hl7.org/fhir/SearchParameter/Contract-issued",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityRequest-created",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-created",
  "http://hl7.org/fhir/SearchParameter/DetectedIssue-identified",
  "http://hl7.org/fhir/SearchParameter/DeviceRequest-authored-on",
  "http://hl7.org/fhir/SearchParameter/DeviceRequest-event-date",
  "http://hl7.org/fhir/SearchParameter/DiagnosticReport-issued",
  "http://hl7.org/fhir/SearchParameter/DocumentManifest-created",
  "http://hl7.org/fhir/SearchParameter/DocumentReference-date",
  "http://hl7.org/fhir/SearchParameter/DocumentReference-period",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-date",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-effective",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-date",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/Evidence-date",
  "http://hl7.org/fhir/SearchParameter/Evidence-effective",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-date",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-effective",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-date",
  "http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-created",
  "http://hl7.org/fhir/SearchParameter/Goal-start-date",
  "http://hl7.org/fhir/SearchParameter/ImagingStudy-started",
  "http://hl7.org/fhir/SearchParameter/ImmunizationEvaluation-date",
  "http://hl7.org/fhir/SearchParameter/ImmunizationRecommendation-date",
  "http://hl7.org/fhir/SearchParameter/Invoice-date",
  "http://hl7.org/fhir/SearchParameter/Library-date",
  "http://hl7.org/fhir/SearchParameter/Library-effective",
  "http://hl7.org/fhir/SearchParameter/Measure-date",
  "http://hl7.org/fhir/SearchParameter/Measure-effective",
  "http://hl7.org/fhir/SearchParameter/MeasureReport-date",
  "http://hl7.org/fhir/SearchParameter/MeasureReport-period",
  "http://hl7.org/fhir/SearchParameter/Media-created",
  "http://hl7.org/fhir/SearchParameter/Medication-expiration-date",
  "http://hl7.org/fhir/SearchParameter/MedicationAdministration-effective-time",
  "http://hl7.org/fhir/SearchParameter/MedicationDispense-whenhandedover",
  "http://hl7.org/fhir/SearchParameter/MedicationDispense-whenprepared",
  "http://hl7.org/fhir/SearchParameter/MedicationRequest-authoredon",
  "http://hl7.org/fhir/SearchParameter/MedicationStatement-effective",
  "http://hl7.org/fhir/SearchParameter/NutritionOrder-datetime",
  "http://hl7.org/fhir/SearchParameter/Observation-value-date",
  "http://hl7.org/fhir/SearchParameter/OrganizationAffiliation-date",
  "http://hl7.org/fhir/SearchParameter/individual-birthdate",
  "http://hl7.org/fhir/SearchParameter/Patient-death-date",
  "http://hl7.org/fhir/SearchParameter/PaymentNotice-created",
  "http://hl7.org/fhir/SearchParameter/PaymentReconciliation-created",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-date",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/PractitionerRole-date",
  "http://hl7.org/fhir/SearchParameter/Provenance-recorded",
  "http://hl7.org/fhir/SearchParameter/Provenance-when",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-date",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-effective",
  "http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-authored",
  "http://hl7.org/fhir/SearchParameter/RequestGroup-authored",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-date",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-date",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-effective",
  "http://hl7.org/fhir/SearchParameter/ResearchStudy-date",
  "http://hl7.org/fhir/SearchParameter/ResearchSubject-date",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-date",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-effective",
  "http://hl7.org/fhir/SearchParameter/Schedule-date",
  "http://hl7.org/fhir/SearchParameter/ServiceRequest-authored",
  "http://hl7.org/fhir/SearchParameter/Slot-start",
  "http://hl7.org/fhir/SearchParameter/Specimen-collected",
  "http://hl7.org/fhir/SearchParameter/Task-authored-on",
  "http://hl7.org/fhir/SearchParameter/Task-modified",
  "http://hl7.org/fhir/SearchParameter/Task-period",
  "http://hl7.org/fhir/SearchParameter/TestReport-issued",
  "http://hl7.org/fhir/SearchParameter/TestScript-date",
  "http://hl7.org/fhir/SearchParameter/VisionPrescription-datewritten",
]);

export function asSP1Date(url: uri): r4_sp1_idx_date | undefined {
  if (!r4_sp1_idx_date_set.has(url)) return undefined;
  return sqlSafeIdentifier(url) as r4_sp1_idx_date;
}

export type r4_sp1_idx_uri =
  | "resource_source"
  | "activitydefinition_url"
  | "conformance_url"
  | "chargeitemdefinition_url"
  | "codesystem_system"
  | "contract_instantiates"
  | "contract_url"
  | "device_url"
  | "documentmanifest_source"
  | "effectevidencesynthesis_url"
  | "eventdefinition_url"
  | "evidence_url"
  | "evidencevariable_url"
  | "examplescenario_url"
  | "library_url"
  | "measure_url"
  | "messageheader_source_uri"
  | "plandefinition_url"
  | "questionnaire_url"
  | "researchdefinition_url"
  | "researchelementdefinition_url"
  | "riskevidencesynthesis_url"
  | "structuredefinition_type"
  | "subscription_url"
  | "testscript_url"
  | "valueset_expansion"
  | "messagebroker_host";

const r4_sp1_idx_uri_set: Set<string> = new Set([
  "http://hl7.org/fhir/SearchParameter/Resource-source",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-url",
  "http://hl7.org/fhir/SearchParameter/conformance-url",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-url",
  "http://hl7.org/fhir/SearchParameter/CodeSystem-system",
  "http://hl7.org/fhir/SearchParameter/Contract-instantiates",
  "http://hl7.org/fhir/SearchParameter/Contract-url",
  "http://hl7.org/fhir/SearchParameter/Device-url",
  "http://hl7.org/fhir/SearchParameter/DocumentManifest-source",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-url",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-url",
  "http://hl7.org/fhir/SearchParameter/Evidence-url",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-url",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-url",
  "http://hl7.org/fhir/SearchParameter/Library-url",
  "http://hl7.org/fhir/SearchParameter/Measure-url",
  "http://hl7.org/fhir/SearchParameter/MessageHeader-source-uri",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-url",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-url",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-url",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-url",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-url",
  "http://hl7.org/fhir/SearchParameter/StructureDefinition-type",
  "http://hl7.org/fhir/SearchParameter/Subscription-url",
  "http://hl7.org/fhir/SearchParameter/TestScript-url",
  "http://hl7.org/fhir/SearchParameter/ValueSet-expansion",
  "https://iguhealth.app/fhir/SearchParameter/MessageBroker-host",
]);

export function asSP1Uri(url: uri): r4_sp1_idx_uri | undefined {
  if (!r4_sp1_idx_uri_set.has(url)) return undefined;
  return sqlSafeIdentifier(url) as r4_sp1_idx_uri;
}

export type r4_sp1_idx_string =
  | "account_name"
  | "activitydefinition_description"
  | "activitydefinition_name"
  | "activitydefinition_publisher"
  | "activitydefinition_title"
  | "conformance_description"
  | "conformance_name"
  | "conformance_publisher"
  | "capabilitystatement_software"
  | "conformance_title"
  | "chargeitemdefinition_description"
  | "chargeitemdefinition_publisher"
  | "chargeitemdefinition_title"
  | "claimresponse_disposition"
  | "composition_title"
  | "condition_abatement_string"
  | "condition_onset_info"
  | "coverage_dependent"
  | "coverageeligibilityresponse_disposition"
  | "device_manufacturer"
  | "device_model"
  | "documentmanifest_description"
  | "documentreference_description"
  | "effectevidencesynthesis_description"
  | "effectevidencesynthesis_name"
  | "effectevidencesynthesis_publisher"
  | "effectevidencesynthesis_title"
  | "endpoint_name"
  | "eventdefinition_description"
  | "eventdefinition_name"
  | "eventdefinition_publisher"
  | "eventdefinition_title"
  | "evidence_description"
  | "evidence_name"
  | "evidence_publisher"
  | "evidence_title"
  | "evidencevariable_description"
  | "evidencevariable_name"
  | "evidencevariable_publisher"
  | "evidencevariable_title"
  | "examplescenario_name"
  | "examplescenario_publisher"
  | "explanationofbenefit_disposition"
  | "healthcareservice_name"
  | "immunization_lot_number"
  | "insuranceplan_phonetic"
  | "library_description"
  | "library_name"
  | "library_publisher"
  | "library_title"
  | "list_title"
  | "location_address_city"
  | "location_address_country"
  | "location_address_postalcode"
  | "location_address_state"
  | "measure_description"
  | "measure_name"
  | "measure_publisher"
  | "measure_title"
  | "messageheader_source"
  | "namingsystem_responsible"
  | "observation_value_string"
  | "organization_phonetic"
  | "paymentreconciliation_disposition"
  | "plandefinition_description"
  | "plandefinition_name"
  | "plandefinition_publisher"
  | "plandefinition_title"
  | "questionnaire_description"
  | "questionnaire_name"
  | "questionnaire_publisher"
  | "questionnaire_title"
  | "researchdefinition_description"
  | "researchdefinition_name"
  | "researchdefinition_publisher"
  | "researchdefinition_title"
  | "researchelementdefinition_description"
  | "researchelementdefinition_name"
  | "researchelementdefinition_publisher"
  | "researchelementdefinition_title"
  | "researchstudy_title"
  | "riskevidencesynthesis_description"
  | "riskevidencesynthesis_name"
  | "riskevidencesynthesis_publisher"
  | "riskevidencesynthesis_title"
  | "subscription_criteria"
  | "testreport_tester"
  | "testscript_description"
  | "testscript_name"
  | "testscript_publisher"
  | "testscript_title"
  | "accesspolicyv2_name"
  | "accesspolicy_name"
  | "clientapplication_name"
  | "identityprovider_name"
  | "messagebroker_name";

const r4_sp1_idx_string_set: Set<string> = new Set([
  "http://hl7.org/fhir/SearchParameter/Account-name",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-description",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-name",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/ActivityDefinition-title",
  "http://hl7.org/fhir/SearchParameter/conformance-description",
  "http://hl7.org/fhir/SearchParameter/conformance-name",
  "http://hl7.org/fhir/SearchParameter/conformance-publisher",
  "http://hl7.org/fhir/SearchParameter/CapabilityStatement-software",
  "http://hl7.org/fhir/SearchParameter/conformance-title",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-description",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-title",
  "http://hl7.org/fhir/SearchParameter/ClaimResponse-disposition",
  "http://hl7.org/fhir/SearchParameter/Composition-title",
  "http://hl7.org/fhir/SearchParameter/Condition-abatement-string",
  "http://hl7.org/fhir/SearchParameter/Condition-onset-info",
  "http://hl7.org/fhir/SearchParameter/Coverage-dependent",
  "http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-disposition",
  "http://hl7.org/fhir/SearchParameter/Device-manufacturer",
  "http://hl7.org/fhir/SearchParameter/Device-model",
  "http://hl7.org/fhir/SearchParameter/DocumentManifest-description",
  "http://hl7.org/fhir/SearchParameter/DocumentReference-description",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-description",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-name",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-publisher",
  "http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-title",
  "http://hl7.org/fhir/SearchParameter/Endpoint-name",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-description",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-name",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/EventDefinition-title",
  "http://hl7.org/fhir/SearchParameter/Evidence-description",
  "http://hl7.org/fhir/SearchParameter/Evidence-name",
  "http://hl7.org/fhir/SearchParameter/Evidence-publisher",
  "http://hl7.org/fhir/SearchParameter/Evidence-title",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-description",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-name",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-publisher",
  "http://hl7.org/fhir/SearchParameter/EvidenceVariable-title",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-name",
  "http://hl7.org/fhir/SearchParameter/ExampleScenario-publisher",
  "http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-disposition",
  "http://hl7.org/fhir/SearchParameter/HealthcareService-name",
  "http://hl7.org/fhir/SearchParameter/Immunization-lot-number",
  "http://hl7.org/fhir/SearchParameter/InsurancePlan-phonetic",
  "http://hl7.org/fhir/SearchParameter/Library-description",
  "http://hl7.org/fhir/SearchParameter/Library-name",
  "http://hl7.org/fhir/SearchParameter/Library-publisher",
  "http://hl7.org/fhir/SearchParameter/Library-title",
  "http://hl7.org/fhir/SearchParameter/List-title",
  "http://hl7.org/fhir/SearchParameter/Location-address-city",
  "http://hl7.org/fhir/SearchParameter/Location-address-country",
  "http://hl7.org/fhir/SearchParameter/Location-address-postalcode",
  "http://hl7.org/fhir/SearchParameter/Location-address-state",
  "http://hl7.org/fhir/SearchParameter/Measure-description",
  "http://hl7.org/fhir/SearchParameter/Measure-name",
  "http://hl7.org/fhir/SearchParameter/Measure-publisher",
  "http://hl7.org/fhir/SearchParameter/Measure-title",
  "http://hl7.org/fhir/SearchParameter/MessageHeader-source",
  "http://hl7.org/fhir/SearchParameter/NamingSystem-responsible",
  "http://hl7.org/fhir/SearchParameter/Observation-value-string",
  "http://hl7.org/fhir/SearchParameter/Organization-phonetic",
  "http://hl7.org/fhir/SearchParameter/PaymentReconciliation-disposition",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-description",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-name",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/PlanDefinition-title",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-description",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-name",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-publisher",
  "http://hl7.org/fhir/SearchParameter/Questionnaire-title",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-description",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-name",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/ResearchDefinition-title",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-description",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-name",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-publisher",
  "http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-title",
  "http://hl7.org/fhir/SearchParameter/ResearchStudy-title",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-description",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-name",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-publisher",
  "http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-title",
  "http://hl7.org/fhir/SearchParameter/Subscription-criteria",
  "http://hl7.org/fhir/SearchParameter/TestReport-tester",
  "http://hl7.org/fhir/SearchParameter/TestScript-description",
  "http://hl7.org/fhir/SearchParameter/TestScript-name",
  "http://hl7.org/fhir/SearchParameter/TestScript-publisher",
  "http://hl7.org/fhir/SearchParameter/TestScript-title",
  "https://iguhealth.app/fhir/SearchParameter/AccessPolicyV2-name",
  "https://iguhealth.app/fhir/SearchParameter/AccessPolicy-name",
  "https://iguhealth.app/fhir/SearchParameter/ClientApplication-name",
  "https://iguhealth.app/fhir/SearchParameter/IdentityProvider-name",
  "https://iguhealth.app/fhir/SearchParameter/MessageBroker-name",
]);

export function asSP1String(url: uri): r4_sp1_idx_string | undefined {
  if (!r4_sp1_idx_string_set.has(url)) return undefined;
  return sqlSafeIdentifier(url) as r4_sp1_idx_string;
}

export type r4_sp1_idx_number =
  | "chargeitem_factor_override"
  | "molecularsequence_window_end"
  | "molecularsequence_window_start";

const r4_sp1_idx_number_set: Set<string> = new Set([
  "http://hl7.org/fhir/SearchParameter/ChargeItem-factor-override",
  "http://hl7.org/fhir/SearchParameter/MolecularSequence-window-end",
  "http://hl7.org/fhir/SearchParameter/MolecularSequence-window-start",
]);

export function asSP1Number(url: uri): r4_sp1_idx_number | undefined {
  if (!r4_sp1_idx_number_set.has(url)) return undefined;
  return sqlSafeIdentifier(url) as r4_sp1_idx_number;
}

export type r4_sp1_idx_quantity =
  | "chargeitem_price_override"
  | "chargeitem_quantity"
  | "condition_abatement_age"
  | "condition_onset_age"
  | "encounter_length"
  | "invoice_totalgross"
  | "invoice_totalnet";

const r4_sp1_idx_quantity_set: Set<string> = new Set([
  "http://hl7.org/fhir/SearchParameter/ChargeItem-price-override",
  "http://hl7.org/fhir/SearchParameter/ChargeItem-quantity",
  "http://hl7.org/fhir/SearchParameter/Condition-abatement-age",
  "http://hl7.org/fhir/SearchParameter/Condition-onset-age",
  "http://hl7.org/fhir/SearchParameter/Encounter-length",
  "http://hl7.org/fhir/SearchParameter/Invoice-totalgross",
  "http://hl7.org/fhir/SearchParameter/Invoice-totalnet",
]);

export function asSP1Quantity(url: uri): r4_sp1_idx_quantity | undefined {
  if (!r4_sp1_idx_quantity_set.has(url)) return undefined;
  return sqlSafeIdentifier(url) as r4_sp1_idx_quantity;
}
