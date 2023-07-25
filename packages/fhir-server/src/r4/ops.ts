import type * as fhirTypes from "@iguhealth/fhir-types";
import type { Operation, Executor } from "@iguhealth/operation-execution";
export namespace ActivityDefinitionApply {
  export type Input = {
    activityDefinition?: fhirTypes.ActivityDefinition;
    subject: Array<fhirTypes.string>;
    encounter?: fhirTypes.string;
    practitioner?: fhirTypes.string;
    organization?: fhirTypes.string;
    userType?: fhirTypes.CodeableConcept;
    userLanguage?: fhirTypes.CodeableConcept;
    userTaskContext?: fhirTypes.CodeableConcept;
    setting?: fhirTypes.CodeableConcept;
    settingContext?: fhirTypes.CodeableConcept;
  };
  export type Output = { return: fhirTypes.Resource };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ActivityDefinitionDataRequirements {
  export type Input = {};
  export type Output = { return: fhirTypes.Library };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace CapabilityStatementConforms {
  export type Input = {
    left?: fhirTypes.canonical;
    right?: fhirTypes.canonical;
    mode?: fhirTypes.code;
  };
  export type Output = {
    issues: fhirTypes.OperationOutcome;
    union?: fhirTypes.CapabilityStatement;
    intersection?: fhirTypes.CapabilityStatement;
  };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace CapabilityStatementImplements {
  export type Input = {
    server?: fhirTypes.canonical;
    client?: fhirTypes.canonical;
    resource?: fhirTypes.CapabilityStatement;
  };
  export type Output = { return: fhirTypes.OperationOutcome };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace CapabilityStatementSubset {
  export type Input = {
    server?: fhirTypes.uri;
    resource: Array<fhirTypes.code>;
  };
  export type Output = { return: fhirTypes.CapabilityStatement };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace CapabilityStatementVersions {
  export type Input = {};
  export type Output = {
    version: Array<fhirTypes.code>;
    default: fhirTypes.code;
  };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ChargeItemDefinitionApply {
  export type Input = {
    chargeItem: fhirTypes.Reference;
    account?: fhirTypes.Reference;
  };
  export type Output = { return: fhirTypes.Resource };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ClaimSubmit {
  export type Input = { resource: fhirTypes.Resource };
  export type Output = { return: fhirTypes.Resource };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace CodeSystemFindMatches {
  export type Input = {
    system?: fhirTypes.uri;
    version?: fhirTypes.string;
    property?: Array<{
      code: fhirTypes.code;
      value?: fhirTypes.Element;
      subproperty?: Array<{ code: fhirTypes.code; value: fhirTypes.Element }>;
    }>;
    exact: fhirTypes.boolean;
    compositional?: fhirTypes.boolean;
  };
  export type Output = {
    match?: Array<{
      code: fhirTypes.Coding;
      unmatched?: Array<{
        code: fhirTypes.code;
        value: fhirTypes.Element;
        property?: Array<{ code: fhirTypes.code; value: fhirTypes.Element }>;
      }>;
      comment?: fhirTypes.string;
    }>;
  };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace CodeSystemLookup {
  export type Input = {
    code?: fhirTypes.code;
    system?: fhirTypes.uri;
    version?: fhirTypes.string;
    coding?: fhirTypes.Coding;
    date?: fhirTypes.dateTime;
    displayLanguage?: fhirTypes.code;
    property?: Array<fhirTypes.code>;
  };
  export type Output = {
    name: fhirTypes.string;
    version?: fhirTypes.string;
    display: fhirTypes.string;
    designation?: Array<{
      language?: fhirTypes.code;
      use?: fhirTypes.Coding;
      value: fhirTypes.string;
    }>;
    property?: Array<{
      code: fhirTypes.code;
      value?: fhirTypes.Element;
      description?: fhirTypes.string;
      subproperty?: Array<{
        code: fhirTypes.code;
        value: fhirTypes.Element;
        description?: fhirTypes.string;
      }>;
    }>;
  };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace CodeSystemSubsumes {
  export type Input = {
    codeA?: fhirTypes.code;
    codeB?: fhirTypes.code;
    system?: fhirTypes.uri;
    version?: fhirTypes.string;
    codingA?: fhirTypes.Coding;
    codingB?: fhirTypes.Coding;
  };
  export type Output = { outcome: fhirTypes.code };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace CodeSystemValidateCode {
  export type Input = {
    url?: fhirTypes.uri;
    codeSystem?: fhirTypes.CodeSystem;
    code?: fhirTypes.code;
    version?: fhirTypes.string;
    display?: fhirTypes.string;
    coding?: fhirTypes.Coding;
    codeableConcept?: fhirTypes.CodeableConcept;
    date?: fhirTypes.dateTime;
    abstract?: fhirTypes.boolean;
    displayLanguage?: fhirTypes.code;
  };
  export type Output = {
    result: fhirTypes.boolean;
    message?: fhirTypes.string;
    display?: fhirTypes.string;
  };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace CompositionDocument {
  export type Input = {
    id?: fhirTypes.uri;
    persist?: fhirTypes.boolean;
    graph?: fhirTypes.uri;
  };
  export type Output = {};
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ConceptMapClosure {
  export type Input = {
    name: fhirTypes.string;
    concept?: Array<fhirTypes.Coding>;
    version?: fhirTypes.string;
  };
  export type Output = { return: fhirTypes.ConceptMap };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ConceptMapTranslate {
  export type Input = {
    url?: fhirTypes.uri;
    conceptMap?: fhirTypes.ConceptMap;
    conceptMapVersion?: fhirTypes.string;
    code?: fhirTypes.code;
    system?: fhirTypes.uri;
    version?: fhirTypes.string;
    source?: fhirTypes.uri;
    coding?: fhirTypes.Coding;
    codeableConcept?: fhirTypes.CodeableConcept;
    target?: fhirTypes.uri;
    targetsystem?: fhirTypes.uri;
    dependency?: Array<{
      element?: fhirTypes.uri;
      concept?: fhirTypes.CodeableConcept;
    }>;
    reverse?: fhirTypes.boolean;
  };
  export type Output = {
    result: fhirTypes.boolean;
    message?: fhirTypes.string;
    match?: Array<{
      equivalence?: fhirTypes.code;
      concept?: fhirTypes.Coding;
      product?: Array<{ element?: fhirTypes.uri; concept?: fhirTypes.Coding }>;
      source?: fhirTypes.uri;
    }>;
  };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace CoverageEligibilityRequestSubmit {
  export type Input = { resource: fhirTypes.Resource };
  export type Output = { return: fhirTypes.Resource };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace EncounterEverything {
  export type Input = {
    _since?: fhirTypes.instant;
    _type?: Array<fhirTypes.code>;
    _count?: fhirTypes.integer;
  };
  export type Output = { return: fhirTypes.Bundle };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace GroupEverything {
  export type Input = {
    start?: fhirTypes.date;
    end?: fhirTypes.date;
    _since?: fhirTypes.instant;
    _type?: Array<fhirTypes.code>;
    _count?: fhirTypes.integer;
  };
  export type Output = { return: fhirTypes.Bundle };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace LibraryDataRequirements {
  export type Input = { target?: fhirTypes.string };
  export type Output = { return: fhirTypes.Library };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ListFind {
  export type Input = { patient: fhirTypes.id; name: fhirTypes.code };
  export type Output = {};
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace MeasureCareGaps {
  export type Input = {
    periodStart: fhirTypes.date;
    periodEnd: fhirTypes.date;
    topic: fhirTypes.string;
    subject: fhirTypes.string;
  };
  export type Output = { return: fhirTypes.Bundle };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace MeasureCollectData {
  export type Input = {
    periodStart: fhirTypes.date;
    periodEnd: fhirTypes.date;
    measure?: fhirTypes.string;
    subject?: fhirTypes.string;
    practitioner?: fhirTypes.string;
    lastReceivedOn?: fhirTypes.dateTime;
  };
  export type Output = {
    measureReport: fhirTypes.MeasureReport;
    resource?: Array<fhirTypes.Resource>;
  };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace MeasureDataRequirements {
  export type Input = {
    periodStart: fhirTypes.date;
    periodEnd: fhirTypes.date;
  };
  export type Output = { return: fhirTypes.Library };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace MeasureEvaluateMeasure {
  export type Input = {
    periodStart: fhirTypes.date;
    periodEnd: fhirTypes.date;
    measure?: fhirTypes.string;
    reportType?: fhirTypes.code;
    subject?: fhirTypes.string;
    practitioner?: fhirTypes.string;
    lastReceivedOn?: fhirTypes.dateTime;
  };
  export type Output = { return: fhirTypes.MeasureReport };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace MeasureSubmitData {
  export type Input = {
    measureReport: fhirTypes.MeasureReport;
    resource?: Array<fhirTypes.Resource>;
  };
  export type Output = {};
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace MedicinalProductEverything {
  export type Input = {
    _since?: fhirTypes.instant;
    _count?: fhirTypes.integer;
  };
  export type Output = { return: fhirTypes.Bundle };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace MessageHeaderProcessMessage {
  export type Input = {
    content: fhirTypes.Bundle;
    async?: fhirTypes.boolean;
    "response-url"?: fhirTypes.url;
  };
  export type Output = { return?: fhirTypes.Bundle };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace NamingSystemPreferredId {
  export type Input = { id: fhirTypes.string; type: fhirTypes.code };
  export type Output = { result: fhirTypes.string };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ObservationLastn {
  export type Input = { max?: fhirTypes.positiveInt };
  export type Output = { return: fhirTypes.Bundle };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ObservationStats {
  export type Input = {
    subject: fhirTypes.uri;
    code?: Array<fhirTypes.string>;
    system?: fhirTypes.uri;
    coding?: Array<fhirTypes.Coding>;
    duration?: fhirTypes.decimal;
    period?: fhirTypes.Period;
    statistic: Array<fhirTypes.code>;
    include?: fhirTypes.boolean;
    limit?: fhirTypes.positiveInt;
  };
  export type Output = {
    statistics: Array<fhirTypes.Observation>;
    source?: Array<fhirTypes.Observation>;
  };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace PatientEverything {
  export type Input = {
    start?: fhirTypes.date;
    end?: fhirTypes.date;
    _since?: fhirTypes.instant;
    _type?: Array<fhirTypes.code>;
    _count?: fhirTypes.integer;
  };
  export type Output = { return: fhirTypes.Bundle };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace PatientMatch {
  export type Input = {
    resource: fhirTypes.Resource;
    onlyCertainMatches?: fhirTypes.boolean;
    count?: fhirTypes.integer;
  };
  export type Output = { return: fhirTypes.Bundle };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace PlanDefinitionApply {
  export type Input = {
    planDefinition?: fhirTypes.PlanDefinition;
    subject: Array<fhirTypes.string>;
    encounter?: fhirTypes.string;
    practitioner?: fhirTypes.string;
    organization?: fhirTypes.string;
    userType?: fhirTypes.CodeableConcept;
    userLanguage?: fhirTypes.CodeableConcept;
    userTaskContext?: fhirTypes.CodeableConcept;
    setting?: fhirTypes.CodeableConcept;
    settingContext?: fhirTypes.CodeableConcept;
  };
  export type Output = { return: fhirTypes.CarePlan };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace PlanDefinitionDataRequirements {
  export type Input = {};
  export type Output = { return: fhirTypes.Library };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ResourceConvert {
  export type Input = { input: fhirTypes.Resource };
  export type Output = { output: fhirTypes.Resource };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ResourceGraph {
  export type Input = { graph: fhirTypes.uri };
  export type Output = { result: fhirTypes.Bundle };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ResourceGraphql {
  export type Input = { query: fhirTypes.string };
  export type Output = { result: fhirTypes.Binary };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ResourceMeta {
  export type Input = {};
  export type Output = { return: fhirTypes.Meta };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ResourceMetaAdd {
  export type Input = { meta: fhirTypes.Meta };
  export type Output = { return: fhirTypes.Meta };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ResourceMetaDelete {
  export type Input = { meta: fhirTypes.Meta };
  export type Output = { return: fhirTypes.Meta };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ResourceValidate {
  export type Input = {
    resource?: fhirTypes.Resource;
    mode?: fhirTypes.code;
    profile?: fhirTypes.uri;
  };
  export type Output = { return: fhirTypes.OperationOutcome };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace StructureDefinitionQuestionnaire {
  export type Input = {
    identifier?: fhirTypes.canonical;
    profile?: fhirTypes.string;
    url?: fhirTypes.canonical;
    supportedOnly?: fhirTypes.boolean;
  };
  export type Output = { return: fhirTypes.Questionnaire };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace StructureDefinitionSnapshot {
  export type Input = {
    definition?: fhirTypes.StructureDefinition;
    url?: fhirTypes.string;
  };
  export type Output = { return: fhirTypes.StructureDefinition };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace StructureMapTransform {
  export type Input = { source?: fhirTypes.uri; content: fhirTypes.Resource };
  export type Output = { return: fhirTypes.Resource };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ValueSetExpand {
  export type Input = {
    url?: fhirTypes.uri;
    valueSet?: fhirTypes.ValueSet;
    valueSetVersion?: fhirTypes.string;
    context?: fhirTypes.uri;
    contextDirection?: fhirTypes.code;
    filter?: fhirTypes.string;
    date?: fhirTypes.dateTime;
    offset?: fhirTypes.integer;
    count?: fhirTypes.integer;
    includeDesignations?: fhirTypes.boolean;
    designation?: Array<fhirTypes.string>;
    includeDefinition?: fhirTypes.boolean;
    activeOnly?: fhirTypes.boolean;
    excludeNested?: fhirTypes.boolean;
    excludeNotForUI?: fhirTypes.boolean;
    excludePostCoordinated?: fhirTypes.boolean;
    displayLanguage?: fhirTypes.code;
    "exclude-system"?: Array<fhirTypes.canonical>;
    "system-version"?: Array<fhirTypes.canonical>;
    "check-system-version"?: Array<fhirTypes.canonical>;
    "force-system-version"?: Array<fhirTypes.canonical>;
  };
  export type Output = { return: fhirTypes.ValueSet };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
export namespace ValueSetValidateCode {
  export type Input = {
    url?: fhirTypes.uri;
    context?: fhirTypes.uri;
    valueSet?: fhirTypes.ValueSet;
    valueSetVersion?: fhirTypes.string;
    code?: fhirTypes.code;
    system?: fhirTypes.uri;
    systemVersion?: fhirTypes.string;
    display?: fhirTypes.string;
    coding?: fhirTypes.Coding;
    codeableConcept?: fhirTypes.CodeableConcept;
    date?: fhirTypes.dateTime;
    abstract?: fhirTypes.boolean;
    displayLanguage?: fhirTypes.code;
  };
  export type Output = {
    result: fhirTypes.boolean;
    message?: fhirTypes.string;
    display?: fhirTypes.string;
  };
  export type Executor<CTX> = Operation<CTX, Input, Output>;
}
