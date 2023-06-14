export type base64Binary = string;
export type canonical = string;
export type code = string;
export type date = string;
export type dateTime = string;
export type decimal = number;
export type id = string;
export type instant = string;
export type integer = number;
export type markdown = string;
export type oid = string;
export type positiveInt = number;
export type time = string;
export type unsignedInt = string;
export type uri = string;
export type url = string;
export type uuid = string;
export type xhtml = string;

export interface Address {
  id?: string;
  extension?: Array<Extension>;
  use?: code;
  type?: code;
  text?: string;
  line?: Array<string>;
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  period?: Period;
}

export interface Age {
  id?: string;
  extension?: Array<Extension>;
  value?: decimal;
  comparator?: code;
  unit?: string;
  system?: uri;
  code?: code;
}

export interface Annotation {
  id?: string;
  extension?: Array<Extension>;
  authorReference?: Reference;
  authorString?: string;
  time?: dateTime;
  text: markdown;
}

export interface Attachment {
  id?: string;
  extension?: Array<Extension>;
  contentType?: code;
  language?: code;
  data?: base64Binary;
  url?: url;
  size?: unsignedInt;
  hash?: base64Binary;
  title?: string;
  creation?: dateTime;
}

export interface CodeableConcept {
  id?: string;
  extension?: Array<Extension>;
  coding?: Array<Coding>;
  text?: string;
}

export interface Coding {
  id?: string;
  extension?: Array<Extension>;
  system?: uri;
  version?: string;
  code?: code;
  display?: string;
  userSelected?: boolean;
}

export interface ContactDetail {
  id?: string;
  extension?: Array<Extension>;
  name?: string;
  telecom?: Array<ContactPoint>;
}

export interface ContactPoint {
  id?: string;
  extension?: Array<Extension>;
  system?: code;
  value?: string;
  use?: code;
  rank?: positiveInt;
  period?: Period;
}

export interface Contributor {
  id?: string;
  extension?: Array<Extension>;
  type: code;
  name: string;
  contact?: Array<ContactDetail>;
}

export interface Count {
  id?: string;
  extension?: Array<Extension>;
  value?: decimal;
  comparator?: code;
  unit?: string;
  system?: uri;
  code?: code;
}

export interface DataRequirementCodeFilter {
  id?: string;
  extension?: Array<Extension>;
  path?: string;
  searchParam?: string;
  valueSet?: canonical;
  code?: Array<Coding>;
}
export interface DataRequirementDateFilter {
  id?: string;
  extension?: Array<Extension>;
  path?: string;
  searchParam?: string;
  valueDateTime?: dateTime;
  valuePeriod?: Period;
  valueDuration?: Duration;
}
export interface DataRequirementSort {
  id?: string;
  extension?: Array<Extension>;
  path: string;
  direction: code;
}
export interface DataRequirement {
  id?: string;
  extension?: Array<Extension>;
  type: code;
  profile?: Array<canonical>;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  mustSupport?: Array<string>;
  codeFilter?: Array<DataRequirementCodeFilter>;
  dateFilter?: Array<DataRequirementDateFilter>;
  limit?: positiveInt;
  sort?: Array<DataRequirementSort>;
}

export interface Distance {
  id?: string;
  extension?: Array<Extension>;
  value?: decimal;
  comparator?: code;
  unit?: string;
  system?: uri;
  code?: code;
}

export interface DosageDoseAndRate {
  id?: string;
  extension?: Array<Extension>;
  type?: CodeableConcept;
  doseRange?: Range;
  doseQuantity?: Quantity;
  rateRatio?: Ratio;
  rateRange?: Range;
  rateQuantity?: Quantity;
}
export interface Dosage {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence?: integer;
  text?: string;
  additionalInstruction?: Array<CodeableConcept>;
  patientInstruction?: string;
  timing?: Timing;
  asNeededBoolean?: boolean;
  asNeededCodeableConcept?: CodeableConcept;
  site?: CodeableConcept;
  route?: CodeableConcept;
  method?: CodeableConcept;
  doseAndRate?: Array<DosageDoseAndRate>;
  maxDosePerPeriod?: Ratio;
  maxDosePerAdministration?: Quantity;
  maxDosePerLifetime?: Quantity;
}

export interface Duration {
  id?: string;
  extension?: Array<Extension>;
  value?: decimal;
  comparator?: code;
  unit?: string;
  system?: uri;
  code?: code;
}

export interface ElementDefinitionSlicingDiscriminator {
  id?: string;
  extension?: Array<Extension>;
  type: code;
  path: string;
}
export interface ElementDefinitionSlicing {
  id?: string;
  extension?: Array<Extension>;
  discriminator?: Array<ElementDefinitionSlicingDiscriminator>;
  description?: string;
  ordered?: boolean;
  rules: code;
}
export interface ElementDefinitionBase {
  id?: string;
  extension?: Array<Extension>;
  path: string;
  min: unsignedInt;
  max: string;
}
export interface ElementDefinitionType {
  id?: string;
  extension?: Array<Extension>;
  code: uri;
  profile?: Array<canonical>;
  targetProfile?: Array<canonical>;
  aggregation?: Array<code>;
  versioning?: code;
}
export interface ElementDefinitionExample {
  id?: string;
  extension?: Array<Extension>;
  label: string;
  valueBase64Binary?: base64Binary;
  valueBoolean?: boolean;
  valueCanonical?: canonical;
  valueCode?: code;
  valueDate?: date;
  valueDateTime?: dateTime;
  valueDecimal?: decimal;
  valueId?: id;
  valueInstant?: instant;
  valueInteger?: integer;
  valueMarkdown?: markdown;
  valueOid?: oid;
  valuePositiveInt?: positiveInt;
  valueString?: string;
  valueTime?: time;
  valueUnsignedInt?: unsignedInt;
  valueUri?: uri;
  valueUrl?: url;
  valueUuid?: uuid;
  valueAddress?: Address;
  valueAge?: Age;
  valueAnnotation?: Annotation;
  valueAttachment?: Attachment;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueContactPoint?: ContactPoint;
  valueCount?: Count;
  valueDistance?: Distance;
  valueDuration?: Duration;
  valueHumanName?: HumanName;
  valueIdentifier?: Identifier;
  valueMoney?: Money;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueReference?: Reference;
  valueSampledData?: SampledData;
  valueSignature?: Signature;
  valueTiming?: Timing;
  valueContactDetail?: ContactDetail;
  valueContributor?: Contributor;
  valueDataRequirement?: DataRequirement;
  valueExpression?: Expression;
  valueParameterDefinition?: ParameterDefinition;
  valueRelatedArtifact?: RelatedArtifact;
  valueTriggerDefinition?: TriggerDefinition;
  valueUsageContext?: UsageContext;
  valueDosage?: Dosage;
  valueMeta?: Meta;
}
export interface ElementDefinitionConstraint {
  id?: string;
  extension?: Array<Extension>;
  key: id;
  requirements?: string;
  severity: code;
  human: string;
  expression?: string;
  xpath?: string;
  source?: canonical;
}
export interface ElementDefinitionBinding {
  id?: string;
  extension?: Array<Extension>;
  strength: code;
  description?: string;
  valueSet?: canonical;
}
export interface ElementDefinitionMapping {
  id?: string;
  extension?: Array<Extension>;
  identity: id;
  language?: code;
  map: string;
  comment?: string;
}
export interface ElementDefinition {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  path: string;
  representation?: Array<code>;
  sliceName?: string;
  sliceIsConstraining?: boolean;
  label?: string;
  code?: Array<Coding>;
  slicing?: ElementDefinitionSlicing;
  short?: string;
  definition?: markdown;
  comment?: markdown;
  requirements?: markdown;
  alias?: Array<string>;
  min?: unsignedInt;
  max?: string;
  base?: ElementDefinitionBase;
  contentReference?: uri;
  type?: Array<ElementDefinitionType>;
  defaultValueBase64Binary?: base64Binary;
  defaultValueBoolean?: boolean;
  defaultValueCanonical?: canonical;
  defaultValueCode?: code;
  defaultValueDate?: date;
  defaultValueDateTime?: dateTime;
  defaultValueDecimal?: decimal;
  defaultValueId?: id;
  defaultValueInstant?: instant;
  defaultValueInteger?: integer;
  defaultValueMarkdown?: markdown;
  defaultValueOid?: oid;
  defaultValuePositiveInt?: positiveInt;
  defaultValueString?: string;
  defaultValueTime?: time;
  defaultValueUnsignedInt?: unsignedInt;
  defaultValueUri?: uri;
  defaultValueUrl?: url;
  defaultValueUuid?: uuid;
  defaultValueAddress?: Address;
  defaultValueAge?: Age;
  defaultValueAnnotation?: Annotation;
  defaultValueAttachment?: Attachment;
  defaultValueCodeableConcept?: CodeableConcept;
  defaultValueCoding?: Coding;
  defaultValueContactPoint?: ContactPoint;
  defaultValueCount?: Count;
  defaultValueDistance?: Distance;
  defaultValueDuration?: Duration;
  defaultValueHumanName?: HumanName;
  defaultValueIdentifier?: Identifier;
  defaultValueMoney?: Money;
  defaultValuePeriod?: Period;
  defaultValueQuantity?: Quantity;
  defaultValueRange?: Range;
  defaultValueRatio?: Ratio;
  defaultValueReference?: Reference;
  defaultValueSampledData?: SampledData;
  defaultValueSignature?: Signature;
  defaultValueTiming?: Timing;
  defaultValueContactDetail?: ContactDetail;
  defaultValueContributor?: Contributor;
  defaultValueDataRequirement?: DataRequirement;
  defaultValueExpression?: Expression;
  defaultValueParameterDefinition?: ParameterDefinition;
  defaultValueRelatedArtifact?: RelatedArtifact;
  defaultValueTriggerDefinition?: TriggerDefinition;
  defaultValueUsageContext?: UsageContext;
  defaultValueDosage?: Dosage;
  defaultValueMeta?: Meta;
  meaningWhenMissing?: markdown;
  orderMeaning?: string;
  fixedBase64Binary?: base64Binary;
  fixedBoolean?: boolean;
  fixedCanonical?: canonical;
  fixedCode?: code;
  fixedDate?: date;
  fixedDateTime?: dateTime;
  fixedDecimal?: decimal;
  fixedId?: id;
  fixedInstant?: instant;
  fixedInteger?: integer;
  fixedMarkdown?: markdown;
  fixedOid?: oid;
  fixedPositiveInt?: positiveInt;
  fixedString?: string;
  fixedTime?: time;
  fixedUnsignedInt?: unsignedInt;
  fixedUri?: uri;
  fixedUrl?: url;
  fixedUuid?: uuid;
  fixedAddress?: Address;
  fixedAge?: Age;
  fixedAnnotation?: Annotation;
  fixedAttachment?: Attachment;
  fixedCodeableConcept?: CodeableConcept;
  fixedCoding?: Coding;
  fixedContactPoint?: ContactPoint;
  fixedCount?: Count;
  fixedDistance?: Distance;
  fixedDuration?: Duration;
  fixedHumanName?: HumanName;
  fixedIdentifier?: Identifier;
  fixedMoney?: Money;
  fixedPeriod?: Period;
  fixedQuantity?: Quantity;
  fixedRange?: Range;
  fixedRatio?: Ratio;
  fixedReference?: Reference;
  fixedSampledData?: SampledData;
  fixedSignature?: Signature;
  fixedTiming?: Timing;
  fixedContactDetail?: ContactDetail;
  fixedContributor?: Contributor;
  fixedDataRequirement?: DataRequirement;
  fixedExpression?: Expression;
  fixedParameterDefinition?: ParameterDefinition;
  fixedRelatedArtifact?: RelatedArtifact;
  fixedTriggerDefinition?: TriggerDefinition;
  fixedUsageContext?: UsageContext;
  fixedDosage?: Dosage;
  fixedMeta?: Meta;
  patternBase64Binary?: base64Binary;
  patternBoolean?: boolean;
  patternCanonical?: canonical;
  patternCode?: code;
  patternDate?: date;
  patternDateTime?: dateTime;
  patternDecimal?: decimal;
  patternId?: id;
  patternInstant?: instant;
  patternInteger?: integer;
  patternMarkdown?: markdown;
  patternOid?: oid;
  patternPositiveInt?: positiveInt;
  patternString?: string;
  patternTime?: time;
  patternUnsignedInt?: unsignedInt;
  patternUri?: uri;
  patternUrl?: url;
  patternUuid?: uuid;
  patternAddress?: Address;
  patternAge?: Age;
  patternAnnotation?: Annotation;
  patternAttachment?: Attachment;
  patternCodeableConcept?: CodeableConcept;
  patternCoding?: Coding;
  patternContactPoint?: ContactPoint;
  patternCount?: Count;
  patternDistance?: Distance;
  patternDuration?: Duration;
  patternHumanName?: HumanName;
  patternIdentifier?: Identifier;
  patternMoney?: Money;
  patternPeriod?: Period;
  patternQuantity?: Quantity;
  patternRange?: Range;
  patternRatio?: Ratio;
  patternReference?: Reference;
  patternSampledData?: SampledData;
  patternSignature?: Signature;
  patternTiming?: Timing;
  patternContactDetail?: ContactDetail;
  patternContributor?: Contributor;
  patternDataRequirement?: DataRequirement;
  patternExpression?: Expression;
  patternParameterDefinition?: ParameterDefinition;
  patternRelatedArtifact?: RelatedArtifact;
  patternTriggerDefinition?: TriggerDefinition;
  patternUsageContext?: UsageContext;
  patternDosage?: Dosage;
  patternMeta?: Meta;
  example?: Array<ElementDefinitionExample>;
  minValueDate?: date;
  minValueDateTime?: dateTime;
  minValueInstant?: instant;
  minValueTime?: time;
  minValueDecimal?: decimal;
  minValueInteger?: integer;
  minValuePositiveInt?: positiveInt;
  minValueUnsignedInt?: unsignedInt;
  minValueQuantity?: Quantity;
  maxValueDate?: date;
  maxValueDateTime?: dateTime;
  maxValueInstant?: instant;
  maxValueTime?: time;
  maxValueDecimal?: decimal;
  maxValueInteger?: integer;
  maxValuePositiveInt?: positiveInt;
  maxValueUnsignedInt?: unsignedInt;
  maxValueQuantity?: Quantity;
  maxLength?: integer;
  condition?: Array<id>;
  constraint?: Array<ElementDefinitionConstraint>;
  mustSupport?: boolean;
  isModifier?: boolean;
  isModifierReason?: string;
  isSummary?: boolean;
  binding?: ElementDefinitionBinding;
  mapping?: Array<ElementDefinitionMapping>;
}

export interface Expression {
  id?: string;
  extension?: Array<Extension>;
  description?: string;
  name?: id;
  language: code;
  expression?: string;
  reference?: uri;
}

export interface Extension {
  id?: string;
  extension?: Array<Extension>;
  url: string;
  valueBase64Binary?: base64Binary;
  valueBoolean?: boolean;
  valueCanonical?: canonical;
  valueCode?: code;
  valueDate?: date;
  valueDateTime?: dateTime;
  valueDecimal?: decimal;
  valueId?: id;
  valueInstant?: instant;
  valueInteger?: integer;
  valueMarkdown?: markdown;
  valueOid?: oid;
  valuePositiveInt?: positiveInt;
  valueString?: string;
  valueTime?: time;
  valueUnsignedInt?: unsignedInt;
  valueUri?: uri;
  valueUrl?: url;
  valueUuid?: uuid;
  valueAddress?: Address;
  valueAge?: Age;
  valueAnnotation?: Annotation;
  valueAttachment?: Attachment;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueContactPoint?: ContactPoint;
  valueCount?: Count;
  valueDistance?: Distance;
  valueDuration?: Duration;
  valueHumanName?: HumanName;
  valueIdentifier?: Identifier;
  valueMoney?: Money;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueReference?: Reference;
  valueSampledData?: SampledData;
  valueSignature?: Signature;
  valueTiming?: Timing;
  valueContactDetail?: ContactDetail;
  valueContributor?: Contributor;
  valueDataRequirement?: DataRequirement;
  valueExpression?: Expression;
  valueParameterDefinition?: ParameterDefinition;
  valueRelatedArtifact?: RelatedArtifact;
  valueTriggerDefinition?: TriggerDefinition;
  valueUsageContext?: UsageContext;
  valueDosage?: Dosage;
  valueMeta?: Meta;
}

export interface HumanName {
  id?: string;
  extension?: Array<Extension>;
  use?: code;
  text?: string;
  family?: string;
  given?: Array<string>;
  prefix?: Array<string>;
  suffix?: Array<string>;
  period?: Period;
}

export interface Identifier {
  id?: string;
  extension?: Array<Extension>;
  use?: code;
  type?: CodeableConcept;
  system?: uri;
  value?: string;
  period?: Period;
  assigner?: Reference;
}

export interface MarketingStatus {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  country: CodeableConcept;
  jurisdiction?: CodeableConcept;
  status: CodeableConcept;
  dateRange: Period;
  restoreDate?: dateTime;
}

export interface Meta {
  id?: string;
  extension?: Array<Extension>;
  versionId?: id;
  lastUpdated?: instant;
  source?: uri;
  profile?: Array<canonical>;
  security?: Array<Coding>;
  tag?: Array<Coding>;
}

export interface Money {
  id?: string;
  extension?: Array<Extension>;
  value?: decimal;
  currency?: code;
}

export interface Narrative {
  id?: string;
  extension?: Array<Extension>;
  status: code;
  div: xhtml;
}

export interface ParameterDefinition {
  id?: string;
  extension?: Array<Extension>;
  name?: code;
  use: code;
  min?: integer;
  max?: string;
  documentation?: string;
  type: code;
  profile?: canonical;
}

export interface Period {
  id?: string;
  extension?: Array<Extension>;
  start?: dateTime;
  end?: dateTime;
}

export interface Population {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  ageRange?: Range;
  ageCodeableConcept?: CodeableConcept;
  gender?: CodeableConcept;
  race?: CodeableConcept;
  physiologicalCondition?: CodeableConcept;
}

export interface ProdCharacteristic {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  height?: Quantity;
  width?: Quantity;
  depth?: Quantity;
  weight?: Quantity;
  nominalVolume?: Quantity;
  externalDiameter?: Quantity;
  shape?: string;
  color?: Array<string>;
  imprint?: Array<string>;
  image?: Array<Attachment>;
  scoring?: CodeableConcept;
}

export interface ProductShelfLife {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  type: CodeableConcept;
  period: Quantity;
  specialPrecautionsForStorage?: Array<CodeableConcept>;
}

export interface Quantity {
  id?: string;
  extension?: Array<Extension>;
  value?: decimal;
  comparator?: code;
  unit?: string;
  system?: uri;
  code?: code;
}

export interface Range {
  id?: string;
  extension?: Array<Extension>;
  low?: Quantity;
  high?: Quantity;
}

export interface Ratio {
  id?: string;
  extension?: Array<Extension>;
  numerator?: Quantity;
  denominator?: Quantity;
}

export interface Reference {
  id?: string;
  extension?: Array<Extension>;
  reference?: string;
  type?: uri;
  identifier?: Identifier;
  display?: string;
}

export interface RelatedArtifact {
  id?: string;
  extension?: Array<Extension>;
  type: code;
  label?: string;
  display?: string;
  citation?: markdown;
  url?: url;
  document?: Attachment;
  resource?: canonical;
}

export interface SampledData {
  id?: string;
  extension?: Array<Extension>;
  origin: Quantity;
  period: decimal;
  factor?: decimal;
  lowerLimit?: decimal;
  upperLimit?: decimal;
  dimensions: positiveInt;
  data?: string;
}

export interface Signature {
  id?: string;
  extension?: Array<Extension>;
  type: Array<Coding>;
  when: instant;
  who: Reference;
  onBehalfOf?: Reference;
  targetFormat?: code;
  sigFormat?: code;
  data?: base64Binary;
}

export interface SubstanceAmountReferenceRange {
  id?: string;
  extension?: Array<Extension>;
  lowLimit?: Quantity;
  highLimit?: Quantity;
}
export interface SubstanceAmount {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  amountQuantity?: Quantity;
  amountRange?: Range;
  amountString?: string;
  amountType?: CodeableConcept;
  amountText?: string;
  referenceRange?: SubstanceAmountReferenceRange;
}

export interface TimingRepeat {
  id?: string;
  extension?: Array<Extension>;
  boundsDuration?: Duration;
  boundsRange?: Range;
  boundsPeriod?: Period;
  count?: positiveInt;
  countMax?: positiveInt;
  duration?: decimal;
  durationMax?: decimal;
  durationUnit?: code;
  frequency?: positiveInt;
  frequencyMax?: positiveInt;
  period?: decimal;
  periodMax?: decimal;
  periodUnit?: code;
  dayOfWeek?: Array<code>;
  timeOfDay?: Array<time>;
  when?: Array<code>;
  offset?: unsignedInt;
}
export interface Timing {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  event?: Array<dateTime>;
  repeat?: TimingRepeat;
  code?: CodeableConcept;
}

export interface TriggerDefinition {
  id?: string;
  extension?: Array<Extension>;
  type: code;
  name?: string;
  timingTiming?: Timing;
  timingReference?: Reference;
  timingDate?: date;
  timingDateTime?: dateTime;
  data?: Array<DataRequirement>;
  condition?: Expression;
}

export interface UsageContext {
  id?: string;
  extension?: Array<Extension>;
  code: Coding;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueReference?: Reference;
}

export interface Quantity {
  id?: string;
  extension?: Array<Extension>;
  value?: decimal;
  comparator?: code;
  unit?: string;
  system?: uri;
  code?: code;
}

export interface Quantity {
  id?: string;
  extension?: Array<Extension>;
  value?: decimal;
  comparator?: code;
  unit?: string;
  system?: uri;
  code?: code;
}
export type Resource = Account
  | ActivityDefinition
  | AdverseEvent
  | AllergyIntolerance
  | Appointment
  | AppointmentResponse
  | AuditEvent
  | Basic
  | Binary
  | BiologicallyDerivedProduct
  | BodyStructure
  | Bundle
  | CapabilityStatement
  | CarePlan
  | CareTeam
  | CatalogEntry
  | ChargeItem
  | ChargeItemDefinition
  | Claim
  | ClaimResponse
  | ClinicalImpression
  | CodeSystem
  | Communication
  | CommunicationRequest
  | CompartmentDefinition
  | Composition
  | ConceptMap
  | Condition
  | Consent
  | Contract
  | Coverage
  | CoverageEligibilityRequest
  | CoverageEligibilityResponse
  | DetectedIssue
  | Device
  | DeviceDefinition
  | DeviceMetric
  | DeviceRequest
  | DeviceUseStatement
  | DiagnosticReport
  | DocumentManifest
  | DocumentReference
  | EffectEvidenceSynthesis
  | Encounter
  | Endpoint
  | EnrollmentRequest
  | EnrollmentResponse
  | EpisodeOfCare
  | EventDefinition
  | Evidence
  | EvidenceVariable
  | ExampleScenario
  | ExplanationOfBenefit
  | FamilyMemberHistory
  | Flag
  | Goal
  | GraphDefinition
  | Group
  | GuidanceResponse
  | HealthcareService
  | ImagingStudy
  | Immunization
  | ImmunizationEvaluation
  | ImmunizationRecommendation
  | ImplementationGuide
  | InsurancePlan
  | Invoice
  | Library
  | Linkage
  | List
  | Location
  | Measure
  | MeasureReport
  | Media
  | Medication
  | MedicationAdministration
  | MedicationDispense
  | MedicationKnowledge
  | MedicationRequest
  | MedicationStatement
  | MedicinalProduct
  | MedicinalProductAuthorization
  | MedicinalProductContraindication
  | MedicinalProductIndication
  | MedicinalProductIngredient
  | MedicinalProductInteraction
  | MedicinalProductManufactured
  | MedicinalProductPackaged
  | MedicinalProductPharmaceutical
  | MedicinalProductUndesirableEffect
  | MessageDefinition
  | MessageHeader
  | MolecularSequence
  | NamingSystem
  | NutritionOrder
  | Observation
  | ObservationDefinition
  | OperationDefinition
  | OperationOutcome
  | Organization
  | OrganizationAffiliation
  | Parameters
  | Patient
  | PaymentNotice
  | PaymentReconciliation
  | Person
  | PlanDefinition
  | Practitioner
  | PractitionerRole
  | Procedure
  | Provenance
  | Questionnaire
  | QuestionnaireResponse
  | RelatedPerson
  | RequestGroup
  | ResearchDefinition
  | ResearchElementDefinition
  | ResearchStudy
  | ResearchSubject
  | RiskAssessment
  | RiskEvidenceSynthesis
  | Schedule
  | SearchParameter
  | ServiceRequest
  | Slot
  | Specimen
  | SpecimenDefinition
  | StructureDefinition
  | StructureMap
  | Subscription
  | Substance
  | SubstanceNucleicAcid
  | SubstancePolymer
  | SubstanceProtein
  | SubstanceReferenceInformation
  | SubstanceSourceMaterial
  | SubstanceSpecification
  | SupplyDelivery
  | SupplyRequest
  | Task
  | TerminologyCapabilities
  | TestReport
  | TestScript
  | ValueSet
  | VerificationResult
  | VisionPrescription;
export type DomainResource = Resource;

export interface AccountCoverage {
  resourceType: "Account"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  coverage: Reference;
  priority?: positiveInt;
}
export interface AccountGuarantor {
  resourceType: "Account"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  party: Reference;
  onHold?: boolean;
  period?: Period;
}
export interface Account {
  resourceType: "Account"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  type?: CodeableConcept;
  name?: string;
  subject?: Array<Reference>;
  servicePeriod?: Period;
  coverage?: Array<AccountCoverage>;
  owner?: Reference;
  description?: string;
  guarantor?: Array<AccountGuarantor>;
  partOf?: Reference;
}

export interface ActivityDefinitionParticipant {
  resourceType: "ActivityDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  role?: CodeableConcept;
}
export interface ActivityDefinitionDynamicValue {
  resourceType: "ActivityDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  path: string;
  expression: Expression;
}
export interface ActivityDefinition {
  resourceType: "ActivityDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  status: code;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  usage?: string;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  topic?: Array<CodeableConcept>;
  author?: Array<ContactDetail>;
  editor?: Array<ContactDetail>;
  reviewer?: Array<ContactDetail>;
  endorser?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  library?: Array<canonical>;
  kind?: code;
  profile?: canonical;
  code?: CodeableConcept;
  intent?: code;
  priority?: code;
  doNotPerform?: boolean;
  timingTiming?: Timing;
  timingDateTime?: dateTime;
  timingAge?: Age;
  timingPeriod?: Period;
  timingRange?: Range;
  timingDuration?: Duration;
  location?: Reference;
  participant?: Array<ActivityDefinitionParticipant>;
  productReference?: Reference;
  productCodeableConcept?: CodeableConcept;
  quantity?: Quantity;
  dosage?: Array<Dosage>;
  bodySite?: Array<CodeableConcept>;
  specimenRequirement?: Array<Reference>;
  observationRequirement?: Array<Reference>;
  observationResultRequirement?: Array<Reference>;
  transform?: canonical;
  dynamicValue?: Array<ActivityDefinitionDynamicValue>;
}

export interface AdverseEventSuspectEntityCausality {
  resourceType: "AdverseEvent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  assessment?: CodeableConcept;
  productRelatedness?: string;
  author?: Reference;
  method?: CodeableConcept;
}
export interface AdverseEventSuspectEntity {
  resourceType: "AdverseEvent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  instance: Reference;
  causality?: Array<AdverseEventSuspectEntityCausality>;
}
export interface AdverseEvent {
  resourceType: "AdverseEvent"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  actuality: code;
  category?: Array<CodeableConcept>;
  event?: CodeableConcept;
  subject: Reference;
  encounter?: Reference;
  date?: dateTime;
  detected?: dateTime;
  recordedDate?: dateTime;
  resultingCondition?: Array<Reference>;
  location?: Reference;
  seriousness?: CodeableConcept;
  severity?: CodeableConcept;
  outcome?: CodeableConcept;
  recorder?: Reference;
  contributor?: Array<Reference>;
  suspectEntity?: Array<AdverseEventSuspectEntity>;
  subjectMedicalHistory?: Array<Reference>;
  referenceDocument?: Array<Reference>;
  study?: Array<Reference>;
}

export interface AllergyIntoleranceReaction {
  resourceType: "AllergyIntolerance"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  substance?: CodeableConcept;
  manifestation: Array<CodeableConcept>;
  description?: string;
  onset?: dateTime;
  severity?: code;
  exposureRoute?: CodeableConcept;
  note?: Array<Annotation>;
}
export interface AllergyIntolerance {
  resourceType: "AllergyIntolerance"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  type?: code;
  category?: Array<code>;
  criticality?: code;
  code?: CodeableConcept;
  patient: Reference;
  encounter?: Reference;
  onsetDateTime?: dateTime;
  onsetAge?: Age;
  onsetPeriod?: Period;
  onsetRange?: Range;
  onsetString?: string;
  recordedDate?: dateTime;
  recorder?: Reference;
  asserter?: Reference;
  lastOccurrence?: dateTime;
  note?: Array<Annotation>;
  reaction?: Array<AllergyIntoleranceReaction>;
}

export interface AppointmentParticipant {
  resourceType: "Appointment"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: Array<CodeableConcept>;
  actor?: Reference;
  required?: code;
  status: code;
  period?: Period;
}
export interface Appointment {
  resourceType: "Appointment"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  cancelationReason?: CodeableConcept;
  serviceCategory?: Array<CodeableConcept>;
  serviceType?: Array<CodeableConcept>;
  specialty?: Array<CodeableConcept>;
  appointmentType?: CodeableConcept;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  priority?: unsignedInt;
  description?: string;
  supportingInformation?: Array<Reference>;
  start?: instant;
  end?: instant;
  minutesDuration?: positiveInt;
  slot?: Array<Reference>;
  created?: dateTime;
  comment?: string;
  patientInstruction?: string;
  basedOn?: Array<Reference>;
  participant: Array<AppointmentParticipant>;
  requestedPeriod?: Array<Period>;
}

export interface AppointmentResponse {
  resourceType: "AppointmentResponse"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  appointment: Reference;
  start?: instant;
  end?: instant;
  participantType?: Array<CodeableConcept>;
  actor?: Reference;
  participantStatus: code;
  comment?: string;
}

export interface AuditEventAgentNetwork {
  resourceType: "AuditEvent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  address?: string;
  type?: code;
}
export interface AuditEventAgent {
  resourceType: "AuditEvent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  role?: Array<CodeableConcept>;
  who?: Reference;
  altId?: string;
  name?: string;
  requestor: boolean;
  location?: Reference;
  policy?: Array<uri>;
  media?: Coding;
  network?: AuditEventAgentNetwork;
  purposeOfUse?: Array<CodeableConcept>;
}
export interface AuditEventSource {
  resourceType: "AuditEvent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  site?: string;
  observer: Reference;
  type?: Array<Coding>;
}
export interface AuditEventEntityDetail {
  resourceType: "AuditEvent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: string;
  valueString?: string;
  valueBase64Binary?: base64Binary;
}
export interface AuditEventEntity {
  resourceType: "AuditEvent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  what?: Reference;
  type?: Coding;
  role?: Coding;
  lifecycle?: Coding;
  securityLabel?: Array<Coding>;
  name?: string;
  description?: string;
  query?: base64Binary;
  detail?: Array<AuditEventEntityDetail>;
}
export interface AuditEvent {
  resourceType: "AuditEvent"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: Coding;
  subtype?: Array<Coding>;
  action?: code;
  period?: Period;
  recorded: instant;
  outcome?: code;
  outcomeDesc?: string;
  purposeOfEvent?: Array<CodeableConcept>;
  agent: Array<AuditEventAgent>;
  source: AuditEventSource;
  entity?: Array<AuditEventEntity>;
}

export interface Basic {
  resourceType: "Basic"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  code: CodeableConcept;
  subject?: Reference;
  created?: date;
  author?: Reference;
}

export interface Binary {
  resourceType: "Binary"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  contentType: code;
  securityContext?: Reference;
  data?: base64Binary;
}

export interface BiologicallyDerivedProductCollection {
  resourceType: "BiologicallyDerivedProduct"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  collector?: Reference;
  source?: Reference;
  collectedDateTime?: dateTime;
  collectedPeriod?: Period;
}
export interface BiologicallyDerivedProductProcessing {
  resourceType: "BiologicallyDerivedProduct"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  procedure?: CodeableConcept;
  additive?: Reference;
  timeDateTime?: dateTime;
  timePeriod?: Period;
}
export interface BiologicallyDerivedProductManipulation {
  resourceType: "BiologicallyDerivedProduct"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  timeDateTime?: dateTime;
  timePeriod?: Period;
}
export interface BiologicallyDerivedProductStorage {
  resourceType: "BiologicallyDerivedProduct"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  temperature?: decimal;
  scale?: code;
  duration?: Period;
}
export interface BiologicallyDerivedProduct {
  resourceType: "BiologicallyDerivedProduct"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  productCategory?: code;
  productCode?: CodeableConcept;
  status?: code;
  request?: Array<Reference>;
  quantity?: integer;
  parent?: Array<Reference>;
  collection?: BiologicallyDerivedProductCollection;
  processing?: Array<BiologicallyDerivedProductProcessing>;
  manipulation?: BiologicallyDerivedProductManipulation;
  storage?: Array<BiologicallyDerivedProductStorage>;
}

export interface BodyStructure {
  resourceType: "BodyStructure"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  active?: boolean;
  morphology?: CodeableConcept;
  location?: CodeableConcept;
  locationQualifier?: Array<CodeableConcept>;
  description?: string;
  image?: Array<Attachment>;
  patient: Reference;
}

export interface BundleLink {
  resourceType: "Bundle"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  relation: string;
  url: uri;
}
export interface BundleEntrySearch {
  resourceType: "Bundle"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode?: code;
  score?: decimal;
}
export interface BundleEntryRequest {
  resourceType: "Bundle"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  method: code;
  url: uri;
  ifNoneMatch?: string;
  ifModifiedSince?: instant;
  ifMatch?: string;
  ifNoneExist?: string;
}
export interface BundleEntryResponse {
  resourceType: "Bundle"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  status: string;
  location?: uri;
  etag?: string;
  lastModified?: instant;
  outcome?: Resource;
}
export interface BundleEntry {
  resourceType: "Bundle"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  link?: BundleLink;
  fullUrl?: uri;
  resource?: Resource;
  search?: BundleEntrySearch;
  request?: BundleEntryRequest;
  response?: BundleEntryResponse;
}
export interface Bundle {
  resourceType: "Bundle"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  identifier?: Identifier;
  type: code;
  timestamp?: instant;
  total?: unsignedInt;
  link?: Array<BundleLink>;
  entry?: Array<BundleEntry>;
  signature?: Signature;
}

export interface CapabilityStatementSoftware {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  version?: string;
  releaseDate?: dateTime;
}
export interface CapabilityStatementImplementation {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description: string;
  url?: url;
  custodian?: Reference;
}
export interface CapabilityStatementRestSecurity {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  cors?: boolean;
  service?: Array<CodeableConcept>;
  description?: markdown;
}
export interface CapabilityStatementRestResourceInteraction {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  documentation?: markdown;
}
export interface CapabilityStatementRestResourceSearchParam {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  definition?: canonical;
  type: code;
  documentation?: markdown;
}
export interface CapabilityStatementRestResourceOperation {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  definition: canonical;
  documentation?: markdown;
}
export interface CapabilityStatementRestResource {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  profile?: canonical;
  supportedProfile?: Array<canonical>;
  documentation?: markdown;
  interaction?: Array<CapabilityStatementRestResourceInteraction>;
  versioning?: code;
  readHistory?: boolean;
  updateCreate?: boolean;
  conditionalCreate?: boolean;
  conditionalRead?: code;
  conditionalUpdate?: boolean;
  conditionalDelete?: code;
  referencePolicy?: Array<code>;
  searchInclude?: Array<string>;
  searchRevInclude?: Array<string>;
  searchParam?: Array<CapabilityStatementRestResourceSearchParam>;
  operation?: Array<CapabilityStatementRestResourceOperation>;
}
export interface CapabilityStatementRestInteraction {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  documentation?: markdown;
}
export interface CapabilityStatementRest {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode: code;
  documentation?: markdown;
  security?: CapabilityStatementRestSecurity;
  resource?: Array<CapabilityStatementRestResource>;
  interaction?: Array<CapabilityStatementRestInteraction>;
  searchParam?: CapabilityStatementRestResourceSearchParam;
  operation?: CapabilityStatementRestResourceOperation;
  compartment?: Array<canonical>;
}
export interface CapabilityStatementMessagingEndpoint {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  protocol: Coding;
  address: url;
}
export interface CapabilityStatementMessagingSupportedMessage {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode: code;
  definition: canonical;
}
export interface CapabilityStatementMessaging {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  endpoint?: Array<CapabilityStatementMessagingEndpoint>;
  reliableCache?: unsignedInt;
  documentation?: markdown;
  supportedMessage?: Array<CapabilityStatementMessagingSupportedMessage>;
}
export interface CapabilityStatementDocument {
  resourceType: "CapabilityStatement"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode: code;
  documentation?: markdown;
  profile: canonical;
}
export interface CapabilityStatement {
  resourceType: "CapabilityStatement"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  version?: string;
  name?: string;
  title?: string;
  status: code;
  experimental?: boolean;
  date: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  copyright?: markdown;
  kind: code;
  instantiates?: Array<canonical>;
  imports?: Array<canonical>;
  software?: CapabilityStatementSoftware;
  implementation?: CapabilityStatementImplementation;
  fhirVersion: code;
  format: Array<code>;
  patchFormat?: Array<code>;
  implementationGuide?: Array<canonical>;
  rest?: Array<CapabilityStatementRest>;
  messaging?: Array<CapabilityStatementMessaging>;
  document?: Array<CapabilityStatementDocument>;
}

export interface CarePlanActivityDetail {
  resourceType: "CarePlan"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  kind?: code;
  instantiatesCanonical?: Array<canonical>;
  instantiatesUri?: Array<uri>;
  code?: CodeableConcept;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  goal?: Array<Reference>;
  status: code;
  statusReason?: CodeableConcept;
  doNotPerform?: boolean;
  scheduledTiming?: Timing;
  scheduledPeriod?: Period;
  scheduledString?: string;
  location?: Reference;
  performer?: Array<Reference>;
  productCodeableConcept?: CodeableConcept;
  productReference?: Reference;
  dailyAmount?: Quantity;
  quantity?: Quantity;
  description?: string;
}
export interface CarePlanActivity {
  resourceType: "CarePlan"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  outcomeCodeableConcept?: Array<CodeableConcept>;
  outcomeReference?: Array<Reference>;
  progress?: Array<Annotation>;
  reference?: Reference;
  detail?: CarePlanActivityDetail;
}
export interface CarePlan {
  resourceType: "CarePlan"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  instantiatesCanonical?: Array<canonical>;
  instantiatesUri?: Array<uri>;
  basedOn?: Array<Reference>;
  replaces?: Array<Reference>;
  partOf?: Array<Reference>;
  status: code;
  intent: code;
  category?: Array<CodeableConcept>;
  title?: string;
  description?: string;
  subject: Reference;
  encounter?: Reference;
  period?: Period;
  created?: dateTime;
  author?: Reference;
  contributor?: Array<Reference>;
  careTeam?: Array<Reference>;
  addresses?: Array<Reference>;
  supportingInfo?: Array<Reference>;
  goal?: Array<Reference>;
  activity?: Array<CarePlanActivity>;
  note?: Array<Annotation>;
}

export interface CareTeamParticipant {
  resourceType: "CareTeam"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  role?: Array<CodeableConcept>;
  member?: Reference;
  onBehalfOf?: Reference;
  period?: Period;
}
export interface CareTeam {
  resourceType: "CareTeam"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status?: code;
  category?: Array<CodeableConcept>;
  name?: string;
  subject?: Reference;
  encounter?: Reference;
  period?: Period;
  participant?: Array<CareTeamParticipant>;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  managingOrganization?: Array<Reference>;
  telecom?: Array<ContactPoint>;
  note?: Array<Annotation>;
}

export interface CatalogEntryRelatedEntry {
  resourceType: "CatalogEntry"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  relationtype: code;
  item: Reference;
}
export interface CatalogEntry {
  resourceType: "CatalogEntry"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  type?: CodeableConcept;
  orderable: boolean;
  referencedItem: Reference;
  additionalIdentifier?: Array<Identifier>;
  classification?: Array<CodeableConcept>;
  status?: code;
  validityPeriod?: Period;
  validTo?: dateTime;
  lastUpdated?: dateTime;
  additionalCharacteristic?: Array<CodeableConcept>;
  additionalClassification?: Array<CodeableConcept>;
  relatedEntry?: Array<CatalogEntryRelatedEntry>;
}

export interface ChargeItemPerformer {
  resourceType: "ChargeItem"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
}
export interface ChargeItem {
  resourceType: "ChargeItem"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  definitionUri?: Array<uri>;
  definitionCanonical?: Array<canonical>;
  status: code;
  partOf?: Array<Reference>;
  code: CodeableConcept;
  subject: Reference;
  context?: Reference;
  occurrenceDateTime?: dateTime;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  performer?: Array<ChargeItemPerformer>;
  performingOrganization?: Reference;
  requestingOrganization?: Reference;
  costCenter?: Reference;
  quantity?: Quantity;
  bodysite?: Array<CodeableConcept>;
  factorOverride?: decimal;
  priceOverride?: Money;
  overrideReason?: string;
  enterer?: Reference;
  enteredDate?: dateTime;
  reason?: Array<CodeableConcept>;
  service?: Array<Reference>;
  productReference?: Reference;
  productCodeableConcept?: CodeableConcept;
  account?: Array<Reference>;
  note?: Array<Annotation>;
  supportingInformation?: Array<Reference>;
}

export interface ChargeItemDefinitionApplicability {
  resourceType: "ChargeItemDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  language?: string;
  expression?: string;
}
export interface ChargeItemDefinitionPropertyGroupPriceComponent {
  resourceType: "ChargeItemDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  code?: CodeableConcept;
  factor?: decimal;
  amount?: Money;
}
export interface ChargeItemDefinitionPropertyGroup {
  resourceType: "ChargeItemDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  applicability?: ChargeItemDefinitionApplicability;
  priceComponent?: Array<ChargeItemDefinitionPropertyGroupPriceComponent>;
}
export interface ChargeItemDefinition {
  resourceType: "ChargeItemDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url: uri;
  identifier?: Array<Identifier>;
  version?: string;
  title?: string;
  derivedFromUri?: Array<uri>;
  partOf?: Array<canonical>;
  replaces?: Array<canonical>;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  code?: CodeableConcept;
  instance?: Array<Reference>;
  applicability?: Array<ChargeItemDefinitionApplicability>;
  propertyGroup?: Array<ChargeItemDefinitionPropertyGroup>;
}

export interface ClaimRelated {
  resourceType: "Claim"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  claim?: Reference;
  relationship?: CodeableConcept;
  reference?: Identifier;
}
export interface ClaimPayee {
  resourceType: "Claim"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  party?: Reference;
}
export interface ClaimCareTeam {
  resourceType: "Claim"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  provider: Reference;
  responsible?: boolean;
  role?: CodeableConcept;
  qualification?: CodeableConcept;
}
export interface ClaimSupportingInfo {
  resourceType: "Claim"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  category: CodeableConcept;
  code?: CodeableConcept;
  timingDate?: date;
  timingPeriod?: Period;
  valueBoolean?: boolean;
  valueString?: string;
  valueQuantity?: Quantity;
  valueAttachment?: Attachment;
  valueReference?: Reference;
  reason?: CodeableConcept;
}
export interface ClaimDiagnosis {
  resourceType: "Claim"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
  type?: Array<CodeableConcept>;
  onAdmission?: CodeableConcept;
  packageCode?: CodeableConcept;
}
export interface ClaimProcedure {
  resourceType: "Claim"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  type?: Array<CodeableConcept>;
  date?: dateTime;
  procedureCodeableConcept?: CodeableConcept;
  procedureReference?: Reference;
  udi?: Array<Reference>;
}
export interface ClaimInsurance {
  resourceType: "Claim"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  focal: boolean;
  identifier?: Identifier;
  coverage: Reference;
  businessArrangement?: string;
  preAuthRef?: Array<string>;
  claimResponse?: Reference;
}
export interface ClaimAccident {
  resourceType: "Claim"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  date: date;
  type?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
}
export interface ClaimItemDetailSubDetail {
  resourceType: "Claim"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  programCode?: Array<CodeableConcept>;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  udi?: Array<Reference>;
}
export interface ClaimItemDetail {
  resourceType: "Claim"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  programCode?: Array<CodeableConcept>;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  udi?: Array<Reference>;
  subDetail?: Array<ClaimItemDetailSubDetail>;
}
export interface ClaimItem {
  resourceType: "Claim"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  careTeamSequence?: Array<positiveInt>;
  diagnosisSequence?: Array<positiveInt>;
  procedureSequence?: Array<positiveInt>;
  informationSequence?: Array<positiveInt>;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  programCode?: Array<CodeableConcept>;
  servicedDate?: date;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  udi?: Array<Reference>;
  bodySite?: CodeableConcept;
  subSite?: Array<CodeableConcept>;
  encounter?: Array<Reference>;
  detail?: Array<ClaimItemDetail>;
}
export interface Claim {
  resourceType: "Claim"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  type: CodeableConcept;
  subType?: CodeableConcept;
  use: code;
  patient: Reference;
  billablePeriod?: Period;
  created: dateTime;
  enterer?: Reference;
  insurer?: Reference;
  provider: Reference;
  priority: CodeableConcept;
  fundsReserve?: CodeableConcept;
  related?: Array<ClaimRelated>;
  prescription?: Reference;
  originalPrescription?: Reference;
  payee?: ClaimPayee;
  referral?: Reference;
  facility?: Reference;
  careTeam?: Array<ClaimCareTeam>;
  supportingInfo?: Array<ClaimSupportingInfo>;
  diagnosis?: Array<ClaimDiagnosis>;
  procedure?: Array<ClaimProcedure>;
  insurance: Array<ClaimInsurance>;
  accident?: ClaimAccident;
  item?: Array<ClaimItem>;
  total?: Money;
}

export interface ClaimResponseItemAdjudication {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category: CodeableConcept;
  reason?: CodeableConcept;
  amount?: Money;
  value?: decimal;
}
export interface ClaimResponseItemDetailSubDetail {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  subDetailSequence: positiveInt;
  noteNumber?: Array<positiveInt>;
  adjudication?: ClaimResponseItemAdjudication;
}
export interface ClaimResponseItemDetail {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  detailSequence: positiveInt;
  noteNumber?: Array<positiveInt>;
  adjudication: ClaimResponseItemAdjudication;
  subDetail?: Array<ClaimResponseItemDetailSubDetail>;
}
export interface ClaimResponseItem {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemSequence: positiveInt;
  noteNumber?: Array<positiveInt>;
  adjudication: Array<ClaimResponseItemAdjudication>;
  detail?: Array<ClaimResponseItemDetail>;
}
export interface ClaimResponseAddItemDetailSubDetail {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  noteNumber?: Array<positiveInt>;
  adjudication: ClaimResponseItemAdjudication;
}
export interface ClaimResponseAddItemDetail {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  noteNumber?: Array<positiveInt>;
  adjudication: ClaimResponseItemAdjudication;
  subDetail?: Array<ClaimResponseAddItemDetailSubDetail>;
}
export interface ClaimResponseAddItem {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemSequence?: Array<positiveInt>;
  detailSequence?: Array<positiveInt>;
  subdetailSequence?: Array<positiveInt>;
  provider?: Array<Reference>;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  programCode?: Array<CodeableConcept>;
  servicedDate?: date;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  bodySite?: CodeableConcept;
  subSite?: Array<CodeableConcept>;
  noteNumber?: Array<positiveInt>;
  adjudication: ClaimResponseItemAdjudication;
  detail?: Array<ClaimResponseAddItemDetail>;
}
export interface ClaimResponseTotal {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category: CodeableConcept;
  amount: Money;
}
export interface ClaimResponsePayment {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  adjustment?: Money;
  adjustmentReason?: CodeableConcept;
  date?: date;
  amount: Money;
  identifier?: Identifier;
}
export interface ClaimResponseProcessNote {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  number?: positiveInt;
  type?: code;
  text: string;
  language?: CodeableConcept;
}
export interface ClaimResponseInsurance {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  focal: boolean;
  coverage: Reference;
  businessArrangement?: string;
  claimResponse?: Reference;
}
export interface ClaimResponseError {
  resourceType: "ClaimResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemSequence?: positiveInt;
  detailSequence?: positiveInt;
  subDetailSequence?: positiveInt;
  code: CodeableConcept;
}
export interface ClaimResponse {
  resourceType: "ClaimResponse"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  type: CodeableConcept;
  subType?: CodeableConcept;
  use: code;
  patient: Reference;
  created: dateTime;
  insurer: Reference;
  requestor?: Reference;
  request?: Reference;
  outcome: code;
  disposition?: string;
  preAuthRef?: string;
  preAuthPeriod?: Period;
  payeeType?: CodeableConcept;
  item?: Array<ClaimResponseItem>;
  addItem?: Array<ClaimResponseAddItem>;
  adjudication?: ClaimResponseItemAdjudication;
  total?: Array<ClaimResponseTotal>;
  payment?: ClaimResponsePayment;
  fundsReserve?: CodeableConcept;
  formCode?: CodeableConcept;
  form?: Attachment;
  processNote?: Array<ClaimResponseProcessNote>;
  communicationRequest?: Array<Reference>;
  insurance?: Array<ClaimResponseInsurance>;
  error?: Array<ClaimResponseError>;
}

export interface ClinicalImpressionInvestigation {
  resourceType: "ClinicalImpression"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  item?: Array<Reference>;
}
export interface ClinicalImpressionFinding {
  resourceType: "ClinicalImpression"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  basis?: string;
}
export interface ClinicalImpression {
  resourceType: "ClinicalImpression"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  statusReason?: CodeableConcept;
  code?: CodeableConcept;
  description?: string;
  subject: Reference;
  encounter?: Reference;
  effectiveDateTime?: dateTime;
  effectivePeriod?: Period;
  date?: dateTime;
  assessor?: Reference;
  previous?: Reference;
  problem?: Array<Reference>;
  investigation?: Array<ClinicalImpressionInvestigation>;
  protocol?: Array<uri>;
  summary?: string;
  finding?: Array<ClinicalImpressionFinding>;
  prognosisCodeableConcept?: Array<CodeableConcept>;
  prognosisReference?: Array<Reference>;
  supportingInfo?: Array<Reference>;
  note?: Array<Annotation>;
}

export interface CodeSystemFilter {
  resourceType: "CodeSystem"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  description?: string;
  operator: Array<code>;
  value: string;
}
export interface CodeSystemProperty {
  resourceType: "CodeSystem"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  uri?: uri;
  description?: string;
  type: code;
}
export interface CodeSystemConceptDesignation {
  resourceType: "CodeSystem"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  language?: code;
  use?: Coding;
  value: string;
}
export interface CodeSystemConceptProperty {
  resourceType: "CodeSystem"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  valueCode?: code;
  valueCoding?: Coding;
  valueString?: string;
  valueInteger?: integer;
  valueBoolean?: boolean;
  valueDateTime?: dateTime;
  valueDecimal?: decimal;
}
export interface CodeSystemConcept {
  resourceType: "CodeSystem"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  display?: string;
  definition?: string;
  designation?: Array<CodeSystemConceptDesignation>;
  property?: Array<CodeSystemConceptProperty>;
  concept?: CodeSystemConcept;
}
export interface CodeSystem {
  resourceType: "CodeSystem"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  copyright?: markdown;
  caseSensitive?: boolean;
  valueSet?: canonical;
  hierarchyMeaning?: code;
  compositional?: boolean;
  versionNeeded?: boolean;
  content: code;
  supplements?: canonical;
  count?: unsignedInt;
  filter?: Array<CodeSystemFilter>;
  property?: Array<CodeSystemProperty>;
  concept?: Array<CodeSystemConcept>;
}

export interface CommunicationPayload {
  resourceType: "Communication"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  contentString?: string;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}
export interface Communication {
  resourceType: "Communication"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  instantiatesCanonical?: Array<canonical>;
  instantiatesUri?: Array<uri>;
  basedOn?: Array<Reference>;
  partOf?: Array<Reference>;
  inResponseTo?: Array<Reference>;
  status: code;
  statusReason?: CodeableConcept;
  category?: Array<CodeableConcept>;
  priority?: code;
  medium?: Array<CodeableConcept>;
  subject?: Reference;
  topic?: CodeableConcept;
  about?: Array<Reference>;
  encounter?: Reference;
  sent?: dateTime;
  received?: dateTime;
  recipient?: Array<Reference>;
  sender?: Reference;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  payload?: Array<CommunicationPayload>;
  note?: Array<Annotation>;
}

export interface CommunicationRequestPayload {
  resourceType: "CommunicationRequest"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  contentString?: string;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}
export interface CommunicationRequest {
  resourceType: "CommunicationRequest"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  basedOn?: Array<Reference>;
  replaces?: Array<Reference>;
  groupIdentifier?: Identifier;
  status: code;
  statusReason?: CodeableConcept;
  category?: Array<CodeableConcept>;
  priority?: code;
  doNotPerform?: boolean;
  medium?: Array<CodeableConcept>;
  subject?: Reference;
  about?: Array<Reference>;
  encounter?: Reference;
  payload?: Array<CommunicationRequestPayload>;
  occurrenceDateTime?: dateTime;
  occurrencePeriod?: Period;
  authoredOn?: dateTime;
  requester?: Reference;
  recipient?: Array<Reference>;
  sender?: Reference;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  note?: Array<Annotation>;
}

export interface CompartmentDefinitionResource {
  resourceType: "CompartmentDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  param?: Array<string>;
  documentation?: string;
}
export interface CompartmentDefinition {
  resourceType: "CompartmentDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url: uri;
  version?: string;
  name: string;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  purpose?: markdown;
  code: code;
  search: boolean;
  resource?: Array<CompartmentDefinitionResource>;
}

export interface CompositionAttester {
  resourceType: "Composition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode: code;
  time?: dateTime;
  party?: Reference;
}
export interface CompositionRelatesTo {
  resourceType: "Composition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  targetIdentifier?: Identifier;
  targetReference?: Reference;
}
export interface CompositionEvent {
  resourceType: "Composition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: Array<CodeableConcept>;
  period?: Period;
  detail?: Array<Reference>;
}
export interface CompositionSection {
  resourceType: "Composition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  title?: string;
  code?: CodeableConcept;
  author?: Array<Reference>;
  focus?: Reference;
  text?: Narrative;
  mode?: code;
  orderedBy?: CodeableConcept;
  entry?: Array<Reference>;
  emptyReason?: CodeableConcept;
  section?: CompositionSection;
}
export interface Composition {
  resourceType: "Composition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  status: code;
  type: CodeableConcept;
  category?: Array<CodeableConcept>;
  subject?: Reference;
  encounter?: Reference;
  date: dateTime;
  author: Array<Reference>;
  title: string;
  confidentiality?: code;
  attester?: Array<CompositionAttester>;
  custodian?: Reference;
  relatesTo?: Array<CompositionRelatesTo>;
  event?: Array<CompositionEvent>;
  section?: Array<CompositionSection>;
}

export interface ConceptMapGroupElementTargetDependsOn {
  resourceType: "ConceptMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  property: uri;
  system?: canonical;
  value: string;
  display?: string;
}
export interface ConceptMapGroupElementTarget {
  resourceType: "ConceptMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: code;
  display?: string;
  equivalence: code;
  comment?: string;
  dependsOn?: Array<ConceptMapGroupElementTargetDependsOn>;
  product?: ConceptMapGroupElementTargetDependsOn;
}
export interface ConceptMapGroupElement {
  resourceType: "ConceptMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: code;
  display?: string;
  target?: Array<ConceptMapGroupElementTarget>;
}
export interface ConceptMapGroupUnmapped {
  resourceType: "ConceptMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode: code;
  code?: code;
  display?: string;
  url?: canonical;
}
export interface ConceptMapGroup {
  resourceType: "ConceptMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  source?: uri;
  sourceVersion?: string;
  target?: uri;
  targetVersion?: string;
  element: Array<ConceptMapGroupElement>;
  unmapped?: ConceptMapGroupUnmapped;
}
export interface ConceptMap {
  resourceType: "ConceptMap"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Identifier;
  version?: string;
  name?: string;
  title?: string;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  copyright?: markdown;
  sourceUri?: uri;
  sourceCanonical?: canonical;
  targetUri?: uri;
  targetCanonical?: canonical;
  group?: Array<ConceptMapGroup>;
}

export interface ConditionStage {
  resourceType: "Condition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  summary?: CodeableConcept;
  assessment?: Array<Reference>;
  type?: CodeableConcept;
}
export interface ConditionEvidence {
  resourceType: "Condition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: Array<CodeableConcept>;
  detail?: Array<Reference>;
}
export interface Condition {
  resourceType: "Condition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  category?: Array<CodeableConcept>;
  severity?: CodeableConcept;
  code?: CodeableConcept;
  bodySite?: Array<CodeableConcept>;
  subject: Reference;
  encounter?: Reference;
  onsetDateTime?: dateTime;
  onsetAge?: Age;
  onsetPeriod?: Period;
  onsetRange?: Range;
  onsetString?: string;
  abatementDateTime?: dateTime;
  abatementAge?: Age;
  abatementPeriod?: Period;
  abatementRange?: Range;
  abatementString?: string;
  recordedDate?: dateTime;
  recorder?: Reference;
  asserter?: Reference;
  stage?: Array<ConditionStage>;
  evidence?: Array<ConditionEvidence>;
  note?: Array<Annotation>;
}

export interface ConsentPolicy {
  resourceType: "Consent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  authority?: uri;
  uri?: uri;
}
export interface ConsentVerification {
  resourceType: "Consent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  verified: boolean;
  verifiedWith?: Reference;
  verificationDate?: dateTime;
}
export interface ConsentProvisionActor {
  resourceType: "Consent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  role: CodeableConcept;
  reference: Reference;
}
export interface ConsentProvisionData {
  resourceType: "Consent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  meaning: code;
  reference: Reference;
}
export interface ConsentProvision {
  resourceType: "Consent"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: code;
  period?: Period;
  actor?: Array<ConsentProvisionActor>;
  action?: Array<CodeableConcept>;
  securityLabel?: Array<Coding>;
  purpose?: Array<Coding>;
  class?: Array<Coding>;
  code?: Array<CodeableConcept>;
  dataPeriod?: Period;
  data?: Array<ConsentProvisionData>;
  provision?: ConsentProvision;
}
export interface Consent {
  resourceType: "Consent"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  scope: CodeableConcept;
  category: Array<CodeableConcept>;
  patient?: Reference;
  dateTime?: dateTime;
  performer?: Array<Reference>;
  organization?: Array<Reference>;
  sourceAttachment?: Attachment;
  sourceReference?: Reference;
  policy?: Array<ConsentPolicy>;
  policyRule?: CodeableConcept;
  verification?: Array<ConsentVerification>;
  provision?: ConsentProvision;
}

export interface ContractContentDefinition {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  subType?: CodeableConcept;
  publisher?: Reference;
  publicationDate?: dateTime;
  publicationStatus: code;
  copyright?: markdown;
}
export interface ContractTermSecurityLabel {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  number?: Array<unsignedInt>;
  classification: Coding;
  category?: Array<Coding>;
  control?: Array<Coding>;
}
export interface ContractTermOfferParty {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  reference: Array<Reference>;
  role: CodeableConcept;
}
export interface ContractTermOfferAnswer {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  valueBoolean?: boolean;
  valueDecimal?: decimal;
  valueInteger?: integer;
  valueDate?: date;
  valueDateTime?: dateTime;
  valueTime?: time;
  valueString?: string;
  valueUri?: uri;
  valueAttachment?: Attachment;
  valueCoding?: Coding;
  valueQuantity?: Quantity;
  valueReference?: Reference;
}
export interface ContractTermOffer {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  party?: Array<ContractTermOfferParty>;
  topic?: Reference;
  type?: CodeableConcept;
  decision?: CodeableConcept;
  decisionMode?: Array<CodeableConcept>;
  answer?: Array<ContractTermOfferAnswer>;
  text?: string;
  linkId?: Array<string>;
  securityLabelNumber?: Array<unsignedInt>;
}
export interface ContractTermAssetContext {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  reference?: Reference;
  code?: Array<CodeableConcept>;
  text?: string;
}
export interface ContractTermAssetValuedItem {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  entityCodeableConcept?: CodeableConcept;
  entityReference?: Reference;
  identifier?: Identifier;
  effectiveTime?: dateTime;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  points?: decimal;
  net?: Money;
  payment?: string;
  paymentDate?: dateTime;
  responsible?: Reference;
  recipient?: Reference;
  linkId?: Array<string>;
  securityLabelNumber?: Array<unsignedInt>;
}
export interface ContractTermAsset {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  scope?: CodeableConcept;
  type?: Array<CodeableConcept>;
  typeReference?: Array<Reference>;
  subtype?: Array<CodeableConcept>;
  relationship?: Coding;
  context?: Array<ContractTermAssetContext>;
  condition?: string;
  periodType?: Array<CodeableConcept>;
  period?: Array<Period>;
  usePeriod?: Array<Period>;
  text?: string;
  linkId?: Array<string>;
  answer?: ContractTermOfferAnswer;
  securityLabelNumber?: Array<unsignedInt>;
  valuedItem?: Array<ContractTermAssetValuedItem>;
}
export interface ContractTermActionSubject {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  reference: Array<Reference>;
  role?: CodeableConcept;
}
export interface ContractTermAction {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  doNotPerform?: boolean;
  type: CodeableConcept;
  subject?: Array<ContractTermActionSubject>;
  intent: CodeableConcept;
  linkId?: Array<string>;
  status: CodeableConcept;
  context?: Reference;
  contextLinkId?: Array<string>;
  occurrenceDateTime?: dateTime;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  requester?: Array<Reference>;
  requesterLinkId?: Array<string>;
  performerType?: Array<CodeableConcept>;
  performerRole?: CodeableConcept;
  performer?: Reference;
  performerLinkId?: Array<string>;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  reason?: Array<string>;
  reasonLinkId?: Array<string>;
  note?: Array<Annotation>;
  securityLabelNumber?: Array<unsignedInt>;
}
export interface ContractTerm {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  issued?: dateTime;
  applies?: Period;
  topicCodeableConcept?: CodeableConcept;
  topicReference?: Reference;
  type?: CodeableConcept;
  subType?: CodeableConcept;
  text?: string;
  securityLabel?: Array<ContractTermSecurityLabel>;
  offer: ContractTermOffer;
  asset?: Array<ContractTermAsset>;
  action?: Array<ContractTermAction>;
  group?: ContractTerm;
}
export interface ContractSigner {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: Coding;
  party: Reference;
  signature: Array<Signature>;
}
export interface ContractFriendly {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}
export interface ContractLegal {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}
export interface ContractRule {
  resourceType: "Contract"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}
export interface Contract {
  resourceType: "Contract"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  url?: uri;
  version?: string;
  status?: code;
  legalState?: CodeableConcept;
  instantiatesCanonical?: Reference;
  instantiatesUri?: uri;
  contentDerivative?: CodeableConcept;
  issued?: dateTime;
  applies?: Period;
  expirationType?: CodeableConcept;
  subject?: Array<Reference>;
  authority?: Array<Reference>;
  domain?: Array<Reference>;
  site?: Array<Reference>;
  name?: string;
  title?: string;
  subtitle?: string;
  alias?: Array<string>;
  author?: Reference;
  scope?: CodeableConcept;
  topicCodeableConcept?: CodeableConcept;
  topicReference?: Reference;
  type?: CodeableConcept;
  subType?: Array<CodeableConcept>;
  contentDefinition?: ContractContentDefinition;
  term?: Array<ContractTerm>;
  supportingInfo?: Array<Reference>;
  relevantHistory?: Array<Reference>;
  signer?: Array<ContractSigner>;
  friendly?: Array<ContractFriendly>;
  legal?: Array<ContractLegal>;
  rule?: Array<ContractRule>;
  legallyBindingAttachment?: Attachment;
  legallyBindingReference?: Reference;
}

export interface CoverageClass {
  resourceType: "Coverage"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  value: string;
  name?: string;
}
export interface CoverageCostToBeneficiaryException {
  resourceType: "Coverage"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  period?: Period;
}
export interface CoverageCostToBeneficiary {
  resourceType: "Coverage"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  valueQuantity?: Quantity;
  valueMoney?: Money;
  exception?: Array<CoverageCostToBeneficiaryException>;
}
export interface Coverage {
  resourceType: "Coverage"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  type?: CodeableConcept;
  policyHolder?: Reference;
  subscriber?: Reference;
  subscriberId?: string;
  beneficiary: Reference;
  dependent?: string;
  relationship?: CodeableConcept;
  period?: Period;
  payor: Array<Reference>;
  class?: Array<CoverageClass>;
  order?: positiveInt;
  network?: string;
  costToBeneficiary?: Array<CoverageCostToBeneficiary>;
  subrogation?: boolean;
  contract?: Array<Reference>;
}

export interface CoverageEligibilityRequestSupportingInfo {
  resourceType: "CoverageEligibilityRequest"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  information: Reference;
  appliesToAll?: boolean;
}
export interface CoverageEligibilityRequestInsurance {
  resourceType: "CoverageEligibilityRequest"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  focal?: boolean;
  coverage: Reference;
  businessArrangement?: string;
}
export interface CoverageEligibilityRequestItemDiagnosis {
  resourceType: "CoverageEligibilityRequest"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
}
export interface CoverageEligibilityRequestItem {
  resourceType: "CoverageEligibilityRequest"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  supportingInfoSequence?: Array<positiveInt>;
  category?: CodeableConcept;
  productOrService?: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  provider?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  facility?: Reference;
  diagnosis?: Array<CoverageEligibilityRequestItemDiagnosis>;
  detail?: Array<Reference>;
}
export interface CoverageEligibilityRequest {
  resourceType: "CoverageEligibilityRequest"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  priority?: CodeableConcept;
  purpose: Array<code>;
  patient: Reference;
  servicedDate?: date;
  servicedPeriod?: Period;
  created: dateTime;
  enterer?: Reference;
  provider?: Reference;
  insurer: Reference;
  facility?: Reference;
  supportingInfo?: Array<CoverageEligibilityRequestSupportingInfo>;
  insurance?: Array<CoverageEligibilityRequestInsurance>;
  item?: Array<CoverageEligibilityRequestItem>;
}

export interface CoverageEligibilityResponseInsuranceItemBenefit {
  resourceType: "CoverageEligibilityResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  allowedUnsignedInt?: unsignedInt;
  allowedString?: string;
  allowedMoney?: Money;
  usedUnsignedInt?: unsignedInt;
  usedString?: string;
  usedMoney?: Money;
}
export interface CoverageEligibilityResponseInsuranceItem {
  resourceType: "CoverageEligibilityResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category?: CodeableConcept;
  productOrService?: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  provider?: Reference;
  excluded?: boolean;
  name?: string;
  description?: string;
  network?: CodeableConcept;
  unit?: CodeableConcept;
  term?: CodeableConcept;
  benefit?: Array<CoverageEligibilityResponseInsuranceItemBenefit>;
  authorizationRequired?: boolean;
  authorizationSupporting?: Array<CodeableConcept>;
  authorizationUrl?: uri;
}
export interface CoverageEligibilityResponseInsurance {
  resourceType: "CoverageEligibilityResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  coverage: Reference;
  inforce?: boolean;
  benefitPeriod?: Period;
  item?: Array<CoverageEligibilityResponseInsuranceItem>;
}
export interface CoverageEligibilityResponseError {
  resourceType: "CoverageEligibilityResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
}
export interface CoverageEligibilityResponse {
  resourceType: "CoverageEligibilityResponse"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  purpose: Array<code>;
  patient: Reference;
  servicedDate?: date;
  servicedPeriod?: Period;
  created: dateTime;
  requestor?: Reference;
  request: Reference;
  outcome: code;
  disposition?: string;
  insurer: Reference;
  insurance?: Array<CoverageEligibilityResponseInsurance>;
  preAuthRef?: string;
  form?: CodeableConcept;
  error?: Array<CoverageEligibilityResponseError>;
}

export interface DetectedIssueEvidence {
  resourceType: "DetectedIssue"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: Array<CodeableConcept>;
  detail?: Array<Reference>;
}
export interface DetectedIssueMitigation {
  resourceType: "DetectedIssue"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action: CodeableConcept;
  date?: dateTime;
  author?: Reference;
}
export interface DetectedIssue {
  resourceType: "DetectedIssue"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  code?: CodeableConcept;
  severity?: code;
  patient?: Reference;
  identifiedDateTime?: dateTime;
  identifiedPeriod?: Period;
  author?: Reference;
  implicated?: Array<Reference>;
  evidence?: Array<DetectedIssueEvidence>;
  detail?: string;
  reference?: uri;
  mitigation?: Array<DetectedIssueMitigation>;
}

export interface DeviceUdiCarrier {
  resourceType: "Device"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  deviceIdentifier?: string;
  issuer?: uri;
  jurisdiction?: uri;
  carrierAIDC?: base64Binary;
  carrierHRF?: string;
  entryType?: code;
}
export interface DeviceDeviceName {
  resourceType: "Device"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  type: code;
}
export interface DeviceSpecialization {
  resourceType: "Device"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  systemType: CodeableConcept;
  version?: string;
}
export interface DeviceVersion {
  resourceType: "Device"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  component?: Identifier;
  value: string;
}
export interface DeviceProperty {
  resourceType: "Device"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  valueQuantity?: Array<Quantity>;
  valueCode?: Array<CodeableConcept>;
}
export interface Device {
  resourceType: "Device"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  definition?: Reference;
  udiCarrier?: Array<DeviceUdiCarrier>;
  status?: code;
  statusReason?: Array<CodeableConcept>;
  distinctIdentifier?: string;
  manufacturer?: string;
  manufactureDate?: dateTime;
  expirationDate?: dateTime;
  lotNumber?: string;
  serialNumber?: string;
  deviceName?: Array<DeviceDeviceName>;
  modelNumber?: string;
  partNumber?: string;
  type?: CodeableConcept;
  specialization?: Array<DeviceSpecialization>;
  version?: Array<DeviceVersion>;
  property?: Array<DeviceProperty>;
  patient?: Reference;
  owner?: Reference;
  contact?: Array<ContactPoint>;
  location?: Reference;
  url?: uri;
  note?: Array<Annotation>;
  safety?: Array<CodeableConcept>;
  parent?: Reference;
}

export interface DeviceDefinitionUdiDeviceIdentifier {
  resourceType: "DeviceDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  deviceIdentifier: string;
  issuer: uri;
  jurisdiction: uri;
}
export interface DeviceDefinitionDeviceName {
  resourceType: "DeviceDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  type: code;
}
export interface DeviceDefinitionSpecialization {
  resourceType: "DeviceDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  systemType: string;
  version?: string;
}
export interface DeviceDefinitionCapability {
  resourceType: "DeviceDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  description?: Array<CodeableConcept>;
}
export interface DeviceDefinitionProperty {
  resourceType: "DeviceDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  valueQuantity?: Array<Quantity>;
  valueCode?: Array<CodeableConcept>;
}
export interface DeviceDefinitionMaterial {
  resourceType: "DeviceDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  substance: CodeableConcept;
  alternate?: boolean;
  allergenicIndicator?: boolean;
}
export interface DeviceDefinition {
  resourceType: "DeviceDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  udiDeviceIdentifier?: Array<DeviceDefinitionUdiDeviceIdentifier>;
  manufacturerString?: string;
  manufacturerReference?: Reference;
  deviceName?: Array<DeviceDefinitionDeviceName>;
  modelNumber?: string;
  type?: CodeableConcept;
  specialization?: Array<DeviceDefinitionSpecialization>;
  version?: Array<string>;
  safety?: Array<CodeableConcept>;
  shelfLifeStorage?: Array<ProductShelfLife>;
  physicalCharacteristics?: ProdCharacteristic;
  languageCode?: Array<CodeableConcept>;
  capability?: Array<DeviceDefinitionCapability>;
  property?: Array<DeviceDefinitionProperty>;
  owner?: Reference;
  contact?: Array<ContactPoint>;
  url?: uri;
  onlineInformation?: uri;
  note?: Array<Annotation>;
  quantity?: Quantity;
  parentDevice?: Reference;
  material?: Array<DeviceDefinitionMaterial>;
}

export interface DeviceMetricCalibration {
  resourceType: "DeviceMetric"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: code;
  state?: code;
  time?: instant;
}
export interface DeviceMetric {
  resourceType: "DeviceMetric"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  type: CodeableConcept;
  unit?: CodeableConcept;
  source?: Reference;
  parent?: Reference;
  operationalStatus?: code;
  color?: code;
  category: code;
  measurementPeriod?: Timing;
  calibration?: Array<DeviceMetricCalibration>;
}

export interface DeviceRequestParameter {
  resourceType: "DeviceRequest"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueBoolean?: boolean;
}
export interface DeviceRequest {
  resourceType: "DeviceRequest"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  instantiatesCanonical?: Array<canonical>;
  instantiatesUri?: Array<uri>;
  basedOn?: Array<Reference>;
  priorRequest?: Array<Reference>;
  groupIdentifier?: Identifier;
  status?: code;
  intent: code;
  priority?: code;
  codeReference?: Reference;
  codeCodeableConcept?: CodeableConcept;
  parameter?: Array<DeviceRequestParameter>;
  subject: Reference;
  encounter?: Reference;
  occurrenceDateTime?: dateTime;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  authoredOn?: dateTime;
  requester?: Reference;
  performerType?: CodeableConcept;
  performer?: Reference;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  insurance?: Array<Reference>;
  supportingInfo?: Array<Reference>;
  note?: Array<Annotation>;
  relevantHistory?: Array<Reference>;
}

export interface DeviceUseStatement {
  resourceType: "DeviceUseStatement"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  basedOn?: Array<Reference>;
  status: code;
  subject: Reference;
  derivedFrom?: Array<Reference>;
  timingTiming?: Timing;
  timingPeriod?: Period;
  timingDateTime?: dateTime;
  recordedOn?: dateTime;
  source?: Reference;
  device: Reference;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  bodySite?: CodeableConcept;
  note?: Array<Annotation>;
}

export interface DiagnosticReportMedia {
  resourceType: "DiagnosticReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  comment?: string;
  link: Reference;
}
export interface DiagnosticReport {
  resourceType: "DiagnosticReport"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  basedOn?: Array<Reference>;
  status: code;
  category?: Array<CodeableConcept>;
  code: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  effectiveDateTime?: dateTime;
  effectivePeriod?: Period;
  issued?: instant;
  performer?: Array<Reference>;
  resultsInterpreter?: Array<Reference>;
  specimen?: Array<Reference>;
  result?: Array<Reference>;
  imagingStudy?: Array<Reference>;
  media?: Array<DiagnosticReportMedia>;
  conclusion?: string;
  conclusionCode?: Array<CodeableConcept>;
  presentedForm?: Array<Attachment>;
}

export interface DocumentManifestRelated {
  resourceType: "DocumentManifest"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  ref?: Reference;
}
export interface DocumentManifest {
  resourceType: "DocumentManifest"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  masterIdentifier?: Identifier;
  identifier?: Array<Identifier>;
  status: code;
  type?: CodeableConcept;
  subject?: Reference;
  created?: dateTime;
  author?: Array<Reference>;
  recipient?: Array<Reference>;
  source?: uri;
  description?: string;
  content: Array<Reference>;
  related?: Array<DocumentManifestRelated>;
}

export interface DocumentReferenceRelatesTo {
  resourceType: "DocumentReference"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  target: Reference;
}
export interface DocumentReferenceContent {
  resourceType: "DocumentReference"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  attachment: Attachment;
  format?: Coding;
}
export interface DocumentReferenceContext {
  resourceType: "DocumentReference"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  encounter?: Array<Reference>;
  event?: Array<CodeableConcept>;
  period?: Period;
  facilityType?: CodeableConcept;
  practiceSetting?: CodeableConcept;
  sourcePatientInfo?: Reference;
  related?: Array<Reference>;
}
export interface DocumentReference {
  resourceType: "DocumentReference"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  masterIdentifier?: Identifier;
  identifier?: Array<Identifier>;
  status: code;
  docStatus?: code;
  type?: CodeableConcept;
  category?: Array<CodeableConcept>;
  subject?: Reference;
  date?: instant;
  author?: Array<Reference>;
  authenticator?: Reference;
  custodian?: Reference;
  relatesTo?: Array<DocumentReferenceRelatesTo>;
  description?: string;
  securityLabel?: Array<CodeableConcept>;
  content: Array<DocumentReferenceContent>;
  context?: DocumentReferenceContext;
}

export interface EffectEvidenceSynthesisSampleSize {
  resourceType: "EffectEvidenceSynthesis"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  numberOfStudies?: integer;
  numberOfParticipants?: integer;
}
export interface EffectEvidenceSynthesisResultsByExposure {
  resourceType: "EffectEvidenceSynthesis"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  exposureState?: code;
  variantState?: CodeableConcept;
  riskEvidenceSynthesis: Reference;
}
export interface EffectEvidenceSynthesisEffectEstimatePrecisionEstimate {
  resourceType: "EffectEvidenceSynthesis"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  level?: decimal;
  from?: decimal;
  to?: decimal;
}
export interface EffectEvidenceSynthesisEffectEstimate {
  resourceType: "EffectEvidenceSynthesis"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  type?: CodeableConcept;
  variantState?: CodeableConcept;
  value?: decimal;
  unitOfMeasure?: CodeableConcept;
  precisionEstimate?: Array<EffectEvidenceSynthesisEffectEstimatePrecisionEstimate>;
}
export interface EffectEvidenceSynthesisCertaintyCertaintySubcomponent {
  resourceType: "EffectEvidenceSynthesis"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  rating?: Array<CodeableConcept>;
  note?: Array<Annotation>;
}
export interface EffectEvidenceSynthesisCertainty {
  resourceType: "EffectEvidenceSynthesis"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  rating?: Array<CodeableConcept>;
  note?: Array<Annotation>;
  certaintySubcomponent?: Array<EffectEvidenceSynthesisCertaintyCertaintySubcomponent>;
}
export interface EffectEvidenceSynthesis {
  resourceType: "EffectEvidenceSynthesis"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  status: code;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  note?: Array<Annotation>;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  topic?: Array<CodeableConcept>;
  author?: Array<ContactDetail>;
  editor?: Array<ContactDetail>;
  reviewer?: Array<ContactDetail>;
  endorser?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  synthesisType?: CodeableConcept;
  studyType?: CodeableConcept;
  population: Reference;
  exposure: Reference;
  exposureAlternative: Reference;
  outcome: Reference;
  sampleSize?: EffectEvidenceSynthesisSampleSize;
  resultsByExposure?: Array<EffectEvidenceSynthesisResultsByExposure>;
  effectEstimate?: Array<EffectEvidenceSynthesisEffectEstimate>;
  certainty?: Array<EffectEvidenceSynthesisCertainty>;
}

export interface EncounterStatusHistory {
  resourceType: "Encounter"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  status: code;
  period: Period;
}
export interface EncounterClassHistory {
  resourceType: "Encounter"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  class: Coding;
  period: Period;
}
export interface EncounterParticipant {
  resourceType: "Encounter"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: Array<CodeableConcept>;
  period?: Period;
  individual?: Reference;
}
export interface EncounterDiagnosis {
  resourceType: "Encounter"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  condition: Reference;
  use?: CodeableConcept;
  rank?: positiveInt;
}
export interface EncounterHospitalization {
  resourceType: "Encounter"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  preAdmissionIdentifier?: Identifier;
  origin?: Reference;
  admitSource?: CodeableConcept;
  reAdmission?: CodeableConcept;
  dietPreference?: Array<CodeableConcept>;
  specialCourtesy?: Array<CodeableConcept>;
  specialArrangement?: Array<CodeableConcept>;
  destination?: Reference;
  dischargeDisposition?: CodeableConcept;
}
export interface EncounterLocation {
  resourceType: "Encounter"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  location: Reference;
  status?: code;
  physicalType?: CodeableConcept;
  period?: Period;
}
export interface Encounter {
  resourceType: "Encounter"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  statusHistory?: Array<EncounterStatusHistory>;
  class: Coding;
  classHistory?: Array<EncounterClassHistory>;
  type?: Array<CodeableConcept>;
  serviceType?: CodeableConcept;
  priority?: CodeableConcept;
  subject?: Reference;
  episodeOfCare?: Array<Reference>;
  basedOn?: Array<Reference>;
  participant?: Array<EncounterParticipant>;
  appointment?: Array<Reference>;
  period?: Period;
  length?: Duration;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  diagnosis?: Array<EncounterDiagnosis>;
  account?: Array<Reference>;
  hospitalization?: EncounterHospitalization;
  location?: Array<EncounterLocation>;
  serviceProvider?: Reference;
  partOf?: Reference;
}

export interface Endpoint {
  resourceType: "Endpoint"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  connectionType: Coding;
  name?: string;
  managingOrganization?: Reference;
  contact?: Array<ContactPoint>;
  period?: Period;
  payloadType: Array<CodeableConcept>;
  payloadMimeType?: Array<code>;
  address: url;
  header?: Array<string>;
}

export interface EnrollmentRequest {
  resourceType: "EnrollmentRequest"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status?: code;
  created?: dateTime;
  insurer?: Reference;
  provider?: Reference;
  candidate?: Reference;
  coverage?: Reference;
}

export interface EnrollmentResponse {
  resourceType: "EnrollmentResponse"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status?: code;
  request?: Reference;
  outcome?: code;
  disposition?: string;
  created?: dateTime;
  organization?: Reference;
  requestProvider?: Reference;
}

export interface EpisodeOfCareStatusHistory {
  resourceType: "EpisodeOfCare"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  status: code;
  period: Period;
}
export interface EpisodeOfCareDiagnosis {
  resourceType: "EpisodeOfCare"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  condition: Reference;
  role?: CodeableConcept;
  rank?: positiveInt;
}
export interface EpisodeOfCare {
  resourceType: "EpisodeOfCare"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  statusHistory?: Array<EpisodeOfCareStatusHistory>;
  type?: Array<CodeableConcept>;
  diagnosis?: Array<EpisodeOfCareDiagnosis>;
  patient: Reference;
  managingOrganization?: Reference;
  period?: Period;
  referralRequest?: Array<Reference>;
  careManager?: Reference;
  team?: Array<Reference>;
  account?: Array<Reference>;
}

export interface EventDefinition {
  resourceType: "EventDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  status: code;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  usage?: string;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  topic?: Array<CodeableConcept>;
  author?: Array<ContactDetail>;
  editor?: Array<ContactDetail>;
  reviewer?: Array<ContactDetail>;
  endorser?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  trigger: Array<TriggerDefinition>;
}

export interface Evidence {
  resourceType: "Evidence"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  shortTitle?: string;
  subtitle?: string;
  status: code;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  note?: Array<Annotation>;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  topic?: Array<CodeableConcept>;
  author?: Array<ContactDetail>;
  editor?: Array<ContactDetail>;
  reviewer?: Array<ContactDetail>;
  endorser?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  exposureBackground: Reference;
  exposureVariant?: Array<Reference>;
  outcome?: Array<Reference>;
}

export interface EvidenceVariableCharacteristic {
  resourceType: "EvidenceVariable"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  definitionReference?: Reference;
  definitionCanonical?: canonical;
  definitionCodeableConcept?: CodeableConcept;
  definitionExpression?: Expression;
  definitionDataRequirement?: DataRequirement;
  definitionTriggerDefinition?: TriggerDefinition;
  usageContext?: Array<UsageContext>;
  exclude?: boolean;
  participantEffectiveDateTime?: dateTime;
  participantEffectivePeriod?: Period;
  participantEffectiveDuration?: Duration;
  participantEffectiveTiming?: Timing;
  timeFromStart?: Duration;
  groupMeasure?: code;
}
export interface EvidenceVariable {
  resourceType: "EvidenceVariable"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  shortTitle?: string;
  subtitle?: string;
  status: code;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  note?: Array<Annotation>;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  topic?: Array<CodeableConcept>;
  author?: Array<ContactDetail>;
  editor?: Array<ContactDetail>;
  reviewer?: Array<ContactDetail>;
  endorser?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  type?: code;
  characteristic: Array<EvidenceVariableCharacteristic>;
}

export interface ExampleScenarioActor {
  resourceType: "ExampleScenario"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  actorId: string;
  type: code;
  name?: string;
  description?: markdown;
}
export interface ExampleScenarioInstanceVersion {
  resourceType: "ExampleScenario"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  versionId: string;
  description: markdown;
}
export interface ExampleScenarioInstanceContainedInstance {
  resourceType: "ExampleScenario"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  resourceId: string;
  versionId?: string;
}
export interface ExampleScenarioInstance {
  resourceType: "ExampleScenario"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  resourceId: string;
  resourceType: code;
  name?: string;
  description?: markdown;
  version?: Array<ExampleScenarioInstanceVersion>;
  containedInstance?: Array<ExampleScenarioInstanceContainedInstance>;
}
export interface ExampleScenarioProcessStepOperation {
  resourceType: "ExampleScenario"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  number: string;
  type?: string;
  name?: string;
  initiator?: string;
  receiver?: string;
  description?: markdown;
  initiatorActive?: boolean;
  receiverActive?: boolean;
  request?: ExampleScenarioInstanceContainedInstance;
  response?: ExampleScenarioInstanceContainedInstance;
}
export interface ExampleScenarioProcessStepAlternative {
  resourceType: "ExampleScenario"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  title: string;
  description?: markdown;
  step?: ExampleScenarioProcessStep;
}
export interface ExampleScenarioProcessStep {
  resourceType: "ExampleScenario"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  process?: ExampleScenarioProcess;
  pause?: boolean;
  operation?: ExampleScenarioProcessStepOperation;
  alternative?: Array<ExampleScenarioProcessStepAlternative>;
}
export interface ExampleScenarioProcess {
  resourceType: "ExampleScenario"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  title: string;
  description?: markdown;
  preConditions?: markdown;
  postConditions?: markdown;
  step?: Array<ExampleScenarioProcessStep>;
}
export interface ExampleScenario {
  resourceType: "ExampleScenario"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  copyright?: markdown;
  purpose?: markdown;
  actor?: Array<ExampleScenarioActor>;
  instance?: Array<ExampleScenarioInstance>;
  process?: Array<ExampleScenarioProcess>;
  workflow?: Array<canonical>;
}

export interface ExplanationOfBenefitRelated {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  claim?: Reference;
  relationship?: CodeableConcept;
  reference?: Identifier;
}
export interface ExplanationOfBenefitPayee {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  party?: Reference;
}
export interface ExplanationOfBenefitCareTeam {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  provider: Reference;
  responsible?: boolean;
  role?: CodeableConcept;
  qualification?: CodeableConcept;
}
export interface ExplanationOfBenefitSupportingInfo {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  category: CodeableConcept;
  code?: CodeableConcept;
  timingDate?: date;
  timingPeriod?: Period;
  valueBoolean?: boolean;
  valueString?: string;
  valueQuantity?: Quantity;
  valueAttachment?: Attachment;
  valueReference?: Reference;
  reason?: Coding;
}
export interface ExplanationOfBenefitDiagnosis {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
  type?: Array<CodeableConcept>;
  onAdmission?: CodeableConcept;
  packageCode?: CodeableConcept;
}
export interface ExplanationOfBenefitProcedure {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  type?: Array<CodeableConcept>;
  date?: dateTime;
  procedureCodeableConcept?: CodeableConcept;
  procedureReference?: Reference;
  udi?: Array<Reference>;
}
export interface ExplanationOfBenefitInsurance {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  focal: boolean;
  coverage: Reference;
  preAuthRef?: Array<string>;
}
export interface ExplanationOfBenefitAccident {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  date?: date;
  type?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
}
export interface ExplanationOfBenefitItemAdjudication {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category: CodeableConcept;
  reason?: CodeableConcept;
  amount?: Money;
  value?: decimal;
}
export interface ExplanationOfBenefitItemDetailSubDetail {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  programCode?: Array<CodeableConcept>;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  udi?: Array<Reference>;
  noteNumber?: Array<positiveInt>;
  adjudication?: ExplanationOfBenefitItemAdjudication;
}
export interface ExplanationOfBenefitItemDetail {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  programCode?: Array<CodeableConcept>;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  udi?: Array<Reference>;
  noteNumber?: Array<positiveInt>;
  adjudication?: ExplanationOfBenefitItemAdjudication;
  subDetail?: Array<ExplanationOfBenefitItemDetailSubDetail>;
}
export interface ExplanationOfBenefitItem {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  careTeamSequence?: Array<positiveInt>;
  diagnosisSequence?: Array<positiveInt>;
  procedureSequence?: Array<positiveInt>;
  informationSequence?: Array<positiveInt>;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  programCode?: Array<CodeableConcept>;
  servicedDate?: date;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  udi?: Array<Reference>;
  bodySite?: CodeableConcept;
  subSite?: Array<CodeableConcept>;
  encounter?: Array<Reference>;
  noteNumber?: Array<positiveInt>;
  adjudication?: Array<ExplanationOfBenefitItemAdjudication>;
  detail?: Array<ExplanationOfBenefitItemDetail>;
}
export interface ExplanationOfBenefitAddItemDetailSubDetail {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  noteNumber?: Array<positiveInt>;
  adjudication?: ExplanationOfBenefitItemAdjudication;
}
export interface ExplanationOfBenefitAddItemDetail {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  noteNumber?: Array<positiveInt>;
  adjudication?: ExplanationOfBenefitItemAdjudication;
  subDetail?: Array<ExplanationOfBenefitAddItemDetailSubDetail>;
}
export interface ExplanationOfBenefitAddItem {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemSequence?: Array<positiveInt>;
  detailSequence?: Array<positiveInt>;
  subDetailSequence?: Array<positiveInt>;
  provider?: Array<Reference>;
  productOrService: CodeableConcept;
  modifier?: Array<CodeableConcept>;
  programCode?: Array<CodeableConcept>;
  servicedDate?: date;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: decimal;
  net?: Money;
  bodySite?: CodeableConcept;
  subSite?: Array<CodeableConcept>;
  noteNumber?: Array<positiveInt>;
  adjudication?: ExplanationOfBenefitItemAdjudication;
  detail?: Array<ExplanationOfBenefitAddItemDetail>;
}
export interface ExplanationOfBenefitTotal {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category: CodeableConcept;
  amount: Money;
}
export interface ExplanationOfBenefitPayment {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  adjustment?: Money;
  adjustmentReason?: CodeableConcept;
  date?: date;
  amount?: Money;
  identifier?: Identifier;
}
export interface ExplanationOfBenefitProcessNote {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  number?: positiveInt;
  type?: code;
  text?: string;
  language?: CodeableConcept;
}
export interface ExplanationOfBenefitBenefitBalanceFinancial {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  allowedUnsignedInt?: unsignedInt;
  allowedString?: string;
  allowedMoney?: Money;
  usedUnsignedInt?: unsignedInt;
  usedMoney?: Money;
}
export interface ExplanationOfBenefitBenefitBalance {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category: CodeableConcept;
  excluded?: boolean;
  name?: string;
  description?: string;
  network?: CodeableConcept;
  unit?: CodeableConcept;
  term?: CodeableConcept;
  financial?: Array<ExplanationOfBenefitBenefitBalanceFinancial>;
}
export interface ExplanationOfBenefit {
  resourceType: "ExplanationOfBenefit"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  type: CodeableConcept;
  subType?: CodeableConcept;
  use: code;
  patient: Reference;
  billablePeriod?: Period;
  created: dateTime;
  enterer?: Reference;
  insurer: Reference;
  provider: Reference;
  priority?: CodeableConcept;
  fundsReserveRequested?: CodeableConcept;
  fundsReserve?: CodeableConcept;
  related?: Array<ExplanationOfBenefitRelated>;
  prescription?: Reference;
  originalPrescription?: Reference;
  payee?: ExplanationOfBenefitPayee;
  referral?: Reference;
  facility?: Reference;
  claim?: Reference;
  claimResponse?: Reference;
  outcome: code;
  disposition?: string;
  preAuthRef?: Array<string>;
  preAuthRefPeriod?: Array<Period>;
  careTeam?: Array<ExplanationOfBenefitCareTeam>;
  supportingInfo?: Array<ExplanationOfBenefitSupportingInfo>;
  diagnosis?: Array<ExplanationOfBenefitDiagnosis>;
  procedure?: Array<ExplanationOfBenefitProcedure>;
  precedence?: positiveInt;
  insurance: Array<ExplanationOfBenefitInsurance>;
  accident?: ExplanationOfBenefitAccident;
  item?: Array<ExplanationOfBenefitItem>;
  addItem?: Array<ExplanationOfBenefitAddItem>;
  adjudication?: ExplanationOfBenefitItemAdjudication;
  total?: Array<ExplanationOfBenefitTotal>;
  payment?: ExplanationOfBenefitPayment;
  formCode?: CodeableConcept;
  form?: Attachment;
  processNote?: Array<ExplanationOfBenefitProcessNote>;
  benefitPeriod?: Period;
  benefitBalance?: Array<ExplanationOfBenefitBenefitBalance>;
}

export interface FamilyMemberHistoryCondition {
  resourceType: "FamilyMemberHistory"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  outcome?: CodeableConcept;
  contributedToDeath?: boolean;
  onsetAge?: Age;
  onsetRange?: Range;
  onsetPeriod?: Period;
  onsetString?: string;
  note?: Array<Annotation>;
}
export interface FamilyMemberHistory {
  resourceType: "FamilyMemberHistory"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  instantiatesCanonical?: Array<canonical>;
  instantiatesUri?: Array<uri>;
  status: code;
  dataAbsentReason?: CodeableConcept;
  patient: Reference;
  date?: dateTime;
  name?: string;
  relationship: CodeableConcept;
  sex?: CodeableConcept;
  bornPeriod?: Period;
  bornDate?: date;
  bornString?: string;
  ageAge?: Age;
  ageRange?: Range;
  ageString?: string;
  estimatedAge?: boolean;
  deceasedBoolean?: boolean;
  deceasedAge?: Age;
  deceasedRange?: Range;
  deceasedDate?: date;
  deceasedString?: string;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  note?: Array<Annotation>;
  condition?: Array<FamilyMemberHistoryCondition>;
}

export interface Flag {
  resourceType: "Flag"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  category?: Array<CodeableConcept>;
  code: CodeableConcept;
  subject: Reference;
  period?: Period;
  encounter?: Reference;
  author?: Reference;
}

export interface GoalTarget {
  resourceType: "Goal"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  measure?: CodeableConcept;
  detailQuantity?: Quantity;
  detailRange?: Range;
  detailCodeableConcept?: CodeableConcept;
  detailString?: string;
  detailBoolean?: boolean;
  detailInteger?: integer;
  detailRatio?: Ratio;
  dueDate?: date;
  dueDuration?: Duration;
}
export interface Goal {
  resourceType: "Goal"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  lifecycleStatus: code;
  achievementStatus?: CodeableConcept;
  category?: Array<CodeableConcept>;
  priority?: CodeableConcept;
  description: CodeableConcept;
  subject: Reference;
  startDate?: date;
  startCodeableConcept?: CodeableConcept;
  target?: Array<GoalTarget>;
  statusDate?: date;
  statusReason?: string;
  expressedBy?: Reference;
  addresses?: Array<Reference>;
  note?: Array<Annotation>;
  outcomeCode?: Array<CodeableConcept>;
  outcomeReference?: Array<Reference>;
}

export interface GraphDefinitionLinkTargetCompartment {
  resourceType: "GraphDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  use: code;
  code: code;
  rule: code;
  expression?: string;
  description?: string;
}
export interface GraphDefinitionLinkTarget {
  resourceType: "GraphDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  params?: string;
  profile?: canonical;
  compartment?: Array<GraphDefinitionLinkTargetCompartment>;
  link?: GraphDefinitionLink;
}
export interface GraphDefinitionLink {
  resourceType: "GraphDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  path?: string;
  sliceName?: string;
  min?: integer;
  max?: string;
  description?: string;
  target?: Array<GraphDefinitionLinkTarget>;
}
export interface GraphDefinition {
  resourceType: "GraphDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  version?: string;
  name: string;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  start: code;
  profile?: canonical;
  link?: Array<GraphDefinitionLink>;
}

export interface GroupCharacteristic {
  resourceType: "Group"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueBoolean?: boolean;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueReference?: Reference;
  exclude: boolean;
  period?: Period;
}
export interface GroupMember {
  resourceType: "Group"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  entity: Reference;
  period?: Period;
  inactive?: boolean;
}
export interface Group {
  resourceType: "Group"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  active?: boolean;
  type: code;
  actual: boolean;
  code?: CodeableConcept;
  name?: string;
  quantity?: unsignedInt;
  managingEntity?: Reference;
  characteristic?: Array<GroupCharacteristic>;
  member?: Array<GroupMember>;
}

export interface GuidanceResponse {
  resourceType: "GuidanceResponse"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  requestIdentifier?: Identifier;
  identifier?: Array<Identifier>;
  moduleUri?: uri;
  moduleCanonical?: canonical;
  moduleCodeableConcept?: CodeableConcept;
  status: code;
  subject?: Reference;
  encounter?: Reference;
  occurrenceDateTime?: dateTime;
  performer?: Reference;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  note?: Array<Annotation>;
  evaluationMessage?: Array<Reference>;
  outputParameters?: Reference;
  result?: Reference;
  dataRequirement?: Array<DataRequirement>;
}

export interface HealthcareServiceEligibility {
  resourceType: "HealthcareService"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  comment?: markdown;
}
export interface HealthcareServiceAvailableTime {
  resourceType: "HealthcareService"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  daysOfWeek?: Array<code>;
  allDay?: boolean;
  availableStartTime?: time;
  availableEndTime?: time;
}
export interface HealthcareServiceNotAvailable {
  resourceType: "HealthcareService"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description: string;
  during?: Period;
}
export interface HealthcareService {
  resourceType: "HealthcareService"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  active?: boolean;
  providedBy?: Reference;
  category?: Array<CodeableConcept>;
  type?: Array<CodeableConcept>;
  specialty?: Array<CodeableConcept>;
  location?: Array<Reference>;
  name?: string;
  comment?: string;
  extraDetails?: markdown;
  photo?: Attachment;
  telecom?: Array<ContactPoint>;
  coverageArea?: Array<Reference>;
  serviceProvisionCode?: Array<CodeableConcept>;
  eligibility?: Array<HealthcareServiceEligibility>;
  program?: Array<CodeableConcept>;
  characteristic?: Array<CodeableConcept>;
  communication?: Array<CodeableConcept>;
  referralMethod?: Array<CodeableConcept>;
  appointmentRequired?: boolean;
  availableTime?: Array<HealthcareServiceAvailableTime>;
  notAvailable?: Array<HealthcareServiceNotAvailable>;
  availabilityExceptions?: string;
  endpoint?: Array<Reference>;
}

export interface ImagingStudySeriesPerformer {
  resourceType: "ImagingStudy"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
}
export interface ImagingStudySeriesInstance {
  resourceType: "ImagingStudy"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  uid: id;
  sopClass: Coding;
  number?: unsignedInt;
  title?: string;
}
export interface ImagingStudySeries {
  resourceType: "ImagingStudy"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  uid: id;
  number?: unsignedInt;
  modality: Coding;
  description?: string;
  numberOfInstances?: unsignedInt;
  endpoint?: Array<Reference>;
  bodySite?: Coding;
  laterality?: Coding;
  specimen?: Array<Reference>;
  started?: dateTime;
  performer?: Array<ImagingStudySeriesPerformer>;
  instance?: Array<ImagingStudySeriesInstance>;
}
export interface ImagingStudy {
  resourceType: "ImagingStudy"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  modality?: Array<Coding>;
  subject: Reference;
  encounter?: Reference;
  started?: dateTime;
  basedOn?: Array<Reference>;
  referrer?: Reference;
  interpreter?: Array<Reference>;
  endpoint?: Array<Reference>;
  numberOfSeries?: unsignedInt;
  numberOfInstances?: unsignedInt;
  procedureReference?: Reference;
  procedureCode?: Array<CodeableConcept>;
  location?: Reference;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  note?: Array<Annotation>;
  description?: string;
  series?: Array<ImagingStudySeries>;
}

export interface ImmunizationPerformer {
  resourceType: "Immunization"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
}
export interface ImmunizationEducation {
  resourceType: "Immunization"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  documentType?: string;
  reference?: uri;
  publicationDate?: dateTime;
  presentationDate?: dateTime;
}
export interface ImmunizationReaction {
  resourceType: "Immunization"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  date?: dateTime;
  detail?: Reference;
  reported?: boolean;
}
export interface ImmunizationProtocolApplied {
  resourceType: "Immunization"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  series?: string;
  authority?: Reference;
  targetDisease?: Array<CodeableConcept>;
  doseNumberPositiveInt?: positiveInt;
  doseNumberString?: string;
  seriesDosesPositiveInt?: positiveInt;
  seriesDosesString?: string;
}
export interface Immunization {
  resourceType: "Immunization"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  statusReason?: CodeableConcept;
  vaccineCode: CodeableConcept;
  patient: Reference;
  encounter?: Reference;
  occurrenceDateTime?: dateTime;
  occurrenceString?: string;
  recorded?: dateTime;
  primarySource?: boolean;
  reportOrigin?: CodeableConcept;
  location?: Reference;
  manufacturer?: Reference;
  lotNumber?: string;
  expirationDate?: date;
  site?: CodeableConcept;
  route?: CodeableConcept;
  doseQuantity?: Quantity;
  performer?: Array<ImmunizationPerformer>;
  note?: Array<Annotation>;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  isSubpotent?: boolean;
  subpotentReason?: Array<CodeableConcept>;
  education?: Array<ImmunizationEducation>;
  programEligibility?: Array<CodeableConcept>;
  fundingSource?: CodeableConcept;
  reaction?: Array<ImmunizationReaction>;
  protocolApplied?: Array<ImmunizationProtocolApplied>;
}

export interface ImmunizationEvaluation {
  resourceType: "ImmunizationEvaluation"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  patient: Reference;
  date?: dateTime;
  authority?: Reference;
  targetDisease: CodeableConcept;
  immunizationEvent: Reference;
  doseStatus: CodeableConcept;
  doseStatusReason?: Array<CodeableConcept>;
  description?: string;
  series?: string;
  doseNumberPositiveInt?: positiveInt;
  doseNumberString?: string;
  seriesDosesPositiveInt?: positiveInt;
  seriesDosesString?: string;
}

export interface ImmunizationRecommendationRecommendationDateCriterion {
  resourceType: "ImmunizationRecommendation"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  value: dateTime;
}
export interface ImmunizationRecommendationRecommendation {
  resourceType: "ImmunizationRecommendation"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  vaccineCode?: Array<CodeableConcept>;
  targetDisease?: CodeableConcept;
  contraindicatedVaccineCode?: Array<CodeableConcept>;
  forecastStatus: CodeableConcept;
  forecastReason?: Array<CodeableConcept>;
  dateCriterion?: Array<ImmunizationRecommendationRecommendationDateCriterion>;
  description?: string;
  series?: string;
  doseNumberPositiveInt?: positiveInt;
  doseNumberString?: string;
  seriesDosesPositiveInt?: positiveInt;
  seriesDosesString?: string;
  supportingImmunization?: Array<Reference>;
  supportingPatientInformation?: Array<Reference>;
}
export interface ImmunizationRecommendation {
  resourceType: "ImmunizationRecommendation"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  patient: Reference;
  date: dateTime;
  authority?: Reference;
  recommendation: Array<ImmunizationRecommendationRecommendation>;
}

export interface ImplementationGuideDependsOn {
  resourceType: "ImplementationGuide"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  uri: canonical;
  packageId?: id;
  version?: string;
}
export interface ImplementationGuideGlobal {
  resourceType: "ImplementationGuide"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  profile: canonical;
}
export interface ImplementationGuideDefinitionGrouping {
  resourceType: "ImplementationGuide"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  description?: string;
}
export interface ImplementationGuideDefinitionResource {
  resourceType: "ImplementationGuide"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  reference: Reference;
  fhirVersion?: Array<code>;
  name?: string;
  description?: string;
  exampleBoolean?: boolean;
  exampleCanonical?: canonical;
  groupingId?: id;
}
export interface ImplementationGuideDefinitionPage {
  resourceType: "ImplementationGuide"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  nameUrl?: url;
  nameReference?: Reference;
  title: string;
  generation: code;
  page?: ImplementationGuideDefinitionPage;
}
export interface ImplementationGuideDefinitionParameter {
  resourceType: "ImplementationGuide"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  value: string;
}
export interface ImplementationGuideDefinitionTemplate {
  resourceType: "ImplementationGuide"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  source: string;
  scope?: string;
}
export interface ImplementationGuideDefinition {
  resourceType: "ImplementationGuide"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  grouping?: Array<ImplementationGuideDefinitionGrouping>;
  resource: Array<ImplementationGuideDefinitionResource>;
  page?: ImplementationGuideDefinitionPage;
  parameter?: Array<ImplementationGuideDefinitionParameter>;
  template?: Array<ImplementationGuideDefinitionTemplate>;
}
export interface ImplementationGuideManifestResource {
  resourceType: "ImplementationGuide"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  reference: Reference;
  exampleBoolean?: boolean;
  exampleCanonical?: canonical;
  relativePath?: url;
}
export interface ImplementationGuideManifestPage {
  resourceType: "ImplementationGuide"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  title?: string;
  anchor?: Array<string>;
}
export interface ImplementationGuideManifest {
  resourceType: "ImplementationGuide"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  rendering?: url;
  resource: Array<ImplementationGuideManifestResource>;
  page?: Array<ImplementationGuideManifestPage>;
  image?: Array<string>;
  other?: Array<string>;
}
export interface ImplementationGuide {
  resourceType: "ImplementationGuide"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url: uri;
  version?: string;
  name: string;
  title?: string;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  copyright?: markdown;
  packageId: id;
  license?: code;
  fhirVersion: Array<code>;
  dependsOn?: Array<ImplementationGuideDependsOn>;
  global?: Array<ImplementationGuideGlobal>;
  definition?: ImplementationGuideDefinition;
  manifest?: ImplementationGuideManifest;
}

export interface InsurancePlanContact {
  resourceType: "InsurancePlan"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  purpose?: CodeableConcept;
  name?: HumanName;
  telecom?: Array<ContactPoint>;
  address?: Address;
}
export interface InsurancePlanCoverageBenefitLimit {
  resourceType: "InsurancePlan"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  value?: Quantity;
  code?: CodeableConcept;
}
export interface InsurancePlanCoverageBenefit {
  resourceType: "InsurancePlan"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  requirement?: string;
  limit?: Array<InsurancePlanCoverageBenefitLimit>;
}
export interface InsurancePlanCoverage {
  resourceType: "InsurancePlan"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  network?: Array<Reference>;
  benefit: Array<InsurancePlanCoverageBenefit>;
}
export interface InsurancePlanPlanGeneralCost {
  resourceType: "InsurancePlan"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  groupSize?: positiveInt;
  cost?: Money;
  comment?: string;
}
export interface InsurancePlanPlanSpecificCostBenefitCost {
  resourceType: "InsurancePlan"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  applicability?: CodeableConcept;
  qualifiers?: Array<CodeableConcept>;
  value?: Quantity;
}
export interface InsurancePlanPlanSpecificCostBenefit {
  resourceType: "InsurancePlan"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  cost?: Array<InsurancePlanPlanSpecificCostBenefitCost>;
}
export interface InsurancePlanPlanSpecificCost {
  resourceType: "InsurancePlan"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category: CodeableConcept;
  benefit?: Array<InsurancePlanPlanSpecificCostBenefit>;
}
export interface InsurancePlanPlan {
  resourceType: "InsurancePlan"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  type?: CodeableConcept;
  coverageArea?: Array<Reference>;
  network?: Array<Reference>;
  generalCost?: Array<InsurancePlanPlanGeneralCost>;
  specificCost?: Array<InsurancePlanPlanSpecificCost>;
}
export interface InsurancePlan {
  resourceType: "InsurancePlan"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status?: code;
  type?: Array<CodeableConcept>;
  name?: string;
  alias?: Array<string>;
  period?: Period;
  ownedBy?: Reference;
  administeredBy?: Reference;
  coverageArea?: Array<Reference>;
  contact?: Array<InsurancePlanContact>;
  endpoint?: Array<Reference>;
  network?: Array<Reference>;
  coverage?: Array<InsurancePlanCoverage>;
  plan?: Array<InsurancePlanPlan>;
}

export interface InvoiceParticipant {
  resourceType: "Invoice"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  role?: CodeableConcept;
  actor: Reference;
}
export interface InvoiceLineItemPriceComponent {
  resourceType: "Invoice"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  code?: CodeableConcept;
  factor?: decimal;
  amount?: Money;
}
export interface InvoiceLineItem {
  resourceType: "Invoice"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence?: positiveInt;
  chargeItemReference?: Reference;
  chargeItemCodeableConcept?: CodeableConcept;
  priceComponent?: Array<InvoiceLineItemPriceComponent>;
}
export interface Invoice {
  resourceType: "Invoice"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  cancelledReason?: string;
  type?: CodeableConcept;
  subject?: Reference;
  recipient?: Reference;
  date?: dateTime;
  participant?: Array<InvoiceParticipant>;
  issuer?: Reference;
  account?: Reference;
  lineItem?: Array<InvoiceLineItem>;
  totalPriceComponent?: InvoiceLineItemPriceComponent;
  totalNet?: Money;
  totalGross?: Money;
  paymentTerms?: markdown;
  note?: Array<Annotation>;
}

export interface Library {
  resourceType: "Library"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  status: code;
  experimental?: boolean;
  type: CodeableConcept;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  usage?: string;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  topic?: Array<CodeableConcept>;
  author?: Array<ContactDetail>;
  editor?: Array<ContactDetail>;
  reviewer?: Array<ContactDetail>;
  endorser?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  parameter?: Array<ParameterDefinition>;
  dataRequirement?: Array<DataRequirement>;
  content?: Array<Attachment>;
}

export interface LinkageItem {
  resourceType: "Linkage"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  resource: Reference;
}
export interface Linkage {
  resourceType: "Linkage"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  active?: boolean;
  author?: Reference;
  item: Array<LinkageItem>;
}

export interface ListEntry {
  resourceType: "List"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  flag?: CodeableConcept;
  deleted?: boolean;
  date?: dateTime;
  item: Reference;
}
export interface List {
  resourceType: "List"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  mode: code;
  title?: string;
  code?: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  date?: dateTime;
  source?: Reference;
  orderedBy?: CodeableConcept;
  note?: Array<Annotation>;
  entry?: Array<ListEntry>;
  emptyReason?: CodeableConcept;
}

export interface LocationPosition {
  resourceType: "Location"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  longitude: decimal;
  latitude: decimal;
  altitude?: decimal;
}
export interface LocationHoursOfOperation {
  resourceType: "Location"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  daysOfWeek?: Array<code>;
  allDay?: boolean;
  openingTime?: time;
  closingTime?: time;
}
export interface Location {
  resourceType: "Location"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status?: code;
  operationalStatus?: Coding;
  name?: string;
  alias?: Array<string>;
  description?: string;
  mode?: code;
  type?: Array<CodeableConcept>;
  telecom?: Array<ContactPoint>;
  address?: Address;
  physicalType?: CodeableConcept;
  position?: LocationPosition;
  managingOrganization?: Reference;
  partOf?: Reference;
  hoursOfOperation?: Array<LocationHoursOfOperation>;
  availabilityExceptions?: string;
  endpoint?: Array<Reference>;
}

export interface MeasureGroupPopulation {
  resourceType: "Measure"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  description?: string;
  criteria: Expression;
}
export interface MeasureGroupStratifierComponent {
  resourceType: "Measure"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  description?: string;
  criteria: Expression;
}
export interface MeasureGroupStratifier {
  resourceType: "Measure"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  description?: string;
  criteria?: Expression;
  component?: Array<MeasureGroupStratifierComponent>;
}
export interface MeasureGroup {
  resourceType: "Measure"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  description?: string;
  population?: Array<MeasureGroupPopulation>;
  stratifier?: Array<MeasureGroupStratifier>;
}
export interface MeasureSupplementalData {
  resourceType: "Measure"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  usage?: Array<CodeableConcept>;
  description?: string;
  criteria: Expression;
}
export interface Measure {
  resourceType: "Measure"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  status: code;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  usage?: string;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  topic?: Array<CodeableConcept>;
  author?: Array<ContactDetail>;
  editor?: Array<ContactDetail>;
  reviewer?: Array<ContactDetail>;
  endorser?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  library?: Array<canonical>;
  disclaimer?: markdown;
  scoring?: CodeableConcept;
  compositeScoring?: CodeableConcept;
  type?: Array<CodeableConcept>;
  riskAdjustment?: string;
  rateAggregation?: string;
  rationale?: markdown;
  clinicalRecommendationStatement?: markdown;
  improvementNotation?: CodeableConcept;
  definition?: Array<markdown>;
  guidance?: markdown;
  group?: Array<MeasureGroup>;
  supplementalData?: Array<MeasureSupplementalData>;
}

export interface MeasureReportGroupPopulation {
  resourceType: "MeasureReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  count?: integer;
  subjectResults?: Reference;
}
export interface MeasureReportGroupStratifierStratumComponent {
  resourceType: "MeasureReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  value: CodeableConcept;
}
export interface MeasureReportGroupStratifierStratumPopulation {
  resourceType: "MeasureReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  count?: integer;
  subjectResults?: Reference;
}
export interface MeasureReportGroupStratifierStratum {
  resourceType: "MeasureReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  value?: CodeableConcept;
  component?: Array<MeasureReportGroupStratifierStratumComponent>;
  population?: Array<MeasureReportGroupStratifierStratumPopulation>;
  measureScore?: Quantity;
}
export interface MeasureReportGroupStratifier {
  resourceType: "MeasureReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: Array<CodeableConcept>;
  stratum?: Array<MeasureReportGroupStratifierStratum>;
}
export interface MeasureReportGroup {
  resourceType: "MeasureReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  population?: Array<MeasureReportGroupPopulation>;
  measureScore?: Quantity;
  stratifier?: Array<MeasureReportGroupStratifier>;
}
export interface MeasureReport {
  resourceType: "MeasureReport"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  type: code;
  measure: canonical;
  subject?: Reference;
  date?: dateTime;
  reporter?: Reference;
  period: Period;
  improvementNotation?: CodeableConcept;
  group?: Array<MeasureReportGroup>;
  evaluatedResource?: Array<Reference>;
}

export interface Media {
  resourceType: "Media"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  basedOn?: Array<Reference>;
  partOf?: Array<Reference>;
  status: code;
  type?: CodeableConcept;
  modality?: CodeableConcept;
  view?: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  createdDateTime?: dateTime;
  createdPeriod?: Period;
  issued?: instant;
  operator?: Reference;
  reasonCode?: Array<CodeableConcept>;
  bodySite?: CodeableConcept;
  deviceName?: string;
  device?: Reference;
  height?: positiveInt;
  width?: positiveInt;
  frames?: positiveInt;
  duration?: decimal;
  content: Attachment;
  note?: Array<Annotation>;
}

export interface MedicationIngredient {
  resourceType: "Medication"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  isActive?: boolean;
  strength?: Ratio;
}
export interface MedicationBatch {
  resourceType: "Medication"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  lotNumber?: string;
  expirationDate?: dateTime;
}
export interface Medication {
  resourceType: "Medication"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  code?: CodeableConcept;
  status?: code;
  manufacturer?: Reference;
  form?: CodeableConcept;
  amount?: Ratio;
  ingredient?: Array<MedicationIngredient>;
  batch?: MedicationBatch;
}

export interface MedicationAdministrationPerformer {
  resourceType: "MedicationAdministration"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
}
export interface MedicationAdministrationDosage {
  resourceType: "MedicationAdministration"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  text?: string;
  site?: CodeableConcept;
  route?: CodeableConcept;
  method?: CodeableConcept;
  dose?: Quantity;
  rateRatio?: Ratio;
  rateQuantity?: Quantity;
}
export interface MedicationAdministration {
  resourceType: "MedicationAdministration"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  instantiates?: Array<uri>;
  partOf?: Array<Reference>;
  status: code;
  statusReason?: Array<CodeableConcept>;
  category?: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  context?: Reference;
  supportingInformation?: Array<Reference>;
  effectiveDateTime?: dateTime;
  effectivePeriod?: Period;
  performer?: Array<MedicationAdministrationPerformer>;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  request?: Reference;
  device?: Array<Reference>;
  note?: Array<Annotation>;
  dosage?: MedicationAdministrationDosage;
  eventHistory?: Array<Reference>;
}

export interface MedicationDispensePerformer {
  resourceType: "MedicationDispense"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
}
export interface MedicationDispenseSubstitution {
  resourceType: "MedicationDispense"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  wasSubstituted: boolean;
  type?: CodeableConcept;
  reason?: Array<CodeableConcept>;
  responsibleParty?: Array<Reference>;
}
export interface MedicationDispense {
  resourceType: "MedicationDispense"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  partOf?: Array<Reference>;
  status: code;
  statusReasonCodeableConcept?: CodeableConcept;
  statusReasonReference?: Reference;
  category?: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject?: Reference;
  context?: Reference;
  supportingInformation?: Array<Reference>;
  performer?: Array<MedicationDispensePerformer>;
  location?: Reference;
  authorizingPrescription?: Array<Reference>;
  type?: CodeableConcept;
  quantity?: Quantity;
  daysSupply?: Quantity;
  whenPrepared?: dateTime;
  whenHandedOver?: dateTime;
  destination?: Reference;
  receiver?: Array<Reference>;
  note?: Array<Annotation>;
  dosageInstruction?: Array<Dosage>;
  substitution?: MedicationDispenseSubstitution;
  detectedIssue?: Array<Reference>;
  eventHistory?: Array<Reference>;
}

export interface MedicationKnowledgeRelatedMedicationKnowledge {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  reference: Array<Reference>;
}
export interface MedicationKnowledgeMonograph {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  source?: Reference;
}
export interface MedicationKnowledgeIngredient {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  isActive?: boolean;
  strength?: Ratio;
}
export interface MedicationKnowledgeCost {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  source?: string;
  cost: Money;
}
export interface MedicationKnowledgeMonitoringProgram {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  name?: string;
}
export interface MedicationKnowledgeAdministrationGuidelinesDosage {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  dosage: Array<Dosage>;
}
export interface MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  characteristicCodeableConcept?: CodeableConcept;
  characteristicQuantity?: Quantity;
  value?: Array<string>;
}
export interface MedicationKnowledgeAdministrationGuidelines {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  dosage?: Array<MedicationKnowledgeAdministrationGuidelinesDosage>;
  indicationCodeableConcept?: CodeableConcept;
  indicationReference?: Reference;
  patientCharacteristics?: Array<MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics>;
}
export interface MedicationKnowledgeMedicineClassification {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  classification?: Array<CodeableConcept>;
}
export interface MedicationKnowledgePackaging {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  quantity?: Quantity;
}
export interface MedicationKnowledgeDrugCharacteristic {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueQuantity?: Quantity;
  valueBase64Binary?: base64Binary;
}
export interface MedicationKnowledgeRegulatorySubstitution {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  allowed: boolean;
}
export interface MedicationKnowledgeRegulatorySchedule {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  schedule: CodeableConcept;
}
export interface MedicationKnowledgeRegulatoryMaxDispense {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  quantity: Quantity;
  period?: Duration;
}
export interface MedicationKnowledgeRegulatory {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  regulatoryAuthority: Reference;
  substitution?: Array<MedicationKnowledgeRegulatorySubstitution>;
  schedule?: Array<MedicationKnowledgeRegulatorySchedule>;
  maxDispense?: MedicationKnowledgeRegulatoryMaxDispense;
}
export interface MedicationKnowledgeKinetics {
  resourceType: "MedicationKnowledge"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  areaUnderCurve?: Array<Quantity>;
  lethalDose50?: Array<Quantity>;
  halfLifePeriod?: Duration;
}
export interface MedicationKnowledge {
  resourceType: "MedicationKnowledge"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  status?: code;
  manufacturer?: Reference;
  doseForm?: CodeableConcept;
  amount?: Quantity;
  synonym?: Array<string>;
  relatedMedicationKnowledge?: Array<MedicationKnowledgeRelatedMedicationKnowledge>;
  associatedMedication?: Array<Reference>;
  productType?: Array<CodeableConcept>;
  monograph?: Array<MedicationKnowledgeMonograph>;
  ingredient?: Array<MedicationKnowledgeIngredient>;
  preparationInstruction?: markdown;
  intendedRoute?: Array<CodeableConcept>;
  cost?: Array<MedicationKnowledgeCost>;
  monitoringProgram?: Array<MedicationKnowledgeMonitoringProgram>;
  administrationGuidelines?: Array<MedicationKnowledgeAdministrationGuidelines>;
  medicineClassification?: Array<MedicationKnowledgeMedicineClassification>;
  packaging?: MedicationKnowledgePackaging;
  drugCharacteristic?: Array<MedicationKnowledgeDrugCharacteristic>;
  contraindication?: Array<Reference>;
  regulatory?: Array<MedicationKnowledgeRegulatory>;
  kinetics?: Array<MedicationKnowledgeKinetics>;
}

export interface MedicationRequestDispenseRequestInitialFill {
  resourceType: "MedicationRequest"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  quantity?: Quantity;
  duration?: Duration;
}
export interface MedicationRequestDispenseRequest {
  resourceType: "MedicationRequest"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  initialFill?: MedicationRequestDispenseRequestInitialFill;
  dispenseInterval?: Duration;
  validityPeriod?: Period;
  numberOfRepeatsAllowed?: unsignedInt;
  quantity?: Quantity;
  expectedSupplyDuration?: Duration;
  performer?: Reference;
}
export interface MedicationRequestSubstitution {
  resourceType: "MedicationRequest"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  allowedBoolean?: boolean;
  allowedCodeableConcept?: CodeableConcept;
  reason?: CodeableConcept;
}
export interface MedicationRequest {
  resourceType: "MedicationRequest"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  statusReason?: CodeableConcept;
  intent: code;
  category?: Array<CodeableConcept>;
  priority?: code;
  doNotPerform?: boolean;
  reportedBoolean?: boolean;
  reportedReference?: Reference;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  encounter?: Reference;
  supportingInformation?: Array<Reference>;
  authoredOn?: dateTime;
  requester?: Reference;
  performer?: Reference;
  performerType?: CodeableConcept;
  recorder?: Reference;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  instantiatesCanonical?: Array<canonical>;
  instantiatesUri?: Array<uri>;
  basedOn?: Array<Reference>;
  groupIdentifier?: Identifier;
  courseOfTherapyType?: CodeableConcept;
  insurance?: Array<Reference>;
  note?: Array<Annotation>;
  dosageInstruction?: Array<Dosage>;
  dispenseRequest?: MedicationRequestDispenseRequest;
  substitution?: MedicationRequestSubstitution;
  priorPrescription?: Reference;
  detectedIssue?: Array<Reference>;
  eventHistory?: Array<Reference>;
}

export interface MedicationStatement {
  resourceType: "MedicationStatement"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  basedOn?: Array<Reference>;
  partOf?: Array<Reference>;
  status: code;
  statusReason?: Array<CodeableConcept>;
  category?: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  context?: Reference;
  effectiveDateTime?: dateTime;
  effectivePeriod?: Period;
  dateAsserted?: dateTime;
  informationSource?: Reference;
  derivedFrom?: Array<Reference>;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  note?: Array<Annotation>;
  dosage?: Array<Dosage>;
}

export interface MedicinalProductNameNamePart {
  resourceType: "MedicinalProduct"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  part: string;
  type: Coding;
}
export interface MedicinalProductNameCountryLanguage {
  resourceType: "MedicinalProduct"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  country: CodeableConcept;
  jurisdiction?: CodeableConcept;
  language: CodeableConcept;
}
export interface MedicinalProductName {
  resourceType: "MedicinalProduct"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  productName: string;
  namePart?: Array<MedicinalProductNameNamePart>;
  countryLanguage?: Array<MedicinalProductNameCountryLanguage>;
}
export interface MedicinalProductManufacturingBusinessOperation {
  resourceType: "MedicinalProduct"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operationType?: CodeableConcept;
  authorisationReferenceNumber?: Identifier;
  effectiveDate?: dateTime;
  confidentialityIndicator?: CodeableConcept;
  manufacturer?: Array<Reference>;
  regulator?: Reference;
}
export interface MedicinalProductSpecialDesignation {
  resourceType: "MedicinalProduct"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  type?: CodeableConcept;
  intendedUse?: CodeableConcept;
  indicationCodeableConcept?: CodeableConcept;
  indicationReference?: Reference;
  status?: CodeableConcept;
  date?: dateTime;
  species?: CodeableConcept;
}
export interface MedicinalProduct {
  resourceType: "MedicinalProduct"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  type?: CodeableConcept;
  domain?: Coding;
  combinedPharmaceuticalDoseForm?: CodeableConcept;
  legalStatusOfSupply?: CodeableConcept;
  additionalMonitoringIndicator?: CodeableConcept;
  specialMeasures?: Array<string>;
  paediatricUseIndicator?: CodeableConcept;
  productClassification?: Array<CodeableConcept>;
  marketingStatus?: Array<MarketingStatus>;
  pharmaceuticalProduct?: Array<Reference>;
  packagedMedicinalProduct?: Array<Reference>;
  attachedDocument?: Array<Reference>;
  masterFile?: Array<Reference>;
  contact?: Array<Reference>;
  clinicalTrial?: Array<Reference>;
  name: Array<MedicinalProductName>;
  crossReference?: Array<Identifier>;
  manufacturingBusinessOperation?: Array<MedicinalProductManufacturingBusinessOperation>;
  specialDesignation?: Array<MedicinalProductSpecialDesignation>;
}

export interface MedicinalProductAuthorizationJurisdictionalAuthorization {
  resourceType: "MedicinalProductAuthorization"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  country?: CodeableConcept;
  jurisdiction?: Array<CodeableConcept>;
  legalStatusOfSupply?: CodeableConcept;
  validityPeriod?: Period;
}
export interface MedicinalProductAuthorizationProcedure {
  resourceType: "MedicinalProductAuthorization"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  type: CodeableConcept;
  datePeriod?: Period;
  dateDateTime?: dateTime;
  application?: MedicinalProductAuthorizationProcedure;
}
export interface MedicinalProductAuthorization {
  resourceType: "MedicinalProductAuthorization"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  subject?: Reference;
  country?: Array<CodeableConcept>;
  jurisdiction?: Array<CodeableConcept>;
  status?: CodeableConcept;
  statusDate?: dateTime;
  restoreDate?: dateTime;
  validityPeriod?: Period;
  dataExclusivityPeriod?: Period;
  dateOfFirstAuthorization?: dateTime;
  internationalBirthDate?: dateTime;
  legalBasis?: CodeableConcept;
  jurisdictionalAuthorization?: Array<MedicinalProductAuthorizationJurisdictionalAuthorization>;
  holder?: Reference;
  regulator?: Reference;
  procedure?: MedicinalProductAuthorizationProcedure;
}

export interface MedicinalProductContraindicationOtherTherapy {
  resourceType: "MedicinalProductContraindication"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  therapyRelationshipType: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
}
export interface MedicinalProductContraindication {
  resourceType: "MedicinalProductContraindication"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  subject?: Array<Reference>;
  disease?: CodeableConcept;
  diseaseStatus?: CodeableConcept;
  comorbidity?: Array<CodeableConcept>;
  therapeuticIndication?: Array<Reference>;
  otherTherapy?: Array<MedicinalProductContraindicationOtherTherapy>;
  population?: Array<Population>;
}

export interface MedicinalProductIndicationOtherTherapy {
  resourceType: "MedicinalProductIndication"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  therapyRelationshipType: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
}
export interface MedicinalProductIndication {
  resourceType: "MedicinalProductIndication"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  subject?: Array<Reference>;
  diseaseSymptomProcedure?: CodeableConcept;
  diseaseStatus?: CodeableConcept;
  comorbidity?: Array<CodeableConcept>;
  intendedEffect?: CodeableConcept;
  duration?: Quantity;
  otherTherapy?: Array<MedicinalProductIndicationOtherTherapy>;
  undesirableEffect?: Array<Reference>;
  population?: Array<Population>;
}

export interface MedicinalProductIngredientSpecifiedSubstanceStrengthReferenceStrength {
  resourceType: "MedicinalProductIngredient"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  substance?: CodeableConcept;
  strength: Ratio;
  strengthLowLimit?: Ratio;
  measurementPoint?: string;
  country?: Array<CodeableConcept>;
}
export interface MedicinalProductIngredientSpecifiedSubstanceStrength {
  resourceType: "MedicinalProductIngredient"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  presentation: Ratio;
  presentationLowLimit?: Ratio;
  concentration?: Ratio;
  concentrationLowLimit?: Ratio;
  measurementPoint?: string;
  country?: Array<CodeableConcept>;
  referenceStrength?: Array<MedicinalProductIngredientSpecifiedSubstanceStrengthReferenceStrength>;
}
export interface MedicinalProductIngredientSpecifiedSubstance {
  resourceType: "MedicinalProductIngredient"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  group: CodeableConcept;
  confidentiality?: CodeableConcept;
  strength?: Array<MedicinalProductIngredientSpecifiedSubstanceStrength>;
}
export interface MedicinalProductIngredientSubstance {
  resourceType: "MedicinalProductIngredient"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  strength?: MedicinalProductIngredientSpecifiedSubstanceStrength;
}
export interface MedicinalProductIngredient {
  resourceType: "MedicinalProductIngredient"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  role: CodeableConcept;
  allergenicIndicator?: boolean;
  manufacturer?: Array<Reference>;
  specifiedSubstance?: Array<MedicinalProductIngredientSpecifiedSubstance>;
  substance?: MedicinalProductIngredientSubstance;
}

export interface MedicinalProductInteractionInteractant {
  resourceType: "MedicinalProductInteraction"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemReference?: Reference;
  itemCodeableConcept?: CodeableConcept;
}
export interface MedicinalProductInteraction {
  resourceType: "MedicinalProductInteraction"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  subject?: Array<Reference>;
  description?: string;
  interactant?: Array<MedicinalProductInteractionInteractant>;
  type?: CodeableConcept;
  effect?: CodeableConcept;
  incidence?: CodeableConcept;
  management?: CodeableConcept;
}

export interface MedicinalProductManufactured {
  resourceType: "MedicinalProductManufactured"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  manufacturedDoseForm: CodeableConcept;
  unitOfPresentation?: CodeableConcept;
  quantity: Quantity;
  manufacturer?: Array<Reference>;
  ingredient?: Array<Reference>;
  physicalCharacteristics?: ProdCharacteristic;
  otherCharacteristics?: Array<CodeableConcept>;
}

export interface MedicinalProductPackagedBatchIdentifier {
  resourceType: "MedicinalProductPackaged"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  outerPackaging: Identifier;
  immediatePackaging?: Identifier;
}
export interface MedicinalProductPackagedPackageItem {
  resourceType: "MedicinalProductPackaged"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  type: CodeableConcept;
  quantity: Quantity;
  material?: Array<CodeableConcept>;
  alternateMaterial?: Array<CodeableConcept>;
  device?: Array<Reference>;
  manufacturedItem?: Array<Reference>;
  packageItem?: MedicinalProductPackagedPackageItem;
  physicalCharacteristics?: ProdCharacteristic;
  otherCharacteristics?: Array<CodeableConcept>;
  shelfLifeStorage?: Array<ProductShelfLife>;
  manufacturer?: Array<Reference>;
}
export interface MedicinalProductPackaged {
  resourceType: "MedicinalProductPackaged"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  subject?: Array<Reference>;
  description?: string;
  legalStatusOfSupply?: CodeableConcept;
  marketingStatus?: Array<MarketingStatus>;
  marketingAuthorization?: Reference;
  manufacturer?: Array<Reference>;
  batchIdentifier?: Array<MedicinalProductPackagedBatchIdentifier>;
  packageItem: Array<MedicinalProductPackagedPackageItem>;
}

export interface MedicinalProductPharmaceuticalCharacteristics {
  resourceType: "MedicinalProductPharmaceutical"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  status?: CodeableConcept;
}
export interface MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpeciesWithdrawalPeriod {
  resourceType: "MedicinalProductPharmaceutical"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  tissue: CodeableConcept;
  value: Quantity;
  supportingInformation?: string;
}
export interface MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpecies {
  resourceType: "MedicinalProductPharmaceutical"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  withdrawalPeriod?: Array<MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpeciesWithdrawalPeriod>;
}
export interface MedicinalProductPharmaceuticalRouteOfAdministration {
  resourceType: "MedicinalProductPharmaceutical"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  firstDose?: Quantity;
  maxSingleDose?: Quantity;
  maxDosePerDay?: Quantity;
  maxDosePerTreatmentPeriod?: Ratio;
  maxTreatmentPeriod?: Duration;
  targetSpecies?: Array<MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpecies>;
}
export interface MedicinalProductPharmaceutical {
  resourceType: "MedicinalProductPharmaceutical"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  administrableDoseForm: CodeableConcept;
  unitOfPresentation?: CodeableConcept;
  ingredient?: Array<Reference>;
  device?: Array<Reference>;
  characteristics?: Array<MedicinalProductPharmaceuticalCharacteristics>;
  routeOfAdministration: Array<MedicinalProductPharmaceuticalRouteOfAdministration>;
}

export interface MedicinalProductUndesirableEffect {
  resourceType: "MedicinalProductUndesirableEffect"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  subject?: Array<Reference>;
  symptomConditionEffect?: CodeableConcept;
  classification?: CodeableConcept;
  frequencyOfOccurrence?: CodeableConcept;
  population?: Array<Population>;
}

export interface MessageDefinitionFocus {
  resourceType: "MessageDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  profile?: canonical;
  min: unsignedInt;
  max?: string;
}
export interface MessageDefinitionAllowedResponse {
  resourceType: "MessageDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  message: canonical;
  situation?: markdown;
}
export interface MessageDefinition {
  resourceType: "MessageDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  replaces?: Array<canonical>;
  status: code;
  experimental?: boolean;
  date: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  copyright?: markdown;
  base?: canonical;
  parent?: Array<canonical>;
  eventCoding?: Coding;
  eventUri?: uri;
  category?: code;
  focus?: Array<MessageDefinitionFocus>;
  responseRequired?: code;
  allowedResponse?: Array<MessageDefinitionAllowedResponse>;
  graph?: Array<canonical>;
}

export interface MessageHeaderDestination {
  resourceType: "MessageHeader"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name?: string;
  target?: Reference;
  endpoint: url;
  receiver?: Reference;
}
export interface MessageHeaderSource {
  resourceType: "MessageHeader"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name?: string;
  software?: string;
  version?: string;
  contact?: ContactPoint;
  endpoint: url;
}
export interface MessageHeaderResponse {
  resourceType: "MessageHeader"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier: id;
  code: code;
  details?: Reference;
}
export interface MessageHeader {
  resourceType: "MessageHeader"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  eventCoding?: Coding;
  eventUri?: uri;
  destination?: Array<MessageHeaderDestination>;
  sender?: Reference;
  enterer?: Reference;
  author?: Reference;
  source: MessageHeaderSource;
  responsible?: Reference;
  reason?: CodeableConcept;
  response?: MessageHeaderResponse;
  focus?: Array<Reference>;
  definition?: canonical;
}

export interface MolecularSequenceReferenceSeq {
  resourceType: "MolecularSequence"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  chromosome?: CodeableConcept;
  genomeBuild?: string;
  orientation?: code;
  referenceSeqId?: CodeableConcept;
  referenceSeqPointer?: Reference;
  referenceSeqString?: string;
  strand?: code;
  windowStart?: integer;
  windowEnd?: integer;
}
export interface MolecularSequenceVariant {
  resourceType: "MolecularSequence"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  start?: integer;
  end?: integer;
  observedAllele?: string;
  referenceAllele?: string;
  cigar?: string;
  variantPointer?: Reference;
}
export interface MolecularSequenceQualityRoc {
  resourceType: "MolecularSequence"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  score?: Array<integer>;
  numTP?: Array<integer>;
  numFP?: Array<integer>;
  numFN?: Array<integer>;
  precision?: Array<decimal>;
  sensitivity?: Array<decimal>;
  fMeasure?: Array<decimal>;
}
export interface MolecularSequenceQuality {
  resourceType: "MolecularSequence"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  standardSequence?: CodeableConcept;
  start?: integer;
  end?: integer;
  score?: Quantity;
  method?: CodeableConcept;
  truthTP?: decimal;
  queryTP?: decimal;
  truthFN?: decimal;
  queryFP?: decimal;
  gtFP?: decimal;
  precision?: decimal;
  recall?: decimal;
  fScore?: decimal;
  roc?: MolecularSequenceQualityRoc;
}
export interface MolecularSequenceRepository {
  resourceType: "MolecularSequence"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  url?: uri;
  name?: string;
  datasetId?: string;
  variantsetId?: string;
  readsetId?: string;
}
export interface MolecularSequenceStructureVariantOuter {
  resourceType: "MolecularSequence"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  start?: integer;
  end?: integer;
}
export interface MolecularSequenceStructureVariantInner {
  resourceType: "MolecularSequence"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  start?: integer;
  end?: integer;
}
export interface MolecularSequenceStructureVariant {
  resourceType: "MolecularSequence"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  variantType?: CodeableConcept;
  exact?: boolean;
  length?: integer;
  outer?: MolecularSequenceStructureVariantOuter;
  inner?: MolecularSequenceStructureVariantInner;
}
export interface MolecularSequence {
  resourceType: "MolecularSequence"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  type?: code;
  coordinateSystem: integer;
  patient?: Reference;
  specimen?: Reference;
  device?: Reference;
  performer?: Reference;
  quantity?: Quantity;
  referenceSeq?: MolecularSequenceReferenceSeq;
  variant?: Array<MolecularSequenceVariant>;
  observedSeq?: string;
  quality?: Array<MolecularSequenceQuality>;
  readCoverage?: integer;
  repository?: Array<MolecularSequenceRepository>;
  pointer?: Array<Reference>;
  structureVariant?: Array<MolecularSequenceStructureVariant>;
}

export interface NamingSystemUniqueId {
  resourceType: "NamingSystem"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  value: string;
  preferred?: boolean;
  comment?: string;
  period?: Period;
}
export interface NamingSystem {
  resourceType: "NamingSystem"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  status: code;
  kind: code;
  date: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  responsible?: string;
  type?: CodeableConcept;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  usage?: string;
  uniqueId: Array<NamingSystemUniqueId>;
}

export interface NutritionOrderOralDietNutrient {
  resourceType: "NutritionOrder"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  modifier?: CodeableConcept;
  amount?: Quantity;
}
export interface NutritionOrderOralDietTexture {
  resourceType: "NutritionOrder"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  modifier?: CodeableConcept;
  foodType?: CodeableConcept;
}
export interface NutritionOrderOralDiet {
  resourceType: "NutritionOrder"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: Array<CodeableConcept>;
  schedule?: Array<Timing>;
  nutrient?: Array<NutritionOrderOralDietNutrient>;
  texture?: Array<NutritionOrderOralDietTexture>;
  fluidConsistencyType?: Array<CodeableConcept>;
  instruction?: string;
}
export interface NutritionOrderSupplement {
  resourceType: "NutritionOrder"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  productName?: string;
  schedule?: Array<Timing>;
  quantity?: Quantity;
  instruction?: string;
}
export interface NutritionOrderEnteralFormulaAdministration {
  resourceType: "NutritionOrder"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  schedule?: Timing;
  quantity?: Quantity;
  rateQuantity?: Quantity;
  rateRatio?: Ratio;
}
export interface NutritionOrderEnteralFormula {
  resourceType: "NutritionOrder"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  baseFormulaType?: CodeableConcept;
  baseFormulaProductName?: string;
  additiveType?: CodeableConcept;
  additiveProductName?: string;
  caloricDensity?: Quantity;
  routeofAdministration?: CodeableConcept;
  administration?: Array<NutritionOrderEnteralFormulaAdministration>;
  maxVolumeToDeliver?: Quantity;
  administrationInstruction?: string;
}
export interface NutritionOrder {
  resourceType: "NutritionOrder"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  instantiatesCanonical?: Array<canonical>;
  instantiatesUri?: Array<uri>;
  instantiates?: Array<uri>;
  status: code;
  intent: code;
  patient: Reference;
  encounter?: Reference;
  dateTime: dateTime;
  orderer?: Reference;
  allergyIntolerance?: Array<Reference>;
  foodPreferenceModifier?: Array<CodeableConcept>;
  excludeFoodModifier?: Array<CodeableConcept>;
  oralDiet?: NutritionOrderOralDiet;
  supplement?: Array<NutritionOrderSupplement>;
  enteralFormula?: NutritionOrderEnteralFormula;
  note?: Array<Annotation>;
}

export interface ObservationReferenceRange {
  resourceType: "Observation"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  low?: Quantity;
  high?: Quantity;
  type?: CodeableConcept;
  appliesTo?: Array<CodeableConcept>;
  age?: Range;
  text?: string;
}
export interface ObservationComponent {
  resourceType: "Observation"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: integer;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueSampledData?: SampledData;
  valueTime?: time;
  valueDateTime?: dateTime;
  valuePeriod?: Period;
  dataAbsentReason?: CodeableConcept;
  interpretation?: Array<CodeableConcept>;
  referenceRange?: ObservationReferenceRange;
}
export interface Observation {
  resourceType: "Observation"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  basedOn?: Array<Reference>;
  partOf?: Array<Reference>;
  status: code;
  category?: Array<CodeableConcept>;
  code: CodeableConcept;
  subject?: Reference;
  focus?: Array<Reference>;
  encounter?: Reference;
  effectiveDateTime?: dateTime;
  effectivePeriod?: Period;
  effectiveTiming?: Timing;
  effectiveInstant?: instant;
  issued?: instant;
  performer?: Array<Reference>;
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: integer;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueSampledData?: SampledData;
  valueTime?: time;
  valueDateTime?: dateTime;
  valuePeriod?: Period;
  dataAbsentReason?: CodeableConcept;
  interpretation?: Array<CodeableConcept>;
  note?: Array<Annotation>;
  bodySite?: CodeableConcept;
  method?: CodeableConcept;
  specimen?: Reference;
  device?: Reference;
  referenceRange?: Array<ObservationReferenceRange>;
  hasMember?: Array<Reference>;
  derivedFrom?: Array<Reference>;
  component?: Array<ObservationComponent>;
}

export interface ObservationDefinitionQuantitativeDetails {
  resourceType: "ObservationDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  customaryUnit?: CodeableConcept;
  unit?: CodeableConcept;
  conversionFactor?: decimal;
  decimalPrecision?: integer;
}
export interface ObservationDefinitionQualifiedInterval {
  resourceType: "ObservationDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category?: code;
  range?: Range;
  context?: CodeableConcept;
  appliesTo?: Array<CodeableConcept>;
  gender?: code;
  age?: Range;
  gestationalAge?: Range;
  condition?: string;
}
export interface ObservationDefinition {
  resourceType: "ObservationDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category?: Array<CodeableConcept>;
  code: CodeableConcept;
  identifier?: Array<Identifier>;
  permittedDataType?: Array<code>;
  multipleResultsAllowed?: boolean;
  method?: CodeableConcept;
  preferredReportName?: string;
  quantitativeDetails?: ObservationDefinitionQuantitativeDetails;
  qualifiedInterval?: Array<ObservationDefinitionQualifiedInterval>;
  validCodedValueSet?: Reference;
  normalCodedValueSet?: Reference;
  abnormalCodedValueSet?: Reference;
  criticalCodedValueSet?: Reference;
}

export interface OperationDefinitionParameterBinding {
  resourceType: "OperationDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  strength: code;
  valueSet: canonical;
}
export interface OperationDefinitionParameterReferencedFrom {
  resourceType: "OperationDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  source: string;
  sourceId?: string;
}
export interface OperationDefinitionParameter {
  resourceType: "OperationDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: code;
  use: code;
  min: integer;
  max: string;
  documentation?: string;
  type?: code;
  targetProfile?: Array<canonical>;
  searchType?: code;
  binding?: OperationDefinitionParameterBinding;
  referencedFrom?: Array<OperationDefinitionParameterReferencedFrom>;
  part?: OperationDefinitionParameter;
}
export interface OperationDefinitionOverload {
  resourceType: "OperationDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  parameterName?: Array<string>;
  comment?: string;
}
export interface OperationDefinition {
  resourceType: "OperationDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  version?: string;
  name: string;
  title?: string;
  status: code;
  kind: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  affectsState?: boolean;
  code: code;
  comment?: markdown;
  base?: canonical;
  resource?: Array<code>;
  system: boolean;
  type: boolean;
  instance: boolean;
  inputProfile?: canonical;
  outputProfile?: canonical;
  parameter?: Array<OperationDefinitionParameter>;
  overload?: Array<OperationDefinitionOverload>;
}

export interface OperationOutcomeIssue {
  resourceType: "OperationOutcome"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  severity: code;
  code: code;
  details?: CodeableConcept;
  diagnostics?: string;
  location?: Array<string>;
  expression?: Array<string>;
}
export interface OperationOutcome {
  resourceType: "OperationOutcome"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  issue: Array<OperationOutcomeIssue>;
}

export interface OrganizationContact {
  resourceType: "Organization"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  purpose?: CodeableConcept;
  name?: HumanName;
  telecom?: Array<ContactPoint>;
  address?: Address;
}
export interface Organization {
  resourceType: "Organization"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  active?: boolean;
  type?: Array<CodeableConcept>;
  name?: string;
  alias?: Array<string>;
  telecom?: Array<ContactPoint>;
  address?: Array<Address>;
  partOf?: Reference;
  contact?: Array<OrganizationContact>;
  endpoint?: Array<Reference>;
}

export interface OrganizationAffiliation {
  resourceType: "OrganizationAffiliation"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  active?: boolean;
  period?: Period;
  organization?: Reference;
  participatingOrganization?: Reference;
  network?: Array<Reference>;
  code?: Array<CodeableConcept>;
  specialty?: Array<CodeableConcept>;
  location?: Array<Reference>;
  healthcareService?: Array<Reference>;
  telecom?: Array<ContactPoint>;
  endpoint?: Array<Reference>;
}

export interface ParametersParameter {
  resourceType: "Parameters"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  valueBase64Binary?: base64Binary;
  valueBoolean?: boolean;
  valueCanonical?: canonical;
  valueCode?: code;
  valueDate?: date;
  valueDateTime?: dateTime;
  valueDecimal?: decimal;
  valueId?: id;
  valueInstant?: instant;
  valueInteger?: integer;
  valueMarkdown?: markdown;
  valueOid?: oid;
  valuePositiveInt?: positiveInt;
  valueString?: string;
  valueTime?: time;
  valueUnsignedInt?: unsignedInt;
  valueUri?: uri;
  valueUrl?: url;
  valueUuid?: uuid;
  valueAddress?: Address;
  valueAge?: Age;
  valueAnnotation?: Annotation;
  valueAttachment?: Attachment;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueContactPoint?: ContactPoint;
  valueCount?: Count;
  valueDistance?: Distance;
  valueDuration?: Duration;
  valueHumanName?: HumanName;
  valueIdentifier?: Identifier;
  valueMoney?: Money;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueReference?: Reference;
  valueSampledData?: SampledData;
  valueSignature?: Signature;
  valueTiming?: Timing;
  valueContactDetail?: ContactDetail;
  valueContributor?: Contributor;
  valueDataRequirement?: DataRequirement;
  valueExpression?: Expression;
  valueParameterDefinition?: ParameterDefinition;
  valueRelatedArtifact?: RelatedArtifact;
  valueTriggerDefinition?: TriggerDefinition;
  valueUsageContext?: UsageContext;
  valueDosage?: Dosage;
  valueMeta?: Meta;
  resource?: Resource;
  part?: ParametersParameter;
}
export interface Parameters {
  resourceType: "Parameters"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  parameter?: Array<ParametersParameter>;
}

export interface PatientContact {
  resourceType: "Patient"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  relationship?: Array<CodeableConcept>;
  name?: HumanName;
  telecom?: Array<ContactPoint>;
  address?: Address;
  gender?: code;
  organization?: Reference;
  period?: Period;
}
export interface PatientCommunication {
  resourceType: "Patient"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  language: CodeableConcept;
  preferred?: boolean;
}
export interface PatientLink {
  resourceType: "Patient"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  other: Reference;
  type: code;
}
export interface Patient {
  resourceType: "Patient"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  active?: boolean;
  name?: Array<HumanName>;
  telecom?: Array<ContactPoint>;
  gender?: code;
  birthDate?: date;
  deceasedBoolean?: boolean;
  deceasedDateTime?: dateTime;
  address?: Array<Address>;
  maritalStatus?: CodeableConcept;
  multipleBirthBoolean?: boolean;
  multipleBirthInteger?: integer;
  photo?: Array<Attachment>;
  contact?: Array<PatientContact>;
  communication?: Array<PatientCommunication>;
  generalPractitioner?: Array<Reference>;
  managingOrganization?: Reference;
  link?: Array<PatientLink>;
}

export interface PaymentNotice {
  resourceType: "PaymentNotice"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  request?: Reference;
  response?: Reference;
  created: dateTime;
  provider?: Reference;
  payment: Reference;
  paymentDate?: date;
  payee?: Reference;
  recipient: Reference;
  amount: Money;
  paymentStatus?: CodeableConcept;
}

export interface PaymentReconciliationDetail {
  resourceType: "PaymentReconciliation"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  predecessor?: Identifier;
  type: CodeableConcept;
  request?: Reference;
  submitter?: Reference;
  response?: Reference;
  date?: date;
  responsible?: Reference;
  payee?: Reference;
  amount?: Money;
}
export interface PaymentReconciliationProcessNote {
  resourceType: "PaymentReconciliation"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: code;
  text?: string;
}
export interface PaymentReconciliation {
  resourceType: "PaymentReconciliation"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  period?: Period;
  created: dateTime;
  paymentIssuer?: Reference;
  request?: Reference;
  requestor?: Reference;
  outcome?: code;
  disposition?: string;
  paymentDate: date;
  paymentAmount: Money;
  paymentIdentifier?: Identifier;
  detail?: Array<PaymentReconciliationDetail>;
  formCode?: CodeableConcept;
  processNote?: Array<PaymentReconciliationProcessNote>;
}

export interface PersonLink {
  resourceType: "Person"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  target: Reference;
  assurance?: code;
}
export interface Person {
  resourceType: "Person"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  name?: Array<HumanName>;
  telecom?: Array<ContactPoint>;
  gender?: code;
  birthDate?: date;
  address?: Array<Address>;
  photo?: Attachment;
  managingOrganization?: Reference;
  active?: boolean;
  link?: Array<PersonLink>;
}

export interface PlanDefinitionGoalTarget {
  resourceType: "PlanDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  measure?: CodeableConcept;
  detailQuantity?: Quantity;
  detailRange?: Range;
  detailCodeableConcept?: CodeableConcept;
  due?: Duration;
}
export interface PlanDefinitionGoal {
  resourceType: "PlanDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category?: CodeableConcept;
  description: CodeableConcept;
  priority?: CodeableConcept;
  start?: CodeableConcept;
  addresses?: Array<CodeableConcept>;
  documentation?: Array<RelatedArtifact>;
  target?: Array<PlanDefinitionGoalTarget>;
}
export interface PlanDefinitionActionCondition {
  resourceType: "PlanDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  kind: code;
  expression?: Expression;
}
export interface PlanDefinitionActionRelatedAction {
  resourceType: "PlanDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  actionId: id;
  relationship: code;
  offsetDuration?: Duration;
  offsetRange?: Range;
}
export interface PlanDefinitionActionParticipant {
  resourceType: "PlanDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  role?: CodeableConcept;
}
export interface PlanDefinitionActionDynamicValue {
  resourceType: "PlanDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  path?: string;
  expression?: Expression;
}
export interface PlanDefinitionAction {
  resourceType: "PlanDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  prefix?: string;
  title?: string;
  description?: string;
  textEquivalent?: string;
  priority?: code;
  code?: Array<CodeableConcept>;
  reason?: Array<CodeableConcept>;
  documentation?: Array<RelatedArtifact>;
  goalId?: Array<id>;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  trigger?: Array<TriggerDefinition>;
  condition?: Array<PlanDefinitionActionCondition>;
  input?: Array<DataRequirement>;
  output?: Array<DataRequirement>;
  relatedAction?: Array<PlanDefinitionActionRelatedAction>;
  timingDateTime?: dateTime;
  timingAge?: Age;
  timingPeriod?: Period;
  timingDuration?: Duration;
  timingRange?: Range;
  timingTiming?: Timing;
  participant?: Array<PlanDefinitionActionParticipant>;
  type?: CodeableConcept;
  groupingBehavior?: code;
  selectionBehavior?: code;
  requiredBehavior?: code;
  precheckBehavior?: code;
  cardinalityBehavior?: code;
  definitionCanonical?: canonical;
  definitionUri?: uri;
  transform?: canonical;
  dynamicValue?: Array<PlanDefinitionActionDynamicValue>;
  action?: PlanDefinitionAction;
}
export interface PlanDefinition {
  resourceType: "PlanDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  type?: CodeableConcept;
  status: code;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  usage?: string;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  topic?: Array<CodeableConcept>;
  author?: Array<ContactDetail>;
  editor?: Array<ContactDetail>;
  reviewer?: Array<ContactDetail>;
  endorser?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  library?: Array<canonical>;
  goal?: Array<PlanDefinitionGoal>;
  action?: Array<PlanDefinitionAction>;
}

export interface PractitionerQualification {
  resourceType: "Practitioner"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  code: CodeableConcept;
  period?: Period;
  issuer?: Reference;
}
export interface Practitioner {
  resourceType: "Practitioner"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  active?: boolean;
  name?: Array<HumanName>;
  telecom?: Array<ContactPoint>;
  address?: Array<Address>;
  gender?: code;
  birthDate?: date;
  photo?: Array<Attachment>;
  qualification?: Array<PractitionerQualification>;
  communication?: Array<CodeableConcept>;
}

export interface PractitionerRoleAvailableTime {
  resourceType: "PractitionerRole"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  daysOfWeek?: Array<code>;
  allDay?: boolean;
  availableStartTime?: time;
  availableEndTime?: time;
}
export interface PractitionerRoleNotAvailable {
  resourceType: "PractitionerRole"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description: string;
  during?: Period;
}
export interface PractitionerRole {
  resourceType: "PractitionerRole"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  active?: boolean;
  period?: Period;
  practitioner?: Reference;
  organization?: Reference;
  code?: Array<CodeableConcept>;
  specialty?: Array<CodeableConcept>;
  location?: Array<Reference>;
  healthcareService?: Array<Reference>;
  telecom?: Array<ContactPoint>;
  availableTime?: Array<PractitionerRoleAvailableTime>;
  notAvailable?: Array<PractitionerRoleNotAvailable>;
  availabilityExceptions?: string;
  endpoint?: Array<Reference>;
}

export interface ProcedurePerformer {
  resourceType: "Procedure"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
  onBehalfOf?: Reference;
}
export interface ProcedureFocalDevice {
  resourceType: "Procedure"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action?: CodeableConcept;
  manipulated: Reference;
}
export interface Procedure {
  resourceType: "Procedure"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  instantiatesCanonical?: Array<canonical>;
  instantiatesUri?: Array<uri>;
  basedOn?: Array<Reference>;
  partOf?: Array<Reference>;
  status: code;
  statusReason?: CodeableConcept;
  category?: CodeableConcept;
  code?: CodeableConcept;
  subject: Reference;
  encounter?: Reference;
  performedDateTime?: dateTime;
  performedPeriod?: Period;
  performedString?: string;
  performedAge?: Age;
  performedRange?: Range;
  recorder?: Reference;
  asserter?: Reference;
  performer?: Array<ProcedurePerformer>;
  location?: Reference;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  bodySite?: Array<CodeableConcept>;
  outcome?: CodeableConcept;
  report?: Array<Reference>;
  complication?: Array<CodeableConcept>;
  complicationDetail?: Array<Reference>;
  followUp?: Array<CodeableConcept>;
  note?: Array<Annotation>;
  focalDevice?: Array<ProcedureFocalDevice>;
  usedReference?: Array<Reference>;
  usedCode?: Array<CodeableConcept>;
}

export interface ProvenanceAgent {
  resourceType: "Provenance"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  role?: Array<CodeableConcept>;
  who: Reference;
  onBehalfOf?: Reference;
}
export interface ProvenanceEntity {
  resourceType: "Provenance"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  role: code;
  what: Reference;
  agent?: ProvenanceAgent;
}
export interface Provenance {
  resourceType: "Provenance"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  target: Array<Reference>;
  occurredPeriod?: Period;
  occurredDateTime?: dateTime;
  recorded: instant;
  policy?: Array<uri>;
  location?: Reference;
  reason?: Array<CodeableConcept>;
  activity?: CodeableConcept;
  agent: Array<ProvenanceAgent>;
  entity?: Array<ProvenanceEntity>;
  signature?: Array<Signature>;
}

export interface QuestionnaireItemEnableWhen {
  resourceType: "Questionnaire"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  question: string;
  operator: code;
  answerBoolean?: boolean;
  answerDecimal?: decimal;
  answerInteger?: integer;
  answerDate?: date;
  answerDateTime?: dateTime;
  answerTime?: time;
  answerString?: string;
  answerCoding?: Coding;
  answerQuantity?: Quantity;
  answerReference?: Reference;
}
export interface QuestionnaireItemAnswerOption {
  resourceType: "Questionnaire"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  valueInteger?: integer;
  valueDate?: date;
  valueTime?: time;
  valueString?: string;
  valueCoding?: Coding;
  valueReference?: Reference;
  initialSelected?: boolean;
}
export interface QuestionnaireItemInitial {
  resourceType: "Questionnaire"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  valueBoolean?: boolean;
  valueDecimal?: decimal;
  valueInteger?: integer;
  valueDate?: date;
  valueDateTime?: dateTime;
  valueTime?: time;
  valueString?: string;
  valueUri?: uri;
  valueAttachment?: Attachment;
  valueCoding?: Coding;
  valueQuantity?: Quantity;
  valueReference?: Reference;
}
export interface QuestionnaireItem {
  resourceType: "Questionnaire"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  linkId: string;
  definition?: uri;
  code?: Array<Coding>;
  prefix?: string;
  text?: string;
  type: code;
  enableWhen?: Array<QuestionnaireItemEnableWhen>;
  enableBehavior?: code;
  required?: boolean;
  repeats?: boolean;
  readOnly?: boolean;
  maxLength?: integer;
  answerValueSet?: canonical;
  answerOption?: Array<QuestionnaireItemAnswerOption>;
  initial?: Array<QuestionnaireItemInitial>;
  item?: QuestionnaireItem;
}
export interface Questionnaire {
  resourceType: "Questionnaire"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  derivedFrom?: Array<canonical>;
  status: code;
  experimental?: boolean;
  subjectType?: Array<code>;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  code?: Array<Coding>;
  item?: Array<QuestionnaireItem>;
}

export interface QuestionnaireResponseItemAnswer {
  resourceType: "QuestionnaireResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  valueBoolean?: boolean;
  valueDecimal?: decimal;
  valueInteger?: integer;
  valueDate?: date;
  valueDateTime?: dateTime;
  valueTime?: time;
  valueString?: string;
  valueUri?: uri;
  valueAttachment?: Attachment;
  valueCoding?: Coding;
  valueQuantity?: Quantity;
  valueReference?: Reference;
  item?: QuestionnaireResponseItem;
}
export interface QuestionnaireResponseItem {
  resourceType: "QuestionnaireResponse"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  linkId: string;
  definition?: uri;
  text?: string;
  answer?: Array<QuestionnaireResponseItemAnswer>;
  item?: QuestionnaireResponseItem;
}
export interface QuestionnaireResponse {
  resourceType: "QuestionnaireResponse"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  basedOn?: Array<Reference>;
  partOf?: Array<Reference>;
  questionnaire?: canonical;
  status: code;
  subject?: Reference;
  encounter?: Reference;
  authored?: dateTime;
  author?: Reference;
  source?: Reference;
  item?: Array<QuestionnaireResponseItem>;
}

export interface RelatedPersonCommunication {
  resourceType: "RelatedPerson"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  language: CodeableConcept;
  preferred?: boolean;
}
export interface RelatedPerson {
  resourceType: "RelatedPerson"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  active?: boolean;
  patient: Reference;
  relationship?: Array<CodeableConcept>;
  name?: Array<HumanName>;
  telecom?: Array<ContactPoint>;
  gender?: code;
  birthDate?: date;
  address?: Array<Address>;
  photo?: Array<Attachment>;
  period?: Period;
  communication?: Array<RelatedPersonCommunication>;
}

export interface RequestGroupActionCondition {
  resourceType: "RequestGroup"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  kind: code;
  expression?: Expression;
}
export interface RequestGroupActionRelatedAction {
  resourceType: "RequestGroup"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  actionId: id;
  relationship: code;
  offsetDuration?: Duration;
  offsetRange?: Range;
}
export interface RequestGroupAction {
  resourceType: "RequestGroup"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  prefix?: string;
  title?: string;
  description?: string;
  textEquivalent?: string;
  priority?: code;
  code?: Array<CodeableConcept>;
  documentation?: Array<RelatedArtifact>;
  condition?: Array<RequestGroupActionCondition>;
  relatedAction?: Array<RequestGroupActionRelatedAction>;
  timingDateTime?: dateTime;
  timingAge?: Age;
  timingPeriod?: Period;
  timingDuration?: Duration;
  timingRange?: Range;
  timingTiming?: Timing;
  participant?: Array<Reference>;
  type?: CodeableConcept;
  groupingBehavior?: code;
  selectionBehavior?: code;
  requiredBehavior?: code;
  precheckBehavior?: code;
  cardinalityBehavior?: code;
  resource?: Reference;
  action?: RequestGroupAction;
}
export interface RequestGroup {
  resourceType: "RequestGroup"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  instantiatesCanonical?: Array<canonical>;
  instantiatesUri?: Array<uri>;
  basedOn?: Array<Reference>;
  replaces?: Array<Reference>;
  groupIdentifier?: Identifier;
  status: code;
  intent: code;
  priority?: code;
  code?: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  authoredOn?: dateTime;
  author?: Reference;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  note?: Array<Annotation>;
  action?: Array<RequestGroupAction>;
}

export interface ResearchDefinition {
  resourceType: "ResearchDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  shortTitle?: string;
  subtitle?: string;
  status: code;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  comment?: Array<string>;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  usage?: string;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  topic?: Array<CodeableConcept>;
  author?: Array<ContactDetail>;
  editor?: Array<ContactDetail>;
  reviewer?: Array<ContactDetail>;
  endorser?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  library?: Array<canonical>;
  population: Reference;
  exposure?: Reference;
  exposureAlternative?: Reference;
  outcome?: Reference;
}

export interface ResearchElementDefinitionCharacteristic {
  resourceType: "ResearchElementDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  definitionCodeableConcept?: CodeableConcept;
  definitionCanonical?: canonical;
  definitionExpression?: Expression;
  definitionDataRequirement?: DataRequirement;
  usageContext?: Array<UsageContext>;
  exclude?: boolean;
  unitOfMeasure?: CodeableConcept;
  studyEffectiveDescription?: string;
  studyEffectiveDateTime?: dateTime;
  studyEffectivePeriod?: Period;
  studyEffectiveDuration?: Duration;
  studyEffectiveTiming?: Timing;
  studyEffectiveTimeFromStart?: Duration;
  studyEffectiveGroupMeasure?: code;
  participantEffectiveDescription?: string;
  participantEffectiveDateTime?: dateTime;
  participantEffectivePeriod?: Period;
  participantEffectiveDuration?: Duration;
  participantEffectiveTiming?: Timing;
  participantEffectiveTimeFromStart?: Duration;
  participantEffectiveGroupMeasure?: code;
}
export interface ResearchElementDefinition {
  resourceType: "ResearchElementDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  shortTitle?: string;
  subtitle?: string;
  status: code;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  comment?: Array<string>;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  usage?: string;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  topic?: Array<CodeableConcept>;
  author?: Array<ContactDetail>;
  editor?: Array<ContactDetail>;
  reviewer?: Array<ContactDetail>;
  endorser?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  library?: Array<canonical>;
  type: code;
  variableType?: code;
  characteristic: Array<ResearchElementDefinitionCharacteristic>;
}

export interface ResearchStudyArm {
  resourceType: "ResearchStudy"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  type?: CodeableConcept;
  description?: string;
}
export interface ResearchStudyObjective {
  resourceType: "ResearchStudy"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name?: string;
  type?: CodeableConcept;
}
export interface ResearchStudy {
  resourceType: "ResearchStudy"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  title?: string;
  protocol?: Array<Reference>;
  partOf?: Array<Reference>;
  status: code;
  primaryPurposeType?: CodeableConcept;
  phase?: CodeableConcept;
  category?: Array<CodeableConcept>;
  focus?: Array<CodeableConcept>;
  condition?: Array<CodeableConcept>;
  contact?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  keyword?: Array<CodeableConcept>;
  location?: Array<CodeableConcept>;
  description?: markdown;
  enrollment?: Array<Reference>;
  period?: Period;
  sponsor?: Reference;
  principalInvestigator?: Reference;
  site?: Array<Reference>;
  reasonStopped?: CodeableConcept;
  note?: Array<Annotation>;
  arm?: Array<ResearchStudyArm>;
  objective?: Array<ResearchStudyObjective>;
}

export interface ResearchSubject {
  resourceType: "ResearchSubject"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  period?: Period;
  study: Reference;
  individual: Reference;
  assignedArm?: string;
  actualArm?: string;
  consent?: Reference;
}

export interface RiskAssessmentPrediction {
  resourceType: "RiskAssessment"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  outcome?: CodeableConcept;
  probabilityDecimal?: decimal;
  probabilityRange?: Range;
  qualitativeRisk?: CodeableConcept;
  relativeRisk?: decimal;
  whenPeriod?: Period;
  whenRange?: Range;
  rationale?: string;
}
export interface RiskAssessment {
  resourceType: "RiskAssessment"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  basedOn?: Reference;
  parent?: Reference;
  status: code;
  method?: CodeableConcept;
  code?: CodeableConcept;
  subject: Reference;
  encounter?: Reference;
  occurrenceDateTime?: dateTime;
  occurrencePeriod?: Period;
  condition?: Reference;
  performer?: Reference;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  basis?: Array<Reference>;
  prediction?: Array<RiskAssessmentPrediction>;
  mitigation?: string;
  note?: Array<Annotation>;
}

export interface RiskEvidenceSynthesisSampleSize {
  resourceType: "RiskEvidenceSynthesis"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  numberOfStudies?: integer;
  numberOfParticipants?: integer;
}
export interface RiskEvidenceSynthesisRiskEstimatePrecisionEstimate {
  resourceType: "RiskEvidenceSynthesis"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  level?: decimal;
  from?: decimal;
  to?: decimal;
}
export interface RiskEvidenceSynthesisRiskEstimate {
  resourceType: "RiskEvidenceSynthesis"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  type?: CodeableConcept;
  value?: decimal;
  unitOfMeasure?: CodeableConcept;
  denominatorCount?: integer;
  numeratorCount?: integer;
  precisionEstimate?: Array<RiskEvidenceSynthesisRiskEstimatePrecisionEstimate>;
}
export interface RiskEvidenceSynthesisCertaintyCertaintySubcomponent {
  resourceType: "RiskEvidenceSynthesis"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  rating?: Array<CodeableConcept>;
  note?: Array<Annotation>;
}
export interface RiskEvidenceSynthesisCertainty {
  resourceType: "RiskEvidenceSynthesis"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  rating?: Array<CodeableConcept>;
  note?: Array<Annotation>;
  certaintySubcomponent?: Array<RiskEvidenceSynthesisCertaintyCertaintySubcomponent>;
}
export interface RiskEvidenceSynthesis {
  resourceType: "RiskEvidenceSynthesis"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  status: code;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  note?: Array<Annotation>;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  copyright?: markdown;
  approvalDate?: date;
  lastReviewDate?: date;
  effectivePeriod?: Period;
  topic?: Array<CodeableConcept>;
  author?: Array<ContactDetail>;
  editor?: Array<ContactDetail>;
  reviewer?: Array<ContactDetail>;
  endorser?: Array<ContactDetail>;
  relatedArtifact?: Array<RelatedArtifact>;
  synthesisType?: CodeableConcept;
  studyType?: CodeableConcept;
  population: Reference;
  exposure?: Reference;
  outcome: Reference;
  sampleSize?: RiskEvidenceSynthesisSampleSize;
  riskEstimate?: RiskEvidenceSynthesisRiskEstimate;
  certainty?: Array<RiskEvidenceSynthesisCertainty>;
}

export interface Schedule {
  resourceType: "Schedule"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  active?: boolean;
  serviceCategory?: Array<CodeableConcept>;
  serviceType?: Array<CodeableConcept>;
  specialty?: Array<CodeableConcept>;
  actor: Array<Reference>;
  planningHorizon?: Period;
  comment?: string;
}

export interface SearchParameterComponent {
  resourceType: "SearchParameter"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  definition: canonical;
  expression: string;
}
export interface SearchParameter {
  resourceType: "SearchParameter"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url: uri;
  version?: string;
  name: string;
  derivedFrom?: canonical;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  code: code;
  base: Array<code>;
  type: code;
  expression?: string;
  xpath?: string;
  xpathUsage?: code;
  target?: Array<code>;
  multipleOr?: boolean;
  multipleAnd?: boolean;
  comparator?: Array<code>;
  modifier?: Array<code>;
  chain?: Array<string>;
  component?: Array<SearchParameterComponent>;
}

export interface ServiceRequest {
  resourceType: "ServiceRequest"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  instantiatesCanonical?: Array<canonical>;
  instantiatesUri?: Array<uri>;
  basedOn?: Array<Reference>;
  replaces?: Array<Reference>;
  requisition?: Identifier;
  status: code;
  intent: code;
  category?: Array<CodeableConcept>;
  priority?: code;
  doNotPerform?: boolean;
  code?: CodeableConcept;
  orderDetail?: Array<CodeableConcept>;
  quantityQuantity?: Quantity;
  quantityRatio?: Ratio;
  quantityRange?: Range;
  subject: Reference;
  encounter?: Reference;
  occurrenceDateTime?: dateTime;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  asNeededBoolean?: boolean;
  asNeededCodeableConcept?: CodeableConcept;
  authoredOn?: dateTime;
  requester?: Reference;
  performerType?: CodeableConcept;
  performer?: Array<Reference>;
  locationCode?: Array<CodeableConcept>;
  locationReference?: Array<Reference>;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  insurance?: Array<Reference>;
  supportingInfo?: Array<Reference>;
  specimen?: Array<Reference>;
  bodySite?: Array<CodeableConcept>;
  note?: Array<Annotation>;
  patientInstruction?: string;
  relevantHistory?: Array<Reference>;
}

export interface Slot {
  resourceType: "Slot"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  serviceCategory?: Array<CodeableConcept>;
  serviceType?: Array<CodeableConcept>;
  specialty?: Array<CodeableConcept>;
  appointmentType?: CodeableConcept;
  schedule: Reference;
  status: code;
  start: instant;
  end: instant;
  overbooked?: boolean;
  comment?: string;
}

export interface SpecimenCollection {
  resourceType: "Specimen"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  collector?: Reference;
  collectedDateTime?: dateTime;
  collectedPeriod?: Period;
  duration?: Duration;
  quantity?: Quantity;
  method?: CodeableConcept;
  bodySite?: CodeableConcept;
  fastingStatusCodeableConcept?: CodeableConcept;
  fastingStatusDuration?: Duration;
}
export interface SpecimenProcessing {
  resourceType: "Specimen"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  procedure?: CodeableConcept;
  additive?: Array<Reference>;
  timeDateTime?: dateTime;
  timePeriod?: Period;
}
export interface SpecimenContainer {
  resourceType: "Specimen"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  description?: string;
  type?: CodeableConcept;
  capacity?: Quantity;
  specimenQuantity?: Quantity;
  additiveCodeableConcept?: CodeableConcept;
  additiveReference?: Reference;
}
export interface Specimen {
  resourceType: "Specimen"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  accessionIdentifier?: Identifier;
  status?: code;
  type?: CodeableConcept;
  subject?: Reference;
  receivedTime?: dateTime;
  parent?: Array<Reference>;
  request?: Array<Reference>;
  collection?: SpecimenCollection;
  processing?: Array<SpecimenProcessing>;
  container?: Array<SpecimenContainer>;
  condition?: Array<CodeableConcept>;
  note?: Array<Annotation>;
}

export interface SpecimenDefinitionTypeTestedContainerAdditive {
  resourceType: "SpecimenDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  additiveCodeableConcept?: CodeableConcept;
  additiveReference?: Reference;
}
export interface SpecimenDefinitionTypeTestedContainer {
  resourceType: "SpecimenDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  material?: CodeableConcept;
  type?: CodeableConcept;
  cap?: CodeableConcept;
  description?: string;
  capacity?: Quantity;
  minimumVolumeQuantity?: Quantity;
  minimumVolumeString?: string;
  additive?: Array<SpecimenDefinitionTypeTestedContainerAdditive>;
  preparation?: string;
}
export interface SpecimenDefinitionTypeTestedHandling {
  resourceType: "SpecimenDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  temperatureQualifier?: CodeableConcept;
  temperatureRange?: Range;
  maxDuration?: Duration;
  instruction?: string;
}
export interface SpecimenDefinitionTypeTested {
  resourceType: "SpecimenDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  isDerived?: boolean;
  type?: CodeableConcept;
  preference: code;
  container?: SpecimenDefinitionTypeTestedContainer;
  requirement?: string;
  retentionTime?: Duration;
  rejectionCriterion?: Array<CodeableConcept>;
  handling?: Array<SpecimenDefinitionTypeTestedHandling>;
}
export interface SpecimenDefinition {
  resourceType: "SpecimenDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  typeCollected?: CodeableConcept;
  patientPreparation?: Array<CodeableConcept>;
  timeAspect?: string;
  collection?: Array<CodeableConcept>;
  typeTested?: Array<SpecimenDefinitionTypeTested>;
}

export interface StructureDefinitionMapping {
  resourceType: "StructureDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identity: id;
  uri?: uri;
  name?: string;
  comment?: string;
}
export interface StructureDefinitionContext {
  resourceType: "StructureDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  expression: string;
}
export interface StructureDefinitionSnapshot {
  resourceType: "StructureDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  element: Array<ElementDefinition>;
}
export interface StructureDefinitionDifferential {
  resourceType: "StructureDefinition"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  element: Array<ElementDefinition>;
}
export interface StructureDefinition {
  resourceType: "StructureDefinition"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name: string;
  title?: string;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  copyright?: markdown;
  keyword?: Array<Coding>;
  fhirVersion?: code;
  mapping?: Array<StructureDefinitionMapping>;
  kind: code;
  abstract: boolean;
  context?: Array<StructureDefinitionContext>;
  contextInvariant?: Array<string>;
  type: uri;
  baseDefinition?: canonical;
  derivation?: code;
  snapshot?: StructureDefinitionSnapshot;
  differential?: StructureDefinitionDifferential;
}

export interface StructureMapStructure {
  resourceType: "StructureMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url: canonical;
  mode: code;
  alias?: string;
  documentation?: string;
}
export interface StructureMapGroupInput {
  resourceType: "StructureMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: id;
  type?: string;
  mode: code;
  documentation?: string;
}
export interface StructureMapGroupRuleSource {
  resourceType: "StructureMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  context: id;
  min?: integer;
  max?: string;
  type?: string;
  defaultValueBase64Binary?: base64Binary;
  defaultValueBoolean?: boolean;
  defaultValueCanonical?: canonical;
  defaultValueCode?: code;
  defaultValueDate?: date;
  defaultValueDateTime?: dateTime;
  defaultValueDecimal?: decimal;
  defaultValueId?: id;
  defaultValueInstant?: instant;
  defaultValueInteger?: integer;
  defaultValueMarkdown?: markdown;
  defaultValueOid?: oid;
  defaultValuePositiveInt?: positiveInt;
  defaultValueString?: string;
  defaultValueTime?: time;
  defaultValueUnsignedInt?: unsignedInt;
  defaultValueUri?: uri;
  defaultValueUrl?: url;
  defaultValueUuid?: uuid;
  defaultValueAddress?: Address;
  defaultValueAge?: Age;
  defaultValueAnnotation?: Annotation;
  defaultValueAttachment?: Attachment;
  defaultValueCodeableConcept?: CodeableConcept;
  defaultValueCoding?: Coding;
  defaultValueContactPoint?: ContactPoint;
  defaultValueCount?: Count;
  defaultValueDistance?: Distance;
  defaultValueDuration?: Duration;
  defaultValueHumanName?: HumanName;
  defaultValueIdentifier?: Identifier;
  defaultValueMoney?: Money;
  defaultValuePeriod?: Period;
  defaultValueQuantity?: Quantity;
  defaultValueRange?: Range;
  defaultValueRatio?: Ratio;
  defaultValueReference?: Reference;
  defaultValueSampledData?: SampledData;
  defaultValueSignature?: Signature;
  defaultValueTiming?: Timing;
  defaultValueContactDetail?: ContactDetail;
  defaultValueContributor?: Contributor;
  defaultValueDataRequirement?: DataRequirement;
  defaultValueExpression?: Expression;
  defaultValueParameterDefinition?: ParameterDefinition;
  defaultValueRelatedArtifact?: RelatedArtifact;
  defaultValueTriggerDefinition?: TriggerDefinition;
  defaultValueUsageContext?: UsageContext;
  defaultValueDosage?: Dosage;
  defaultValueMeta?: Meta;
  element?: string;
  listMode?: code;
  variable?: id;
  condition?: string;
  check?: string;
  logMessage?: string;
}
export interface StructureMapGroupRuleTargetParameter {
  resourceType: "StructureMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  valueId?: id;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: integer;
  valueDecimal?: decimal;
}
export interface StructureMapGroupRuleTarget {
  resourceType: "StructureMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  context?: id;
  contextType?: code;
  element?: string;
  variable?: id;
  listMode?: Array<code>;
  listRuleId?: id;
  transform?: code;
  parameter?: Array<StructureMapGroupRuleTargetParameter>;
}
export interface StructureMapGroupRuleDependent {
  resourceType: "StructureMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: id;
  variable: Array<string>;
}
export interface StructureMapGroupRule {
  resourceType: "StructureMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: id;
  source: Array<StructureMapGroupRuleSource>;
  target?: Array<StructureMapGroupRuleTarget>;
  rule?: StructureMapGroupRule;
  dependent?: Array<StructureMapGroupRuleDependent>;
  documentation?: string;
}
export interface StructureMapGroup {
  resourceType: "StructureMap"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: id;
  extends?: id;
  typeMode: code;
  documentation?: string;
  input: Array<StructureMapGroupInput>;
  rule: Array<StructureMapGroupRule>;
}
export interface StructureMap {
  resourceType: "StructureMap"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name: string;
  title?: string;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  copyright?: markdown;
  structure?: Array<StructureMapStructure>;
  import?: Array<canonical>;
  group: Array<StructureMapGroup>;
}

export interface SubscriptionChannel {
  resourceType: "Subscription"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  endpoint?: url;
  payload?: code;
  header?: Array<string>;
}
export interface Subscription {
  resourceType: "Subscription"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  status: code;
  contact?: Array<ContactPoint>;
  end?: instant;
  reason: string;
  criteria: string;
  error?: string;
  channel: SubscriptionChannel;
}

export interface SubstanceInstance {
  resourceType: "Substance"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  expiry?: dateTime;
  quantity?: Quantity;
}
export interface SubstanceIngredient {
  resourceType: "Substance"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  quantity?: Ratio;
  substanceCodeableConcept?: CodeableConcept;
  substanceReference?: Reference;
}
export interface Substance {
  resourceType: "Substance"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status?: code;
  category?: Array<CodeableConcept>;
  code: CodeableConcept;
  description?: string;
  instance?: Array<SubstanceInstance>;
  ingredient?: Array<SubstanceIngredient>;
}

export interface SubstanceNucleicAcidSubunitLinkage {
  resourceType: "SubstanceNucleicAcid"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  connectivity?: string;
  identifier?: Identifier;
  name?: string;
  residueSite?: string;
}
export interface SubstanceNucleicAcidSubunitSugar {
  resourceType: "SubstanceNucleicAcid"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  name?: string;
  residueSite?: string;
}
export interface SubstanceNucleicAcidSubunit {
  resourceType: "SubstanceNucleicAcid"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  subunit?: integer;
  sequence?: string;
  length?: integer;
  sequenceAttachment?: Attachment;
  fivePrime?: CodeableConcept;
  threePrime?: CodeableConcept;
  linkage?: Array<SubstanceNucleicAcidSubunitLinkage>;
  sugar?: Array<SubstanceNucleicAcidSubunitSugar>;
}
export interface SubstanceNucleicAcid {
  resourceType: "SubstanceNucleicAcid"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequenceType?: CodeableConcept;
  numberOfSubunits?: integer;
  areaOfHybridisation?: string;
  oligoNucleotideType?: CodeableConcept;
  subunit?: Array<SubstanceNucleicAcidSubunit>;
}

export interface SubstancePolymerMonomerSetStartingMaterial {
  resourceType: "SubstancePolymer"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  material?: CodeableConcept;
  type?: CodeableConcept;
  isDefining?: boolean;
  amount?: SubstanceAmount;
}
export interface SubstancePolymerMonomerSet {
  resourceType: "SubstancePolymer"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  ratioType?: CodeableConcept;
  startingMaterial?: Array<SubstancePolymerMonomerSetStartingMaterial>;
}
export interface SubstancePolymerRepeatRepeatUnitDegreeOfPolymerisation {
  resourceType: "SubstancePolymer"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  degree?: CodeableConcept;
  amount?: SubstanceAmount;
}
export interface SubstancePolymerRepeatRepeatUnitStructuralRepresentation {
  resourceType: "SubstancePolymer"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  representation?: string;
  attachment?: Attachment;
}
export interface SubstancePolymerRepeatRepeatUnit {
  resourceType: "SubstancePolymer"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  orientationOfPolymerisation?: CodeableConcept;
  repeatUnit?: string;
  amount?: SubstanceAmount;
  degreeOfPolymerisation?: Array<SubstancePolymerRepeatRepeatUnitDegreeOfPolymerisation>;
  structuralRepresentation?: Array<SubstancePolymerRepeatRepeatUnitStructuralRepresentation>;
}
export interface SubstancePolymerRepeat {
  resourceType: "SubstancePolymer"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  numberOfUnits?: integer;
  averageMolecularFormula?: string;
  repeatUnitAmountType?: CodeableConcept;
  repeatUnit?: Array<SubstancePolymerRepeatRepeatUnit>;
}
export interface SubstancePolymer {
  resourceType: "SubstancePolymer"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  class?: CodeableConcept;
  geometry?: CodeableConcept;
  copolymerConnectivity?: Array<CodeableConcept>;
  modification?: Array<string>;
  monomerSet?: Array<SubstancePolymerMonomerSet>;
  repeat?: Array<SubstancePolymerRepeat>;
}

export interface SubstanceProteinSubunit {
  resourceType: "SubstanceProtein"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  subunit?: integer;
  sequence?: string;
  length?: integer;
  sequenceAttachment?: Attachment;
  nTerminalModificationId?: Identifier;
  nTerminalModification?: string;
  cTerminalModificationId?: Identifier;
  cTerminalModification?: string;
}
export interface SubstanceProtein {
  resourceType: "SubstanceProtein"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequenceType?: CodeableConcept;
  numberOfSubunits?: integer;
  disulfideLinkage?: Array<string>;
  subunit?: Array<SubstanceProteinSubunit>;
}

export interface SubstanceReferenceInformationGene {
  resourceType: "SubstanceReferenceInformation"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  geneSequenceOrigin?: CodeableConcept;
  gene?: CodeableConcept;
  source?: Array<Reference>;
}
export interface SubstanceReferenceInformationGeneElement {
  resourceType: "SubstanceReferenceInformation"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  element?: Identifier;
  source?: Array<Reference>;
}
export interface SubstanceReferenceInformationClassification {
  resourceType: "SubstanceReferenceInformation"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  domain?: CodeableConcept;
  classification?: CodeableConcept;
  subtype?: Array<CodeableConcept>;
  source?: Array<Reference>;
}
export interface SubstanceReferenceInformationTarget {
  resourceType: "SubstanceReferenceInformation"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  target?: Identifier;
  type?: CodeableConcept;
  interaction?: CodeableConcept;
  organism?: CodeableConcept;
  organismType?: CodeableConcept;
  amountQuantity?: Quantity;
  amountRange?: Range;
  amountString?: string;
  amountType?: CodeableConcept;
  source?: Array<Reference>;
}
export interface SubstanceReferenceInformation {
  resourceType: "SubstanceReferenceInformation"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  comment?: string;
  gene?: Array<SubstanceReferenceInformationGene>;
  geneElement?: Array<SubstanceReferenceInformationGeneElement>;
  classification?: Array<SubstanceReferenceInformationClassification>;
  target?: Array<SubstanceReferenceInformationTarget>;
}

export interface SubstanceSourceMaterialFractionDescription {
  resourceType: "SubstanceSourceMaterial"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  fraction?: string;
  materialType?: CodeableConcept;
}
export interface SubstanceSourceMaterialOrganismAuthor {
  resourceType: "SubstanceSourceMaterial"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  authorType?: CodeableConcept;
  authorDescription?: string;
}
export interface SubstanceSourceMaterialOrganismHybrid {
  resourceType: "SubstanceSourceMaterial"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  maternalOrganismId?: string;
  maternalOrganismName?: string;
  paternalOrganismId?: string;
  paternalOrganismName?: string;
  hybridType?: CodeableConcept;
}
export interface SubstanceSourceMaterialOrganismOrganismGeneral {
  resourceType: "SubstanceSourceMaterial"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  kingdom?: CodeableConcept;
  phylum?: CodeableConcept;
  class?: CodeableConcept;
  order?: CodeableConcept;
}
export interface SubstanceSourceMaterialOrganism {
  resourceType: "SubstanceSourceMaterial"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  family?: CodeableConcept;
  genus?: CodeableConcept;
  species?: CodeableConcept;
  intraspecificType?: CodeableConcept;
  intraspecificDescription?: string;
  author?: Array<SubstanceSourceMaterialOrganismAuthor>;
  hybrid?: SubstanceSourceMaterialOrganismHybrid;
  organismGeneral?: SubstanceSourceMaterialOrganismOrganismGeneral;
}
export interface SubstanceSourceMaterialPartDescription {
  resourceType: "SubstanceSourceMaterial"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  part?: CodeableConcept;
  partLocation?: CodeableConcept;
}
export interface SubstanceSourceMaterial {
  resourceType: "SubstanceSourceMaterial"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sourceMaterialClass?: CodeableConcept;
  sourceMaterialType?: CodeableConcept;
  sourceMaterialState?: CodeableConcept;
  organismId?: Identifier;
  organismName?: string;
  parentSubstanceId?: Array<Identifier>;
  parentSubstanceName?: Array<string>;
  countryOfOrigin?: Array<CodeableConcept>;
  geographicalLocation?: Array<string>;
  developmentStage?: CodeableConcept;
  fractionDescription?: Array<SubstanceSourceMaterialFractionDescription>;
  organism?: SubstanceSourceMaterialOrganism;
  partDescription?: Array<SubstanceSourceMaterialPartDescription>;
}

export interface SubstanceSpecificationMoiety {
  resourceType: "SubstanceSpecification"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  role?: CodeableConcept;
  identifier?: Identifier;
  name?: string;
  stereochemistry?: CodeableConcept;
  opticalActivity?: CodeableConcept;
  molecularFormula?: string;
  amountQuantity?: Quantity;
  amountString?: string;
}
export interface SubstanceSpecificationProperty {
  resourceType: "SubstanceSpecification"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category?: CodeableConcept;
  code?: CodeableConcept;
  parameters?: string;
  definingSubstanceReference?: Reference;
  definingSubstanceCodeableConcept?: CodeableConcept;
  amountQuantity?: Quantity;
  amountString?: string;
}
export interface SubstanceSpecificationStructureIsotopeMolecularWeight {
  resourceType: "SubstanceSpecification"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  method?: CodeableConcept;
  type?: CodeableConcept;
  amount?: Quantity;
}
export interface SubstanceSpecificationStructureIsotope {
  resourceType: "SubstanceSpecification"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  name?: CodeableConcept;
  substitution?: CodeableConcept;
  halfLife?: Quantity;
  molecularWeight?: SubstanceSpecificationStructureIsotopeMolecularWeight;
}
export interface SubstanceSpecificationStructureRepresentation {
  resourceType: "SubstanceSpecification"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  representation?: string;
  attachment?: Attachment;
}
export interface SubstanceSpecificationStructure {
  resourceType: "SubstanceSpecification"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  stereochemistry?: CodeableConcept;
  opticalActivity?: CodeableConcept;
  molecularFormula?: string;
  molecularFormulaByMoiety?: string;
  isotope?: Array<SubstanceSpecificationStructureIsotope>;
  molecularWeight?: SubstanceSpecificationStructureIsotopeMolecularWeight;
  source?: Array<Reference>;
  representation?: Array<SubstanceSpecificationStructureRepresentation>;
}
export interface SubstanceSpecificationCode {
  resourceType: "SubstanceSpecification"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  status?: CodeableConcept;
  statusDate?: dateTime;
  comment?: string;
  source?: Array<Reference>;
}
export interface SubstanceSpecificationNameOfficial {
  resourceType: "SubstanceSpecification"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  authority?: CodeableConcept;
  status?: CodeableConcept;
  date?: dateTime;
}
export interface SubstanceSpecificationName {
  resourceType: "SubstanceSpecification"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  type?: CodeableConcept;
  status?: CodeableConcept;
  preferred?: boolean;
  language?: Array<CodeableConcept>;
  domain?: Array<CodeableConcept>;
  jurisdiction?: Array<CodeableConcept>;
  synonym?: SubstanceSpecificationName;
  translation?: SubstanceSpecificationName;
  official?: Array<SubstanceSpecificationNameOfficial>;
  source?: Array<Reference>;
}
export interface SubstanceSpecificationRelationship {
  resourceType: "SubstanceSpecification"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  substanceReference?: Reference;
  substanceCodeableConcept?: CodeableConcept;
  relationship?: CodeableConcept;
  isDefining?: boolean;
  amountQuantity?: Quantity;
  amountRange?: Range;
  amountRatio?: Ratio;
  amountString?: string;
  amountRatioLowLimit?: Ratio;
  amountType?: CodeableConcept;
  source?: Array<Reference>;
}
export interface SubstanceSpecification {
  resourceType: "SubstanceSpecification"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  type?: CodeableConcept;
  status?: CodeableConcept;
  domain?: CodeableConcept;
  description?: string;
  source?: Array<Reference>;
  comment?: string;
  moiety?: Array<SubstanceSpecificationMoiety>;
  property?: Array<SubstanceSpecificationProperty>;
  referenceInformation?: Reference;
  structure?: SubstanceSpecificationStructure;
  code?: Array<SubstanceSpecificationCode>;
  name?: Array<SubstanceSpecificationName>;
  molecularWeight?: SubstanceSpecificationStructureIsotopeMolecularWeight;
  relationship?: Array<SubstanceSpecificationRelationship>;
  nucleicAcid?: Reference;
  polymer?: Reference;
  protein?: Reference;
  sourceMaterial?: Reference;
}

export interface SupplyDeliverySuppliedItem {
  resourceType: "SupplyDelivery"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  quantity?: Quantity;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
}
export interface SupplyDelivery {
  resourceType: "SupplyDelivery"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  basedOn?: Array<Reference>;
  partOf?: Array<Reference>;
  status?: code;
  patient?: Reference;
  type?: CodeableConcept;
  suppliedItem?: SupplyDeliverySuppliedItem;
  occurrenceDateTime?: dateTime;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  supplier?: Reference;
  destination?: Reference;
  receiver?: Array<Reference>;
}

export interface SupplyRequestParameter {
  resourceType: "SupplyRequest"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueBoolean?: boolean;
}
export interface SupplyRequest {
  resourceType: "SupplyRequest"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status?: code;
  category?: CodeableConcept;
  priority?: code;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  quantity: Quantity;
  parameter?: Array<SupplyRequestParameter>;
  occurrenceDateTime?: dateTime;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  authoredOn?: dateTime;
  requester?: Reference;
  supplier?: Array<Reference>;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  deliverFrom?: Reference;
  deliverTo?: Reference;
}

export interface TaskRestriction {
  resourceType: "Task"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  repetitions?: positiveInt;
  period?: Period;
  recipient?: Array<Reference>;
}
export interface TaskInput {
  resourceType: "Task"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  valueBase64Binary?: base64Binary;
  valueBoolean?: boolean;
  valueCanonical?: canonical;
  valueCode?: code;
  valueDate?: date;
  valueDateTime?: dateTime;
  valueDecimal?: decimal;
  valueId?: id;
  valueInstant?: instant;
  valueInteger?: integer;
  valueMarkdown?: markdown;
  valueOid?: oid;
  valuePositiveInt?: positiveInt;
  valueString?: string;
  valueTime?: time;
  valueUnsignedInt?: unsignedInt;
  valueUri?: uri;
  valueUrl?: url;
  valueUuid?: uuid;
  valueAddress?: Address;
  valueAge?: Age;
  valueAnnotation?: Annotation;
  valueAttachment?: Attachment;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueContactPoint?: ContactPoint;
  valueCount?: Count;
  valueDistance?: Distance;
  valueDuration?: Duration;
  valueHumanName?: HumanName;
  valueIdentifier?: Identifier;
  valueMoney?: Money;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueReference?: Reference;
  valueSampledData?: SampledData;
  valueSignature?: Signature;
  valueTiming?: Timing;
  valueContactDetail?: ContactDetail;
  valueContributor?: Contributor;
  valueDataRequirement?: DataRequirement;
  valueExpression?: Expression;
  valueParameterDefinition?: ParameterDefinition;
  valueRelatedArtifact?: RelatedArtifact;
  valueTriggerDefinition?: TriggerDefinition;
  valueUsageContext?: UsageContext;
  valueDosage?: Dosage;
  valueMeta?: Meta;
}
export interface TaskOutput {
  resourceType: "Task"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  valueBase64Binary?: base64Binary;
  valueBoolean?: boolean;
  valueCanonical?: canonical;
  valueCode?: code;
  valueDate?: date;
  valueDateTime?: dateTime;
  valueDecimal?: decimal;
  valueId?: id;
  valueInstant?: instant;
  valueInteger?: integer;
  valueMarkdown?: markdown;
  valueOid?: oid;
  valuePositiveInt?: positiveInt;
  valueString?: string;
  valueTime?: time;
  valueUnsignedInt?: unsignedInt;
  valueUri?: uri;
  valueUrl?: url;
  valueUuid?: uuid;
  valueAddress?: Address;
  valueAge?: Age;
  valueAnnotation?: Annotation;
  valueAttachment?: Attachment;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueContactPoint?: ContactPoint;
  valueCount?: Count;
  valueDistance?: Distance;
  valueDuration?: Duration;
  valueHumanName?: HumanName;
  valueIdentifier?: Identifier;
  valueMoney?: Money;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueReference?: Reference;
  valueSampledData?: SampledData;
  valueSignature?: Signature;
  valueTiming?: Timing;
  valueContactDetail?: ContactDetail;
  valueContributor?: Contributor;
  valueDataRequirement?: DataRequirement;
  valueExpression?: Expression;
  valueParameterDefinition?: ParameterDefinition;
  valueRelatedArtifact?: RelatedArtifact;
  valueTriggerDefinition?: TriggerDefinition;
  valueUsageContext?: UsageContext;
  valueDosage?: Dosage;
  valueMeta?: Meta;
}
export interface Task {
  resourceType: "Task"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  instantiatesCanonical?: canonical;
  instantiatesUri?: uri;
  basedOn?: Array<Reference>;
  groupIdentifier?: Identifier;
  partOf?: Array<Reference>;
  status: code;
  statusReason?: CodeableConcept;
  businessStatus?: CodeableConcept;
  intent: code;
  priority?: code;
  code?: CodeableConcept;
  description?: string;
  focus?: Reference;
  for?: Reference;
  encounter?: Reference;
  executionPeriod?: Period;
  authoredOn?: dateTime;
  lastModified?: dateTime;
  requester?: Reference;
  performerType?: Array<CodeableConcept>;
  owner?: Reference;
  location?: Reference;
  reasonCode?: CodeableConcept;
  reasonReference?: Reference;
  insurance?: Array<Reference>;
  note?: Array<Annotation>;
  relevantHistory?: Array<Reference>;
  restriction?: TaskRestriction;
  input?: Array<TaskInput>;
  output?: Array<TaskOutput>;
}

export interface TerminologyCapabilitiesSoftware {
  resourceType: "TerminologyCapabilities"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  version?: string;
}
export interface TerminologyCapabilitiesImplementation {
  resourceType: "TerminologyCapabilities"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description: string;
  url?: url;
}
export interface TerminologyCapabilitiesCodeSystemVersionFilter {
  resourceType: "TerminologyCapabilities"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  op: Array<code>;
}
export interface TerminologyCapabilitiesCodeSystemVersion {
  resourceType: "TerminologyCapabilities"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: string;
  isDefault?: boolean;
  compositional?: boolean;
  language?: Array<code>;
  filter?: Array<TerminologyCapabilitiesCodeSystemVersionFilter>;
  property?: Array<code>;
}
export interface TerminologyCapabilitiesCodeSystem {
  resourceType: "TerminologyCapabilities"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  uri?: canonical;
  version?: Array<TerminologyCapabilitiesCodeSystemVersion>;
  subsumption?: boolean;
}
export interface TerminologyCapabilitiesExpansionParameter {
  resourceType: "TerminologyCapabilities"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: code;
  documentation?: string;
}
export interface TerminologyCapabilitiesExpansion {
  resourceType: "TerminologyCapabilities"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  hierarchical?: boolean;
  paging?: boolean;
  incomplete?: boolean;
  parameter?: Array<TerminologyCapabilitiesExpansionParameter>;
  textFilter?: markdown;
}
export interface TerminologyCapabilitiesValidateCode {
  resourceType: "TerminologyCapabilities"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  translations: boolean;
}
export interface TerminologyCapabilitiesTranslation {
  resourceType: "TerminologyCapabilities"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  needsMap: boolean;
}
export interface TerminologyCapabilitiesClosure {
  resourceType: "TerminologyCapabilities"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  translation?: boolean;
}
export interface TerminologyCapabilities {
  resourceType: "TerminologyCapabilities"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  version?: string;
  name?: string;
  title?: string;
  status: code;
  experimental?: boolean;
  date: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  copyright?: markdown;
  kind: code;
  software?: TerminologyCapabilitiesSoftware;
  implementation?: TerminologyCapabilitiesImplementation;
  lockedDate?: boolean;
  codeSystem?: Array<TerminologyCapabilitiesCodeSystem>;
  expansion?: TerminologyCapabilitiesExpansion;
  codeSearch?: code;
  validateCode?: TerminologyCapabilitiesValidateCode;
  translation?: TerminologyCapabilitiesTranslation;
  closure?: TerminologyCapabilitiesClosure;
}

export interface TestReportParticipant {
  resourceType: "TestReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  uri: uri;
  display?: string;
}
export interface TestReportSetupActionOperation {
  resourceType: "TestReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  result: code;
  message?: markdown;
  detail?: uri;
}
export interface TestReportSetupActionAssert {
  resourceType: "TestReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  result: code;
  message?: markdown;
  detail?: string;
}
export interface TestReportSetupAction {
  resourceType: "TestReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation?: TestReportSetupActionOperation;
  assert?: TestReportSetupActionAssert;
}
export interface TestReportSetup {
  resourceType: "TestReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action: Array<TestReportSetupAction>;
}
export interface TestReportTestAction {
  resourceType: "TestReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation?: TestReportSetupActionOperation;
  assert?: TestReportSetupActionAssert;
}
export interface TestReportTest {
  resourceType: "TestReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name?: string;
  description?: string;
  action: Array<TestReportTestAction>;
}
export interface TestReportTeardownAction {
  resourceType: "TestReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation: TestReportSetupActionOperation;
}
export interface TestReportTeardown {
  resourceType: "TestReport"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action: Array<TestReportTeardownAction>;
}
export interface TestReport {
  resourceType: "TestReport"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  name?: string;
  status: code;
  testScript: Reference;
  result: code;
  score?: decimal;
  tester?: string;
  issued?: dateTime;
  participant?: Array<TestReportParticipant>;
  setup?: TestReportSetup;
  test?: Array<TestReportTest>;
  teardown?: TestReportTeardown;
}

export interface TestScriptOrigin {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  index: integer;
  profile: Coding;
}
export interface TestScriptDestination {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  index: integer;
  profile: Coding;
}
export interface TestScriptMetadataLink {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url: uri;
  description?: string;
}
export interface TestScriptMetadataCapability {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  required: boolean;
  validated: boolean;
  description?: string;
  origin?: Array<integer>;
  destination?: integer;
  link?: Array<uri>;
  capabilities: canonical;
}
export interface TestScriptMetadata {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  link?: Array<TestScriptMetadataLink>;
  capability: Array<TestScriptMetadataCapability>;
}
export interface TestScriptFixture {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  autocreate: boolean;
  autodelete: boolean;
  resource?: Reference;
}
export interface TestScriptVariable {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  defaultValue?: string;
  description?: string;
  expression?: string;
  headerField?: string;
  hint?: string;
  path?: string;
  sourceId?: id;
}
export interface TestScriptSetupActionOperationRequestHeader {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  field: string;
  value: string;
}
export interface TestScriptSetupActionOperation {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: Coding;
  resource?: code;
  label?: string;
  description?: string;
  accept?: code;
  contentType?: code;
  destination?: integer;
  encodeRequestUrl: boolean;
  method?: code;
  origin?: integer;
  params?: string;
  requestHeader?: Array<TestScriptSetupActionOperationRequestHeader>;
  requestId?: id;
  responseId?: id;
  sourceId?: id;
  targetId?: id;
  url?: string;
}
export interface TestScriptSetupActionAssert {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  label?: string;
  description?: string;
  direction?: code;
  compareToSourceId?: string;
  compareToSourceExpression?: string;
  compareToSourcePath?: string;
  contentType?: code;
  expression?: string;
  headerField?: string;
  minimumId?: string;
  navigationLinks?: boolean;
  operator?: code;
  path?: string;
  requestMethod?: code;
  requestURL?: string;
  resource?: code;
  response?: code;
  responseCode?: string;
  sourceId?: id;
  validateProfileId?: id;
  value?: string;
  warningOnly: boolean;
}
export interface TestScriptSetupAction {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation?: TestScriptSetupActionOperation;
  assert?: TestScriptSetupActionAssert;
}
export interface TestScriptSetup {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action: Array<TestScriptSetupAction>;
}
export interface TestScriptTestAction {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation?: TestScriptSetupActionOperation;
  assert?: TestScriptSetupActionAssert;
}
export interface TestScriptTest {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name?: string;
  description?: string;
  action: Array<TestScriptTestAction>;
}
export interface TestScriptTeardownAction {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation: TestScriptSetupActionOperation;
}
export interface TestScriptTeardown {
  resourceType: "TestScript"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action: Array<TestScriptTeardownAction>;
}
export interface TestScript {
  resourceType: "TestScript"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url: uri;
  identifier?: Identifier;
  version?: string;
  name: string;
  title?: string;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: markdown;
  copyright?: markdown;
  origin?: Array<TestScriptOrigin>;
  destination?: Array<TestScriptDestination>;
  metadata?: TestScriptMetadata;
  fixture?: Array<TestScriptFixture>;
  profile?: Array<Reference>;
  variable?: Array<TestScriptVariable>;
  setup?: TestScriptSetup;
  test?: Array<TestScriptTest>;
  teardown?: TestScriptTeardown;
}

export interface ValueSetComposeIncludeConceptDesignation {
  resourceType: "ValueSet"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  language?: code;
  use?: Coding;
  value: string;
}
export interface ValueSetComposeIncludeConcept {
  resourceType: "ValueSet"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  display?: string;
  designation?: Array<ValueSetComposeIncludeConceptDesignation>;
}
export interface ValueSetComposeIncludeFilter {
  resourceType: "ValueSet"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  property: code;
  op: code;
  value: string;
}
export interface ValueSetComposeInclude {
  resourceType: "ValueSet"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  system?: uri;
  version?: string;
  concept?: Array<ValueSetComposeIncludeConcept>;
  filter?: Array<ValueSetComposeIncludeFilter>;
  valueSet?: Array<canonical>;
}
export interface ValueSetCompose {
  resourceType: "ValueSet"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  lockedDate?: date;
  inactive?: boolean;
  include: Array<ValueSetComposeInclude>;
  exclude?: ValueSetComposeInclude;
}
export interface ValueSetExpansionParameter {
  resourceType: "ValueSet"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: integer;
  valueDecimal?: decimal;
  valueUri?: uri;
  valueCode?: code;
  valueDateTime?: dateTime;
}
export interface ValueSetExpansionContains {
  resourceType: "ValueSet"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  system?: uri;
  abstract?: boolean;
  inactive?: boolean;
  version?: string;
  code?: code;
  display?: string;
  designation?: ValueSetComposeIncludeConceptDesignation;
  contains?: ValueSetExpansionContains;
}
export interface ValueSetExpansion {
  resourceType: "ValueSet"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: uri;
  timestamp: dateTime;
  total?: integer;
  offset?: integer;
  parameter?: Array<ValueSetExpansionParameter>;
  contains?: Array<ValueSetExpansionContains>;
}
export interface ValueSet {
  resourceType: "ValueSet"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url?: uri;
  identifier?: Array<Identifier>;
  version?: string;
  name?: string;
  title?: string;
  status: code;
  experimental?: boolean;
  date?: dateTime;
  publisher?: string;
  contact?: Array<ContactDetail>;
  description?: markdown;
  useContext?: Array<UsageContext>;
  jurisdiction?: Array<CodeableConcept>;
  immutable?: boolean;
  purpose?: markdown;
  copyright?: markdown;
  compose?: ValueSetCompose;
  expansion?: ValueSetExpansion;
}

export interface VerificationResultPrimarySource {
  resourceType: "VerificationResult"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  who?: Reference;
  type?: Array<CodeableConcept>;
  communicationMethod?: Array<CodeableConcept>;
  validationStatus?: CodeableConcept;
  validationDate?: dateTime;
  canPushUpdates?: CodeableConcept;
  pushTypeAvailable?: Array<CodeableConcept>;
}
export interface VerificationResultAttestation {
  resourceType: "VerificationResult"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  who?: Reference;
  onBehalfOf?: Reference;
  communicationMethod?: CodeableConcept;
  date?: date;
  sourceIdentityCertificate?: string;
  proxyIdentityCertificate?: string;
  proxySignature?: Signature;
  sourceSignature?: Signature;
}
export interface VerificationResultValidator {
  resourceType: "VerificationResult"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  organization: Reference;
  identityCertificate?: string;
  attestationSignature?: Signature;
}
export interface VerificationResult {
  resourceType: "VerificationResult"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  target?: Array<Reference>;
  targetLocation?: Array<string>;
  need?: CodeableConcept;
  status: code;
  statusDate?: dateTime;
  validationType?: CodeableConcept;
  validationProcess?: Array<CodeableConcept>;
  frequency?: Timing;
  lastPerformed?: dateTime;
  nextScheduled?: date;
  failureAction?: CodeableConcept;
  primarySource?: Array<VerificationResultPrimarySource>;
  attestation?: VerificationResultAttestation;
  validator?: Array<VerificationResultValidator>;
}

export interface VisionPrescriptionLensSpecificationPrism {
  resourceType: "VisionPrescription"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  amount: decimal;
  base: code;
}
export interface VisionPrescriptionLensSpecification {
  resourceType: "VisionPrescription"
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  product: CodeableConcept;
  eye: code;
  sphere?: decimal;
  cylinder?: decimal;
  axis?: integer;
  prism?: Array<VisionPrescriptionLensSpecificationPrism>;
  add?: decimal;
  power?: decimal;
  backCurve?: decimal;
  diameter?: decimal;
  duration?: Quantity;
  color?: string;
  brand?: string;
  note?: Array<Annotation>;
}
export interface VisionPrescription {
  resourceType: "VisionPrescription"
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  status: code;
  created: dateTime;
  patient: Reference;
  encounter?: Reference;
  dateWritten: dateTime;
  prescriber: Reference;
  lensSpecification: Array<VisionPrescriptionLensSpecification>;
}