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

export interface Element {
  id?: string;
  extension?: Array<Extension>;
}

export interface BackboneElement {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
}

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
  codeFilter?: DataRequirementCodeFilter;
  dateFilter?: DataRequirementDateFilter;
  limit?: positiveInt;
  sort?: DataRequirementSort;
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
  doseAndRate?: DosageDoseAndRate;
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
  discriminator?: ElementDefinitionSlicingDiscriminator;
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
  type?: ElementDefinitionType;
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
  example?: ElementDefinitionExample;
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
  constraint?: ElementDefinitionConstraint;
  mustSupport?: boolean;
  isModifier?: boolean;
  isModifierReason?: string;
  isSummary?: boolean;
  binding?: ElementDefinitionBinding;
  mapping?: ElementDefinitionMapping;
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

export interface Resource {
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
}

export interface AccountCoverage {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  coverage: Reference;
  priority?: positiveInt;
}
export interface AccountGuarantor {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  party: Reference;
  onHold?: boolean;
  period?: Period;
}
export interface Account {
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
  coverage?: AccountCoverage;
  owner?: Reference;
  description?: string;
  guarantor?: AccountGuarantor;
  partOf?: Reference;
}

export interface ActivityDefinitionParticipant {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  role?: CodeableConcept;
}
export interface ActivityDefinitionDynamicValue {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  path: string;
  expression: Expression;
}
export interface ActivityDefinition {
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
  participant?: ActivityDefinitionParticipant;
  productReference?: Reference;
  productCodeableConcept?: CodeableConcept;
  quantity?: Quantity;
  dosage?: Array<Dosage>;
  bodySite?: Array<CodeableConcept>;
  specimenRequirement?: Array<Reference>;
  observationRequirement?: Array<Reference>;
  observationResultRequirement?: Array<Reference>;
  transform?: canonical;
  dynamicValue?: ActivityDefinitionDynamicValue;
}

export interface AdverseEventSuspectEntityCausality {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  assessment?: CodeableConcept;
  productRelatedness?: string;
  author?: Reference;
  method?: CodeableConcept;
}
export interface AdverseEventSuspectEntity {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  instance: Reference;
  causality?: AdverseEventSuspectEntityCausality;
}
export interface AdverseEvent {
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
  suspectEntity?: AdverseEventSuspectEntity;
  subjectMedicalHistory?: Array<Reference>;
  referenceDocument?: Array<Reference>;
  study?: Array<Reference>;
}

export interface AllergyIntoleranceReaction {
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
  reaction?: AllergyIntoleranceReaction;
}

export interface AppointmentParticipant {
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
  participant: AppointmentParticipant;
  requestedPeriod?: Array<Period>;
}

export interface AppointmentResponse {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  address?: string;
  type?: code;
}
export interface AuditEventAgent {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  site?: string;
  observer: Reference;
  type?: Array<Coding>;
}
export interface AuditEventEntityDetail {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: string;
  valueString?: string;
  valueBase64Binary?: base64Binary;
}
export interface AuditEventEntity {
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
  detail?: AuditEventEntityDetail;
}
export interface AuditEvent {
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
  agent: AuditEventAgent;
  source: AuditEventSource;
  entity?: AuditEventEntity;
}

export interface Basic {
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
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  contentType: code;
  securityContext?: Reference;
  data?: base64Binary;
}

export interface BiologicallyDerivedProductCollection {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  collector?: Reference;
  source?: Reference;
  collectedDateTime?: dateTime;
  collectedPeriod?: Period;
}
export interface BiologicallyDerivedProductProcessing {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  timeDateTime?: dateTime;
  timePeriod?: Period;
}
export interface BiologicallyDerivedProductStorage {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  temperature?: decimal;
  scale?: code;
  duration?: Period;
}
export interface BiologicallyDerivedProduct {
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
  processing?: BiologicallyDerivedProductProcessing;
  manipulation?: BiologicallyDerivedProductManipulation;
  storage?: BiologicallyDerivedProductStorage;
}

export interface BodyStructure {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  relation: string;
  url: uri;
}
export interface BundleEntrySearch {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode?: code;
  score?: decimal;
}
export interface BundleEntryRequest {
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
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  identifier?: Identifier;
  type: code;
  timestamp?: instant;
  total?: unsignedInt;
  link?: BundleLink;
  entry?: BundleEntry;
  signature?: Signature;
}

export interface CapabilityStatementSoftware {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  version?: string;
  releaseDate?: dateTime;
}
export interface CapabilityStatementImplementation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description: string;
  url?: url;
  custodian?: Reference;
}
export interface CapabilityStatementRestSecurity {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  cors?: boolean;
  service?: Array<CodeableConcept>;
  description?: markdown;
}
export interface CapabilityStatementRestResourceInteraction {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  documentation?: markdown;
}
export interface CapabilityStatementRestResourceSearchParam {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  definition?: canonical;
  type: code;
  documentation?: markdown;
}
export interface CapabilityStatementRestResourceOperation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  definition: canonical;
  documentation?: markdown;
}
export interface CapabilityStatementRestResource {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  profile?: canonical;
  supportedProfile?: Array<canonical>;
  documentation?: markdown;
  interaction?: CapabilityStatementRestResourceInteraction;
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
  searchParam?: CapabilityStatementRestResourceSearchParam;
  operation?: CapabilityStatementRestResourceOperation;
}
export interface CapabilityStatementRestInteraction {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  documentation?: markdown;
}
export interface CapabilityStatementRest {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode: code;
  documentation?: markdown;
  security?: CapabilityStatementRestSecurity;
  resource?: CapabilityStatementRestResource;
  interaction?: CapabilityStatementRestInteraction;
  searchParam?: CapabilityStatementRestResourceSearchParam;
  operation?: CapabilityStatementRestResourceOperation;
  compartment?: Array<canonical>;
}
export interface CapabilityStatementMessagingEndpoint {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  protocol: Coding;
  address: url;
}
export interface CapabilityStatementMessagingSupportedMessage {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode: code;
  definition: canonical;
}
export interface CapabilityStatementMessaging {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  endpoint?: CapabilityStatementMessagingEndpoint;
  reliableCache?: unsignedInt;
  documentation?: markdown;
  supportedMessage?: CapabilityStatementMessagingSupportedMessage;
}
export interface CapabilityStatementDocument {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode: code;
  documentation?: markdown;
  profile: canonical;
}
export interface CapabilityStatement {
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
  rest?: CapabilityStatementRest;
  messaging?: CapabilityStatementMessaging;
  document?: CapabilityStatementDocument;
}

export interface CarePlanActivityDetail {
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
  activity?: CarePlanActivity;
  note?: Array<Annotation>;
}

export interface CareTeamParticipant {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  role?: Array<CodeableConcept>;
  member?: Reference;
  onBehalfOf?: Reference;
  period?: Period;
}
export interface CareTeam {
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
  participant?: CareTeamParticipant;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  managingOrganization?: Array<Reference>;
  telecom?: Array<ContactPoint>;
  note?: Array<Annotation>;
}

export interface CatalogEntryRelatedEntry {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  relationtype: code;
  item: Reference;
}
export interface CatalogEntry {
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
  relatedEntry?: CatalogEntryRelatedEntry;
}

export interface ChargeItemPerformer {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
}
export interface ChargeItem {
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
  performer?: ChargeItemPerformer;
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  language?: string;
  expression?: string;
}
export interface ChargeItemDefinitionPropertyGroupPriceComponent {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  code?: CodeableConcept;
  factor?: decimal;
  amount?: Money;
}
export interface ChargeItemDefinitionPropertyGroup {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  applicability?: ChargeItemDefinitionApplicability;
  priceComponent?: ChargeItemDefinitionPropertyGroupPriceComponent;
}
export interface ChargeItemDefinition {
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
  applicability?: ChargeItemDefinitionApplicability;
  propertyGroup?: ChargeItemDefinitionPropertyGroup;
}

export interface ClaimRelated {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  claim?: Reference;
  relationship?: CodeableConcept;
  reference?: Identifier;
}
export interface ClaimPayee {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  party?: Reference;
}
export interface ClaimCareTeam {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  date: date;
  type?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
}
export interface ClaimItemDetailSubDetail {
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
  subDetail?: ClaimItemDetailSubDetail;
}
export interface ClaimItem {
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
  detail?: ClaimItemDetail;
}
export interface Claim {
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
  related?: ClaimRelated;
  prescription?: Reference;
  originalPrescription?: Reference;
  payee?: ClaimPayee;
  referral?: Reference;
  facility?: Reference;
  careTeam?: ClaimCareTeam;
  supportingInfo?: ClaimSupportingInfo;
  diagnosis?: ClaimDiagnosis;
  procedure?: ClaimProcedure;
  insurance: ClaimInsurance;
  accident?: ClaimAccident;
  item?: ClaimItem;
  total?: Money;
}

export interface ClaimResponseItemAdjudication {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category: CodeableConcept;
  reason?: CodeableConcept;
  amount?: Money;
  value?: decimal;
}
export interface ClaimResponseItemDetailSubDetail {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  subDetailSequence: positiveInt;
  noteNumber?: Array<positiveInt>;
  adjudication?: ClaimResponseItemAdjudication;
}
export interface ClaimResponseItemDetail {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  detailSequence: positiveInt;
  noteNumber?: Array<positiveInt>;
  adjudication: ClaimResponseItemAdjudication;
  subDetail?: ClaimResponseItemDetailSubDetail;
}
export interface ClaimResponseItem {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemSequence: positiveInt;
  noteNumber?: Array<positiveInt>;
  adjudication: ClaimResponseItemAdjudication;
  detail?: ClaimResponseItemDetail;
}
export interface ClaimResponseAddItemDetailSubDetail {
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
  subDetail?: ClaimResponseAddItemDetailSubDetail;
}
export interface ClaimResponseAddItem {
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
  detail?: ClaimResponseAddItemDetail;
}
export interface ClaimResponseTotal {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category: CodeableConcept;
  amount: Money;
}
export interface ClaimResponsePayment {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  number?: positiveInt;
  type?: code;
  text: string;
  language?: CodeableConcept;
}
export interface ClaimResponseInsurance {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemSequence?: positiveInt;
  detailSequence?: positiveInt;
  subDetailSequence?: positiveInt;
  code: CodeableConcept;
}
export interface ClaimResponse {
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
  item?: ClaimResponseItem;
  addItem?: ClaimResponseAddItem;
  adjudication?: ClaimResponseItemAdjudication;
  total?: ClaimResponseTotal;
  payment?: ClaimResponsePayment;
  fundsReserve?: CodeableConcept;
  formCode?: CodeableConcept;
  form?: Attachment;
  processNote?: ClaimResponseProcessNote;
  communicationRequest?: Array<Reference>;
  insurance?: ClaimResponseInsurance;
  error?: ClaimResponseError;
}

export interface ClinicalImpressionInvestigation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  item?: Array<Reference>;
}
export interface ClinicalImpressionFinding {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  basis?: string;
}
export interface ClinicalImpression {
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
  investigation?: ClinicalImpressionInvestigation;
  protocol?: Array<uri>;
  summary?: string;
  finding?: ClinicalImpressionFinding;
  prognosisCodeableConcept?: Array<CodeableConcept>;
  prognosisReference?: Array<Reference>;
  supportingInfo?: Array<Reference>;
  note?: Array<Annotation>;
}

export interface CodeSystemFilter {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  description?: string;
  operator: Array<code>;
  value: string;
}
export interface CodeSystemProperty {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  uri?: uri;
  description?: string;
  type: code;
}
export interface CodeSystemConceptDesignation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  language?: code;
  use?: Coding;
  value: string;
}
export interface CodeSystemConceptProperty {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  display?: string;
  definition?: string;
  designation?: CodeSystemConceptDesignation;
  property?: CodeSystemConceptProperty;
  concept?: CodeSystemConcept;
}
export interface CodeSystem {
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
  filter?: CodeSystemFilter;
  property?: CodeSystemProperty;
  concept?: CodeSystemConcept;
}

export interface CommunicationPayload {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  contentString?: string;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}
export interface Communication {
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
  payload?: CommunicationPayload;
  note?: Array<Annotation>;
}

export interface CommunicationRequestPayload {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  contentString?: string;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}
export interface CommunicationRequest {
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
  payload?: CommunicationRequestPayload;
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  param?: Array<string>;
  documentation?: string;
}
export interface CompartmentDefinition {
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
  resource?: CompartmentDefinitionResource;
}

export interface CompositionAttester {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode: code;
  time?: dateTime;
  party?: Reference;
}
export interface CompositionRelatesTo {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  targetIdentifier?: Identifier;
  targetReference?: Reference;
}
export interface CompositionEvent {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: Array<CodeableConcept>;
  period?: Period;
  detail?: Array<Reference>;
}
export interface CompositionSection {
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
  attester?: CompositionAttester;
  custodian?: Reference;
  relatesTo?: CompositionRelatesTo;
  event?: CompositionEvent;
  section?: CompositionSection;
}

export interface ConceptMapGroupElementTargetDependsOn {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  property: uri;
  system?: canonical;
  value: string;
  display?: string;
}
export interface ConceptMapGroupElementTarget {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: code;
  display?: string;
  equivalence: code;
  comment?: string;
  dependsOn?: ConceptMapGroupElementTargetDependsOn;
  product?: ConceptMapGroupElementTargetDependsOn;
}
export interface ConceptMapGroupElement {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: code;
  display?: string;
  target?: ConceptMapGroupElementTarget;
}
export interface ConceptMapGroupUnmapped {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  mode: code;
  code?: code;
  display?: string;
  url?: canonical;
}
export interface ConceptMapGroup {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  source?: uri;
  sourceVersion?: string;
  target?: uri;
  targetVersion?: string;
  element: ConceptMapGroupElement;
  unmapped?: ConceptMapGroupUnmapped;
}
export interface ConceptMap {
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
  group?: ConceptMapGroup;
}

export interface ConditionStage {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  summary?: CodeableConcept;
  assessment?: Array<Reference>;
  type?: CodeableConcept;
}
export interface ConditionEvidence {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: Array<CodeableConcept>;
  detail?: Array<Reference>;
}
export interface Condition {
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
  stage?: ConditionStage;
  evidence?: ConditionEvidence;
  note?: Array<Annotation>;
}

export interface ConsentPolicy {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  authority?: uri;
  uri?: uri;
}
export interface ConsentVerification {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  verified: boolean;
  verifiedWith?: Reference;
  verificationDate?: dateTime;
}
export interface ConsentProvisionActor {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  role: CodeableConcept;
  reference: Reference;
}
export interface ConsentProvisionData {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  meaning: code;
  reference: Reference;
}
export interface ConsentProvision {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: code;
  period?: Period;
  actor?: ConsentProvisionActor;
  action?: Array<CodeableConcept>;
  securityLabel?: Array<Coding>;
  purpose?: Array<Coding>;
  class?: Array<Coding>;
  code?: Array<CodeableConcept>;
  dataPeriod?: Period;
  data?: ConsentProvisionData;
  provision?: ConsentProvision;
}
export interface Consent {
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
  policy?: ConsentPolicy;
  policyRule?: CodeableConcept;
  verification?: ConsentVerification;
  provision?: ConsentProvision;
}

export interface ContractContentDefinition {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  number?: Array<unsignedInt>;
  classification: Coding;
  category?: Array<Coding>;
  control?: Array<Coding>;
}
export interface ContractTermOfferParty {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  reference: Array<Reference>;
  role: CodeableConcept;
}
export interface ContractTermOfferAnswer {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  party?: ContractTermOfferParty;
  topic?: Reference;
  type?: CodeableConcept;
  decision?: CodeableConcept;
  decisionMode?: Array<CodeableConcept>;
  answer?: ContractTermOfferAnswer;
  text?: string;
  linkId?: Array<string>;
  securityLabelNumber?: Array<unsignedInt>;
}
export interface ContractTermAssetContext {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  reference?: Reference;
  code?: Array<CodeableConcept>;
  text?: string;
}
export interface ContractTermAssetValuedItem {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  scope?: CodeableConcept;
  type?: Array<CodeableConcept>;
  typeReference?: Array<Reference>;
  subtype?: Array<CodeableConcept>;
  relationship?: Coding;
  context?: ContractTermAssetContext;
  condition?: string;
  periodType?: Array<CodeableConcept>;
  period?: Array<Period>;
  usePeriod?: Array<Period>;
  text?: string;
  linkId?: Array<string>;
  answer?: ContractTermOfferAnswer;
  securityLabelNumber?: Array<unsignedInt>;
  valuedItem?: ContractTermAssetValuedItem;
}
export interface ContractTermActionSubject {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  reference: Array<Reference>;
  role?: CodeableConcept;
}
export interface ContractTermAction {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  doNotPerform?: boolean;
  type: CodeableConcept;
  subject?: ContractTermActionSubject;
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
  securityLabel?: ContractTermSecurityLabel;
  offer: ContractTermOffer;
  asset?: ContractTermAsset;
  action?: ContractTermAction;
  group?: ContractTerm;
}
export interface ContractSigner {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: Coding;
  party: Reference;
  signature: Array<Signature>;
}
export interface ContractFriendly {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}
export interface ContractLegal {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}
export interface ContractRule {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}
export interface Contract {
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
  term?: ContractTerm;
  supportingInfo?: Array<Reference>;
  relevantHistory?: Array<Reference>;
  signer?: ContractSigner;
  friendly?: ContractFriendly;
  legal?: ContractLegal;
  rule?: ContractRule;
  legallyBindingAttachment?: Attachment;
  legallyBindingReference?: Reference;
}

export interface CoverageClass {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  value: string;
  name?: string;
}
export interface CoverageCostToBeneficiaryException {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  period?: Period;
}
export interface CoverageCostToBeneficiary {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  valueQuantity?: Quantity;
  valueMoney?: Money;
  exception?: CoverageCostToBeneficiaryException;
}
export interface Coverage {
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
  class?: CoverageClass;
  order?: positiveInt;
  network?: string;
  costToBeneficiary?: CoverageCostToBeneficiary;
  subrogation?: boolean;
  contract?: Array<Reference>;
}

export interface CoverageEligibilityRequestSupportingInfo {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence: positiveInt;
  information: Reference;
  appliesToAll?: boolean;
}
export interface CoverageEligibilityRequestInsurance {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  focal?: boolean;
  coverage: Reference;
  businessArrangement?: string;
}
export interface CoverageEligibilityRequestItemDiagnosis {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
}
export interface CoverageEligibilityRequestItem {
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
  diagnosis?: CoverageEligibilityRequestItemDiagnosis;
  detail?: Array<Reference>;
}
export interface CoverageEligibilityRequest {
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
  supportingInfo?: CoverageEligibilityRequestSupportingInfo;
  insurance?: CoverageEligibilityRequestInsurance;
  item?: CoverageEligibilityRequestItem;
}

export interface CoverageEligibilityResponseInsuranceItemBenefit {
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
  benefit?: CoverageEligibilityResponseInsuranceItemBenefit;
  authorizationRequired?: boolean;
  authorizationSupporting?: Array<CodeableConcept>;
  authorizationUrl?: uri;
}
export interface CoverageEligibilityResponseInsurance {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  coverage: Reference;
  inforce?: boolean;
  benefitPeriod?: Period;
  item?: CoverageEligibilityResponseInsuranceItem;
}
export interface CoverageEligibilityResponseError {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
}
export interface CoverageEligibilityResponse {
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
  insurance?: CoverageEligibilityResponseInsurance;
  preAuthRef?: string;
  form?: CodeableConcept;
  error?: CoverageEligibilityResponseError;
}

export interface DetectedIssueEvidence {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: Array<CodeableConcept>;
  detail?: Array<Reference>;
}
export interface DetectedIssueMitigation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action: CodeableConcept;
  date?: dateTime;
  author?: Reference;
}
export interface DetectedIssue {
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
  evidence?: DetectedIssueEvidence;
  detail?: string;
  reference?: uri;
  mitigation?: DetectedIssueMitigation;
}

export interface DeviceUdiCarrier {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  type: code;
}
export interface DeviceSpecialization {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  systemType: CodeableConcept;
  version?: string;
}
export interface DeviceVersion {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  component?: Identifier;
  value: string;
}
export interface DeviceProperty {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  valueQuantity?: Array<Quantity>;
  valueCode?: Array<CodeableConcept>;
}
export interface Device {
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
  udiCarrier?: DeviceUdiCarrier;
  status?: code;
  statusReason?: Array<CodeableConcept>;
  distinctIdentifier?: string;
  manufacturer?: string;
  manufactureDate?: dateTime;
  expirationDate?: dateTime;
  lotNumber?: string;
  serialNumber?: string;
  deviceName?: DeviceDeviceName;
  modelNumber?: string;
  partNumber?: string;
  type?: CodeableConcept;
  specialization?: DeviceSpecialization;
  version?: DeviceVersion;
  property?: DeviceProperty;
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  deviceIdentifier: string;
  issuer: uri;
  jurisdiction: uri;
}
export interface DeviceDefinitionDeviceName {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  type: code;
}
export interface DeviceDefinitionSpecialization {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  systemType: string;
  version?: string;
}
export interface DeviceDefinitionCapability {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  description?: Array<CodeableConcept>;
}
export interface DeviceDefinitionProperty {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  valueQuantity?: Array<Quantity>;
  valueCode?: Array<CodeableConcept>;
}
export interface DeviceDefinitionMaterial {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  substance: CodeableConcept;
  alternate?: boolean;
  allergenicIndicator?: boolean;
}
export interface DeviceDefinition {
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  udiDeviceIdentifier?: DeviceDefinitionUdiDeviceIdentifier;
  manufacturerString?: string;
  manufacturerReference?: Reference;
  deviceName?: DeviceDefinitionDeviceName;
  modelNumber?: string;
  type?: CodeableConcept;
  specialization?: DeviceDefinitionSpecialization;
  version?: Array<string>;
  safety?: Array<CodeableConcept>;
  shelfLifeStorage?: Array<ProductShelfLife>;
  physicalCharacteristics?: ProdCharacteristic;
  languageCode?: Array<CodeableConcept>;
  capability?: DeviceDefinitionCapability;
  property?: DeviceDefinitionProperty;
  owner?: Reference;
  contact?: Array<ContactPoint>;
  url?: uri;
  onlineInformation?: uri;
  note?: Array<Annotation>;
  quantity?: Quantity;
  parentDevice?: Reference;
  material?: DeviceDefinitionMaterial;
}

export interface DeviceMetricCalibration {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: code;
  state?: code;
  time?: instant;
}
export interface DeviceMetric {
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
  calibration?: DeviceMetricCalibration;
}

export interface DeviceRequestParameter {
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
  parameter?: DeviceRequestParameter;
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  comment?: string;
  link: Reference;
}
export interface DiagnosticReport {
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
  media?: DiagnosticReportMedia;
  conclusion?: string;
  conclusionCode?: Array<CodeableConcept>;
  presentedForm?: Array<Attachment>;
}

export interface DocumentManifestRelated {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  ref?: Reference;
}
export interface DocumentManifest {
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
  related?: DocumentManifestRelated;
}

export interface DocumentReferenceRelatesTo {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  target: Reference;
}
export interface DocumentReferenceContent {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  attachment: Attachment;
  format?: Coding;
}
export interface DocumentReferenceContext {
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
  relatesTo?: DocumentReferenceRelatesTo;
  description?: string;
  securityLabel?: Array<CodeableConcept>;
  content: DocumentReferenceContent;
  context?: DocumentReferenceContext;
}

export interface DomainResource {
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
}

export interface EffectEvidenceSynthesisSampleSize {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  numberOfStudies?: integer;
  numberOfParticipants?: integer;
}
export interface EffectEvidenceSynthesisResultsByExposure {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  exposureState?: code;
  variantState?: CodeableConcept;
  riskEvidenceSynthesis: Reference;
}
export interface EffectEvidenceSynthesisEffectEstimatePrecisionEstimate {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  level?: decimal;
  from?: decimal;
  to?: decimal;
}
export interface EffectEvidenceSynthesisEffectEstimate {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  type?: CodeableConcept;
  variantState?: CodeableConcept;
  value?: decimal;
  unitOfMeasure?: CodeableConcept;
  precisionEstimate?: EffectEvidenceSynthesisEffectEstimatePrecisionEstimate;
}
export interface EffectEvidenceSynthesisCertaintyCertaintySubcomponent {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  rating?: Array<CodeableConcept>;
  note?: Array<Annotation>;
}
export interface EffectEvidenceSynthesisCertainty {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  rating?: Array<CodeableConcept>;
  note?: Array<Annotation>;
  certaintySubcomponent?: EffectEvidenceSynthesisCertaintyCertaintySubcomponent;
}
export interface EffectEvidenceSynthesis {
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
  resultsByExposure?: EffectEvidenceSynthesisResultsByExposure;
  effectEstimate?: EffectEvidenceSynthesisEffectEstimate;
  certainty?: EffectEvidenceSynthesisCertainty;
}

export interface EncounterStatusHistory {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  status: code;
  period: Period;
}
export interface EncounterClassHistory {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  class: Coding;
  period: Period;
}
export interface EncounterParticipant {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: Array<CodeableConcept>;
  period?: Period;
  individual?: Reference;
}
export interface EncounterDiagnosis {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  condition: Reference;
  use?: CodeableConcept;
  rank?: positiveInt;
}
export interface EncounterHospitalization {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  location: Reference;
  status?: code;
  physicalType?: CodeableConcept;
  period?: Period;
}
export interface Encounter {
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
  statusHistory?: EncounterStatusHistory;
  class: Coding;
  classHistory?: EncounterClassHistory;
  type?: Array<CodeableConcept>;
  serviceType?: CodeableConcept;
  priority?: CodeableConcept;
  subject?: Reference;
  episodeOfCare?: Array<Reference>;
  basedOn?: Array<Reference>;
  participant?: EncounterParticipant;
  appointment?: Array<Reference>;
  period?: Period;
  length?: Duration;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  diagnosis?: EncounterDiagnosis;
  account?: Array<Reference>;
  hospitalization?: EncounterHospitalization;
  location?: EncounterLocation;
  serviceProvider?: Reference;
  partOf?: Reference;
}

export interface Endpoint {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  status: code;
  period: Period;
}
export interface EpisodeOfCareDiagnosis {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  condition: Reference;
  role?: CodeableConcept;
  rank?: positiveInt;
}
export interface EpisodeOfCare {
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
  statusHistory?: EpisodeOfCareStatusHistory;
  type?: Array<CodeableConcept>;
  diagnosis?: EpisodeOfCareDiagnosis;
  patient: Reference;
  managingOrganization?: Reference;
  period?: Period;
  referralRequest?: Array<Reference>;
  careManager?: Reference;
  team?: Array<Reference>;
  account?: Array<Reference>;
}

export interface EventDefinition {
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
  characteristic: EvidenceVariableCharacteristic;
}

export interface ExampleScenarioActor {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  actorId: string;
  type: code;
  name?: string;
  description?: markdown;
}
export interface ExampleScenarioInstanceVersion {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  versionId: string;
  description: markdown;
}
export interface ExampleScenarioInstanceContainedInstance {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  resourceId: string;
  versionId?: string;
}
export interface ExampleScenarioInstance {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  resourceId: string;
  resourceType: code;
  name?: string;
  description?: markdown;
  version?: ExampleScenarioInstanceVersion;
  containedInstance?: ExampleScenarioInstanceContainedInstance;
}
export interface ExampleScenarioProcessStepOperation {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  title: string;
  description?: markdown;
  step?: ExampleScenarioProcessStep;
}
export interface ExampleScenarioProcessStep {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  process?: ExampleScenarioProcess;
  pause?: boolean;
  operation?: ExampleScenarioProcessStepOperation;
  alternative?: ExampleScenarioProcessStepAlternative;
}
export interface ExampleScenarioProcess {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  title: string;
  description?: markdown;
  preConditions?: markdown;
  postConditions?: markdown;
  step?: ExampleScenarioProcessStep;
}
export interface ExampleScenario {
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
  actor?: ExampleScenarioActor;
  instance?: ExampleScenarioInstance;
  process?: ExampleScenarioProcess;
  workflow?: Array<canonical>;
}

export interface ExplanationOfBenefitRelated {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  claim?: Reference;
  relationship?: CodeableConcept;
  reference?: Identifier;
}
export interface ExplanationOfBenefitPayee {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  party?: Reference;
}
export interface ExplanationOfBenefitCareTeam {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  focal: boolean;
  coverage: Reference;
  preAuthRef?: Array<string>;
}
export interface ExplanationOfBenefitAccident {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  date?: date;
  type?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
}
export interface ExplanationOfBenefitItemAdjudication {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category: CodeableConcept;
  reason?: CodeableConcept;
  amount?: Money;
  value?: decimal;
}
export interface ExplanationOfBenefitItemDetailSubDetail {
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
  subDetail?: ExplanationOfBenefitItemDetailSubDetail;
}
export interface ExplanationOfBenefitItem {
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
  adjudication?: ExplanationOfBenefitItemAdjudication;
  detail?: ExplanationOfBenefitItemDetail;
}
export interface ExplanationOfBenefitAddItemDetailSubDetail {
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
  subDetail?: ExplanationOfBenefitAddItemDetailSubDetail;
}
export interface ExplanationOfBenefitAddItem {
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
  detail?: ExplanationOfBenefitAddItemDetail;
}
export interface ExplanationOfBenefitTotal {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category: CodeableConcept;
  amount: Money;
}
export interface ExplanationOfBenefitPayment {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  number?: positiveInt;
  type?: code;
  text?: string;
  language?: CodeableConcept;
}
export interface ExplanationOfBenefitBenefitBalanceFinancial {
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
  financial?: ExplanationOfBenefitBenefitBalanceFinancial;
}
export interface ExplanationOfBenefit {
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
  related?: ExplanationOfBenefitRelated;
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
  careTeam?: ExplanationOfBenefitCareTeam;
  supportingInfo?: ExplanationOfBenefitSupportingInfo;
  diagnosis?: ExplanationOfBenefitDiagnosis;
  procedure?: ExplanationOfBenefitProcedure;
  precedence?: positiveInt;
  insurance: ExplanationOfBenefitInsurance;
  accident?: ExplanationOfBenefitAccident;
  item?: ExplanationOfBenefitItem;
  addItem?: ExplanationOfBenefitAddItem;
  adjudication?: ExplanationOfBenefitItemAdjudication;
  total?: ExplanationOfBenefitTotal;
  payment?: ExplanationOfBenefitPayment;
  formCode?: CodeableConcept;
  form?: Attachment;
  processNote?: ExplanationOfBenefitProcessNote;
  benefitPeriod?: Period;
  benefitBalance?: ExplanationOfBenefitBenefitBalance;
}

export interface FamilyMemberHistoryCondition {
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
  condition?: FamilyMemberHistoryCondition;
}

export interface Flag {
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
  target?: GoalTarget;
  statusDate?: date;
  statusReason?: string;
  expressedBy?: Reference;
  addresses?: Array<Reference>;
  note?: Array<Annotation>;
  outcomeCode?: Array<CodeableConcept>;
  outcomeReference?: Array<Reference>;
}

export interface GraphDefinitionLinkTargetCompartment {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  params?: string;
  profile?: canonical;
  compartment?: GraphDefinitionLinkTargetCompartment;
  link?: GraphDefinitionLink;
}
export interface GraphDefinitionLink {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  path?: string;
  sliceName?: string;
  min?: integer;
  max?: string;
  description?: string;
  target?: GraphDefinitionLinkTarget;
}
export interface GraphDefinition {
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
  link?: GraphDefinitionLink;
}

export interface GroupCharacteristic {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  entity: Reference;
  period?: Period;
  inactive?: boolean;
}
export interface Group {
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
  characteristic?: GroupCharacteristic;
  member?: GroupMember;
}

export interface GuidanceResponse {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  comment?: markdown;
}
export interface HealthcareServiceAvailableTime {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  daysOfWeek?: Array<code>;
  allDay?: boolean;
  availableStartTime?: time;
  availableEndTime?: time;
}
export interface HealthcareServiceNotAvailable {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description: string;
  during?: Period;
}
export interface HealthcareService {
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
  eligibility?: HealthcareServiceEligibility;
  program?: Array<CodeableConcept>;
  characteristic?: Array<CodeableConcept>;
  communication?: Array<CodeableConcept>;
  referralMethod?: Array<CodeableConcept>;
  appointmentRequired?: boolean;
  availableTime?: HealthcareServiceAvailableTime;
  notAvailable?: HealthcareServiceNotAvailable;
  availabilityExceptions?: string;
  endpoint?: Array<Reference>;
}

export interface ImagingStudySeriesPerformer {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
}
export interface ImagingStudySeriesInstance {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  uid: id;
  sopClass: Coding;
  number?: unsignedInt;
  title?: string;
}
export interface ImagingStudySeries {
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
  performer?: ImagingStudySeriesPerformer;
  instance?: ImagingStudySeriesInstance;
}
export interface ImagingStudy {
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
  series?: ImagingStudySeries;
}

export interface ImmunizationPerformer {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
}
export interface ImmunizationEducation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  documentType?: string;
  reference?: uri;
  publicationDate?: dateTime;
  presentationDate?: dateTime;
}
export interface ImmunizationReaction {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  date?: dateTime;
  detail?: Reference;
  reported?: boolean;
}
export interface ImmunizationProtocolApplied {
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
  performer?: ImmunizationPerformer;
  note?: Array<Annotation>;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  isSubpotent?: boolean;
  subpotentReason?: Array<CodeableConcept>;
  education?: ImmunizationEducation;
  programEligibility?: Array<CodeableConcept>;
  fundingSource?: CodeableConcept;
  reaction?: ImmunizationReaction;
  protocolApplied?: ImmunizationProtocolApplied;
}

export interface ImmunizationEvaluation {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  value: dateTime;
}
export interface ImmunizationRecommendationRecommendation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  vaccineCode?: Array<CodeableConcept>;
  targetDisease?: CodeableConcept;
  contraindicatedVaccineCode?: Array<CodeableConcept>;
  forecastStatus: CodeableConcept;
  forecastReason?: Array<CodeableConcept>;
  dateCriterion?: ImmunizationRecommendationRecommendationDateCriterion;
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
  recommendation: ImmunizationRecommendationRecommendation;
}

export interface ImplementationGuideDependsOn {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  uri: canonical;
  packageId?: id;
  version?: string;
}
export interface ImplementationGuideGlobal {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  profile: canonical;
}
export interface ImplementationGuideDefinitionGrouping {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  description?: string;
}
export interface ImplementationGuideDefinitionResource {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  value: string;
}
export interface ImplementationGuideDefinitionTemplate {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  source: string;
  scope?: string;
}
export interface ImplementationGuideDefinition {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  grouping?: ImplementationGuideDefinitionGrouping;
  resource: ImplementationGuideDefinitionResource;
  page?: ImplementationGuideDefinitionPage;
  parameter?: ImplementationGuideDefinitionParameter;
  template?: ImplementationGuideDefinitionTemplate;
}
export interface ImplementationGuideManifestResource {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  reference: Reference;
  exampleBoolean?: boolean;
  exampleCanonical?: canonical;
  relativePath?: url;
}
export interface ImplementationGuideManifestPage {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  title?: string;
  anchor?: Array<string>;
}
export interface ImplementationGuideManifest {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  rendering?: url;
  resource: ImplementationGuideManifestResource;
  page?: ImplementationGuideManifestPage;
  image?: Array<string>;
  other?: Array<string>;
}
export interface ImplementationGuide {
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
  dependsOn?: ImplementationGuideDependsOn;
  global?: ImplementationGuideGlobal;
  definition?: ImplementationGuideDefinition;
  manifest?: ImplementationGuideManifest;
}

export interface InsurancePlanContact {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  purpose?: CodeableConcept;
  name?: HumanName;
  telecom?: Array<ContactPoint>;
  address?: Address;
}
export interface InsurancePlanCoverageBenefitLimit {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  value?: Quantity;
  code?: CodeableConcept;
}
export interface InsurancePlanCoverageBenefit {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  requirement?: string;
  limit?: InsurancePlanCoverageBenefitLimit;
}
export interface InsurancePlanCoverage {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  network?: Array<Reference>;
  benefit: InsurancePlanCoverageBenefit;
}
export interface InsurancePlanPlanGeneralCost {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  groupSize?: positiveInt;
  cost?: Money;
  comment?: string;
}
export interface InsurancePlanPlanSpecificCostBenefitCost {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  applicability?: CodeableConcept;
  qualifiers?: Array<CodeableConcept>;
  value?: Quantity;
}
export interface InsurancePlanPlanSpecificCostBenefit {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  cost?: InsurancePlanPlanSpecificCostBenefitCost;
}
export interface InsurancePlanPlanSpecificCost {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category: CodeableConcept;
  benefit?: InsurancePlanPlanSpecificCostBenefit;
}
export interface InsurancePlanPlan {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  type?: CodeableConcept;
  coverageArea?: Array<Reference>;
  network?: Array<Reference>;
  generalCost?: InsurancePlanPlanGeneralCost;
  specificCost?: InsurancePlanPlanSpecificCost;
}
export interface InsurancePlan {
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
  contact?: InsurancePlanContact;
  endpoint?: Array<Reference>;
  network?: Array<Reference>;
  coverage?: InsurancePlanCoverage;
  plan?: InsurancePlanPlan;
}

export interface InvoiceParticipant {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  role?: CodeableConcept;
  actor: Reference;
}
export interface InvoiceLineItemPriceComponent {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  code?: CodeableConcept;
  factor?: decimal;
  amount?: Money;
}
export interface InvoiceLineItem {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  sequence?: positiveInt;
  chargeItemReference?: Reference;
  chargeItemCodeableConcept?: CodeableConcept;
  priceComponent?: InvoiceLineItemPriceComponent;
}
export interface Invoice {
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
  participant?: InvoiceParticipant;
  issuer?: Reference;
  account?: Reference;
  lineItem?: InvoiceLineItem;
  totalPriceComponent?: InvoiceLineItemPriceComponent;
  totalNet?: Money;
  totalGross?: Money;
  paymentTerms?: markdown;
  note?: Array<Annotation>;
}

export interface Library {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  resource: Reference;
}
export interface Linkage {
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
  item: LinkageItem;
}

export interface ListEntry {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  flag?: CodeableConcept;
  deleted?: boolean;
  date?: dateTime;
  item: Reference;
}
export interface List {
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
  entry?: ListEntry;
  emptyReason?: CodeableConcept;
}

export interface LocationPosition {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  longitude: decimal;
  latitude: decimal;
  altitude?: decimal;
}
export interface LocationHoursOfOperation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  daysOfWeek?: Array<code>;
  allDay?: boolean;
  openingTime?: time;
  closingTime?: time;
}
export interface Location {
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
  hoursOfOperation?: LocationHoursOfOperation;
  availabilityExceptions?: string;
  endpoint?: Array<Reference>;
}

export interface MeasureGroupPopulation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  description?: string;
  criteria: Expression;
}
export interface MeasureGroupStratifierComponent {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  description?: string;
  criteria: Expression;
}
export interface MeasureGroupStratifier {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  description?: string;
  criteria?: Expression;
  component?: MeasureGroupStratifierComponent;
}
export interface MeasureGroup {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  description?: string;
  population?: MeasureGroupPopulation;
  stratifier?: MeasureGroupStratifier;
}
export interface MeasureSupplementalData {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  usage?: Array<CodeableConcept>;
  description?: string;
  criteria: Expression;
}
export interface Measure {
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
  group?: MeasureGroup;
  supplementalData?: MeasureSupplementalData;
}

export interface MeasureReportGroupPopulation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  count?: integer;
  subjectResults?: Reference;
}
export interface MeasureReportGroupStratifierStratumComponent {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  value: CodeableConcept;
}
export interface MeasureReportGroupStratifierStratumPopulation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  count?: integer;
  subjectResults?: Reference;
}
export interface MeasureReportGroupStratifierStratum {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  value?: CodeableConcept;
  component?: MeasureReportGroupStratifierStratumComponent;
  population?: MeasureReportGroupStratifierStratumPopulation;
  measureScore?: Quantity;
}
export interface MeasureReportGroupStratifier {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: Array<CodeableConcept>;
  stratum?: MeasureReportGroupStratifierStratum;
}
export interface MeasureReportGroup {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: CodeableConcept;
  population?: MeasureReportGroupPopulation;
  measureScore?: Quantity;
  stratifier?: MeasureReportGroupStratifier;
}
export interface MeasureReport {
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
  group?: MeasureReportGroup;
  evaluatedResource?: Array<Reference>;
}

export interface Media {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  isActive?: boolean;
  strength?: Ratio;
}
export interface MedicationBatch {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  lotNumber?: string;
  expirationDate?: dateTime;
}
export interface Medication {
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
  ingredient?: MedicationIngredient;
  batch?: MedicationBatch;
}

export interface MedicationAdministrationPerformer {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
}
export interface MedicationAdministrationDosage {
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
  performer?: MedicationAdministrationPerformer;
  reasonCode?: Array<CodeableConcept>;
  reasonReference?: Array<Reference>;
  request?: Reference;
  device?: Array<Reference>;
  note?: Array<Annotation>;
  dosage?: MedicationAdministrationDosage;
  eventHistory?: Array<Reference>;
}

export interface MedicationDispensePerformer {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
}
export interface MedicationDispenseSubstitution {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  wasSubstituted: boolean;
  type?: CodeableConcept;
  reason?: Array<CodeableConcept>;
  responsibleParty?: Array<Reference>;
}
export interface MedicationDispense {
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
  performer?: MedicationDispensePerformer;
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  reference: Array<Reference>;
}
export interface MedicationKnowledgeMonograph {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  source?: Reference;
}
export interface MedicationKnowledgeIngredient {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  isActive?: boolean;
  strength?: Ratio;
}
export interface MedicationKnowledgeCost {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  source?: string;
  cost: Money;
}
export interface MedicationKnowledgeMonitoringProgram {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  name?: string;
}
export interface MedicationKnowledgeAdministrationGuidelinesDosage {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  dosage: Array<Dosage>;
}
export interface MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  characteristicCodeableConcept?: CodeableConcept;
  characteristicQuantity?: Quantity;
  value?: Array<string>;
}
export interface MedicationKnowledgeAdministrationGuidelines {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  dosage?: MedicationKnowledgeAdministrationGuidelinesDosage;
  indicationCodeableConcept?: CodeableConcept;
  indicationReference?: Reference;
  patientCharacteristics?: MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics;
}
export interface MedicationKnowledgeMedicineClassification {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  classification?: Array<CodeableConcept>;
}
export interface MedicationKnowledgePackaging {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  quantity?: Quantity;
}
export interface MedicationKnowledgeDrugCharacteristic {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: CodeableConcept;
  allowed: boolean;
}
export interface MedicationKnowledgeRegulatorySchedule {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  schedule: CodeableConcept;
}
export interface MedicationKnowledgeRegulatoryMaxDispense {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  quantity: Quantity;
  period?: Duration;
}
export interface MedicationKnowledgeRegulatory {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  regulatoryAuthority: Reference;
  substitution?: MedicationKnowledgeRegulatorySubstitution;
  schedule?: MedicationKnowledgeRegulatorySchedule;
  maxDispense?: MedicationKnowledgeRegulatoryMaxDispense;
}
export interface MedicationKnowledgeKinetics {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  areaUnderCurve?: Array<Quantity>;
  lethalDose50?: Array<Quantity>;
  halfLifePeriod?: Duration;
}
export interface MedicationKnowledge {
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
  relatedMedicationKnowledge?: MedicationKnowledgeRelatedMedicationKnowledge;
  associatedMedication?: Array<Reference>;
  productType?: Array<CodeableConcept>;
  monograph?: MedicationKnowledgeMonograph;
  ingredient?: MedicationKnowledgeIngredient;
  preparationInstruction?: markdown;
  intendedRoute?: Array<CodeableConcept>;
  cost?: MedicationKnowledgeCost;
  monitoringProgram?: MedicationKnowledgeMonitoringProgram;
  administrationGuidelines?: MedicationKnowledgeAdministrationGuidelines;
  medicineClassification?: MedicationKnowledgeMedicineClassification;
  packaging?: MedicationKnowledgePackaging;
  drugCharacteristic?: MedicationKnowledgeDrugCharacteristic;
  contraindication?: Array<Reference>;
  regulatory?: MedicationKnowledgeRegulatory;
  kinetics?: MedicationKnowledgeKinetics;
}

export interface MedicationRequestDispenseRequestInitialFill {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  quantity?: Quantity;
  duration?: Duration;
}
export interface MedicationRequestDispenseRequest {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  allowedBoolean?: boolean;
  allowedCodeableConcept?: CodeableConcept;
  reason?: CodeableConcept;
}
export interface MedicationRequest {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  part: string;
  type: Coding;
}
export interface MedicinalProductNameCountryLanguage {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  country: CodeableConcept;
  jurisdiction?: CodeableConcept;
  language: CodeableConcept;
}
export interface MedicinalProductName {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  productName: string;
  namePart?: MedicinalProductNameNamePart;
  countryLanguage?: MedicinalProductNameCountryLanguage;
}
export interface MedicinalProductManufacturingBusinessOperation {
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
  name: MedicinalProductName;
  crossReference?: Array<Identifier>;
  manufacturingBusinessOperation?: MedicinalProductManufacturingBusinessOperation;
  specialDesignation?: MedicinalProductSpecialDesignation;
}

export interface MedicinalProductAuthorizationJurisdictionalAuthorization {
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
  jurisdictionalAuthorization?: MedicinalProductAuthorizationJurisdictionalAuthorization;
  holder?: Reference;
  regulator?: Reference;
  procedure?: MedicinalProductAuthorizationProcedure;
}

export interface MedicinalProductContraindicationOtherTherapy {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  therapyRelationshipType: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
}
export interface MedicinalProductContraindication {
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
  otherTherapy?: MedicinalProductContraindicationOtherTherapy;
  population?: Array<Population>;
}

export interface MedicinalProductIndicationOtherTherapy {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  therapyRelationshipType: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
}
export interface MedicinalProductIndication {
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
  otherTherapy?: MedicinalProductIndicationOtherTherapy;
  undesirableEffect?: Array<Reference>;
  population?: Array<Population>;
}

export interface MedicinalProductIngredientSpecifiedSubstanceStrengthReferenceStrength {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  presentation: Ratio;
  presentationLowLimit?: Ratio;
  concentration?: Ratio;
  concentrationLowLimit?: Ratio;
  measurementPoint?: string;
  country?: Array<CodeableConcept>;
  referenceStrength?: MedicinalProductIngredientSpecifiedSubstanceStrengthReferenceStrength;
}
export interface MedicinalProductIngredientSpecifiedSubstance {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  group: CodeableConcept;
  confidentiality?: CodeableConcept;
  strength?: MedicinalProductIngredientSpecifiedSubstanceStrength;
}
export interface MedicinalProductIngredientSubstance {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  strength?: MedicinalProductIngredientSpecifiedSubstanceStrength;
}
export interface MedicinalProductIngredient {
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
  specifiedSubstance?: MedicinalProductIngredientSpecifiedSubstance;
  substance?: MedicinalProductIngredientSubstance;
}

export interface MedicinalProductInteractionInteractant {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  itemReference?: Reference;
  itemCodeableConcept?: CodeableConcept;
}
export interface MedicinalProductInteraction {
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
  interactant?: MedicinalProductInteractionInteractant;
  type?: CodeableConcept;
  effect?: CodeableConcept;
  incidence?: CodeableConcept;
  management?: CodeableConcept;
}

export interface MedicinalProductManufactured {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  outerPackaging: Identifier;
  immediatePackaging?: Identifier;
}
export interface MedicinalProductPackagedPackageItem {
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
  batchIdentifier?: MedicinalProductPackagedBatchIdentifier;
  packageItem: MedicinalProductPackagedPackageItem;
}

export interface MedicinalProductPharmaceuticalCharacteristics {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  status?: CodeableConcept;
}
export interface MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpeciesWithdrawalPeriod {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  tissue: CodeableConcept;
  value: Quantity;
  supportingInformation?: string;
}
export interface MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpecies {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  withdrawalPeriod?: MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpeciesWithdrawalPeriod;
}
export interface MedicinalProductPharmaceuticalRouteOfAdministration {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: CodeableConcept;
  firstDose?: Quantity;
  maxSingleDose?: Quantity;
  maxDosePerDay?: Quantity;
  maxDosePerTreatmentPeriod?: Ratio;
  maxTreatmentPeriod?: Duration;
  targetSpecies?: MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpecies;
}
export interface MedicinalProductPharmaceutical {
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
  characteristics?: MedicinalProductPharmaceuticalCharacteristics;
  routeOfAdministration: MedicinalProductPharmaceuticalRouteOfAdministration;
}

export interface MedicinalProductUndesirableEffect {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  profile?: canonical;
  min: unsignedInt;
  max?: string;
}
export interface MessageDefinitionAllowedResponse {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  message: canonical;
  situation?: markdown;
}
export interface MessageDefinition {
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
  focus?: MessageDefinitionFocus;
  responseRequired?: code;
  allowedResponse?: MessageDefinitionAllowedResponse;
  graph?: Array<canonical>;
}

export interface MessageHeaderDestination {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name?: string;
  target?: Reference;
  endpoint: url;
  receiver?: Reference;
}
export interface MessageHeaderSource {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier: id;
  code: code;
  details?: Reference;
}
export interface MessageHeader {
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
  destination?: MessageHeaderDestination;
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  start?: integer;
  end?: integer;
}
export interface MolecularSequenceStructureVariantInner {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  start?: integer;
  end?: integer;
}
export interface MolecularSequenceStructureVariant {
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
  variant?: MolecularSequenceVariant;
  observedSeq?: string;
  quality?: MolecularSequenceQuality;
  readCoverage?: integer;
  repository?: MolecularSequenceRepository;
  pointer?: Array<Reference>;
  structureVariant?: MolecularSequenceStructureVariant;
}

export interface NamingSystemUniqueId {
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
  uniqueId: NamingSystemUniqueId;
}

export interface NutritionOrderOralDietNutrient {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  modifier?: CodeableConcept;
  amount?: Quantity;
}
export interface NutritionOrderOralDietTexture {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  modifier?: CodeableConcept;
  foodType?: CodeableConcept;
}
export interface NutritionOrderOralDiet {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: Array<CodeableConcept>;
  schedule?: Array<Timing>;
  nutrient?: NutritionOrderOralDietNutrient;
  texture?: NutritionOrderOralDietTexture;
  fluidConsistencyType?: Array<CodeableConcept>;
  instruction?: string;
}
export interface NutritionOrderSupplement {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  schedule?: Timing;
  quantity?: Quantity;
  rateQuantity?: Quantity;
  rateRatio?: Ratio;
}
export interface NutritionOrderEnteralFormula {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  baseFormulaType?: CodeableConcept;
  baseFormulaProductName?: string;
  additiveType?: CodeableConcept;
  additiveProductName?: string;
  caloricDensity?: Quantity;
  routeofAdministration?: CodeableConcept;
  administration?: NutritionOrderEnteralFormulaAdministration;
  maxVolumeToDeliver?: Quantity;
  administrationInstruction?: string;
}
export interface NutritionOrder {
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
  supplement?: NutritionOrderSupplement;
  enteralFormula?: NutritionOrderEnteralFormula;
  note?: Array<Annotation>;
}

export interface ObservationReferenceRange {
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
  referenceRange?: ObservationReferenceRange;
  hasMember?: Array<Reference>;
  derivedFrom?: Array<Reference>;
  component?: ObservationComponent;
}

export interface ObservationDefinitionQuantitativeDetails {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  customaryUnit?: CodeableConcept;
  unit?: CodeableConcept;
  conversionFactor?: decimal;
  decimalPrecision?: integer;
}
export interface ObservationDefinitionQualifiedInterval {
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
  qualifiedInterval?: ObservationDefinitionQualifiedInterval;
  validCodedValueSet?: Reference;
  normalCodedValueSet?: Reference;
  abnormalCodedValueSet?: Reference;
  criticalCodedValueSet?: Reference;
}

export interface OperationDefinitionParameterBinding {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  strength: code;
  valueSet: canonical;
}
export interface OperationDefinitionParameterReferencedFrom {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  source: string;
  sourceId?: string;
}
export interface OperationDefinitionParameter {
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
  referencedFrom?: OperationDefinitionParameterReferencedFrom;
  part?: OperationDefinitionParameter;
}
export interface OperationDefinitionOverload {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  parameterName?: Array<string>;
  comment?: string;
}
export interface OperationDefinition {
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
  parameter?: OperationDefinitionParameter;
  overload?: OperationDefinitionOverload;
}

export interface OperationOutcomeIssue {
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
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  issue: OperationOutcomeIssue;
}

export interface OrganizationContact {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  purpose?: CodeableConcept;
  name?: HumanName;
  telecom?: Array<ContactPoint>;
  address?: Address;
}
export interface Organization {
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
  contact?: OrganizationContact;
  endpoint?: Array<Reference>;
}

export interface OrganizationAffiliation {
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
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  parameter?: ParametersParameter;
}

export interface PatientContact {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  language: CodeableConcept;
  preferred?: boolean;
}
export interface PatientLink {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  other: Reference;
  type: code;
}
export interface Patient {
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
  contact?: PatientContact;
  communication?: PatientCommunication;
  generalPractitioner?: Array<Reference>;
  managingOrganization?: Reference;
  link?: PatientLink;
}

export interface PaymentNotice {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: code;
  text?: string;
}
export interface PaymentReconciliation {
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
  detail?: PaymentReconciliationDetail;
  formCode?: CodeableConcept;
  processNote?: PaymentReconciliationProcessNote;
}

export interface PersonLink {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  target: Reference;
  assurance?: code;
}
export interface Person {
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
  link?: PersonLink;
}

export interface PlanDefinitionGoalTarget {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  category?: CodeableConcept;
  description: CodeableConcept;
  priority?: CodeableConcept;
  start?: CodeableConcept;
  addresses?: Array<CodeableConcept>;
  documentation?: Array<RelatedArtifact>;
  target?: PlanDefinitionGoalTarget;
}
export interface PlanDefinitionActionCondition {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  kind: code;
  expression?: Expression;
}
export interface PlanDefinitionActionRelatedAction {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  actionId: id;
  relationship: code;
  offsetDuration?: Duration;
  offsetRange?: Range;
}
export interface PlanDefinitionActionParticipant {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  role?: CodeableConcept;
}
export interface PlanDefinitionActionDynamicValue {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  path?: string;
  expression?: Expression;
}
export interface PlanDefinitionAction {
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
  condition?: PlanDefinitionActionCondition;
  input?: Array<DataRequirement>;
  output?: Array<DataRequirement>;
  relatedAction?: PlanDefinitionActionRelatedAction;
  timingDateTime?: dateTime;
  timingAge?: Age;
  timingPeriod?: Period;
  timingDuration?: Duration;
  timingRange?: Range;
  timingTiming?: Timing;
  participant?: PlanDefinitionActionParticipant;
  type?: CodeableConcept;
  groupingBehavior?: code;
  selectionBehavior?: code;
  requiredBehavior?: code;
  precheckBehavior?: code;
  cardinalityBehavior?: code;
  definitionCanonical?: canonical;
  definitionUri?: uri;
  transform?: canonical;
  dynamicValue?: PlanDefinitionActionDynamicValue;
  action?: PlanDefinitionAction;
}
export interface PlanDefinition {
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
  goal?: PlanDefinitionGoal;
  action?: PlanDefinitionAction;
}

export interface PractitionerQualification {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Array<Identifier>;
  code: CodeableConcept;
  period?: Period;
  issuer?: Reference;
}
export interface Practitioner {
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
  qualification?: PractitionerQualification;
  communication?: Array<CodeableConcept>;
}

export interface PractitionerRoleAvailableTime {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  daysOfWeek?: Array<code>;
  allDay?: boolean;
  availableStartTime?: time;
  availableEndTime?: time;
}
export interface PractitionerRoleNotAvailable {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description: string;
  during?: Period;
}
export interface PractitionerRole {
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
  availableTime?: PractitionerRoleAvailableTime;
  notAvailable?: PractitionerRoleNotAvailable;
  availabilityExceptions?: string;
  endpoint?: Array<Reference>;
}

export interface ProcedurePerformer {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  function?: CodeableConcept;
  actor: Reference;
  onBehalfOf?: Reference;
}
export interface ProcedureFocalDevice {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action?: CodeableConcept;
  manipulated: Reference;
}
export interface Procedure {
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
  performer?: ProcedurePerformer;
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
  focalDevice?: ProcedureFocalDevice;
  usedReference?: Array<Reference>;
  usedCode?: Array<CodeableConcept>;
}

export interface ProvenanceAgent {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  role?: Array<CodeableConcept>;
  who: Reference;
  onBehalfOf?: Reference;
}
export interface ProvenanceEntity {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  role: code;
  what: Reference;
  agent?: ProvenanceAgent;
}
export interface Provenance {
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
  agent: ProvenanceAgent;
  entity?: ProvenanceEntity;
  signature?: Array<Signature>;
}

export interface QuestionnaireItemEnableWhen {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  linkId: string;
  definition?: uri;
  code?: Array<Coding>;
  prefix?: string;
  text?: string;
  type: code;
  enableWhen?: QuestionnaireItemEnableWhen;
  enableBehavior?: code;
  required?: boolean;
  repeats?: boolean;
  readOnly?: boolean;
  maxLength?: integer;
  answerValueSet?: canonical;
  answerOption?: QuestionnaireItemAnswerOption;
  initial?: QuestionnaireItemInitial;
  item?: QuestionnaireItem;
}
export interface Questionnaire {
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
  item?: QuestionnaireItem;
}

export interface QuestionnaireResponseItemAnswer {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  linkId: string;
  definition?: uri;
  text?: string;
  answer?: QuestionnaireResponseItemAnswer;
  item?: QuestionnaireResponseItem;
}
export interface QuestionnaireResponse {
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
  item?: QuestionnaireResponseItem;
}

export interface RelatedPersonCommunication {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  language: CodeableConcept;
  preferred?: boolean;
}
export interface RelatedPerson {
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
  communication?: RelatedPersonCommunication;
}

export interface RequestGroupActionCondition {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  kind: code;
  expression?: Expression;
}
export interface RequestGroupActionRelatedAction {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  actionId: id;
  relationship: code;
  offsetDuration?: Duration;
  offsetRange?: Range;
}
export interface RequestGroupAction {
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
  condition?: RequestGroupActionCondition;
  relatedAction?: RequestGroupActionRelatedAction;
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
  action?: RequestGroupAction;
}

export interface ResearchDefinition {
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
  characteristic: ResearchElementDefinitionCharacteristic;
}

export interface ResearchStudyArm {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  type?: CodeableConcept;
  description?: string;
}
export interface ResearchStudyObjective {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name?: string;
  type?: CodeableConcept;
}
export interface ResearchStudy {
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
  arm?: ResearchStudyArm;
  objective?: ResearchStudyObjective;
}

export interface ResearchSubject {
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
  prediction?: RiskAssessmentPrediction;
  mitigation?: string;
  note?: Array<Annotation>;
}

export interface RiskEvidenceSynthesisSampleSize {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  numberOfStudies?: integer;
  numberOfParticipants?: integer;
}
export interface RiskEvidenceSynthesisRiskEstimatePrecisionEstimate {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  level?: decimal;
  from?: decimal;
  to?: decimal;
}
export interface RiskEvidenceSynthesisRiskEstimate {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description?: string;
  type?: CodeableConcept;
  value?: decimal;
  unitOfMeasure?: CodeableConcept;
  denominatorCount?: integer;
  numeratorCount?: integer;
  precisionEstimate?: RiskEvidenceSynthesisRiskEstimatePrecisionEstimate;
}
export interface RiskEvidenceSynthesisCertaintyCertaintySubcomponent {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  rating?: Array<CodeableConcept>;
  note?: Array<Annotation>;
}
export interface RiskEvidenceSynthesisCertainty {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  rating?: Array<CodeableConcept>;
  note?: Array<Annotation>;
  certaintySubcomponent?: RiskEvidenceSynthesisCertaintyCertaintySubcomponent;
}
export interface RiskEvidenceSynthesis {
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
  certainty?: RiskEvidenceSynthesisCertainty;
}

export interface Schedule {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  definition: canonical;
  expression: string;
}
export interface SearchParameter {
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
  component?: SearchParameterComponent;
}

export interface ServiceRequest {
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
  processing?: SpecimenProcessing;
  container?: SpecimenContainer;
  condition?: Array<CodeableConcept>;
  note?: Array<Annotation>;
}

export interface SpecimenDefinitionTypeTestedContainerAdditive {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  additiveCodeableConcept?: CodeableConcept;
  additiveReference?: Reference;
}
export interface SpecimenDefinitionTypeTestedContainer {
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
  additive?: SpecimenDefinitionTypeTestedContainerAdditive;
  preparation?: string;
}
export interface SpecimenDefinitionTypeTestedHandling {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  temperatureQualifier?: CodeableConcept;
  temperatureRange?: Range;
  maxDuration?: Duration;
  instruction?: string;
}
export interface SpecimenDefinitionTypeTested {
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
  handling?: SpecimenDefinitionTypeTestedHandling;
}
export interface SpecimenDefinition {
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
  typeTested?: SpecimenDefinitionTypeTested;
}

export interface StructureDefinitionMapping {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identity: id;
  uri?: uri;
  name?: string;
  comment?: string;
}
export interface StructureDefinitionContext {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  expression: string;
}
export interface StructureDefinitionSnapshot {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  element: Array<ElementDefinition>;
}
export interface StructureDefinitionDifferential {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  element: Array<ElementDefinition>;
}
export interface StructureDefinition {
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
  mapping?: StructureDefinitionMapping;
  kind: code;
  abstract: boolean;
  context?: StructureDefinitionContext;
  contextInvariant?: Array<string>;
  type: uri;
  baseDefinition?: canonical;
  derivation?: code;
  snapshot?: StructureDefinitionSnapshot;
  differential?: StructureDefinitionDifferential;
}

export interface StructureMapStructure {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url: canonical;
  mode: code;
  alias?: string;
  documentation?: string;
}
export interface StructureMapGroupInput {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: id;
  type?: string;
  mode: code;
  documentation?: string;
}
export interface StructureMapGroupRuleSource {
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
  parameter?: StructureMapGroupRuleTargetParameter;
}
export interface StructureMapGroupRuleDependent {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: id;
  variable: Array<string>;
}
export interface StructureMapGroupRule {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: id;
  source: StructureMapGroupRuleSource;
  target?: StructureMapGroupRuleTarget;
  rule?: StructureMapGroupRule;
  dependent?: StructureMapGroupRuleDependent;
  documentation?: string;
}
export interface StructureMapGroup {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: id;
  extends?: id;
  typeMode: code;
  documentation?: string;
  input: StructureMapGroupInput;
  rule: StructureMapGroupRule;
}
export interface StructureMap {
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
  structure?: StructureMapStructure;
  import?: Array<canonical>;
  group: StructureMapGroup;
}

export interface SubscriptionChannel {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  endpoint?: url;
  payload?: code;
  header?: Array<string>;
}
export interface Subscription {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  expiry?: dateTime;
  quantity?: Quantity;
}
export interface SubstanceIngredient {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  quantity?: Ratio;
  substanceCodeableConcept?: CodeableConcept;
  substanceReference?: Reference;
}
export interface Substance {
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
  instance?: SubstanceInstance;
  ingredient?: SubstanceIngredient;
}

export interface SubstanceNucleicAcidSubunitLinkage {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  connectivity?: string;
  identifier?: Identifier;
  name?: string;
  residueSite?: string;
}
export interface SubstanceNucleicAcidSubunitSugar {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: Identifier;
  name?: string;
  residueSite?: string;
}
export interface SubstanceNucleicAcidSubunit {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  subunit?: integer;
  sequence?: string;
  length?: integer;
  sequenceAttachment?: Attachment;
  fivePrime?: CodeableConcept;
  threePrime?: CodeableConcept;
  linkage?: SubstanceNucleicAcidSubunitLinkage;
  sugar?: SubstanceNucleicAcidSubunitSugar;
}
export interface SubstanceNucleicAcid {
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
  subunit?: SubstanceNucleicAcidSubunit;
}

export interface SubstancePolymerMonomerSetStartingMaterial {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  material?: CodeableConcept;
  type?: CodeableConcept;
  isDefining?: boolean;
  amount?: SubstanceAmount;
}
export interface SubstancePolymerMonomerSet {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  ratioType?: CodeableConcept;
  startingMaterial?: SubstancePolymerMonomerSetStartingMaterial;
}
export interface SubstancePolymerRepeatRepeatUnitDegreeOfPolymerisation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  degree?: CodeableConcept;
  amount?: SubstanceAmount;
}
export interface SubstancePolymerRepeatRepeatUnitStructuralRepresentation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  representation?: string;
  attachment?: Attachment;
}
export interface SubstancePolymerRepeatRepeatUnit {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  orientationOfPolymerisation?: CodeableConcept;
  repeatUnit?: string;
  amount?: SubstanceAmount;
  degreeOfPolymerisation?: SubstancePolymerRepeatRepeatUnitDegreeOfPolymerisation;
  structuralRepresentation?: SubstancePolymerRepeatRepeatUnitStructuralRepresentation;
}
export interface SubstancePolymerRepeat {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  numberOfUnits?: integer;
  averageMolecularFormula?: string;
  repeatUnitAmountType?: CodeableConcept;
  repeatUnit?: SubstancePolymerRepeatRepeatUnit;
}
export interface SubstancePolymer {
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
  monomerSet?: SubstancePolymerMonomerSet;
  repeat?: SubstancePolymerRepeat;
}

export interface SubstanceProteinSubunit {
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
  subunit?: SubstanceProteinSubunit;
}

export interface SubstanceReferenceInformationGene {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  geneSequenceOrigin?: CodeableConcept;
  gene?: CodeableConcept;
  source?: Array<Reference>;
}
export interface SubstanceReferenceInformationGeneElement {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  element?: Identifier;
  source?: Array<Reference>;
}
export interface SubstanceReferenceInformationClassification {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  domain?: CodeableConcept;
  classification?: CodeableConcept;
  subtype?: Array<CodeableConcept>;
  source?: Array<Reference>;
}
export interface SubstanceReferenceInformationTarget {
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
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Array<Resource>;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  comment?: string;
  gene?: SubstanceReferenceInformationGene;
  geneElement?: SubstanceReferenceInformationGeneElement;
  classification?: SubstanceReferenceInformationClassification;
  target?: SubstanceReferenceInformationTarget;
}

export interface SubstanceSourceMaterialFractionDescription {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  fraction?: string;
  materialType?: CodeableConcept;
}
export interface SubstanceSourceMaterialOrganismAuthor {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  authorType?: CodeableConcept;
  authorDescription?: string;
}
export interface SubstanceSourceMaterialOrganismHybrid {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  kingdom?: CodeableConcept;
  phylum?: CodeableConcept;
  class?: CodeableConcept;
  order?: CodeableConcept;
}
export interface SubstanceSourceMaterialOrganism {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  family?: CodeableConcept;
  genus?: CodeableConcept;
  species?: CodeableConcept;
  intraspecificType?: CodeableConcept;
  intraspecificDescription?: string;
  author?: SubstanceSourceMaterialOrganismAuthor;
  hybrid?: SubstanceSourceMaterialOrganismHybrid;
  organismGeneral?: SubstanceSourceMaterialOrganismOrganismGeneral;
}
export interface SubstanceSourceMaterialPartDescription {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  part?: CodeableConcept;
  partLocation?: CodeableConcept;
}
export interface SubstanceSourceMaterial {
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
  fractionDescription?: SubstanceSourceMaterialFractionDescription;
  organism?: SubstanceSourceMaterialOrganism;
  partDescription?: SubstanceSourceMaterialPartDescription;
}

export interface SubstanceSpecificationMoiety {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  method?: CodeableConcept;
  type?: CodeableConcept;
  amount?: Quantity;
}
export interface SubstanceSpecificationStructureIsotope {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type?: CodeableConcept;
  representation?: string;
  attachment?: Attachment;
}
export interface SubstanceSpecificationStructure {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  stereochemistry?: CodeableConcept;
  opticalActivity?: CodeableConcept;
  molecularFormula?: string;
  molecularFormulaByMoiety?: string;
  isotope?: SubstanceSpecificationStructureIsotope;
  molecularWeight?: SubstanceSpecificationStructureIsotopeMolecularWeight;
  source?: Array<Reference>;
  representation?: SubstanceSpecificationStructureRepresentation;
}
export interface SubstanceSpecificationCode {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  authority?: CodeableConcept;
  status?: CodeableConcept;
  date?: dateTime;
}
export interface SubstanceSpecificationName {
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
  official?: SubstanceSpecificationNameOfficial;
  source?: Array<Reference>;
}
export interface SubstanceSpecificationRelationship {
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
  moiety?: SubstanceSpecificationMoiety;
  property?: SubstanceSpecificationProperty;
  referenceInformation?: Reference;
  structure?: SubstanceSpecificationStructure;
  code?: SubstanceSpecificationCode;
  name?: SubstanceSpecificationName;
  molecularWeight?: SubstanceSpecificationStructureIsotopeMolecularWeight;
  relationship?: SubstanceSpecificationRelationship;
  nucleicAcid?: Reference;
  polymer?: Reference;
  protein?: Reference;
  sourceMaterial?: Reference;
}

export interface SupplyDeliverySuppliedItem {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  quantity?: Quantity;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
}
export interface SupplyDelivery {
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
  parameter?: SupplyRequestParameter;
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  repetitions?: positiveInt;
  period?: Period;
  recipient?: Array<Reference>;
}
export interface TaskInput {
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
  input?: TaskInput;
  output?: TaskOutput;
}

export interface TerminologyCapabilitiesSoftware {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: string;
  version?: string;
}
export interface TerminologyCapabilitiesImplementation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  description: string;
  url?: url;
}
export interface TerminologyCapabilitiesCodeSystemVersionFilter {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  op: Array<code>;
}
export interface TerminologyCapabilitiesCodeSystemVersion {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code?: string;
  isDefault?: boolean;
  compositional?: boolean;
  language?: Array<code>;
  filter?: TerminologyCapabilitiesCodeSystemVersionFilter;
  property?: Array<code>;
}
export interface TerminologyCapabilitiesCodeSystem {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  uri?: canonical;
  version?: TerminologyCapabilitiesCodeSystemVersion;
  subsumption?: boolean;
}
export interface TerminologyCapabilitiesExpansionParameter {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name: code;
  documentation?: string;
}
export interface TerminologyCapabilitiesExpansion {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  hierarchical?: boolean;
  paging?: boolean;
  incomplete?: boolean;
  parameter?: TerminologyCapabilitiesExpansionParameter;
  textFilter?: markdown;
}
export interface TerminologyCapabilitiesValidateCode {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  translations: boolean;
}
export interface TerminologyCapabilitiesTranslation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  needsMap: boolean;
}
export interface TerminologyCapabilitiesClosure {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  translation?: boolean;
}
export interface TerminologyCapabilities {
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
  codeSystem?: TerminologyCapabilitiesCodeSystem;
  expansion?: TerminologyCapabilitiesExpansion;
  codeSearch?: code;
  validateCode?: TerminologyCapabilitiesValidateCode;
  translation?: TerminologyCapabilitiesTranslation;
  closure?: TerminologyCapabilitiesClosure;
}

export interface TestReportParticipant {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  type: code;
  uri: uri;
  display?: string;
}
export interface TestReportSetupActionOperation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  result: code;
  message?: markdown;
  detail?: uri;
}
export interface TestReportSetupActionAssert {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  result: code;
  message?: markdown;
  detail?: string;
}
export interface TestReportSetupAction {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation?: TestReportSetupActionOperation;
  assert?: TestReportSetupActionAssert;
}
export interface TestReportSetup {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action: TestReportSetupAction;
}
export interface TestReportTestAction {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation?: TestReportSetupActionOperation;
  assert?: TestReportSetupActionAssert;
}
export interface TestReportTest {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name?: string;
  description?: string;
  action: TestReportTestAction;
}
export interface TestReportTeardownAction {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation: TestReportSetupActionOperation;
}
export interface TestReportTeardown {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action: TestReportTeardownAction;
}
export interface TestReport {
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
  participant?: TestReportParticipant;
  setup?: TestReportSetup;
  test?: TestReportTest;
  teardown?: TestReportTeardown;
}

export interface TestScriptOrigin {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  index: integer;
  profile: Coding;
}
export interface TestScriptDestination {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  index: integer;
  profile: Coding;
}
export interface TestScriptMetadataLink {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  url: uri;
  description?: string;
}
export interface TestScriptMetadataCapability {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  link?: TestScriptMetadataLink;
  capability: TestScriptMetadataCapability;
}
export interface TestScriptFixture {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  autocreate: boolean;
  autodelete: boolean;
  resource?: Reference;
}
export interface TestScriptVariable {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  field: string;
  value: string;
}
export interface TestScriptSetupActionOperation {
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
  requestHeader?: TestScriptSetupActionOperationRequestHeader;
  requestId?: id;
  responseId?: id;
  sourceId?: id;
  targetId?: id;
  url?: string;
}
export interface TestScriptSetupActionAssert {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation?: TestScriptSetupActionOperation;
  assert?: TestScriptSetupActionAssert;
}
export interface TestScriptSetup {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action: TestScriptSetupAction;
}
export interface TestScriptTestAction {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation?: TestScriptSetupActionOperation;
  assert?: TestScriptSetupActionAssert;
}
export interface TestScriptTest {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  name?: string;
  description?: string;
  action: TestScriptTestAction;
}
export interface TestScriptTeardownAction {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  operation: TestScriptSetupActionOperation;
}
export interface TestScriptTeardown {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  action: TestScriptTeardownAction;
}
export interface TestScript {
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
  origin?: TestScriptOrigin;
  destination?: TestScriptDestination;
  metadata?: TestScriptMetadata;
  fixture?: TestScriptFixture;
  profile?: Array<Reference>;
  variable?: TestScriptVariable;
  setup?: TestScriptSetup;
  test?: TestScriptTest;
  teardown?: TestScriptTeardown;
}

export interface ValueSetComposeIncludeConceptDesignation {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  language?: code;
  use?: Coding;
  value: string;
}
export interface ValueSetComposeIncludeConcept {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  code: code;
  display?: string;
  designation?: ValueSetComposeIncludeConceptDesignation;
}
export interface ValueSetComposeIncludeFilter {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  property: code;
  op: code;
  value: string;
}
export interface ValueSetComposeInclude {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  system?: uri;
  version?: string;
  concept?: ValueSetComposeIncludeConcept;
  filter?: ValueSetComposeIncludeFilter;
  valueSet?: Array<canonical>;
}
export interface ValueSetCompose {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  lockedDate?: date;
  inactive?: boolean;
  include: ValueSetComposeInclude;
  exclude?: ValueSetComposeInclude;
}
export interface ValueSetExpansionParameter {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  identifier?: uri;
  timestamp: dateTime;
  total?: integer;
  offset?: integer;
  parameter?: ValueSetExpansionParameter;
  contains?: ValueSetExpansionContains;
}
export interface ValueSet {
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
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  organization: Reference;
  identityCertificate?: string;
  attestationSignature?: Signature;
}
export interface VerificationResult {
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
  primarySource?: VerificationResultPrimarySource;
  attestation?: VerificationResultAttestation;
  validator?: VerificationResultValidator;
}

export interface VisionPrescriptionLensSpecificationPrism {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  amount: decimal;
  base: code;
}
export interface VisionPrescriptionLensSpecification {
  id?: string;
  extension?: Array<Extension>;
  modifierExtension?: Array<Extension>;
  product: CodeableConcept;
  eye: code;
  sphere?: decimal;
  cylinder?: decimal;
  axis?: integer;
  prism?: VisionPrescriptionLensSpecificationPrism;
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
  lensSpecification: VisionPrescriptionLensSpecification;
}