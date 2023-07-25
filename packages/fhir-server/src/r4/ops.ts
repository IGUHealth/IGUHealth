import type * as fhirTypes from "@iguhealth/fhir-types";
import { Operation, OperationExecution } from "@iguhealth/operation-execution";
type ActivityDefinitionApplyInput = {
  activityDefinition: fhirTypes.ActivityDefinition;
  subject: fhirTypes.string;
  encounter: fhirTypes.string;
  practitioner: fhirTypes.string;
  organization: fhirTypes.string;
  userType: fhirTypes.CodeableConcept;
  userLanguage: fhirTypes.CodeableConcept;
  userTaskContext: fhirTypes.CodeableConcept;
  setting: fhirTypes.CodeableConcept;
  settingContext: fhirTypes.CodeableConcept;
};
type ActivityDefinitionApplyOutput = { return: fhirTypes.Resource };
type ActivityDefinitionApply<CTX> = Operation<
  CTX,
  ActivityDefinitionApplyInput,
  ActivityDefinitionApplyOutput
>;
type ActivityDefinitionDataRequirementsInput = {};
type ActivityDefinitionDataRequirementsOutput = { return: fhirTypes.Library };
type ActivityDefinitionDataRequirements<CTX> = Operation<
  CTX,
  ActivityDefinitionDataRequirementsInput,
  ActivityDefinitionDataRequirementsOutput
>;
type CapabilityStatementConformsInput = {
  left: fhirTypes.canonical;
  right: fhirTypes.canonical;
  mode: fhirTypes.code;
};
type CapabilityStatementConformsOutput = {
  issues: fhirTypes.OperationOutcome;
  union: fhirTypes.CapabilityStatement;
  intersection: fhirTypes.CapabilityStatement;
};
type CapabilityStatementConforms<CTX> = Operation<
  CTX,
  CapabilityStatementConformsInput,
  CapabilityStatementConformsOutput
>;
type CapabilityStatementImplementsInput = {
  server: fhirTypes.canonical;
  client: fhirTypes.canonical;
  resource: fhirTypes.CapabilityStatement;
};
type CapabilityStatementImplementsOutput = {
  return: fhirTypes.OperationOutcome;
};
type CapabilityStatementImplements<CTX> = Operation<
  CTX,
  CapabilityStatementImplementsInput,
  CapabilityStatementImplementsOutput
>;
function CapabilityStatementExecutor<CTX>(
  executor: CapabilityStatementImplements<CTX>["constructor"]["prototype"]["_execute"]
): CapabilityStatementImplements<CTX> {
  return new OperationExecution(
    {
      resourceType: "OperationDefinition",
      code: "blah",
      name: "what",
      system: false,
      type: false,
      instance: false,
      status: "final",
      kind: "resource",
    },
    executor
  );
}

type CapabilityStatementSubsetInput = {
  server: fhirTypes.uri;
  resource: fhirTypes.code;
};
type CapabilityStatementSubsetOutput = {
  return: fhirTypes.CapabilityStatement;
};
type CapabilityStatementSubset<CTX> = Operation<
  CTX,
  CapabilityStatementSubsetInput,
  CapabilityStatementSubsetOutput
>;
type CapabilityStatementVersionsInput = {};
type CapabilityStatementVersionsOutput = {
  version: fhirTypes.code;
  default: fhirTypes.code;
};
type CapabilityStatementVersions<CTX> = Operation<
  CTX,
  CapabilityStatementVersionsInput,
  CapabilityStatementVersionsOutput
>;
type ChargeItemDefinitionApplyInput = {
  chargeItem: fhirTypes.Reference;
  account: fhirTypes.Reference;
};
type ChargeItemDefinitionApplyOutput = { return: fhirTypes.Resource };
type ChargeItemDefinitionApply<CTX> = Operation<
  CTX,
  ChargeItemDefinitionApplyInput,
  ChargeItemDefinitionApplyOutput
>;
type ClaimSubmitInput = { resource: fhirTypes.Resource };
type ClaimSubmitOutput = { return: fhirTypes.Resource };
type ClaimSubmit<CTX> = Operation<CTX, ClaimSubmitInput, ClaimSubmitOutput>;
type CodeSystemFindMatchesInput = {
  system: fhirTypes.uri;
  version: fhirTypes.string;
  property: {
    code: fhirTypes.code;
    value: fhirTypes.Element;
    subproperty: { code: fhirTypes.code; value: fhirTypes.Element };
  };
  exact: fhirTypes.boolean;
  compositional: fhirTypes.boolean;
};
type CodeSystemFindMatchesOutput = {
  match: {
    code: fhirTypes.Coding;
    unmatched: {
      code: fhirTypes.code;
      value: fhirTypes.Element;
      property: { code: fhirTypes.code; value: fhirTypes.Element };
    };
    comment: fhirTypes.string;
  };
};
type CodeSystemFindMatches<CTX> = Operation<
  CTX,
  CodeSystemFindMatchesInput,
  CodeSystemFindMatchesOutput
>;
type CodeSystemLookupInput = {
  code: fhirTypes.code;
  system: fhirTypes.uri;
  version: fhirTypes.string;
  coding: fhirTypes.Coding;
  date: fhirTypes.dateTime;
  displayLanguage: fhirTypes.code;
  property: fhirTypes.code;
};
type CodeSystemLookupOutput = {
  name: fhirTypes.string;
  version: fhirTypes.string;
  display: fhirTypes.string;
  designation: {
    language: fhirTypes.code;
    use: fhirTypes.Coding;
    value: fhirTypes.string;
  };
  property: {
    code: fhirTypes.code;
    value: fhirTypes.Element;
    description: fhirTypes.string;
    subproperty: {
      code: fhirTypes.code;
      value: fhirTypes.Element;
      description: fhirTypes.string;
    };
  };
};
type CodeSystemLookup<CTX> = Operation<
  CTX,
  CodeSystemLookupInput,
  CodeSystemLookupOutput
>;
type CodeSystemSubsumesInput = {
  codeA: fhirTypes.code;
  codeB: fhirTypes.code;
  system: fhirTypes.uri;
  version: fhirTypes.string;
  codingA: fhirTypes.Coding;
  codingB: fhirTypes.Coding;
};
type CodeSystemSubsumesOutput = { outcome: fhirTypes.code };
type CodeSystemSubsumes<CTX> = Operation<
  CTX,
  CodeSystemSubsumesInput,
  CodeSystemSubsumesOutput
>;
type CodeSystemValidateCodeInput = {
  url: fhirTypes.uri;
  codeSystem: fhirTypes.CodeSystem;
  code: fhirTypes.code;
  version: fhirTypes.string;
  display: fhirTypes.string;
  coding: fhirTypes.Coding;
  codeableConcept: fhirTypes.CodeableConcept;
  date: fhirTypes.dateTime;
  abstract: fhirTypes.boolean;
  displayLanguage: fhirTypes.code;
};
type CodeSystemValidateCodeOutput = {
  result: fhirTypes.boolean;
  message: fhirTypes.string;
  display: fhirTypes.string;
};
type CodeSystemValidateCode<CTX> = Operation<
  CTX,
  CodeSystemValidateCodeInput,
  CodeSystemValidateCodeOutput
>;
type CompositionDocumentInput = {
  id: fhirTypes.uri;
  persist: fhirTypes.boolean;
  graph: fhirTypes.uri;
};
type CompositionDocumentOutput = {};
type CompositionDocument<CTX> = Operation<
  CTX,
  CompositionDocumentInput,
  CompositionDocumentOutput
>;
type ConceptMapClosureInput = {
  name: fhirTypes.string;
  concept: fhirTypes.Coding;
  version: fhirTypes.string;
};
type ConceptMapClosureOutput = { return: fhirTypes.ConceptMap };
type ConceptMapClosure<CTX> = Operation<
  CTX,
  ConceptMapClosureInput,
  ConceptMapClosureOutput
>;
type ConceptMapTranslateInput = {
  url: fhirTypes.uri;
  conceptMap: fhirTypes.ConceptMap;
  conceptMapVersion: fhirTypes.string;
  code: fhirTypes.code;
  system: fhirTypes.uri;
  version: fhirTypes.string;
  source: fhirTypes.uri;
  coding: fhirTypes.Coding;
  codeableConcept: fhirTypes.CodeableConcept;
  target: fhirTypes.uri;
  targetsystem: fhirTypes.uri;
  dependency: { element: fhirTypes.uri; concept: fhirTypes.CodeableConcept };
  reverse: fhirTypes.boolean;
};
type ConceptMapTranslateOutput = {
  result: fhirTypes.boolean;
  message: fhirTypes.string;
  match: {
    equivalence: fhirTypes.code;
    concept: fhirTypes.Coding;
    product: { element: fhirTypes.uri; concept: fhirTypes.Coding };
    source: fhirTypes.uri;
  };
};
type ConceptMapTranslate<CTX> = Operation<
  CTX,
  ConceptMapTranslateInput,
  ConceptMapTranslateOutput
>;
type CoverageEligibilityRequestSubmitInput = { resource: fhirTypes.Resource };
type CoverageEligibilityRequestSubmitOutput = { return: fhirTypes.Resource };
type CoverageEligibilityRequestSubmit<CTX> = Operation<
  CTX,
  CoverageEligibilityRequestSubmitInput,
  CoverageEligibilityRequestSubmitOutput
>;
type EncounterEverythingInput = {
  _since: fhirTypes.instant;
  _type: fhirTypes.code;
  _count: fhirTypes.integer;
};
type EncounterEverythingOutput = { return: fhirTypes.Bundle };
type EncounterEverything<CTX> = Operation<
  CTX,
  EncounterEverythingInput,
  EncounterEverythingOutput
>;
type GroupEverythingInput = {
  start: fhirTypes.date;
  end: fhirTypes.date;
  _since: fhirTypes.instant;
  _type: fhirTypes.code;
  _count: fhirTypes.integer;
};
type GroupEverythingOutput = { return: fhirTypes.Bundle };
type GroupEverything<CTX> = Operation<
  CTX,
  GroupEverythingInput,
  GroupEverythingOutput
>;
type LibraryDataRequirementsInput = { target: fhirTypes.string };
type LibraryDataRequirementsOutput = { return: fhirTypes.Library };
type LibraryDataRequirements<CTX> = Operation<
  CTX,
  LibraryDataRequirementsInput,
  LibraryDataRequirementsOutput
>;
type ListFindInput = { patient: fhirTypes.id; name: fhirTypes.code };
type ListFindOutput = {};
type ListFind<CTX> = Operation<CTX, ListFindInput, ListFindOutput>;
type MeasureCareGapsInput = {
  periodStart: fhirTypes.date;
  periodEnd: fhirTypes.date;
  topic: fhirTypes.string;
  subject: fhirTypes.string;
};
type MeasureCareGapsOutput = { return: fhirTypes.Bundle };
type MeasureCareGaps<CTX> = Operation<
  CTX,
  MeasureCareGapsInput,
  MeasureCareGapsOutput
>;
type MeasureCollectDataInput = {
  periodStart: fhirTypes.date;
  periodEnd: fhirTypes.date;
  measure: fhirTypes.string;
  subject: fhirTypes.string;
  practitioner: fhirTypes.string;
  lastReceivedOn: fhirTypes.dateTime;
};
type MeasureCollectDataOutput = {
  measureReport: fhirTypes.MeasureReport;
  resource: fhirTypes.Resource;
};
type MeasureCollectData<CTX> = Operation<
  CTX,
  MeasureCollectDataInput,
  MeasureCollectDataOutput
>;
type MeasureDataRequirementsInput = {
  periodStart: fhirTypes.date;
  periodEnd: fhirTypes.date;
};
type MeasureDataRequirementsOutput = { return: fhirTypes.Library };
type MeasureDataRequirements<CTX> = Operation<
  CTX,
  MeasureDataRequirementsInput,
  MeasureDataRequirementsOutput
>;
type MeasureEvaluateMeasureInput = {
  periodStart: fhirTypes.date;
  periodEnd: fhirTypes.date;
  measure: fhirTypes.string;
  reportType: fhirTypes.code;
  subject: fhirTypes.string;
  practitioner: fhirTypes.string;
  lastReceivedOn: fhirTypes.dateTime;
};
type MeasureEvaluateMeasureOutput = { return: fhirTypes.MeasureReport };
type MeasureEvaluateMeasure<CTX> = Operation<
  CTX,
  MeasureEvaluateMeasureInput,
  MeasureEvaluateMeasureOutput
>;
type MeasureSubmitDataInput = {
  measureReport: fhirTypes.MeasureReport;
  resource: fhirTypes.Resource;
};
type MeasureSubmitDataOutput = {};
type MeasureSubmitData<CTX> = Operation<
  CTX,
  MeasureSubmitDataInput,
  MeasureSubmitDataOutput
>;
type MedicinalProductEverythingInput = {
  _since: fhirTypes.instant;
  _count: fhirTypes.integer;
};
type MedicinalProductEverythingOutput = { return: fhirTypes.Bundle };
type MedicinalProductEverything<CTX> = Operation<
  CTX,
  MedicinalProductEverythingInput,
  MedicinalProductEverythingOutput
>;
type MessageHeaderProcessMessageInput = {
  content: fhirTypes.Bundle;
  async: fhirTypes.boolean;
  "response-url": fhirTypes.url;
};
type MessageHeaderProcessMessageOutput = { return: fhirTypes.Bundle };
type MessageHeaderProcessMessage<CTX> = Operation<
  CTX,
  MessageHeaderProcessMessageInput,
  MessageHeaderProcessMessageOutput
>;
type NamingSystemPreferredIdInput = {
  id: fhirTypes.string;
  type: fhirTypes.code;
};
type NamingSystemPreferredIdOutput = { result: fhirTypes.string };
type NamingSystemPreferredId<CTX> = Operation<
  CTX,
  NamingSystemPreferredIdInput,
  NamingSystemPreferredIdOutput
>;
type ObservationLastnInput = { max: fhirTypes.positiveInt };
type ObservationLastnOutput = { return: fhirTypes.Bundle };
type ObservationLastn<CTX> = Operation<
  CTX,
  ObservationLastnInput,
  ObservationLastnOutput
>;
type ObservationStatsInput = {
  subject: fhirTypes.uri;
  code: fhirTypes.string;
  system: fhirTypes.uri;
  coding: fhirTypes.Coding;
  duration: fhirTypes.decimal;
  period: fhirTypes.Period;
  statistic: fhirTypes.code;
  include: fhirTypes.boolean;
  limit: fhirTypes.positiveInt;
};
type ObservationStatsOutput = {
  statistics: fhirTypes.Observation;
  source: fhirTypes.Observation;
};
type ObservationStats<CTX> = Operation<
  CTX,
  ObservationStatsInput,
  ObservationStatsOutput
>;
type PatientEverythingInput = {
  start: fhirTypes.date;
  end: fhirTypes.date;
  _since: fhirTypes.instant;
  _type: fhirTypes.code;
  _count: fhirTypes.integer;
};
type PatientEverythingOutput = { return: fhirTypes.Bundle };
type PatientEverything<CTX> = Operation<
  CTX,
  PatientEverythingInput,
  PatientEverythingOutput
>;
type PatientMatchInput = {
  resource: fhirTypes.Resource;
  onlyCertainMatches: fhirTypes.boolean;
  count: fhirTypes.integer;
};
type PatientMatchOutput = { return: fhirTypes.Bundle };
type PatientMatch<CTX> = Operation<CTX, PatientMatchInput, PatientMatchOutput>;
type PlanDefinitionApplyInput = {
  planDefinition: fhirTypes.PlanDefinition;
  subject: fhirTypes.string;
  encounter: fhirTypes.string;
  practitioner: fhirTypes.string;
  organization: fhirTypes.string;
  userType: fhirTypes.CodeableConcept;
  userLanguage: fhirTypes.CodeableConcept;
  userTaskContext: fhirTypes.CodeableConcept;
  setting: fhirTypes.CodeableConcept;
  settingContext: fhirTypes.CodeableConcept;
};
type PlanDefinitionApplyOutput = { return: fhirTypes.CarePlan };
type PlanDefinitionApply<CTX> = Operation<
  CTX,
  PlanDefinitionApplyInput,
  PlanDefinitionApplyOutput
>;
type PlanDefinitionDataRequirementsInput = {};
type PlanDefinitionDataRequirementsOutput = { return: fhirTypes.Library };
type PlanDefinitionDataRequirements<CTX> = Operation<
  CTX,
  PlanDefinitionDataRequirementsInput,
  PlanDefinitionDataRequirementsOutput
>;
type ResourceConvertInput = { input: fhirTypes.Resource };
type ResourceConvertOutput = { output: fhirTypes.Resource };
type ResourceConvert<CTX> = Operation<
  CTX,
  ResourceConvertInput,
  ResourceConvertOutput
>;
type ResourceGraphInput = { graph: fhirTypes.uri };
type ResourceGraphOutput = { result: fhirTypes.Bundle };
type ResourceGraph<CTX> = Operation<
  CTX,
  ResourceGraphInput,
  ResourceGraphOutput
>;
type ResourceGraphqlInput = { query: fhirTypes.string };
type ResourceGraphqlOutput = { result: fhirTypes.Binary };
type ResourceGraphql<CTX> = Operation<
  CTX,
  ResourceGraphqlInput,
  ResourceGraphqlOutput
>;
type ResourceMetaInput = {};
type ResourceMetaOutput = { return: fhirTypes.Meta };
type ResourceMeta<CTX> = Operation<CTX, ResourceMetaInput, ResourceMetaOutput>;
type ResourceMetaAddInput = { meta: fhirTypes.Meta };
type ResourceMetaAddOutput = { return: fhirTypes.Meta };
type ResourceMetaAdd<CTX> = Operation<
  CTX,
  ResourceMetaAddInput,
  ResourceMetaAddOutput
>;
type ResourceMetaDeleteInput = { meta: fhirTypes.Meta };
type ResourceMetaDeleteOutput = { return: fhirTypes.Meta };
type ResourceMetaDelete<CTX> = Operation<
  CTX,
  ResourceMetaDeleteInput,
  ResourceMetaDeleteOutput
>;
type ResourceValidateInput = {
  resource: fhirTypes.Resource;
  mode: fhirTypes.code;
  profile: fhirTypes.uri;
};
type ResourceValidateOutput = { return: fhirTypes.OperationOutcome };
type ResourceValidate<CTX> = Operation<
  CTX,
  ResourceValidateInput,
  ResourceValidateOutput
>;
type StructureDefinitionQuestionnaireInput = {
  identifier: fhirTypes.canonical;
  profile: fhirTypes.string;
  url: fhirTypes.canonical;
  supportedOnly: fhirTypes.boolean;
};
type StructureDefinitionQuestionnaireOutput = {
  return: fhirTypes.Questionnaire;
};
type StructureDefinitionQuestionnaire<CTX> = Operation<
  CTX,
  StructureDefinitionQuestionnaireInput,
  StructureDefinitionQuestionnaireOutput
>;
type StructureDefinitionSnapshotInput = {
  definition: fhirTypes.StructureDefinition;
  url: fhirTypes.string;
};
type StructureDefinitionSnapshotOutput = {
  return: fhirTypes.StructureDefinition;
};
type StructureDefinitionSnapshot<CTX> = Operation<
  CTX,
  StructureDefinitionSnapshotInput,
  StructureDefinitionSnapshotOutput
>;
type StructureMapTransformInput = {
  source: fhirTypes.uri;
  content: fhirTypes.Resource;
};
type StructureMapTransformOutput = { return: fhirTypes.Resource };
type StructureMapTransform<CTX> = Operation<
  CTX,
  StructureMapTransformInput,
  StructureMapTransformOutput
>;
type ValueSetExpandInput = {
  url: fhirTypes.uri;
  valueSet: fhirTypes.ValueSet;
  valueSetVersion: fhirTypes.string;
  context: fhirTypes.uri;
  contextDirection: fhirTypes.code;
  filter: fhirTypes.string;
  date: fhirTypes.dateTime;
  offset: fhirTypes.integer;
  count: fhirTypes.integer;
  includeDesignations: fhirTypes.boolean;
  designation: fhirTypes.string;
  includeDefinition: fhirTypes.boolean;
  activeOnly: fhirTypes.boolean;
  excludeNested: fhirTypes.boolean;
  excludeNotForUI: fhirTypes.boolean;
  excludePostCoordinated: fhirTypes.boolean;
  displayLanguage: fhirTypes.code;
  "exclude-system": fhirTypes.canonical;
  "system-version": fhirTypes.canonical;
  "check-system-version": fhirTypes.canonical;
  "force-system-version": fhirTypes.canonical;
};
type ValueSetExpandOutput = { return: fhirTypes.ValueSet };
type ValueSetExpand<CTX> = Operation<
  CTX,
  ValueSetExpandInput,
  ValueSetExpandOutput
>;
type ValueSetValidateCodeInput = {
  url: fhirTypes.uri;
  context: fhirTypes.uri;
  valueSet: fhirTypes.ValueSet;
  valueSetVersion: fhirTypes.string;
  code: fhirTypes.code;
  system: fhirTypes.uri;
  systemVersion: fhirTypes.string;
  display: fhirTypes.string;
  coding: fhirTypes.Coding;
  codeableConcept: fhirTypes.CodeableConcept;
  date: fhirTypes.dateTime;
  abstract: fhirTypes.boolean;
  displayLanguage: fhirTypes.code;
};
type ValueSetValidateCodeOutput = {
  result: fhirTypes.boolean;
  message: fhirTypes.string;
  display: fhirTypes.string;
};
type ValueSetValidateCode<CTX> = Operation<
  CTX,
  ValueSetValidateCodeInput,
  ValueSetValidateCodeOutput
>;
