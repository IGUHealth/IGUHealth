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
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * home | work | temp | old | billing - purpose of this address
   */
  use?: code;
  /* 
   * postal | physical | both
   */
  type?: code;
  /* 
   * Text representation of the address
   */
  text?: string;
  /* 
   * Street name, number, direction & P.O. Box etc.
   */
  line?: Array<string>;
  /* 
   * Name of city, town etc.
   */
  city?: string;
  /* 
   * District name (aka county)
   */
  district?: string;
  /* 
   * Sub-unit of country (abbreviations ok)
   */
  state?: string;
  /* 
   * Postal code for area
   */
  postalCode?: string;
  /* 
   * Country (e.g. can be ISO 3166 2 or 3 letter code)
   */
  country?: string;
  /* 
   * Time period when address was/is in use
   */
  period?: Period;
}

export interface Age {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Numerical value (with implicit precision)
   */
  value?: decimal;
  /* 
   * < | <= | >= | > - how to understand the value
   */
  comparator?: code;
  /* 
   * Unit representation
   */
  unit?: string;
  /* 
   * System that defines coded unit form
   */
  system?: uri;
  /* 
   * Coded form of the unit
   */
  code?: code;
}

export interface Annotation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Individual responsible for the annotation
   */
  authorReference?: Reference;
  /* 
   * Individual responsible for the annotation
   */
  authorString?: string;
  /* 
   * When the annotation was made
   */
  time?: dateTime;
  /* 
   * The annotation  - text content (as markdown)
   */
  text: markdown;
}

export interface Attachment {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Mime type of the content, with charset etc.
   */
  contentType?: code;
  /* 
   * Human language of the content (BCP-47)
   */
  language?: code;
  /* 
   * Data inline, base64ed
   */
  data?: base64Binary;
  /* 
   * Uri where the data can be found
   */
  url?: url;
  /* 
   * Number of bytes of content (if url provided)
   */
  size?: unsignedInt;
  /* 
   * Hash of the data (sha-1, base64ed)
   */
  hash?: base64Binary;
  /* 
   * Label to display in place of the data
   */
  title?: string;
  /* 
   * Date attachment was first created
   */
  creation?: dateTime;
}

export interface CodeableConcept {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Code defined by a terminology system
   */
  coding?: Array<Coding>;
  /* 
   * Plain text representation of the concept
   */
  text?: string;
}

export interface Coding {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Identity of the terminology system
   */
  system?: uri;
  /* 
   * Version of the system - if relevant
   */
  version?: string;
  /* 
   * Symbol in syntax defined by the system
   */
  code?: code;
  /* 
   * Representation defined by the system
   */
  display?: string;
  /* 
   * If this coding was chosen directly by the user
   */
  userSelected?: boolean;
}

export interface ContactDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Name of an individual to contact
   */
  name?: string;
  /* 
   * Contact details for individual or organization
   */
  telecom?: Array<ContactPoint>;
}

export interface ContactPoint {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * phone | fax | email | pager | url | sms | other
   */
  system?: code;
  /* 
   * The actual contact point details
   */
  value?: string;
  /* 
   * home | work | temp | old | mobile - purpose of this contact point
   */
  use?: code;
  /* 
   * Specify preferred order of use (1 = highest)
   */
  rank?: positiveInt;
  /* 
   * Time period when the contact point was/is in use
   */
  period?: Period;
}

export interface Contributor {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * author | editor | reviewer | endorser
   */
  type: code;
  /* 
   * Who contributed the content
   */
  name: string;
  /* 
   * Contact details of the contributor
   */
  contact?: Array<ContactDetail>;
}

export interface Count {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Numerical value (with implicit precision)
   */
  value?: decimal;
  /* 
   * < | <= | >= | > - how to understand the value
   */
  comparator?: code;
  /* 
   * Unit representation
   */
  unit?: string;
  /* 
   * System that defines coded unit form
   */
  system?: uri;
  /* 
   * Coded form of the unit
   */
  code?: code;
}

export interface DataRequirementCodeFilter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * A code-valued attribute to filter on
   */
  path?: string;
  /* 
   * A coded (token) parameter to search on
   */
  searchParam?: string;
  /* 
   * Valueset for the filter
   */
  valueSet?: canonical;
  /* 
   * What code is expected
   */
  code?: Array<Coding>;
}
export interface DataRequirementDateFilter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * A date-valued attribute to filter on
   */
  path?: string;
  /* 
   * A date valued parameter to search on
   */
  searchParam?: string;
  /* 
   * The value of the filter, as a Period, DateTime, or Duration value
   */
  valueDateTime?: dateTime;
  /* 
   * The value of the filter, as a Period, DateTime, or Duration value
   */
  valuePeriod?: Period;
  /* 
   * The value of the filter, as a Period, DateTime, or Duration value
   */
  valueDuration?: Duration;
}
export interface DataRequirementSort {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * The name of the attribute to perform the sort
   */
  path: string;
  /* 
   * ascending | descending
   */
  direction: code;
}
export interface DataRequirement {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * The type of the required data
   */
  type: code;
  /* 
   * The profile of the required data
   */
  profile?: Array<canonical>;
  /* 
   * E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device
   */
  subjectCodeableConcept?: CodeableConcept;
  /* 
   * E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device
   */
  subjectReference?: Reference;
  /* 
   * Indicates specific structure elements that are referenced by the knowledge module
   */
  mustSupport?: Array<string>;
  /* 
   * What codes are expected
   */
  codeFilter?: Array<DataRequirementCodeFilter>;
  /* 
   * What dates/date ranges are expected
   */
  dateFilter?: Array<DataRequirementDateFilter>;
  /* 
   * Number of results
   */
  limit?: positiveInt;
  /* 
   * Order of the results
   */
  sort?: Array<DataRequirementSort>;
}

export interface Distance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Numerical value (with implicit precision)
   */
  value?: decimal;
  /* 
   * < | <= | >= | > - how to understand the value
   */
  comparator?: code;
  /* 
   * Unit representation
   */
  unit?: string;
  /* 
   * System that defines coded unit form
   */
  system?: uri;
  /* 
   * Coded form of the unit
   */
  code?: code;
}

export interface DosageDoseAndRate {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * The kind of dose or rate specified
   */
  type?: CodeableConcept;
  /* 
   * Amount of medication per dose
   */
  doseRange?: Range;
  /* 
   * Amount of medication per dose
   */
  doseQuantity?: Quantity;
  /* 
   * Amount of medication per unit of time
   */
  rateRatio?: Ratio;
  /* 
   * Amount of medication per unit of time
   */
  rateRange?: Range;
  /* 
   * Amount of medication per unit of time
   */
  rateQuantity?: Quantity;
}
export interface Dosage {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The order of the dosage instructions
   */
  sequence?: integer;
  /* 
   * Free text dosage instructions e.g. SIG
   */
  text?: string;
  /* 
   * Supplemental instruction or warnings to the patient - e.g. "with meals", "may cause drowsiness"
   */
  additionalInstruction?: Array<CodeableConcept>;
  /* 
   * Patient or consumer oriented instructions
   */
  patientInstruction?: string;
  /* 
   * When medication should be administered
   */
  timing?: Timing;
  /* 
   * Take "as needed" (for x)
   */
  asNeededBoolean?: boolean;
  /* 
   * Take "as needed" (for x)
   */
  asNeededCodeableConcept?: CodeableConcept;
  /* 
   * Body site to administer to
   */
  site?: CodeableConcept;
  /* 
   * How drug should enter body
   */
  route?: CodeableConcept;
  /* 
   * Technique for administering medication
   */
  method?: CodeableConcept;
  /* 
   * Amount of medication administered
   */
  doseAndRate?: Array<DosageDoseAndRate>;
  /* 
   * Upper limit on medication per unit of time
   */
  maxDosePerPeriod?: Ratio;
  /* 
   * Upper limit on medication per administration
   */
  maxDosePerAdministration?: Quantity;
  /* 
   * Upper limit on medication per lifetime of the patient
   */
  maxDosePerLifetime?: Quantity;
}

export interface Duration {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Numerical value (with implicit precision)
   */
  value?: decimal;
  /* 
   * < | <= | >= | > - how to understand the value
   */
  comparator?: code;
  /* 
   * Unit representation
   */
  unit?: string;
  /* 
   * System that defines coded unit form
   */
  system?: uri;
  /* 
   * Coded form of the unit
   */
  code?: code;
}

export interface ElementDefinitionSlicingDiscriminator {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * value | exists | pattern | type | profile
   */
  type: code;
  /* 
   * Path to element value
   */
  path: string;
}
export interface ElementDefinitionSlicing {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Element values that are used to distinguish the slices
   */
  discriminator?: Array<ElementDefinitionSlicingDiscriminator>;
  /* 
   * Text description of how slicing works (or not)
   */
  description?: string;
  /* 
   * If elements must be in same order as slices
   */
  ordered?: boolean;
  /* 
   * closed | open | openAtEnd
   */
  rules: code;
}
export interface ElementDefinitionBase {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Path that identifies the base element
   */
  path: string;
  /* 
   * Min cardinality of the base element
   */
  min: unsignedInt;
  /* 
   * Max cardinality of the base element
   */
  max: string;
}
export interface ElementDefinitionType {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Data type or Resource (reference to definition)
   */
  code: uri;
  /* 
   * Profiles (StructureDefinition or IG) - one must apply
   */
  profile?: Array<canonical>;
  /* 
   * Profile (StructureDefinition or IG) on the Reference/canonical target - one must apply
   */
  targetProfile?: Array<canonical>;
  /* 
   * contained | referenced | bundled - how aggregated
   */
  aggregation?: Array<code>;
  /* 
   * either | independent | specific
   */
  versioning?: code;
}
export interface ElementDefinitionExample {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Describes the purpose of this example
   */
  label: string;
  /* 
   * Value of Example (one of allowed types)
   */
  valueBase64Binary?: base64Binary;
  /* 
   * Value of Example (one of allowed types)
   */
  valueBoolean?: boolean;
  /* 
   * Value of Example (one of allowed types)
   */
  valueCanonical?: canonical;
  /* 
   * Value of Example (one of allowed types)
   */
  valueCode?: code;
  /* 
   * Value of Example (one of allowed types)
   */
  valueDate?: date;
  /* 
   * Value of Example (one of allowed types)
   */
  valueDateTime?: dateTime;
  /* 
   * Value of Example (one of allowed types)
   */
  valueDecimal?: decimal;
  /* 
   * Value of Example (one of allowed types)
   */
  valueId?: id;
  /* 
   * Value of Example (one of allowed types)
   */
  valueInstant?: instant;
  /* 
   * Value of Example (one of allowed types)
   */
  valueInteger?: integer;
  /* 
   * Value of Example (one of allowed types)
   */
  valueMarkdown?: markdown;
  /* 
   * Value of Example (one of allowed types)
   */
  valueOid?: oid;
  /* 
   * Value of Example (one of allowed types)
   */
  valuePositiveInt?: positiveInt;
  /* 
   * Value of Example (one of allowed types)
   */
  valueString?: string;
  /* 
   * Value of Example (one of allowed types)
   */
  valueTime?: time;
  /* 
   * Value of Example (one of allowed types)
   */
  valueUnsignedInt?: unsignedInt;
  /* 
   * Value of Example (one of allowed types)
   */
  valueUri?: uri;
  /* 
   * Value of Example (one of allowed types)
   */
  valueUrl?: url;
  /* 
   * Value of Example (one of allowed types)
   */
  valueUuid?: uuid;
  /* 
   * Value of Example (one of allowed types)
   */
  valueAddress?: Address;
  /* 
   * Value of Example (one of allowed types)
   */
  valueAge?: Age;
  /* 
   * Value of Example (one of allowed types)
   */
  valueAnnotation?: Annotation;
  /* 
   * Value of Example (one of allowed types)
   */
  valueAttachment?: Attachment;
  /* 
   * Value of Example (one of allowed types)
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * Value of Example (one of allowed types)
   */
  valueCoding?: Coding;
  /* 
   * Value of Example (one of allowed types)
   */
  valueContactPoint?: ContactPoint;
  /* 
   * Value of Example (one of allowed types)
   */
  valueCount?: Count;
  /* 
   * Value of Example (one of allowed types)
   */
  valueDistance?: Distance;
  /* 
   * Value of Example (one of allowed types)
   */
  valueDuration?: Duration;
  /* 
   * Value of Example (one of allowed types)
   */
  valueHumanName?: HumanName;
  /* 
   * Value of Example (one of allowed types)
   */
  valueIdentifier?: Identifier;
  /* 
   * Value of Example (one of allowed types)
   */
  valueMoney?: Money;
  /* 
   * Value of Example (one of allowed types)
   */
  valuePeriod?: Period;
  /* 
   * Value of Example (one of allowed types)
   */
  valueQuantity?: Quantity;
  /* 
   * Value of Example (one of allowed types)
   */
  valueRange?: Range;
  /* 
   * Value of Example (one of allowed types)
   */
  valueRatio?: Ratio;
  /* 
   * Value of Example (one of allowed types)
   */
  valueReference?: Reference;
  /* 
   * Value of Example (one of allowed types)
   */
  valueSampledData?: SampledData;
  /* 
   * Value of Example (one of allowed types)
   */
  valueSignature?: Signature;
  /* 
   * Value of Example (one of allowed types)
   */
  valueTiming?: Timing;
  /* 
   * Value of Example (one of allowed types)
   */
  valueContactDetail?: ContactDetail;
  /* 
   * Value of Example (one of allowed types)
   */
  valueContributor?: Contributor;
  /* 
   * Value of Example (one of allowed types)
   */
  valueDataRequirement?: DataRequirement;
  /* 
   * Value of Example (one of allowed types)
   */
  valueExpression?: Expression;
  /* 
   * Value of Example (one of allowed types)
   */
  valueParameterDefinition?: ParameterDefinition;
  /* 
   * Value of Example (one of allowed types)
   */
  valueRelatedArtifact?: RelatedArtifact;
  /* 
   * Value of Example (one of allowed types)
   */
  valueTriggerDefinition?: TriggerDefinition;
  /* 
   * Value of Example (one of allowed types)
   */
  valueUsageContext?: UsageContext;
  /* 
   * Value of Example (one of allowed types)
   */
  valueDosage?: Dosage;
  /* 
   * Value of Example (one of allowed types)
   */
  valueMeta?: Meta;
}
export interface ElementDefinitionConstraint {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Target of 'condition' reference above
   */
  key: id;
  /* 
   * Why this constraint is necessary or appropriate
   */
  requirements?: string;
  /* 
   * error | warning
   */
  severity: code;
  /* 
   * Human description of constraint
   */
  human: string;
  /* 
   * FHIRPath expression of constraint
   */
  expression?: string;
  /* 
   * XPath expression of constraint
   */
  xpath?: string;
  /* 
   * Reference to original source of constraint
   */
  source?: canonical;
}
export interface ElementDefinitionBinding {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * required | extensible | preferred | example
   */
  strength: code;
  /* 
   * Human explanation of the value set
   */
  description?: string;
  /* 
   * Source of value set
   */
  valueSet?: canonical;
}
export interface ElementDefinitionMapping {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Reference to mapping declaration
   */
  identity: id;
  /* 
   * Computable language of mapping
   */
  language?: code;
  /* 
   * Details of the mapping
   */
  map: string;
  /* 
   * Comments about the mapping or its use
   */
  comment?: string;
}
export interface ElementDefinition {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Path of the element in the hierarchy of elements
   */
  path: string;
  /* 
   * xmlAttr | xmlText | typeAttr | cdaText | xhtml
   */
  representation?: Array<code>;
  /* 
   * Name for this particular element (in a set of slices)
   */
  sliceName?: string;
  /* 
   * If this slice definition constrains an inherited slice definition (or not)
   */
  sliceIsConstraining?: boolean;
  /* 
   * Name for element to display with or prompt for element
   */
  label?: string;
  /* 
   * Corresponding codes in terminologies
   */
  code?: Array<Coding>;
  /* 
   * This element is sliced - slices follow
   */
  slicing?: ElementDefinitionSlicing;
  /* 
   * Concise definition for space-constrained presentation
   */
  short?: string;
  /* 
   * Full formal definition as narrative text
   */
  definition?: markdown;
  /* 
   * Comments about the use of this element
   */
  comment?: markdown;
  /* 
   * Why this resource has been created
   */
  requirements?: markdown;
  /* 
   * Other names
   */
  alias?: Array<string>;
  /* 
   * Minimum Cardinality
   */
  min?: unsignedInt;
  /* 
   * Maximum Cardinality (a number or *)
   */
  max?: string;
  /* 
   * Base definition information for tools
   */
  base?: ElementDefinitionBase;
  /* 
   * Reference to definition of content for the element
   */
  contentReference?: uri;
  /* 
   * Data type and Profile for this element
   */
  type?: Array<ElementDefinitionType>;
  /* 
   * Specified value if missing from instance
   */
  defaultValueBase64Binary?: base64Binary;
  /* 
   * Specified value if missing from instance
   */
  defaultValueBoolean?: boolean;
  /* 
   * Specified value if missing from instance
   */
  defaultValueCanonical?: canonical;
  /* 
   * Specified value if missing from instance
   */
  defaultValueCode?: code;
  /* 
   * Specified value if missing from instance
   */
  defaultValueDate?: date;
  /* 
   * Specified value if missing from instance
   */
  defaultValueDateTime?: dateTime;
  /* 
   * Specified value if missing from instance
   */
  defaultValueDecimal?: decimal;
  /* 
   * Specified value if missing from instance
   */
  defaultValueId?: id;
  /* 
   * Specified value if missing from instance
   */
  defaultValueInstant?: instant;
  /* 
   * Specified value if missing from instance
   */
  defaultValueInteger?: integer;
  /* 
   * Specified value if missing from instance
   */
  defaultValueMarkdown?: markdown;
  /* 
   * Specified value if missing from instance
   */
  defaultValueOid?: oid;
  /* 
   * Specified value if missing from instance
   */
  defaultValuePositiveInt?: positiveInt;
  /* 
   * Specified value if missing from instance
   */
  defaultValueString?: string;
  /* 
   * Specified value if missing from instance
   */
  defaultValueTime?: time;
  /* 
   * Specified value if missing from instance
   */
  defaultValueUnsignedInt?: unsignedInt;
  /* 
   * Specified value if missing from instance
   */
  defaultValueUri?: uri;
  /* 
   * Specified value if missing from instance
   */
  defaultValueUrl?: url;
  /* 
   * Specified value if missing from instance
   */
  defaultValueUuid?: uuid;
  /* 
   * Specified value if missing from instance
   */
  defaultValueAddress?: Address;
  /* 
   * Specified value if missing from instance
   */
  defaultValueAge?: Age;
  /* 
   * Specified value if missing from instance
   */
  defaultValueAnnotation?: Annotation;
  /* 
   * Specified value if missing from instance
   */
  defaultValueAttachment?: Attachment;
  /* 
   * Specified value if missing from instance
   */
  defaultValueCodeableConcept?: CodeableConcept;
  /* 
   * Specified value if missing from instance
   */
  defaultValueCoding?: Coding;
  /* 
   * Specified value if missing from instance
   */
  defaultValueContactPoint?: ContactPoint;
  /* 
   * Specified value if missing from instance
   */
  defaultValueCount?: Count;
  /* 
   * Specified value if missing from instance
   */
  defaultValueDistance?: Distance;
  /* 
   * Specified value if missing from instance
   */
  defaultValueDuration?: Duration;
  /* 
   * Specified value if missing from instance
   */
  defaultValueHumanName?: HumanName;
  /* 
   * Specified value if missing from instance
   */
  defaultValueIdentifier?: Identifier;
  /* 
   * Specified value if missing from instance
   */
  defaultValueMoney?: Money;
  /* 
   * Specified value if missing from instance
   */
  defaultValuePeriod?: Period;
  /* 
   * Specified value if missing from instance
   */
  defaultValueQuantity?: Quantity;
  /* 
   * Specified value if missing from instance
   */
  defaultValueRange?: Range;
  /* 
   * Specified value if missing from instance
   */
  defaultValueRatio?: Ratio;
  /* 
   * Specified value if missing from instance
   */
  defaultValueReference?: Reference;
  /* 
   * Specified value if missing from instance
   */
  defaultValueSampledData?: SampledData;
  /* 
   * Specified value if missing from instance
   */
  defaultValueSignature?: Signature;
  /* 
   * Specified value if missing from instance
   */
  defaultValueTiming?: Timing;
  /* 
   * Specified value if missing from instance
   */
  defaultValueContactDetail?: ContactDetail;
  /* 
   * Specified value if missing from instance
   */
  defaultValueContributor?: Contributor;
  /* 
   * Specified value if missing from instance
   */
  defaultValueDataRequirement?: DataRequirement;
  /* 
   * Specified value if missing from instance
   */
  defaultValueExpression?: Expression;
  /* 
   * Specified value if missing from instance
   */
  defaultValueParameterDefinition?: ParameterDefinition;
  /* 
   * Specified value if missing from instance
   */
  defaultValueRelatedArtifact?: RelatedArtifact;
  /* 
   * Specified value if missing from instance
   */
  defaultValueTriggerDefinition?: TriggerDefinition;
  /* 
   * Specified value if missing from instance
   */
  defaultValueUsageContext?: UsageContext;
  /* 
   * Specified value if missing from instance
   */
  defaultValueDosage?: Dosage;
  /* 
   * Specified value if missing from instance
   */
  defaultValueMeta?: Meta;
  /* 
   * Implicit meaning when this element is missing
   */
  meaningWhenMissing?: markdown;
  /* 
   * What the order of the elements means
   */
  orderMeaning?: string;
  /* 
   * Value must be exactly this
   */
  fixedBase64Binary?: base64Binary;
  /* 
   * Value must be exactly this
   */
  fixedBoolean?: boolean;
  /* 
   * Value must be exactly this
   */
  fixedCanonical?: canonical;
  /* 
   * Value must be exactly this
   */
  fixedCode?: code;
  /* 
   * Value must be exactly this
   */
  fixedDate?: date;
  /* 
   * Value must be exactly this
   */
  fixedDateTime?: dateTime;
  /* 
   * Value must be exactly this
   */
  fixedDecimal?: decimal;
  /* 
   * Value must be exactly this
   */
  fixedId?: id;
  /* 
   * Value must be exactly this
   */
  fixedInstant?: instant;
  /* 
   * Value must be exactly this
   */
  fixedInteger?: integer;
  /* 
   * Value must be exactly this
   */
  fixedMarkdown?: markdown;
  /* 
   * Value must be exactly this
   */
  fixedOid?: oid;
  /* 
   * Value must be exactly this
   */
  fixedPositiveInt?: positiveInt;
  /* 
   * Value must be exactly this
   */
  fixedString?: string;
  /* 
   * Value must be exactly this
   */
  fixedTime?: time;
  /* 
   * Value must be exactly this
   */
  fixedUnsignedInt?: unsignedInt;
  /* 
   * Value must be exactly this
   */
  fixedUri?: uri;
  /* 
   * Value must be exactly this
   */
  fixedUrl?: url;
  /* 
   * Value must be exactly this
   */
  fixedUuid?: uuid;
  /* 
   * Value must be exactly this
   */
  fixedAddress?: Address;
  /* 
   * Value must be exactly this
   */
  fixedAge?: Age;
  /* 
   * Value must be exactly this
   */
  fixedAnnotation?: Annotation;
  /* 
   * Value must be exactly this
   */
  fixedAttachment?: Attachment;
  /* 
   * Value must be exactly this
   */
  fixedCodeableConcept?: CodeableConcept;
  /* 
   * Value must be exactly this
   */
  fixedCoding?: Coding;
  /* 
   * Value must be exactly this
   */
  fixedContactPoint?: ContactPoint;
  /* 
   * Value must be exactly this
   */
  fixedCount?: Count;
  /* 
   * Value must be exactly this
   */
  fixedDistance?: Distance;
  /* 
   * Value must be exactly this
   */
  fixedDuration?: Duration;
  /* 
   * Value must be exactly this
   */
  fixedHumanName?: HumanName;
  /* 
   * Value must be exactly this
   */
  fixedIdentifier?: Identifier;
  /* 
   * Value must be exactly this
   */
  fixedMoney?: Money;
  /* 
   * Value must be exactly this
   */
  fixedPeriod?: Period;
  /* 
   * Value must be exactly this
   */
  fixedQuantity?: Quantity;
  /* 
   * Value must be exactly this
   */
  fixedRange?: Range;
  /* 
   * Value must be exactly this
   */
  fixedRatio?: Ratio;
  /* 
   * Value must be exactly this
   */
  fixedReference?: Reference;
  /* 
   * Value must be exactly this
   */
  fixedSampledData?: SampledData;
  /* 
   * Value must be exactly this
   */
  fixedSignature?: Signature;
  /* 
   * Value must be exactly this
   */
  fixedTiming?: Timing;
  /* 
   * Value must be exactly this
   */
  fixedContactDetail?: ContactDetail;
  /* 
   * Value must be exactly this
   */
  fixedContributor?: Contributor;
  /* 
   * Value must be exactly this
   */
  fixedDataRequirement?: DataRequirement;
  /* 
   * Value must be exactly this
   */
  fixedExpression?: Expression;
  /* 
   * Value must be exactly this
   */
  fixedParameterDefinition?: ParameterDefinition;
  /* 
   * Value must be exactly this
   */
  fixedRelatedArtifact?: RelatedArtifact;
  /* 
   * Value must be exactly this
   */
  fixedTriggerDefinition?: TriggerDefinition;
  /* 
   * Value must be exactly this
   */
  fixedUsageContext?: UsageContext;
  /* 
   * Value must be exactly this
   */
  fixedDosage?: Dosage;
  /* 
   * Value must be exactly this
   */
  fixedMeta?: Meta;
  /* 
   * Value must have at least these property values
   */
  patternBase64Binary?: base64Binary;
  /* 
   * Value must have at least these property values
   */
  patternBoolean?: boolean;
  /* 
   * Value must have at least these property values
   */
  patternCanonical?: canonical;
  /* 
   * Value must have at least these property values
   */
  patternCode?: code;
  /* 
   * Value must have at least these property values
   */
  patternDate?: date;
  /* 
   * Value must have at least these property values
   */
  patternDateTime?: dateTime;
  /* 
   * Value must have at least these property values
   */
  patternDecimal?: decimal;
  /* 
   * Value must have at least these property values
   */
  patternId?: id;
  /* 
   * Value must have at least these property values
   */
  patternInstant?: instant;
  /* 
   * Value must have at least these property values
   */
  patternInteger?: integer;
  /* 
   * Value must have at least these property values
   */
  patternMarkdown?: markdown;
  /* 
   * Value must have at least these property values
   */
  patternOid?: oid;
  /* 
   * Value must have at least these property values
   */
  patternPositiveInt?: positiveInt;
  /* 
   * Value must have at least these property values
   */
  patternString?: string;
  /* 
   * Value must have at least these property values
   */
  patternTime?: time;
  /* 
   * Value must have at least these property values
   */
  patternUnsignedInt?: unsignedInt;
  /* 
   * Value must have at least these property values
   */
  patternUri?: uri;
  /* 
   * Value must have at least these property values
   */
  patternUrl?: url;
  /* 
   * Value must have at least these property values
   */
  patternUuid?: uuid;
  /* 
   * Value must have at least these property values
   */
  patternAddress?: Address;
  /* 
   * Value must have at least these property values
   */
  patternAge?: Age;
  /* 
   * Value must have at least these property values
   */
  patternAnnotation?: Annotation;
  /* 
   * Value must have at least these property values
   */
  patternAttachment?: Attachment;
  /* 
   * Value must have at least these property values
   */
  patternCodeableConcept?: CodeableConcept;
  /* 
   * Value must have at least these property values
   */
  patternCoding?: Coding;
  /* 
   * Value must have at least these property values
   */
  patternContactPoint?: ContactPoint;
  /* 
   * Value must have at least these property values
   */
  patternCount?: Count;
  /* 
   * Value must have at least these property values
   */
  patternDistance?: Distance;
  /* 
   * Value must have at least these property values
   */
  patternDuration?: Duration;
  /* 
   * Value must have at least these property values
   */
  patternHumanName?: HumanName;
  /* 
   * Value must have at least these property values
   */
  patternIdentifier?: Identifier;
  /* 
   * Value must have at least these property values
   */
  patternMoney?: Money;
  /* 
   * Value must have at least these property values
   */
  patternPeriod?: Period;
  /* 
   * Value must have at least these property values
   */
  patternQuantity?: Quantity;
  /* 
   * Value must have at least these property values
   */
  patternRange?: Range;
  /* 
   * Value must have at least these property values
   */
  patternRatio?: Ratio;
  /* 
   * Value must have at least these property values
   */
  patternReference?: Reference;
  /* 
   * Value must have at least these property values
   */
  patternSampledData?: SampledData;
  /* 
   * Value must have at least these property values
   */
  patternSignature?: Signature;
  /* 
   * Value must have at least these property values
   */
  patternTiming?: Timing;
  /* 
   * Value must have at least these property values
   */
  patternContactDetail?: ContactDetail;
  /* 
   * Value must have at least these property values
   */
  patternContributor?: Contributor;
  /* 
   * Value must have at least these property values
   */
  patternDataRequirement?: DataRequirement;
  /* 
   * Value must have at least these property values
   */
  patternExpression?: Expression;
  /* 
   * Value must have at least these property values
   */
  patternParameterDefinition?: ParameterDefinition;
  /* 
   * Value must have at least these property values
   */
  patternRelatedArtifact?: RelatedArtifact;
  /* 
   * Value must have at least these property values
   */
  patternTriggerDefinition?: TriggerDefinition;
  /* 
   * Value must have at least these property values
   */
  patternUsageContext?: UsageContext;
  /* 
   * Value must have at least these property values
   */
  patternDosage?: Dosage;
  /* 
   * Value must have at least these property values
   */
  patternMeta?: Meta;
  /* 
   * Example value (as defined for type)
   */
  example?: Array<ElementDefinitionExample>;
  /* 
   * Minimum Allowed Value (for some types)
   */
  minValueDate?: date;
  /* 
   * Minimum Allowed Value (for some types)
   */
  minValueDateTime?: dateTime;
  /* 
   * Minimum Allowed Value (for some types)
   */
  minValueInstant?: instant;
  /* 
   * Minimum Allowed Value (for some types)
   */
  minValueTime?: time;
  /* 
   * Minimum Allowed Value (for some types)
   */
  minValueDecimal?: decimal;
  /* 
   * Minimum Allowed Value (for some types)
   */
  minValueInteger?: integer;
  /* 
   * Minimum Allowed Value (for some types)
   */
  minValuePositiveInt?: positiveInt;
  /* 
   * Minimum Allowed Value (for some types)
   */
  minValueUnsignedInt?: unsignedInt;
  /* 
   * Minimum Allowed Value (for some types)
   */
  minValueQuantity?: Quantity;
  /* 
   * Maximum Allowed Value (for some types)
   */
  maxValueDate?: date;
  /* 
   * Maximum Allowed Value (for some types)
   */
  maxValueDateTime?: dateTime;
  /* 
   * Maximum Allowed Value (for some types)
   */
  maxValueInstant?: instant;
  /* 
   * Maximum Allowed Value (for some types)
   */
  maxValueTime?: time;
  /* 
   * Maximum Allowed Value (for some types)
   */
  maxValueDecimal?: decimal;
  /* 
   * Maximum Allowed Value (for some types)
   */
  maxValueInteger?: integer;
  /* 
   * Maximum Allowed Value (for some types)
   */
  maxValuePositiveInt?: positiveInt;
  /* 
   * Maximum Allowed Value (for some types)
   */
  maxValueUnsignedInt?: unsignedInt;
  /* 
   * Maximum Allowed Value (for some types)
   */
  maxValueQuantity?: Quantity;
  /* 
   * Max length for strings
   */
  maxLength?: integer;
  /* 
   * Reference to invariant about presence
   */
  condition?: Array<id>;
  /* 
   * Condition that must evaluate to true
   */
  constraint?: Array<ElementDefinitionConstraint>;
  /* 
   * If the element must be supported
   */
  mustSupport?: boolean;
  /* 
   * If this modifies the meaning of other elements
   */
  isModifier?: boolean;
  /* 
   * Reason that this element is marked as a modifier
   */
  isModifierReason?: string;
  /* 
   * Include when _summary = true?
   */
  isSummary?: boolean;
  /* 
   * ValueSet details if this is coded
   */
  binding?: ElementDefinitionBinding;
  /* 
   * Map element to another set of definitions
   */
  mapping?: Array<ElementDefinitionMapping>;
}

export interface Expression {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Natural language description of the condition
   */
  description?: string;
  /* 
   * Short name assigned to expression for reuse
   */
  name?: id;
  /* 
   * text/cql | text/fhirpath | application/x-fhir-query | etc.
   */
  language: code;
  /* 
   * Expression in specified language
   */
  expression?: string;
  /* 
   * Where the expression is found
   */
  reference?: uri;
}

export interface Extension {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * identifies the meaning of the extension
   */
  url: string;
  /* 
   * Value of extension
   */
  valueBase64Binary?: base64Binary;
  /* 
   * Value of extension
   */
  valueBoolean?: boolean;
  /* 
   * Value of extension
   */
  valueCanonical?: canonical;
  /* 
   * Value of extension
   */
  valueCode?: code;
  /* 
   * Value of extension
   */
  valueDate?: date;
  /* 
   * Value of extension
   */
  valueDateTime?: dateTime;
  /* 
   * Value of extension
   */
  valueDecimal?: decimal;
  /* 
   * Value of extension
   */
  valueId?: id;
  /* 
   * Value of extension
   */
  valueInstant?: instant;
  /* 
   * Value of extension
   */
  valueInteger?: integer;
  /* 
   * Value of extension
   */
  valueMarkdown?: markdown;
  /* 
   * Value of extension
   */
  valueOid?: oid;
  /* 
   * Value of extension
   */
  valuePositiveInt?: positiveInt;
  /* 
   * Value of extension
   */
  valueString?: string;
  /* 
   * Value of extension
   */
  valueTime?: time;
  /* 
   * Value of extension
   */
  valueUnsignedInt?: unsignedInt;
  /* 
   * Value of extension
   */
  valueUri?: uri;
  /* 
   * Value of extension
   */
  valueUrl?: url;
  /* 
   * Value of extension
   */
  valueUuid?: uuid;
  /* 
   * Value of extension
   */
  valueAddress?: Address;
  /* 
   * Value of extension
   */
  valueAge?: Age;
  /* 
   * Value of extension
   */
  valueAnnotation?: Annotation;
  /* 
   * Value of extension
   */
  valueAttachment?: Attachment;
  /* 
   * Value of extension
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * Value of extension
   */
  valueCoding?: Coding;
  /* 
   * Value of extension
   */
  valueContactPoint?: ContactPoint;
  /* 
   * Value of extension
   */
  valueCount?: Count;
  /* 
   * Value of extension
   */
  valueDistance?: Distance;
  /* 
   * Value of extension
   */
  valueDuration?: Duration;
  /* 
   * Value of extension
   */
  valueHumanName?: HumanName;
  /* 
   * Value of extension
   */
  valueIdentifier?: Identifier;
  /* 
   * Value of extension
   */
  valueMoney?: Money;
  /* 
   * Value of extension
   */
  valuePeriod?: Period;
  /* 
   * Value of extension
   */
  valueQuantity?: Quantity;
  /* 
   * Value of extension
   */
  valueRange?: Range;
  /* 
   * Value of extension
   */
  valueRatio?: Ratio;
  /* 
   * Value of extension
   */
  valueReference?: Reference;
  /* 
   * Value of extension
   */
  valueSampledData?: SampledData;
  /* 
   * Value of extension
   */
  valueSignature?: Signature;
  /* 
   * Value of extension
   */
  valueTiming?: Timing;
  /* 
   * Value of extension
   */
  valueContactDetail?: ContactDetail;
  /* 
   * Value of extension
   */
  valueContributor?: Contributor;
  /* 
   * Value of extension
   */
  valueDataRequirement?: DataRequirement;
  /* 
   * Value of extension
   */
  valueExpression?: Expression;
  /* 
   * Value of extension
   */
  valueParameterDefinition?: ParameterDefinition;
  /* 
   * Value of extension
   */
  valueRelatedArtifact?: RelatedArtifact;
  /* 
   * Value of extension
   */
  valueTriggerDefinition?: TriggerDefinition;
  /* 
   * Value of extension
   */
  valueUsageContext?: UsageContext;
  /* 
   * Value of extension
   */
  valueDosage?: Dosage;
  /* 
   * Value of extension
   */
  valueMeta?: Meta;
}

export interface HumanName {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * usual | official | temp | nickname | anonymous | old | maiden
   */
  use?: code;
  /* 
   * Text representation of the full name
   */
  text?: string;
  /* 
   * Family name (often called 'Surname')
   */
  family?: string;
  /* 
   * Given names (not always 'first'). Includes middle names
   */
  given?: Array<string>;
  /* 
   * Parts that come before the name
   */
  prefix?: Array<string>;
  /* 
   * Parts that come after the name
   */
  suffix?: Array<string>;
  /* 
   * Time period when name was/is in use
   */
  period?: Period;
}

export interface Identifier {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * usual | official | temp | secondary | old (If known)
   */
  use?: code;
  /* 
   * Description of identifier
   */
  type?: CodeableConcept;
  /* 
   * The namespace for the identifier value
   */
  system?: uri;
  /* 
   * The value that is unique
   */
  value?: string;
  /* 
   * Time period when id is/was valid for use
   */
  period?: Period;
  /* 
   * Organization that issued id (may be just text)
   */
  assigner?: Reference;
}

export interface MarketingStatus {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The country in which the marketing authorisation has been granted shall be specified It should be specified using the ISO 3166 ‑ 1 alpha-2 code elements
   */
  country: CodeableConcept;
  /* 
   * Where a Medicines Regulatory Agency has granted a marketing authorisation for which specific provisions within a jurisdiction apply, the jurisdiction can be specified using an appropriate controlled terminology The controlled term and the controlled term identifier shall be specified
   */
  jurisdiction?: CodeableConcept;
  /* 
   * This attribute provides information on the status of the marketing of the medicinal product See ISO/TS 20443 for more information and examples
   */
  status: CodeableConcept;
  /* 
   * The date when the Medicinal Product is placed on the market by the Marketing Authorisation Holder (or where applicable, the manufacturer/distributor) in a country and/or jurisdiction shall be provided A complete date consisting of day, month and year shall be specified using the ISO 8601 date format NOTE “Placed on the market” refers to the release of the Medicinal Product into the distribution chain
   */
  dateRange: Period;
  /* 
   * The date when the Medicinal Product is placed on the market by the Marketing Authorisation Holder (or where applicable, the manufacturer/distributor) in a country and/or jurisdiction shall be provided A complete date consisting of day, month and year shall be specified using the ISO 8601 date format NOTE “Placed on the market” refers to the release of the Medicinal Product into the distribution chain
   */
  restoreDate?: dateTime;
}

export interface Meta {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Version specific identifier
   */
  versionId?: id;
  /* 
   * When the resource version last changed
   */
  lastUpdated?: instant;
  /* 
   * Identifies where the resource comes from
   */
  source?: uri;
  /* 
   * Profiles this resource claims to conform to
   */
  profile?: Array<canonical>;
  /* 
   * Security Labels applied to this resource
   */
  security?: Array<Coding>;
  /* 
   * Tags applied to this resource
   */
  tag?: Array<Coding>;
}

export interface Money {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Numerical value (with implicit precision)
   */
  value?: decimal;
  /* 
   * ISO 4217 Currency Code
   */
  currency?: code;
}

export interface Narrative {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * generated | extensions | additional | empty
   */
  status: code;
  /* 
   * Limited xhtml content
   */
  div: xhtml;
}

export interface ParameterDefinition {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Name used to access the parameter value
   */
  name?: code;
  /* 
   * in | out
   */
  use: code;
  /* 
   * Minimum cardinality
   */
  min?: integer;
  /* 
   * Maximum cardinality (a number of *)
   */
  max?: string;
  /* 
   * A brief description of the parameter
   */
  documentation?: string;
  /* 
   * What type of value
   */
  type: code;
  /* 
   * What profile the value is expected to be
   */
  profile?: canonical;
}

export interface Period {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Starting time with inclusive boundary
   */
  start?: dateTime;
  /* 
   * End time with inclusive boundary, if not ongoing
   */
  end?: dateTime;
}

export interface Population {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The age of the specific population
   */
  ageRange?: Range;
  /* 
   * The age of the specific population
   */
  ageCodeableConcept?: CodeableConcept;
  /* 
   * The gender of the specific population
   */
  gender?: CodeableConcept;
  /* 
   * Race of the specific population
   */
  race?: CodeableConcept;
  /* 
   * The existing physiological conditions of the specific population to which this applies
   */
  physiologicalCondition?: CodeableConcept;
}

export interface ProdCharacteristic {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Where applicable, the height can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used
   */
  height?: Quantity;
  /* 
   * Where applicable, the width can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used
   */
  width?: Quantity;
  /* 
   * Where applicable, the depth can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used
   */
  depth?: Quantity;
  /* 
   * Where applicable, the weight can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used
   */
  weight?: Quantity;
  /* 
   * Where applicable, the nominal volume can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used
   */
  nominalVolume?: Quantity;
  /* 
   * Where applicable, the external diameter can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used
   */
  externalDiameter?: Quantity;
  /* 
   * Where applicable, the shape can be specified An appropriate controlled vocabulary shall be used The term and the term identifier shall be used
   */
  shape?: string;
  /* 
   * Where applicable, the color can be specified An appropriate controlled vocabulary shall be used The term and the term identifier shall be used
   */
  color?: Array<string>;
  /* 
   * Where applicable, the imprint can be specified as text
   */
  imprint?: Array<string>;
  /* 
   * Where applicable, the image can be provided The format of the image attachment shall be specified by regional implementations
   */
  image?: Array<Attachment>;
  /* 
   * Where applicable, the scoring can be specified An appropriate controlled vocabulary shall be used The term and the term identifier shall be used
   */
  scoring?: CodeableConcept;
}

export interface ProductShelfLife {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique identifier for the packaged Medicinal Product
   */
  identifier?: Identifier;
  /* 
   * This describes the shelf life, taking into account various scenarios such as shelf life of the packaged Medicinal Product itself, shelf life after transformation where necessary and shelf life after the first opening of a bottle, etc. The shelf life type shall be specified using an appropriate controlled vocabulary The controlled term and the controlled term identifier shall be specified
   */
  type: CodeableConcept;
  /* 
   * The shelf life time period can be specified using a numerical value for the period of time and its unit of time measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used
   */
  period: Quantity;
  /* 
   * Special precautions for storage, if any, can be specified using an appropriate controlled vocabulary The controlled term and the controlled term identifier shall be specified
   */
  specialPrecautionsForStorage?: Array<CodeableConcept>;
}

export interface Quantity {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Numerical value (with implicit precision)
   */
  value?: decimal;
  /* 
   * < | <= | >= | > - how to understand the value
   */
  comparator?: code;
  /* 
   * Unit representation
   */
  unit?: string;
  /* 
   * System that defines coded unit form
   */
  system?: uri;
  /* 
   * Coded form of the unit
   */
  code?: code;
}

export interface Range {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Low limit
   */
  low?: Quantity;
  /* 
   * High limit
   */
  high?: Quantity;
}

export interface Ratio {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Numerator value
   */
  numerator?: Quantity;
  /* 
   * Denominator value
   */
  denominator?: Quantity;
}

export interface Reference {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Literal reference, Relative, internal or absolute URL
   */
  reference?: string;
  /* 
   * Type the reference refers to (e.g. "Patient")
   */
  type?: uri;
  /* 
   * Logical reference, when literal reference is not known
   */
  identifier?: Identifier;
  /* 
   * Text alternative for the resource
   */
  display?: string;
}

export interface RelatedArtifact {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * documentation | justification | citation | predecessor | successor | derived-from | depends-on | composed-of
   */
  type: code;
  /* 
   * Short label
   */
  label?: string;
  /* 
   * Brief description of the related artifact
   */
  display?: string;
  /* 
   * Bibliographic citation for the artifact
   */
  citation?: markdown;
  /* 
   * Where the artifact can be accessed
   */
  url?: url;
  /* 
   * What document is being referenced
   */
  document?: Attachment;
  /* 
   * What resource is being referenced
   */
  resource?: canonical;
}

export interface SampledData {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Zero value and units
   */
  origin: Quantity;
  /* 
   * Number of milliseconds between samples
   */
  period: decimal;
  /* 
   * Multiply data by this before adding to origin
   */
  factor?: decimal;
  /* 
   * Lower limit of detection
   */
  lowerLimit?: decimal;
  /* 
   * Upper limit of detection
   */
  upperLimit?: decimal;
  /* 
   * Number of sample points at each time point
   */
  dimensions: positiveInt;
  /* 
   * Decimal values with spaces, or "E" | "U" | "L"
   */
  data?: string;
}

export interface Signature {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Indication of the reason the entity signed the object(s)
   */
  type: Array<Coding>;
  /* 
   * When the signature was created
   */
  when: instant;
  /* 
   * Who signed
   */
  who: Reference;
  /* 
   * The party represented
   */
  onBehalfOf?: Reference;
  /* 
   * The technical format of the signed resources
   */
  targetFormat?: code;
  /* 
   * The technical format of the signature
   */
  sigFormat?: code;
  /* 
   * The actual signature content (XML DigSig. JWS, picture, etc.)
   */
  data?: base64Binary;
}

export interface SubstanceAmountReferenceRange {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Lower limit possible or expected
   */
  lowLimit?: Quantity;
  /* 
   * Upper limit possible or expected
   */
  highLimit?: Quantity;
}
export interface SubstanceAmount {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Used to capture quantitative values for a variety of elements. If only limits are given, the arithmetic mean would be the average. If only a single definite value for a given element is given, it would be captured in this field
   */
  amountQuantity?: Quantity;
  /* 
   * Used to capture quantitative values for a variety of elements. If only limits are given, the arithmetic mean would be the average. If only a single definite value for a given element is given, it would be captured in this field
   */
  amountRange?: Range;
  /* 
   * Used to capture quantitative values for a variety of elements. If only limits are given, the arithmetic mean would be the average. If only a single definite value for a given element is given, it would be captured in this field
   */
  amountString?: string;
  /* 
   * Most elements that require a quantitative value will also have a field called amount type. Amount type should always be specified because the actual value of the amount is often dependent on it. EXAMPLE: In capturing the actual relative amounts of substances or molecular fragments it is essential to indicate whether the amount refers to a mole ratio or weight ratio. For any given element an effort should be made to use same the amount type for all related definitional elements
   */
  amountType?: CodeableConcept;
  /* 
   * A textual comment on a numeric value
   */
  amountText?: string;
  /* 
   * Reference range of possible or expected values
   */
  referenceRange?: SubstanceAmountReferenceRange;
}

export interface TimingRepeat {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Length/Range of lengths, or (Start and/or end) limits
   */
  boundsDuration?: Duration;
  /* 
   * Length/Range of lengths, or (Start and/or end) limits
   */
  boundsRange?: Range;
  /* 
   * Length/Range of lengths, or (Start and/or end) limits
   */
  boundsPeriod?: Period;
  /* 
   * Number of times to repeat
   */
  count?: positiveInt;
  /* 
   * Maximum number of times to repeat
   */
  countMax?: positiveInt;
  /* 
   * How long when it happens
   */
  duration?: decimal;
  /* 
   * How long when it happens (Max)
   */
  durationMax?: decimal;
  /* 
   * s | min | h | d | wk | mo | a - unit of time (UCUM)
   */
  durationUnit?: code;
  /* 
   * Event occurs frequency times per period
   */
  frequency?: positiveInt;
  /* 
   * Event occurs up to frequencyMax times per period
   */
  frequencyMax?: positiveInt;
  /* 
   * Event occurs frequency times per period
   */
  period?: decimal;
  /* 
   * Upper limit of period (3-4 hours)
   */
  periodMax?: decimal;
  /* 
   * s | min | h | d | wk | mo | a - unit of time (UCUM)
   */
  periodUnit?: code;
  /* 
   * mon | tue | wed | thu | fri | sat | sun
   */
  dayOfWeek?: Array<code>;
  /* 
   * Time of day for action
   */
  timeOfDay?: Array<time>;
  /* 
   * Code for time period of occurrence
   */
  when?: Array<code>;
  /* 
   * Minutes from event (before or after)
   */
  offset?: unsignedInt;
}
export interface Timing {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * When the event occurs
   */
  event?: Array<dateTime>;
  /* 
   * When the event is to occur
   */
  repeat?: TimingRepeat;
  /* 
   * BID | TID | QID | AM | PM | QD | QOD | +
   */
  code?: CodeableConcept;
}

export interface TriggerDefinition {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * named-event | periodic | data-changed | data-added | data-modified | data-removed | data-accessed | data-access-ended
   */
  type: code;
  /* 
   * Name or URI that identifies the event
   */
  name?: string;
  /* 
   * Timing of the event
   */
  timingTiming?: Timing;
  /* 
   * Timing of the event
   */
  timingReference?: Reference;
  /* 
   * Timing of the event
   */
  timingDate?: date;
  /* 
   * Timing of the event
   */
  timingDateTime?: dateTime;
  /* 
   * Triggering data of the event (multiple = 'and')
   */
  data?: Array<DataRequirement>;
  /* 
   * Whether the event triggers (boolean expression)
   */
  condition?: Expression;
}

export interface UsageContext {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Type of context being specified
   */
  code: Coding;
  /* 
   * Value that defines the context
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * Value that defines the context
   */
  valueQuantity?: Quantity;
  /* 
   * Value that defines the context
   */
  valueRange?: Range;
  /* 
   * Value that defines the context
   */
  valueReference?: Reference;
}

export interface Quantity {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Numerical value (with implicit precision)
   */
  value?: decimal;
  /* 
   * < | <= | >= | > - how to understand the value
   */
  comparator?: code;
  /* 
   * Unit representation
   */
  unit?: string;
  /* 
   * System that defines coded unit form
   */
  system?: uri;
  /* 
   * Coded form of the unit
   */
  code?: code;
}

export interface Quantity {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Numerical value (with implicit precision)
   */
  value?: decimal;
  /* 
   * < | <= | >= | > - how to understand the value
   */
  comparator?: code;
  /* 
   * Unit representation
   */
  unit?: string;
  /* 
   * System that defines coded unit form
   */
  system?: uri;
  /* 
   * Coded form of the unit
   */
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
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The party(s), such as insurances, that may contribute to the payment of this account
   */
  coverage: Reference;
  /* 
   * The priority of the coverage in the context of this account
   */
  priority?: positiveInt;
}
export interface AccountGuarantor {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Responsible entity
   */
  party: Reference;
  /* 
   * Credit or other hold applied
   */
  onHold?: boolean;
  /* 
   * Guarantee account during
   */
  period?: Period;
}
export interface Account {
resourceType: "Account"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Account number
   */
  identifier?: Array<Identifier>;
  /* 
   * active | inactive | entered-in-error | on-hold | unknown
   */
  status: code;
  /* 
   * E.g. patient, expense, depreciation
   */
  type?: CodeableConcept;
  /* 
   * Human-readable label
   */
  name?: string;
  /* 
   * The entity that caused the expenses
   */
  subject?: Array<Reference>;
  /* 
   * Transaction window
   */
  servicePeriod?: Period;
  /* 
   * The party(s) that are responsible for covering the payment of this account, and what order should they be applied to the account
   */
  coverage?: Array<AccountCoverage>;
  /* 
   * Entity managing the Account
   */
  owner?: Reference;
  /* 
   * Explanation of purpose/use
   */
  description?: string;
  /* 
   * The parties ultimately responsible for balancing the Account
   */
  guarantor?: Array<AccountGuarantor>;
  /* 
   * Reference to a parent Account
   */
  partOf?: Reference;
}

export interface ActivityDefinitionParticipant {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * patient | practitioner | related-person | device
   */
  type: code;
  /* 
   * E.g. Nurse, Surgeon, Parent, etc.
   */
  role?: CodeableConcept;
}
export interface ActivityDefinitionDynamicValue {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The path to the element to be set dynamically
   */
  path: string;
  /* 
   * An expression that provides the dynamic value for the customization
   */
  expression: Expression;
}
export interface ActivityDefinition {
resourceType: "ActivityDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this activity definition, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the activity definition
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the activity definition
   */
  version?: string;
  /* 
   * Name for this activity definition (computer friendly)
   */
  name?: string;
  /* 
   * Name for this activity definition (human friendly)
   */
  title?: string;
  /* 
   * Subordinate title of the activity definition
   */
  subtitle?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Type of individual the activity definition is intended for
   */
  subjectCodeableConcept?: CodeableConcept;
  /* 
   * Type of individual the activity definition is intended for
   */
  subjectReference?: Reference;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the activity definition
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for activity definition (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this activity definition is defined
   */
  purpose?: markdown;
  /* 
   * Describes the clinical usage of the activity definition
   */
  usage?: string;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the activity definition was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the activity definition was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the activity definition is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * E.g. Education, Treatment, Assessment, etc.
   */
  topic?: Array<CodeableConcept>;
  /* 
   * Who authored the content
   */
  author?: Array<ContactDetail>;
  /* 
   * Who edited the content
   */
  editor?: Array<ContactDetail>;
  /* 
   * Who reviewed the content
   */
  reviewer?: Array<ContactDetail>;
  /* 
   * Who endorsed the content
   */
  endorser?: Array<ContactDetail>;
  /* 
   * Additional documentation, citations, etc.
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * Logic used by the activity definition
   */
  library?: Array<canonical>;
  /* 
   * Kind of resource
   */
  kind?: code;
  /* 
   * What profile the resource needs to conform to
   */
  profile?: canonical;
  /* 
   * Detail type of activity
   */
  code?: CodeableConcept;
  /* 
   * proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option
   */
  intent?: code;
  /* 
   * routine | urgent | asap | stat
   */
  priority?: code;
  /* 
   * True if the activity should not be performed
   */
  doNotPerform?: boolean;
  /* 
   * When activity is to occur
   */
  timingTiming?: Timing;
  /* 
   * When activity is to occur
   */
  timingDateTime?: dateTime;
  /* 
   * When activity is to occur
   */
  timingAge?: Age;
  /* 
   * When activity is to occur
   */
  timingPeriod?: Period;
  /* 
   * When activity is to occur
   */
  timingRange?: Range;
  /* 
   * When activity is to occur
   */
  timingDuration?: Duration;
  /* 
   * Where it should happen
   */
  location?: Reference;
  /* 
   * Who should participate in the action
   */
  participant?: Array<ActivityDefinitionParticipant>;
  /* 
   * What's administered/supplied
   */
  productReference?: Reference;
  /* 
   * What's administered/supplied
   */
  productCodeableConcept?: CodeableConcept;
  /* 
   * How much is administered/consumed/supplied
   */
  quantity?: Quantity;
  /* 
   * Detailed dosage instructions
   */
  dosage?: Array<Dosage>;
  /* 
   * What part of body to perform on
   */
  bodySite?: Array<CodeableConcept>;
  /* 
   * What specimens are required to perform this action
   */
  specimenRequirement?: Array<Reference>;
  /* 
   * What observations are required to perform this action
   */
  observationRequirement?: Array<Reference>;
  /* 
   * What observations must be produced by this action
   */
  observationResultRequirement?: Array<Reference>;
  /* 
   * Transform to apply the template
   */
  transform?: canonical;
  /* 
   * Dynamic aspects of the definition
   */
  dynamicValue?: Array<ActivityDefinitionDynamicValue>;
}

export interface AdverseEventSuspectEntityCausality {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Assessment of if the entity caused the event
   */
  assessment?: CodeableConcept;
  /* 
   * AdverseEvent.suspectEntity.causalityProductRelatedness
   */
  productRelatedness?: string;
  /* 
   * AdverseEvent.suspectEntity.causalityAuthor
   */
  author?: Reference;
  /* 
   * ProbabilityScale | Bayesian | Checklist
   */
  method?: CodeableConcept;
}
export interface AdverseEventSuspectEntity {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Refers to the specific entity that caused the adverse event
   */
  instance: Reference;
  /* 
   * Information on the possible cause of the event
   */
  causality?: Array<AdverseEventSuspectEntityCausality>;
}
export interface AdverseEvent {
resourceType: "AdverseEvent"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier for the event
   */
  identifier?: Identifier;
  /* 
   * actual | potential
   */
  actuality: code;
  /* 
   * product-problem | product-quality | product-use-error | wrong-dose | incorrect-prescribing-information | wrong-technique | wrong-route-of-administration | wrong-rate | wrong-duration | wrong-time | expired-drug | medical-device-use-error | problem-different-manufacturer | unsafe-physical-environment
   */
  category?: Array<CodeableConcept>;
  /* 
   * Type of the event itself in relation to the subject
   */
  event?: CodeableConcept;
  /* 
   * Subject impacted by event
   */
  subject: Reference;
  /* 
   * Encounter created as part of
   */
  encounter?: Reference;
  /* 
   * When the event occurred
   */
  date?: dateTime;
  /* 
   * When the event was detected
   */
  detected?: dateTime;
  /* 
   * When the event was recorded
   */
  recordedDate?: dateTime;
  /* 
   * Effect on the subject due to this event
   */
  resultingCondition?: Array<Reference>;
  /* 
   * Location where adverse event occurred
   */
  location?: Reference;
  /* 
   * Seriousness of the event
   */
  seriousness?: CodeableConcept;
  /* 
   * mild | moderate | severe
   */
  severity?: CodeableConcept;
  /* 
   * resolved | recovering | ongoing | resolvedWithSequelae | fatal | unknown
   */
  outcome?: CodeableConcept;
  /* 
   * Who recorded the adverse event
   */
  recorder?: Reference;
  /* 
   * Who  was involved in the adverse event or the potential adverse event
   */
  contributor?: Array<Reference>;
  /* 
   * The suspected agent causing the adverse event
   */
  suspectEntity?: Array<AdverseEventSuspectEntity>;
  /* 
   * AdverseEvent.subjectMedicalHistory
   */
  subjectMedicalHistory?: Array<Reference>;
  /* 
   * AdverseEvent.referenceDocument
   */
  referenceDocument?: Array<Reference>;
  /* 
   * AdverseEvent.study
   */
  study?: Array<Reference>;
}

export interface AllergyIntoleranceReaction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Specific substance or pharmaceutical product considered to be responsible for event
   */
  substance?: CodeableConcept;
  /* 
   * Clinical symptoms/signs associated with the Event
   */
  manifestation: Array<CodeableConcept>;
  /* 
   * Description of the event as a whole
   */
  description?: string;
  /* 
   * Date(/time) when manifestations showed
   */
  onset?: dateTime;
  /* 
   * mild | moderate | severe (of event as a whole)
   */
  severity?: code;
  /* 
   * How the subject was exposed to the substance
   */
  exposureRoute?: CodeableConcept;
  /* 
   * Text about event not captured in other fields
   */
  note?: Array<Annotation>;
}
export interface AllergyIntolerance {
resourceType: "AllergyIntolerance"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External ids for this item
   */
  identifier?: Array<Identifier>;
  /* 
   * active | inactive | resolved
   */
  clinicalStatus?: CodeableConcept;
  /* 
   * unconfirmed | confirmed | refuted | entered-in-error
   */
  verificationStatus?: CodeableConcept;
  /* 
   * allergy | intolerance - Underlying mechanism (if known)
   */
  type?: code;
  /* 
   * food | medication | environment | biologic
   */
  category?: Array<code>;
  /* 
   * low | high | unable-to-assess
   */
  criticality?: code;
  /* 
   * Code that identifies the allergy or intolerance
   */
  code?: CodeableConcept;
  /* 
   * Who the sensitivity is for
   */
  patient: Reference;
  /* 
   * Encounter when the allergy or intolerance was asserted
   */
  encounter?: Reference;
  /* 
   * When allergy or intolerance was identified
   */
  onsetDateTime?: dateTime;
  /* 
   * When allergy or intolerance was identified
   */
  onsetAge?: Age;
  /* 
   * When allergy or intolerance was identified
   */
  onsetPeriod?: Period;
  /* 
   * When allergy or intolerance was identified
   */
  onsetRange?: Range;
  /* 
   * When allergy or intolerance was identified
   */
  onsetString?: string;
  /* 
   * Date first version of the resource instance was recorded
   */
  recordedDate?: dateTime;
  /* 
   * Who recorded the sensitivity
   */
  recorder?: Reference;
  /* 
   * Source of the information about the allergy
   */
  asserter?: Reference;
  /* 
   * Date(/time) of last known occurrence of a reaction
   */
  lastOccurrence?: dateTime;
  /* 
   * Additional text not captured in other fields
   */
  note?: Array<Annotation>;
  /* 
   * Adverse Reaction Events linked to exposure to substance
   */
  reaction?: Array<AllergyIntoleranceReaction>;
}

export interface AppointmentParticipant {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Role of participant in the appointment
   */
  type?: Array<CodeableConcept>;
  /* 
   * Person, Location/HealthcareService or Device
   */
  actor?: Reference;
  /* 
   * required | optional | information-only
   */
  required?: code;
  /* 
   * accepted | declined | tentative | needs-action
   */
  status: code;
  /* 
   * Participation period of the actor
   */
  period?: Period;
}
export interface Appointment {
resourceType: "Appointment"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Ids for this item
   */
  identifier?: Array<Identifier>;
  /* 
   * proposed | pending | booked | arrived | fulfilled | cancelled | noshow | entered-in-error | checked-in | waitlist
   */
  status: code;
  /* 
   * The coded reason for the appointment being cancelled
   */
  cancelationReason?: CodeableConcept;
  /* 
   * A broad categorization of the service that is to be performed during this appointment
   */
  serviceCategory?: Array<CodeableConcept>;
  /* 
   * The specific service that is to be performed during this appointment
   */
  serviceType?: Array<CodeableConcept>;
  /* 
   * The specialty of a practitioner that would be required to perform the service requested in this appointment
   */
  specialty?: Array<CodeableConcept>;
  /* 
   * The style of appointment or patient that has been booked in the slot (not service type)
   */
  appointmentType?: CodeableConcept;
  /* 
   * Coded reason this appointment is scheduled
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Reason the appointment is to take place (resource)
   */
  reasonReference?: Array<Reference>;
  /* 
   * Used to make informed decisions if needing to re-prioritize
   */
  priority?: unsignedInt;
  /* 
   * Shown on a subject line in a meeting request, or appointment list
   */
  description?: string;
  /* 
   * Additional information to support the appointment
   */
  supportingInformation?: Array<Reference>;
  /* 
   * When appointment is to take place
   */
  start?: instant;
  /* 
   * When appointment is to conclude
   */
  end?: instant;
  /* 
   * Can be less than start/end (e.g. estimate)
   */
  minutesDuration?: positiveInt;
  /* 
   * The slots that this appointment is filling
   */
  slot?: Array<Reference>;
  /* 
   * The date that this appointment was initially created
   */
  created?: dateTime;
  /* 
   * Additional comments
   */
  comment?: string;
  /* 
   * Detailed information and instructions for the patient
   */
  patientInstruction?: string;
  /* 
   * The service request this appointment is allocated to assess
   */
  basedOn?: Array<Reference>;
  /* 
   * Participants involved in appointment
   */
  participant: Array<AppointmentParticipant>;
  /* 
   * Potential date/time interval(s) requested to allocate the appointment within
   */
  requestedPeriod?: Array<Period>;
}

export interface AppointmentResponse {
resourceType: "AppointmentResponse"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Ids for this item
   */
  identifier?: Array<Identifier>;
  /* 
   * Appointment this response relates to
   */
  appointment: Reference;
  /* 
   * Time from appointment, or requested new start time
   */
  start?: instant;
  /* 
   * Time from appointment, or requested new end time
   */
  end?: instant;
  /* 
   * Role of participant in the appointment
   */
  participantType?: Array<CodeableConcept>;
  /* 
   * Person, Location, HealthcareService, or Device
   */
  actor?: Reference;
  /* 
   * accepted | declined | tentative | needs-action
   */
  participantStatus: code;
  /* 
   * Additional comments
   */
  comment?: string;
}

export interface AuditEventAgentNetwork {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifier for the network access point of the user device
   */
  address?: string;
  /* 
   * The type of network access point
   */
  type?: code;
}
export interface AuditEventAgent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * How agent participated
   */
  type?: CodeableConcept;
  /* 
   * Agent role in the event
   */
  role?: Array<CodeableConcept>;
  /* 
   * Identifier of who
   */
  who?: Reference;
  /* 
   * Alternative User identity
   */
  altId?: string;
  /* 
   * Human friendly name for the agent
   */
  name?: string;
  /* 
   * Whether user is initiator
   */
  requestor: boolean;
  /* 
   * Where
   */
  location?: Reference;
  /* 
   * Policy that authorized event
   */
  policy?: Array<uri>;
  /* 
   * Type of media
   */
  media?: Coding;
  /* 
   * Logical network location for application activity
   */
  network?: AuditEventAgentNetwork;
  /* 
   * Reason given for this user
   */
  purposeOfUse?: Array<CodeableConcept>;
}
export interface AuditEventSource {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Logical source location within the enterprise
   */
  site?: string;
  /* 
   * The identity of source detecting the event
   */
  observer: Reference;
  /* 
   * The type of source where event originated
   */
  type?: Array<Coding>;
}
export interface AuditEventEntityDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name of the property
   */
  type: string;
  /* 
   * Property value
   */
  valueString?: string;
  /* 
   * Property value
   */
  valueBase64Binary?: base64Binary;
}
export interface AuditEventEntity {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Specific instance of resource
   */
  what?: Reference;
  /* 
   * Type of entity involved
   */
  type?: Coding;
  /* 
   * What role the entity played
   */
  role?: Coding;
  /* 
   * Life-cycle stage for the entity
   */
  lifecycle?: Coding;
  /* 
   * Security labels on the entity
   */
  securityLabel?: Array<Coding>;
  /* 
   * Descriptor for entity
   */
  name?: string;
  /* 
   * Descriptive text
   */
  description?: string;
  /* 
   * Query parameters
   */
  query?: base64Binary;
  /* 
   * Additional Information about the entity
   */
  detail?: Array<AuditEventEntityDetail>;
}
export interface AuditEvent {
resourceType: "AuditEvent"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type/identifier of event
   */
  type: Coding;
  /* 
   * More specific type/id for the event
   */
  subtype?: Array<Coding>;
  /* 
   * Type of action performed during the event
   */
  action?: code;
  /* 
   * When the activity occurred
   */
  period?: Period;
  /* 
   * Time when the event was recorded
   */
  recorded: instant;
  /* 
   * Whether the event succeeded or failed
   */
  outcome?: code;
  /* 
   * Description of the event outcome
   */
  outcomeDesc?: string;
  /* 
   * The purposeOfUse of the event
   */
  purposeOfEvent?: Array<CodeableConcept>;
  /* 
   * Actor involved in the event
   */
  agent: Array<AuditEventAgent>;
  /* 
   * Audit Event Reporter
   */
  source: AuditEventSource;
  /* 
   * Data or objects used
   */
  entity?: Array<AuditEventEntity>;
}

export interface Basic {
resourceType: "Basic"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Kind of Resource
   */
  code: CodeableConcept;
  /* 
   * Identifies the focus of this resource
   */
  subject?: Reference;
  /* 
   * When created
   */
  created?: date;
  /* 
   * Who created
   */
  author?: Reference;
}

export interface Binary {
resourceType: "Binary"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * MimeType of the binary content
   */
  contentType: code;
  /* 
   * Identifies another resource to use as proxy when enforcing access control
   */
  securityContext?: Reference;
  /* 
   * The actual content
   */
  data?: base64Binary;
}

export interface BiologicallyDerivedProductCollection {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Individual performing collection
   */
  collector?: Reference;
  /* 
   * Who is product from
   */
  source?: Reference;
  /* 
   * Time of product collection
   */
  collectedDateTime?: dateTime;
  /* 
   * Time of product collection
   */
  collectedPeriod?: Period;
}
export interface BiologicallyDerivedProductProcessing {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Description of of processing
   */
  description?: string;
  /* 
   * Procesing code
   */
  procedure?: CodeableConcept;
  /* 
   * Substance added during processing
   */
  additive?: Reference;
  /* 
   * Time of processing
   */
  timeDateTime?: dateTime;
  /* 
   * Time of processing
   */
  timePeriod?: Period;
}
export interface BiologicallyDerivedProductManipulation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Description of manipulation
   */
  description?: string;
  /* 
   * Time of manipulation
   */
  timeDateTime?: dateTime;
  /* 
   * Time of manipulation
   */
  timePeriod?: Period;
}
export interface BiologicallyDerivedProductStorage {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Description of storage
   */
  description?: string;
  /* 
   * Storage temperature
   */
  temperature?: decimal;
  /* 
   * farenheit | celsius | kelvin
   */
  scale?: code;
  /* 
   * Storage timeperiod
   */
  duration?: Period;
}
export interface BiologicallyDerivedProduct {
resourceType: "BiologicallyDerivedProduct"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External ids for this item
   */
  identifier?: Array<Identifier>;
  /* 
   * organ | tissue | fluid | cells | biologicalAgent
   */
  productCategory?: code;
  /* 
   * What this biologically derived product is
   */
  productCode?: CodeableConcept;
  /* 
   * available | unavailable
   */
  status?: code;
  /* 
   * Procedure request
   */
  request?: Array<Reference>;
  /* 
   * The amount of this biologically derived product
   */
  quantity?: integer;
  /* 
   * BiologicallyDerivedProduct parent
   */
  parent?: Array<Reference>;
  /* 
   * How this product was collected
   */
  collection?: BiologicallyDerivedProductCollection;
  /* 
   * Any processing of the product during collection
   */
  processing?: Array<BiologicallyDerivedProductProcessing>;
  /* 
   * Any manipulation of product post-collection
   */
  manipulation?: BiologicallyDerivedProductManipulation;
  /* 
   * Product storage
   */
  storage?: Array<BiologicallyDerivedProductStorage>;
}

export interface BodyStructure {
resourceType: "BodyStructure"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Bodystructure identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Whether this record is in active use
   */
  active?: boolean;
  /* 
   * Kind of Structure
   */
  morphology?: CodeableConcept;
  /* 
   * Body site
   */
  location?: CodeableConcept;
  /* 
   * Body site modifier
   */
  locationQualifier?: Array<CodeableConcept>;
  /* 
   * Text description
   */
  description?: string;
  /* 
   * Attached images
   */
  image?: Array<Attachment>;
  /* 
   * Who this is about
   */
  patient: Reference;
}

export interface BundleLink {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * See http://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1
   */
  relation: string;
  /* 
   * Reference details for the link
   */
  url: uri;
}
export interface BundleEntrySearch {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * match | include | outcome - why this is in the result set
   */
  mode?: code;
  /* 
   * Search ranking (between 0 and 1)
   */
  score?: decimal;
}
export interface BundleEntryRequest {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * GET | HEAD | POST | PUT | DELETE | PATCH
   */
  method: code;
  /* 
   * URL for HTTP equivalent of this entry
   */
  url: uri;
  /* 
   * For managing cache currency
   */
  ifNoneMatch?: string;
  /* 
   * For managing cache currency
   */
  ifModifiedSince?: instant;
  /* 
   * For managing update contention
   */
  ifMatch?: string;
  /* 
   * For conditional creates
   */
  ifNoneExist?: string;
}
export interface BundleEntryResponse {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Status response code (text optional)
   */
  status: string;
  /* 
   * The location (if the operation returns a location)
   */
  location?: uri;
  /* 
   * The Etag for the resource (if relevant)
   */
  etag?: string;
  /* 
   * Server's date time modified
   */
  lastModified?: instant;
  /* 
   * OperationOutcome with hints and warnings (for batch/transaction)
   */
  outcome?: Resource;
}
export interface BundleEntry {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Links related to this entry
   */
  link?: BundleLink;
  /* 
   * URI for resource (Absolute URL server address or URI for UUID/OID)
   */
  fullUrl?: uri;
  /* 
   * A resource in the bundle
   */
  resource?: Resource;
  /* 
   * Search related information
   */
  search?: BundleEntrySearch;
  /* 
   * Additional execution information (transaction/batch/history)
   */
  request?: BundleEntryRequest;
  /* 
   * Results of execution (transaction/batch/history)
   */
  response?: BundleEntryResponse;
}
export interface Bundle {
resourceType: "Bundle"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Persistent identifier for the bundle
   */
  identifier?: Identifier;
  /* 
   * document | message | transaction | transaction-response | batch | batch-response | history | searchset | collection
   */
  type: code;
  /* 
   * When the bundle was assembled
   */
  timestamp?: instant;
  /* 
   * If search, the total number of matches
   */
  total?: unsignedInt;
  /* 
   * Links related to this Bundle
   */
  link?: Array<BundleLink>;
  /* 
   * Entry in the bundle - will have a resource or information
   */
  entry?: Array<BundleEntry>;
  /* 
   * Digital Signature
   */
  signature?: Signature;
}

export interface CapabilityStatementSoftware {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A name the software is known by
   */
  name: string;
  /* 
   * Version covered by this statement
   */
  version?: string;
  /* 
   * Date this version was released
   */
  releaseDate?: dateTime;
}
export interface CapabilityStatementImplementation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Describes this specific instance
   */
  description: string;
  /* 
   * Base URL for the installation
   */
  url?: url;
  /* 
   * Organization that manages the data
   */
  custodian?: Reference;
}
export interface CapabilityStatementRestSecurity {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Adds CORS Headers (http://enable-cors.org/)
   */
  cors?: boolean;
  /* 
   * OAuth | SMART-on-FHIR | NTLM | Basic | Kerberos | Certificates
   */
  service?: Array<CodeableConcept>;
  /* 
   * General description of how security works
   */
  description?: markdown;
}
export interface CapabilityStatementRestResourceInteraction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * read | vread | update | patch | delete | history-instance | history-type | create | search-type
   */
  code: code;
  /* 
   * Anything special about operation behavior
   */
  documentation?: markdown;
}
export interface CapabilityStatementRestResourceSearchParam {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name of search parameter
   */
  name: string;
  /* 
   * Source of definition for parameter
   */
  definition?: canonical;
  /* 
   * number | date | string | token | reference | composite | quantity | uri | special
   */
  type: code;
  /* 
   * Server-specific usage
   */
  documentation?: markdown;
}
export interface CapabilityStatementRestResourceOperation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name by which the operation/query is invoked
   */
  name: string;
  /* 
   * The defined operation/query
   */
  definition: canonical;
  /* 
   * Specific details about operation behavior
   */
  documentation?: markdown;
}
export interface CapabilityStatementRestResource {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A resource type that is supported
   */
  type: code;
  /* 
   * Base System profile for all uses of resource
   */
  profile?: canonical;
  /* 
   * Profiles for use cases supported
   */
  supportedProfile?: Array<canonical>;
  /* 
   * Additional information about the use of the resource type
   */
  documentation?: markdown;
  /* 
   * What operations are supported?
   */
  interaction?: Array<CapabilityStatementRestResourceInteraction>;
  /* 
   * no-version | versioned | versioned-update
   */
  versioning?: code;
  /* 
   * Whether vRead can return past versions
   */
  readHistory?: boolean;
  /* 
   * If update can commit to a new identity
   */
  updateCreate?: boolean;
  /* 
   * If allows/uses conditional create
   */
  conditionalCreate?: boolean;
  /* 
   * not-supported | modified-since | not-match | full-support
   */
  conditionalRead?: code;
  /* 
   * If allows/uses conditional update
   */
  conditionalUpdate?: boolean;
  /* 
   * not-supported | single | multiple - how conditional delete is supported
   */
  conditionalDelete?: code;
  /* 
   * literal | logical | resolves | enforced | local
   */
  referencePolicy?: Array<code>;
  /* 
   * _include values supported by the server
   */
  searchInclude?: Array<string>;
  /* 
   * _revinclude values supported by the server
   */
  searchRevInclude?: Array<string>;
  /* 
   * Search parameters supported by implementation
   */
  searchParam?: Array<CapabilityStatementRestResourceSearchParam>;
  /* 
   * Definition of a resource operation
   */
  operation?: Array<CapabilityStatementRestResourceOperation>;
}
export interface CapabilityStatementRestInteraction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * transaction | batch | search-system | history-system
   */
  code: code;
  /* 
   * Anything special about operation behavior
   */
  documentation?: markdown;
}
export interface CapabilityStatementRest {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * client | server
   */
  mode: code;
  /* 
   * General description of implementation
   */
  documentation?: markdown;
  /* 
   * Information about security of implementation
   */
  security?: CapabilityStatementRestSecurity;
  /* 
   * Resource served on the REST interface
   */
  resource?: Array<CapabilityStatementRestResource>;
  /* 
   * What operations are supported?
   */
  interaction?: Array<CapabilityStatementRestInteraction>;
  /* 
   * Search parameters for searching all resources
   */
  searchParam?: CapabilityStatementRestResourceSearchParam;
  /* 
   * Definition of a system level operation
   */
  operation?: CapabilityStatementRestResourceOperation;
  /* 
   * Compartments served/used by system
   */
  compartment?: Array<canonical>;
}
export interface CapabilityStatementMessagingEndpoint {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * http | ftp | mllp +
   */
  protocol: Coding;
  /* 
   * Network address or identifier of the end-point
   */
  address: url;
}
export interface CapabilityStatementMessagingSupportedMessage {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * sender | receiver
   */
  mode: code;
  /* 
   * Message supported by this system
   */
  definition: canonical;
}
export interface CapabilityStatementMessaging {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Where messages should be sent
   */
  endpoint?: Array<CapabilityStatementMessagingEndpoint>;
  /* 
   * Reliable Message Cache Length (min)
   */
  reliableCache?: unsignedInt;
  /* 
   * Messaging interface behavior details
   */
  documentation?: markdown;
  /* 
   * Messages supported by this system
   */
  supportedMessage?: Array<CapabilityStatementMessagingSupportedMessage>;
}
export interface CapabilityStatementDocument {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * producer | consumer
   */
  mode: code;
  /* 
   * Description of document support
   */
  documentation?: markdown;
  /* 
   * Constraint on the resources used in the document
   */
  profile: canonical;
}
export interface CapabilityStatement {
resourceType: "CapabilityStatement"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this capability statement, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Business version of the capability statement
   */
  version?: string;
  /* 
   * Name for this capability statement (computer friendly)
   */
  name?: string;
  /* 
   * Name for this capability statement (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the capability statement
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for capability statement (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this capability statement is defined
   */
  purpose?: markdown;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * instance | capability | requirements
   */
  kind: code;
  /* 
   * Canonical URL of another capability statement this implements
   */
  instantiates?: Array<canonical>;
  /* 
   * Canonical URL of another capability statement this adds to
   */
  imports?: Array<canonical>;
  /* 
   * Software that is covered by this capability statement
   */
  software?: CapabilityStatementSoftware;
  /* 
   * If this describes a specific instance
   */
  implementation?: CapabilityStatementImplementation;
  /* 
   * FHIR Version the system supports
   */
  fhirVersion: code;
  /* 
   * formats supported (xml | json | ttl | mime type)
   */
  format: Array<code>;
  /* 
   * Patch formats supported
   */
  patchFormat?: Array<code>;
  /* 
   * Implementation guides supported
   */
  implementationGuide?: Array<canonical>;
  /* 
   * If the endpoint is a RESTful one
   */
  rest?: Array<CapabilityStatementRest>;
  /* 
   * If messaging is supported
   */
  messaging?: Array<CapabilityStatementMessaging>;
  /* 
   * Document definition
   */
  document?: Array<CapabilityStatementDocument>;
}

export interface CarePlanActivityDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Appointment | CommunicationRequest | DeviceRequest | MedicationRequest | NutritionOrder | Task | ServiceRequest | VisionPrescription
   */
  kind?: code;
  /* 
   * Instantiates FHIR protocol or definition
   */
  instantiatesCanonical?: Array<canonical>;
  /* 
   * Instantiates external protocol or definition
   */
  instantiatesUri?: Array<uri>;
  /* 
   * Detail type of activity
   */
  code?: CodeableConcept;
  /* 
   * Why activity should be done or why activity was prohibited
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why activity is needed
   */
  reasonReference?: Array<Reference>;
  /* 
   * Goals this activity relates to
   */
  goal?: Array<Reference>;
  /* 
   * not-started | scheduled | in-progress | on-hold | completed | cancelled | stopped | unknown | entered-in-error
   */
  status: code;
  /* 
   * Reason for current status
   */
  statusReason?: CodeableConcept;
  /* 
   * If true, activity is prohibiting action
   */
  doNotPerform?: boolean;
  /* 
   * When activity is to occur
   */
  scheduledTiming?: Timing;
  /* 
   * When activity is to occur
   */
  scheduledPeriod?: Period;
  /* 
   * When activity is to occur
   */
  scheduledString?: string;
  /* 
   * Where it should happen
   */
  location?: Reference;
  /* 
   * Who will be responsible?
   */
  performer?: Array<Reference>;
  /* 
   * What is to be administered/supplied
   */
  productCodeableConcept?: CodeableConcept;
  /* 
   * What is to be administered/supplied
   */
  productReference?: Reference;
  /* 
   * How to consume/day?
   */
  dailyAmount?: Quantity;
  /* 
   * How much to administer/supply/consume
   */
  quantity?: Quantity;
  /* 
   * Extra info describing activity to perform
   */
  description?: string;
}
export interface CarePlanActivity {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Results of the activity
   */
  outcomeCodeableConcept?: Array<CodeableConcept>;
  /* 
   * Appointment, Encounter, Procedure, etc.
   */
  outcomeReference?: Array<Reference>;
  /* 
   * Comments about the activity status/progress
   */
  progress?: Array<Annotation>;
  /* 
   * Activity details defined in specific resource
   */
  reference?: Reference;
  /* 
   * In-line definition of activity
   */
  detail?: CarePlanActivityDetail;
}
export interface CarePlan {
resourceType: "CarePlan"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Ids for this plan
   */
  identifier?: Array<Identifier>;
  /* 
   * Instantiates FHIR protocol or definition
   */
  instantiatesCanonical?: Array<canonical>;
  /* 
   * Instantiates external protocol or definition
   */
  instantiatesUri?: Array<uri>;
  /* 
   * Fulfills CarePlan
   */
  basedOn?: Array<Reference>;
  /* 
   * CarePlan replaced by this CarePlan
   */
  replaces?: Array<Reference>;
  /* 
   * Part of referenced CarePlan
   */
  partOf?: Array<Reference>;
  /* 
   * draft | active | on-hold | revoked | completed | entered-in-error | unknown
   */
  status: code;
  /* 
   * proposal | plan | order | option
   */
  intent: code;
  /* 
   * Type of plan
   */
  category?: Array<CodeableConcept>;
  /* 
   * Human-friendly name for the care plan
   */
  title?: string;
  /* 
   * Summary of nature of plan
   */
  description?: string;
  /* 
   * Who the care plan is for
   */
  subject: Reference;
  /* 
   * Encounter created as part of
   */
  encounter?: Reference;
  /* 
   * Time period plan covers
   */
  period?: Period;
  /* 
   * Date record was first recorded
   */
  created?: dateTime;
  /* 
   * Who is the designated responsible party
   */
  author?: Reference;
  /* 
   * Who provided the content of the care plan
   */
  contributor?: Array<Reference>;
  /* 
   * Who's involved in plan?
   */
  careTeam?: Array<Reference>;
  /* 
   * Health issues this plan addresses
   */
  addresses?: Array<Reference>;
  /* 
   * Information considered as part of plan
   */
  supportingInfo?: Array<Reference>;
  /* 
   * Desired outcome of plan
   */
  goal?: Array<Reference>;
  /* 
   * Action to occur as part of plan
   */
  activity?: Array<CarePlanActivity>;
  /* 
   * Comments about the plan
   */
  note?: Array<Annotation>;
}

export interface CareTeamParticipant {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of involvement
   */
  role?: Array<CodeableConcept>;
  /* 
   * Who is involved
   */
  member?: Reference;
  /* 
   * Organization of the practitioner
   */
  onBehalfOf?: Reference;
  /* 
   * Time period of participant
   */
  period?: Period;
}
export interface CareTeam {
resourceType: "CareTeam"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Ids for this team
   */
  identifier?: Array<Identifier>;
  /* 
   * proposed | active | suspended | inactive | entered-in-error
   */
  status?: code;
  /* 
   * Type of team
   */
  category?: Array<CodeableConcept>;
  /* 
   * Name of the team, such as crisis assessment team
   */
  name?: string;
  /* 
   * Who care team is for
   */
  subject?: Reference;
  /* 
   * Encounter created as part of
   */
  encounter?: Reference;
  /* 
   * Time period team covers
   */
  period?: Period;
  /* 
   * Members of the team
   */
  participant?: Array<CareTeamParticipant>;
  /* 
   * Why the care team exists
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why the care team exists
   */
  reasonReference?: Array<Reference>;
  /* 
   * Organization responsible for the care team
   */
  managingOrganization?: Array<Reference>;
  /* 
   * A contact detail for the care team (that applies to all members)
   */
  telecom?: Array<ContactPoint>;
  /* 
   * Comments made about the CareTeam
   */
  note?: Array<Annotation>;
}

export interface CatalogEntryRelatedEntry {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * triggers | is-replaced-by
   */
  relationtype: code;
  /* 
   * The reference to the related item
   */
  item: Reference;
}
export interface CatalogEntry {
resourceType: "CatalogEntry"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique identifier of the catalog item
   */
  identifier?: Array<Identifier>;
  /* 
   * The type of item - medication, device, service, protocol or other
   */
  type?: CodeableConcept;
  /* 
   * Whether the entry represents an orderable item
   */
  orderable: boolean;
  /* 
   * The item that is being defined
   */
  referencedItem: Reference;
  /* 
   * Any additional identifier(s) for the catalog item, in the same granularity or concept
   */
  additionalIdentifier?: Array<Identifier>;
  /* 
   * Classification (category or class) of the item entry
   */
  classification?: Array<CodeableConcept>;
  /* 
   * draft | active | retired | unknown
   */
  status?: code;
  /* 
   * The time period in which this catalog entry is expected to be active
   */
  validityPeriod?: Period;
  /* 
   * The date until which this catalog entry is expected to be active
   */
  validTo?: dateTime;
  /* 
   * When was this catalog last updated
   */
  lastUpdated?: dateTime;
  /* 
   * Additional characteristics of the catalog entry
   */
  additionalCharacteristic?: Array<CodeableConcept>;
  /* 
   * Additional classification of the catalog entry
   */
  additionalClassification?: Array<CodeableConcept>;
  /* 
   * An item that this catalog entry is related to
   */
  relatedEntry?: Array<CatalogEntryRelatedEntry>;
}

export interface ChargeItemPerformer {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * What type of performance was done
   */
  function?: CodeableConcept;
  /* 
   * Individual who was performing
   */
  actor: Reference;
}
export interface ChargeItem {
resourceType: "ChargeItem"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for item
   */
  identifier?: Array<Identifier>;
  /* 
   * Defining information about the code of this charge item
   */
  definitionUri?: Array<uri>;
  /* 
   * Resource defining the code of this ChargeItem
   */
  definitionCanonical?: Array<canonical>;
  /* 
   * planned | billable | not-billable | aborted | billed | entered-in-error | unknown
   */
  status: code;
  /* 
   * Part of referenced ChargeItem
   */
  partOf?: Array<Reference>;
  /* 
   * A code that identifies the charge, like a billing code
   */
  code: CodeableConcept;
  /* 
   * Individual service was done for/to
   */
  subject: Reference;
  /* 
   * Encounter / Episode associated with event
   */
  context?: Reference;
  /* 
   * When the charged service was applied
   */
  occurrenceDateTime?: dateTime;
  /* 
   * When the charged service was applied
   */
  occurrencePeriod?: Period;
  /* 
   * When the charged service was applied
   */
  occurrenceTiming?: Timing;
  /* 
   * Who performed charged service
   */
  performer?: Array<ChargeItemPerformer>;
  /* 
   * Organization providing the charged service
   */
  performingOrganization?: Reference;
  /* 
   * Organization requesting the charged service
   */
  requestingOrganization?: Reference;
  /* 
   * Organization that has ownership of the (potential, future) revenue
   */
  costCenter?: Reference;
  /* 
   * Quantity of which the charge item has been serviced
   */
  quantity?: Quantity;
  /* 
   * Anatomical location, if relevant
   */
  bodysite?: Array<CodeableConcept>;
  /* 
   * Factor overriding the associated rules
   */
  factorOverride?: decimal;
  /* 
   * Price overriding the associated rules
   */
  priceOverride?: Money;
  /* 
   * Reason for overriding the list price/factor
   */
  overrideReason?: string;
  /* 
   * Individual who was entering
   */
  enterer?: Reference;
  /* 
   * Date the charge item was entered
   */
  enteredDate?: dateTime;
  /* 
   * Why was the charged  service rendered?
   */
  reason?: Array<CodeableConcept>;
  /* 
   * Which rendered service is being charged?
   */
  service?: Array<Reference>;
  /* 
   * Product charged
   */
  productReference?: Reference;
  /* 
   * Product charged
   */
  productCodeableConcept?: CodeableConcept;
  /* 
   * Account to place this charge
   */
  account?: Array<Reference>;
  /* 
   * Comments made about the ChargeItem
   */
  note?: Array<Annotation>;
  /* 
   * Further information supporting this charge
   */
  supportingInformation?: Array<Reference>;
}

export interface ChargeItemDefinitionApplicability {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Natural language description of the condition
   */
  description?: string;
  /* 
   * Language of the expression
   */
  language?: string;
  /* 
   * Boolean-valued expression
   */
  expression?: string;
}
export interface ChargeItemDefinitionPropertyGroupPriceComponent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * base | surcharge | deduction | discount | tax | informational
   */
  type: code;
  /* 
   * Code identifying the specific component
   */
  code?: CodeableConcept;
  /* 
   * Factor used for calculating this component
   */
  factor?: decimal;
  /* 
   * Monetary amount associated with this component
   */
  amount?: Money;
}
export interface ChargeItemDefinitionPropertyGroup {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Conditions under which the priceComponent is applicable
   */
  applicability?: ChargeItemDefinitionApplicability;
  /* 
   * Components of total line item price
   */
  priceComponent?: Array<ChargeItemDefinitionPropertyGroupPriceComponent>;
}
export interface ChargeItemDefinition {
resourceType: "ChargeItemDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this charge item definition, represented as a URI (globally unique)
   */
  url: uri;
  /* 
   * Additional identifier for the charge item definition
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the charge item definition
   */
  version?: string;
  /* 
   * Name for this charge item definition (human friendly)
   */
  title?: string;
  /* 
   * Underlying externally-defined charge item definition
   */
  derivedFromUri?: Array<uri>;
  /* 
   * A larger definition of which this particular definition is a component or step
   */
  partOf?: Array<canonical>;
  /* 
   * Completed or terminated request(s) whose function is taken by this new request
   */
  replaces?: Array<canonical>;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the charge item definition
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for charge item definition (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the charge item definition was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the charge item definition was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the charge item definition is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * Billing codes or product types this definition applies to
   */
  code?: CodeableConcept;
  /* 
   * Instances this definition applies to
   */
  instance?: Array<Reference>;
  /* 
   * Whether or not the billing code is applicable
   */
  applicability?: Array<ChargeItemDefinitionApplicability>;
  /* 
   * Group of properties which are applicable under the same conditions
   */
  propertyGroup?: Array<ChargeItemDefinitionPropertyGroup>;
}

export interface ClaimRelated {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Reference to the related claim
   */
  claim?: Reference;
  /* 
   * How the reference claim is related
   */
  relationship?: CodeableConcept;
  /* 
   * File or case reference
   */
  reference?: Identifier;
}
export interface ClaimPayee {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Category of recipient
   */
  type: CodeableConcept;
  /* 
   * Recipient reference
   */
  party?: Reference;
}
export interface ClaimCareTeam {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Order of care team
   */
  sequence: positiveInt;
  /* 
   * Practitioner or organization
   */
  provider: Reference;
  /* 
   * Indicator of the lead practitioner
   */
  responsible?: boolean;
  /* 
   * Function within the team
   */
  role?: CodeableConcept;
  /* 
   * Practitioner credential or specialization
   */
  qualification?: CodeableConcept;
}
export interface ClaimSupportingInfo {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Information instance identifier
   */
  sequence: positiveInt;
  /* 
   * Classification of the supplied information
   */
  category: CodeableConcept;
  /* 
   * Type of information
   */
  code?: CodeableConcept;
  /* 
   * When it occurred
   */
  timingDate?: date;
  /* 
   * When it occurred
   */
  timingPeriod?: Period;
  /* 
   * Data to be provided
   */
  valueBoolean?: boolean;
  /* 
   * Data to be provided
   */
  valueString?: string;
  /* 
   * Data to be provided
   */
  valueQuantity?: Quantity;
  /* 
   * Data to be provided
   */
  valueAttachment?: Attachment;
  /* 
   * Data to be provided
   */
  valueReference?: Reference;
  /* 
   * Explanation for the information
   */
  reason?: CodeableConcept;
}
export interface ClaimDiagnosis {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Diagnosis instance identifier
   */
  sequence: positiveInt;
  /* 
   * Nature of illness or problem
   */
  diagnosisCodeableConcept?: CodeableConcept;
  /* 
   * Nature of illness or problem
   */
  diagnosisReference?: Reference;
  /* 
   * Timing or nature of the diagnosis
   */
  type?: Array<CodeableConcept>;
  /* 
   * Present on admission
   */
  onAdmission?: CodeableConcept;
  /* 
   * Package billing code
   */
  packageCode?: CodeableConcept;
}
export interface ClaimProcedure {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Procedure instance identifier
   */
  sequence: positiveInt;
  /* 
   * Category of Procedure
   */
  type?: Array<CodeableConcept>;
  /* 
   * When the procedure was performed
   */
  date?: dateTime;
  /* 
   * Specific clinical procedure
   */
  procedureCodeableConcept?: CodeableConcept;
  /* 
   * Specific clinical procedure
   */
  procedureReference?: Reference;
  /* 
   * Unique device identifier
   */
  udi?: Array<Reference>;
}
export interface ClaimInsurance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Insurance instance identifier
   */
  sequence: positiveInt;
  /* 
   * Coverage to be used for adjudication
   */
  focal: boolean;
  /* 
   * Pre-assigned Claim number
   */
  identifier?: Identifier;
  /* 
   * Insurance information
   */
  coverage: Reference;
  /* 
   * Additional provider contract number
   */
  businessArrangement?: string;
  /* 
   * Prior authorization reference number
   */
  preAuthRef?: Array<string>;
  /* 
   * Adjudication results
   */
  claimResponse?: Reference;
}
export interface ClaimAccident {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * When the incident occurred
   */
  date: date;
  /* 
   * The nature of the accident
   */
  type?: CodeableConcept;
  /* 
   * Where the event occurred
   */
  locationAddress?: Address;
  /* 
   * Where the event occurred
   */
  locationReference?: Reference;
}
export interface ClaimItemDetailSubDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Item instance identifier
   */
  sequence: positiveInt;
  /* 
   * Revenue or cost center code
   */
  revenue?: CodeableConcept;
  /* 
   * Benefit classification
   */
  category?: CodeableConcept;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Service/Product billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Program the product or service is provided under
   */
  programCode?: Array<CodeableConcept>;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Unique device identifier
   */
  udi?: Array<Reference>;
}
export interface ClaimItemDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Item instance identifier
   */
  sequence: positiveInt;
  /* 
   * Revenue or cost center code
   */
  revenue?: CodeableConcept;
  /* 
   * Benefit classification
   */
  category?: CodeableConcept;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Service/Product billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Program the product or service is provided under
   */
  programCode?: Array<CodeableConcept>;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Unique device identifier
   */
  udi?: Array<Reference>;
  /* 
   * Product or service provided
   */
  subDetail?: Array<ClaimItemDetailSubDetail>;
}
export interface ClaimItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Item instance identifier
   */
  sequence: positiveInt;
  /* 
   * Applicable careTeam members
   */
  careTeamSequence?: Array<positiveInt>;
  /* 
   * Applicable diagnoses
   */
  diagnosisSequence?: Array<positiveInt>;
  /* 
   * Applicable procedures
   */
  procedureSequence?: Array<positiveInt>;
  /* 
   * Applicable exception and supporting information
   */
  informationSequence?: Array<positiveInt>;
  /* 
   * Revenue or cost center code
   */
  revenue?: CodeableConcept;
  /* 
   * Benefit classification
   */
  category?: CodeableConcept;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Product or service billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Program the product or service is provided under
   */
  programCode?: Array<CodeableConcept>;
  /* 
   * Date or dates of service or product delivery
   */
  servicedDate?: date;
  /* 
   * Date or dates of service or product delivery
   */
  servicedPeriod?: Period;
  /* 
   * Place of service or where product was supplied
   */
  locationCodeableConcept?: CodeableConcept;
  /* 
   * Place of service or where product was supplied
   */
  locationAddress?: Address;
  /* 
   * Place of service or where product was supplied
   */
  locationReference?: Reference;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Unique device identifier
   */
  udi?: Array<Reference>;
  /* 
   * Anatomical location
   */
  bodySite?: CodeableConcept;
  /* 
   * Anatomical sub-location
   */
  subSite?: Array<CodeableConcept>;
  /* 
   * Encounters related to this billed item
   */
  encounter?: Array<Reference>;
  /* 
   * Product or service provided
   */
  detail?: Array<ClaimItemDetail>;
}
export interface Claim {
resourceType: "Claim"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for claim
   */
  identifier?: Array<Identifier>;
  /* 
   * active | cancelled | draft | entered-in-error
   */
  status: code;
  /* 
   * Category or discipline
   */
  type: CodeableConcept;
  /* 
   * More granular claim type
   */
  subType?: CodeableConcept;
  /* 
   * claim | preauthorization | predetermination
   */
  use: code;
  /* 
   * The recipient of the products and services
   */
  patient: Reference;
  /* 
   * Relevant time frame for the claim
   */
  billablePeriod?: Period;
  /* 
   * Resource creation date
   */
  created: dateTime;
  /* 
   * Author of the claim
   */
  enterer?: Reference;
  /* 
   * Target
   */
  insurer?: Reference;
  /* 
   * Party responsible for the claim
   */
  provider: Reference;
  /* 
   * Desired processing ugency
   */
  priority: CodeableConcept;
  /* 
   * For whom to reserve funds
   */
  fundsReserve?: CodeableConcept;
  /* 
   * Prior or corollary claims
   */
  related?: Array<ClaimRelated>;
  /* 
   * Prescription authorizing services and products
   */
  prescription?: Reference;
  /* 
   * Original prescription if superseded by fulfiller
   */
  originalPrescription?: Reference;
  /* 
   * Recipient of benefits payable
   */
  payee?: ClaimPayee;
  /* 
   * Treatment referral
   */
  referral?: Reference;
  /* 
   * Servicing facility
   */
  facility?: Reference;
  /* 
   * Members of the care team
   */
  careTeam?: Array<ClaimCareTeam>;
  /* 
   * Supporting information
   */
  supportingInfo?: Array<ClaimSupportingInfo>;
  /* 
   * Pertinent diagnosis information
   */
  diagnosis?: Array<ClaimDiagnosis>;
  /* 
   * Clinical procedures performed
   */
  procedure?: Array<ClaimProcedure>;
  /* 
   * Patient insurance information
   */
  insurance: Array<ClaimInsurance>;
  /* 
   * Details of the event
   */
  accident?: ClaimAccident;
  /* 
   * Product or service provided
   */
  item?: Array<ClaimItem>;
  /* 
   * Total claim cost
   */
  total?: Money;
}

export interface ClaimResponseItemAdjudication {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of adjudication information
   */
  category: CodeableConcept;
  /* 
   * Explanation of adjudication outcome
   */
  reason?: CodeableConcept;
  /* 
   * Monetary amount
   */
  amount?: Money;
  /* 
   * Non-monetary value
   */
  value?: decimal;
}
export interface ClaimResponseItemDetailSubDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Claim sub-detail instance identifier
   */
  subDetailSequence: positiveInt;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Subdetail level adjudication details
   */
  adjudication?: ClaimResponseItemAdjudication;
}
export interface ClaimResponseItemDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Claim detail instance identifier
   */
  detailSequence: positiveInt;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Detail level adjudication details
   */
  adjudication: ClaimResponseItemAdjudication;
  /* 
   * Adjudication for claim sub-details
   */
  subDetail?: Array<ClaimResponseItemDetailSubDetail>;
}
export interface ClaimResponseItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Claim item instance identifier
   */
  itemSequence: positiveInt;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Adjudication details
   */
  adjudication: Array<ClaimResponseItemAdjudication>;
  /* 
   * Adjudication for claim details
   */
  detail?: Array<ClaimResponseItemDetail>;
}
export interface ClaimResponseAddItemDetailSubDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Service/Product billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Added items detail adjudication
   */
  adjudication: ClaimResponseItemAdjudication;
}
export interface ClaimResponseAddItemDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Service/Product billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Added items detail adjudication
   */
  adjudication: ClaimResponseItemAdjudication;
  /* 
   * Insurer added line items
   */
  subDetail?: Array<ClaimResponseAddItemDetailSubDetail>;
}
export interface ClaimResponseAddItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Item sequence number
   */
  itemSequence?: Array<positiveInt>;
  /* 
   * Detail sequence number
   */
  detailSequence?: Array<positiveInt>;
  /* 
   * Subdetail sequence number
   */
  subdetailSequence?: Array<positiveInt>;
  /* 
   * Authorized providers
   */
  provider?: Array<Reference>;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Service/Product billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Program the product or service is provided under
   */
  programCode?: Array<CodeableConcept>;
  /* 
   * Date or dates of service or product delivery
   */
  servicedDate?: date;
  /* 
   * Date or dates of service or product delivery
   */
  servicedPeriod?: Period;
  /* 
   * Place of service or where product was supplied
   */
  locationCodeableConcept?: CodeableConcept;
  /* 
   * Place of service or where product was supplied
   */
  locationAddress?: Address;
  /* 
   * Place of service or where product was supplied
   */
  locationReference?: Reference;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Anatomical location
   */
  bodySite?: CodeableConcept;
  /* 
   * Anatomical sub-location
   */
  subSite?: Array<CodeableConcept>;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Added items adjudication
   */
  adjudication: ClaimResponseItemAdjudication;
  /* 
   * Insurer added line details
   */
  detail?: Array<ClaimResponseAddItemDetail>;
}
export interface ClaimResponseTotal {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of adjudication information
   */
  category: CodeableConcept;
  /* 
   * Financial total for the category
   */
  amount: Money;
}
export interface ClaimResponsePayment {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Partial or complete payment
   */
  type: CodeableConcept;
  /* 
   * Payment adjustment for non-claim issues
   */
  adjustment?: Money;
  /* 
   * Explanation for the adjustment
   */
  adjustmentReason?: CodeableConcept;
  /* 
   * Expected date of payment
   */
  date?: date;
  /* 
   * Payable amount after adjustment
   */
  amount: Money;
  /* 
   * Business identifier for the payment
   */
  identifier?: Identifier;
}
export interface ClaimResponseProcessNote {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Note instance identifier
   */
  number?: positiveInt;
  /* 
   * display | print | printoper
   */
  type?: code;
  /* 
   * Note explanatory text
   */
  text: string;
  /* 
   * Language of the text
   */
  language?: CodeableConcept;
}
export interface ClaimResponseInsurance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Insurance instance identifier
   */
  sequence: positiveInt;
  /* 
   * Coverage to be used for adjudication
   */
  focal: boolean;
  /* 
   * Insurance information
   */
  coverage: Reference;
  /* 
   * Additional provider contract number
   */
  businessArrangement?: string;
  /* 
   * Adjudication results
   */
  claimResponse?: Reference;
}
export interface ClaimResponseError {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Item sequence number
   */
  itemSequence?: positiveInt;
  /* 
   * Detail sequence number
   */
  detailSequence?: positiveInt;
  /* 
   * Subdetail sequence number
   */
  subDetailSequence?: positiveInt;
  /* 
   * Error code detailing processing issues
   */
  code: CodeableConcept;
}
export interface ClaimResponse {
resourceType: "ClaimResponse"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for a claim response
   */
  identifier?: Array<Identifier>;
  /* 
   * active | cancelled | draft | entered-in-error
   */
  status: code;
  /* 
   * More granular claim type
   */
  type: CodeableConcept;
  /* 
   * More granular claim type
   */
  subType?: CodeableConcept;
  /* 
   * claim | preauthorization | predetermination
   */
  use: code;
  /* 
   * The recipient of the products and services
   */
  patient: Reference;
  /* 
   * Response creation date
   */
  created: dateTime;
  /* 
   * Party responsible for reimbursement
   */
  insurer: Reference;
  /* 
   * Party responsible for the claim
   */
  requestor?: Reference;
  /* 
   * Id of resource triggering adjudication
   */
  request?: Reference;
  /* 
   * queued | complete | error | partial
   */
  outcome: code;
  /* 
   * Disposition Message
   */
  disposition?: string;
  /* 
   * Preauthorization reference
   */
  preAuthRef?: string;
  /* 
   * Preauthorization reference effective period
   */
  preAuthPeriod?: Period;
  /* 
   * Party to be paid any benefits payable
   */
  payeeType?: CodeableConcept;
  /* 
   * Adjudication for claim line items
   */
  item?: Array<ClaimResponseItem>;
  /* 
   * Insurer added line items
   */
  addItem?: Array<ClaimResponseAddItem>;
  /* 
   * Header-level adjudication
   */
  adjudication?: ClaimResponseItemAdjudication;
  /* 
   * Adjudication totals
   */
  total?: Array<ClaimResponseTotal>;
  /* 
   * Payment Details
   */
  payment?: ClaimResponsePayment;
  /* 
   * Funds reserved status
   */
  fundsReserve?: CodeableConcept;
  /* 
   * Printed form identifier
   */
  formCode?: CodeableConcept;
  /* 
   * Printed reference or actual form
   */
  form?: Attachment;
  /* 
   * Note concerning adjudication
   */
  processNote?: Array<ClaimResponseProcessNote>;
  /* 
   * Request for additional information
   */
  communicationRequest?: Array<Reference>;
  /* 
   * Patient insurance information
   */
  insurance?: Array<ClaimResponseInsurance>;
  /* 
   * Processing errors
   */
  error?: Array<ClaimResponseError>;
}

export interface ClinicalImpressionInvestigation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A name/code for the set
   */
  code: CodeableConcept;
  /* 
   * Record of a specific investigation
   */
  item?: Array<Reference>;
}
export interface ClinicalImpressionFinding {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * What was found
   */
  itemCodeableConcept?: CodeableConcept;
  /* 
   * What was found
   */
  itemReference?: Reference;
  /* 
   * Which investigations support finding
   */
  basis?: string;
}
export interface ClinicalImpression {
resourceType: "ClinicalImpression"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * in-progress | completed | entered-in-error
   */
  status: code;
  /* 
   * Reason for current status
   */
  statusReason?: CodeableConcept;
  /* 
   * Kind of assessment performed
   */
  code?: CodeableConcept;
  /* 
   * Why/how the assessment was performed
   */
  description?: string;
  /* 
   * Patient or group assessed
   */
  subject: Reference;
  /* 
   * Encounter created as part of
   */
  encounter?: Reference;
  /* 
   * Time of assessment
   */
  effectiveDateTime?: dateTime;
  /* 
   * Time of assessment
   */
  effectivePeriod?: Period;
  /* 
   * When the assessment was documented
   */
  date?: dateTime;
  /* 
   * The clinician performing the assessment
   */
  assessor?: Reference;
  /* 
   * Reference to last assessment
   */
  previous?: Reference;
  /* 
   * Relevant impressions of patient state
   */
  problem?: Array<Reference>;
  /* 
   * One or more sets of investigations (signs, symptoms, etc.)
   */
  investigation?: Array<ClinicalImpressionInvestigation>;
  /* 
   * Clinical Protocol followed
   */
  protocol?: Array<uri>;
  /* 
   * Summary of the assessment
   */
  summary?: string;
  /* 
   * Possible or likely findings and diagnoses
   */
  finding?: Array<ClinicalImpressionFinding>;
  /* 
   * Estimate of likely outcome
   */
  prognosisCodeableConcept?: Array<CodeableConcept>;
  /* 
   * RiskAssessment expressing likely outcome
   */
  prognosisReference?: Array<Reference>;
  /* 
   * Information supporting the clinical impression
   */
  supportingInfo?: Array<Reference>;
  /* 
   * Comments made about the ClinicalImpression
   */
  note?: Array<Annotation>;
}

export interface CodeSystemFilter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code that identifies the filter
   */
  code: code;
  /* 
   * How or why the filter is used
   */
  description?: string;
  /* 
   * = | is-a | descendent-of | is-not-a | regex | in | not-in | generalizes | exists
   */
  operator: Array<code>;
  /* 
   * What to use for the value
   */
  value: string;
}
export interface CodeSystemProperty {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifies the property on the concepts, and when referred to in operations
   */
  code: code;
  /* 
   * Formal identifier for the property
   */
  uri?: uri;
  /* 
   * Why the property is defined, and/or what it conveys
   */
  description?: string;
  /* 
   * code | Coding | string | integer | boolean | dateTime | decimal
   */
  type: code;
}
export interface CodeSystemConceptDesignation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Human language of the designation
   */
  language?: code;
  /* 
   * Details how this designation would be used
   */
  use?: Coding;
  /* 
   * The text value for this designation
   */
  value: string;
}
export interface CodeSystemConceptProperty {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Reference to CodeSystem.property.code
   */
  code: code;
  /* 
   * Value of the property for this concept
   */
  valueCode?: code;
  /* 
   * Value of the property for this concept
   */
  valueCoding?: Coding;
  /* 
   * Value of the property for this concept
   */
  valueString?: string;
  /* 
   * Value of the property for this concept
   */
  valueInteger?: integer;
  /* 
   * Value of the property for this concept
   */
  valueBoolean?: boolean;
  /* 
   * Value of the property for this concept
   */
  valueDateTime?: dateTime;
  /* 
   * Value of the property for this concept
   */
  valueDecimal?: decimal;
}
export interface CodeSystemConcept {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code that identifies concept
   */
  code: code;
  /* 
   * Text to display to the user
   */
  display?: string;
  /* 
   * Formal definition
   */
  definition?: string;
  /* 
   * Additional representations for the concept
   */
  designation?: Array<CodeSystemConceptDesignation>;
  /* 
   * Property value for the concept
   */
  property?: Array<CodeSystemConceptProperty>;
  /* 
   * Child Concepts (is-a/contains/categorizes)
   */
  concept?: CodeSystemConcept;
}
export interface CodeSystem {
resourceType: "CodeSystem"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this code system, represented as a URI (globally unique) (Coding.system)
   */
  url?: uri;
  /* 
   * Additional identifier for the code system (business identifier)
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the code system (Coding.version)
   */
  version?: string;
  /* 
   * Name for this code system (computer friendly)
   */
  name?: string;
  /* 
   * Name for this code system (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the code system
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for code system (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this code system is defined
   */
  purpose?: markdown;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * If code comparison is case sensitive
   */
  caseSensitive?: boolean;
  /* 
   * Canonical reference to the value set with entire code system
   */
  valueSet?: canonical;
  /* 
   * grouped-by | is-a | part-of | classified-with
   */
  hierarchyMeaning?: code;
  /* 
   * If code system defines a compositional grammar
   */
  compositional?: boolean;
  /* 
   * If definitions are not stable
   */
  versionNeeded?: boolean;
  /* 
   * not-present | example | fragment | complete | supplement
   */
  content: code;
  /* 
   * Canonical URL of Code System this adds designations and properties to
   */
  supplements?: canonical;
  /* 
   * Total concepts in the code system
   */
  count?: unsignedInt;
  /* 
   * Filter that can be used in a value set
   */
  filter?: Array<CodeSystemFilter>;
  /* 
   * Additional information supplied about each concept
   */
  property?: Array<CodeSystemProperty>;
  /* 
   * Concepts in the code system
   */
  concept?: Array<CodeSystemConcept>;
}

export interface CommunicationPayload {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Message part content
   */
  contentString?: string;
  /* 
   * Message part content
   */
  contentAttachment?: Attachment;
  /* 
   * Message part content
   */
  contentReference?: Reference;
}
export interface Communication {
resourceType: "Communication"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Instantiates FHIR protocol or definition
   */
  instantiatesCanonical?: Array<canonical>;
  /* 
   * Instantiates external protocol or definition
   */
  instantiatesUri?: Array<uri>;
  /* 
   * Request fulfilled by this communication
   */
  basedOn?: Array<Reference>;
  /* 
   * Part of this action
   */
  partOf?: Array<Reference>;
  /* 
   * Reply to
   */
  inResponseTo?: Array<Reference>;
  /* 
   * preparation | in-progress | not-done | on-hold | stopped | completed | entered-in-error | unknown
   */
  status: code;
  /* 
   * Reason for current status
   */
  statusReason?: CodeableConcept;
  /* 
   * Message category
   */
  category?: Array<CodeableConcept>;
  /* 
   * routine | urgent | asap | stat
   */
  priority?: code;
  /* 
   * A channel of communication
   */
  medium?: Array<CodeableConcept>;
  /* 
   * Focus of message
   */
  subject?: Reference;
  /* 
   * Description of the purpose/content
   */
  topic?: CodeableConcept;
  /* 
   * Resources that pertain to this communication
   */
  about?: Array<Reference>;
  /* 
   * Encounter created as part of
   */
  encounter?: Reference;
  /* 
   * When sent
   */
  sent?: dateTime;
  /* 
   * When received
   */
  received?: dateTime;
  /* 
   * Message recipient
   */
  recipient?: Array<Reference>;
  /* 
   * Message sender
   */
  sender?: Reference;
  /* 
   * Indication for message
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why was communication done?
   */
  reasonReference?: Array<Reference>;
  /* 
   * Message payload
   */
  payload?: Array<CommunicationPayload>;
  /* 
   * Comments made about the communication
   */
  note?: Array<Annotation>;
}

export interface CommunicationRequestPayload {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Message part content
   */
  contentString?: string;
  /* 
   * Message part content
   */
  contentAttachment?: Attachment;
  /* 
   * Message part content
   */
  contentReference?: Reference;
}
export interface CommunicationRequest {
resourceType: "CommunicationRequest"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Fulfills plan or proposal
   */
  basedOn?: Array<Reference>;
  /* 
   * Request(s) replaced by this request
   */
  replaces?: Array<Reference>;
  /* 
   * Composite request this is part of
   */
  groupIdentifier?: Identifier;
  /* 
   * draft | active | on-hold | revoked | completed | entered-in-error | unknown
   */
  status: code;
  /* 
   * Reason for current status
   */
  statusReason?: CodeableConcept;
  /* 
   * Message category
   */
  category?: Array<CodeableConcept>;
  /* 
   * routine | urgent | asap | stat
   */
  priority?: code;
  /* 
   * True if request is prohibiting action
   */
  doNotPerform?: boolean;
  /* 
   * A channel of communication
   */
  medium?: Array<CodeableConcept>;
  /* 
   * Focus of message
   */
  subject?: Reference;
  /* 
   * Resources that pertain to this communication request
   */
  about?: Array<Reference>;
  /* 
   * Encounter created as part of
   */
  encounter?: Reference;
  /* 
   * Message payload
   */
  payload?: Array<CommunicationRequestPayload>;
  /* 
   * When scheduled
   */
  occurrenceDateTime?: dateTime;
  /* 
   * When scheduled
   */
  occurrencePeriod?: Period;
  /* 
   * When request transitioned to being actionable
   */
  authoredOn?: dateTime;
  /* 
   * Who/what is requesting service
   */
  requester?: Reference;
  /* 
   * Message recipient
   */
  recipient?: Array<Reference>;
  /* 
   * Message sender
   */
  sender?: Reference;
  /* 
   * Why is communication needed?
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why is communication needed?
   */
  reasonReference?: Array<Reference>;
  /* 
   * Comments made about communication request
   */
  note?: Array<Annotation>;
}

export interface CompartmentDefinitionResource {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name of resource type
   */
  code: code;
  /* 
   * Search Parameter Name, or chained parameters
   */
  param?: Array<string>;
  /* 
   * Additional documentation about the resource and compartment
   */
  documentation?: string;
}
export interface CompartmentDefinition {
resourceType: "CompartmentDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this compartment definition, represented as a URI (globally unique)
   */
  url: uri;
  /* 
   * Business version of the compartment definition
   */
  version?: string;
  /* 
   * Name for this compartment definition (computer friendly)
   */
  name: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the compartment definition
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Why this compartment definition is defined
   */
  purpose?: markdown;
  /* 
   * Patient | Encounter | RelatedPerson | Practitioner | Device
   */
  code: code;
  /* 
   * Whether the search syntax is supported
   */
  search: boolean;
  /* 
   * How a resource is related to the compartment
   */
  resource?: Array<CompartmentDefinitionResource>;
}

export interface CompositionAttester {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * personal | professional | legal | official
   */
  mode: code;
  /* 
   * When the composition was attested
   */
  time?: dateTime;
  /* 
   * Who attested the composition
   */
  party?: Reference;
}
export interface CompositionRelatesTo {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * replaces | transforms | signs | appends
   */
  code: code;
  /* 
   * Target of the relationship
   */
  targetIdentifier?: Identifier;
  /* 
   * Target of the relationship
   */
  targetReference?: Reference;
}
export interface CompositionEvent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code(s) that apply to the event being documented
   */
  code?: Array<CodeableConcept>;
  /* 
   * The period covered by the documentation
   */
  period?: Period;
  /* 
   * The event(s) being documented
   */
  detail?: Array<Reference>;
}
export interface CompositionSection {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Label for section (e.g. for ToC)
   */
  title?: string;
  /* 
   * Classification of section (recommended)
   */
  code?: CodeableConcept;
  /* 
   * Who and/or what authored the section
   */
  author?: Array<Reference>;
  /* 
   * Who/what the section is about, when it is not about the subject of composition
   */
  focus?: Reference;
  /* 
   * Text summary of the section, for human interpretation
   */
  text?: Narrative;
  /* 
   * working | snapshot | changes
   */
  mode?: code;
  /* 
   * Order of section entries
   */
  orderedBy?: CodeableConcept;
  /* 
   * A reference to data that supports this section
   */
  entry?: Array<Reference>;
  /* 
   * Why the section is empty
   */
  emptyReason?: CodeableConcept;
  /* 
   * Nested Section
   */
  section?: CompositionSection;
}
export interface Composition {
resourceType: "Composition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Version-independent identifier for the Composition
   */
  identifier?: Identifier;
  /* 
   * preliminary | final | amended | entered-in-error
   */
  status: code;
  /* 
   * Kind of composition (LOINC if possible)
   */
  type: CodeableConcept;
  /* 
   * Categorization of Composition
   */
  category?: Array<CodeableConcept>;
  /* 
   * Who and/or what the composition is about
   */
  subject?: Reference;
  /* 
   * Context of the Composition
   */
  encounter?: Reference;
  /* 
   * Composition editing time
   */
  date: dateTime;
  /* 
   * Who and/or what authored the composition
   */
  author: Array<Reference>;
  /* 
   * Human Readable name/title
   */
  title: string;
  /* 
   * As defined by affinity domain
   */
  confidentiality?: code;
  /* 
   * Attests to accuracy of composition
   */
  attester?: Array<CompositionAttester>;
  /* 
   * Organization which maintains the composition
   */
  custodian?: Reference;
  /* 
   * Relationships to other compositions/documents
   */
  relatesTo?: Array<CompositionRelatesTo>;
  /* 
   * The clinical service(s) being documented
   */
  event?: Array<CompositionEvent>;
  /* 
   * Composition is broken into sections
   */
  section?: Array<CompositionSection>;
}

export interface ConceptMapGroupElementTargetDependsOn {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Reference to property mapping depends on
   */
  property: uri;
  /* 
   * Code System (if necessary)
   */
  system?: canonical;
  /* 
   * Value of the referenced element
   */
  value: string;
  /* 
   * Display for the code (if value is a code)
   */
  display?: string;
}
export interface ConceptMapGroupElementTarget {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code that identifies the target element
   */
  code?: code;
  /* 
   * Display for the code
   */
  display?: string;
  /* 
   * relatedto | equivalent | equal | wider | subsumes | narrower | specializes | inexact | unmatched | disjoint
   */
  equivalence: code;
  /* 
   * Description of status/issues in mapping
   */
  comment?: string;
  /* 
   * Other elements required for this mapping (from context)
   */
  dependsOn?: Array<ConceptMapGroupElementTargetDependsOn>;
  /* 
   * Other concepts that this mapping also produces
   */
  product?: ConceptMapGroupElementTargetDependsOn;
}
export interface ConceptMapGroupElement {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifies element being mapped
   */
  code?: code;
  /* 
   * Display for the code
   */
  display?: string;
  /* 
   * Concept in target system for element
   */
  target?: Array<ConceptMapGroupElementTarget>;
}
export interface ConceptMapGroupUnmapped {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * provided | fixed | other-map
   */
  mode: code;
  /* 
   * Fixed code when mode = fixed
   */
  code?: code;
  /* 
   * Display for the code
   */
  display?: string;
  /* 
   * canonical reference to an additional ConceptMap to use for mapping if the source concept is unmapped
   */
  url?: canonical;
}
export interface ConceptMapGroup {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Source system where concepts to be mapped are defined
   */
  source?: uri;
  /* 
   * Specific version of the  code system
   */
  sourceVersion?: string;
  /* 
   * Target system that the concepts are to be mapped to
   */
  target?: uri;
  /* 
   * Specific version of the  code system
   */
  targetVersion?: string;
  /* 
   * Mappings for a concept from the source set
   */
  element: Array<ConceptMapGroupElement>;
  /* 
   * What to do when there is no mapping for the source concept
   */
  unmapped?: ConceptMapGroupUnmapped;
}
export interface ConceptMap {
resourceType: "ConceptMap"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this concept map, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the concept map
   */
  identifier?: Identifier;
  /* 
   * Business version of the concept map
   */
  version?: string;
  /* 
   * Name for this concept map (computer friendly)
   */
  name?: string;
  /* 
   * Name for this concept map (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the concept map
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for concept map (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this concept map is defined
   */
  purpose?: markdown;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * The source value set that contains the concepts that are being mapped
   */
  sourceUri?: uri;
  /* 
   * The source value set that contains the concepts that are being mapped
   */
  sourceCanonical?: canonical;
  /* 
   * The target value set which provides context for the mappings
   */
  targetUri?: uri;
  /* 
   * The target value set which provides context for the mappings
   */
  targetCanonical?: canonical;
  /* 
   * Same source and target systems
   */
  group?: Array<ConceptMapGroup>;
}

export interface ConditionStage {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Simple summary (disease specific)
   */
  summary?: CodeableConcept;
  /* 
   * Formal record of assessment
   */
  assessment?: Array<Reference>;
  /* 
   * Kind of staging
   */
  type?: CodeableConcept;
}
export interface ConditionEvidence {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Manifestation/symptom
   */
  code?: Array<CodeableConcept>;
  /* 
   * Supporting information found elsewhere
   */
  detail?: Array<Reference>;
}
export interface Condition {
resourceType: "Condition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Ids for this condition
   */
  identifier?: Array<Identifier>;
  /* 
   * active | recurrence | relapse | inactive | remission | resolved
   */
  clinicalStatus?: CodeableConcept;
  /* 
   * unconfirmed | provisional | differential | confirmed | refuted | entered-in-error
   */
  verificationStatus?: CodeableConcept;
  /* 
   * problem-list-item | encounter-diagnosis
   */
  category?: Array<CodeableConcept>;
  /* 
   * Subjective severity of condition
   */
  severity?: CodeableConcept;
  /* 
   * Identification of the condition, problem or diagnosis
   */
  code?: CodeableConcept;
  /* 
   * Anatomical location, if relevant
   */
  bodySite?: Array<CodeableConcept>;
  /* 
   * Who has the condition?
   */
  subject: Reference;
  /* 
   * Encounter created as part of
   */
  encounter?: Reference;
  /* 
   * Estimated or actual date,  date-time, or age
   */
  onsetDateTime?: dateTime;
  /* 
   * Estimated or actual date,  date-time, or age
   */
  onsetAge?: Age;
  /* 
   * Estimated or actual date,  date-time, or age
   */
  onsetPeriod?: Period;
  /* 
   * Estimated or actual date,  date-time, or age
   */
  onsetRange?: Range;
  /* 
   * Estimated or actual date,  date-time, or age
   */
  onsetString?: string;
  /* 
   * When in resolution/remission
   */
  abatementDateTime?: dateTime;
  /* 
   * When in resolution/remission
   */
  abatementAge?: Age;
  /* 
   * When in resolution/remission
   */
  abatementPeriod?: Period;
  /* 
   * When in resolution/remission
   */
  abatementRange?: Range;
  /* 
   * When in resolution/remission
   */
  abatementString?: string;
  /* 
   * Date record was first recorded
   */
  recordedDate?: dateTime;
  /* 
   * Who recorded the condition
   */
  recorder?: Reference;
  /* 
   * Person who asserts this condition
   */
  asserter?: Reference;
  /* 
   * Stage/grade, usually assessed formally
   */
  stage?: Array<ConditionStage>;
  /* 
   * Supporting evidence
   */
  evidence?: Array<ConditionEvidence>;
  /* 
   * Additional information about the Condition
   */
  note?: Array<Annotation>;
}

export interface ConsentPolicy {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Enforcement source for policy
   */
  authority?: uri;
  /* 
   * Specific policy covered by this consent
   */
  uri?: uri;
}
export interface ConsentVerification {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Has been verified
   */
  verified: boolean;
  /* 
   * Person who verified
   */
  verifiedWith?: Reference;
  /* 
   * When consent verified
   */
  verificationDate?: dateTime;
}
export interface ConsentProvisionActor {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * How the actor is involved
   */
  role: CodeableConcept;
  /* 
   * Resource for the actor (or group, by role)
   */
  reference: Reference;
}
export interface ConsentProvisionData {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * instance | related | dependents | authoredby
   */
  meaning: code;
  /* 
   * The actual data reference
   */
  reference: Reference;
}
export interface ConsentProvision {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * deny | permit
   */
  type?: code;
  /* 
   * Timeframe for this rule
   */
  period?: Period;
  /* 
   * Who|what controlled by this rule (or group, by role)
   */
  actor?: Array<ConsentProvisionActor>;
  /* 
   * Actions controlled by this rule
   */
  action?: Array<CodeableConcept>;
  /* 
   * Security Labels that define affected resources
   */
  securityLabel?: Array<Coding>;
  /* 
   * Context of activities covered by this rule
   */
  purpose?: Array<Coding>;
  /* 
   * e.g. Resource Type, Profile, CDA, etc.
   */
  class?: Array<Coding>;
  /* 
   * e.g. LOINC or SNOMED CT code, etc. in the content
   */
  code?: Array<CodeableConcept>;
  /* 
   * Timeframe for data controlled by this rule
   */
  dataPeriod?: Period;
  /* 
   * Data controlled by this rule
   */
  data?: Array<ConsentProvisionData>;
  /* 
   * Nested Exception Rules
   */
  provision?: ConsentProvision;
}
export interface Consent {
resourceType: "Consent"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifier for this record (external references)
   */
  identifier?: Array<Identifier>;
  /* 
   * draft | proposed | active | rejected | inactive | entered-in-error
   */
  status: code;
  /* 
   * Which of the four areas this resource covers (extensible)
   */
  scope: CodeableConcept;
  /* 
   * Classification of the consent statement - for indexing/retrieval
   */
  category: Array<CodeableConcept>;
  /* 
   * Who the consent applies to
   */
  patient?: Reference;
  /* 
   * When this Consent was created or indexed
   */
  dateTime?: dateTime;
  /* 
   * Who is agreeing to the policy and rules
   */
  performer?: Array<Reference>;
  /* 
   * Custodian of the consent
   */
  organization?: Array<Reference>;
  /* 
   * Source from which this consent is taken
   */
  sourceAttachment?: Attachment;
  /* 
   * Source from which this consent is taken
   */
  sourceReference?: Reference;
  /* 
   * Policies covered by this consent
   */
  policy?: Array<ConsentPolicy>;
  /* 
   * Regulation that this consents to
   */
  policyRule?: CodeableConcept;
  /* 
   * Consent Verified by patient or family
   */
  verification?: Array<ConsentVerification>;
  /* 
   * Constraints to the base Consent.policyRule
   */
  provision?: ConsentProvision;
}

export interface ContractContentDefinition {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Content structure and use
   */
  type: CodeableConcept;
  /* 
   * Detailed Content Type Definition
   */
  subType?: CodeableConcept;
  /* 
   * Publisher Entity
   */
  publisher?: Reference;
  /* 
   * When published
   */
  publicationDate?: dateTime;
  /* 
   * amended | appended | cancelled | disputed | entered-in-error | executable | executed | negotiable | offered | policy | rejected | renewed | revoked | resolved | terminated
   */
  publicationStatus: code;
  /* 
   * Publication Ownership
   */
  copyright?: markdown;
}
export interface ContractTermSecurityLabel {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Link to Security Labels
   */
  number?: Array<unsignedInt>;
  /* 
   * Confidentiality Protection
   */
  classification: Coding;
  /* 
   * Applicable Policy
   */
  category?: Array<Coding>;
  /* 
   * Handling Instructions
   */
  control?: Array<Coding>;
}
export interface ContractTermOfferParty {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Referenced entity
   */
  reference: Array<Reference>;
  /* 
   * Participant engagement type
   */
  role: CodeableConcept;
}
export interface ContractTermOfferAnswer {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The actual answer response
   */
  valueBoolean?: boolean;
  /* 
   * The actual answer response
   */
  valueDecimal?: decimal;
  /* 
   * The actual answer response
   */
  valueInteger?: integer;
  /* 
   * The actual answer response
   */
  valueDate?: date;
  /* 
   * The actual answer response
   */
  valueDateTime?: dateTime;
  /* 
   * The actual answer response
   */
  valueTime?: time;
  /* 
   * The actual answer response
   */
  valueString?: string;
  /* 
   * The actual answer response
   */
  valueUri?: uri;
  /* 
   * The actual answer response
   */
  valueAttachment?: Attachment;
  /* 
   * The actual answer response
   */
  valueCoding?: Coding;
  /* 
   * The actual answer response
   */
  valueQuantity?: Quantity;
  /* 
   * The actual answer response
   */
  valueReference?: Reference;
}
export interface ContractTermOffer {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Offer business ID
   */
  identifier?: Array<Identifier>;
  /* 
   * Offer Recipient
   */
  party?: Array<ContractTermOfferParty>;
  /* 
   * Negotiable offer asset
   */
  topic?: Reference;
  /* 
   * Contract Offer Type or Form
   */
  type?: CodeableConcept;
  /* 
   * Accepting party choice
   */
  decision?: CodeableConcept;
  /* 
   * How decision is conveyed
   */
  decisionMode?: Array<CodeableConcept>;
  /* 
   * Response to offer text
   */
  answer?: Array<ContractTermOfferAnswer>;
  /* 
   * Human readable offer text
   */
  text?: string;
  /* 
   * Pointer to text
   */
  linkId?: Array<string>;
  /* 
   * Offer restriction numbers
   */
  securityLabelNumber?: Array<unsignedInt>;
}
export interface ContractTermAssetContext {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Creator,custodian or owner
   */
  reference?: Reference;
  /* 
   * Codeable asset context
   */
  code?: Array<CodeableConcept>;
  /* 
   * Context description
   */
  text?: string;
}
export interface ContractTermAssetValuedItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Contract Valued Item Type
   */
  entityCodeableConcept?: CodeableConcept;
  /* 
   * Contract Valued Item Type
   */
  entityReference?: Reference;
  /* 
   * Contract Valued Item Number
   */
  identifier?: Identifier;
  /* 
   * Contract Valued Item Effective Tiem
   */
  effectiveTime?: dateTime;
  /* 
   * Count of Contract Valued Items
   */
  quantity?: Quantity;
  /* 
   * Contract Valued Item fee, charge, or cost
   */
  unitPrice?: Money;
  /* 
   * Contract Valued Item Price Scaling Factor
   */
  factor?: decimal;
  /* 
   * Contract Valued Item Difficulty Scaling Factor
   */
  points?: decimal;
  /* 
   * Total Contract Valued Item Value
   */
  net?: Money;
  /* 
   * Terms of valuation
   */
  payment?: string;
  /* 
   * When payment is due
   */
  paymentDate?: dateTime;
  /* 
   * Who will make payment
   */
  responsible?: Reference;
  /* 
   * Who will receive payment
   */
  recipient?: Reference;
  /* 
   * Pointer to specific item
   */
  linkId?: Array<string>;
  /* 
   * Security Labels that define affected terms
   */
  securityLabelNumber?: Array<unsignedInt>;
}
export interface ContractTermAsset {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Range of asset
   */
  scope?: CodeableConcept;
  /* 
   * Asset category
   */
  type?: Array<CodeableConcept>;
  /* 
   * Associated entities
   */
  typeReference?: Array<Reference>;
  /* 
   * Asset sub-category
   */
  subtype?: Array<CodeableConcept>;
  /* 
   * Kinship of the asset
   */
  relationship?: Coding;
  /* 
   * Circumstance of the asset
   */
  context?: Array<ContractTermAssetContext>;
  /* 
   * Quality desctiption of asset
   */
  condition?: string;
  /* 
   * Asset availability types
   */
  periodType?: Array<CodeableConcept>;
  /* 
   * Time period of the asset
   */
  period?: Array<Period>;
  /* 
   * Time period
   */
  usePeriod?: Array<Period>;
  /* 
   * Asset clause or question text
   */
  text?: string;
  /* 
   * Pointer to asset text
   */
  linkId?: Array<string>;
  /* 
   * Response to assets
   */
  answer?: ContractTermOfferAnswer;
  /* 
   * Asset restriction numbers
   */
  securityLabelNumber?: Array<unsignedInt>;
  /* 
   * Contract Valued Item List
   */
  valuedItem?: Array<ContractTermAssetValuedItem>;
}
export interface ContractTermActionSubject {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Entity of the action
   */
  reference: Array<Reference>;
  /* 
   * Role type of the agent
   */
  role?: CodeableConcept;
}
export interface ContractTermAction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * True if the term prohibits the  action
   */
  doNotPerform?: boolean;
  /* 
   * Type or form of the action
   */
  type: CodeableConcept;
  /* 
   * Entity of the action
   */
  subject?: Array<ContractTermActionSubject>;
  /* 
   * Purpose for the Contract Term Action
   */
  intent: CodeableConcept;
  /* 
   * Pointer to specific item
   */
  linkId?: Array<string>;
  /* 
   * State of the action
   */
  status: CodeableConcept;
  /* 
   * Episode associated with action
   */
  context?: Reference;
  /* 
   * Pointer to specific item
   */
  contextLinkId?: Array<string>;
  /* 
   * When action happens
   */
  occurrenceDateTime?: dateTime;
  /* 
   * When action happens
   */
  occurrencePeriod?: Period;
  /* 
   * When action happens
   */
  occurrenceTiming?: Timing;
  /* 
   * Who asked for action
   */
  requester?: Array<Reference>;
  /* 
   * Pointer to specific item
   */
  requesterLinkId?: Array<string>;
  /* 
   * Kind of service performer
   */
  performerType?: Array<CodeableConcept>;
  /* 
   * Competency of the performer
   */
  performerRole?: CodeableConcept;
  /* 
   * Actor that wil execute (or not) the action
   */
  performer?: Reference;
  /* 
   * Pointer to specific item
   */
  performerLinkId?: Array<string>;
  /* 
   * Why is action (not) needed?
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why is action (not) needed?
   */
  reasonReference?: Array<Reference>;
  /* 
   * Why action is to be performed
   */
  reason?: Array<string>;
  /* 
   * Pointer to specific item
   */
  reasonLinkId?: Array<string>;
  /* 
   * Comments about the action
   */
  note?: Array<Annotation>;
  /* 
   * Action restriction numbers
   */
  securityLabelNumber?: Array<unsignedInt>;
}
export interface ContractTerm {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Contract Term Number
   */
  identifier?: Identifier;
  /* 
   * Contract Term Issue Date Time
   */
  issued?: dateTime;
  /* 
   * Contract Term Effective Time
   */
  applies?: Period;
  /* 
   * Term Concern
   */
  topicCodeableConcept?: CodeableConcept;
  /* 
   * Term Concern
   */
  topicReference?: Reference;
  /* 
   * Contract Term Type or Form
   */
  type?: CodeableConcept;
  /* 
   * Contract Term Type specific classification
   */
  subType?: CodeableConcept;
  /* 
   * Term Statement
   */
  text?: string;
  /* 
   * Protection for the Term
   */
  securityLabel?: Array<ContractTermSecurityLabel>;
  /* 
   * Context of the Contract term
   */
  offer: ContractTermOffer;
  /* 
   * Contract Term Asset List
   */
  asset?: Array<ContractTermAsset>;
  /* 
   * Entity being ascribed responsibility
   */
  action?: Array<ContractTermAction>;
  /* 
   * Nested Contract Term Group
   */
  group?: ContractTerm;
}
export interface ContractSigner {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Contract Signatory Role
   */
  type: Coding;
  /* 
   * Contract Signatory Party
   */
  party: Reference;
  /* 
   * Contract Documentation Signature
   */
  signature: Array<Signature>;
}
export interface ContractFriendly {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Easily comprehended representation of this Contract
   */
  contentAttachment?: Attachment;
  /* 
   * Easily comprehended representation of this Contract
   */
  contentReference?: Reference;
}
export interface ContractLegal {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Contract Legal Text
   */
  contentAttachment?: Attachment;
  /* 
   * Contract Legal Text
   */
  contentReference?: Reference;
}
export interface ContractRule {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Computable Contract Rules
   */
  contentAttachment?: Attachment;
  /* 
   * Computable Contract Rules
   */
  contentReference?: Reference;
}
export interface Contract {
resourceType: "Contract"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Contract number
   */
  identifier?: Array<Identifier>;
  /* 
   * Basal definition
   */
  url?: uri;
  /* 
   * Business edition
   */
  version?: string;
  /* 
   * amended | appended | cancelled | disputed | entered-in-error | executable | executed | negotiable | offered | policy | rejected | renewed | revoked | resolved | terminated
   */
  status?: code;
  /* 
   * Negotiation status
   */
  legalState?: CodeableConcept;
  /* 
   * Source Contract Definition
   */
  instantiatesCanonical?: Reference;
  /* 
   * External Contract Definition
   */
  instantiatesUri?: uri;
  /* 
   * Content derived from the basal information
   */
  contentDerivative?: CodeableConcept;
  /* 
   * When this Contract was issued
   */
  issued?: dateTime;
  /* 
   * Effective time
   */
  applies?: Period;
  /* 
   * Contract cessation cause
   */
  expirationType?: CodeableConcept;
  /* 
   * Contract Target Entity
   */
  subject?: Array<Reference>;
  /* 
   * Authority under which this Contract has standing
   */
  authority?: Array<Reference>;
  /* 
   * A sphere of control governed by an authoritative jurisdiction, organization, or person
   */
  domain?: Array<Reference>;
  /* 
   * Specific Location
   */
  site?: Array<Reference>;
  /* 
   * Computer friendly designation
   */
  name?: string;
  /* 
   * Human Friendly name
   */
  title?: string;
  /* 
   * Subordinate Friendly name
   */
  subtitle?: string;
  /* 
   * Acronym or short name
   */
  alias?: Array<string>;
  /* 
   * Source of Contract
   */
  author?: Reference;
  /* 
   * Range of Legal Concerns
   */
  scope?: CodeableConcept;
  /* 
   * Focus of contract interest
   */
  topicCodeableConcept?: CodeableConcept;
  /* 
   * Focus of contract interest
   */
  topicReference?: Reference;
  /* 
   * Legal instrument category
   */
  type?: CodeableConcept;
  /* 
   * Subtype within the context of type
   */
  subType?: Array<CodeableConcept>;
  /* 
   * Contract precursor content
   */
  contentDefinition?: ContractContentDefinition;
  /* 
   * Contract Term List
   */
  term?: Array<ContractTerm>;
  /* 
   * Extra Information
   */
  supportingInfo?: Array<Reference>;
  /* 
   * Key event in Contract History
   */
  relevantHistory?: Array<Reference>;
  /* 
   * Contract Signatory
   */
  signer?: Array<ContractSigner>;
  /* 
   * Contract Friendly Language
   */
  friendly?: Array<ContractFriendly>;
  /* 
   * Contract Legal Language
   */
  legal?: Array<ContractLegal>;
  /* 
   * Computable Contract Language
   */
  rule?: Array<ContractRule>;
  /* 
   * Binding Contract
   */
  legallyBindingAttachment?: Attachment;
  /* 
   * Binding Contract
   */
  legallyBindingReference?: Reference;
}

export interface CoverageClass {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of class such as 'group' or 'plan'
   */
  type: CodeableConcept;
  /* 
   * Value associated with the type
   */
  value: string;
  /* 
   * Human readable description of the type and value
   */
  name?: string;
}
export interface CoverageCostToBeneficiaryException {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Exception category
   */
  type: CodeableConcept;
  /* 
   * The effective period of the exception
   */
  period?: Period;
}
export interface CoverageCostToBeneficiary {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Cost category
   */
  type?: CodeableConcept;
  /* 
   * The amount or percentage due from the beneficiary
   */
  valueQuantity?: Quantity;
  /* 
   * The amount or percentage due from the beneficiary
   */
  valueMoney?: Money;
  /* 
   * Exceptions for patient payments
   */
  exception?: Array<CoverageCostToBeneficiaryException>;
}
export interface Coverage {
resourceType: "Coverage"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for the coverage
   */
  identifier?: Array<Identifier>;
  /* 
   * active | cancelled | draft | entered-in-error
   */
  status: code;
  /* 
   * Coverage category such as medical or accident
   */
  type?: CodeableConcept;
  /* 
   * Owner of the policy
   */
  policyHolder?: Reference;
  /* 
   * Subscriber to the policy
   */
  subscriber?: Reference;
  /* 
   * ID assigned to the subscriber
   */
  subscriberId?: string;
  /* 
   * Plan beneficiary
   */
  beneficiary: Reference;
  /* 
   * Dependent number
   */
  dependent?: string;
  /* 
   * Beneficiary relationship to the subscriber
   */
  relationship?: CodeableConcept;
  /* 
   * Coverage start and end dates
   */
  period?: Period;
  /* 
   * Issuer of the policy
   */
  payor: Array<Reference>;
  /* 
   * Additional coverage classifications
   */
  class?: Array<CoverageClass>;
  /* 
   * Relative order of the coverage
   */
  order?: positiveInt;
  /* 
   * Insurer network
   */
  network?: string;
  /* 
   * Patient payments for services/products
   */
  costToBeneficiary?: Array<CoverageCostToBeneficiary>;
  /* 
   * Reimbursement to insurer
   */
  subrogation?: boolean;
  /* 
   * Contract details
   */
  contract?: Array<Reference>;
}

export interface CoverageEligibilityRequestSupportingInfo {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Information instance identifier
   */
  sequence: positiveInt;
  /* 
   * Data to be provided
   */
  information: Reference;
  /* 
   * Applies to all items
   */
  appliesToAll?: boolean;
}
export interface CoverageEligibilityRequestInsurance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Applicable coverage
   */
  focal?: boolean;
  /* 
   * Insurance information
   */
  coverage: Reference;
  /* 
   * Additional provider contract number
   */
  businessArrangement?: string;
}
export interface CoverageEligibilityRequestItemDiagnosis {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Nature of illness or problem
   */
  diagnosisCodeableConcept?: CodeableConcept;
  /* 
   * Nature of illness or problem
   */
  diagnosisReference?: Reference;
}
export interface CoverageEligibilityRequestItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Applicable exception or supporting information
   */
  supportingInfoSequence?: Array<positiveInt>;
  /* 
   * Benefit classification
   */
  category?: CodeableConcept;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService?: CodeableConcept;
  /* 
   * Product or service billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Perfoming practitioner
   */
  provider?: Reference;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Servicing facility
   */
  facility?: Reference;
  /* 
   * Applicable diagnosis
   */
  diagnosis?: Array<CoverageEligibilityRequestItemDiagnosis>;
  /* 
   * Product or service details
   */
  detail?: Array<Reference>;
}
export interface CoverageEligibilityRequest {
resourceType: "CoverageEligibilityRequest"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for coverage eligiblity request
   */
  identifier?: Array<Identifier>;
  /* 
   * active | cancelled | draft | entered-in-error
   */
  status: code;
  /* 
   * Desired processing priority
   */
  priority?: CodeableConcept;
  /* 
   * auth-requirements | benefits | discovery | validation
   */
  purpose: Array<code>;
  /* 
   * Intended recipient of products and services
   */
  patient: Reference;
  /* 
   * Estimated date or dates of service
   */
  servicedDate?: date;
  /* 
   * Estimated date or dates of service
   */
  servicedPeriod?: Period;
  /* 
   * Creation date
   */
  created: dateTime;
  /* 
   * Author
   */
  enterer?: Reference;
  /* 
   * Party responsible for the request
   */
  provider?: Reference;
  /* 
   * Coverage issuer
   */
  insurer: Reference;
  /* 
   * Servicing facility
   */
  facility?: Reference;
  /* 
   * Supporting information
   */
  supportingInfo?: Array<CoverageEligibilityRequestSupportingInfo>;
  /* 
   * Patient insurance information
   */
  insurance?: Array<CoverageEligibilityRequestInsurance>;
  /* 
   * Item to be evaluated for eligibiity
   */
  item?: Array<CoverageEligibilityRequestItem>;
}

export interface CoverageEligibilityResponseInsuranceItemBenefit {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Benefit classification
   */
  type: CodeableConcept;
  /* 
   * Benefits allowed
   */
  allowedUnsignedInt?: unsignedInt;
  /* 
   * Benefits allowed
   */
  allowedString?: string;
  /* 
   * Benefits allowed
   */
  allowedMoney?: Money;
  /* 
   * Benefits used
   */
  usedUnsignedInt?: unsignedInt;
  /* 
   * Benefits used
   */
  usedString?: string;
  /* 
   * Benefits used
   */
  usedMoney?: Money;
}
export interface CoverageEligibilityResponseInsuranceItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Benefit classification
   */
  category?: CodeableConcept;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService?: CodeableConcept;
  /* 
   * Product or service billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Performing practitioner
   */
  provider?: Reference;
  /* 
   * Excluded from the plan
   */
  excluded?: boolean;
  /* 
   * Short name for the benefit
   */
  name?: string;
  /* 
   * Description of the benefit or services covered
   */
  description?: string;
  /* 
   * In or out of network
   */
  network?: CodeableConcept;
  /* 
   * Individual or family
   */
  unit?: CodeableConcept;
  /* 
   * Annual or lifetime
   */
  term?: CodeableConcept;
  /* 
   * Benefit Summary
   */
  benefit?: Array<CoverageEligibilityResponseInsuranceItemBenefit>;
  /* 
   * Authorization required flag
   */
  authorizationRequired?: boolean;
  /* 
   * Type of required supporting materials
   */
  authorizationSupporting?: Array<CodeableConcept>;
  /* 
   * Preauthorization requirements endpoint
   */
  authorizationUrl?: uri;
}
export interface CoverageEligibilityResponseInsurance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Insurance information
   */
  coverage: Reference;
  /* 
   * Coverage inforce indicator
   */
  inforce?: boolean;
  /* 
   * When the benefits are applicable
   */
  benefitPeriod?: Period;
  /* 
   * Benefits and authorization details
   */
  item?: Array<CoverageEligibilityResponseInsuranceItem>;
}
export interface CoverageEligibilityResponseError {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Error code detailing processing issues
   */
  code: CodeableConcept;
}
export interface CoverageEligibilityResponse {
resourceType: "CoverageEligibilityResponse"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for coverage eligiblity request
   */
  identifier?: Array<Identifier>;
  /* 
   * active | cancelled | draft | entered-in-error
   */
  status: code;
  /* 
   * auth-requirements | benefits | discovery | validation
   */
  purpose: Array<code>;
  /* 
   * Intended recipient of products and services
   */
  patient: Reference;
  /* 
   * Estimated date or dates of service
   */
  servicedDate?: date;
  /* 
   * Estimated date or dates of service
   */
  servicedPeriod?: Period;
  /* 
   * Response creation date
   */
  created: dateTime;
  /* 
   * Party responsible for the request
   */
  requestor?: Reference;
  /* 
   * Eligibility request reference
   */
  request: Reference;
  /* 
   * queued | complete | error | partial
   */
  outcome: code;
  /* 
   * Disposition Message
   */
  disposition?: string;
  /* 
   * Coverage issuer
   */
  insurer: Reference;
  /* 
   * Patient insurance information
   */
  insurance?: Array<CoverageEligibilityResponseInsurance>;
  /* 
   * Preauthorization reference
   */
  preAuthRef?: string;
  /* 
   * Printed form identifier
   */
  form?: CodeableConcept;
  /* 
   * Processing errors
   */
  error?: Array<CoverageEligibilityResponseError>;
}

export interface DetectedIssueEvidence {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Manifestation
   */
  code?: Array<CodeableConcept>;
  /* 
   * Supporting information
   */
  detail?: Array<Reference>;
}
export interface DetectedIssueMitigation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * What mitigation?
   */
  action: CodeableConcept;
  /* 
   * Date committed
   */
  date?: dateTime;
  /* 
   * Who is committing?
   */
  author?: Reference;
}
export interface DetectedIssue {
resourceType: "DetectedIssue"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique id for the detected issue
   */
  identifier?: Array<Identifier>;
  /* 
   * registered | preliminary | final | amended +
   */
  status: code;
  /* 
   * Issue Category, e.g. drug-drug, duplicate therapy, etc.
   */
  code?: CodeableConcept;
  /* 
   * high | moderate | low
   */
  severity?: code;
  /* 
   * Associated patient
   */
  patient?: Reference;
  /* 
   * When identified
   */
  identifiedDateTime?: dateTime;
  /* 
   * When identified
   */
  identifiedPeriod?: Period;
  /* 
   * The provider or device that identified the issue
   */
  author?: Reference;
  /* 
   * Problem resource
   */
  implicated?: Array<Reference>;
  /* 
   * Supporting evidence
   */
  evidence?: Array<DetectedIssueEvidence>;
  /* 
   * Description and context
   */
  detail?: string;
  /* 
   * Authority for issue
   */
  reference?: uri;
  /* 
   * Step taken to address
   */
  mitigation?: Array<DetectedIssueMitigation>;
}

export interface DeviceUdiCarrier {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Mandatory fixed portion of UDI
   */
  deviceIdentifier?: string;
  /* 
   * UDI Issuing Organization
   */
  issuer?: uri;
  /* 
   * Regional UDI authority
   */
  jurisdiction?: uri;
  /* 
   * UDI Machine Readable Barcode String
   */
  carrierAIDC?: base64Binary;
  /* 
   * UDI Human Readable Barcode String
   */
  carrierHRF?: string;
  /* 
   * barcode | rfid | manual +
   */
  entryType?: code;
}
export interface DeviceDeviceName {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The name of the device
   */
  name: string;
  /* 
   * udi-label-name | user-friendly-name | patient-reported-name | manufacturer-name | model-name | other
   */
  type: code;
}
export interface DeviceSpecialization {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The standard that is used to operate and communicate
   */
  systemType: CodeableConcept;
  /* 
   * The version of the standard that is used to operate and communicate
   */
  version?: string;
}
export interface DeviceVersion {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The type of the device version
   */
  type?: CodeableConcept;
  /* 
   * A single component of the device version
   */
  component?: Identifier;
  /* 
   * The version text
   */
  value: string;
}
export interface DeviceProperty {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code that specifies the property DeviceDefinitionPropetyCode (Extensible)
   */
  type: CodeableConcept;
  /* 
   * Property value as a quantity
   */
  valueQuantity?: Array<Quantity>;
  /* 
   * Property value as a code, e.g., NTP4 (synced to NTP)
   */
  valueCode?: Array<CodeableConcept>;
}
export interface Device {
resourceType: "Device"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Instance identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * The reference to the definition for the device
   */
  definition?: Reference;
  /* 
   * Unique Device Identifier (UDI) Barcode string
   */
  udiCarrier?: Array<DeviceUdiCarrier>;
  /* 
   * active | inactive | entered-in-error | unknown
   */
  status?: code;
  /* 
   * online | paused | standby | offline | not-ready | transduc-discon | hw-discon | off
   */
  statusReason?: Array<CodeableConcept>;
  /* 
   * The distinct identification string
   */
  distinctIdentifier?: string;
  /* 
   * Name of device manufacturer
   */
  manufacturer?: string;
  /* 
   * Date when the device was made
   */
  manufactureDate?: dateTime;
  /* 
   * Date and time of expiry of this device (if applicable)
   */
  expirationDate?: dateTime;
  /* 
   * Lot number of manufacture
   */
  lotNumber?: string;
  /* 
   * Serial number assigned by the manufacturer
   */
  serialNumber?: string;
  /* 
   * The name of the device as given by the manufacturer
   */
  deviceName?: Array<DeviceDeviceName>;
  /* 
   * The model number for the device
   */
  modelNumber?: string;
  /* 
   * The part number of the device
   */
  partNumber?: string;
  /* 
   * The kind or type of device
   */
  type?: CodeableConcept;
  /* 
   * The capabilities supported on a  device, the standards to which the device conforms for a particular purpose, and used for the communication
   */
  specialization?: Array<DeviceSpecialization>;
  /* 
   * The actual design of the device or software version running on the device
   */
  version?: Array<DeviceVersion>;
  /* 
   * The actual configuration settings of a device as it actually operates, e.g., regulation status, time properties
   */
  property?: Array<DeviceProperty>;
  /* 
   * Patient to whom Device is affixed
   */
  patient?: Reference;
  /* 
   * Organization responsible for device
   */
  owner?: Reference;
  /* 
   * Details for human/organization for support
   */
  contact?: Array<ContactPoint>;
  /* 
   * Where the device is found
   */
  location?: Reference;
  /* 
   * Network address to contact device
   */
  url?: uri;
  /* 
   * Device notes and comments
   */
  note?: Array<Annotation>;
  /* 
   * Safety Characteristics of Device
   */
  safety?: Array<CodeableConcept>;
  /* 
   * The parent device
   */
  parent?: Reference;
}

export interface DeviceDefinitionUdiDeviceIdentifier {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The identifier that is to be associated with every Device that references this DeviceDefintiion for the issuer and jurisdication porvided in the DeviceDefinition.udiDeviceIdentifier
   */
  deviceIdentifier: string;
  /* 
   * The organization that assigns the identifier algorithm
   */
  issuer: uri;
  /* 
   * The jurisdiction to which the deviceIdentifier applies
   */
  jurisdiction: uri;
}
export interface DeviceDefinitionDeviceName {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The name of the device
   */
  name: string;
  /* 
   * udi-label-name | user-friendly-name | patient-reported-name | manufacturer-name | model-name | other
   */
  type: code;
}
export interface DeviceDefinitionSpecialization {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The standard that is used to operate and communicate
   */
  systemType: string;
  /* 
   * The version of the standard that is used to operate and communicate
   */
  version?: string;
}
export interface DeviceDefinitionCapability {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of capability
   */
  type: CodeableConcept;
  /* 
   * Description of capability
   */
  description?: Array<CodeableConcept>;
}
export interface DeviceDefinitionProperty {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code that specifies the property DeviceDefinitionPropetyCode (Extensible)
   */
  type: CodeableConcept;
  /* 
   * Property value as a quantity
   */
  valueQuantity?: Array<Quantity>;
  /* 
   * Property value as a code, e.g., NTP4 (synced to NTP)
   */
  valueCode?: Array<CodeableConcept>;
}
export interface DeviceDefinitionMaterial {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The substance
   */
  substance: CodeableConcept;
  /* 
   * Indicates an alternative material of the device
   */
  alternate?: boolean;
  /* 
   * Whether the substance is a known or suspected allergen
   */
  allergenicIndicator?: boolean;
}
export interface DeviceDefinition {
resourceType: "DeviceDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Instance identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Unique Device Identifier (UDI) Barcode string
   */
  udiDeviceIdentifier?: Array<DeviceDefinitionUdiDeviceIdentifier>;
  /* 
   * Name of device manufacturer
   */
  manufacturerString?: string;
  /* 
   * Name of device manufacturer
   */
  manufacturerReference?: Reference;
  /* 
   * A name given to the device to identify it
   */
  deviceName?: Array<DeviceDefinitionDeviceName>;
  /* 
   * The model number for the device
   */
  modelNumber?: string;
  /* 
   * What kind of device or device system this is
   */
  type?: CodeableConcept;
  /* 
   * The capabilities supported on a  device, the standards to which the device conforms for a particular purpose, and used for the communication
   */
  specialization?: Array<DeviceDefinitionSpecialization>;
  /* 
   * Available versions
   */
  version?: Array<string>;
  /* 
   * Safety characteristics of the device
   */
  safety?: Array<CodeableConcept>;
  /* 
   * Shelf Life and storage information
   */
  shelfLifeStorage?: Array<ProductShelfLife>;
  /* 
   * Dimensions, color etc.
   */
  physicalCharacteristics?: ProdCharacteristic;
  /* 
   * Language code for the human-readable text strings produced by the device (all supported)
   */
  languageCode?: Array<CodeableConcept>;
  /* 
   * Device capabilities
   */
  capability?: Array<DeviceDefinitionCapability>;
  /* 
   * The actual configuration settings of a device as it actually operates, e.g., regulation status, time properties
   */
  property?: Array<DeviceDefinitionProperty>;
  /* 
   * Organization responsible for device
   */
  owner?: Reference;
  /* 
   * Details for human/organization for support
   */
  contact?: Array<ContactPoint>;
  /* 
   * Network address to contact device
   */
  url?: uri;
  /* 
   * Access to on-line information
   */
  onlineInformation?: uri;
  /* 
   * Device notes and comments
   */
  note?: Array<Annotation>;
  /* 
   * The quantity of the device present in the packaging (e.g. the number of devices present in a pack, or the number of devices in the same package of the medicinal product)
   */
  quantity?: Quantity;
  /* 
   * The parent device it can be part of
   */
  parentDevice?: Reference;
  /* 
   * A substance used to create the material(s) of which the device is made
   */
  material?: Array<DeviceDefinitionMaterial>;
}

export interface DeviceMetricCalibration {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * unspecified | offset | gain | two-point
   */
  type?: code;
  /* 
   * not-calibrated | calibration-required | calibrated | unspecified
   */
  state?: code;
  /* 
   * Describes the time last calibration has been performed
   */
  time?: instant;
}
export interface DeviceMetric {
resourceType: "DeviceMetric"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Instance identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Identity of metric, for example Heart Rate or PEEP Setting
   */
  type: CodeableConcept;
  /* 
   * Unit of Measure for the Metric
   */
  unit?: CodeableConcept;
  /* 
   * Describes the link to the source Device
   */
  source?: Reference;
  /* 
   * Describes the link to the parent Device
   */
  parent?: Reference;
  /* 
   * on | off | standby | entered-in-error
   */
  operationalStatus?: code;
  /* 
   * black | red | green | yellow | blue | magenta | cyan | white
   */
  color?: code;
  /* 
   * measurement | setting | calculation | unspecified
   */
  category: code;
  /* 
   * Describes the measurement repetition time
   */
  measurementPeriod?: Timing;
  /* 
   * Describes the calibrations that have been performed or that are required to be performed
   */
  calibration?: Array<DeviceMetricCalibration>;
}

export interface DeviceRequestParameter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Device detail
   */
  code?: CodeableConcept;
  /* 
   * Value of detail
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * Value of detail
   */
  valueQuantity?: Quantity;
  /* 
   * Value of detail
   */
  valueRange?: Range;
  /* 
   * Value of detail
   */
  valueBoolean?: boolean;
}
export interface DeviceRequest {
resourceType: "DeviceRequest"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Request identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Instantiates FHIR protocol or definition
   */
  instantiatesCanonical?: Array<canonical>;
  /* 
   * Instantiates external protocol or definition
   */
  instantiatesUri?: Array<uri>;
  /* 
   * What request fulfills
   */
  basedOn?: Array<Reference>;
  /* 
   * What request replaces
   */
  priorRequest?: Array<Reference>;
  /* 
   * Identifier of composite request
   */
  groupIdentifier?: Identifier;
  /* 
   * draft | active | on-hold | revoked | completed | entered-in-error | unknown
   */
  status?: code;
  /* 
   * proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option
   */
  intent: code;
  /* 
   * routine | urgent | asap | stat
   */
  priority?: code;
  /* 
   * Device requested
   */
  codeReference?: Reference;
  /* 
   * Device requested
   */
  codeCodeableConcept?: CodeableConcept;
  /* 
   * Device details
   */
  parameter?: Array<DeviceRequestParameter>;
  /* 
   * Focus of request
   */
  subject: Reference;
  /* 
   * Encounter motivating request
   */
  encounter?: Reference;
  /* 
   * Desired time or schedule for use
   */
  occurrenceDateTime?: dateTime;
  /* 
   * Desired time or schedule for use
   */
  occurrencePeriod?: Period;
  /* 
   * Desired time or schedule for use
   */
  occurrenceTiming?: Timing;
  /* 
   * When recorded
   */
  authoredOn?: dateTime;
  /* 
   * Who/what is requesting diagnostics
   */
  requester?: Reference;
  /* 
   * Filler role
   */
  performerType?: CodeableConcept;
  /* 
   * Requested Filler
   */
  performer?: Reference;
  /* 
   * Coded Reason for request
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Linked Reason for request
   */
  reasonReference?: Array<Reference>;
  /* 
   * Associated insurance coverage
   */
  insurance?: Array<Reference>;
  /* 
   * Additional clinical information
   */
  supportingInfo?: Array<Reference>;
  /* 
   * Notes or comments
   */
  note?: Array<Annotation>;
  /* 
   * Request provenance
   */
  relevantHistory?: Array<Reference>;
}

export interface DeviceUseStatement {
resourceType: "DeviceUseStatement"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External identifier for this record
   */
  identifier?: Array<Identifier>;
  /* 
   * Fulfills plan, proposal or order
   */
  basedOn?: Array<Reference>;
  /* 
   * active | completed | entered-in-error +
   */
  status: code;
  /* 
   * Patient using device
   */
  subject: Reference;
  /* 
   * Supporting information
   */
  derivedFrom?: Array<Reference>;
  /* 
   * How often  the device was used
   */
  timingTiming?: Timing;
  /* 
   * How often  the device was used
   */
  timingPeriod?: Period;
  /* 
   * How often  the device was used
   */
  timingDateTime?: dateTime;
  /* 
   * When statement was recorded
   */
  recordedOn?: dateTime;
  /* 
   * Who made the statement
   */
  source?: Reference;
  /* 
   * Reference to device used
   */
  device: Reference;
  /* 
   * Why device was used
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why was DeviceUseStatement performed?
   */
  reasonReference?: Array<Reference>;
  /* 
   * Target body site
   */
  bodySite?: CodeableConcept;
  /* 
   * Addition details (comments, instructions)
   */
  note?: Array<Annotation>;
}

export interface DiagnosticReportMedia {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Comment about the image (e.g. explanation)
   */
  comment?: string;
  /* 
   * Reference to the image source
   */
  link: Reference;
}
export interface DiagnosticReport {
resourceType: "DiagnosticReport"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier for report
   */
  identifier?: Array<Identifier>;
  /* 
   * What was requested
   */
  basedOn?: Array<Reference>;
  /* 
   * registered | partial | preliminary | final +
   */
  status: code;
  /* 
   * Service category
   */
  category?: Array<CodeableConcept>;
  /* 
   * Name/Code for this diagnostic report
   */
  code: CodeableConcept;
  /* 
   * The subject of the report - usually, but not always, the patient
   */
  subject?: Reference;
  /* 
   * Health care event when test ordered
   */
  encounter?: Reference;
  /* 
   * Clinically relevant time/time-period for report
   */
  effectiveDateTime?: dateTime;
  /* 
   * Clinically relevant time/time-period for report
   */
  effectivePeriod?: Period;
  /* 
   * DateTime this version was made
   */
  issued?: instant;
  /* 
   * Responsible Diagnostic Service
   */
  performer?: Array<Reference>;
  /* 
   * Primary result interpreter
   */
  resultsInterpreter?: Array<Reference>;
  /* 
   * Specimens this report is based on
   */
  specimen?: Array<Reference>;
  /* 
   * Observations
   */
  result?: Array<Reference>;
  /* 
   * Reference to full details of imaging associated with the diagnostic report
   */
  imagingStudy?: Array<Reference>;
  /* 
   * Key images associated with this report
   */
  media?: Array<DiagnosticReportMedia>;
  /* 
   * Clinical conclusion (interpretation) of test results
   */
  conclusion?: string;
  /* 
   * Codes for the clinical conclusion of test results
   */
  conclusionCode?: Array<CodeableConcept>;
  /* 
   * Entire report as issued
   */
  presentedForm?: Array<Attachment>;
}

export interface DocumentManifestRelated {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifiers of things that are related
   */
  identifier?: Identifier;
  /* 
   * Related Resource
   */
  ref?: Reference;
}
export interface DocumentManifest {
resourceType: "DocumentManifest"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique Identifier for the set of documents
   */
  masterIdentifier?: Identifier;
  /* 
   * Other identifiers for the manifest
   */
  identifier?: Array<Identifier>;
  /* 
   * current | superseded | entered-in-error
   */
  status: code;
  /* 
   * Kind of document set
   */
  type?: CodeableConcept;
  /* 
   * The subject of the set of documents
   */
  subject?: Reference;
  /* 
   * When this document manifest created
   */
  created?: dateTime;
  /* 
   * Who and/or what authored the DocumentManifest
   */
  author?: Array<Reference>;
  /* 
   * Intended to get notified about this set of documents
   */
  recipient?: Array<Reference>;
  /* 
   * The source system/application/software
   */
  source?: uri;
  /* 
   * Human-readable description (title)
   */
  description?: string;
  /* 
   * Items in manifest
   */
  content: Array<Reference>;
  /* 
   * Related things
   */
  related?: Array<DocumentManifestRelated>;
}

export interface DocumentReferenceRelatesTo {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * replaces | transforms | signs | appends
   */
  code: code;
  /* 
   * Target of the relationship
   */
  target: Reference;
}
export interface DocumentReferenceContent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Where to access the document
   */
  attachment: Attachment;
  /* 
   * Format/content rules for the document
   */
  format?: Coding;
}
export interface DocumentReferenceContext {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Context of the document  content
   */
  encounter?: Array<Reference>;
  /* 
   * Main clinical acts documented
   */
  event?: Array<CodeableConcept>;
  /* 
   * Time of service that is being documented
   */
  period?: Period;
  /* 
   * Kind of facility where patient was seen
   */
  facilityType?: CodeableConcept;
  /* 
   * Additional details about where the content was created (e.g. clinical specialty)
   */
  practiceSetting?: CodeableConcept;
  /* 
   * Patient demographics from source
   */
  sourcePatientInfo?: Reference;
  /* 
   * Related identifiers or resources
   */
  related?: Array<Reference>;
}
export interface DocumentReference {
resourceType: "DocumentReference"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Master Version Specific Identifier
   */
  masterIdentifier?: Identifier;
  /* 
   * Other identifiers for the document
   */
  identifier?: Array<Identifier>;
  /* 
   * current | superseded | entered-in-error
   */
  status: code;
  /* 
   * preliminary | final | amended | entered-in-error
   */
  docStatus?: code;
  /* 
   * Kind of document (LOINC if possible)
   */
  type?: CodeableConcept;
  /* 
   * Categorization of document
   */
  category?: Array<CodeableConcept>;
  /* 
   * Who/what is the subject of the document
   */
  subject?: Reference;
  /* 
   * When this document reference was created
   */
  date?: instant;
  /* 
   * Who and/or what authored the document
   */
  author?: Array<Reference>;
  /* 
   * Who/what authenticated the document
   */
  authenticator?: Reference;
  /* 
   * Organization which maintains the document
   */
  custodian?: Reference;
  /* 
   * Relationships to other documents
   */
  relatesTo?: Array<DocumentReferenceRelatesTo>;
  /* 
   * Human-readable description
   */
  description?: string;
  /* 
   * Document security-tags
   */
  securityLabel?: Array<CodeableConcept>;
  /* 
   * Document referenced
   */
  content: Array<DocumentReferenceContent>;
  /* 
   * Clinical context of document
   */
  context?: DocumentReferenceContext;
}

export interface EffectEvidenceSynthesisSampleSize {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Description of sample size
   */
  description?: string;
  /* 
   * How many studies?
   */
  numberOfStudies?: integer;
  /* 
   * How many participants?
   */
  numberOfParticipants?: integer;
}
export interface EffectEvidenceSynthesisResultsByExposure {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Description of results by exposure
   */
  description?: string;
  /* 
   * exposure | exposure-alternative
   */
  exposureState?: code;
  /* 
   * Variant exposure states
   */
  variantState?: CodeableConcept;
  /* 
   * Risk evidence synthesis
   */
  riskEvidenceSynthesis: Reference;
}
export interface EffectEvidenceSynthesisEffectEstimatePrecisionEstimate {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of precision estimate
   */
  type?: CodeableConcept;
  /* 
   * Level of confidence interval
   */
  level?: decimal;
  /* 
   * Lower bound
   */
  from?: decimal;
  /* 
   * Upper bound
   */
  to?: decimal;
}
export interface EffectEvidenceSynthesisEffectEstimate {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Description of effect estimate
   */
  description?: string;
  /* 
   * Type of efffect estimate
   */
  type?: CodeableConcept;
  /* 
   * Variant exposure states
   */
  variantState?: CodeableConcept;
  /* 
   * Point estimate
   */
  value?: decimal;
  /* 
   * What unit is the outcome described in?
   */
  unitOfMeasure?: CodeableConcept;
  /* 
   * How precise the estimate is
   */
  precisionEstimate?: Array<EffectEvidenceSynthesisEffectEstimatePrecisionEstimate>;
}
export interface EffectEvidenceSynthesisCertaintyCertaintySubcomponent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of subcomponent of certainty rating
   */
  type?: CodeableConcept;
  /* 
   * Subcomponent certainty rating
   */
  rating?: Array<CodeableConcept>;
  /* 
   * Used for footnotes or explanatory notes
   */
  note?: Array<Annotation>;
}
export interface EffectEvidenceSynthesisCertainty {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Certainty rating
   */
  rating?: Array<CodeableConcept>;
  /* 
   * Used for footnotes or explanatory notes
   */
  note?: Array<Annotation>;
  /* 
   * A component that contributes to the overall certainty
   */
  certaintySubcomponent?: Array<EffectEvidenceSynthesisCertaintyCertaintySubcomponent>;
}
export interface EffectEvidenceSynthesis {
resourceType: "EffectEvidenceSynthesis"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this effect evidence synthesis, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the effect evidence synthesis
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the effect evidence synthesis
   */
  version?: string;
  /* 
   * Name for this effect evidence synthesis (computer friendly)
   */
  name?: string;
  /* 
   * Name for this effect evidence synthesis (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the effect evidence synthesis
   */
  description?: markdown;
  /* 
   * Used for footnotes or explanatory notes
   */
  note?: Array<Annotation>;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for effect evidence synthesis (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the effect evidence synthesis was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the effect evidence synthesis was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the effect evidence synthesis is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * The category of the EffectEvidenceSynthesis, such as Education, Treatment, Assessment, etc.
   */
  topic?: Array<CodeableConcept>;
  /* 
   * Who authored the content
   */
  author?: Array<ContactDetail>;
  /* 
   * Who edited the content
   */
  editor?: Array<ContactDetail>;
  /* 
   * Who reviewed the content
   */
  reviewer?: Array<ContactDetail>;
  /* 
   * Who endorsed the content
   */
  endorser?: Array<ContactDetail>;
  /* 
   * Additional documentation, citations, etc.
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * Type of synthesis
   */
  synthesisType?: CodeableConcept;
  /* 
   * Type of study
   */
  studyType?: CodeableConcept;
  /* 
   * What population?
   */
  population: Reference;
  /* 
   * What exposure?
   */
  exposure: Reference;
  /* 
   * What comparison exposure?
   */
  exposureAlternative: Reference;
  /* 
   * What outcome?
   */
  outcome: Reference;
  /* 
   * What sample size was involved?
   */
  sampleSize?: EffectEvidenceSynthesisSampleSize;
  /* 
   * What was the result per exposure?
   */
  resultsByExposure?: Array<EffectEvidenceSynthesisResultsByExposure>;
  /* 
   * What was the estimated effect
   */
  effectEstimate?: Array<EffectEvidenceSynthesisEffectEstimate>;
  /* 
   * How certain is the effect
   */
  certainty?: Array<EffectEvidenceSynthesisCertainty>;
}

export interface EncounterStatusHistory {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * planned | arrived | triaged | in-progress | onleave | finished | cancelled +
   */
  status: code;
  /* 
   * The time that the episode was in the specified status
   */
  period: Period;
}
export interface EncounterClassHistory {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * inpatient | outpatient | ambulatory | emergency +
   */
  class: Coding;
  /* 
   * The time that the episode was in the specified class
   */
  period: Period;
}
export interface EncounterParticipant {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Role of participant in encounter
   */
  type?: Array<CodeableConcept>;
  /* 
   * Period of time during the encounter that the participant participated
   */
  period?: Period;
  /* 
   * Persons involved in the encounter other than the patient
   */
  individual?: Reference;
}
export interface EncounterDiagnosis {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The diagnosis or procedure relevant to the encounter
   */
  condition: Reference;
  /* 
   * Role that this diagnosis has within the encounter (e.g. admission, billing, discharge …)
   */
  use?: CodeableConcept;
  /* 
   * Ranking of the diagnosis (for each role type)
   */
  rank?: positiveInt;
}
export interface EncounterHospitalization {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Pre-admission identifier
   */
  preAdmissionIdentifier?: Identifier;
  /* 
   * The location/organization from which the patient came before admission
   */
  origin?: Reference;
  /* 
   * From where patient was admitted (physician referral, transfer)
   */
  admitSource?: CodeableConcept;
  /* 
   * The type of hospital re-admission that has occurred (if any). If the value is absent, then this is not identified as a readmission
   */
  reAdmission?: CodeableConcept;
  /* 
   * Diet preferences reported by the patient
   */
  dietPreference?: Array<CodeableConcept>;
  /* 
   * Special courtesies (VIP, board member)
   */
  specialCourtesy?: Array<CodeableConcept>;
  /* 
   * Wheelchair, translator, stretcher, etc.
   */
  specialArrangement?: Array<CodeableConcept>;
  /* 
   * Location/organization to which the patient is discharged
   */
  destination?: Reference;
  /* 
   * Category or kind of location after discharge
   */
  dischargeDisposition?: CodeableConcept;
}
export interface EncounterLocation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Location the encounter takes place
   */
  location: Reference;
  /* 
   * planned | active | reserved | completed
   */
  status?: code;
  /* 
   * The physical type of the location (usually the level in the location hierachy - bed room ward etc.)
   */
  physicalType?: CodeableConcept;
  /* 
   * Time period during which the patient was present at the location
   */
  period?: Period;
}
export interface Encounter {
resourceType: "Encounter"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifier(s) by which this encounter is known
   */
  identifier?: Array<Identifier>;
  /* 
   * planned | arrived | triaged | in-progress | onleave | finished | cancelled +
   */
  status: code;
  /* 
   * List of past encounter statuses
   */
  statusHistory?: Array<EncounterStatusHistory>;
  /* 
   * Classification of patient encounter
   */
  class: Coding;
  /* 
   * List of past encounter classes
   */
  classHistory?: Array<EncounterClassHistory>;
  /* 
   * Specific type of encounter
   */
  type?: Array<CodeableConcept>;
  /* 
   * Specific type of service
   */
  serviceType?: CodeableConcept;
  /* 
   * Indicates the urgency of the encounter
   */
  priority?: CodeableConcept;
  /* 
   * The patient or group present at the encounter
   */
  subject?: Reference;
  /* 
   * Episode(s) of care that this encounter should be recorded against
   */
  episodeOfCare?: Array<Reference>;
  /* 
   * The ServiceRequest that initiated this encounter
   */
  basedOn?: Array<Reference>;
  /* 
   * List of participants involved in the encounter
   */
  participant?: Array<EncounterParticipant>;
  /* 
   * The appointment that scheduled this encounter
   */
  appointment?: Array<Reference>;
  /* 
   * The start and end time of the encounter
   */
  period?: Period;
  /* 
   * Quantity of time the encounter lasted (less time absent)
   */
  length?: Duration;
  /* 
   * Coded reason the encounter takes place
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Reason the encounter takes place (reference)
   */
  reasonReference?: Array<Reference>;
  /* 
   * The list of diagnosis relevant to this encounter
   */
  diagnosis?: Array<EncounterDiagnosis>;
  /* 
   * The set of accounts that may be used for billing for this Encounter
   */
  account?: Array<Reference>;
  /* 
   * Details about the admission to a healthcare service
   */
  hospitalization?: EncounterHospitalization;
  /* 
   * List of locations where the patient has been
   */
  location?: Array<EncounterLocation>;
  /* 
   * The organization (facility) responsible for this encounter
   */
  serviceProvider?: Reference;
  /* 
   * Another Encounter this encounter is part of
   */
  partOf?: Reference;
}

export interface Endpoint {
resourceType: "Endpoint"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifies this endpoint across multiple systems
   */
  identifier?: Array<Identifier>;
  /* 
   * active | suspended | error | off | entered-in-error | test
   */
  status: code;
  /* 
   * Protocol/Profile/Standard to be used with this endpoint connection
   */
  connectionType: Coding;
  /* 
   * A name that this endpoint can be identified by
   */
  name?: string;
  /* 
   * Organization that manages this endpoint (might not be the organization that exposes the endpoint)
   */
  managingOrganization?: Reference;
  /* 
   * Contact details for source (e.g. troubleshooting)
   */
  contact?: Array<ContactPoint>;
  /* 
   * Interval the endpoint is expected to be operational
   */
  period?: Period;
  /* 
   * The type of content that may be used at this endpoint (e.g. XDS Discharge summaries)
   */
  payloadType: Array<CodeableConcept>;
  /* 
   * Mimetype to send. If not specified, the content could be anything (including no payload, if the connectionType defined this)
   */
  payloadMimeType?: Array<code>;
  /* 
   * The technical base address for connecting to this endpoint
   */
  address: url;
  /* 
   * Usage depends on the channel type
   */
  header?: Array<string>;
}

export interface EnrollmentRequest {
resourceType: "EnrollmentRequest"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * active | cancelled | draft | entered-in-error
   */
  status?: code;
  /* 
   * Creation date
   */
  created?: dateTime;
  /* 
   * Target
   */
  insurer?: Reference;
  /* 
   * Responsible practitioner
   */
  provider?: Reference;
  /* 
   * The subject to be enrolled
   */
  candidate?: Reference;
  /* 
   * Insurance information
   */
  coverage?: Reference;
}

export interface EnrollmentResponse {
resourceType: "EnrollmentResponse"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * active | cancelled | draft | entered-in-error
   */
  status?: code;
  /* 
   * Claim reference
   */
  request?: Reference;
  /* 
   * queued | complete | error | partial
   */
  outcome?: code;
  /* 
   * Disposition Message
   */
  disposition?: string;
  /* 
   * Creation date
   */
  created?: dateTime;
  /* 
   * Insurer
   */
  organization?: Reference;
  /* 
   * Responsible practitioner
   */
  requestProvider?: Reference;
}

export interface EpisodeOfCareStatusHistory {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * planned | waitlist | active | onhold | finished | cancelled | entered-in-error
   */
  status: code;
  /* 
   * Duration the EpisodeOfCare was in the specified status
   */
  period: Period;
}
export interface EpisodeOfCareDiagnosis {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Conditions/problems/diagnoses this episode of care is for
   */
  condition: Reference;
  /* 
   * Role that this diagnosis has within the episode of care (e.g. admission, billing, discharge …)
   */
  role?: CodeableConcept;
  /* 
   * Ranking of the diagnosis (for each role type)
   */
  rank?: positiveInt;
}
export interface EpisodeOfCare {
resourceType: "EpisodeOfCare"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier(s) relevant for this EpisodeOfCare
   */
  identifier?: Array<Identifier>;
  /* 
   * planned | waitlist | active | onhold | finished | cancelled | entered-in-error
   */
  status: code;
  /* 
   * Past list of status codes (the current status may be included to cover the start date of the status)
   */
  statusHistory?: Array<EpisodeOfCareStatusHistory>;
  /* 
   * Type/class  - e.g. specialist referral, disease management
   */
  type?: Array<CodeableConcept>;
  /* 
   * The list of diagnosis relevant to this episode of care
   */
  diagnosis?: Array<EpisodeOfCareDiagnosis>;
  /* 
   * The patient who is the focus of this episode of care
   */
  patient: Reference;
  /* 
   * Organization that assumes care
   */
  managingOrganization?: Reference;
  /* 
   * Interval during responsibility is assumed
   */
  period?: Period;
  /* 
   * Originating Referral Request(s)
   */
  referralRequest?: Array<Reference>;
  /* 
   * Care manager/care coordinator for the patient
   */
  careManager?: Reference;
  /* 
   * Other practitioners facilitating this episode of care
   */
  team?: Array<Reference>;
  /* 
   * The set of accounts that may be used for billing for this EpisodeOfCare
   */
  account?: Array<Reference>;
}

export interface EventDefinition {
resourceType: "EventDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this event definition, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the event definition
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the event definition
   */
  version?: string;
  /* 
   * Name for this event definition (computer friendly)
   */
  name?: string;
  /* 
   * Name for this event definition (human friendly)
   */
  title?: string;
  /* 
   * Subordinate title of the event definition
   */
  subtitle?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Type of individual the event definition is focused on
   */
  subjectCodeableConcept?: CodeableConcept;
  /* 
   * Type of individual the event definition is focused on
   */
  subjectReference?: Reference;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the event definition
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for event definition (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this event definition is defined
   */
  purpose?: markdown;
  /* 
   * Describes the clinical usage of the event definition
   */
  usage?: string;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the event definition was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the event definition was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the event definition is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * E.g. Education, Treatment, Assessment, etc.
   */
  topic?: Array<CodeableConcept>;
  /* 
   * Who authored the content
   */
  author?: Array<ContactDetail>;
  /* 
   * Who edited the content
   */
  editor?: Array<ContactDetail>;
  /* 
   * Who reviewed the content
   */
  reviewer?: Array<ContactDetail>;
  /* 
   * Who endorsed the content
   */
  endorser?: Array<ContactDetail>;
  /* 
   * Additional documentation, citations, etc.
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * "when" the event occurs (multiple = 'or')
   */
  trigger: Array<TriggerDefinition>;
}

export interface Evidence {
resourceType: "Evidence"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this evidence, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the evidence
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the evidence
   */
  version?: string;
  /* 
   * Name for this evidence (computer friendly)
   */
  name?: string;
  /* 
   * Name for this evidence (human friendly)
   */
  title?: string;
  /* 
   * Title for use in informal contexts
   */
  shortTitle?: string;
  /* 
   * Subordinate title of the Evidence
   */
  subtitle?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the evidence
   */
  description?: markdown;
  /* 
   * Used for footnotes or explanatory notes
   */
  note?: Array<Annotation>;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for evidence (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the evidence was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the evidence was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the evidence is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * The category of the Evidence, such as Education, Treatment, Assessment, etc.
   */
  topic?: Array<CodeableConcept>;
  /* 
   * Who authored the content
   */
  author?: Array<ContactDetail>;
  /* 
   * Who edited the content
   */
  editor?: Array<ContactDetail>;
  /* 
   * Who reviewed the content
   */
  reviewer?: Array<ContactDetail>;
  /* 
   * Who endorsed the content
   */
  endorser?: Array<ContactDetail>;
  /* 
   * Additional documentation, citations, etc.
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * What population?
   */
  exposureBackground: Reference;
  /* 
   * What exposure?
   */
  exposureVariant?: Array<Reference>;
  /* 
   * What outcome?
   */
  outcome?: Array<Reference>;
}

export interface EvidenceVariableCharacteristic {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Natural language description of the characteristic
   */
  description?: string;
  /* 
   * What code or expression defines members?
   */
  definitionReference?: Reference;
  /* 
   * What code or expression defines members?
   */
  definitionCanonical?: canonical;
  /* 
   * What code or expression defines members?
   */
  definitionCodeableConcept?: CodeableConcept;
  /* 
   * What code or expression defines members?
   */
  definitionExpression?: Expression;
  /* 
   * What code or expression defines members?
   */
  definitionDataRequirement?: DataRequirement;
  /* 
   * What code or expression defines members?
   */
  definitionTriggerDefinition?: TriggerDefinition;
  /* 
   * What code/value pairs define members?
   */
  usageContext?: Array<UsageContext>;
  /* 
   * Whether the characteristic includes or excludes members
   */
  exclude?: boolean;
  /* 
   * What time period do participants cover
   */
  participantEffectiveDateTime?: dateTime;
  /* 
   * What time period do participants cover
   */
  participantEffectivePeriod?: Period;
  /* 
   * What time period do participants cover
   */
  participantEffectiveDuration?: Duration;
  /* 
   * What time period do participants cover
   */
  participantEffectiveTiming?: Timing;
  /* 
   * Observation time from study start
   */
  timeFromStart?: Duration;
  /* 
   * mean | median | mean-of-mean | mean-of-median | median-of-mean | median-of-median
   */
  groupMeasure?: code;
}
export interface EvidenceVariable {
resourceType: "EvidenceVariable"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this evidence variable, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the evidence variable
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the evidence variable
   */
  version?: string;
  /* 
   * Name for this evidence variable (computer friendly)
   */
  name?: string;
  /* 
   * Name for this evidence variable (human friendly)
   */
  title?: string;
  /* 
   * Title for use in informal contexts
   */
  shortTitle?: string;
  /* 
   * Subordinate title of the EvidenceVariable
   */
  subtitle?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the evidence variable
   */
  description?: markdown;
  /* 
   * Used for footnotes or explanatory notes
   */
  note?: Array<Annotation>;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for evidence variable (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the evidence variable was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the evidence variable was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the evidence variable is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * The category of the EvidenceVariable, such as Education, Treatment, Assessment, etc.
   */
  topic?: Array<CodeableConcept>;
  /* 
   * Who authored the content
   */
  author?: Array<ContactDetail>;
  /* 
   * Who edited the content
   */
  editor?: Array<ContactDetail>;
  /* 
   * Who reviewed the content
   */
  reviewer?: Array<ContactDetail>;
  /* 
   * Who endorsed the content
   */
  endorser?: Array<ContactDetail>;
  /* 
   * Additional documentation, citations, etc.
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * dichotomous | continuous | descriptive
   */
  type?: code;
  /* 
   * What defines the members of the evidence element
   */
  characteristic: Array<EvidenceVariableCharacteristic>;
}

export interface ExampleScenarioActor {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * ID or acronym of the actor
   */
  actorId: string;
  /* 
   * person | entity
   */
  type: code;
  /* 
   * The name of the actor as shown in the page
   */
  name?: string;
  /* 
   * The description of the actor
   */
  description?: markdown;
}
export interface ExampleScenarioInstanceVersion {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The identifier of a specific version of a resource
   */
  versionId: string;
  /* 
   * The description of the resource version
   */
  description: markdown;
}
export interface ExampleScenarioInstanceContainedInstance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Each resource contained in the instance
   */
  resourceId: string;
  /* 
   * A specific version of a resource contained in the instance
   */
  versionId?: string;
}
export interface ExampleScenarioInstance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The id of the resource for referencing
   */
  resourceId: string;
  /* 
   * The type of the resource
   */
  resourceType: code;
  /* 
   * A short name for the resource instance
   */
  name?: string;
  /* 
   * Human-friendly description of the resource instance
   */
  description?: markdown;
  /* 
   * A specific version of the resource
   */
  version?: Array<ExampleScenarioInstanceVersion>;
  /* 
   * Resources contained in the instance
   */
  containedInstance?: Array<ExampleScenarioInstanceContainedInstance>;
}
export interface ExampleScenarioProcessStepOperation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The sequential number of the interaction
   */
  number: string;
  /* 
   * The type of operation - CRUD
   */
  type?: string;
  /* 
   * The human-friendly name of the interaction
   */
  name?: string;
  /* 
   * Who starts the transaction
   */
  initiator?: string;
  /* 
   * Who receives the transaction
   */
  receiver?: string;
  /* 
   * A comment to be inserted in the diagram
   */
  description?: markdown;
  /* 
   * Whether the initiator is deactivated right after the transaction
   */
  initiatorActive?: boolean;
  /* 
   * Whether the receiver is deactivated right after the transaction
   */
  receiverActive?: boolean;
  /* 
   * Each resource instance used by the initiator
   */
  request?: ExampleScenarioInstanceContainedInstance;
  /* 
   * Each resource instance used by the responder
   */
  response?: ExampleScenarioInstanceContainedInstance;
}
export interface ExampleScenarioProcessStepAlternative {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Label for alternative
   */
  title: string;
  /* 
   * A human-readable description of each option
   */
  description?: markdown;
  /* 
   * What happens in each alternative option
   */
  step?: ExampleScenarioProcessStep;
}
export interface ExampleScenarioProcessStep {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Nested process
   */
  process?: ExampleScenarioProcess;
  /* 
   * If there is a pause in the flow
   */
  pause?: boolean;
  /* 
   * Each interaction or action
   */
  operation?: ExampleScenarioProcessStepOperation;
  /* 
   * Alternate non-typical step action
   */
  alternative?: Array<ExampleScenarioProcessStepAlternative>;
}
export interface ExampleScenarioProcess {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The diagram title of the group of operations
   */
  title: string;
  /* 
   * A longer description of the group of operations
   */
  description?: markdown;
  /* 
   * Description of initial status before the process starts
   */
  preConditions?: markdown;
  /* 
   * Description of final status after the process ends
   */
  postConditions?: markdown;
  /* 
   * Each step of the process
   */
  step?: Array<ExampleScenarioProcessStep>;
}
export interface ExampleScenario {
resourceType: "ExampleScenario"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this example scenario, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the example scenario
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the example scenario
   */
  version?: string;
  /* 
   * Name for this example scenario (computer friendly)
   */
  name?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for example scenario (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * The purpose of the example, e.g. to illustrate a scenario
   */
  purpose?: markdown;
  /* 
   * Actor participating in the resource
   */
  actor?: Array<ExampleScenarioActor>;
  /* 
   * Each resource and each version that is present in the workflow
   */
  instance?: Array<ExampleScenarioInstance>;
  /* 
   * Each major process - a group of operations
   */
  process?: Array<ExampleScenarioProcess>;
  /* 
   * Another nested workflow
   */
  workflow?: Array<canonical>;
}

export interface ExplanationOfBenefitRelated {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Reference to the related claim
   */
  claim?: Reference;
  /* 
   * How the reference claim is related
   */
  relationship?: CodeableConcept;
  /* 
   * File or case reference
   */
  reference?: Identifier;
}
export interface ExplanationOfBenefitPayee {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Category of recipient
   */
  type?: CodeableConcept;
  /* 
   * Recipient reference
   */
  party?: Reference;
}
export interface ExplanationOfBenefitCareTeam {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Order of care team
   */
  sequence: positiveInt;
  /* 
   * Practitioner or organization
   */
  provider: Reference;
  /* 
   * Indicator of the lead practitioner
   */
  responsible?: boolean;
  /* 
   * Function within the team
   */
  role?: CodeableConcept;
  /* 
   * Practitioner credential or specialization
   */
  qualification?: CodeableConcept;
}
export interface ExplanationOfBenefitSupportingInfo {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Information instance identifier
   */
  sequence: positiveInt;
  /* 
   * Classification of the supplied information
   */
  category: CodeableConcept;
  /* 
   * Type of information
   */
  code?: CodeableConcept;
  /* 
   * When it occurred
   */
  timingDate?: date;
  /* 
   * When it occurred
   */
  timingPeriod?: Period;
  /* 
   * Data to be provided
   */
  valueBoolean?: boolean;
  /* 
   * Data to be provided
   */
  valueString?: string;
  /* 
   * Data to be provided
   */
  valueQuantity?: Quantity;
  /* 
   * Data to be provided
   */
  valueAttachment?: Attachment;
  /* 
   * Data to be provided
   */
  valueReference?: Reference;
  /* 
   * Explanation for the information
   */
  reason?: Coding;
}
export interface ExplanationOfBenefitDiagnosis {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Diagnosis instance identifier
   */
  sequence: positiveInt;
  /* 
   * Nature of illness or problem
   */
  diagnosisCodeableConcept?: CodeableConcept;
  /* 
   * Nature of illness or problem
   */
  diagnosisReference?: Reference;
  /* 
   * Timing or nature of the diagnosis
   */
  type?: Array<CodeableConcept>;
  /* 
   * Present on admission
   */
  onAdmission?: CodeableConcept;
  /* 
   * Package billing code
   */
  packageCode?: CodeableConcept;
}
export interface ExplanationOfBenefitProcedure {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Procedure instance identifier
   */
  sequence: positiveInt;
  /* 
   * Category of Procedure
   */
  type?: Array<CodeableConcept>;
  /* 
   * When the procedure was performed
   */
  date?: dateTime;
  /* 
   * Specific clinical procedure
   */
  procedureCodeableConcept?: CodeableConcept;
  /* 
   * Specific clinical procedure
   */
  procedureReference?: Reference;
  /* 
   * Unique device identifier
   */
  udi?: Array<Reference>;
}
export interface ExplanationOfBenefitInsurance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Coverage to be used for adjudication
   */
  focal: boolean;
  /* 
   * Insurance information
   */
  coverage: Reference;
  /* 
   * Prior authorization reference number
   */
  preAuthRef?: Array<string>;
}
export interface ExplanationOfBenefitAccident {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * When the incident occurred
   */
  date?: date;
  /* 
   * The nature of the accident
   */
  type?: CodeableConcept;
  /* 
   * Where the event occurred
   */
  locationAddress?: Address;
  /* 
   * Where the event occurred
   */
  locationReference?: Reference;
}
export interface ExplanationOfBenefitItemAdjudication {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of adjudication information
   */
  category: CodeableConcept;
  /* 
   * Explanation of adjudication outcome
   */
  reason?: CodeableConcept;
  /* 
   * Monetary amount
   */
  amount?: Money;
  /* 
   * Non-monitary value
   */
  value?: decimal;
}
export interface ExplanationOfBenefitItemDetailSubDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Product or service provided
   */
  sequence: positiveInt;
  /* 
   * Revenue or cost center code
   */
  revenue?: CodeableConcept;
  /* 
   * Benefit classification
   */
  category?: CodeableConcept;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Service/Product billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Program the product or service is provided under
   */
  programCode?: Array<CodeableConcept>;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Unique device identifier
   */
  udi?: Array<Reference>;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Subdetail level adjudication details
   */
  adjudication?: ExplanationOfBenefitItemAdjudication;
}
export interface ExplanationOfBenefitItemDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Product or service provided
   */
  sequence: positiveInt;
  /* 
   * Revenue or cost center code
   */
  revenue?: CodeableConcept;
  /* 
   * Benefit classification
   */
  category?: CodeableConcept;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Service/Product billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Program the product or service is provided under
   */
  programCode?: Array<CodeableConcept>;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Unique device identifier
   */
  udi?: Array<Reference>;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Detail level adjudication details
   */
  adjudication?: ExplanationOfBenefitItemAdjudication;
  /* 
   * Additional items
   */
  subDetail?: Array<ExplanationOfBenefitItemDetailSubDetail>;
}
export interface ExplanationOfBenefitItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Item instance identifier
   */
  sequence: positiveInt;
  /* 
   * Applicable care team members
   */
  careTeamSequence?: Array<positiveInt>;
  /* 
   * Applicable diagnoses
   */
  diagnosisSequence?: Array<positiveInt>;
  /* 
   * Applicable procedures
   */
  procedureSequence?: Array<positiveInt>;
  /* 
   * Applicable exception and supporting information
   */
  informationSequence?: Array<positiveInt>;
  /* 
   * Revenue or cost center code
   */
  revenue?: CodeableConcept;
  /* 
   * Benefit classification
   */
  category?: CodeableConcept;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Product or service billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Program the product or service is provided under
   */
  programCode?: Array<CodeableConcept>;
  /* 
   * Date or dates of service or product delivery
   */
  servicedDate?: date;
  /* 
   * Date or dates of service or product delivery
   */
  servicedPeriod?: Period;
  /* 
   * Place of service or where product was supplied
   */
  locationCodeableConcept?: CodeableConcept;
  /* 
   * Place of service or where product was supplied
   */
  locationAddress?: Address;
  /* 
   * Place of service or where product was supplied
   */
  locationReference?: Reference;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Unique device identifier
   */
  udi?: Array<Reference>;
  /* 
   * Anatomical location
   */
  bodySite?: CodeableConcept;
  /* 
   * Anatomical sub-location
   */
  subSite?: Array<CodeableConcept>;
  /* 
   * Encounters related to this billed item
   */
  encounter?: Array<Reference>;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Adjudication details
   */
  adjudication?: Array<ExplanationOfBenefitItemAdjudication>;
  /* 
   * Additional items
   */
  detail?: Array<ExplanationOfBenefitItemDetail>;
}
export interface ExplanationOfBenefitAddItemDetailSubDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Service/Product billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Added items adjudication
   */
  adjudication?: ExplanationOfBenefitItemAdjudication;
}
export interface ExplanationOfBenefitAddItemDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Service/Product billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Added items adjudication
   */
  adjudication?: ExplanationOfBenefitItemAdjudication;
  /* 
   * Insurer added line items
   */
  subDetail?: Array<ExplanationOfBenefitAddItemDetailSubDetail>;
}
export interface ExplanationOfBenefitAddItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Item sequence number
   */
  itemSequence?: Array<positiveInt>;
  /* 
   * Detail sequence number
   */
  detailSequence?: Array<positiveInt>;
  /* 
   * Subdetail sequence number
   */
  subDetailSequence?: Array<positiveInt>;
  /* 
   * Authorized providers
   */
  provider?: Array<Reference>;
  /* 
   * Billing, service, product, or drug code
   */
  productOrService: CodeableConcept;
  /* 
   * Service/Product billing modifiers
   */
  modifier?: Array<CodeableConcept>;
  /* 
   * Program the product or service is provided under
   */
  programCode?: Array<CodeableConcept>;
  /* 
   * Date or dates of service or product delivery
   */
  servicedDate?: date;
  /* 
   * Date or dates of service or product delivery
   */
  servicedPeriod?: Period;
  /* 
   * Place of service or where product was supplied
   */
  locationCodeableConcept?: CodeableConcept;
  /* 
   * Place of service or where product was supplied
   */
  locationAddress?: Address;
  /* 
   * Place of service or where product was supplied
   */
  locationReference?: Reference;
  /* 
   * Count of products or services
   */
  quantity?: Quantity;
  /* 
   * Fee, charge or cost per item
   */
  unitPrice?: Money;
  /* 
   * Price scaling factor
   */
  factor?: decimal;
  /* 
   * Total item cost
   */
  net?: Money;
  /* 
   * Anatomical location
   */
  bodySite?: CodeableConcept;
  /* 
   * Anatomical sub-location
   */
  subSite?: Array<CodeableConcept>;
  /* 
   * Applicable note numbers
   */
  noteNumber?: Array<positiveInt>;
  /* 
   * Added items adjudication
   */
  adjudication?: ExplanationOfBenefitItemAdjudication;
  /* 
   * Insurer added line items
   */
  detail?: Array<ExplanationOfBenefitAddItemDetail>;
}
export interface ExplanationOfBenefitTotal {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of adjudication information
   */
  category: CodeableConcept;
  /* 
   * Financial total for the category
   */
  amount: Money;
}
export interface ExplanationOfBenefitPayment {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Partial or complete payment
   */
  type?: CodeableConcept;
  /* 
   * Payment adjustment for non-claim issues
   */
  adjustment?: Money;
  /* 
   * Explanation for the variance
   */
  adjustmentReason?: CodeableConcept;
  /* 
   * Expected date of payment
   */
  date?: date;
  /* 
   * Payable amount after adjustment
   */
  amount?: Money;
  /* 
   * Business identifier for the payment
   */
  identifier?: Identifier;
}
export interface ExplanationOfBenefitProcessNote {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Note instance identifier
   */
  number?: positiveInt;
  /* 
   * display | print | printoper
   */
  type?: code;
  /* 
   * Note explanatory text
   */
  text?: string;
  /* 
   * Language of the text
   */
  language?: CodeableConcept;
}
export interface ExplanationOfBenefitBenefitBalanceFinancial {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Benefit classification
   */
  type: CodeableConcept;
  /* 
   * Benefits allowed
   */
  allowedUnsignedInt?: unsignedInt;
  /* 
   * Benefits allowed
   */
  allowedString?: string;
  /* 
   * Benefits allowed
   */
  allowedMoney?: Money;
  /* 
   * Benefits used
   */
  usedUnsignedInt?: unsignedInt;
  /* 
   * Benefits used
   */
  usedMoney?: Money;
}
export interface ExplanationOfBenefitBenefitBalance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Benefit classification
   */
  category: CodeableConcept;
  /* 
   * Excluded from the plan
   */
  excluded?: boolean;
  /* 
   * Short name for the benefit
   */
  name?: string;
  /* 
   * Description of the benefit or services covered
   */
  description?: string;
  /* 
   * In or out of network
   */
  network?: CodeableConcept;
  /* 
   * Individual or family
   */
  unit?: CodeableConcept;
  /* 
   * Annual or lifetime
   */
  term?: CodeableConcept;
  /* 
   * Benefit Summary
   */
  financial?: Array<ExplanationOfBenefitBenefitBalanceFinancial>;
}
export interface ExplanationOfBenefit {
resourceType: "ExplanationOfBenefit"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for the resource
   */
  identifier?: Array<Identifier>;
  /* 
   * active | cancelled | draft | entered-in-error
   */
  status: code;
  /* 
   * Category or discipline
   */
  type: CodeableConcept;
  /* 
   * More granular claim type
   */
  subType?: CodeableConcept;
  /* 
   * claim | preauthorization | predetermination
   */
  use: code;
  /* 
   * The recipient of the products and services
   */
  patient: Reference;
  /* 
   * Relevant time frame for the claim
   */
  billablePeriod?: Period;
  /* 
   * Response creation date
   */
  created: dateTime;
  /* 
   * Author of the claim
   */
  enterer?: Reference;
  /* 
   * Party responsible for reimbursement
   */
  insurer: Reference;
  /* 
   * Party responsible for the claim
   */
  provider: Reference;
  /* 
   * Desired processing urgency
   */
  priority?: CodeableConcept;
  /* 
   * For whom to reserve funds
   */
  fundsReserveRequested?: CodeableConcept;
  /* 
   * Funds reserved status
   */
  fundsReserve?: CodeableConcept;
  /* 
   * Prior or corollary claims
   */
  related?: Array<ExplanationOfBenefitRelated>;
  /* 
   * Prescription authorizing services or products
   */
  prescription?: Reference;
  /* 
   * Original prescription if superceded by fulfiller
   */
  originalPrescription?: Reference;
  /* 
   * Recipient of benefits payable
   */
  payee?: ExplanationOfBenefitPayee;
  /* 
   * Treatment Referral
   */
  referral?: Reference;
  /* 
   * Servicing Facility
   */
  facility?: Reference;
  /* 
   * Claim reference
   */
  claim?: Reference;
  /* 
   * Claim response reference
   */
  claimResponse?: Reference;
  /* 
   * queued | complete | error | partial
   */
  outcome: code;
  /* 
   * Disposition Message
   */
  disposition?: string;
  /* 
   * Preauthorization reference
   */
  preAuthRef?: Array<string>;
  /* 
   * Preauthorization in-effect period
   */
  preAuthRefPeriod?: Array<Period>;
  /* 
   * Care Team members
   */
  careTeam?: Array<ExplanationOfBenefitCareTeam>;
  /* 
   * Supporting information
   */
  supportingInfo?: Array<ExplanationOfBenefitSupportingInfo>;
  /* 
   * Pertinent diagnosis information
   */
  diagnosis?: Array<ExplanationOfBenefitDiagnosis>;
  /* 
   * Clinical procedures performed
   */
  procedure?: Array<ExplanationOfBenefitProcedure>;
  /* 
   * Precedence (primary, secondary, etc.)
   */
  precedence?: positiveInt;
  /* 
   * Patient insurance information
   */
  insurance: Array<ExplanationOfBenefitInsurance>;
  /* 
   * Details of the event
   */
  accident?: ExplanationOfBenefitAccident;
  /* 
   * Product or service provided
   */
  item?: Array<ExplanationOfBenefitItem>;
  /* 
   * Insurer added line items
   */
  addItem?: Array<ExplanationOfBenefitAddItem>;
  /* 
   * Header-level adjudication
   */
  adjudication?: ExplanationOfBenefitItemAdjudication;
  /* 
   * Adjudication totals
   */
  total?: Array<ExplanationOfBenefitTotal>;
  /* 
   * Payment Details
   */
  payment?: ExplanationOfBenefitPayment;
  /* 
   * Printed form identifier
   */
  formCode?: CodeableConcept;
  /* 
   * Printed reference or actual form
   */
  form?: Attachment;
  /* 
   * Note concerning adjudication
   */
  processNote?: Array<ExplanationOfBenefitProcessNote>;
  /* 
   * When the benefits are applicable
   */
  benefitPeriod?: Period;
  /* 
   * Balance by Benefit Category
   */
  benefitBalance?: Array<ExplanationOfBenefitBenefitBalance>;
}

export interface FamilyMemberHistoryCondition {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Condition suffered by relation
   */
  code: CodeableConcept;
  /* 
   * deceased | permanent disability | etc.
   */
  outcome?: CodeableConcept;
  /* 
   * Whether the condition contributed to the cause of death
   */
  contributedToDeath?: boolean;
  /* 
   * When condition first manifested
   */
  onsetAge?: Age;
  /* 
   * When condition first manifested
   */
  onsetRange?: Range;
  /* 
   * When condition first manifested
   */
  onsetPeriod?: Period;
  /* 
   * When condition first manifested
   */
  onsetString?: string;
  /* 
   * Extra information about condition
   */
  note?: Array<Annotation>;
}
export interface FamilyMemberHistory {
resourceType: "FamilyMemberHistory"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Id(s) for this record
   */
  identifier?: Array<Identifier>;
  /* 
   * Instantiates FHIR protocol or definition
   */
  instantiatesCanonical?: Array<canonical>;
  /* 
   * Instantiates external protocol or definition
   */
  instantiatesUri?: Array<uri>;
  /* 
   * partial | completed | entered-in-error | health-unknown
   */
  status: code;
  /* 
   * subject-unknown | withheld | unable-to-obtain | deferred
   */
  dataAbsentReason?: CodeableConcept;
  /* 
   * Patient history is about
   */
  patient: Reference;
  /* 
   * When history was recorded or last updated
   */
  date?: dateTime;
  /* 
   * The family member described
   */
  name?: string;
  /* 
   * Relationship to the subject
   */
  relationship: CodeableConcept;
  /* 
   * male | female | other | unknown
   */
  sex?: CodeableConcept;
  /* 
   * (approximate) date of birth
   */
  bornPeriod?: Period;
  /* 
   * (approximate) date of birth
   */
  bornDate?: date;
  /* 
   * (approximate) date of birth
   */
  bornString?: string;
  /* 
   * (approximate) age
   */
  ageAge?: Age;
  /* 
   * (approximate) age
   */
  ageRange?: Range;
  /* 
   * (approximate) age
   */
  ageString?: string;
  /* 
   * Age is estimated?
   */
  estimatedAge?: boolean;
  /* 
   * Dead? How old/when?
   */
  deceasedBoolean?: boolean;
  /* 
   * Dead? How old/when?
   */
  deceasedAge?: Age;
  /* 
   * Dead? How old/when?
   */
  deceasedRange?: Range;
  /* 
   * Dead? How old/when?
   */
  deceasedDate?: date;
  /* 
   * Dead? How old/when?
   */
  deceasedString?: string;
  /* 
   * Why was family member history performed?
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why was family member history performed?
   */
  reasonReference?: Array<Reference>;
  /* 
   * General note about related person
   */
  note?: Array<Annotation>;
  /* 
   * Condition that the related person had
   */
  condition?: Array<FamilyMemberHistoryCondition>;
}

export interface Flag {
resourceType: "Flag"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * active | inactive | entered-in-error
   */
  status: code;
  /* 
   * Clinical, administrative, etc.
   */
  category?: Array<CodeableConcept>;
  /* 
   * Coded or textual message to display to user
   */
  code: CodeableConcept;
  /* 
   * Who/What is flag about?
   */
  subject: Reference;
  /* 
   * Time period when flag is active
   */
  period?: Period;
  /* 
   * Alert relevant during encounter
   */
  encounter?: Reference;
  /* 
   * Flag creator
   */
  author?: Reference;
}

export interface GoalTarget {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The parameter whose value is being tracked
   */
  measure?: CodeableConcept;
  /* 
   * The target value to be achieved
   */
  detailQuantity?: Quantity;
  /* 
   * The target value to be achieved
   */
  detailRange?: Range;
  /* 
   * The target value to be achieved
   */
  detailCodeableConcept?: CodeableConcept;
  /* 
   * The target value to be achieved
   */
  detailString?: string;
  /* 
   * The target value to be achieved
   */
  detailBoolean?: boolean;
  /* 
   * The target value to be achieved
   */
  detailInteger?: integer;
  /* 
   * The target value to be achieved
   */
  detailRatio?: Ratio;
  /* 
   * Reach goal on or before
   */
  dueDate?: date;
  /* 
   * Reach goal on or before
   */
  dueDuration?: Duration;
}
export interface Goal {
resourceType: "Goal"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Ids for this goal
   */
  identifier?: Array<Identifier>;
  /* 
   * proposed | planned | accepted | active | on-hold | completed | cancelled | entered-in-error | rejected
   */
  lifecycleStatus: code;
  /* 
   * in-progress | improving | worsening | no-change | achieved | sustaining | not-achieved | no-progress | not-attainable
   */
  achievementStatus?: CodeableConcept;
  /* 
   * E.g. Treatment, dietary, behavioral, etc.
   */
  category?: Array<CodeableConcept>;
  /* 
   * high-priority | medium-priority | low-priority
   */
  priority?: CodeableConcept;
  /* 
   * Code or text describing goal
   */
  description: CodeableConcept;
  /* 
   * Who this goal is intended for
   */
  subject: Reference;
  /* 
   * When goal pursuit begins
   */
  startDate?: date;
  /* 
   * When goal pursuit begins
   */
  startCodeableConcept?: CodeableConcept;
  /* 
   * Target outcome for the goal
   */
  target?: Array<GoalTarget>;
  /* 
   * When goal status took effect
   */
  statusDate?: date;
  /* 
   * Reason for current status
   */
  statusReason?: string;
  /* 
   * Who's responsible for creating Goal?
   */
  expressedBy?: Reference;
  /* 
   * Issues addressed by this goal
   */
  addresses?: Array<Reference>;
  /* 
   * Comments about the goal
   */
  note?: Array<Annotation>;
  /* 
   * What result was achieved regarding the goal?
   */
  outcomeCode?: Array<CodeableConcept>;
  /* 
   * Observation that resulted from goal
   */
  outcomeReference?: Array<Reference>;
}

export interface GraphDefinitionLinkTargetCompartment {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * condition | requirement
   */
  use: code;
  /* 
   * Patient | Encounter | RelatedPerson | Practitioner | Device
   */
  code: code;
  /* 
   * identical | matching | different | custom
   */
  rule: code;
  /* 
   * Custom rule, as a FHIRPath expression
   */
  expression?: string;
  /* 
   * Documentation for FHIRPath expression
   */
  description?: string;
}
export interface GraphDefinitionLinkTarget {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of resource this link refers to
   */
  type: code;
  /* 
   * Criteria for reverse lookup
   */
  params?: string;
  /* 
   * Profile for the target resource
   */
  profile?: canonical;
  /* 
   * Compartment Consistency Rules
   */
  compartment?: Array<GraphDefinitionLinkTargetCompartment>;
  /* 
   * Additional links from target resource
   */
  link?: GraphDefinitionLink;
}
export interface GraphDefinitionLink {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Path in the resource that contains the link
   */
  path?: string;
  /* 
   * Which slice (if profiled)
   */
  sliceName?: string;
  /* 
   * Minimum occurrences for this link
   */
  min?: integer;
  /* 
   * Maximum occurrences for this link
   */
  max?: string;
  /* 
   * Why this link is specified
   */
  description?: string;
  /* 
   * Potential target for the link
   */
  target?: Array<GraphDefinitionLinkTarget>;
}
export interface GraphDefinition {
resourceType: "GraphDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this graph definition, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Business version of the graph definition
   */
  version?: string;
  /* 
   * Name for this graph definition (computer friendly)
   */
  name: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the graph definition
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for graph definition (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this graph definition is defined
   */
  purpose?: markdown;
  /* 
   * Type of resource at which the graph starts
   */
  start: code;
  /* 
   * Profile on base resource
   */
  profile?: canonical;
  /* 
   * Links this graph makes rules about
   */
  link?: Array<GraphDefinitionLink>;
}

export interface GroupCharacteristic {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Kind of characteristic
   */
  code: CodeableConcept;
  /* 
   * Value held by characteristic
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * Value held by characteristic
   */
  valueBoolean?: boolean;
  /* 
   * Value held by characteristic
   */
  valueQuantity?: Quantity;
  /* 
   * Value held by characteristic
   */
  valueRange?: Range;
  /* 
   * Value held by characteristic
   */
  valueReference?: Reference;
  /* 
   * Group includes or excludes
   */
  exclude: boolean;
  /* 
   * Period over which characteristic is tested
   */
  period?: Period;
}
export interface GroupMember {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Reference to the group member
   */
  entity: Reference;
  /* 
   * Period member belonged to the group
   */
  period?: Period;
  /* 
   * If member is no longer in group
   */
  inactive?: boolean;
}
export interface Group {
resourceType: "Group"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique id
   */
  identifier?: Array<Identifier>;
  /* 
   * Whether this group's record is in active use
   */
  active?: boolean;
  /* 
   * person | animal | practitioner | device | medication | substance
   */
  type: code;
  /* 
   * Descriptive or actual
   */
  actual: boolean;
  /* 
   * Kind of Group members
   */
  code?: CodeableConcept;
  /* 
   * Label for Group
   */
  name?: string;
  /* 
   * Number of members
   */
  quantity?: unsignedInt;
  /* 
   * Entity that is the custodian of the Group's definition
   */
  managingEntity?: Reference;
  /* 
   * Include / Exclude group members by Trait
   */
  characteristic?: Array<GroupCharacteristic>;
  /* 
   * Who or what is in group
   */
  member?: Array<GroupMember>;
}

export interface GuidanceResponse {
resourceType: "GuidanceResponse"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The identifier of the request associated with this response, if any
   */
  requestIdentifier?: Identifier;
  /* 
   * Business identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * What guidance was requested
   */
  moduleUri?: uri;
  /* 
   * What guidance was requested
   */
  moduleCanonical?: canonical;
  /* 
   * What guidance was requested
   */
  moduleCodeableConcept?: CodeableConcept;
  /* 
   * success | data-requested | data-required | in-progress | failure | entered-in-error
   */
  status: code;
  /* 
   * Patient the request was performed for
   */
  subject?: Reference;
  /* 
   * Encounter during which the response was returned
   */
  encounter?: Reference;
  /* 
   * When the guidance response was processed
   */
  occurrenceDateTime?: dateTime;
  /* 
   * Device returning the guidance
   */
  performer?: Reference;
  /* 
   * Why guidance is needed
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why guidance is needed
   */
  reasonReference?: Array<Reference>;
  /* 
   * Additional notes about the response
   */
  note?: Array<Annotation>;
  /* 
   * Messages resulting from the evaluation of the artifact or artifacts
   */
  evaluationMessage?: Array<Reference>;
  /* 
   * The output parameters of the evaluation, if any
   */
  outputParameters?: Reference;
  /* 
   * Proposed actions, if any
   */
  result?: Reference;
  /* 
   * Additional required data
   */
  dataRequirement?: Array<DataRequirement>;
}

export interface HealthcareServiceEligibility {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Coded value for the eligibility
   */
  code?: CodeableConcept;
  /* 
   * Describes the eligibility conditions for the service
   */
  comment?: markdown;
}
export interface HealthcareServiceAvailableTime {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * mon | tue | wed | thu | fri | sat | sun
   */
  daysOfWeek?: Array<code>;
  /* 
   * Always available? e.g. 24 hour service
   */
  allDay?: boolean;
  /* 
   * Opening time of day (ignored if allDay = true)
   */
  availableStartTime?: time;
  /* 
   * Closing time of day (ignored if allDay = true)
   */
  availableEndTime?: time;
}
export interface HealthcareServiceNotAvailable {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Reason presented to the user explaining why time not available
   */
  description: string;
  /* 
   * Service not available from this date
   */
  during?: Period;
}
export interface HealthcareService {
resourceType: "HealthcareService"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External identifiers for this item
   */
  identifier?: Array<Identifier>;
  /* 
   * Whether this HealthcareService record is in active use
   */
  active?: boolean;
  /* 
   * Organization that provides this service
   */
  providedBy?: Reference;
  /* 
   * Broad category of service being performed or delivered
   */
  category?: Array<CodeableConcept>;
  /* 
   * Type of service that may be delivered or performed
   */
  type?: Array<CodeableConcept>;
  /* 
   * Specialties handled by the HealthcareService
   */
  specialty?: Array<CodeableConcept>;
  /* 
   * Location(s) where service may be provided
   */
  location?: Array<Reference>;
  /* 
   * Description of service as presented to a consumer while searching
   */
  name?: string;
  /* 
   * Additional description and/or any specific issues not covered elsewhere
   */
  comment?: string;
  /* 
   * Extra details about the service that can't be placed in the other fields
   */
  extraDetails?: markdown;
  /* 
   * Facilitates quick identification of the service
   */
  photo?: Attachment;
  /* 
   * Contacts related to the healthcare service
   */
  telecom?: Array<ContactPoint>;
  /* 
   * Location(s) service is intended for/available to
   */
  coverageArea?: Array<Reference>;
  /* 
   * Conditions under which service is available/offered
   */
  serviceProvisionCode?: Array<CodeableConcept>;
  /* 
   * Specific eligibility requirements required to use the service
   */
  eligibility?: Array<HealthcareServiceEligibility>;
  /* 
   * Programs that this service is applicable to
   */
  program?: Array<CodeableConcept>;
  /* 
   * Collection of characteristics (attributes)
   */
  characteristic?: Array<CodeableConcept>;
  /* 
   * The language that this service is offered in
   */
  communication?: Array<CodeableConcept>;
  /* 
   * Ways that the service accepts referrals
   */
  referralMethod?: Array<CodeableConcept>;
  /* 
   * If an appointment is required for access to this service
   */
  appointmentRequired?: boolean;
  /* 
   * Times the Service Site is available
   */
  availableTime?: Array<HealthcareServiceAvailableTime>;
  /* 
   * Not available during this time due to provided reason
   */
  notAvailable?: Array<HealthcareServiceNotAvailable>;
  /* 
   * Description of availability exceptions
   */
  availabilityExceptions?: string;
  /* 
   * Technical endpoints providing access to electronic services operated for the healthcare service
   */
  endpoint?: Array<Reference>;
}

export interface ImagingStudySeriesPerformer {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of performance
   */
  function?: CodeableConcept;
  /* 
   * Who performed the series
   */
  actor: Reference;
}
export interface ImagingStudySeriesInstance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * DICOM SOP Instance UID
   */
  uid: id;
  /* 
   * DICOM class type
   */
  sopClass: Coding;
  /* 
   * The number of this instance in the series
   */
  number?: unsignedInt;
  /* 
   * Description of instance
   */
  title?: string;
}
export interface ImagingStudySeries {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * DICOM Series Instance UID for the series
   */
  uid: id;
  /* 
   * Numeric identifier of this series
   */
  number?: unsignedInt;
  /* 
   * The modality of the instances in the series
   */
  modality: Coding;
  /* 
   * A short human readable summary of the series
   */
  description?: string;
  /* 
   * Number of Series Related Instances
   */
  numberOfInstances?: unsignedInt;
  /* 
   * Series access endpoint
   */
  endpoint?: Array<Reference>;
  /* 
   * Body part examined
   */
  bodySite?: Coding;
  /* 
   * Body part laterality
   */
  laterality?: Coding;
  /* 
   * Specimen imaged
   */
  specimen?: Array<Reference>;
  /* 
   * When the series started
   */
  started?: dateTime;
  /* 
   * Who performed the series
   */
  performer?: Array<ImagingStudySeriesPerformer>;
  /* 
   * A single SOP instance from the series
   */
  instance?: Array<ImagingStudySeriesInstance>;
}
export interface ImagingStudy {
resourceType: "ImagingStudy"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifiers for the whole study
   */
  identifier?: Array<Identifier>;
  /* 
   * registered | available | cancelled | entered-in-error | unknown
   */
  status: code;
  /* 
   * All series modality if actual acquisition modalities
   */
  modality?: Array<Coding>;
  /* 
   * Who or what is the subject of the study
   */
  subject: Reference;
  /* 
   * Encounter with which this imaging study is associated
   */
  encounter?: Reference;
  /* 
   * When the study was started
   */
  started?: dateTime;
  /* 
   * Request fulfilled
   */
  basedOn?: Array<Reference>;
  /* 
   * Referring physician
   */
  referrer?: Reference;
  /* 
   * Who interpreted images
   */
  interpreter?: Array<Reference>;
  /* 
   * Study access endpoint
   */
  endpoint?: Array<Reference>;
  /* 
   * Number of Study Related Series
   */
  numberOfSeries?: unsignedInt;
  /* 
   * Number of Study Related Instances
   */
  numberOfInstances?: unsignedInt;
  /* 
   * The performed Procedure reference
   */
  procedureReference?: Reference;
  /* 
   * The performed procedure code
   */
  procedureCode?: Array<CodeableConcept>;
  /* 
   * Where ImagingStudy occurred
   */
  location?: Reference;
  /* 
   * Why the study was requested
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why was study performed
   */
  reasonReference?: Array<Reference>;
  /* 
   * User-defined comments
   */
  note?: Array<Annotation>;
  /* 
   * Institution-generated description
   */
  description?: string;
  /* 
   * Each study has one or more series of instances
   */
  series?: Array<ImagingStudySeries>;
}

export interface ImmunizationPerformer {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * What type of performance was done
   */
  function?: CodeableConcept;
  /* 
   * Individual or organization who was performing
   */
  actor: Reference;
}
export interface ImmunizationEducation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Educational material document identifier
   */
  documentType?: string;
  /* 
   * Educational material reference pointer
   */
  reference?: uri;
  /* 
   * Educational material publication date
   */
  publicationDate?: dateTime;
  /* 
   * Educational material presentation date
   */
  presentationDate?: dateTime;
}
export interface ImmunizationReaction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * When reaction started
   */
  date?: dateTime;
  /* 
   * Additional information on reaction
   */
  detail?: Reference;
  /* 
   * Indicates self-reported reaction
   */
  reported?: boolean;
}
export interface ImmunizationProtocolApplied {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name of vaccine series
   */
  series?: string;
  /* 
   * Who is responsible for publishing the recommendations
   */
  authority?: Reference;
  /* 
   * Vaccine preventatable disease being targetted
   */
  targetDisease?: Array<CodeableConcept>;
  /* 
   * Dose number within series
   */
  doseNumberPositiveInt?: positiveInt;
  /* 
   * Dose number within series
   */
  doseNumberString?: string;
  /* 
   * Recommended number of doses for immunity
   */
  seriesDosesPositiveInt?: positiveInt;
  /* 
   * Recommended number of doses for immunity
   */
  seriesDosesString?: string;
}
export interface Immunization {
resourceType: "Immunization"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * completed | entered-in-error | not-done
   */
  status: code;
  /* 
   * Reason not done
   */
  statusReason?: CodeableConcept;
  /* 
   * Vaccine product administered
   */
  vaccineCode: CodeableConcept;
  /* 
   * Who was immunized
   */
  patient: Reference;
  /* 
   * Encounter immunization was part of
   */
  encounter?: Reference;
  /* 
   * Vaccine administration date
   */
  occurrenceDateTime?: dateTime;
  /* 
   * Vaccine administration date
   */
  occurrenceString?: string;
  /* 
   * When the immunization was first captured in the subject's record
   */
  recorded?: dateTime;
  /* 
   * Indicates context the data was recorded in
   */
  primarySource?: boolean;
  /* 
   * Indicates the source of a secondarily reported record
   */
  reportOrigin?: CodeableConcept;
  /* 
   * Where immunization occurred
   */
  location?: Reference;
  /* 
   * Vaccine manufacturer
   */
  manufacturer?: Reference;
  /* 
   * Vaccine lot number
   */
  lotNumber?: string;
  /* 
   * Vaccine expiration date
   */
  expirationDate?: date;
  /* 
   * Body site vaccine  was administered
   */
  site?: CodeableConcept;
  /* 
   * How vaccine entered body
   */
  route?: CodeableConcept;
  /* 
   * Amount of vaccine administered
   */
  doseQuantity?: Quantity;
  /* 
   * Who performed event
   */
  performer?: Array<ImmunizationPerformer>;
  /* 
   * Additional immunization notes
   */
  note?: Array<Annotation>;
  /* 
   * Why immunization occurred
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why immunization occurred
   */
  reasonReference?: Array<Reference>;
  /* 
   * Dose potency
   */
  isSubpotent?: boolean;
  /* 
   * Reason for being subpotent
   */
  subpotentReason?: Array<CodeableConcept>;
  /* 
   * Educational material presented to patient
   */
  education?: Array<ImmunizationEducation>;
  /* 
   * Patient eligibility for a vaccination program
   */
  programEligibility?: Array<CodeableConcept>;
  /* 
   * Funding source for the vaccine
   */
  fundingSource?: CodeableConcept;
  /* 
   * Details of a reaction that follows immunization
   */
  reaction?: Array<ImmunizationReaction>;
  /* 
   * Protocol followed by the provider
   */
  protocolApplied?: Array<ImmunizationProtocolApplied>;
}

export interface ImmunizationEvaluation {
resourceType: "ImmunizationEvaluation"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * completed | entered-in-error
   */
  status: code;
  /* 
   * Who this evaluation is for
   */
  patient: Reference;
  /* 
   * Date evaluation was performed
   */
  date?: dateTime;
  /* 
   * Who is responsible for publishing the recommendations
   */
  authority?: Reference;
  /* 
   * Evaluation target disease
   */
  targetDisease: CodeableConcept;
  /* 
   * Immunization being evaluated
   */
  immunizationEvent: Reference;
  /* 
   * Status of the dose relative to published recommendations
   */
  doseStatus: CodeableConcept;
  /* 
   * Reason for the dose status
   */
  doseStatusReason?: Array<CodeableConcept>;
  /* 
   * Evaluation notes
   */
  description?: string;
  /* 
   * Name of vaccine series
   */
  series?: string;
  /* 
   * Dose number within series
   */
  doseNumberPositiveInt?: positiveInt;
  /* 
   * Dose number within series
   */
  doseNumberString?: string;
  /* 
   * Recommended number of doses for immunity
   */
  seriesDosesPositiveInt?: positiveInt;
  /* 
   * Recommended number of doses for immunity
   */
  seriesDosesString?: string;
}

export interface ImmunizationRecommendationRecommendationDateCriterion {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of date
   */
  code: CodeableConcept;
  /* 
   * Recommended date
   */
  value: dateTime;
}
export interface ImmunizationRecommendationRecommendation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Vaccine  or vaccine group recommendation applies to
   */
  vaccineCode?: Array<CodeableConcept>;
  /* 
   * Disease to be immunized against
   */
  targetDisease?: CodeableConcept;
  /* 
   * Vaccine which is contraindicated to fulfill the recommendation
   */
  contraindicatedVaccineCode?: Array<CodeableConcept>;
  /* 
   * Vaccine recommendation status
   */
  forecastStatus: CodeableConcept;
  /* 
   * Vaccine administration status reason
   */
  forecastReason?: Array<CodeableConcept>;
  /* 
   * Dates governing proposed immunization
   */
  dateCriterion?: Array<ImmunizationRecommendationRecommendationDateCriterion>;
  /* 
   * Protocol details
   */
  description?: string;
  /* 
   * Name of vaccination series
   */
  series?: string;
  /* 
   * Recommended dose number within series
   */
  doseNumberPositiveInt?: positiveInt;
  /* 
   * Recommended dose number within series
   */
  doseNumberString?: string;
  /* 
   * Recommended number of doses for immunity
   */
  seriesDosesPositiveInt?: positiveInt;
  /* 
   * Recommended number of doses for immunity
   */
  seriesDosesString?: string;
  /* 
   * Past immunizations supporting recommendation
   */
  supportingImmunization?: Array<Reference>;
  /* 
   * Patient observations supporting recommendation
   */
  supportingPatientInformation?: Array<Reference>;
}
export interface ImmunizationRecommendation {
resourceType: "ImmunizationRecommendation"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Who this profile is for
   */
  patient: Reference;
  /* 
   * Date recommendation(s) created
   */
  date: dateTime;
  /* 
   * Who is responsible for protocol
   */
  authority?: Reference;
  /* 
   * Vaccine administration recommendations
   */
  recommendation: Array<ImmunizationRecommendationRecommendation>;
}

export interface ImplementationGuideDependsOn {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identity of the IG that this depends on
   */
  uri: canonical;
  /* 
   * NPM Package name for IG this depends on
   */
  packageId?: id;
  /* 
   * Version of the IG
   */
  version?: string;
}
export interface ImplementationGuideGlobal {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type this profile applies to
   */
  type: code;
  /* 
   * Profile that all resources must conform to
   */
  profile: canonical;
}
export interface ImplementationGuideDefinitionGrouping {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Descriptive name for the package
   */
  name: string;
  /* 
   * Human readable text describing the package
   */
  description?: string;
}
export interface ImplementationGuideDefinitionResource {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Location of the resource
   */
  reference: Reference;
  /* 
   * Versions this applies to (if different to IG)
   */
  fhirVersion?: Array<code>;
  /* 
   * Human Name for the resource
   */
  name?: string;
  /* 
   * Reason why included in guide
   */
  description?: string;
  /* 
   * Is an example/What is this an example of?
   */
  exampleBoolean?: boolean;
  /* 
   * Is an example/What is this an example of?
   */
  exampleCanonical?: canonical;
  /* 
   * Grouping this is part of
   */
  groupingId?: id;
}
export interface ImplementationGuideDefinitionPage {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Where to find that page
   */
  nameUrl?: url;
  /* 
   * Where to find that page
   */
  nameReference?: Reference;
  /* 
   * Short title shown for navigational assistance
   */
  title: string;
  /* 
   * html | markdown | xml | generated
   */
  generation: code;
  /* 
   * Nested Pages / Sections
   */
  page?: ImplementationGuideDefinitionPage;
}
export interface ImplementationGuideDefinitionParameter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * apply | path-resource | path-pages | path-tx-cache | expansion-parameter | rule-broken-links | generate-xml | generate-json | generate-turtle | html-template
   */
  code: code;
  /* 
   * Value for named type
   */
  value: string;
}
export interface ImplementationGuideDefinitionTemplate {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of template specified
   */
  code: code;
  /* 
   * The source location for the template
   */
  source: string;
  /* 
   * The scope in which the template applies
   */
  scope?: string;
}
export interface ImplementationGuideDefinition {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Grouping used to present related resources in the IG
   */
  grouping?: Array<ImplementationGuideDefinitionGrouping>;
  /* 
   * Resource in the implementation guide
   */
  resource: Array<ImplementationGuideDefinitionResource>;
  /* 
   * Page/Section in the Guide
   */
  page?: ImplementationGuideDefinitionPage;
  /* 
   * Defines how IG is built by tools
   */
  parameter?: Array<ImplementationGuideDefinitionParameter>;
  /* 
   * A template for building resources
   */
  template?: Array<ImplementationGuideDefinitionTemplate>;
}
export interface ImplementationGuideManifestResource {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Location of the resource
   */
  reference: Reference;
  /* 
   * Is an example/What is this an example of?
   */
  exampleBoolean?: boolean;
  /* 
   * Is an example/What is this an example of?
   */
  exampleCanonical?: canonical;
  /* 
   * Relative path for page in IG
   */
  relativePath?: url;
}
export interface ImplementationGuideManifestPage {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * HTML page name
   */
  name: string;
  /* 
   * Title of the page, for references
   */
  title?: string;
  /* 
   * Anchor available on the page
   */
  anchor?: Array<string>;
}
export interface ImplementationGuideManifest {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Location of rendered implementation guide
   */
  rendering?: url;
  /* 
   * Resource in the implementation guide
   */
  resource: Array<ImplementationGuideManifestResource>;
  /* 
   * HTML page within the parent IG
   */
  page?: Array<ImplementationGuideManifestPage>;
  /* 
   * Image within the IG
   */
  image?: Array<string>;
  /* 
   * Additional linkable file in IG
   */
  other?: Array<string>;
}
export interface ImplementationGuide {
resourceType: "ImplementationGuide"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this implementation guide, represented as a URI (globally unique)
   */
  url: uri;
  /* 
   * Business version of the implementation guide
   */
  version?: string;
  /* 
   * Name for this implementation guide (computer friendly)
   */
  name: string;
  /* 
   * Name for this implementation guide (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the implementation guide
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for implementation guide (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * NPM Package name for IG
   */
  packageId: id;
  /* 
   * SPDX license code for this IG (or not-open-source)
   */
  license?: code;
  /* 
   * FHIR Version(s) this Implementation Guide targets
   */
  fhirVersion: Array<code>;
  /* 
   * Another Implementation guide this depends on
   */
  dependsOn?: Array<ImplementationGuideDependsOn>;
  /* 
   * Profiles that apply globally
   */
  global?: Array<ImplementationGuideGlobal>;
  /* 
   * Information needed to build the IG
   */
  definition?: ImplementationGuideDefinition;
  /* 
   * Information about an assembled IG
   */
  manifest?: ImplementationGuideManifest;
}

export interface InsurancePlanContact {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The type of contact
   */
  purpose?: CodeableConcept;
  /* 
   * A name associated with the contact
   */
  name?: HumanName;
  /* 
   * Contact details (telephone, email, etc.)  for a contact
   */
  telecom?: Array<ContactPoint>;
  /* 
   * Visiting or postal addresses for the contact
   */
  address?: Address;
}
export interface InsurancePlanCoverageBenefitLimit {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Maximum value allowed
   */
  value?: Quantity;
  /* 
   * Benefit limit details
   */
  code?: CodeableConcept;
}
export interface InsurancePlanCoverageBenefit {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of benefit
   */
  type: CodeableConcept;
  /* 
   * Referral requirements
   */
  requirement?: string;
  /* 
   * Benefit limits
   */
  limit?: Array<InsurancePlanCoverageBenefitLimit>;
}
export interface InsurancePlanCoverage {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of coverage
   */
  type: CodeableConcept;
  /* 
   * What networks provide coverage
   */
  network?: Array<Reference>;
  /* 
   * List of benefits
   */
  benefit: Array<InsurancePlanCoverageBenefit>;
}
export interface InsurancePlanPlanGeneralCost {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of cost
   */
  type?: CodeableConcept;
  /* 
   * Number of enrollees
   */
  groupSize?: positiveInt;
  /* 
   * Cost value
   */
  cost?: Money;
  /* 
   * Additional cost information
   */
  comment?: string;
}
export interface InsurancePlanPlanSpecificCostBenefitCost {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of cost
   */
  type: CodeableConcept;
  /* 
   * in-network | out-of-network | other
   */
  applicability?: CodeableConcept;
  /* 
   * Additional information about the cost
   */
  qualifiers?: Array<CodeableConcept>;
  /* 
   * The actual cost value
   */
  value?: Quantity;
}
export interface InsurancePlanPlanSpecificCostBenefit {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of specific benefit
   */
  type: CodeableConcept;
  /* 
   * List of the costs
   */
  cost?: Array<InsurancePlanPlanSpecificCostBenefitCost>;
}
export interface InsurancePlanPlanSpecificCost {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * General category of benefit
   */
  category: CodeableConcept;
  /* 
   * Benefits list
   */
  benefit?: Array<InsurancePlanPlanSpecificCostBenefit>;
}
export interface InsurancePlanPlan {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for Product
   */
  identifier?: Array<Identifier>;
  /* 
   * Type of plan
   */
  type?: CodeableConcept;
  /* 
   * Where product applies
   */
  coverageArea?: Array<Reference>;
  /* 
   * What networks provide coverage
   */
  network?: Array<Reference>;
  /* 
   * Overall costs
   */
  generalCost?: Array<InsurancePlanPlanGeneralCost>;
  /* 
   * Specific costs
   */
  specificCost?: Array<InsurancePlanPlanSpecificCost>;
}
export interface InsurancePlan {
resourceType: "InsurancePlan"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for Product
   */
  identifier?: Array<Identifier>;
  /* 
   * draft | active | retired | unknown
   */
  status?: code;
  /* 
   * Kind of product
   */
  type?: Array<CodeableConcept>;
  /* 
   * Official name
   */
  name?: string;
  /* 
   * Alternate names
   */
  alias?: Array<string>;
  /* 
   * When the product is available
   */
  period?: Period;
  /* 
   * Plan issuer
   */
  ownedBy?: Reference;
  /* 
   * Product administrator
   */
  administeredBy?: Reference;
  /* 
   * Where product applies
   */
  coverageArea?: Array<Reference>;
  /* 
   * Contact for the product
   */
  contact?: Array<InsurancePlanContact>;
  /* 
   * Technical endpoint
   */
  endpoint?: Array<Reference>;
  /* 
   * What networks are Included
   */
  network?: Array<Reference>;
  /* 
   * Coverage details
   */
  coverage?: Array<InsurancePlanCoverage>;
  /* 
   * Plan details
   */
  plan?: Array<InsurancePlanPlan>;
}

export interface InvoiceParticipant {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of involvement in creation of this Invoice
   */
  role?: CodeableConcept;
  /* 
   * Individual who was involved
   */
  actor: Reference;
}
export interface InvoiceLineItemPriceComponent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * base | surcharge | deduction | discount | tax | informational
   */
  type: code;
  /* 
   * Code identifying the specific component
   */
  code?: CodeableConcept;
  /* 
   * Factor used for calculating this component
   */
  factor?: decimal;
  /* 
   * Monetary amount associated with this component
   */
  amount?: Money;
}
export interface InvoiceLineItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Sequence number of line item
   */
  sequence?: positiveInt;
  /* 
   * Reference to ChargeItem containing details of this line item or an inline billing code
   */
  chargeItemReference?: Reference;
  /* 
   * Reference to ChargeItem containing details of this line item or an inline billing code
   */
  chargeItemCodeableConcept?: CodeableConcept;
  /* 
   * Components of total line item price
   */
  priceComponent?: Array<InvoiceLineItemPriceComponent>;
}
export interface Invoice {
resourceType: "Invoice"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for item
   */
  identifier?: Array<Identifier>;
  /* 
   * draft | issued | balanced | cancelled | entered-in-error
   */
  status: code;
  /* 
   * Reason for cancellation of this Invoice
   */
  cancelledReason?: string;
  /* 
   * Type of Invoice
   */
  type?: CodeableConcept;
  /* 
   * Recipient(s) of goods and services
   */
  subject?: Reference;
  /* 
   * Recipient of this invoice
   */
  recipient?: Reference;
  /* 
   * Invoice date / posting date
   */
  date?: dateTime;
  /* 
   * Participant in creation of this Invoice
   */
  participant?: Array<InvoiceParticipant>;
  /* 
   * Issuing Organization of Invoice
   */
  issuer?: Reference;
  /* 
   * Account that is being balanced
   */
  account?: Reference;
  /* 
   * Line items of this Invoice
   */
  lineItem?: Array<InvoiceLineItem>;
  /* 
   * Components of Invoice total
   */
  totalPriceComponent?: InvoiceLineItemPriceComponent;
  /* 
   * Net total of this Invoice
   */
  totalNet?: Money;
  /* 
   * Gross total of this Invoice
   */
  totalGross?: Money;
  /* 
   * Payment details
   */
  paymentTerms?: markdown;
  /* 
   * Comments made about the invoice
   */
  note?: Array<Annotation>;
}

export interface Library {
resourceType: "Library"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this library, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the library
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the library
   */
  version?: string;
  /* 
   * Name for this library (computer friendly)
   */
  name?: string;
  /* 
   * Name for this library (human friendly)
   */
  title?: string;
  /* 
   * Subordinate title of the library
   */
  subtitle?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * logic-library | model-definition | asset-collection | module-definition
   */
  type: CodeableConcept;
  /* 
   * Type of individual the library content is focused on
   */
  subjectCodeableConcept?: CodeableConcept;
  /* 
   * Type of individual the library content is focused on
   */
  subjectReference?: Reference;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the library
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for library (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this library is defined
   */
  purpose?: markdown;
  /* 
   * Describes the clinical usage of the library
   */
  usage?: string;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the library was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the library was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the library is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * E.g. Education, Treatment, Assessment, etc.
   */
  topic?: Array<CodeableConcept>;
  /* 
   * Who authored the content
   */
  author?: Array<ContactDetail>;
  /* 
   * Who edited the content
   */
  editor?: Array<ContactDetail>;
  /* 
   * Who reviewed the content
   */
  reviewer?: Array<ContactDetail>;
  /* 
   * Who endorsed the content
   */
  endorser?: Array<ContactDetail>;
  /* 
   * Additional documentation, citations, etc.
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * Parameters defined by the library
   */
  parameter?: Array<ParameterDefinition>;
  /* 
   * What data is referenced by this library
   */
  dataRequirement?: Array<DataRequirement>;
  /* 
   * Contents of the library, either embedded or referenced
   */
  content?: Array<Attachment>;
}

export interface LinkageItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * source | alternate | historical
   */
  type: code;
  /* 
   * Resource being linked
   */
  resource: Reference;
}
export interface Linkage {
resourceType: "Linkage"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Whether this linkage assertion is active or not
   */
  active?: boolean;
  /* 
   * Who is responsible for linkages
   */
  author?: Reference;
  /* 
   * Item to be linked
   */
  item: Array<LinkageItem>;
}

export interface ListEntry {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Status/Workflow information about this item
   */
  flag?: CodeableConcept;
  /* 
   * If this item is actually marked as deleted
   */
  deleted?: boolean;
  /* 
   * When item added to list
   */
  date?: dateTime;
  /* 
   * Actual entry
   */
  item: Reference;
}
export interface List {
resourceType: "List"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * current | retired | entered-in-error
   */
  status: code;
  /* 
   * working | snapshot | changes
   */
  mode: code;
  /* 
   * Descriptive name for the list
   */
  title?: string;
  /* 
   * What the purpose of this list is
   */
  code?: CodeableConcept;
  /* 
   * If all resources have the same subject
   */
  subject?: Reference;
  /* 
   * Context in which list created
   */
  encounter?: Reference;
  /* 
   * When the list was prepared
   */
  date?: dateTime;
  /* 
   * Who and/or what defined the list contents (aka Author)
   */
  source?: Reference;
  /* 
   * What order the list has
   */
  orderedBy?: CodeableConcept;
  /* 
   * Comments about the list
   */
  note?: Array<Annotation>;
  /* 
   * Entries in the list
   */
  entry?: Array<ListEntry>;
  /* 
   * Why list is empty
   */
  emptyReason?: CodeableConcept;
}

export interface LocationPosition {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Longitude with WGS84 datum
   */
  longitude: decimal;
  /* 
   * Latitude with WGS84 datum
   */
  latitude: decimal;
  /* 
   * Altitude with WGS84 datum
   */
  altitude?: decimal;
}
export interface LocationHoursOfOperation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * mon | tue | wed | thu | fri | sat | sun
   */
  daysOfWeek?: Array<code>;
  /* 
   * The Location is open all day
   */
  allDay?: boolean;
  /* 
   * Time that the Location opens
   */
  openingTime?: time;
  /* 
   * Time that the Location closes
   */
  closingTime?: time;
}
export interface Location {
resourceType: "Location"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique code or number identifying the location to its users
   */
  identifier?: Array<Identifier>;
  /* 
   * active | suspended | inactive
   */
  status?: code;
  /* 
   * The operational status of the location (typically only for a bed/room)
   */
  operationalStatus?: Coding;
  /* 
   * Name of the location as used by humans
   */
  name?: string;
  /* 
   * A list of alternate names that the location is known as, or was known as, in the past
   */
  alias?: Array<string>;
  /* 
   * Additional details about the location that could be displayed as further information to identify the location beyond its name
   */
  description?: string;
  /* 
   * instance | kind
   */
  mode?: code;
  /* 
   * Type of function performed
   */
  type?: Array<CodeableConcept>;
  /* 
   * Contact details of the location
   */
  telecom?: Array<ContactPoint>;
  /* 
   * Physical location
   */
  address?: Address;
  /* 
   * Physical form of the location
   */
  physicalType?: CodeableConcept;
  /* 
   * The absolute geographic location
   */
  position?: LocationPosition;
  /* 
   * Organization responsible for provisioning and upkeep
   */
  managingOrganization?: Reference;
  /* 
   * Another Location this one is physically a part of
   */
  partOf?: Reference;
  /* 
   * What days/times during a week is this location usually open
   */
  hoursOfOperation?: Array<LocationHoursOfOperation>;
  /* 
   * Description of availability exceptions
   */
  availabilityExceptions?: string;
  /* 
   * Technical endpoints providing access to services operated for the location
   */
  endpoint?: Array<Reference>;
}

export interface MeasureGroupPopulation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * initial-population | numerator | numerator-exclusion | denominator | denominator-exclusion | denominator-exception | measure-population | measure-population-exclusion | measure-observation
   */
  code?: CodeableConcept;
  /* 
   * The human readable description of this population criteria
   */
  description?: string;
  /* 
   * The criteria that defines this population
   */
  criteria: Expression;
}
export interface MeasureGroupStratifierComponent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Meaning of the stratifier component
   */
  code?: CodeableConcept;
  /* 
   * The human readable description of this stratifier component
   */
  description?: string;
  /* 
   * Component of how the measure should be stratified
   */
  criteria: Expression;
}
export interface MeasureGroupStratifier {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Meaning of the stratifier
   */
  code?: CodeableConcept;
  /* 
   * The human readable description of this stratifier
   */
  description?: string;
  /* 
   * How the measure should be stratified
   */
  criteria?: Expression;
  /* 
   * Stratifier criteria component for the measure
   */
  component?: Array<MeasureGroupStratifierComponent>;
}
export interface MeasureGroup {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Meaning of the group
   */
  code?: CodeableConcept;
  /* 
   * Summary description
   */
  description?: string;
  /* 
   * Population criteria
   */
  population?: Array<MeasureGroupPopulation>;
  /* 
   * Stratifier criteria for the measure
   */
  stratifier?: Array<MeasureGroupStratifier>;
}
export interface MeasureSupplementalData {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Meaning of the supplemental data
   */
  code?: CodeableConcept;
  /* 
   * supplemental-data | risk-adjustment-factor
   */
  usage?: Array<CodeableConcept>;
  /* 
   * The human readable description of this supplemental data
   */
  description?: string;
  /* 
   * Expression describing additional data to be reported
   */
  criteria: Expression;
}
export interface Measure {
resourceType: "Measure"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this measure, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the measure
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the measure
   */
  version?: string;
  /* 
   * Name for this measure (computer friendly)
   */
  name?: string;
  /* 
   * Name for this measure (human friendly)
   */
  title?: string;
  /* 
   * Subordinate title of the measure
   */
  subtitle?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device
   */
  subjectCodeableConcept?: CodeableConcept;
  /* 
   * E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device
   */
  subjectReference?: Reference;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the measure
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for measure (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this measure is defined
   */
  purpose?: markdown;
  /* 
   * Describes the clinical usage of the measure
   */
  usage?: string;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the measure was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the measure was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the measure is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * The category of the measure, such as Education, Treatment, Assessment, etc.
   */
  topic?: Array<CodeableConcept>;
  /* 
   * Who authored the content
   */
  author?: Array<ContactDetail>;
  /* 
   * Who edited the content
   */
  editor?: Array<ContactDetail>;
  /* 
   * Who reviewed the content
   */
  reviewer?: Array<ContactDetail>;
  /* 
   * Who endorsed the content
   */
  endorser?: Array<ContactDetail>;
  /* 
   * Additional documentation, citations, etc.
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * Logic used by the measure
   */
  library?: Array<canonical>;
  /* 
   * Disclaimer for use of the measure or its referenced content
   */
  disclaimer?: markdown;
  /* 
   * proportion | ratio | continuous-variable | cohort
   */
  scoring?: CodeableConcept;
  /* 
   * opportunity | all-or-nothing | linear | weighted
   */
  compositeScoring?: CodeableConcept;
  /* 
   * process | outcome | structure | patient-reported-outcome | composite
   */
  type?: Array<CodeableConcept>;
  /* 
   * How risk adjustment is applied for this measure
   */
  riskAdjustment?: string;
  /* 
   * How is rate aggregation performed for this measure
   */
  rateAggregation?: string;
  /* 
   * Detailed description of why the measure exists
   */
  rationale?: markdown;
  /* 
   * Summary of clinical guidelines
   */
  clinicalRecommendationStatement?: markdown;
  /* 
   * increase | decrease
   */
  improvementNotation?: CodeableConcept;
  /* 
   * Defined terms used in the measure documentation
   */
  definition?: Array<markdown>;
  /* 
   * Additional guidance for implementers
   */
  guidance?: markdown;
  /* 
   * Population criteria group
   */
  group?: Array<MeasureGroup>;
  /* 
   * What other data should be reported with the measure
   */
  supplementalData?: Array<MeasureSupplementalData>;
}

export interface MeasureReportGroupPopulation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * initial-population | numerator | numerator-exclusion | denominator | denominator-exclusion | denominator-exception | measure-population | measure-population-exclusion | measure-observation
   */
  code?: CodeableConcept;
  /* 
   * Size of the population
   */
  count?: integer;
  /* 
   * For subject-list reports, the subject results in this population
   */
  subjectResults?: Reference;
}
export interface MeasureReportGroupStratifierStratumComponent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * What stratifier component of the group
   */
  code: CodeableConcept;
  /* 
   * The stratum component value, e.g. male
   */
  value: CodeableConcept;
}
export interface MeasureReportGroupStratifierStratumPopulation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * initial-population | numerator | numerator-exclusion | denominator | denominator-exclusion | denominator-exception | measure-population | measure-population-exclusion | measure-observation
   */
  code?: CodeableConcept;
  /* 
   * Size of the population
   */
  count?: integer;
  /* 
   * For subject-list reports, the subject results in this population
   */
  subjectResults?: Reference;
}
export interface MeasureReportGroupStratifierStratum {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The stratum value, e.g. male
   */
  value?: CodeableConcept;
  /* 
   * Stratifier component values
   */
  component?: Array<MeasureReportGroupStratifierStratumComponent>;
  /* 
   * Population results in this stratum
   */
  population?: Array<MeasureReportGroupStratifierStratumPopulation>;
  /* 
   * What score this stratum achieved
   */
  measureScore?: Quantity;
}
export interface MeasureReportGroupStratifier {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * What stratifier of the group
   */
  code?: Array<CodeableConcept>;
  /* 
   * Stratum results, one for each unique value, or set of values, in the stratifier, or stratifier components
   */
  stratum?: Array<MeasureReportGroupStratifierStratum>;
}
export interface MeasureReportGroup {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Meaning of the group
   */
  code?: CodeableConcept;
  /* 
   * The populations in the group
   */
  population?: Array<MeasureReportGroupPopulation>;
  /* 
   * What score this group achieved
   */
  measureScore?: Quantity;
  /* 
   * Stratification results
   */
  stratifier?: Array<MeasureReportGroupStratifier>;
}
export interface MeasureReport {
resourceType: "MeasureReport"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Additional identifier for the MeasureReport
   */
  identifier?: Array<Identifier>;
  /* 
   * complete | pending | error
   */
  status: code;
  /* 
   * individual | subject-list | summary | data-collection
   */
  type: code;
  /* 
   * What measure was calculated
   */
  measure: canonical;
  /* 
   * What individual(s) the report is for
   */
  subject?: Reference;
  /* 
   * When the report was generated
   */
  date?: dateTime;
  /* 
   * Who is reporting the data
   */
  reporter?: Reference;
  /* 
   * What period the report covers
   */
  period: Period;
  /* 
   * increase | decrease
   */
  improvementNotation?: CodeableConcept;
  /* 
   * Measure results for each group
   */
  group?: Array<MeasureReportGroup>;
  /* 
   * What data was used to calculate the measure score
   */
  evaluatedResource?: Array<Reference>;
}

export interface Media {
resourceType: "Media"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifier(s) for the image
   */
  identifier?: Array<Identifier>;
  /* 
   * Procedure that caused this media to be created
   */
  basedOn?: Array<Reference>;
  /* 
   * Part of referenced event
   */
  partOf?: Array<Reference>;
  /* 
   * preparation | in-progress | not-done | on-hold | stopped | completed | entered-in-error | unknown
   */
  status: code;
  /* 
   * Classification of media as image, video, or audio
   */
  type?: CodeableConcept;
  /* 
   * The type of acquisition equipment/process
   */
  modality?: CodeableConcept;
  /* 
   * Imaging view, e.g. Lateral or Antero-posterior
   */
  view?: CodeableConcept;
  /* 
   * Who/What this Media is a record of
   */
  subject?: Reference;
  /* 
   * Encounter associated with media
   */
  encounter?: Reference;
  /* 
   * When Media was collected
   */
  createdDateTime?: dateTime;
  /* 
   * When Media was collected
   */
  createdPeriod?: Period;
  /* 
   * Date/Time this version was made available
   */
  issued?: instant;
  /* 
   * The person who generated the image
   */
  operator?: Reference;
  /* 
   * Why was event performed?
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Observed body part
   */
  bodySite?: CodeableConcept;
  /* 
   * Name of the device/manufacturer
   */
  deviceName?: string;
  /* 
   * Observing Device
   */
  device?: Reference;
  /* 
   * Height of the image in pixels (photo/video)
   */
  height?: positiveInt;
  /* 
   * Width of the image in pixels (photo/video)
   */
  width?: positiveInt;
  /* 
   * Number of frames if > 1 (photo)
   */
  frames?: positiveInt;
  /* 
   * Length in seconds (audio / video)
   */
  duration?: decimal;
  /* 
   * Actual Media - reference or data
   */
  content: Attachment;
  /* 
   * Comments made about the media
   */
  note?: Array<Annotation>;
}

export interface MedicationIngredient {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The actual ingredient or content
   */
  itemCodeableConcept?: CodeableConcept;
  /* 
   * The actual ingredient or content
   */
  itemReference?: Reference;
  /* 
   * Active ingredient indicator
   */
  isActive?: boolean;
  /* 
   * Quantity of ingredient present
   */
  strength?: Ratio;
}
export interface MedicationBatch {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifier assigned to batch
   */
  lotNumber?: string;
  /* 
   * When batch will expire
   */
  expirationDate?: dateTime;
}
export interface Medication {
resourceType: "Medication"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier for this medication
   */
  identifier?: Array<Identifier>;
  /* 
   * Codes that identify this medication
   */
  code?: CodeableConcept;
  /* 
   * active | inactive | entered-in-error
   */
  status?: code;
  /* 
   * Manufacturer of the item
   */
  manufacturer?: Reference;
  /* 
   * powder | tablets | capsule +
   */
  form?: CodeableConcept;
  /* 
   * Amount of drug in package
   */
  amount?: Ratio;
  /* 
   * Active or inactive ingredient
   */
  ingredient?: Array<MedicationIngredient>;
  /* 
   * Details about packaged medications
   */
  batch?: MedicationBatch;
}

export interface MedicationAdministrationPerformer {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of performance
   */
  function?: CodeableConcept;
  /* 
   * Who performed the medication administration
   */
  actor: Reference;
}
export interface MedicationAdministrationDosage {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Free text dosage instructions e.g. SIG
   */
  text?: string;
  /* 
   * Body site administered to
   */
  site?: CodeableConcept;
  /* 
   * Path of substance into body
   */
  route?: CodeableConcept;
  /* 
   * How drug was administered
   */
  method?: CodeableConcept;
  /* 
   * Amount of medication per dose
   */
  dose?: Quantity;
  /* 
   * Dose quantity per unit of time
   */
  rateRatio?: Ratio;
  /* 
   * Dose quantity per unit of time
   */
  rateQuantity?: Quantity;
}
export interface MedicationAdministration {
resourceType: "MedicationAdministration"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Instantiates protocol or definition
   */
  instantiates?: Array<uri>;
  /* 
   * Part of referenced event
   */
  partOf?: Array<Reference>;
  /* 
   * in-progress | not-done | on-hold | completed | entered-in-error | stopped | unknown
   */
  status: code;
  /* 
   * Reason administration not performed
   */
  statusReason?: Array<CodeableConcept>;
  /* 
   * Type of medication usage
   */
  category?: CodeableConcept;
  /* 
   * What was administered
   */
  medicationCodeableConcept?: CodeableConcept;
  /* 
   * What was administered
   */
  medicationReference?: Reference;
  /* 
   * Who received medication
   */
  subject: Reference;
  /* 
   * Encounter or Episode of Care administered as part of
   */
  context?: Reference;
  /* 
   * Additional information to support administration
   */
  supportingInformation?: Array<Reference>;
  /* 
   * Start and end time of administration
   */
  effectiveDateTime?: dateTime;
  /* 
   * Start and end time of administration
   */
  effectivePeriod?: Period;
  /* 
   * Who performed the medication administration and what they did
   */
  performer?: Array<MedicationAdministrationPerformer>;
  /* 
   * Reason administration performed
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Condition or observation that supports why the medication was administered
   */
  reasonReference?: Array<Reference>;
  /* 
   * Request administration performed against
   */
  request?: Reference;
  /* 
   * Device used to administer
   */
  device?: Array<Reference>;
  /* 
   * Information about the administration
   */
  note?: Array<Annotation>;
  /* 
   * Details of how medication was taken
   */
  dosage?: MedicationAdministrationDosage;
  /* 
   * A list of events of interest in the lifecycle
   */
  eventHistory?: Array<Reference>;
}

export interface MedicationDispensePerformer {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Who performed the dispense and what they did
   */
  function?: CodeableConcept;
  /* 
   * Individual who was performing
   */
  actor: Reference;
}
export interface MedicationDispenseSubstitution {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Whether a substitution was or was not performed on the dispense
   */
  wasSubstituted: boolean;
  /* 
   * Code signifying whether a different drug was dispensed from what was prescribed
   */
  type?: CodeableConcept;
  /* 
   * Why was substitution made
   */
  reason?: Array<CodeableConcept>;
  /* 
   * Who is responsible for the substitution
   */
  responsibleParty?: Array<Reference>;
}
export interface MedicationDispense {
resourceType: "MedicationDispense"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Event that dispense is part of
   */
  partOf?: Array<Reference>;
  /* 
   * preparation | in-progress | cancelled | on-hold | completed | entered-in-error | stopped | declined | unknown
   */
  status: code;
  /* 
   * Why a dispense was not performed
   */
  statusReasonCodeableConcept?: CodeableConcept;
  /* 
   * Why a dispense was not performed
   */
  statusReasonReference?: Reference;
  /* 
   * Type of medication dispense
   */
  category?: CodeableConcept;
  /* 
   * What medication was supplied
   */
  medicationCodeableConcept?: CodeableConcept;
  /* 
   * What medication was supplied
   */
  medicationReference?: Reference;
  /* 
   * Who the dispense is for
   */
  subject?: Reference;
  /* 
   * Encounter / Episode associated with event
   */
  context?: Reference;
  /* 
   * Information that supports the dispensing of the medication
   */
  supportingInformation?: Array<Reference>;
  /* 
   * Who performed event
   */
  performer?: Array<MedicationDispensePerformer>;
  /* 
   * Where the dispense occurred
   */
  location?: Reference;
  /* 
   * Medication order that authorizes the dispense
   */
  authorizingPrescription?: Array<Reference>;
  /* 
   * Trial fill, partial fill, emergency fill, etc.
   */
  type?: CodeableConcept;
  /* 
   * Amount dispensed
   */
  quantity?: Quantity;
  /* 
   * Amount of medication expressed as a timing amount
   */
  daysSupply?: Quantity;
  /* 
   * When product was packaged and reviewed
   */
  whenPrepared?: dateTime;
  /* 
   * When product was given out
   */
  whenHandedOver?: dateTime;
  /* 
   * Where the medication was sent
   */
  destination?: Reference;
  /* 
   * Who collected the medication
   */
  receiver?: Array<Reference>;
  /* 
   * Information about the dispense
   */
  note?: Array<Annotation>;
  /* 
   * How the medication is to be used by the patient or administered by the caregiver
   */
  dosageInstruction?: Array<Dosage>;
  /* 
   * Whether a substitution was performed on the dispense
   */
  substitution?: MedicationDispenseSubstitution;
  /* 
   * Clinical issue with action
   */
  detectedIssue?: Array<Reference>;
  /* 
   * A list of relevant lifecycle events
   */
  eventHistory?: Array<Reference>;
}

export interface MedicationKnowledgeRelatedMedicationKnowledge {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Category of medicationKnowledge
   */
  type: CodeableConcept;
  /* 
   * Associated documentation about the associated medication knowledge
   */
  reference: Array<Reference>;
}
export interface MedicationKnowledgeMonograph {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The category of medication document
   */
  type?: CodeableConcept;
  /* 
   * Associated documentation about the medication
   */
  source?: Reference;
}
export interface MedicationKnowledgeIngredient {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Medication(s) or substance(s) contained in the medication
   */
  itemCodeableConcept?: CodeableConcept;
  /* 
   * Medication(s) or substance(s) contained in the medication
   */
  itemReference?: Reference;
  /* 
   * Active ingredient indicator
   */
  isActive?: boolean;
  /* 
   * Quantity of ingredient present
   */
  strength?: Ratio;
}
export interface MedicationKnowledgeCost {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The category of the cost information
   */
  type: CodeableConcept;
  /* 
   * The source or owner for the price information
   */
  source?: string;
  /* 
   * The price of the medication
   */
  cost: Money;
}
export interface MedicationKnowledgeMonitoringProgram {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of program under which the medication is monitored
   */
  type?: CodeableConcept;
  /* 
   * Name of the reviewing program
   */
  name?: string;
}
export interface MedicationKnowledgeAdministrationGuidelinesDosage {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of dosage
   */
  type: CodeableConcept;
  /* 
   * Dosage for the medication for the specific guidelines
   */
  dosage: Array<Dosage>;
}
export interface MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Specific characteristic that is relevant to the administration guideline
   */
  characteristicCodeableConcept?: CodeableConcept;
  /* 
   * Specific characteristic that is relevant to the administration guideline
   */
  characteristicQuantity?: Quantity;
  /* 
   * The specific characteristic
   */
  value?: Array<string>;
}
export interface MedicationKnowledgeAdministrationGuidelines {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Dosage for the medication for the specific guidelines
   */
  dosage?: Array<MedicationKnowledgeAdministrationGuidelinesDosage>;
  /* 
   * Indication for use that apply to the specific administration guidelines
   */
  indicationCodeableConcept?: CodeableConcept;
  /* 
   * Indication for use that apply to the specific administration guidelines
   */
  indicationReference?: Reference;
  /* 
   * Characteristics of the patient that are relevant to the administration guidelines
   */
  patientCharacteristics?: Array<MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics>;
}
export interface MedicationKnowledgeMedicineClassification {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The type of category for the medication (for example, therapeutic classification, therapeutic sub-classification)
   */
  type: CodeableConcept;
  /* 
   * Specific category assigned to the medication
   */
  classification?: Array<CodeableConcept>;
}
export interface MedicationKnowledgePackaging {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A code that defines the specific type of packaging that the medication can be found in
   */
  type?: CodeableConcept;
  /* 
   * The number of product units the package would contain if fully loaded
   */
  quantity?: Quantity;
}
export interface MedicationKnowledgeDrugCharacteristic {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code specifying the type of characteristic of medication
   */
  type?: CodeableConcept;
  /* 
   * Description of the characteristic
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * Description of the characteristic
   */
  valueString?: string;
  /* 
   * Description of the characteristic
   */
  valueQuantity?: Quantity;
  /* 
   * Description of the characteristic
   */
  valueBase64Binary?: base64Binary;
}
export interface MedicationKnowledgeRegulatorySubstitution {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Specifies the type of substitution allowed
   */
  type: CodeableConcept;
  /* 
   * Specifies if regulation allows for changes in the medication when dispensing
   */
  allowed: boolean;
}
export interface MedicationKnowledgeRegulatorySchedule {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Specifies the specific drug schedule
   */
  schedule: CodeableConcept;
}
export interface MedicationKnowledgeRegulatoryMaxDispense {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The maximum number of units of the medication that can be dispensed
   */
  quantity: Quantity;
  /* 
   * The period that applies to the maximum number of units
   */
  period?: Duration;
}
export interface MedicationKnowledgeRegulatory {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Specifies the authority of the regulation
   */
  regulatoryAuthority: Reference;
  /* 
   * Specifies if changes are allowed when dispensing a medication from a regulatory perspective
   */
  substitution?: Array<MedicationKnowledgeRegulatorySubstitution>;
  /* 
   * Specifies the schedule of a medication in jurisdiction
   */
  schedule?: Array<MedicationKnowledgeRegulatorySchedule>;
  /* 
   * The maximum number of units of the medication that can be dispensed in a period
   */
  maxDispense?: MedicationKnowledgeRegulatoryMaxDispense;
}
export interface MedicationKnowledgeKinetics {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The drug concentration measured at certain discrete points in time
   */
  areaUnderCurve?: Array<Quantity>;
  /* 
   * The median lethal dose of a drug
   */
  lethalDose50?: Array<Quantity>;
  /* 
   * Time required for concentration in the body to decrease by half
   */
  halfLifePeriod?: Duration;
}
export interface MedicationKnowledge {
resourceType: "MedicationKnowledge"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code that identifies this medication
   */
  code?: CodeableConcept;
  /* 
   * active | inactive | entered-in-error
   */
  status?: code;
  /* 
   * Manufacturer of the item
   */
  manufacturer?: Reference;
  /* 
   * powder | tablets | capsule +
   */
  doseForm?: CodeableConcept;
  /* 
   * Amount of drug in package
   */
  amount?: Quantity;
  /* 
   * Additional names for a medication
   */
  synonym?: Array<string>;
  /* 
   * Associated or related medication information
   */
  relatedMedicationKnowledge?: Array<MedicationKnowledgeRelatedMedicationKnowledge>;
  /* 
   * A medication resource that is associated with this medication
   */
  associatedMedication?: Array<Reference>;
  /* 
   * Category of the medication or product
   */
  productType?: Array<CodeableConcept>;
  /* 
   * Associated documentation about the medication
   */
  monograph?: Array<MedicationKnowledgeMonograph>;
  /* 
   * Active or inactive ingredient
   */
  ingredient?: Array<MedicationKnowledgeIngredient>;
  /* 
   * The instructions for preparing the medication
   */
  preparationInstruction?: markdown;
  /* 
   * The intended or approved route of administration
   */
  intendedRoute?: Array<CodeableConcept>;
  /* 
   * The pricing of the medication
   */
  cost?: Array<MedicationKnowledgeCost>;
  /* 
   * Program under which a medication is reviewed
   */
  monitoringProgram?: Array<MedicationKnowledgeMonitoringProgram>;
  /* 
   * Guidelines for administration of the medication
   */
  administrationGuidelines?: Array<MedicationKnowledgeAdministrationGuidelines>;
  /* 
   * Categorization of the medication within a formulary or classification system
   */
  medicineClassification?: Array<MedicationKnowledgeMedicineClassification>;
  /* 
   * Details about packaged medications
   */
  packaging?: MedicationKnowledgePackaging;
  /* 
   * Specifies descriptive properties of the medicine
   */
  drugCharacteristic?: Array<MedicationKnowledgeDrugCharacteristic>;
  /* 
   * Potential clinical issue with or between medication(s)
   */
  contraindication?: Array<Reference>;
  /* 
   * Regulatory information about a medication
   */
  regulatory?: Array<MedicationKnowledgeRegulatory>;
  /* 
   * The time course of drug absorption, distribution, metabolism and excretion of a medication from the body
   */
  kinetics?: Array<MedicationKnowledgeKinetics>;
}

export interface MedicationRequestDispenseRequestInitialFill {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * First fill quantity
   */
  quantity?: Quantity;
  /* 
   * First fill duration
   */
  duration?: Duration;
}
export interface MedicationRequestDispenseRequest {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * First fill details
   */
  initialFill?: MedicationRequestDispenseRequestInitialFill;
  /* 
   * Minimum period of time between dispenses
   */
  dispenseInterval?: Duration;
  /* 
   * Time period supply is authorized for
   */
  validityPeriod?: Period;
  /* 
   * Number of refills authorized
   */
  numberOfRepeatsAllowed?: unsignedInt;
  /* 
   * Amount of medication to supply per dispense
   */
  quantity?: Quantity;
  /* 
   * Number of days supply per dispense
   */
  expectedSupplyDuration?: Duration;
  /* 
   * Intended dispenser
   */
  performer?: Reference;
}
export interface MedicationRequestSubstitution {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Whether substitution is allowed or not
   */
  allowedBoolean?: boolean;
  /* 
   * Whether substitution is allowed or not
   */
  allowedCodeableConcept?: CodeableConcept;
  /* 
   * Why should (not) substitution be made
   */
  reason?: CodeableConcept;
}
export interface MedicationRequest {
resourceType: "MedicationRequest"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External ids for this request
   */
  identifier?: Array<Identifier>;
  /* 
   * active | on-hold | cancelled | completed | entered-in-error | stopped | draft | unknown
   */
  status: code;
  /* 
   * Reason for current status
   */
  statusReason?: CodeableConcept;
  /* 
   * proposal | plan | order | original-order | reflex-order | filler-order | instance-order | option
   */
  intent: code;
  /* 
   * Type of medication usage
   */
  category?: Array<CodeableConcept>;
  /* 
   * routine | urgent | asap | stat
   */
  priority?: code;
  /* 
   * True if request is prohibiting action
   */
  doNotPerform?: boolean;
  /* 
   * Reported rather than primary record
   */
  reportedBoolean?: boolean;
  /* 
   * Reported rather than primary record
   */
  reportedReference?: Reference;
  /* 
   * Medication to be taken
   */
  medicationCodeableConcept?: CodeableConcept;
  /* 
   * Medication to be taken
   */
  medicationReference?: Reference;
  /* 
   * Who or group medication request is for
   */
  subject: Reference;
  /* 
   * Encounter created as part of encounter/admission/stay
   */
  encounter?: Reference;
  /* 
   * Information to support ordering of the medication
   */
  supportingInformation?: Array<Reference>;
  /* 
   * When request was initially authored
   */
  authoredOn?: dateTime;
  /* 
   * Who/What requested the Request
   */
  requester?: Reference;
  /* 
   * Intended performer of administration
   */
  performer?: Reference;
  /* 
   * Desired kind of performer of the medication administration
   */
  performerType?: CodeableConcept;
  /* 
   * Person who entered the request
   */
  recorder?: Reference;
  /* 
   * Reason or indication for ordering or not ordering the medication
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Condition or observation that supports why the prescription is being written
   */
  reasonReference?: Array<Reference>;
  /* 
   * Instantiates FHIR protocol or definition
   */
  instantiatesCanonical?: Array<canonical>;
  /* 
   * Instantiates external protocol or definition
   */
  instantiatesUri?: Array<uri>;
  /* 
   * What request fulfills
   */
  basedOn?: Array<Reference>;
  /* 
   * Composite request this is part of
   */
  groupIdentifier?: Identifier;
  /* 
   * Overall pattern of medication administration
   */
  courseOfTherapyType?: CodeableConcept;
  /* 
   * Associated insurance coverage
   */
  insurance?: Array<Reference>;
  /* 
   * Information about the prescription
   */
  note?: Array<Annotation>;
  /* 
   * How the medication should be taken
   */
  dosageInstruction?: Array<Dosage>;
  /* 
   * Medication supply authorization
   */
  dispenseRequest?: MedicationRequestDispenseRequest;
  /* 
   * Any restrictions on medication substitution
   */
  substitution?: MedicationRequestSubstitution;
  /* 
   * An order/prescription that is being replaced
   */
  priorPrescription?: Reference;
  /* 
   * Clinical Issue with action
   */
  detectedIssue?: Array<Reference>;
  /* 
   * A list of events of interest in the lifecycle
   */
  eventHistory?: Array<Reference>;
}

export interface MedicationStatement {
resourceType: "MedicationStatement"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Fulfils plan, proposal or order
   */
  basedOn?: Array<Reference>;
  /* 
   * Part of referenced event
   */
  partOf?: Array<Reference>;
  /* 
   * active | completed | entered-in-error | intended | stopped | on-hold | unknown | not-taken
   */
  status: code;
  /* 
   * Reason for current status
   */
  statusReason?: Array<CodeableConcept>;
  /* 
   * Type of medication usage
   */
  category?: CodeableConcept;
  /* 
   * What medication was taken
   */
  medicationCodeableConcept?: CodeableConcept;
  /* 
   * What medication was taken
   */
  medicationReference?: Reference;
  /* 
   * Who is/was taking  the medication
   */
  subject: Reference;
  /* 
   * Encounter / Episode associated with MedicationStatement
   */
  context?: Reference;
  /* 
   * The date/time or interval when the medication is/was/will be taken
   */
  effectiveDateTime?: dateTime;
  /* 
   * The date/time or interval when the medication is/was/will be taken
   */
  effectivePeriod?: Period;
  /* 
   * When the statement was asserted?
   */
  dateAsserted?: dateTime;
  /* 
   * Person or organization that provided the information about the taking of this medication
   */
  informationSource?: Reference;
  /* 
   * Additional supporting information
   */
  derivedFrom?: Array<Reference>;
  /* 
   * Reason for why the medication is being/was taken
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Condition or observation that supports why the medication is being/was taken
   */
  reasonReference?: Array<Reference>;
  /* 
   * Further information about the statement
   */
  note?: Array<Annotation>;
  /* 
   * Details of how medication is/was taken or should be taken
   */
  dosage?: Array<Dosage>;
}

export interface MedicinalProductNameNamePart {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A fragment of a product name
   */
  part: string;
  /* 
   * Idenifying type for this part of the name (e.g. strength part)
   */
  type: Coding;
}
export interface MedicinalProductNameCountryLanguage {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Country code for where this name applies
   */
  country: CodeableConcept;
  /* 
   * Jurisdiction code for where this name applies
   */
  jurisdiction?: CodeableConcept;
  /* 
   * Language code for this name
   */
  language: CodeableConcept;
}
export interface MedicinalProductName {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The full product name
   */
  productName: string;
  /* 
   * Coding words or phrases of the name
   */
  namePart?: Array<MedicinalProductNameNamePart>;
  /* 
   * Country where the name applies
   */
  countryLanguage?: Array<MedicinalProductNameCountryLanguage>;
}
export interface MedicinalProductManufacturingBusinessOperation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The type of manufacturing operation
   */
  operationType?: CodeableConcept;
  /* 
   * Regulatory authorization reference number
   */
  authorisationReferenceNumber?: Identifier;
  /* 
   * Regulatory authorization date
   */
  effectiveDate?: dateTime;
  /* 
   * To indicate if this proces is commercially confidential
   */
  confidentialityIndicator?: CodeableConcept;
  /* 
   * The manufacturer or establishment associated with the process
   */
  manufacturer?: Array<Reference>;
  /* 
   * A regulator which oversees the operation
   */
  regulator?: Reference;
}
export interface MedicinalProductSpecialDesignation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifier for the designation, or procedure number
   */
  identifier?: Array<Identifier>;
  /* 
   * The type of special designation, e.g. orphan drug, minor use
   */
  type?: CodeableConcept;
  /* 
   * The intended use of the product, e.g. prevention, treatment
   */
  intendedUse?: CodeableConcept;
  /* 
   * Condition for which the medicinal use applies
   */
  indicationCodeableConcept?: CodeableConcept;
  /* 
   * Condition for which the medicinal use applies
   */
  indicationReference?: Reference;
  /* 
   * For example granted, pending, expired or withdrawn
   */
  status?: CodeableConcept;
  /* 
   * Date when the designation was granted
   */
  date?: dateTime;
  /* 
   * Animal species for which this applies
   */
  species?: CodeableConcept;
}
export interface MedicinalProduct {
resourceType: "MedicinalProduct"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier for this product. Could be an MPID
   */
  identifier?: Array<Identifier>;
  /* 
   * Regulatory type, e.g. Investigational or Authorized
   */
  type?: CodeableConcept;
  /* 
   * If this medicine applies to human or veterinary uses
   */
  domain?: Coding;
  /* 
   * The dose form for a single part product, or combined form of a multiple part product
   */
  combinedPharmaceuticalDoseForm?: CodeableConcept;
  /* 
   * The legal status of supply of the medicinal product as classified by the regulator
   */
  legalStatusOfSupply?: CodeableConcept;
  /* 
   * Whether the Medicinal Product is subject to additional monitoring for regulatory reasons
   */
  additionalMonitoringIndicator?: CodeableConcept;
  /* 
   * Whether the Medicinal Product is subject to special measures for regulatory reasons
   */
  specialMeasures?: Array<string>;
  /* 
   * If authorised for use in children
   */
  paediatricUseIndicator?: CodeableConcept;
  /* 
   * Allows the product to be classified by various systems
   */
  productClassification?: Array<CodeableConcept>;
  /* 
   * Marketing status of the medicinal product, in contrast to marketing authorizaton
   */
  marketingStatus?: Array<MarketingStatus>;
  /* 
   * Pharmaceutical aspects of product
   */
  pharmaceuticalProduct?: Array<Reference>;
  /* 
   * Package representation for the product
   */
  packagedMedicinalProduct?: Array<Reference>;
  /* 
   * Supporting documentation, typically for regulatory submission
   */
  attachedDocument?: Array<Reference>;
  /* 
   * A master file for to the medicinal product (e.g. Pharmacovigilance System Master File)
   */
  masterFile?: Array<Reference>;
  /* 
   * A product specific contact, person (in a role), or an organization
   */
  contact?: Array<Reference>;
  /* 
   * Clinical trials or studies that this product is involved in
   */
  clinicalTrial?: Array<Reference>;
  /* 
   * The product's name, including full name and possibly coded parts
   */
  name: Array<MedicinalProductName>;
  /* 
   * Reference to another product, e.g. for linking authorised to investigational product
   */
  crossReference?: Array<Identifier>;
  /* 
   * An operation applied to the product, for manufacturing or adminsitrative purpose
   */
  manufacturingBusinessOperation?: Array<MedicinalProductManufacturingBusinessOperation>;
  /* 
   * Indicates if the medicinal product has an orphan designation for the treatment of a rare disease
   */
  specialDesignation?: Array<MedicinalProductSpecialDesignation>;
}

export interface MedicinalProductAuthorizationJurisdictionalAuthorization {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The assigned number for the marketing authorization
   */
  identifier?: Array<Identifier>;
  /* 
   * Country of authorization
   */
  country?: CodeableConcept;
  /* 
   * Jurisdiction within a country
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * The legal status of supply in a jurisdiction or region
   */
  legalStatusOfSupply?: CodeableConcept;
  /* 
   * The start and expected end date of the authorization
   */
  validityPeriod?: Period;
}
export interface MedicinalProductAuthorizationProcedure {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifier for this procedure
   */
  identifier?: Identifier;
  /* 
   * Type of procedure
   */
  type: CodeableConcept;
  /* 
   * Date of procedure
   */
  datePeriod?: Period;
  /* 
   * Date of procedure
   */
  dateDateTime?: dateTime;
  /* 
   * Applcations submitted to obtain a marketing authorization
   */
  application?: MedicinalProductAuthorizationProcedure;
}
export interface MedicinalProductAuthorization {
resourceType: "MedicinalProductAuthorization"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier for the marketing authorization, as assigned by a regulator
   */
  identifier?: Array<Identifier>;
  /* 
   * The medicinal product that is being authorized
   */
  subject?: Reference;
  /* 
   * The country in which the marketing authorization has been granted
   */
  country?: Array<CodeableConcept>;
  /* 
   * Jurisdiction within a country
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * The status of the marketing authorization
   */
  status?: CodeableConcept;
  /* 
   * The date at which the given status has become applicable
   */
  statusDate?: dateTime;
  /* 
   * The date when a suspended the marketing or the marketing authorization of the product is anticipated to be restored
   */
  restoreDate?: dateTime;
  /* 
   * The beginning of the time period in which the marketing authorization is in the specific status shall be specified A complete date consisting of day, month and year shall be specified using the ISO 8601 date format
   */
  validityPeriod?: Period;
  /* 
   * A period of time after authorization before generic product applicatiosn can be submitted
   */
  dataExclusivityPeriod?: Period;
  /* 
   * The date when the first authorization was granted by a Medicines Regulatory Agency
   */
  dateOfFirstAuthorization?: dateTime;
  /* 
   * Date of first marketing authorization for a company's new medicinal product in any country in the World
   */
  internationalBirthDate?: dateTime;
  /* 
   * The legal framework against which this authorization is granted
   */
  legalBasis?: CodeableConcept;
  /* 
   * Authorization in areas within a country
   */
  jurisdictionalAuthorization?: Array<MedicinalProductAuthorizationJurisdictionalAuthorization>;
  /* 
   * Marketing Authorization Holder
   */
  holder?: Reference;
  /* 
   * Medicines Regulatory Agency
   */
  regulator?: Reference;
  /* 
   * The regulatory procedure for granting or amending a marketing authorization
   */
  procedure?: MedicinalProductAuthorizationProcedure;
}

export interface MedicinalProductContraindicationOtherTherapy {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The type of relationship between the medicinal product indication or contraindication and another therapy
   */
  therapyRelationshipType: CodeableConcept;
  /* 
   * Reference to a specific medication (active substance, medicinal product or class of products) as part of an indication or contraindication
   */
  medicationCodeableConcept?: CodeableConcept;
  /* 
   * Reference to a specific medication (active substance, medicinal product or class of products) as part of an indication or contraindication
   */
  medicationReference?: Reference;
}
export interface MedicinalProductContraindication {
resourceType: "MedicinalProductContraindication"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The medication for which this is an indication
   */
  subject?: Array<Reference>;
  /* 
   * The disease, symptom or procedure for the contraindication
   */
  disease?: CodeableConcept;
  /* 
   * The status of the disease or symptom for the contraindication
   */
  diseaseStatus?: CodeableConcept;
  /* 
   * A comorbidity (concurrent condition) or coinfection
   */
  comorbidity?: Array<CodeableConcept>;
  /* 
   * Information about the use of the medicinal product in relation to other therapies as part of the indication
   */
  therapeuticIndication?: Array<Reference>;
  /* 
   * Information about the use of the medicinal product in relation to other therapies described as part of the indication
   */
  otherTherapy?: Array<MedicinalProductContraindicationOtherTherapy>;
  /* 
   * The population group to which this applies
   */
  population?: Array<Population>;
}

export interface MedicinalProductIndicationOtherTherapy {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The type of relationship between the medicinal product indication or contraindication and another therapy
   */
  therapyRelationshipType: CodeableConcept;
  /* 
   * Reference to a specific medication (active substance, medicinal product or class of products) as part of an indication or contraindication
   */
  medicationCodeableConcept?: CodeableConcept;
  /* 
   * Reference to a specific medication (active substance, medicinal product or class of products) as part of an indication or contraindication
   */
  medicationReference?: Reference;
}
export interface MedicinalProductIndication {
resourceType: "MedicinalProductIndication"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The medication for which this is an indication
   */
  subject?: Array<Reference>;
  /* 
   * The disease, symptom or procedure that is the indication for treatment
   */
  diseaseSymptomProcedure?: CodeableConcept;
  /* 
   * The status of the disease or symptom for which the indication applies
   */
  diseaseStatus?: CodeableConcept;
  /* 
   * Comorbidity (concurrent condition) or co-infection as part of the indication
   */
  comorbidity?: Array<CodeableConcept>;
  /* 
   * The intended effect, aim or strategy to be achieved by the indication
   */
  intendedEffect?: CodeableConcept;
  /* 
   * Timing or duration information as part of the indication
   */
  duration?: Quantity;
  /* 
   * Information about the use of the medicinal product in relation to other therapies described as part of the indication
   */
  otherTherapy?: Array<MedicinalProductIndicationOtherTherapy>;
  /* 
   * Describe the undesirable effects of the medicinal product
   */
  undesirableEffect?: Array<Reference>;
  /* 
   * The population group to which this applies
   */
  population?: Array<Population>;
}

export interface MedicinalProductIngredientSpecifiedSubstanceStrengthReferenceStrength {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Relevant reference substance
   */
  substance?: CodeableConcept;
  /* 
   * Strength expressed in terms of a reference substance
   */
  strength: Ratio;
  /* 
   * Strength expressed in terms of a reference substance
   */
  strengthLowLimit?: Ratio;
  /* 
   * For when strength is measured at a particular point or distance
   */
  measurementPoint?: string;
  /* 
   * The country or countries for which the strength range applies
   */
  country?: Array<CodeableConcept>;
}
export interface MedicinalProductIngredientSpecifiedSubstanceStrength {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The quantity of substance in the unit of presentation, or in the volume (or mass) of the single pharmaceutical product or manufactured item
   */
  presentation: Ratio;
  /* 
   * A lower limit for the quantity of substance in the unit of presentation. For use when there is a range of strengths, this is the lower limit, with the presentation attribute becoming the upper limit
   */
  presentationLowLimit?: Ratio;
  /* 
   * The strength per unitary volume (or mass)
   */
  concentration?: Ratio;
  /* 
   * A lower limit for the strength per unitary volume (or mass), for when there is a range. The concentration attribute then becomes the upper limit
   */
  concentrationLowLimit?: Ratio;
  /* 
   * For when strength is measured at a particular point or distance
   */
  measurementPoint?: string;
  /* 
   * The country or countries for which the strength range applies
   */
  country?: Array<CodeableConcept>;
  /* 
   * Strength expressed in terms of a reference substance
   */
  referenceStrength?: Array<MedicinalProductIngredientSpecifiedSubstanceStrengthReferenceStrength>;
}
export interface MedicinalProductIngredientSpecifiedSubstance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The specified substance
   */
  code: CodeableConcept;
  /* 
   * The group of specified substance, e.g. group 1 to 4
   */
  group: CodeableConcept;
  /* 
   * Confidentiality level of the specified substance as the ingredient
   */
  confidentiality?: CodeableConcept;
  /* 
   * Quantity of the substance or specified substance present in the manufactured item or pharmaceutical product
   */
  strength?: Array<MedicinalProductIngredientSpecifiedSubstanceStrength>;
}
export interface MedicinalProductIngredientSubstance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The ingredient substance
   */
  code: CodeableConcept;
  /* 
   * Quantity of the substance or specified substance present in the manufactured item or pharmaceutical product
   */
  strength?: MedicinalProductIngredientSpecifiedSubstanceStrength;
}
export interface MedicinalProductIngredient {
resourceType: "MedicinalProductIngredient"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifier for the ingredient
   */
  identifier?: Identifier;
  /* 
   * Ingredient role e.g. Active ingredient, excipient
   */
  role: CodeableConcept;
  /* 
   * If the ingredient is a known or suspected allergen
   */
  allergenicIndicator?: boolean;
  /* 
   * Manufacturer of this Ingredient
   */
  manufacturer?: Array<Reference>;
  /* 
   * A specified substance that comprises this ingredient
   */
  specifiedSubstance?: Array<MedicinalProductIngredientSpecifiedSubstance>;
  /* 
   * The ingredient substance
   */
  substance?: MedicinalProductIngredientSubstance;
}

export interface MedicinalProductInteractionInteractant {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The specific medication, food or laboratory test that interacts
   */
  itemReference?: Reference;
  /* 
   * The specific medication, food or laboratory test that interacts
   */
  itemCodeableConcept?: CodeableConcept;
}
export interface MedicinalProductInteraction {
resourceType: "MedicinalProductInteraction"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The medication for which this is a described interaction
   */
  subject?: Array<Reference>;
  /* 
   * The interaction described
   */
  description?: string;
  /* 
   * The specific medication, food or laboratory test that interacts
   */
  interactant?: Array<MedicinalProductInteractionInteractant>;
  /* 
   * The type of the interaction e.g. drug-drug interaction, drug-food interaction, drug-lab test interaction
   */
  type?: CodeableConcept;
  /* 
   * The effect of the interaction, for example "reduced gastric absorption of primary medication"
   */
  effect?: CodeableConcept;
  /* 
   * The incidence of the interaction, e.g. theoretical, observed
   */
  incidence?: CodeableConcept;
  /* 
   * Actions for managing the interaction
   */
  management?: CodeableConcept;
}

export interface MedicinalProductManufactured {
resourceType: "MedicinalProductManufactured"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Dose form as manufactured and before any transformation into the pharmaceutical product
   */
  manufacturedDoseForm: CodeableConcept;
  /* 
   * The “real world” units in which the quantity of the manufactured item is described
   */
  unitOfPresentation?: CodeableConcept;
  /* 
   * The quantity or "count number" of the manufactured item
   */
  quantity: Quantity;
  /* 
   * Manufacturer of the item (Note that this should be named "manufacturer" but it currently causes technical issues)
   */
  manufacturer?: Array<Reference>;
  /* 
   * Ingredient
   */
  ingredient?: Array<Reference>;
  /* 
   * Dimensions, color etc.
   */
  physicalCharacteristics?: ProdCharacteristic;
  /* 
   * Other codeable characteristics
   */
  otherCharacteristics?: Array<CodeableConcept>;
}

export interface MedicinalProductPackagedBatchIdentifier {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A number appearing on the outer packaging of a specific batch
   */
  outerPackaging: Identifier;
  /* 
   * A number appearing on the immediate packaging (and not the outer packaging)
   */
  immediatePackaging?: Identifier;
}
export interface MedicinalProductPackagedPackageItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Including possibly Data Carrier Identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * The physical type of the container of the medicine
   */
  type: CodeableConcept;
  /* 
   * The quantity of this package in the medicinal product, at the current level of packaging. The outermost is always 1
   */
  quantity: Quantity;
  /* 
   * Material type of the package item
   */
  material?: Array<CodeableConcept>;
  /* 
   * A possible alternate material for the packaging
   */
  alternateMaterial?: Array<CodeableConcept>;
  /* 
   * A device accompanying a medicinal product
   */
  device?: Array<Reference>;
  /* 
   * The manufactured item as contained in the packaged medicinal product
   */
  manufacturedItem?: Array<Reference>;
  /* 
   * Allows containers within containers
   */
  packageItem?: MedicinalProductPackagedPackageItem;
  /* 
   * Dimensions, color etc.
   */
  physicalCharacteristics?: ProdCharacteristic;
  /* 
   * Other codeable characteristics
   */
  otherCharacteristics?: Array<CodeableConcept>;
  /* 
   * Shelf Life and storage information
   */
  shelfLifeStorage?: Array<ProductShelfLife>;
  /* 
   * Manufacturer of this Package Item
   */
  manufacturer?: Array<Reference>;
}
export interface MedicinalProductPackaged {
resourceType: "MedicinalProductPackaged"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * The product with this is a pack for
   */
  subject?: Array<Reference>;
  /* 
   * Textual description
   */
  description?: string;
  /* 
   * The legal status of supply of the medicinal product as classified by the regulator
   */
  legalStatusOfSupply?: CodeableConcept;
  /* 
   * Marketing information
   */
  marketingStatus?: Array<MarketingStatus>;
  /* 
   * Manufacturer of this Package Item
   */
  marketingAuthorization?: Reference;
  /* 
   * Manufacturer of this Package Item
   */
  manufacturer?: Array<Reference>;
  /* 
   * Batch numbering
   */
  batchIdentifier?: Array<MedicinalProductPackagedBatchIdentifier>;
  /* 
   * A packaging item, as a contained for medicine, possibly with other packaging items within
   */
  packageItem: Array<MedicinalProductPackagedPackageItem>;
}

export interface MedicinalProductPharmaceuticalCharacteristics {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A coded characteristic
   */
  code: CodeableConcept;
  /* 
   * The status of characteristic e.g. assigned or pending
   */
  status?: CodeableConcept;
}
export interface MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpeciesWithdrawalPeriod {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Coded expression for the type of tissue for which the withdrawal period applues, e.g. meat, milk
   */
  tissue: CodeableConcept;
  /* 
   * A value for the time
   */
  value: Quantity;
  /* 
   * Extra information about the withdrawal period
   */
  supportingInformation?: string;
}
export interface MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpecies {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Coded expression for the species
   */
  code: CodeableConcept;
  /* 
   * A species specific time during which consumption of animal product is not appropriate
   */
  withdrawalPeriod?: Array<MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpeciesWithdrawalPeriod>;
}
export interface MedicinalProductPharmaceuticalRouteOfAdministration {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Coded expression for the route
   */
  code: CodeableConcept;
  /* 
   * The first dose (dose quantity) administered in humans can be specified, for a product under investigation, using a numerical value and its unit of measurement
   */
  firstDose?: Quantity;
  /* 
   * The maximum single dose that can be administered as per the protocol of a clinical trial can be specified using a numerical value and its unit of measurement
   */
  maxSingleDose?: Quantity;
  /* 
   * The maximum dose per day (maximum dose quantity to be administered in any one 24-h period) that can be administered as per the protocol referenced in the clinical trial authorisation
   */
  maxDosePerDay?: Quantity;
  /* 
   * The maximum dose per treatment period that can be administered as per the protocol referenced in the clinical trial authorisation
   */
  maxDosePerTreatmentPeriod?: Ratio;
  /* 
   * The maximum treatment period during which an Investigational Medicinal Product can be administered as per the protocol referenced in the clinical trial authorisation
   */
  maxTreatmentPeriod?: Duration;
  /* 
   * A species for which this route applies
   */
  targetSpecies?: Array<MedicinalProductPharmaceuticalRouteOfAdministrationTargetSpecies>;
}
export interface MedicinalProductPharmaceutical {
resourceType: "MedicinalProductPharmaceutical"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * An identifier for the pharmaceutical medicinal product
   */
  identifier?: Array<Identifier>;
  /* 
   * The administrable dose form, after necessary reconstitution
   */
  administrableDoseForm: CodeableConcept;
  /* 
   * Todo
   */
  unitOfPresentation?: CodeableConcept;
  /* 
   * Ingredient
   */
  ingredient?: Array<Reference>;
  /* 
   * Accompanying device
   */
  device?: Array<Reference>;
  /* 
   * Characteristics e.g. a products onset of action
   */
  characteristics?: Array<MedicinalProductPharmaceuticalCharacteristics>;
  /* 
   * The path by which the pharmaceutical product is taken into or makes contact with the body
   */
  routeOfAdministration: Array<MedicinalProductPharmaceuticalRouteOfAdministration>;
}

export interface MedicinalProductUndesirableEffect {
resourceType: "MedicinalProductUndesirableEffect"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The medication for which this is an indication
   */
  subject?: Array<Reference>;
  /* 
   * The symptom, condition or undesirable effect
   */
  symptomConditionEffect?: CodeableConcept;
  /* 
   * Classification of the effect
   */
  classification?: CodeableConcept;
  /* 
   * The frequency of occurrence of the effect
   */
  frequencyOfOccurrence?: CodeableConcept;
  /* 
   * The population group to which this applies
   */
  population?: Array<Population>;
}

export interface MessageDefinitionFocus {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of resource
   */
  code: code;
  /* 
   * Profile that must be adhered to by focus
   */
  profile?: canonical;
  /* 
   * Minimum number of focuses of this type
   */
  min: unsignedInt;
  /* 
   * Maximum number of focuses of this type
   */
  max?: string;
}
export interface MessageDefinitionAllowedResponse {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Reference to allowed message definition response
   */
  message: canonical;
  /* 
   * When should this response be used
   */
  situation?: markdown;
}
export interface MessageDefinition {
resourceType: "MessageDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for a given MessageDefinition
   */
  url?: uri;
  /* 
   * Primary key for the message definition on a given server
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the message definition
   */
  version?: string;
  /* 
   * Name for this message definition (computer friendly)
   */
  name?: string;
  /* 
   * Name for this message definition (human friendly)
   */
  title?: string;
  /* 
   * Takes the place of
   */
  replaces?: Array<canonical>;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the message definition
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for message definition (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this message definition is defined
   */
  purpose?: markdown;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * Definition this one is based on
   */
  base?: canonical;
  /* 
   * Protocol/workflow this is part of
   */
  parent?: Array<canonical>;
  /* 
   * Event code  or link to the EventDefinition
   */
  eventCoding?: Coding;
  /* 
   * Event code  or link to the EventDefinition
   */
  eventUri?: uri;
  /* 
   * consequence | currency | notification
   */
  category?: code;
  /* 
   * Resource(s) that are the subject of the event
   */
  focus?: Array<MessageDefinitionFocus>;
  /* 
   * always | on-error | never | on-success
   */
  responseRequired?: code;
  /* 
   * Responses to this message
   */
  allowedResponse?: Array<MessageDefinitionAllowedResponse>;
  /* 
   * Canonical reference to a GraphDefinition
   */
  graph?: Array<canonical>;
}

export interface MessageHeaderDestination {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name of system
   */
  name?: string;
  /* 
   * Particular delivery destination within the destination
   */
  target?: Reference;
  /* 
   * Actual destination address or id
   */
  endpoint: url;
  /* 
   * Intended "real-world" recipient for the data
   */
  receiver?: Reference;
}
export interface MessageHeaderSource {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name of system
   */
  name?: string;
  /* 
   * Name of software running the system
   */
  software?: string;
  /* 
   * Version of software running
   */
  version?: string;
  /* 
   * Human contact for problems
   */
  contact?: ContactPoint;
  /* 
   * Actual message source address or id
   */
  endpoint: url;
}
export interface MessageHeaderResponse {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Id of original message
   */
  identifier: id;
  /* 
   * ok | transient-error | fatal-error
   */
  code: code;
  /* 
   * Specific list of hints/warnings/errors
   */
  details?: Reference;
}
export interface MessageHeader {
resourceType: "MessageHeader"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code for the event this message represents or link to event definition
   */
  eventCoding?: Coding;
  /* 
   * Code for the event this message represents or link to event definition
   */
  eventUri?: uri;
  /* 
   * Message destination application(s)
   */
  destination?: Array<MessageHeaderDestination>;
  /* 
   * Real world sender of the message
   */
  sender?: Reference;
  /* 
   * The source of the data entry
   */
  enterer?: Reference;
  /* 
   * The source of the decision
   */
  author?: Reference;
  /* 
   * Message source application
   */
  source: MessageHeaderSource;
  /* 
   * Final responsibility for event
   */
  responsible?: Reference;
  /* 
   * Cause of event
   */
  reason?: CodeableConcept;
  /* 
   * If this is a reply to prior message
   */
  response?: MessageHeaderResponse;
  /* 
   * The actual content of the message
   */
  focus?: Array<Reference>;
  /* 
   * Link to the definition for this message
   */
  definition?: canonical;
}

export interface MolecularSequenceReferenceSeq {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Chromosome containing genetic finding
   */
  chromosome?: CodeableConcept;
  /* 
   * The Genome Build used for reference, following GRCh build versions e.g. 'GRCh 37'
   */
  genomeBuild?: string;
  /* 
   * sense | antisense
   */
  orientation?: code;
  /* 
   * Reference identifier
   */
  referenceSeqId?: CodeableConcept;
  /* 
   * A pointer to another MolecularSequence entity as reference sequence
   */
  referenceSeqPointer?: Reference;
  /* 
   * A string to represent reference sequence
   */
  referenceSeqString?: string;
  /* 
   * watson | crick
   */
  strand?: code;
  /* 
   * Start position of the window on the  reference sequence
   */
  windowStart?: integer;
  /* 
   * End position of the window on the reference sequence
   */
  windowEnd?: integer;
}
export interface MolecularSequenceVariant {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Start position of the variant on the  reference sequence
   */
  start?: integer;
  /* 
   * End position of the variant on the reference sequence
   */
  end?: integer;
  /* 
   * Allele that was observed
   */
  observedAllele?: string;
  /* 
   * Allele in the reference sequence
   */
  referenceAllele?: string;
  /* 
   * Extended CIGAR string for aligning the sequence with reference bases
   */
  cigar?: string;
  /* 
   * Pointer to observed variant information
   */
  variantPointer?: Reference;
}
export interface MolecularSequenceQualityRoc {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Genotype quality score
   */
  score?: Array<integer>;
  /* 
   * Roc score true positive numbers
   */
  numTP?: Array<integer>;
  /* 
   * Roc score false positive numbers
   */
  numFP?: Array<integer>;
  /* 
   * Roc score false negative numbers
   */
  numFN?: Array<integer>;
  /* 
   * Precision of the GQ score
   */
  precision?: Array<decimal>;
  /* 
   * Sensitivity of the GQ score
   */
  sensitivity?: Array<decimal>;
  /* 
   * FScore of the GQ score
   */
  fMeasure?: Array<decimal>;
}
export interface MolecularSequenceQuality {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * indel | snp | unknown
   */
  type: code;
  /* 
   * Standard sequence for comparison
   */
  standardSequence?: CodeableConcept;
  /* 
   * Start position of the sequence
   */
  start?: integer;
  /* 
   * End position of the sequence
   */
  end?: integer;
  /* 
   * Quality score for the comparison
   */
  score?: Quantity;
  /* 
   * Method to get quality
   */
  method?: CodeableConcept;
  /* 
   * True positives from the perspective of the truth data
   */
  truthTP?: decimal;
  /* 
   * True positives from the perspective of the query data
   */
  queryTP?: decimal;
  /* 
   * False negatives
   */
  truthFN?: decimal;
  /* 
   * False positives
   */
  queryFP?: decimal;
  /* 
   * False positives where the non-REF alleles in the Truth and Query Call Sets match
   */
  gtFP?: decimal;
  /* 
   * Precision of comparison
   */
  precision?: decimal;
  /* 
   * Recall of comparison
   */
  recall?: decimal;
  /* 
   * F-score
   */
  fScore?: decimal;
  /* 
   * Receiver Operator Characteristic (ROC) Curve
   */
  roc?: MolecularSequenceQualityRoc;
}
export interface MolecularSequenceRepository {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * directlink | openapi | login | oauth | other
   */
  type: code;
  /* 
   * URI of the repository
   */
  url?: uri;
  /* 
   * Repository's name
   */
  name?: string;
  /* 
   * Id of the dataset that used to call for dataset in repository
   */
  datasetId?: string;
  /* 
   * Id of the variantset that used to call for variantset in repository
   */
  variantsetId?: string;
  /* 
   * Id of the read
   */
  readsetId?: string;
}
export interface MolecularSequenceStructureVariantOuter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Structural variant outer start
   */
  start?: integer;
  /* 
   * Structural variant outer end
   */
  end?: integer;
}
export interface MolecularSequenceStructureVariantInner {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Structural variant inner start
   */
  start?: integer;
  /* 
   * Structural variant inner end
   */
  end?: integer;
}
export interface MolecularSequenceStructureVariant {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Structural variant change type
   */
  variantType?: CodeableConcept;
  /* 
   * Does the structural variant have base pair resolution breakpoints?
   */
  exact?: boolean;
  /* 
   * Structural variant length
   */
  length?: integer;
  /* 
   * Structural variant outer
   */
  outer?: MolecularSequenceStructureVariantOuter;
  /* 
   * Structural variant inner
   */
  inner?: MolecularSequenceStructureVariantInner;
}
export interface MolecularSequence {
resourceType: "MolecularSequence"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique ID for this particular sequence. This is a FHIR-defined id
   */
  identifier?: Array<Identifier>;
  /* 
   * aa | dna | rna
   */
  type?: code;
  /* 
   * Base number of coordinate system (0 for 0-based numbering or coordinates, inclusive start, exclusive end, 1 for 1-based numbering, inclusive start, inclusive end)
   */
  coordinateSystem: integer;
  /* 
   * Who and/or what this is about
   */
  patient?: Reference;
  /* 
   * Specimen used for sequencing
   */
  specimen?: Reference;
  /* 
   * The method for sequencing
   */
  device?: Reference;
  /* 
   * Who should be responsible for test result
   */
  performer?: Reference;
  /* 
   * The number of copies of the sequence of interest.  (RNASeq)
   */
  quantity?: Quantity;
  /* 
   * A sequence used as reference
   */
  referenceSeq?: MolecularSequenceReferenceSeq;
  /* 
   * Variant in sequence
   */
  variant?: Array<MolecularSequenceVariant>;
  /* 
   * Sequence that was observed
   */
  observedSeq?: string;
  /* 
   * An set of value as quality of sequence
   */
  quality?: Array<MolecularSequenceQuality>;
  /* 
   * Average number of reads representing a given nucleotide in the reconstructed sequence
   */
  readCoverage?: integer;
  /* 
   * External repository which contains detailed report related with observedSeq in this resource
   */
  repository?: Array<MolecularSequenceRepository>;
  /* 
   * Pointer to next atomic sequence
   */
  pointer?: Array<Reference>;
  /* 
   * Structural variant
   */
  structureVariant?: Array<MolecularSequenceStructureVariant>;
}

export interface NamingSystemUniqueId {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * oid | uuid | uri | other
   */
  type: code;
  /* 
   * The unique identifier
   */
  value: string;
  /* 
   * Is this the id that should be used for this type
   */
  preferred?: boolean;
  /* 
   * Notes about identifier usage
   */
  comment?: string;
  /* 
   * When is identifier valid?
   */
  period?: Period;
}
export interface NamingSystem {
resourceType: "NamingSystem"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name for this naming system (computer friendly)
   */
  name: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * codesystem | identifier | root
   */
  kind: code;
  /* 
   * Date last changed
   */
  date: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Who maintains system namespace?
   */
  responsible?: string;
  /* 
   * e.g. driver,  provider,  patient, bank etc.
   */
  type?: CodeableConcept;
  /* 
   * Natural language description of the naming system
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for naming system (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * How/where is it used
   */
  usage?: string;
  /* 
   * Unique identifiers used for system
   */
  uniqueId: Array<NamingSystemUniqueId>;
}

export interface NutritionOrderOralDietNutrient {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of nutrient that is being modified
   */
  modifier?: CodeableConcept;
  /* 
   * Quantity of the specified nutrient
   */
  amount?: Quantity;
}
export interface NutritionOrderOralDietTexture {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code to indicate how to alter the texture of the foods, e.g. pureed
   */
  modifier?: CodeableConcept;
  /* 
   * Concepts that are used to identify an entity that is ingested for nutritional purposes
   */
  foodType?: CodeableConcept;
}
export interface NutritionOrderOralDiet {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of oral diet or diet restrictions that describe what can be consumed orally
   */
  type?: Array<CodeableConcept>;
  /* 
   * Scheduled frequency of diet
   */
  schedule?: Array<Timing>;
  /* 
   * Required  nutrient modifications
   */
  nutrient?: Array<NutritionOrderOralDietNutrient>;
  /* 
   * Required  texture modifications
   */
  texture?: Array<NutritionOrderOralDietTexture>;
  /* 
   * The required consistency of fluids and liquids provided to the patient
   */
  fluidConsistencyType?: Array<CodeableConcept>;
  /* 
   * Instructions or additional information about the oral diet
   */
  instruction?: string;
}
export interface NutritionOrderSupplement {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of supplement product requested
   */
  type?: CodeableConcept;
  /* 
   * Product or brand name of the nutritional supplement
   */
  productName?: string;
  /* 
   * Scheduled frequency of supplement
   */
  schedule?: Array<Timing>;
  /* 
   * Amount of the nutritional supplement
   */
  quantity?: Quantity;
  /* 
   * Instructions or additional information about the oral supplement
   */
  instruction?: string;
}
export interface NutritionOrderEnteralFormulaAdministration {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Scheduled frequency of enteral feeding
   */
  schedule?: Timing;
  /* 
   * The volume of formula to provide
   */
  quantity?: Quantity;
  /* 
   * Speed with which the formula is provided per period of time
   */
  rateQuantity?: Quantity;
  /* 
   * Speed with which the formula is provided per period of time
   */
  rateRatio?: Ratio;
}
export interface NutritionOrderEnteralFormula {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of enteral or infant formula
   */
  baseFormulaType?: CodeableConcept;
  /* 
   * Product or brand name of the enteral or infant formula
   */
  baseFormulaProductName?: string;
  /* 
   * Type of modular component to add to the feeding
   */
  additiveType?: CodeableConcept;
  /* 
   * Product or brand name of the modular additive
   */
  additiveProductName?: string;
  /* 
   * Amount of energy per specified volume that is required
   */
  caloricDensity?: Quantity;
  /* 
   * How the formula should enter the patient's gastrointestinal tract
   */
  routeofAdministration?: CodeableConcept;
  /* 
   * Formula feeding instruction as structured data
   */
  administration?: Array<NutritionOrderEnteralFormulaAdministration>;
  /* 
   * Upper limit on formula volume per unit of time
   */
  maxVolumeToDeliver?: Quantity;
  /* 
   * Formula feeding instructions expressed as text
   */
  administrationInstruction?: string;
}
export interface NutritionOrder {
resourceType: "NutritionOrder"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifiers assigned to this order
   */
  identifier?: Array<Identifier>;
  /* 
   * Instantiates FHIR protocol or definition
   */
  instantiatesCanonical?: Array<canonical>;
  /* 
   * Instantiates external protocol or definition
   */
  instantiatesUri?: Array<uri>;
  /* 
   * Instantiates protocol or definition
   */
  instantiates?: Array<uri>;
  /* 
   * draft | active | on-hold | revoked | completed | entered-in-error | unknown
   */
  status: code;
  /* 
   * proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option
   */
  intent: code;
  /* 
   * The person who requires the diet, formula or nutritional supplement
   */
  patient: Reference;
  /* 
   * The encounter associated with this nutrition order
   */
  encounter?: Reference;
  /* 
   * Date and time the nutrition order was requested
   */
  dateTime: dateTime;
  /* 
   * Who ordered the diet, formula or nutritional supplement
   */
  orderer?: Reference;
  /* 
   * List of the patient's food and nutrition-related allergies and intolerances
   */
  allergyIntolerance?: Array<Reference>;
  /* 
   * Order-specific modifier about the type of food that should be given
   */
  foodPreferenceModifier?: Array<CodeableConcept>;
  /* 
   * Order-specific modifier about the type of food that should not be given
   */
  excludeFoodModifier?: Array<CodeableConcept>;
  /* 
   * Oral diet components
   */
  oralDiet?: NutritionOrderOralDiet;
  /* 
   * Supplement components
   */
  supplement?: Array<NutritionOrderSupplement>;
  /* 
   * Enteral formula components
   */
  enteralFormula?: NutritionOrderEnteralFormula;
  /* 
   * Comments
   */
  note?: Array<Annotation>;
}

export interface ObservationReferenceRange {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Low Range, if relevant
   */
  low?: Quantity;
  /* 
   * High Range, if relevant
   */
  high?: Quantity;
  /* 
   * Reference range qualifier
   */
  type?: CodeableConcept;
  /* 
   * Reference range population
   */
  appliesTo?: Array<CodeableConcept>;
  /* 
   * Applicable age range, if relevant
   */
  age?: Range;
  /* 
   * Text based reference range in an observation
   */
  text?: string;
}
export interface ObservationComponent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of component observation (code / type)
   */
  code: CodeableConcept;
  /* 
   * Actual component result
   */
  valueQuantity?: Quantity;
  /* 
   * Actual component result
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * Actual component result
   */
  valueString?: string;
  /* 
   * Actual component result
   */
  valueBoolean?: boolean;
  /* 
   * Actual component result
   */
  valueInteger?: integer;
  /* 
   * Actual component result
   */
  valueRange?: Range;
  /* 
   * Actual component result
   */
  valueRatio?: Ratio;
  /* 
   * Actual component result
   */
  valueSampledData?: SampledData;
  /* 
   * Actual component result
   */
  valueTime?: time;
  /* 
   * Actual component result
   */
  valueDateTime?: dateTime;
  /* 
   * Actual component result
   */
  valuePeriod?: Period;
  /* 
   * Why the component result is missing
   */
  dataAbsentReason?: CodeableConcept;
  /* 
   * High, low, normal, etc.
   */
  interpretation?: Array<CodeableConcept>;
  /* 
   * Provides guide for interpretation of component result
   */
  referenceRange?: ObservationReferenceRange;
}
export interface Observation {
resourceType: "Observation"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for observation
   */
  identifier?: Array<Identifier>;
  /* 
   * Fulfills plan, proposal or order
   */
  basedOn?: Array<Reference>;
  /* 
   * Part of referenced event
   */
  partOf?: Array<Reference>;
  /* 
   * registered | preliminary | final | amended +
   */
  status: code;
  /* 
   * Classification of  type of observation
   */
  category?: Array<CodeableConcept>;
  /* 
   * Type of observation (code / type)
   */
  code: CodeableConcept;
  /* 
   * Who and/or what the observation is about
   */
  subject?: Reference;
  /* 
   * What the observation is about, when it is not about the subject of record
   */
  focus?: Array<Reference>;
  /* 
   * Healthcare event during which this observation is made
   */
  encounter?: Reference;
  /* 
   * Clinically relevant time/time-period for observation
   */
  effectiveDateTime?: dateTime;
  /* 
   * Clinically relevant time/time-period for observation
   */
  effectivePeriod?: Period;
  /* 
   * Clinically relevant time/time-period for observation
   */
  effectiveTiming?: Timing;
  /* 
   * Clinically relevant time/time-period for observation
   */
  effectiveInstant?: instant;
  /* 
   * Date/Time this version was made available
   */
  issued?: instant;
  /* 
   * Who is responsible for the observation
   */
  performer?: Array<Reference>;
  /* 
   * Actual result
   */
  valueQuantity?: Quantity;
  /* 
   * Actual result
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * Actual result
   */
  valueString?: string;
  /* 
   * Actual result
   */
  valueBoolean?: boolean;
  /* 
   * Actual result
   */
  valueInteger?: integer;
  /* 
   * Actual result
   */
  valueRange?: Range;
  /* 
   * Actual result
   */
  valueRatio?: Ratio;
  /* 
   * Actual result
   */
  valueSampledData?: SampledData;
  /* 
   * Actual result
   */
  valueTime?: time;
  /* 
   * Actual result
   */
  valueDateTime?: dateTime;
  /* 
   * Actual result
   */
  valuePeriod?: Period;
  /* 
   * Why the result is missing
   */
  dataAbsentReason?: CodeableConcept;
  /* 
   * High, low, normal, etc.
   */
  interpretation?: Array<CodeableConcept>;
  /* 
   * Comments about the observation
   */
  note?: Array<Annotation>;
  /* 
   * Observed body part
   */
  bodySite?: CodeableConcept;
  /* 
   * How it was done
   */
  method?: CodeableConcept;
  /* 
   * Specimen used for this observation
   */
  specimen?: Reference;
  /* 
   * (Measurement) Device
   */
  device?: Reference;
  /* 
   * Provides guide for interpretation
   */
  referenceRange?: Array<ObservationReferenceRange>;
  /* 
   * Related resource that belongs to the Observation group
   */
  hasMember?: Array<Reference>;
  /* 
   * Related measurements the observation is made from
   */
  derivedFrom?: Array<Reference>;
  /* 
   * Component results
   */
  component?: Array<ObservationComponent>;
}

export interface ObservationDefinitionQuantitativeDetails {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Customary unit for quantitative results
   */
  customaryUnit?: CodeableConcept;
  /* 
   * SI unit for quantitative results
   */
  unit?: CodeableConcept;
  /* 
   * SI to Customary unit conversion factor
   */
  conversionFactor?: decimal;
  /* 
   * Decimal precision of observation quantitative results
   */
  decimalPrecision?: integer;
}
export interface ObservationDefinitionQualifiedInterval {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * reference | critical | absolute
   */
  category?: code;
  /* 
   * The interval itself, for continuous or ordinal observations
   */
  range?: Range;
  /* 
   * Range context qualifier
   */
  context?: CodeableConcept;
  /* 
   * Targetted population of the range
   */
  appliesTo?: Array<CodeableConcept>;
  /* 
   * male | female | other | unknown
   */
  gender?: code;
  /* 
   * Applicable age range, if relevant
   */
  age?: Range;
  /* 
   * Applicable gestational age range, if relevant
   */
  gestationalAge?: Range;
  /* 
   * Condition associated with the reference range
   */
  condition?: string;
}
export interface ObservationDefinition {
resourceType: "ObservationDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Category of observation
   */
  category?: Array<CodeableConcept>;
  /* 
   * Type of observation (code / type)
   */
  code: CodeableConcept;
  /* 
   * Business identifier for this ObservationDefinition instance
   */
  identifier?: Array<Identifier>;
  /* 
   * Quantity | CodeableConcept | string | boolean | integer | Range | Ratio | SampledData | time | dateTime | Period
   */
  permittedDataType?: Array<code>;
  /* 
   * Multiple results allowed
   */
  multipleResultsAllowed?: boolean;
  /* 
   * Method used to produce the observation
   */
  method?: CodeableConcept;
  /* 
   * Preferred report name
   */
  preferredReportName?: string;
  /* 
   * Characteristics of quantitative results
   */
  quantitativeDetails?: ObservationDefinitionQuantitativeDetails;
  /* 
   * Qualified range for continuous and ordinal observation results
   */
  qualifiedInterval?: Array<ObservationDefinitionQualifiedInterval>;
  /* 
   * Value set of valid coded values for the observations conforming to this ObservationDefinition
   */
  validCodedValueSet?: Reference;
  /* 
   * Value set of normal coded values for the observations conforming to this ObservationDefinition
   */
  normalCodedValueSet?: Reference;
  /* 
   * Value set of abnormal coded values for the observations conforming to this ObservationDefinition
   */
  abnormalCodedValueSet?: Reference;
  /* 
   * Value set of critical coded values for the observations conforming to this ObservationDefinition
   */
  criticalCodedValueSet?: Reference;
}

export interface OperationDefinitionParameterBinding {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * required | extensible | preferred | example
   */
  strength: code;
  /* 
   * Source of value set
   */
  valueSet: canonical;
}
export interface OperationDefinitionParameterReferencedFrom {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Referencing parameter
   */
  source: string;
  /* 
   * Element id of reference
   */
  sourceId?: string;
}
export interface OperationDefinitionParameter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name in Parameters.parameter.name or in URL
   */
  name: code;
  /* 
   * in | out
   */
  use: code;
  /* 
   * Minimum Cardinality
   */
  min: integer;
  /* 
   * Maximum Cardinality (a number or *)
   */
  max: string;
  /* 
   * Description of meaning/use
   */
  documentation?: string;
  /* 
   * What type this parameter has
   */
  type?: code;
  /* 
   * If type is Reference | canonical, allowed targets
   */
  targetProfile?: Array<canonical>;
  /* 
   * number | date | string | token | reference | composite | quantity | uri | special
   */
  searchType?: code;
  /* 
   * ValueSet details if this is coded
   */
  binding?: OperationDefinitionParameterBinding;
  /* 
   * References to this parameter
   */
  referencedFrom?: Array<OperationDefinitionParameterReferencedFrom>;
  /* 
   * Parts of a nested Parameter
   */
  part?: OperationDefinitionParameter;
}
export interface OperationDefinitionOverload {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name of parameter to include in overload
   */
  parameterName?: Array<string>;
  /* 
   * Comments to go on overload
   */
  comment?: string;
}
export interface OperationDefinition {
resourceType: "OperationDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this operation definition, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Business version of the operation definition
   */
  version?: string;
  /* 
   * Name for this operation definition (computer friendly)
   */
  name: string;
  /* 
   * Name for this operation definition (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * operation | query
   */
  kind: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the operation definition
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for operation definition (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this operation definition is defined
   */
  purpose?: markdown;
  /* 
   * Whether content is changed by the operation
   */
  affectsState?: boolean;
  /* 
   * Name used to invoke the operation
   */
  code: code;
  /* 
   * Additional information about use
   */
  comment?: markdown;
  /* 
   * Marks this as a profile of the base
   */
  base?: canonical;
  /* 
   * Types this operation applies to
   */
  resource?: Array<code>;
  /* 
   * Invoke at the system level?
   */
  system: boolean;
  /* 
   * Invoke at the type level?
   */
  type: boolean;
  /* 
   * Invoke on an instance?
   */
  instance: boolean;
  /* 
   * Validation information for in parameters
   */
  inputProfile?: canonical;
  /* 
   * Validation information for out parameters
   */
  outputProfile?: canonical;
  /* 
   * Parameters for the operation/query
   */
  parameter?: Array<OperationDefinitionParameter>;
  /* 
   * Define overloaded variants for when  generating code
   */
  overload?: Array<OperationDefinitionOverload>;
}

export interface OperationOutcomeIssue {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * fatal | error | warning | information
   */
  severity: code;
  /* 
   * Error or warning code
   */
  code: code;
  /* 
   * Additional details about the error
   */
  details?: CodeableConcept;
  /* 
   * Additional diagnostic information about the issue
   */
  diagnostics?: string;
  /* 
   * Deprecated: Path of element(s) related to issue
   */
  location?: Array<string>;
  /* 
   * FHIRPath of element(s) related to issue
   */
  expression?: Array<string>;
}
export interface OperationOutcome {
resourceType: "OperationOutcome"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A single issue associated with the action
   */
  issue: Array<OperationOutcomeIssue>;
}

export interface OrganizationContact {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The type of contact
   */
  purpose?: CodeableConcept;
  /* 
   * A name associated with the contact
   */
  name?: HumanName;
  /* 
   * Contact details (telephone, email, etc.)  for a contact
   */
  telecom?: Array<ContactPoint>;
  /* 
   * Visiting or postal addresses for the contact
   */
  address?: Address;
}
export interface Organization {
resourceType: "Organization"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifies this organization  across multiple systems
   */
  identifier?: Array<Identifier>;
  /* 
   * Whether the organization's record is still in active use
   */
  active?: boolean;
  /* 
   * Kind of organization
   */
  type?: Array<CodeableConcept>;
  /* 
   * Name used for the organization
   */
  name?: string;
  /* 
   * A list of alternate names that the organization is known as, or was known as in the past
   */
  alias?: Array<string>;
  /* 
   * A contact detail for the organization
   */
  telecom?: Array<ContactPoint>;
  /* 
   * An address for the organization
   */
  address?: Array<Address>;
  /* 
   * The organization of which this organization forms a part
   */
  partOf?: Reference;
  /* 
   * Contact for the organization for a certain purpose
   */
  contact?: Array<OrganizationContact>;
  /* 
   * Technical endpoints providing access to services operated for the organization
   */
  endpoint?: Array<Reference>;
}

export interface OrganizationAffiliation {
resourceType: "OrganizationAffiliation"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifiers that are specific to this role
   */
  identifier?: Array<Identifier>;
  /* 
   * Whether this organization affiliation record is in active use
   */
  active?: boolean;
  /* 
   * The period during which the participatingOrganization is affiliated with the primary organization
   */
  period?: Period;
  /* 
   * Organization where the role is available
   */
  organization?: Reference;
  /* 
   * Organization that provides/performs the role (e.g. providing services or is a member of)
   */
  participatingOrganization?: Reference;
  /* 
   * Health insurance provider network in which the participatingOrganization provides the role's services (if defined) at the indicated locations (if defined)
   */
  network?: Array<Reference>;
  /* 
   * Definition of the role the participatingOrganization plays
   */
  code?: Array<CodeableConcept>;
  /* 
   * Specific specialty of the participatingOrganization in the context of the role
   */
  specialty?: Array<CodeableConcept>;
  /* 
   * The location(s) at which the role occurs
   */
  location?: Array<Reference>;
  /* 
   * Healthcare services provided through the role
   */
  healthcareService?: Array<Reference>;
  /* 
   * Contact details at the participatingOrganization relevant to this Affiliation
   */
  telecom?: Array<ContactPoint>;
  /* 
   * Technical endpoints providing access to services operated for this role
   */
  endpoint?: Array<Reference>;
}

export interface ParametersParameter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name from the definition
   */
  name: string;
  /* 
   * If parameter is a data type
   */
  valueBase64Binary?: base64Binary;
  /* 
   * If parameter is a data type
   */
  valueBoolean?: boolean;
  /* 
   * If parameter is a data type
   */
  valueCanonical?: canonical;
  /* 
   * If parameter is a data type
   */
  valueCode?: code;
  /* 
   * If parameter is a data type
   */
  valueDate?: date;
  /* 
   * If parameter is a data type
   */
  valueDateTime?: dateTime;
  /* 
   * If parameter is a data type
   */
  valueDecimal?: decimal;
  /* 
   * If parameter is a data type
   */
  valueId?: id;
  /* 
   * If parameter is a data type
   */
  valueInstant?: instant;
  /* 
   * If parameter is a data type
   */
  valueInteger?: integer;
  /* 
   * If parameter is a data type
   */
  valueMarkdown?: markdown;
  /* 
   * If parameter is a data type
   */
  valueOid?: oid;
  /* 
   * If parameter is a data type
   */
  valuePositiveInt?: positiveInt;
  /* 
   * If parameter is a data type
   */
  valueString?: string;
  /* 
   * If parameter is a data type
   */
  valueTime?: time;
  /* 
   * If parameter is a data type
   */
  valueUnsignedInt?: unsignedInt;
  /* 
   * If parameter is a data type
   */
  valueUri?: uri;
  /* 
   * If parameter is a data type
   */
  valueUrl?: url;
  /* 
   * If parameter is a data type
   */
  valueUuid?: uuid;
  /* 
   * If parameter is a data type
   */
  valueAddress?: Address;
  /* 
   * If parameter is a data type
   */
  valueAge?: Age;
  /* 
   * If parameter is a data type
   */
  valueAnnotation?: Annotation;
  /* 
   * If parameter is a data type
   */
  valueAttachment?: Attachment;
  /* 
   * If parameter is a data type
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * If parameter is a data type
   */
  valueCoding?: Coding;
  /* 
   * If parameter is a data type
   */
  valueContactPoint?: ContactPoint;
  /* 
   * If parameter is a data type
   */
  valueCount?: Count;
  /* 
   * If parameter is a data type
   */
  valueDistance?: Distance;
  /* 
   * If parameter is a data type
   */
  valueDuration?: Duration;
  /* 
   * If parameter is a data type
   */
  valueHumanName?: HumanName;
  /* 
   * If parameter is a data type
   */
  valueIdentifier?: Identifier;
  /* 
   * If parameter is a data type
   */
  valueMoney?: Money;
  /* 
   * If parameter is a data type
   */
  valuePeriod?: Period;
  /* 
   * If parameter is a data type
   */
  valueQuantity?: Quantity;
  /* 
   * If parameter is a data type
   */
  valueRange?: Range;
  /* 
   * If parameter is a data type
   */
  valueRatio?: Ratio;
  /* 
   * If parameter is a data type
   */
  valueReference?: Reference;
  /* 
   * If parameter is a data type
   */
  valueSampledData?: SampledData;
  /* 
   * If parameter is a data type
   */
  valueSignature?: Signature;
  /* 
   * If parameter is a data type
   */
  valueTiming?: Timing;
  /* 
   * If parameter is a data type
   */
  valueContactDetail?: ContactDetail;
  /* 
   * If parameter is a data type
   */
  valueContributor?: Contributor;
  /* 
   * If parameter is a data type
   */
  valueDataRequirement?: DataRequirement;
  /* 
   * If parameter is a data type
   */
  valueExpression?: Expression;
  /* 
   * If parameter is a data type
   */
  valueParameterDefinition?: ParameterDefinition;
  /* 
   * If parameter is a data type
   */
  valueRelatedArtifact?: RelatedArtifact;
  /* 
   * If parameter is a data type
   */
  valueTriggerDefinition?: TriggerDefinition;
  /* 
   * If parameter is a data type
   */
  valueUsageContext?: UsageContext;
  /* 
   * If parameter is a data type
   */
  valueDosage?: Dosage;
  /* 
   * If parameter is a data type
   */
  valueMeta?: Meta;
  /* 
   * If parameter is a whole resource
   */
  resource?: Resource;
  /* 
   * Named part of a multi-part parameter
   */
  part?: ParametersParameter;
}
export interface Parameters {
resourceType: "Parameters"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Operation Parameter
   */
  parameter?: Array<ParametersParameter>;
}

export interface PatientContact {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The kind of relationship
   */
  relationship?: Array<CodeableConcept>;
  /* 
   * A name associated with the contact person
   */
  name?: HumanName;
  /* 
   * A contact detail for the person
   */
  telecom?: Array<ContactPoint>;
  /* 
   * Address for the contact person
   */
  address?: Address;
  /* 
   * male | female | other | unknown
   */
  gender?: code;
  /* 
   * Organization that is associated with the contact
   */
  organization?: Reference;
  /* 
   * The period during which this contact person or organization is valid to be contacted relating to this patient
   */
  period?: Period;
}
export interface PatientCommunication {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The language which can be used to communicate with the patient about his or her health
   */
  language: CodeableConcept;
  /* 
   * Language preference indicator
   */
  preferred?: boolean;
}
export interface PatientLink {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The other patient or related person resource that the link refers to
   */
  other: Reference;
  /* 
   * replaced-by | replaces | refer | seealso
   */
  type: code;
}
export interface Patient {
resourceType: "Patient"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * An identifier for this patient
   */
  identifier?: Array<Identifier>;
  /* 
   * Whether this patient's record is in active use
   */
  active?: boolean;
  /* 
   * A name associated with the patient
   */
  name?: Array<HumanName>;
  /* 
   * A contact detail for the individual
   */
  telecom?: Array<ContactPoint>;
  /* 
   * male | female | other | unknown
   */
  gender?: code;
  /* 
   * The date of birth for the individual
   */
  birthDate?: date;
  /* 
   * Indicates if the individual is deceased or not
   */
  deceasedBoolean?: boolean;
  /* 
   * Indicates if the individual is deceased or not
   */
  deceasedDateTime?: dateTime;
  /* 
   * An address for the individual
   */
  address?: Array<Address>;
  /* 
   * Marital (civil) status of a patient
   */
  maritalStatus?: CodeableConcept;
  /* 
   * Whether patient is part of a multiple birth
   */
  multipleBirthBoolean?: boolean;
  /* 
   * Whether patient is part of a multiple birth
   */
  multipleBirthInteger?: integer;
  /* 
   * Image of the patient
   */
  photo?: Array<Attachment>;
  /* 
   * A contact party (e.g. guardian, partner, friend) for the patient
   */
  contact?: Array<PatientContact>;
  /* 
   * A language which may be used to communicate with the patient about his or her health
   */
  communication?: Array<PatientCommunication>;
  /* 
   * Patient's nominated primary care provider
   */
  generalPractitioner?: Array<Reference>;
  /* 
   * Organization that is the custodian of the patient record
   */
  managingOrganization?: Reference;
  /* 
   * Link to another patient resource that concerns the same actual person
   */
  link?: Array<PatientLink>;
}

export interface PaymentNotice {
resourceType: "PaymentNotice"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for the payment noctice
   */
  identifier?: Array<Identifier>;
  /* 
   * active | cancelled | draft | entered-in-error
   */
  status: code;
  /* 
   * Request reference
   */
  request?: Reference;
  /* 
   * Response reference
   */
  response?: Reference;
  /* 
   * Creation date
   */
  created: dateTime;
  /* 
   * Responsible practitioner
   */
  provider?: Reference;
  /* 
   * Payment reference
   */
  payment: Reference;
  /* 
   * Payment or clearing date
   */
  paymentDate?: date;
  /* 
   * Party being paid
   */
  payee?: Reference;
  /* 
   * Party being notified
   */
  recipient: Reference;
  /* 
   * Monetary amount of the payment
   */
  amount: Money;
  /* 
   * Issued or cleared Status of the payment
   */
  paymentStatus?: CodeableConcept;
}

export interface PaymentReconciliationDetail {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier of the payment detail
   */
  identifier?: Identifier;
  /* 
   * Business identifier of the prior payment detail
   */
  predecessor?: Identifier;
  /* 
   * Category of payment
   */
  type: CodeableConcept;
  /* 
   * Request giving rise to the payment
   */
  request?: Reference;
  /* 
   * Submitter of the request
   */
  submitter?: Reference;
  /* 
   * Response committing to a payment
   */
  response?: Reference;
  /* 
   * Date of commitment to pay
   */
  date?: date;
  /* 
   * Contact for the response
   */
  responsible?: Reference;
  /* 
   * Recipient of the payment
   */
  payee?: Reference;
  /* 
   * Amount allocated to this payable
   */
  amount?: Money;
}
export interface PaymentReconciliationProcessNote {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * display | print | printoper
   */
  type?: code;
  /* 
   * Note explanatory text
   */
  text?: string;
}
export interface PaymentReconciliation {
resourceType: "PaymentReconciliation"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for a payment reconciliation
   */
  identifier?: Array<Identifier>;
  /* 
   * active | cancelled | draft | entered-in-error
   */
  status: code;
  /* 
   * Period covered
   */
  period?: Period;
  /* 
   * Creation date
   */
  created: dateTime;
  /* 
   * Party generating payment
   */
  paymentIssuer?: Reference;
  /* 
   * Reference to requesting resource
   */
  request?: Reference;
  /* 
   * Responsible practitioner
   */
  requestor?: Reference;
  /* 
   * queued | complete | error | partial
   */
  outcome?: code;
  /* 
   * Disposition message
   */
  disposition?: string;
  /* 
   * When payment issued
   */
  paymentDate: date;
  /* 
   * Total amount of Payment
   */
  paymentAmount: Money;
  /* 
   * Business identifier for the payment
   */
  paymentIdentifier?: Identifier;
  /* 
   * Settlement particulars
   */
  detail?: Array<PaymentReconciliationDetail>;
  /* 
   * Printed form identifier
   */
  formCode?: CodeableConcept;
  /* 
   * Note concerning processing
   */
  processNote?: Array<PaymentReconciliationProcessNote>;
}

export interface PersonLink {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The resource to which this actual person is associated
   */
  target: Reference;
  /* 
   * level1 | level2 | level3 | level4
   */
  assurance?: code;
}
export interface Person {
resourceType: "Person"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A human identifier for this person
   */
  identifier?: Array<Identifier>;
  /* 
   * A name associated with the person
   */
  name?: Array<HumanName>;
  /* 
   * A contact detail for the person
   */
  telecom?: Array<ContactPoint>;
  /* 
   * male | female | other | unknown
   */
  gender?: code;
  /* 
   * The date on which the person was born
   */
  birthDate?: date;
  /* 
   * One or more addresses for the person
   */
  address?: Array<Address>;
  /* 
   * Image of the person
   */
  photo?: Attachment;
  /* 
   * The organization that is the custodian of the person record
   */
  managingOrganization?: Reference;
  /* 
   * This person's record is in active use
   */
  active?: boolean;
  /* 
   * Link to a resource that concerns the same actual person
   */
  link?: Array<PersonLink>;
}

export interface PlanDefinitionGoalTarget {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The parameter whose value is to be tracked
   */
  measure?: CodeableConcept;
  /* 
   * The target value to be achieved
   */
  detailQuantity?: Quantity;
  /* 
   * The target value to be achieved
   */
  detailRange?: Range;
  /* 
   * The target value to be achieved
   */
  detailCodeableConcept?: CodeableConcept;
  /* 
   * Reach goal within
   */
  due?: Duration;
}
export interface PlanDefinitionGoal {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * E.g. Treatment, dietary, behavioral
   */
  category?: CodeableConcept;
  /* 
   * Code or text describing the goal
   */
  description: CodeableConcept;
  /* 
   * high-priority | medium-priority | low-priority
   */
  priority?: CodeableConcept;
  /* 
   * When goal pursuit begins
   */
  start?: CodeableConcept;
  /* 
   * What does the goal address
   */
  addresses?: Array<CodeableConcept>;
  /* 
   * Supporting documentation for the goal
   */
  documentation?: Array<RelatedArtifact>;
  /* 
   * Target outcome for the goal
   */
  target?: Array<PlanDefinitionGoalTarget>;
}
export interface PlanDefinitionActionCondition {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * applicability | start | stop
   */
  kind: code;
  /* 
   * Boolean-valued expression
   */
  expression?: Expression;
}
export interface PlanDefinitionActionRelatedAction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * What action is this related to
   */
  actionId: id;
  /* 
   * before-start | before | before-end | concurrent-with-start | concurrent | concurrent-with-end | after-start | after | after-end
   */
  relationship: code;
  /* 
   * Time offset for the relationship
   */
  offsetDuration?: Duration;
  /* 
   * Time offset for the relationship
   */
  offsetRange?: Range;
}
export interface PlanDefinitionActionParticipant {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * patient | practitioner | related-person | device
   */
  type: code;
  /* 
   * E.g. Nurse, Surgeon, Parent
   */
  role?: CodeableConcept;
}
export interface PlanDefinitionActionDynamicValue {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The path to the element to be set dynamically
   */
  path?: string;
  /* 
   * An expression that provides the dynamic value for the customization
   */
  expression?: Expression;
}
export interface PlanDefinitionAction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * User-visible prefix for the action (e.g. 1. or A.)
   */
  prefix?: string;
  /* 
   * User-visible title
   */
  title?: string;
  /* 
   * Brief description of the action
   */
  description?: string;
  /* 
   * Static text equivalent of the action, used if the dynamic aspects cannot be interpreted by the receiving system
   */
  textEquivalent?: string;
  /* 
   * routine | urgent | asap | stat
   */
  priority?: code;
  /* 
   * Code representing the meaning of the action or sub-actions
   */
  code?: Array<CodeableConcept>;
  /* 
   * Why the action should be performed
   */
  reason?: Array<CodeableConcept>;
  /* 
   * Supporting documentation for the intended performer of the action
   */
  documentation?: Array<RelatedArtifact>;
  /* 
   * What goals this action supports
   */
  goalId?: Array<id>;
  /* 
   * Type of individual the action is focused on
   */
  subjectCodeableConcept?: CodeableConcept;
  /* 
   * Type of individual the action is focused on
   */
  subjectReference?: Reference;
  /* 
   * When the action should be triggered
   */
  trigger?: Array<TriggerDefinition>;
  /* 
   * Whether or not the action is applicable
   */
  condition?: Array<PlanDefinitionActionCondition>;
  /* 
   * Input data requirements
   */
  input?: Array<DataRequirement>;
  /* 
   * Output data definition
   */
  output?: Array<DataRequirement>;
  /* 
   * Relationship to another action
   */
  relatedAction?: Array<PlanDefinitionActionRelatedAction>;
  /* 
   * When the action should take place
   */
  timingDateTime?: dateTime;
  /* 
   * When the action should take place
   */
  timingAge?: Age;
  /* 
   * When the action should take place
   */
  timingPeriod?: Period;
  /* 
   * When the action should take place
   */
  timingDuration?: Duration;
  /* 
   * When the action should take place
   */
  timingRange?: Range;
  /* 
   * When the action should take place
   */
  timingTiming?: Timing;
  /* 
   * Who should participate in the action
   */
  participant?: Array<PlanDefinitionActionParticipant>;
  /* 
   * create | update | remove | fire-event
   */
  type?: CodeableConcept;
  /* 
   * visual-group | logical-group | sentence-group
   */
  groupingBehavior?: code;
  /* 
   * any | all | all-or-none | exactly-one | at-most-one | one-or-more
   */
  selectionBehavior?: code;
  /* 
   * must | could | must-unless-documented
   */
  requiredBehavior?: code;
  /* 
   * yes | no
   */
  precheckBehavior?: code;
  /* 
   * single | multiple
   */
  cardinalityBehavior?: code;
  /* 
   * Description of the activity to be performed
   */
  definitionCanonical?: canonical;
  /* 
   * Description of the activity to be performed
   */
  definitionUri?: uri;
  /* 
   * Transform to apply the template
   */
  transform?: canonical;
  /* 
   * Dynamic aspects of the definition
   */
  dynamicValue?: Array<PlanDefinitionActionDynamicValue>;
  /* 
   * A sub-action
   */
  action?: PlanDefinitionAction;
}
export interface PlanDefinition {
resourceType: "PlanDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this plan definition, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the plan definition
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the plan definition
   */
  version?: string;
  /* 
   * Name for this plan definition (computer friendly)
   */
  name?: string;
  /* 
   * Name for this plan definition (human friendly)
   */
  title?: string;
  /* 
   * Subordinate title of the plan definition
   */
  subtitle?: string;
  /* 
   * order-set | clinical-protocol | eca-rule | workflow-definition
   */
  type?: CodeableConcept;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Type of individual the plan definition is focused on
   */
  subjectCodeableConcept?: CodeableConcept;
  /* 
   * Type of individual the plan definition is focused on
   */
  subjectReference?: Reference;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the plan definition
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for plan definition (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this plan definition is defined
   */
  purpose?: markdown;
  /* 
   * Describes the clinical usage of the plan
   */
  usage?: string;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the plan definition was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the plan definition was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the plan definition is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * E.g. Education, Treatment, Assessment
   */
  topic?: Array<CodeableConcept>;
  /* 
   * Who authored the content
   */
  author?: Array<ContactDetail>;
  /* 
   * Who edited the content
   */
  editor?: Array<ContactDetail>;
  /* 
   * Who reviewed the content
   */
  reviewer?: Array<ContactDetail>;
  /* 
   * Who endorsed the content
   */
  endorser?: Array<ContactDetail>;
  /* 
   * Additional documentation, citations
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * Logic used by the plan definition
   */
  library?: Array<canonical>;
  /* 
   * What the plan is trying to accomplish
   */
  goal?: Array<PlanDefinitionGoal>;
  /* 
   * Action defined by the plan
   */
  action?: Array<PlanDefinitionAction>;
}

export interface PractitionerQualification {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * An identifier for this qualification for the practitioner
   */
  identifier?: Array<Identifier>;
  /* 
   * Coded representation of the qualification
   */
  code: CodeableConcept;
  /* 
   * Period during which the qualification is valid
   */
  period?: Period;
  /* 
   * Organization that regulates and issues the qualification
   */
  issuer?: Reference;
}
export interface Practitioner {
resourceType: "Practitioner"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * An identifier for the person as this agent
   */
  identifier?: Array<Identifier>;
  /* 
   * Whether this practitioner's record is in active use
   */
  active?: boolean;
  /* 
   * The name(s) associated with the practitioner
   */
  name?: Array<HumanName>;
  /* 
   * A contact detail for the practitioner (that apply to all roles)
   */
  telecom?: Array<ContactPoint>;
  /* 
   * Address(es) of the practitioner that are not role specific (typically home address)
   */
  address?: Array<Address>;
  /* 
   * male | female | other | unknown
   */
  gender?: code;
  /* 
   * The date  on which the practitioner was born
   */
  birthDate?: date;
  /* 
   * Image of the person
   */
  photo?: Array<Attachment>;
  /* 
   * Certification, licenses, or training pertaining to the provision of care
   */
  qualification?: Array<PractitionerQualification>;
  /* 
   * A language the practitioner can use in patient communication
   */
  communication?: Array<CodeableConcept>;
}

export interface PractitionerRoleAvailableTime {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * mon | tue | wed | thu | fri | sat | sun
   */
  daysOfWeek?: Array<code>;
  /* 
   * Always available? e.g. 24 hour service
   */
  allDay?: boolean;
  /* 
   * Opening time of day (ignored if allDay = true)
   */
  availableStartTime?: time;
  /* 
   * Closing time of day (ignored if allDay = true)
   */
  availableEndTime?: time;
}
export interface PractitionerRoleNotAvailable {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Reason presented to the user explaining why time not available
   */
  description: string;
  /* 
   * Service not available from this date
   */
  during?: Period;
}
export interface PractitionerRole {
resourceType: "PractitionerRole"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifiers that are specific to a role/location
   */
  identifier?: Array<Identifier>;
  /* 
   * Whether this practitioner role record is in active use
   */
  active?: boolean;
  /* 
   * The period during which the practitioner is authorized to perform in these role(s)
   */
  period?: Period;
  /* 
   * Practitioner that is able to provide the defined services for the organization
   */
  practitioner?: Reference;
  /* 
   * Organization where the roles are available
   */
  organization?: Reference;
  /* 
   * Roles which this practitioner may perform
   */
  code?: Array<CodeableConcept>;
  /* 
   * Specific specialty of the practitioner
   */
  specialty?: Array<CodeableConcept>;
  /* 
   * The location(s) at which this practitioner provides care
   */
  location?: Array<Reference>;
  /* 
   * The list of healthcare services that this worker provides for this role's Organization/Location(s)
   */
  healthcareService?: Array<Reference>;
  /* 
   * Contact details that are specific to the role/location/service
   */
  telecom?: Array<ContactPoint>;
  /* 
   * Times the Service Site is available
   */
  availableTime?: Array<PractitionerRoleAvailableTime>;
  /* 
   * Not available during this time due to provided reason
   */
  notAvailable?: Array<PractitionerRoleNotAvailable>;
  /* 
   * Description of availability exceptions
   */
  availabilityExceptions?: string;
  /* 
   * Technical endpoints providing access to services operated for the practitioner with this role
   */
  endpoint?: Array<Reference>;
}

export interface ProcedurePerformer {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of performance
   */
  function?: CodeableConcept;
  /* 
   * The reference to the practitioner
   */
  actor: Reference;
  /* 
   * Organization the device or practitioner was acting for
   */
  onBehalfOf?: Reference;
}
export interface ProcedureFocalDevice {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Kind of change to device
   */
  action?: CodeableConcept;
  /* 
   * Device that was changed
   */
  manipulated: Reference;
}
export interface Procedure {
resourceType: "Procedure"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Identifiers for this procedure
   */
  identifier?: Array<Identifier>;
  /* 
   * Instantiates FHIR protocol or definition
   */
  instantiatesCanonical?: Array<canonical>;
  /* 
   * Instantiates external protocol or definition
   */
  instantiatesUri?: Array<uri>;
  /* 
   * A request for this procedure
   */
  basedOn?: Array<Reference>;
  /* 
   * Part of referenced event
   */
  partOf?: Array<Reference>;
  /* 
   * preparation | in-progress | not-done | on-hold | stopped | completed | entered-in-error | unknown
   */
  status: code;
  /* 
   * Reason for current status
   */
  statusReason?: CodeableConcept;
  /* 
   * Classification of the procedure
   */
  category?: CodeableConcept;
  /* 
   * Identification of the procedure
   */
  code?: CodeableConcept;
  /* 
   * Who the procedure was performed on
   */
  subject: Reference;
  /* 
   * Encounter created as part of
   */
  encounter?: Reference;
  /* 
   * When the procedure was performed
   */
  performedDateTime?: dateTime;
  /* 
   * When the procedure was performed
   */
  performedPeriod?: Period;
  /* 
   * When the procedure was performed
   */
  performedString?: string;
  /* 
   * When the procedure was performed
   */
  performedAge?: Age;
  /* 
   * When the procedure was performed
   */
  performedRange?: Range;
  /* 
   * Who recorded the procedure
   */
  recorder?: Reference;
  /* 
   * Person who asserts this procedure
   */
  asserter?: Reference;
  /* 
   * The people who performed the procedure
   */
  performer?: Array<ProcedurePerformer>;
  /* 
   * Where the procedure happened
   */
  location?: Reference;
  /* 
   * Coded reason procedure performed
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * The justification that the procedure was performed
   */
  reasonReference?: Array<Reference>;
  /* 
   * Target body sites
   */
  bodySite?: Array<CodeableConcept>;
  /* 
   * The result of procedure
   */
  outcome?: CodeableConcept;
  /* 
   * Any report resulting from the procedure
   */
  report?: Array<Reference>;
  /* 
   * Complication following the procedure
   */
  complication?: Array<CodeableConcept>;
  /* 
   * A condition that is a result of the procedure
   */
  complicationDetail?: Array<Reference>;
  /* 
   * Instructions for follow up
   */
  followUp?: Array<CodeableConcept>;
  /* 
   * Additional information about the procedure
   */
  note?: Array<Annotation>;
  /* 
   * Manipulated, implanted, or removed device
   */
  focalDevice?: Array<ProcedureFocalDevice>;
  /* 
   * Items used during procedure
   */
  usedReference?: Array<Reference>;
  /* 
   * Coded items used during the procedure
   */
  usedCode?: Array<CodeableConcept>;
}

export interface ProvenanceAgent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * How the agent participated
   */
  type?: CodeableConcept;
  /* 
   * What the agents role was
   */
  role?: Array<CodeableConcept>;
  /* 
   * Who participated
   */
  who: Reference;
  /* 
   * Who the agent is representing
   */
  onBehalfOf?: Reference;
}
export interface ProvenanceEntity {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * derivation | revision | quotation | source | removal
   */
  role: code;
  /* 
   * Identity of entity
   */
  what: Reference;
  /* 
   * Entity is attributed to this agent
   */
  agent?: ProvenanceAgent;
}
export interface Provenance {
resourceType: "Provenance"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Target Reference(s) (usually version specific)
   */
  target: Array<Reference>;
  /* 
   * When the activity occurred
   */
  occurredPeriod?: Period;
  /* 
   * When the activity occurred
   */
  occurredDateTime?: dateTime;
  /* 
   * When the activity was recorded / updated
   */
  recorded: instant;
  /* 
   * Policy or plan the activity was defined by
   */
  policy?: Array<uri>;
  /* 
   * Where the activity occurred, if relevant
   */
  location?: Reference;
  /* 
   * Reason the activity is occurring
   */
  reason?: Array<CodeableConcept>;
  /* 
   * Activity that occurred
   */
  activity?: CodeableConcept;
  /* 
   * Actor involved
   */
  agent: Array<ProvenanceAgent>;
  /* 
   * An entity used in this activity
   */
  entity?: Array<ProvenanceEntity>;
  /* 
   * Signature on target
   */
  signature?: Array<Signature>;
}

export interface QuestionnaireItemEnableWhen {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Question that determines whether item is enabled
   */
  question: string;
  /* 
   * exists | = | != | > | < | >= | <=
   */
  operator: code;
  /* 
   * Value for question comparison based on operator
   */
  answerBoolean?: boolean;
  /* 
   * Value for question comparison based on operator
   */
  answerDecimal?: decimal;
  /* 
   * Value for question comparison based on operator
   */
  answerInteger?: integer;
  /* 
   * Value for question comparison based on operator
   */
  answerDate?: date;
  /* 
   * Value for question comparison based on operator
   */
  answerDateTime?: dateTime;
  /* 
   * Value for question comparison based on operator
   */
  answerTime?: time;
  /* 
   * Value for question comparison based on operator
   */
  answerString?: string;
  /* 
   * Value for question comparison based on operator
   */
  answerCoding?: Coding;
  /* 
   * Value for question comparison based on operator
   */
  answerQuantity?: Quantity;
  /* 
   * Value for question comparison based on operator
   */
  answerReference?: Reference;
}
export interface QuestionnaireItemAnswerOption {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Answer value
   */
  valueInteger?: integer;
  /* 
   * Answer value
   */
  valueDate?: date;
  /* 
   * Answer value
   */
  valueTime?: time;
  /* 
   * Answer value
   */
  valueString?: string;
  /* 
   * Answer value
   */
  valueCoding?: Coding;
  /* 
   * Answer value
   */
  valueReference?: Reference;
  /* 
   * Whether option is selected by default
   */
  initialSelected?: boolean;
}
export interface QuestionnaireItemInitial {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Actual value for initializing the question
   */
  valueBoolean?: boolean;
  /* 
   * Actual value for initializing the question
   */
  valueDecimal?: decimal;
  /* 
   * Actual value for initializing the question
   */
  valueInteger?: integer;
  /* 
   * Actual value for initializing the question
   */
  valueDate?: date;
  /* 
   * Actual value for initializing the question
   */
  valueDateTime?: dateTime;
  /* 
   * Actual value for initializing the question
   */
  valueTime?: time;
  /* 
   * Actual value for initializing the question
   */
  valueString?: string;
  /* 
   * Actual value for initializing the question
   */
  valueUri?: uri;
  /* 
   * Actual value for initializing the question
   */
  valueAttachment?: Attachment;
  /* 
   * Actual value for initializing the question
   */
  valueCoding?: Coding;
  /* 
   * Actual value for initializing the question
   */
  valueQuantity?: Quantity;
  /* 
   * Actual value for initializing the question
   */
  valueReference?: Reference;
}
export interface QuestionnaireItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique id for item in questionnaire
   */
  linkId: string;
  /* 
   * ElementDefinition - details for the item
   */
  definition?: uri;
  /* 
   * Corresponding concept for this item in a terminology
   */
  code?: Array<Coding>;
  /* 
   * E.g. "1(a)", "2.5.3"
   */
  prefix?: string;
  /* 
   * Primary text for the item
   */
  text?: string;
  /* 
   * group | display | boolean | decimal | integer | date | dateTime +
   */
  type: code;
  /* 
   * Only allow data when
   */
  enableWhen?: Array<QuestionnaireItemEnableWhen>;
  /* 
   * all | any
   */
  enableBehavior?: code;
  /* 
   * Whether the item must be included in data results
   */
  required?: boolean;
  /* 
   * Whether the item may repeat
   */
  repeats?: boolean;
  /* 
   * Don't allow human editing
   */
  readOnly?: boolean;
  /* 
   * No more than this many characters
   */
  maxLength?: integer;
  /* 
   * Valueset containing permitted answers
   */
  answerValueSet?: canonical;
  /* 
   * Permitted answer
   */
  answerOption?: Array<QuestionnaireItemAnswerOption>;
  /* 
   * Initial value(s) when item is first rendered
   */
  initial?: Array<QuestionnaireItemInitial>;
  /* 
   * Nested questionnaire items
   */
  item?: QuestionnaireItem;
}
export interface Questionnaire {
resourceType: "Questionnaire"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this questionnaire, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the questionnaire
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the questionnaire
   */
  version?: string;
  /* 
   * Name for this questionnaire (computer friendly)
   */
  name?: string;
  /* 
   * Name for this questionnaire (human friendly)
   */
  title?: string;
  /* 
   * Instantiates protocol or definition
   */
  derivedFrom?: Array<canonical>;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Resource that can be subject of QuestionnaireResponse
   */
  subjectType?: Array<code>;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the questionnaire
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for questionnaire (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this questionnaire is defined
   */
  purpose?: markdown;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the questionnaire was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the questionnaire was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the questionnaire is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * Concept that represents the overall questionnaire
   */
  code?: Array<Coding>;
  /* 
   * Questions and sections within the Questionnaire
   */
  item?: Array<QuestionnaireItem>;
}

export interface QuestionnaireResponseItemAnswer {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Single-valued answer to the question
   */
  valueBoolean?: boolean;
  /* 
   * Single-valued answer to the question
   */
  valueDecimal?: decimal;
  /* 
   * Single-valued answer to the question
   */
  valueInteger?: integer;
  /* 
   * Single-valued answer to the question
   */
  valueDate?: date;
  /* 
   * Single-valued answer to the question
   */
  valueDateTime?: dateTime;
  /* 
   * Single-valued answer to the question
   */
  valueTime?: time;
  /* 
   * Single-valued answer to the question
   */
  valueString?: string;
  /* 
   * Single-valued answer to the question
   */
  valueUri?: uri;
  /* 
   * Single-valued answer to the question
   */
  valueAttachment?: Attachment;
  /* 
   * Single-valued answer to the question
   */
  valueCoding?: Coding;
  /* 
   * Single-valued answer to the question
   */
  valueQuantity?: Quantity;
  /* 
   * Single-valued answer to the question
   */
  valueReference?: Reference;
  /* 
   * Nested groups and questions
   */
  item?: QuestionnaireResponseItem;
}
export interface QuestionnaireResponseItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Pointer to specific item from Questionnaire
   */
  linkId: string;
  /* 
   * ElementDefinition - details for the item
   */
  definition?: uri;
  /* 
   * Name for group or question text
   */
  text?: string;
  /* 
   * The response(s) to the question
   */
  answer?: Array<QuestionnaireResponseItemAnswer>;
  /* 
   * Nested questionnaire response items
   */
  item?: QuestionnaireResponseItem;
}
export interface QuestionnaireResponse {
resourceType: "QuestionnaireResponse"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique id for this set of answers
   */
  identifier?: Identifier;
  /* 
   * Request fulfilled by this QuestionnaireResponse
   */
  basedOn?: Array<Reference>;
  /* 
   * Part of this action
   */
  partOf?: Array<Reference>;
  /* 
   * Form being answered
   */
  questionnaire?: canonical;
  /* 
   * in-progress | completed | amended | entered-in-error | stopped
   */
  status: code;
  /* 
   * The subject of the questions
   */
  subject?: Reference;
  /* 
   * Encounter created as part of
   */
  encounter?: Reference;
  /* 
   * Date the answers were gathered
   */
  authored?: dateTime;
  /* 
   * Person who received and recorded the answers
   */
  author?: Reference;
  /* 
   * The person who answered the questions
   */
  source?: Reference;
  /* 
   * Groups and questions
   */
  item?: Array<QuestionnaireResponseItem>;
}

export interface RelatedPersonCommunication {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The language which can be used to communicate with the patient about his or her health
   */
  language: CodeableConcept;
  /* 
   * Language preference indicator
   */
  preferred?: boolean;
}
export interface RelatedPerson {
resourceType: "RelatedPerson"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A human identifier for this person
   */
  identifier?: Array<Identifier>;
  /* 
   * Whether this related person's record is in active use
   */
  active?: boolean;
  /* 
   * The patient this person is related to
   */
  patient: Reference;
  /* 
   * The nature of the relationship
   */
  relationship?: Array<CodeableConcept>;
  /* 
   * A name associated with the person
   */
  name?: Array<HumanName>;
  /* 
   * A contact detail for the person
   */
  telecom?: Array<ContactPoint>;
  /* 
   * male | female | other | unknown
   */
  gender?: code;
  /* 
   * The date on which the related person was born
   */
  birthDate?: date;
  /* 
   * Address where the related person can be contacted or visited
   */
  address?: Array<Address>;
  /* 
   * Image of the person
   */
  photo?: Array<Attachment>;
  /* 
   * Period of time that this relationship is considered valid
   */
  period?: Period;
  /* 
   * A language which may be used to communicate with about the patient's health
   */
  communication?: Array<RelatedPersonCommunication>;
}

export interface RequestGroupActionCondition {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * applicability | start | stop
   */
  kind: code;
  /* 
   * Boolean-valued expression
   */
  expression?: Expression;
}
export interface RequestGroupActionRelatedAction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * What action this is related to
   */
  actionId: id;
  /* 
   * before-start | before | before-end | concurrent-with-start | concurrent | concurrent-with-end | after-start | after | after-end
   */
  relationship: code;
  /* 
   * Time offset for the relationship
   */
  offsetDuration?: Duration;
  /* 
   * Time offset for the relationship
   */
  offsetRange?: Range;
}
export interface RequestGroupAction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * User-visible prefix for the action (e.g. 1. or A.)
   */
  prefix?: string;
  /* 
   * User-visible title
   */
  title?: string;
  /* 
   * Short description of the action
   */
  description?: string;
  /* 
   * Static text equivalent of the action, used if the dynamic aspects cannot be interpreted by the receiving system
   */
  textEquivalent?: string;
  /* 
   * routine | urgent | asap | stat
   */
  priority?: code;
  /* 
   * Code representing the meaning of the action or sub-actions
   */
  code?: Array<CodeableConcept>;
  /* 
   * Supporting documentation for the intended performer of the action
   */
  documentation?: Array<RelatedArtifact>;
  /* 
   * Whether or not the action is applicable
   */
  condition?: Array<RequestGroupActionCondition>;
  /* 
   * Relationship to another action
   */
  relatedAction?: Array<RequestGroupActionRelatedAction>;
  /* 
   * When the action should take place
   */
  timingDateTime?: dateTime;
  /* 
   * When the action should take place
   */
  timingAge?: Age;
  /* 
   * When the action should take place
   */
  timingPeriod?: Period;
  /* 
   * When the action should take place
   */
  timingDuration?: Duration;
  /* 
   * When the action should take place
   */
  timingRange?: Range;
  /* 
   * When the action should take place
   */
  timingTiming?: Timing;
  /* 
   * Who should perform the action
   */
  participant?: Array<Reference>;
  /* 
   * create | update | remove | fire-event
   */
  type?: CodeableConcept;
  /* 
   * visual-group | logical-group | sentence-group
   */
  groupingBehavior?: code;
  /* 
   * any | all | all-or-none | exactly-one | at-most-one | one-or-more
   */
  selectionBehavior?: code;
  /* 
   * must | could | must-unless-documented
   */
  requiredBehavior?: code;
  /* 
   * yes | no
   */
  precheckBehavior?: code;
  /* 
   * single | multiple
   */
  cardinalityBehavior?: code;
  /* 
   * The target of the action
   */
  resource?: Reference;
  /* 
   * Sub action
   */
  action?: RequestGroupAction;
}
export interface RequestGroup {
resourceType: "RequestGroup"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Instantiates FHIR protocol or definition
   */
  instantiatesCanonical?: Array<canonical>;
  /* 
   * Instantiates external protocol or definition
   */
  instantiatesUri?: Array<uri>;
  /* 
   * Fulfills plan, proposal, or order
   */
  basedOn?: Array<Reference>;
  /* 
   * Request(s) replaced by this request
   */
  replaces?: Array<Reference>;
  /* 
   * Composite request this is part of
   */
  groupIdentifier?: Identifier;
  /* 
   * draft | active | on-hold | revoked | completed | entered-in-error | unknown
   */
  status: code;
  /* 
   * proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option
   */
  intent: code;
  /* 
   * routine | urgent | asap | stat
   */
  priority?: code;
  /* 
   * What's being requested/ordered
   */
  code?: CodeableConcept;
  /* 
   * Who the request group is about
   */
  subject?: Reference;
  /* 
   * Created as part of
   */
  encounter?: Reference;
  /* 
   * When the request group was authored
   */
  authoredOn?: dateTime;
  /* 
   * Device or practitioner that authored the request group
   */
  author?: Reference;
  /* 
   * Why the request group is needed
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why the request group is needed
   */
  reasonReference?: Array<Reference>;
  /* 
   * Additional notes about the response
   */
  note?: Array<Annotation>;
  /* 
   * Proposed actions, if any
   */
  action?: Array<RequestGroupAction>;
}

export interface ResearchDefinition {
resourceType: "ResearchDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this research definition, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the research definition
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the research definition
   */
  version?: string;
  /* 
   * Name for this research definition (computer friendly)
   */
  name?: string;
  /* 
   * Name for this research definition (human friendly)
   */
  title?: string;
  /* 
   * Title for use in informal contexts
   */
  shortTitle?: string;
  /* 
   * Subordinate title of the ResearchDefinition
   */
  subtitle?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device
   */
  subjectCodeableConcept?: CodeableConcept;
  /* 
   * E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device
   */
  subjectReference?: Reference;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the research definition
   */
  description?: markdown;
  /* 
   * Used for footnotes or explanatory notes
   */
  comment?: Array<string>;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for research definition (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this research definition is defined
   */
  purpose?: markdown;
  /* 
   * Describes the clinical usage of the ResearchDefinition
   */
  usage?: string;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the research definition was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the research definition was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the research definition is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * The category of the ResearchDefinition, such as Education, Treatment, Assessment, etc.
   */
  topic?: Array<CodeableConcept>;
  /* 
   * Who authored the content
   */
  author?: Array<ContactDetail>;
  /* 
   * Who edited the content
   */
  editor?: Array<ContactDetail>;
  /* 
   * Who reviewed the content
   */
  reviewer?: Array<ContactDetail>;
  /* 
   * Who endorsed the content
   */
  endorser?: Array<ContactDetail>;
  /* 
   * Additional documentation, citations, etc.
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * Logic used by the ResearchDefinition
   */
  library?: Array<canonical>;
  /* 
   * What population?
   */
  population: Reference;
  /* 
   * What exposure?
   */
  exposure?: Reference;
  /* 
   * What alternative exposure state?
   */
  exposureAlternative?: Reference;
  /* 
   * What outcome?
   */
  outcome?: Reference;
}

export interface ResearchElementDefinitionCharacteristic {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * What code or expression defines members?
   */
  definitionCodeableConcept?: CodeableConcept;
  /* 
   * What code or expression defines members?
   */
  definitionCanonical?: canonical;
  /* 
   * What code or expression defines members?
   */
  definitionExpression?: Expression;
  /* 
   * What code or expression defines members?
   */
  definitionDataRequirement?: DataRequirement;
  /* 
   * What code/value pairs define members?
   */
  usageContext?: Array<UsageContext>;
  /* 
   * Whether the characteristic includes or excludes members
   */
  exclude?: boolean;
  /* 
   * What unit is the outcome described in?
   */
  unitOfMeasure?: CodeableConcept;
  /* 
   * What time period does the study cover
   */
  studyEffectiveDescription?: string;
  /* 
   * What time period does the study cover
   */
  studyEffectiveDateTime?: dateTime;
  /* 
   * What time period does the study cover
   */
  studyEffectivePeriod?: Period;
  /* 
   * What time period does the study cover
   */
  studyEffectiveDuration?: Duration;
  /* 
   * What time period does the study cover
   */
  studyEffectiveTiming?: Timing;
  /* 
   * Observation time from study start
   */
  studyEffectiveTimeFromStart?: Duration;
  /* 
   * mean | median | mean-of-mean | mean-of-median | median-of-mean | median-of-median
   */
  studyEffectiveGroupMeasure?: code;
  /* 
   * What time period do participants cover
   */
  participantEffectiveDescription?: string;
  /* 
   * What time period do participants cover
   */
  participantEffectiveDateTime?: dateTime;
  /* 
   * What time period do participants cover
   */
  participantEffectivePeriod?: Period;
  /* 
   * What time period do participants cover
   */
  participantEffectiveDuration?: Duration;
  /* 
   * What time period do participants cover
   */
  participantEffectiveTiming?: Timing;
  /* 
   * Observation time from study start
   */
  participantEffectiveTimeFromStart?: Duration;
  /* 
   * mean | median | mean-of-mean | mean-of-median | median-of-mean | median-of-median
   */
  participantEffectiveGroupMeasure?: code;
}
export interface ResearchElementDefinition {
resourceType: "ResearchElementDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this research element definition, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the research element definition
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the research element definition
   */
  version?: string;
  /* 
   * Name for this research element definition (computer friendly)
   */
  name?: string;
  /* 
   * Name for this research element definition (human friendly)
   */
  title?: string;
  /* 
   * Title for use in informal contexts
   */
  shortTitle?: string;
  /* 
   * Subordinate title of the ResearchElementDefinition
   */
  subtitle?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device
   */
  subjectCodeableConcept?: CodeableConcept;
  /* 
   * E.g. Patient, Practitioner, RelatedPerson, Organization, Location, Device
   */
  subjectReference?: Reference;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the research element definition
   */
  description?: markdown;
  /* 
   * Used for footnotes or explanatory notes
   */
  comment?: Array<string>;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for research element definition (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this research element definition is defined
   */
  purpose?: markdown;
  /* 
   * Describes the clinical usage of the ResearchElementDefinition
   */
  usage?: string;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the research element definition was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the research element definition was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the research element definition is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * The category of the ResearchElementDefinition, such as Education, Treatment, Assessment, etc.
   */
  topic?: Array<CodeableConcept>;
  /* 
   * Who authored the content
   */
  author?: Array<ContactDetail>;
  /* 
   * Who edited the content
   */
  editor?: Array<ContactDetail>;
  /* 
   * Who reviewed the content
   */
  reviewer?: Array<ContactDetail>;
  /* 
   * Who endorsed the content
   */
  endorser?: Array<ContactDetail>;
  /* 
   * Additional documentation, citations, etc.
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * Logic used by the ResearchElementDefinition
   */
  library?: Array<canonical>;
  /* 
   * population | exposure | outcome
   */
  type: code;
  /* 
   * dichotomous | continuous | descriptive
   */
  variableType?: code;
  /* 
   * What defines the members of the research element
   */
  characteristic: Array<ResearchElementDefinitionCharacteristic>;
}

export interface ResearchStudyArm {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Label for study arm
   */
  name: string;
  /* 
   * Categorization of study arm
   */
  type?: CodeableConcept;
  /* 
   * Short explanation of study path
   */
  description?: string;
}
export interface ResearchStudyObjective {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Label for the objective
   */
  name?: string;
  /* 
   * primary | secondary | exploratory
   */
  type?: CodeableConcept;
}
export interface ResearchStudy {
resourceType: "ResearchStudy"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for study
   */
  identifier?: Array<Identifier>;
  /* 
   * Name for this study
   */
  title?: string;
  /* 
   * Steps followed in executing study
   */
  protocol?: Array<Reference>;
  /* 
   * Part of larger study
   */
  partOf?: Array<Reference>;
  /* 
   * active | administratively-completed | approved | closed-to-accrual | closed-to-accrual-and-intervention | completed | disapproved | in-review | temporarily-closed-to-accrual | temporarily-closed-to-accrual-and-intervention | withdrawn
   */
  status: code;
  /* 
   * treatment | prevention | diagnostic | supportive-care | screening | health-services-research | basic-science | device-feasibility
   */
  primaryPurposeType?: CodeableConcept;
  /* 
   * n-a | early-phase-1 | phase-1 | phase-1-phase-2 | phase-2 | phase-2-phase-3 | phase-3 | phase-4
   */
  phase?: CodeableConcept;
  /* 
   * Classifications for the study
   */
  category?: Array<CodeableConcept>;
  /* 
   * Drugs, devices, etc. under study
   */
  focus?: Array<CodeableConcept>;
  /* 
   * Condition being studied
   */
  condition?: Array<CodeableConcept>;
  /* 
   * Contact details for the study
   */
  contact?: Array<ContactDetail>;
  /* 
   * References and dependencies
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * Used to search for the study
   */
  keyword?: Array<CodeableConcept>;
  /* 
   * Geographic region(s) for study
   */
  location?: Array<CodeableConcept>;
  /* 
   * What this is study doing
   */
  description?: markdown;
  /* 
   * Inclusion & exclusion criteria
   */
  enrollment?: Array<Reference>;
  /* 
   * When the study began and ended
   */
  period?: Period;
  /* 
   * Organization that initiates and is legally responsible for the study
   */
  sponsor?: Reference;
  /* 
   * Researcher who oversees multiple aspects of the study
   */
  principalInvestigator?: Reference;
  /* 
   * Facility where study activities are conducted
   */
  site?: Array<Reference>;
  /* 
   * accrual-goal-met | closed-due-to-toxicity | closed-due-to-lack-of-study-progress | temporarily-closed-per-study-design
   */
  reasonStopped?: CodeableConcept;
  /* 
   * Comments made about the study
   */
  note?: Array<Annotation>;
  /* 
   * Defined path through the study for a subject
   */
  arm?: Array<ResearchStudyArm>;
  /* 
   * A goal for the study
   */
  objective?: Array<ResearchStudyObjective>;
}

export interface ResearchSubject {
resourceType: "ResearchSubject"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for research subject in a study
   */
  identifier?: Array<Identifier>;
  /* 
   * candidate | eligible | follow-up | ineligible | not-registered | off-study | on-study | on-study-intervention | on-study-observation | pending-on-study | potential-candidate | screening | withdrawn
   */
  status: code;
  /* 
   * Start and end of participation
   */
  period?: Period;
  /* 
   * Study subject is part of
   */
  study: Reference;
  /* 
   * Who is part of study
   */
  individual: Reference;
  /* 
   * What path should be followed
   */
  assignedArm?: string;
  /* 
   * What path was followed
   */
  actualArm?: string;
  /* 
   * Agreement to participate in study
   */
  consent?: Reference;
}

export interface RiskAssessmentPrediction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Possible outcome for the subject
   */
  outcome?: CodeableConcept;
  /* 
   * Likelihood of specified outcome
   */
  probabilityDecimal?: decimal;
  /* 
   * Likelihood of specified outcome
   */
  probabilityRange?: Range;
  /* 
   * Likelihood of specified outcome as a qualitative value
   */
  qualitativeRisk?: CodeableConcept;
  /* 
   * Relative likelihood
   */
  relativeRisk?: decimal;
  /* 
   * Timeframe or age range
   */
  whenPeriod?: Period;
  /* 
   * Timeframe or age range
   */
  whenRange?: Range;
  /* 
   * Explanation of prediction
   */
  rationale?: string;
}
export interface RiskAssessment {
resourceType: "RiskAssessment"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique identifier for the assessment
   */
  identifier?: Array<Identifier>;
  /* 
   * Request fulfilled by this assessment
   */
  basedOn?: Reference;
  /* 
   * Part of this occurrence
   */
  parent?: Reference;
  /* 
   * registered | preliminary | final | amended +
   */
  status: code;
  /* 
   * Evaluation mechanism
   */
  method?: CodeableConcept;
  /* 
   * Type of assessment
   */
  code?: CodeableConcept;
  /* 
   * Who/what does assessment apply to?
   */
  subject: Reference;
  /* 
   * Where was assessment performed?
   */
  encounter?: Reference;
  /* 
   * When was assessment made?
   */
  occurrenceDateTime?: dateTime;
  /* 
   * When was assessment made?
   */
  occurrencePeriod?: Period;
  /* 
   * Condition assessed
   */
  condition?: Reference;
  /* 
   * Who did assessment?
   */
  performer?: Reference;
  /* 
   * Why the assessment was necessary?
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Why the assessment was necessary?
   */
  reasonReference?: Array<Reference>;
  /* 
   * Information used in assessment
   */
  basis?: Array<Reference>;
  /* 
   * Outcome predicted
   */
  prediction?: Array<RiskAssessmentPrediction>;
  /* 
   * How to reduce risk
   */
  mitigation?: string;
  /* 
   * Comments on the risk assessment
   */
  note?: Array<Annotation>;
}

export interface RiskEvidenceSynthesisSampleSize {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Description of sample size
   */
  description?: string;
  /* 
   * How many studies?
   */
  numberOfStudies?: integer;
  /* 
   * How many participants?
   */
  numberOfParticipants?: integer;
}
export interface RiskEvidenceSynthesisRiskEstimatePrecisionEstimate {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of precision estimate
   */
  type?: CodeableConcept;
  /* 
   * Level of confidence interval
   */
  level?: decimal;
  /* 
   * Lower bound
   */
  from?: decimal;
  /* 
   * Upper bound
   */
  to?: decimal;
}
export interface RiskEvidenceSynthesisRiskEstimate {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Description of risk estimate
   */
  description?: string;
  /* 
   * Type of risk estimate
   */
  type?: CodeableConcept;
  /* 
   * Point estimate
   */
  value?: decimal;
  /* 
   * What unit is the outcome described in?
   */
  unitOfMeasure?: CodeableConcept;
  /* 
   * Sample size for group measured
   */
  denominatorCount?: integer;
  /* 
   * Number with the outcome
   */
  numeratorCount?: integer;
  /* 
   * How precise the estimate is
   */
  precisionEstimate?: Array<RiskEvidenceSynthesisRiskEstimatePrecisionEstimate>;
}
export interface RiskEvidenceSynthesisCertaintyCertaintySubcomponent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type of subcomponent of certainty rating
   */
  type?: CodeableConcept;
  /* 
   * Subcomponent certainty rating
   */
  rating?: Array<CodeableConcept>;
  /* 
   * Used for footnotes or explanatory notes
   */
  note?: Array<Annotation>;
}
export interface RiskEvidenceSynthesisCertainty {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Certainty rating
   */
  rating?: Array<CodeableConcept>;
  /* 
   * Used for footnotes or explanatory notes
   */
  note?: Array<Annotation>;
  /* 
   * A component that contributes to the overall certainty
   */
  certaintySubcomponent?: Array<RiskEvidenceSynthesisCertaintyCertaintySubcomponent>;
}
export interface RiskEvidenceSynthesis {
resourceType: "RiskEvidenceSynthesis"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this risk evidence synthesis, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the risk evidence synthesis
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the risk evidence synthesis
   */
  version?: string;
  /* 
   * Name for this risk evidence synthesis (computer friendly)
   */
  name?: string;
  /* 
   * Name for this risk evidence synthesis (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the risk evidence synthesis
   */
  description?: markdown;
  /* 
   * Used for footnotes or explanatory notes
   */
  note?: Array<Annotation>;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for risk evidence synthesis (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * When the risk evidence synthesis was approved by publisher
   */
  approvalDate?: date;
  /* 
   * When the risk evidence synthesis was last reviewed
   */
  lastReviewDate?: date;
  /* 
   * When the risk evidence synthesis is expected to be used
   */
  effectivePeriod?: Period;
  /* 
   * The category of the EffectEvidenceSynthesis, such as Education, Treatment, Assessment, etc.
   */
  topic?: Array<CodeableConcept>;
  /* 
   * Who authored the content
   */
  author?: Array<ContactDetail>;
  /* 
   * Who edited the content
   */
  editor?: Array<ContactDetail>;
  /* 
   * Who reviewed the content
   */
  reviewer?: Array<ContactDetail>;
  /* 
   * Who endorsed the content
   */
  endorser?: Array<ContactDetail>;
  /* 
   * Additional documentation, citations, etc.
   */
  relatedArtifact?: Array<RelatedArtifact>;
  /* 
   * Type of synthesis
   */
  synthesisType?: CodeableConcept;
  /* 
   * Type of study
   */
  studyType?: CodeableConcept;
  /* 
   * What population?
   */
  population: Reference;
  /* 
   * What exposure?
   */
  exposure?: Reference;
  /* 
   * What outcome?
   */
  outcome: Reference;
  /* 
   * What sample size was involved?
   */
  sampleSize?: RiskEvidenceSynthesisSampleSize;
  /* 
   * What was the estimated risk
   */
  riskEstimate?: RiskEvidenceSynthesisRiskEstimate;
  /* 
   * How certain is the risk
   */
  certainty?: Array<RiskEvidenceSynthesisCertainty>;
}

export interface Schedule {
resourceType: "Schedule"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Ids for this item
   */
  identifier?: Array<Identifier>;
  /* 
   * Whether this schedule is in active use
   */
  active?: boolean;
  /* 
   * High-level category
   */
  serviceCategory?: Array<CodeableConcept>;
  /* 
   * Specific service
   */
  serviceType?: Array<CodeableConcept>;
  /* 
   * Type of specialty needed
   */
  specialty?: Array<CodeableConcept>;
  /* 
   * Resource(s) that availability information is being provided for
   */
  actor: Array<Reference>;
  /* 
   * Period of time covered by schedule
   */
  planningHorizon?: Period;
  /* 
   * Comments on availability
   */
  comment?: string;
}

export interface SearchParameterComponent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Defines how the part works
   */
  definition: canonical;
  /* 
   * Subexpression relative to main expression
   */
  expression: string;
}
export interface SearchParameter {
resourceType: "SearchParameter"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this search parameter, represented as a URI (globally unique)
   */
  url: uri;
  /* 
   * Business version of the search parameter
   */
  version?: string;
  /* 
   * Name for this search parameter (computer friendly)
   */
  name: string;
  /* 
   * Original definition for the search parameter
   */
  derivedFrom?: canonical;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the search parameter
   */
  description: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for search parameter (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this search parameter is defined
   */
  purpose?: markdown;
  /* 
   * Code used in URL
   */
  code: code;
  /* 
   * The resource type(s) this search parameter applies to
   */
  base: Array<code>;
  /* 
   * number | date | string | token | reference | composite | quantity | uri | special
   */
  type: code;
  /* 
   * FHIRPath expression that extracts the values
   */
  expression?: string;
  /* 
   * XPath that extracts the values
   */
  xpath?: string;
  /* 
   * normal | phonetic | nearby | distance | other
   */
  xpathUsage?: code;
  /* 
   * Types of resource (if a resource reference)
   */
  target?: Array<code>;
  /* 
   * Allow multiple values per parameter (or)
   */
  multipleOr?: boolean;
  /* 
   * Allow multiple parameters (and)
   */
  multipleAnd?: boolean;
  /* 
   * eq | ne | gt | lt | ge | le | sa | eb | ap
   */
  comparator?: Array<code>;
  /* 
   * missing | exact | contains | not | text | in | not-in | below | above | type | identifier | ofType
   */
  modifier?: Array<code>;
  /* 
   * Chained names supported
   */
  chain?: Array<string>;
  /* 
   * For Composite resources to define the parts
   */
  component?: Array<SearchParameterComponent>;
}

export interface ServiceRequest {
resourceType: "ServiceRequest"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifiers assigned to this order
   */
  identifier?: Array<Identifier>;
  /* 
   * Instantiates FHIR protocol or definition
   */
  instantiatesCanonical?: Array<canonical>;
  /* 
   * Instantiates external protocol or definition
   */
  instantiatesUri?: Array<uri>;
  /* 
   * What request fulfills
   */
  basedOn?: Array<Reference>;
  /* 
   * What request replaces
   */
  replaces?: Array<Reference>;
  /* 
   * Composite Request ID
   */
  requisition?: Identifier;
  /* 
   * draft | active | on-hold | revoked | completed | entered-in-error | unknown
   */
  status: code;
  /* 
   * proposal | plan | directive | order | original-order | reflex-order | filler-order | instance-order | option
   */
  intent: code;
  /* 
   * Classification of service
   */
  category?: Array<CodeableConcept>;
  /* 
   * routine | urgent | asap | stat
   */
  priority?: code;
  /* 
   * True if service/procedure should not be performed
   */
  doNotPerform?: boolean;
  /* 
   * What is being requested/ordered
   */
  code?: CodeableConcept;
  /* 
   * Additional order information
   */
  orderDetail?: Array<CodeableConcept>;
  /* 
   * Service amount
   */
  quantityQuantity?: Quantity;
  /* 
   * Service amount
   */
  quantityRatio?: Ratio;
  /* 
   * Service amount
   */
  quantityRange?: Range;
  /* 
   * Individual or Entity the service is ordered for
   */
  subject: Reference;
  /* 
   * Encounter in which the request was created
   */
  encounter?: Reference;
  /* 
   * When service should occur
   */
  occurrenceDateTime?: dateTime;
  /* 
   * When service should occur
   */
  occurrencePeriod?: Period;
  /* 
   * When service should occur
   */
  occurrenceTiming?: Timing;
  /* 
   * Preconditions for service
   */
  asNeededBoolean?: boolean;
  /* 
   * Preconditions for service
   */
  asNeededCodeableConcept?: CodeableConcept;
  /* 
   * Date request signed
   */
  authoredOn?: dateTime;
  /* 
   * Who/what is requesting service
   */
  requester?: Reference;
  /* 
   * Performer role
   */
  performerType?: CodeableConcept;
  /* 
   * Requested performer
   */
  performer?: Array<Reference>;
  /* 
   * Requested location
   */
  locationCode?: Array<CodeableConcept>;
  /* 
   * Requested location
   */
  locationReference?: Array<Reference>;
  /* 
   * Explanation/Justification for procedure or service
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * Explanation/Justification for service or service
   */
  reasonReference?: Array<Reference>;
  /* 
   * Associated insurance coverage
   */
  insurance?: Array<Reference>;
  /* 
   * Additional clinical information
   */
  supportingInfo?: Array<Reference>;
  /* 
   * Procedure Samples
   */
  specimen?: Array<Reference>;
  /* 
   * Location on Body
   */
  bodySite?: Array<CodeableConcept>;
  /* 
   * Comments
   */
  note?: Array<Annotation>;
  /* 
   * Patient or consumer-oriented instructions
   */
  patientInstruction?: string;
  /* 
   * Request provenance
   */
  relevantHistory?: Array<Reference>;
}

export interface Slot {
resourceType: "Slot"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Ids for this item
   */
  identifier?: Array<Identifier>;
  /* 
   * A broad categorization of the service that is to be performed during this appointment
   */
  serviceCategory?: Array<CodeableConcept>;
  /* 
   * The type of appointments that can be booked into this slot (ideally this would be an identifiable service - which is at a location, rather than the location itself). If provided then this overrides the value provided on the availability resource
   */
  serviceType?: Array<CodeableConcept>;
  /* 
   * The specialty of a practitioner that would be required to perform the service requested in this appointment
   */
  specialty?: Array<CodeableConcept>;
  /* 
   * The style of appointment or patient that may be booked in the slot (not service type)
   */
  appointmentType?: CodeableConcept;
  /* 
   * The schedule resource that this slot defines an interval of status information
   */
  schedule: Reference;
  /* 
   * busy | free | busy-unavailable | busy-tentative | entered-in-error
   */
  status: code;
  /* 
   * Date/Time that the slot is to begin
   */
  start: instant;
  /* 
   * Date/Time that the slot is to conclude
   */
  end: instant;
  /* 
   * This slot has already been overbooked, appointments are unlikely to be accepted for this time
   */
  overbooked?: boolean;
  /* 
   * Comments on the slot to describe any extended information. Such as custom constraints on the slot
   */
  comment?: string;
}

export interface SpecimenCollection {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Who collected the specimen
   */
  collector?: Reference;
  /* 
   * Collection time
   */
  collectedDateTime?: dateTime;
  /* 
   * Collection time
   */
  collectedPeriod?: Period;
  /* 
   * How long it took to collect specimen
   */
  duration?: Duration;
  /* 
   * The quantity of specimen collected
   */
  quantity?: Quantity;
  /* 
   * Technique used to perform collection
   */
  method?: CodeableConcept;
  /* 
   * Anatomical collection site
   */
  bodySite?: CodeableConcept;
  /* 
   * Whether or how long patient abstained from food and/or drink
   */
  fastingStatusCodeableConcept?: CodeableConcept;
  /* 
   * Whether or how long patient abstained from food and/or drink
   */
  fastingStatusDuration?: Duration;
}
export interface SpecimenProcessing {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Textual description of procedure
   */
  description?: string;
  /* 
   * Indicates the treatment step  applied to the specimen
   */
  procedure?: CodeableConcept;
  /* 
   * Material used in the processing step
   */
  additive?: Array<Reference>;
  /* 
   * Date and time of specimen processing
   */
  timeDateTime?: dateTime;
  /* 
   * Date and time of specimen processing
   */
  timePeriod?: Period;
}
export interface SpecimenContainer {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Id for the container
   */
  identifier?: Array<Identifier>;
  /* 
   * Textual description of the container
   */
  description?: string;
  /* 
   * Kind of container directly associated with specimen
   */
  type?: CodeableConcept;
  /* 
   * Container volume or size
   */
  capacity?: Quantity;
  /* 
   * Quantity of specimen within container
   */
  specimenQuantity?: Quantity;
  /* 
   * Additive associated with container
   */
  additiveCodeableConcept?: CodeableConcept;
  /* 
   * Additive associated with container
   */
  additiveReference?: Reference;
}
export interface Specimen {
resourceType: "Specimen"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External Identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Identifier assigned by the lab
   */
  accessionIdentifier?: Identifier;
  /* 
   * available | unavailable | unsatisfactory | entered-in-error
   */
  status?: code;
  /* 
   * Kind of material that forms the specimen
   */
  type?: CodeableConcept;
  /* 
   * Where the specimen came from. This may be from patient(s), from a location (e.g., the source of an environmental sample), or a sampling of a substance or a device
   */
  subject?: Reference;
  /* 
   * The time when specimen was received for processing
   */
  receivedTime?: dateTime;
  /* 
   * Specimen from which this specimen originated
   */
  parent?: Array<Reference>;
  /* 
   * Why the specimen was collected
   */
  request?: Array<Reference>;
  /* 
   * Collection details
   */
  collection?: SpecimenCollection;
  /* 
   * Processing and processing step details
   */
  processing?: Array<SpecimenProcessing>;
  /* 
   * Direct container of specimen (tube/slide, etc.)
   */
  container?: Array<SpecimenContainer>;
  /* 
   * State of the specimen
   */
  condition?: Array<CodeableConcept>;
  /* 
   * Comments
   */
  note?: Array<Annotation>;
}

export interface SpecimenDefinitionTypeTestedContainerAdditive {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Additive associated with container
   */
  additiveCodeableConcept?: CodeableConcept;
  /* 
   * Additive associated with container
   */
  additiveReference?: Reference;
}
export interface SpecimenDefinitionTypeTestedContainer {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Container material
   */
  material?: CodeableConcept;
  /* 
   * Kind of container associated with the kind of specimen
   */
  type?: CodeableConcept;
  /* 
   * Color of container cap
   */
  cap?: CodeableConcept;
  /* 
   * Container description
   */
  description?: string;
  /* 
   * Container capacity
   */
  capacity?: Quantity;
  /* 
   * Minimum volume
   */
  minimumVolumeQuantity?: Quantity;
  /* 
   * Minimum volume
   */
  minimumVolumeString?: string;
  /* 
   * Additive associated with container
   */
  additive?: Array<SpecimenDefinitionTypeTestedContainerAdditive>;
  /* 
   * Specimen container preparation
   */
  preparation?: string;
}
export interface SpecimenDefinitionTypeTestedHandling {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Temperature qualifier
   */
  temperatureQualifier?: CodeableConcept;
  /* 
   * Temperature range
   */
  temperatureRange?: Range;
  /* 
   * Maximum preservation time
   */
  maxDuration?: Duration;
  /* 
   * Preservation instruction
   */
  instruction?: string;
}
export interface SpecimenDefinitionTypeTested {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Primary or secondary specimen
   */
  isDerived?: boolean;
  /* 
   * Type of intended specimen
   */
  type?: CodeableConcept;
  /* 
   * preferred | alternate
   */
  preference: code;
  /* 
   * The specimen's container
   */
  container?: SpecimenDefinitionTypeTestedContainer;
  /* 
   * Specimen requirements
   */
  requirement?: string;
  /* 
   * Specimen retention time
   */
  retentionTime?: Duration;
  /* 
   * Rejection criterion
   */
  rejectionCriterion?: Array<CodeableConcept>;
  /* 
   * Specimen handling before testing
   */
  handling?: Array<SpecimenDefinitionTypeTestedHandling>;
}
export interface SpecimenDefinition {
resourceType: "SpecimenDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business identifier of a kind of specimen
   */
  identifier?: Identifier;
  /* 
   * Kind of material to collect
   */
  typeCollected?: CodeableConcept;
  /* 
   * Patient preparation for collection
   */
  patientPreparation?: Array<CodeableConcept>;
  /* 
   * Time aspect for collection
   */
  timeAspect?: string;
  /* 
   * Specimen collection procedure
   */
  collection?: Array<CodeableConcept>;
  /* 
   * Specimen in container intended for testing by lab
   */
  typeTested?: Array<SpecimenDefinitionTypeTested>;
}

export interface StructureDefinitionMapping {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Internal id when this mapping is used
   */
  identity: id;
  /* 
   * Identifies what this mapping refers to
   */
  uri?: uri;
  /* 
   * Names what this mapping refers to
   */
  name?: string;
  /* 
   * Versions, Issues, Scope limitations etc.
   */
  comment?: string;
}
export interface StructureDefinitionContext {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * fhirpath | element | extension
   */
  type: code;
  /* 
   * Where the extension can be used in instances
   */
  expression: string;
}
export interface StructureDefinitionSnapshot {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Definition of elements in the resource (if no StructureDefinition)
   */
  element: Array<ElementDefinition>;
}
export interface StructureDefinitionDifferential {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Definition of elements in the resource (if no StructureDefinition)
   */
  element: Array<ElementDefinition>;
}
export interface StructureDefinition {
resourceType: "StructureDefinition"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this structure definition, represented as a URI (globally unique)
   */
  url: uri;
  /* 
   * Additional identifier for the structure definition
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the structure definition
   */
  version?: string;
  /* 
   * Name for this structure definition (computer friendly)
   */
  name: string;
  /* 
   * Name for this structure definition (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the structure definition
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for structure definition (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this structure definition is defined
   */
  purpose?: markdown;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * Assist with indexing and finding
   */
  keyword?: Array<Coding>;
  /* 
   * FHIR Version this StructureDefinition targets
   */
  fhirVersion?: code;
  /* 
   * External specification that the content is mapped to
   */
  mapping?: Array<StructureDefinitionMapping>;
  /* 
   * primitive-type | complex-type | resource | logical
   */
  kind: code;
  /* 
   * Whether the structure is abstract
   */
  abstract: boolean;
  /* 
   * If an extension, where it can be used in instances
   */
  context?: Array<StructureDefinitionContext>;
  /* 
   * FHIRPath invariants - when the extension can be used
   */
  contextInvariant?: Array<string>;
  /* 
   * Type defined or constrained by this structure
   */
  type: uri;
  /* 
   * Definition that this type is constrained/specialized from
   */
  baseDefinition?: canonical;
  /* 
   * specialization | constraint - How relates to base definition
   */
  derivation?: code;
  /* 
   * Snapshot view of the structure
   */
  snapshot?: StructureDefinitionSnapshot;
  /* 
   * Differential view of the structure
   */
  differential?: StructureDefinitionDifferential;
}

export interface StructureMapStructure {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical reference to structure definition
   */
  url: canonical;
  /* 
   * source | queried | target | produced
   */
  mode: code;
  /* 
   * Name for type in this map
   */
  alias?: string;
  /* 
   * Documentation on use of structure
   */
  documentation?: string;
}
export interface StructureMapGroupInput {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name for this instance of data
   */
  name: id;
  /* 
   * Type for this instance of data
   */
  type?: string;
  /* 
   * source | target
   */
  mode: code;
  /* 
   * Documentation for this instance of data
   */
  documentation?: string;
}
export interface StructureMapGroupRuleSource {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type or variable this rule applies to
   */
  context: id;
  /* 
   * Specified minimum cardinality
   */
  min?: integer;
  /* 
   * Specified maximum cardinality (number or *)
   */
  max?: string;
  /* 
   * Rule only applies if source has this type
   */
  type?: string;
  /* 
   * Default value if no value exists
   */
  defaultValueBase64Binary?: base64Binary;
  /* 
   * Default value if no value exists
   */
  defaultValueBoolean?: boolean;
  /* 
   * Default value if no value exists
   */
  defaultValueCanonical?: canonical;
  /* 
   * Default value if no value exists
   */
  defaultValueCode?: code;
  /* 
   * Default value if no value exists
   */
  defaultValueDate?: date;
  /* 
   * Default value if no value exists
   */
  defaultValueDateTime?: dateTime;
  /* 
   * Default value if no value exists
   */
  defaultValueDecimal?: decimal;
  /* 
   * Default value if no value exists
   */
  defaultValueId?: id;
  /* 
   * Default value if no value exists
   */
  defaultValueInstant?: instant;
  /* 
   * Default value if no value exists
   */
  defaultValueInteger?: integer;
  /* 
   * Default value if no value exists
   */
  defaultValueMarkdown?: markdown;
  /* 
   * Default value if no value exists
   */
  defaultValueOid?: oid;
  /* 
   * Default value if no value exists
   */
  defaultValuePositiveInt?: positiveInt;
  /* 
   * Default value if no value exists
   */
  defaultValueString?: string;
  /* 
   * Default value if no value exists
   */
  defaultValueTime?: time;
  /* 
   * Default value if no value exists
   */
  defaultValueUnsignedInt?: unsignedInt;
  /* 
   * Default value if no value exists
   */
  defaultValueUri?: uri;
  /* 
   * Default value if no value exists
   */
  defaultValueUrl?: url;
  /* 
   * Default value if no value exists
   */
  defaultValueUuid?: uuid;
  /* 
   * Default value if no value exists
   */
  defaultValueAddress?: Address;
  /* 
   * Default value if no value exists
   */
  defaultValueAge?: Age;
  /* 
   * Default value if no value exists
   */
  defaultValueAnnotation?: Annotation;
  /* 
   * Default value if no value exists
   */
  defaultValueAttachment?: Attachment;
  /* 
   * Default value if no value exists
   */
  defaultValueCodeableConcept?: CodeableConcept;
  /* 
   * Default value if no value exists
   */
  defaultValueCoding?: Coding;
  /* 
   * Default value if no value exists
   */
  defaultValueContactPoint?: ContactPoint;
  /* 
   * Default value if no value exists
   */
  defaultValueCount?: Count;
  /* 
   * Default value if no value exists
   */
  defaultValueDistance?: Distance;
  /* 
   * Default value if no value exists
   */
  defaultValueDuration?: Duration;
  /* 
   * Default value if no value exists
   */
  defaultValueHumanName?: HumanName;
  /* 
   * Default value if no value exists
   */
  defaultValueIdentifier?: Identifier;
  /* 
   * Default value if no value exists
   */
  defaultValueMoney?: Money;
  /* 
   * Default value if no value exists
   */
  defaultValuePeriod?: Period;
  /* 
   * Default value if no value exists
   */
  defaultValueQuantity?: Quantity;
  /* 
   * Default value if no value exists
   */
  defaultValueRange?: Range;
  /* 
   * Default value if no value exists
   */
  defaultValueRatio?: Ratio;
  /* 
   * Default value if no value exists
   */
  defaultValueReference?: Reference;
  /* 
   * Default value if no value exists
   */
  defaultValueSampledData?: SampledData;
  /* 
   * Default value if no value exists
   */
  defaultValueSignature?: Signature;
  /* 
   * Default value if no value exists
   */
  defaultValueTiming?: Timing;
  /* 
   * Default value if no value exists
   */
  defaultValueContactDetail?: ContactDetail;
  /* 
   * Default value if no value exists
   */
  defaultValueContributor?: Contributor;
  /* 
   * Default value if no value exists
   */
  defaultValueDataRequirement?: DataRequirement;
  /* 
   * Default value if no value exists
   */
  defaultValueExpression?: Expression;
  /* 
   * Default value if no value exists
   */
  defaultValueParameterDefinition?: ParameterDefinition;
  /* 
   * Default value if no value exists
   */
  defaultValueRelatedArtifact?: RelatedArtifact;
  /* 
   * Default value if no value exists
   */
  defaultValueTriggerDefinition?: TriggerDefinition;
  /* 
   * Default value if no value exists
   */
  defaultValueUsageContext?: UsageContext;
  /* 
   * Default value if no value exists
   */
  defaultValueDosage?: Dosage;
  /* 
   * Default value if no value exists
   */
  defaultValueMeta?: Meta;
  /* 
   * Optional field for this source
   */
  element?: string;
  /* 
   * first | not_first | last | not_last | only_one
   */
  listMode?: code;
  /* 
   * Named context for field, if a field is specified
   */
  variable?: id;
  /* 
   * FHIRPath expression  - must be true or the rule does not apply
   */
  condition?: string;
  /* 
   * FHIRPath expression  - must be true or the mapping engine throws an error instead of completing
   */
  check?: string;
  /* 
   * Message to put in log if source exists (FHIRPath)
   */
  logMessage?: string;
}
export interface StructureMapGroupRuleTargetParameter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Parameter value - variable or literal
   */
  valueId?: id;
  /* 
   * Parameter value - variable or literal
   */
  valueString?: string;
  /* 
   * Parameter value - variable or literal
   */
  valueBoolean?: boolean;
  /* 
   * Parameter value - variable or literal
   */
  valueInteger?: integer;
  /* 
   * Parameter value - variable or literal
   */
  valueDecimal?: decimal;
}
export interface StructureMapGroupRuleTarget {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Type or variable this rule applies to
   */
  context?: id;
  /* 
   * type | variable
   */
  contextType?: code;
  /* 
   * Field to create in the context
   */
  element?: string;
  /* 
   * Named context for field, if desired, and a field is specified
   */
  variable?: id;
  /* 
   * first | share | last | collate
   */
  listMode?: Array<code>;
  /* 
   * Internal rule reference for shared list items
   */
  listRuleId?: id;
  /* 
   * create | copy +
   */
  transform?: code;
  /* 
   * Parameters to the transform
   */
  parameter?: Array<StructureMapGroupRuleTargetParameter>;
}
export interface StructureMapGroupRuleDependent {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name of a rule or group to apply
   */
  name: id;
  /* 
   * Variable to pass to the rule or group
   */
  variable: Array<string>;
}
export interface StructureMapGroupRule {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name of the rule for internal references
   */
  name: id;
  /* 
   * Source inputs to the mapping
   */
  source: Array<StructureMapGroupRuleSource>;
  /* 
   * Content to create because of this mapping rule
   */
  target?: Array<StructureMapGroupRuleTarget>;
  /* 
   * Rules contained in this rule
   */
  rule?: StructureMapGroupRule;
  /* 
   * Which other rules to apply in the context of this rule
   */
  dependent?: Array<StructureMapGroupRuleDependent>;
  /* 
   * Documentation for this instance of data
   */
  documentation?: string;
}
export interface StructureMapGroup {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Human-readable label
   */
  name: id;
  /* 
   * Another group that this group adds rules to
   */
  extends?: id;
  /* 
   * none | types | type-and-types
   */
  typeMode: code;
  /* 
   * Additional description/explanation for group
   */
  documentation?: string;
  /* 
   * Named instance provided when invoking the map
   */
  input: Array<StructureMapGroupInput>;
  /* 
   * Transform Rule from source to target
   */
  rule: Array<StructureMapGroupRule>;
}
export interface StructureMap {
resourceType: "StructureMap"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this structure map, represented as a URI (globally unique)
   */
  url: uri;
  /* 
   * Additional identifier for the structure map
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the structure map
   */
  version?: string;
  /* 
   * Name for this structure map (computer friendly)
   */
  name: string;
  /* 
   * Name for this structure map (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the structure map
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for structure map (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this structure map is defined
   */
  purpose?: markdown;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * Structure Definition used by this map
   */
  structure?: Array<StructureMapStructure>;
  /* 
   * Other maps used by this map (canonical URLs)
   */
  import?: Array<canonical>;
  /* 
   * Named sections for reader convenience
   */
  group: Array<StructureMapGroup>;
}

export interface SubscriptionChannel {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * rest-hook | websocket | email | sms | message
   */
  type: code;
  /* 
   * Where the channel points to
   */
  endpoint?: url;
  /* 
   * MIME type to send, or omit for no payload
   */
  payload?: code;
  /* 
   * Usage depends on the channel type
   */
  header?: Array<string>;
}
export interface Subscription {
resourceType: "Subscription"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * requested | active | error | off
   */
  status: code;
  /* 
   * Contact details for source (e.g. troubleshooting)
   */
  contact?: Array<ContactPoint>;
  /* 
   * When to automatically delete the subscription
   */
  end?: instant;
  /* 
   * Description of why this subscription was created
   */
  reason: string;
  /* 
   * Rule for server push
   */
  criteria: string;
  /* 
   * Latest error note
   */
  error?: string;
  /* 
   * The channel on which to report matches to the criteria
   */
  channel: SubscriptionChannel;
}

export interface SubstanceInstance {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifier of the package/container
   */
  identifier?: Identifier;
  /* 
   * When no longer valid to use
   */
  expiry?: dateTime;
  /* 
   * Amount of substance in the package
   */
  quantity?: Quantity;
}
export interface SubstanceIngredient {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Optional amount (concentration)
   */
  quantity?: Ratio;
  /* 
   * A component of the substance
   */
  substanceCodeableConcept?: CodeableConcept;
  /* 
   * A component of the substance
   */
  substanceReference?: Reference;
}
export interface Substance {
resourceType: "Substance"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Unique identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * active | inactive | entered-in-error
   */
  status?: code;
  /* 
   * What class/type of substance this is
   */
  category?: Array<CodeableConcept>;
  /* 
   * What substance this is
   */
  code: CodeableConcept;
  /* 
   * Textual description of the substance, comments
   */
  description?: string;
  /* 
   * If this describes a specific package/container of the substance
   */
  instance?: Array<SubstanceInstance>;
  /* 
   * Composition information about the substance
   */
  ingredient?: Array<SubstanceIngredient>;
}

export interface SubstanceNucleicAcidSubunitLinkage {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The entity that links the sugar residues together should also be captured for nearly all naturally occurring nucleic acid the linkage is a phosphate group. For many synthetic oligonucleotides phosphorothioate linkages are often seen. Linkage connectivity is assumed to be 3’-5’. If the linkage is either 3’-3’ or 5’-5’ this should be specified
   */
  connectivity?: string;
  /* 
   * Each linkage will be registered as a fragment and have an ID
   */
  identifier?: Identifier;
  /* 
   * Each linkage will be registered as a fragment and have at least one name. A single name shall be assigned to each linkage
   */
  name?: string;
  /* 
   * Residues shall be captured as described in 5.3.6.8.3
   */
  residueSite?: string;
}
export interface SubstanceNucleicAcidSubunitSugar {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The Substance ID of the sugar or sugar-like component that make up the nucleotide
   */
  identifier?: Identifier;
  /* 
   * The name of the sugar or sugar-like component that make up the nucleotide
   */
  name?: string;
  /* 
   * The residues that contain a given sugar will be captured. The order of given residues will be captured in the 5‘-3‘direction consistent with the base sequences listed above
   */
  residueSite?: string;
}
export interface SubstanceNucleicAcidSubunit {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Index of linear sequences of nucleic acids in order of decreasing length. Sequences of the same length will be ordered by molecular weight. Subunits that have identical sequences will be repeated and have sequential subscripts
   */
  subunit?: integer;
  /* 
   * Actual nucleotide sequence notation from 5' to 3' end using standard single letter codes. In addition to the base sequence, sugar and type of phosphate or non-phosphate linkage should also be captured
   */
  sequence?: string;
  /* 
   * The length of the sequence shall be captured
   */
  length?: integer;
  /* 
   * (TBC)
   */
  sequenceAttachment?: Attachment;
  /* 
   * The nucleotide present at the 5’ terminal shall be specified based on a controlled vocabulary. Since the sequence is represented from the 5' to the 3' end, the 5’ prime nucleotide is the letter at the first position in the sequence. A separate representation would be redundant
   */
  fivePrime?: CodeableConcept;
  /* 
   * The nucleotide present at the 3’ terminal shall be specified based on a controlled vocabulary. Since the sequence is represented from the 5' to the 3' end, the 5’ prime nucleotide is the letter at the last position in the sequence. A separate representation would be redundant
   */
  threePrime?: CodeableConcept;
  /* 
   * The linkages between sugar residues will also be captured
   */
  linkage?: Array<SubstanceNucleicAcidSubunitLinkage>;
  /* 
   * 5.3.6.8.1 Sugar ID (Mandatory)
   */
  sugar?: Array<SubstanceNucleicAcidSubunitSugar>;
}
export interface SubstanceNucleicAcid {
resourceType: "SubstanceNucleicAcid"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The type of the sequence shall be specified based on a controlled vocabulary
   */
  sequenceType?: CodeableConcept;
  /* 
   * The number of linear sequences of nucleotides linked through phosphodiester bonds shall be described. Subunits would be strands of nucleic acids that are tightly associated typically through Watson-Crick base pairing. NOTE: If not specified in the reference source, the assumption is that there is 1 subunit
   */
  numberOfSubunits?: integer;
  /* 
   * The area of hybridisation shall be described if applicable for double stranded RNA or DNA. The number associated with the subunit followed by the number associated to the residue shall be specified in increasing order. The underscore “” shall be used as separator as follows: “Subunitnumber Residue”
   */
  areaOfHybridisation?: string;
  /* 
   * (TBC)
   */
  oligoNucleotideType?: CodeableConcept;
  /* 
   * Subunits are listed in order of decreasing length; sequences of the same length will be ordered by molecular weight; subunits that have identical sequences will be repeated multiple times
   */
  subunit?: Array<SubstanceNucleicAcidSubunit>;
}

export interface SubstancePolymerMonomerSetStartingMaterial {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  material?: CodeableConcept;
  /* 
   * Todo
   */
  type?: CodeableConcept;
  /* 
   * Todo
   */
  isDefining?: boolean;
  /* 
   * Todo
   */
  amount?: SubstanceAmount;
}
export interface SubstancePolymerMonomerSet {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  ratioType?: CodeableConcept;
  /* 
   * Todo
   */
  startingMaterial?: Array<SubstancePolymerMonomerSetStartingMaterial>;
}
export interface SubstancePolymerRepeatRepeatUnitDegreeOfPolymerisation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  degree?: CodeableConcept;
  /* 
   * Todo
   */
  amount?: SubstanceAmount;
}
export interface SubstancePolymerRepeatRepeatUnitStructuralRepresentation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  type?: CodeableConcept;
  /* 
   * Todo
   */
  representation?: string;
  /* 
   * Todo
   */
  attachment?: Attachment;
}
export interface SubstancePolymerRepeatRepeatUnit {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  orientationOfPolymerisation?: CodeableConcept;
  /* 
   * Todo
   */
  repeatUnit?: string;
  /* 
   * Todo
   */
  amount?: SubstanceAmount;
  /* 
   * Todo
   */
  degreeOfPolymerisation?: Array<SubstancePolymerRepeatRepeatUnitDegreeOfPolymerisation>;
  /* 
   * Todo
   */
  structuralRepresentation?: Array<SubstancePolymerRepeatRepeatUnitStructuralRepresentation>;
}
export interface SubstancePolymerRepeat {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  numberOfUnits?: integer;
  /* 
   * Todo
   */
  averageMolecularFormula?: string;
  /* 
   * Todo
   */
  repeatUnitAmountType?: CodeableConcept;
  /* 
   * Todo
   */
  repeatUnit?: Array<SubstancePolymerRepeatRepeatUnit>;
}
export interface SubstancePolymer {
resourceType: "SubstancePolymer"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  class?: CodeableConcept;
  /* 
   * Todo
   */
  geometry?: CodeableConcept;
  /* 
   * Todo
   */
  copolymerConnectivity?: Array<CodeableConcept>;
  /* 
   * Todo
   */
  modification?: Array<string>;
  /* 
   * Todo
   */
  monomerSet?: Array<SubstancePolymerMonomerSet>;
  /* 
   * Todo
   */
  repeat?: Array<SubstancePolymerRepeat>;
}

export interface SubstanceProteinSubunit {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Index of primary sequences of amino acids linked through peptide bonds in order of decreasing length. Sequences of the same length will be ordered by molecular weight. Subunits that have identical sequences will be repeated and have sequential subscripts
   */
  subunit?: integer;
  /* 
   * The sequence information shall be provided enumerating the amino acids from N- to C-terminal end using standard single-letter amino acid codes. Uppercase shall be used for L-amino acids and lowercase for D-amino acids. Transcribed SubstanceProteins will always be described using the translated sequence; for synthetic peptide containing amino acids that are not represented with a single letter code an X should be used within the sequence. The modified amino acids will be distinguished by their position in the sequence
   */
  sequence?: string;
  /* 
   * Length of linear sequences of amino acids contained in the subunit
   */
  length?: integer;
  /* 
   * The sequence information shall be provided enumerating the amino acids from N- to C-terminal end using standard single-letter amino acid codes. Uppercase shall be used for L-amino acids and lowercase for D-amino acids. Transcribed SubstanceProteins will always be described using the translated sequence; for synthetic peptide containing amino acids that are not represented with a single letter code an X should be used within the sequence. The modified amino acids will be distinguished by their position in the sequence
   */
  sequenceAttachment?: Attachment;
  /* 
   * Unique identifier for molecular fragment modification based on the ISO 11238 Substance ID
   */
  nTerminalModificationId?: Identifier;
  /* 
   * The name of the fragment modified at the N-terminal of the SubstanceProtein shall be specified
   */
  nTerminalModification?: string;
  /* 
   * Unique identifier for molecular fragment modification based on the ISO 11238 Substance ID
   */
  cTerminalModificationId?: Identifier;
  /* 
   * The modification at the C-terminal shall be specified
   */
  cTerminalModification?: string;
}
export interface SubstanceProtein {
resourceType: "SubstanceProtein"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The SubstanceProtein descriptive elements will only be used when a complete or partial amino acid sequence is available or derivable from a nucleic acid sequence
   */
  sequenceType?: CodeableConcept;
  /* 
   * Number of linear sequences of amino acids linked through peptide bonds. The number of subunits constituting the SubstanceProtein shall be described. It is possible that the number of subunits can be variable
   */
  numberOfSubunits?: integer;
  /* 
   * The disulphide bond between two cysteine residues either on the same subunit or on two different subunits shall be described. The position of the disulfide bonds in the SubstanceProtein shall be listed in increasing order of subunit number and position within subunit followed by the abbreviation of the amino acids involved. The disulfide linkage positions shall actually contain the amino acid Cysteine at the respective positions
   */
  disulfideLinkage?: Array<string>;
  /* 
   * This subclause refers to the description of each subunit constituting the SubstanceProtein. A subunit is a linear sequence of amino acids linked through peptide bonds. The Subunit information shall be provided when the finished SubstanceProtein is a complex of multiple sequences; subunits are not used to delineate domains within a single sequence. Subunits are listed in order of decreasing length; sequences of the same length will be ordered by decreasing molecular weight; subunits that have identical sequences will be repeated multiple times
   */
  subunit?: Array<SubstanceProteinSubunit>;
}

export interface SubstanceReferenceInformationGene {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  geneSequenceOrigin?: CodeableConcept;
  /* 
   * Todo
   */
  gene?: CodeableConcept;
  /* 
   * Todo
   */
  source?: Array<Reference>;
}
export interface SubstanceReferenceInformationGeneElement {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  type?: CodeableConcept;
  /* 
   * Todo
   */
  element?: Identifier;
  /* 
   * Todo
   */
  source?: Array<Reference>;
}
export interface SubstanceReferenceInformationClassification {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  domain?: CodeableConcept;
  /* 
   * Todo
   */
  classification?: CodeableConcept;
  /* 
   * Todo
   */
  subtype?: Array<CodeableConcept>;
  /* 
   * Todo
   */
  source?: Array<Reference>;
}
export interface SubstanceReferenceInformationTarget {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  target?: Identifier;
  /* 
   * Todo
   */
  type?: CodeableConcept;
  /* 
   * Todo
   */
  interaction?: CodeableConcept;
  /* 
   * Todo
   */
  organism?: CodeableConcept;
  /* 
   * Todo
   */
  organismType?: CodeableConcept;
  /* 
   * Todo
   */
  amountQuantity?: Quantity;
  /* 
   * Todo
   */
  amountRange?: Range;
  /* 
   * Todo
   */
  amountString?: string;
  /* 
   * Todo
   */
  amountType?: CodeableConcept;
  /* 
   * Todo
   */
  source?: Array<Reference>;
}
export interface SubstanceReferenceInformation {
resourceType: "SubstanceReferenceInformation"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Todo
   */
  comment?: string;
  /* 
   * Todo
   */
  gene?: Array<SubstanceReferenceInformationGene>;
  /* 
   * Todo
   */
  geneElement?: Array<SubstanceReferenceInformationGeneElement>;
  /* 
   * Todo
   */
  classification?: Array<SubstanceReferenceInformationClassification>;
  /* 
   * Todo
   */
  target?: Array<SubstanceReferenceInformationTarget>;
}

export interface SubstanceSourceMaterialFractionDescription {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * This element is capturing information about the fraction of a plant part, or human plasma for fractionation
   */
  fraction?: string;
  /* 
   * The specific type of the material constituting the component. For Herbal preparations the particulars of the extracts (liquid/dry) is described in Specified Substance Group 1
   */
  materialType?: CodeableConcept;
}
export interface SubstanceSourceMaterialOrganismAuthor {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The type of author of an organism species shall be specified. The parenthetical author of an organism species refers to the first author who published the plant/animal name (of any rank). The primary author of an organism species refers to the first author(s), who validly published the plant/animal name
   */
  authorType?: CodeableConcept;
  /* 
   * The author of an organism species shall be specified. The author year of an organism shall also be specified when applicable; refers to the year in which the first author(s) published the infraspecific plant/animal name (of any rank)
   */
  authorDescription?: string;
}
export interface SubstanceSourceMaterialOrganismHybrid {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The identifier of the maternal species constituting the hybrid organism shall be specified based on a controlled vocabulary. For plants, the parents aren’t always known, and it is unlikely that it will be known which is maternal and which is paternal
   */
  maternalOrganismId?: string;
  /* 
   * The name of the maternal species constituting the hybrid organism shall be specified. For plants, the parents aren’t always known, and it is unlikely that it will be known which is maternal and which is paternal
   */
  maternalOrganismName?: string;
  /* 
   * The identifier of the paternal species constituting the hybrid organism shall be specified based on a controlled vocabulary
   */
  paternalOrganismId?: string;
  /* 
   * The name of the paternal species constituting the hybrid organism shall be specified
   */
  paternalOrganismName?: string;
  /* 
   * The hybrid type of an organism shall be specified
   */
  hybridType?: CodeableConcept;
}
export interface SubstanceSourceMaterialOrganismOrganismGeneral {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The kingdom of an organism shall be specified
   */
  kingdom?: CodeableConcept;
  /* 
   * The phylum of an organism shall be specified
   */
  phylum?: CodeableConcept;
  /* 
   * The class of an organism shall be specified
   */
  class?: CodeableConcept;
  /* 
   * The order of an organism shall be specified,
   */
  order?: CodeableConcept;
}
export interface SubstanceSourceMaterialOrganism {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The family of an organism shall be specified
   */
  family?: CodeableConcept;
  /* 
   * The genus of an organism shall be specified; refers to the Latin epithet of the genus element of the plant/animal scientific name; it is present in names for genera, species and infraspecies
   */
  genus?: CodeableConcept;
  /* 
   * The species of an organism shall be specified; refers to the Latin epithet of the species of the plant/animal; it is present in names for species and infraspecies
   */
  species?: CodeableConcept;
  /* 
   * The Intraspecific type of an organism shall be specified
   */
  intraspecificType?: CodeableConcept;
  /* 
   * The intraspecific description of an organism shall be specified based on a controlled vocabulary. For Influenza Vaccine, the intraspecific description shall contain the syntax of the antigen in line with the WHO convention
   */
  intraspecificDescription?: string;
  /* 
   * 4.9.13.6.1 Author type (Conditional)
   */
  author?: Array<SubstanceSourceMaterialOrganismAuthor>;
  /* 
   * 4.9.13.8.1 Hybrid species maternal organism ID (Optional)
   */
  hybrid?: SubstanceSourceMaterialOrganismHybrid;
  /* 
   * 4.9.13.7.1 Kingdom (Conditional)
   */
  organismGeneral?: SubstanceSourceMaterialOrganismOrganismGeneral;
}
export interface SubstanceSourceMaterialPartDescription {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Entity of anatomical origin of source material within an organism
   */
  part?: CodeableConcept;
  /* 
   * The detailed anatomic location when the part can be extracted from different anatomical locations of the organism. Multiple alternative locations may apply
   */
  partLocation?: CodeableConcept;
}
export interface SubstanceSourceMaterial {
resourceType: "SubstanceSourceMaterial"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * General high level classification of the source material specific to the origin of the material
   */
  sourceMaterialClass?: CodeableConcept;
  /* 
   * The type of the source material shall be specified based on a controlled vocabulary. For vaccines, this subclause refers to the class of infectious agent
   */
  sourceMaterialType?: CodeableConcept;
  /* 
   * The state of the source material when extracted
   */
  sourceMaterialState?: CodeableConcept;
  /* 
   * The unique identifier associated with the source material parent organism shall be specified
   */
  organismId?: Identifier;
  /* 
   * The organism accepted Scientific name shall be provided based on the organism taxonomy
   */
  organismName?: string;
  /* 
   * The parent of the herbal drug Ginkgo biloba, Leaf is the substance ID of the substance (fresh) of Ginkgo biloba L. or Ginkgo biloba L. (Whole plant)
   */
  parentSubstanceId?: Array<Identifier>;
  /* 
   * The parent substance of the Herbal Drug, or Herbal preparation
   */
  parentSubstanceName?: Array<string>;
  /* 
   * The country where the plant material is harvested or the countries where the plasma is sourced from as laid down in accordance with the Plasma Master File. For “Plasma-derived substances” the attribute country of origin provides information about the countries used for the manufacturing of the Cryopoor plama or Crioprecipitate
   */
  countryOfOrigin?: Array<CodeableConcept>;
  /* 
   * The place/region where the plant is harvested or the places/regions where the animal source material has its habitat
   */
  geographicalLocation?: Array<string>;
  /* 
   * Stage of life for animals, plants, insects and microorganisms. This information shall be provided only when the substance is significantly different in these stages (e.g. foetal bovine serum)
   */
  developmentStage?: CodeableConcept;
  /* 
   * Many complex materials are fractions of parts of plants, animals, or minerals. Fraction elements are often necessary to define both Substances and Specified Group 1 Substances. For substances derived from Plants, fraction information will be captured at the Substance information level ( . Oils, Juices and Exudates). Additional information for Extracts, such as extraction solvent composition, will be captured at the Specified Substance Group 1 information level. For plasma-derived products fraction information will be captured at the Substance and the Specified Substance Group 1 levels
   */
  fractionDescription?: Array<SubstanceSourceMaterialFractionDescription>;
  /* 
   * This subclause describes the organism which the substance is derived from. For vaccines, the parent organism shall be specified based on these subclause elements. As an example, full taxonomy will be described for the Substance Name: ., Leaf
   */
  organism?: SubstanceSourceMaterialOrganism;
  /* 
   * To do
   */
  partDescription?: Array<SubstanceSourceMaterialPartDescription>;
}

export interface SubstanceSpecificationMoiety {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Role that the moiety is playing
   */
  role?: CodeableConcept;
  /* 
   * Identifier by which this moiety substance is known
   */
  identifier?: Identifier;
  /* 
   * Textual name for this moiety substance
   */
  name?: string;
  /* 
   * Stereochemistry type
   */
  stereochemistry?: CodeableConcept;
  /* 
   * Optical activity type
   */
  opticalActivity?: CodeableConcept;
  /* 
   * Molecular formula
   */
  molecularFormula?: string;
  /* 
   * Quantitative value for this moiety
   */
  amountQuantity?: Quantity;
  /* 
   * Quantitative value for this moiety
   */
  amountString?: string;
}
export interface SubstanceSpecificationProperty {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A category for this property, e.g. Physical, Chemical, Enzymatic
   */
  category?: CodeableConcept;
  /* 
   * Property type e.g. viscosity, pH, isoelectric point
   */
  code?: CodeableConcept;
  /* 
   * Parameters that were used in the measurement of a property (e.g. for viscosity: measured at 20C with a pH of 7.1)
   */
  parameters?: string;
  /* 
   * A substance upon which a defining property depends (e.g. for solubility: in water, in alcohol)
   */
  definingSubstanceReference?: Reference;
  /* 
   * A substance upon which a defining property depends (e.g. for solubility: in water, in alcohol)
   */
  definingSubstanceCodeableConcept?: CodeableConcept;
  /* 
   * Quantitative value for this property
   */
  amountQuantity?: Quantity;
  /* 
   * Quantitative value for this property
   */
  amountString?: string;
}
export interface SubstanceSpecificationStructureIsotopeMolecularWeight {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The method by which the molecular weight was determined
   */
  method?: CodeableConcept;
  /* 
   * Type of molecular weight such as exact, average (also known as. number average), weight average
   */
  type?: CodeableConcept;
  /* 
   * Used to capture quantitative values for a variety of elements. If only limits are given, the arithmetic mean would be the average. If only a single definite value for a given element is given, it would be captured in this field
   */
  amount?: Quantity;
}
export interface SubstanceSpecificationStructureIsotope {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Substance identifier for each non-natural or radioisotope
   */
  identifier?: Identifier;
  /* 
   * Substance name for each non-natural or radioisotope
   */
  name?: CodeableConcept;
  /* 
   * The type of isotopic substitution present in a single substance
   */
  substitution?: CodeableConcept;
  /* 
   * Half life - for a non-natural nuclide
   */
  halfLife?: Quantity;
  /* 
   * The molecular weight or weight range (for proteins, polymers or nucleic acids)
   */
  molecularWeight?: SubstanceSpecificationStructureIsotopeMolecularWeight;
}
export interface SubstanceSpecificationStructureRepresentation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The type of structure (e.g. Full, Partial, Representative)
   */
  type?: CodeableConcept;
  /* 
   * The structural representation as text string in a format e.g. InChI, SMILES, MOLFILE, CDX
   */
  representation?: string;
  /* 
   * An attached file with the structural representation
   */
  attachment?: Attachment;
}
export interface SubstanceSpecificationStructure {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Stereochemistry type
   */
  stereochemistry?: CodeableConcept;
  /* 
   * Optical activity type
   */
  opticalActivity?: CodeableConcept;
  /* 
   * Molecular formula
   */
  molecularFormula?: string;
  /* 
   * Specified per moiety according to the Hill system, i.e. first C, then H, then alphabetical, each moiety separated by a dot
   */
  molecularFormulaByMoiety?: string;
  /* 
   * Applicable for single substances that contain a radionuclide or a non-natural isotopic ratio
   */
  isotope?: Array<SubstanceSpecificationStructureIsotope>;
  /* 
   * The molecular weight or weight range (for proteins, polymers or nucleic acids)
   */
  molecularWeight?: SubstanceSpecificationStructureIsotopeMolecularWeight;
  /* 
   * Supporting literature
   */
  source?: Array<Reference>;
  /* 
   * Molecular structural representation
   */
  representation?: Array<SubstanceSpecificationStructureRepresentation>;
}
export interface SubstanceSpecificationCode {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The specific code
   */
  code?: CodeableConcept;
  /* 
   * Status of the code assignment
   */
  status?: CodeableConcept;
  /* 
   * The date at which the code status is changed as part of the terminology maintenance
   */
  statusDate?: dateTime;
  /* 
   * Any comment can be provided in this field, if necessary
   */
  comment?: string;
  /* 
   * Supporting literature
   */
  source?: Array<Reference>;
}
export interface SubstanceSpecificationNameOfficial {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Which authority uses this official name
   */
  authority?: CodeableConcept;
  /* 
   * The status of the official name
   */
  status?: CodeableConcept;
  /* 
   * Date of official name change
   */
  date?: dateTime;
}
export interface SubstanceSpecificationName {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The actual name
   */
  name: string;
  /* 
   * Name type
   */
  type?: CodeableConcept;
  /* 
   * The status of the name
   */
  status?: CodeableConcept;
  /* 
   * If this is the preferred name for this substance
   */
  preferred?: boolean;
  /* 
   * Language of the name
   */
  language?: Array<CodeableConcept>;
  /* 
   * The use context of this name for example if there is a different name a drug active ingredient as opposed to a food colour additive
   */
  domain?: Array<CodeableConcept>;
  /* 
   * The jurisdiction where this name applies
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * A synonym of this name
   */
  synonym?: SubstanceSpecificationName;
  /* 
   * A translation for this name
   */
  translation?: SubstanceSpecificationName;
  /* 
   * Details of the official nature of this name
   */
  official?: Array<SubstanceSpecificationNameOfficial>;
  /* 
   * Supporting literature
   */
  source?: Array<Reference>;
}
export interface SubstanceSpecificationRelationship {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A pointer to another substance, as a resource or just a representational code
   */
  substanceReference?: Reference;
  /* 
   * A pointer to another substance, as a resource or just a representational code
   */
  substanceCodeableConcept?: CodeableConcept;
  /* 
   * For example "salt to parent", "active moiety", "starting material"
   */
  relationship?: CodeableConcept;
  /* 
   * For example where an enzyme strongly bonds with a particular substance, this is a defining relationship for that enzyme, out of several possible substance relationships
   */
  isDefining?: boolean;
  /* 
   * A numeric factor for the relationship, for instance to express that the salt of a substance has some percentage of the active substance in relation to some other
   */
  amountQuantity?: Quantity;
  /* 
   * A numeric factor for the relationship, for instance to express that the salt of a substance has some percentage of the active substance in relation to some other
   */
  amountRange?: Range;
  /* 
   * A numeric factor for the relationship, for instance to express that the salt of a substance has some percentage of the active substance in relation to some other
   */
  amountRatio?: Ratio;
  /* 
   * A numeric factor for the relationship, for instance to express that the salt of a substance has some percentage of the active substance in relation to some other
   */
  amountString?: string;
  /* 
   * For use when the numeric
   */
  amountRatioLowLimit?: Ratio;
  /* 
   * An operator for the amount, for example "average", "approximately", "less than"
   */
  amountType?: CodeableConcept;
  /* 
   * Supporting literature
   */
  source?: Array<Reference>;
}
export interface SubstanceSpecification {
resourceType: "SubstanceSpecification"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifier by which this substance is known
   */
  identifier?: Identifier;
  /* 
   * High level categorization, e.g. polymer or nucleic acid
   */
  type?: CodeableConcept;
  /* 
   * Status of substance within the catalogue e.g. approved
   */
  status?: CodeableConcept;
  /* 
   * If the substance applies to only human or veterinary use
   */
  domain?: CodeableConcept;
  /* 
   * Textual description of the substance
   */
  description?: string;
  /* 
   * Supporting literature
   */
  source?: Array<Reference>;
  /* 
   * Textual comment about this record of a substance
   */
  comment?: string;
  /* 
   * Moiety, for structural modifications
   */
  moiety?: Array<SubstanceSpecificationMoiety>;
  /* 
   * General specifications for this substance, including how it is related to other substances
   */
  property?: Array<SubstanceSpecificationProperty>;
  /* 
   * General information detailing this substance
   */
  referenceInformation?: Reference;
  /* 
   * Structural information
   */
  structure?: SubstanceSpecificationStructure;
  /* 
   * Codes associated with the substance
   */
  code?: Array<SubstanceSpecificationCode>;
  /* 
   * Names applicable to this substance
   */
  name?: Array<SubstanceSpecificationName>;
  /* 
   * The molecular weight or weight range (for proteins, polymers or nucleic acids)
   */
  molecularWeight?: SubstanceSpecificationStructureIsotopeMolecularWeight;
  /* 
   * A link between this substance and another, with details of the relationship
   */
  relationship?: Array<SubstanceSpecificationRelationship>;
  /* 
   * Data items specific to nucleic acids
   */
  nucleicAcid?: Reference;
  /* 
   * Data items specific to polymers
   */
  polymer?: Reference;
  /* 
   * Data items specific to proteins
   */
  protein?: Reference;
  /* 
   * Material or taxonomic/anatomical source for the substance
   */
  sourceMaterial?: Reference;
}

export interface SupplyDeliverySuppliedItem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Amount dispensed
   */
  quantity?: Quantity;
  /* 
   * Medication, Substance, or Device supplied
   */
  itemCodeableConcept?: CodeableConcept;
  /* 
   * Medication, Substance, or Device supplied
   */
  itemReference?: Reference;
}
export interface SupplyDelivery {
resourceType: "SupplyDelivery"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Fulfills plan, proposal or order
   */
  basedOn?: Array<Reference>;
  /* 
   * Part of referenced event
   */
  partOf?: Array<Reference>;
  /* 
   * in-progress | completed | abandoned | entered-in-error
   */
  status?: code;
  /* 
   * Patient for whom the item is supplied
   */
  patient?: Reference;
  /* 
   * Category of dispense event
   */
  type?: CodeableConcept;
  /* 
   * The item that is delivered or supplied
   */
  suppliedItem?: SupplyDeliverySuppliedItem;
  /* 
   * When event occurred
   */
  occurrenceDateTime?: dateTime;
  /* 
   * When event occurred
   */
  occurrencePeriod?: Period;
  /* 
   * When event occurred
   */
  occurrenceTiming?: Timing;
  /* 
   * Dispenser
   */
  supplier?: Reference;
  /* 
   * Where the Supply was sent
   */
  destination?: Reference;
  /* 
   * Who collected the Supply
   */
  receiver?: Array<Reference>;
}

export interface SupplyRequestParameter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Item detail
   */
  code?: CodeableConcept;
  /* 
   * Value of detail
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * Value of detail
   */
  valueQuantity?: Quantity;
  /* 
   * Value of detail
   */
  valueRange?: Range;
  /* 
   * Value of detail
   */
  valueBoolean?: boolean;
}
export interface SupplyRequest {
resourceType: "SupplyRequest"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for SupplyRequest
   */
  identifier?: Array<Identifier>;
  /* 
   * draft | active | suspended +
   */
  status?: code;
  /* 
   * The kind of supply (central, non-stock, etc.)
   */
  category?: CodeableConcept;
  /* 
   * routine | urgent | asap | stat
   */
  priority?: code;
  /* 
   * Medication, Substance, or Device requested to be supplied
   */
  itemCodeableConcept?: CodeableConcept;
  /* 
   * Medication, Substance, or Device requested to be supplied
   */
  itemReference?: Reference;
  /* 
   * The requested amount of the item indicated
   */
  quantity: Quantity;
  /* 
   * Ordered item details
   */
  parameter?: Array<SupplyRequestParameter>;
  /* 
   * When the request should be fulfilled
   */
  occurrenceDateTime?: dateTime;
  /* 
   * When the request should be fulfilled
   */
  occurrencePeriod?: Period;
  /* 
   * When the request should be fulfilled
   */
  occurrenceTiming?: Timing;
  /* 
   * When the request was made
   */
  authoredOn?: dateTime;
  /* 
   * Individual making the request
   */
  requester?: Reference;
  /* 
   * Who is intended to fulfill the request
   */
  supplier?: Array<Reference>;
  /* 
   * The reason why the supply item was requested
   */
  reasonCode?: Array<CodeableConcept>;
  /* 
   * The reason why the supply item was requested
   */
  reasonReference?: Array<Reference>;
  /* 
   * The origin of the supply
   */
  deliverFrom?: Reference;
  /* 
   * The destination of the supply
   */
  deliverTo?: Reference;
}

export interface TaskRestriction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * How many times to repeat
   */
  repetitions?: positiveInt;
  /* 
   * When fulfillment sought
   */
  period?: Period;
  /* 
   * For whom is fulfillment sought?
   */
  recipient?: Array<Reference>;
}
export interface TaskInput {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Label for the input
   */
  type: CodeableConcept;
  /* 
   * Content to use in performing the task
   */
  valueBase64Binary?: base64Binary;
  /* 
   * Content to use in performing the task
   */
  valueBoolean?: boolean;
  /* 
   * Content to use in performing the task
   */
  valueCanonical?: canonical;
  /* 
   * Content to use in performing the task
   */
  valueCode?: code;
  /* 
   * Content to use in performing the task
   */
  valueDate?: date;
  /* 
   * Content to use in performing the task
   */
  valueDateTime?: dateTime;
  /* 
   * Content to use in performing the task
   */
  valueDecimal?: decimal;
  /* 
   * Content to use in performing the task
   */
  valueId?: id;
  /* 
   * Content to use in performing the task
   */
  valueInstant?: instant;
  /* 
   * Content to use in performing the task
   */
  valueInteger?: integer;
  /* 
   * Content to use in performing the task
   */
  valueMarkdown?: markdown;
  /* 
   * Content to use in performing the task
   */
  valueOid?: oid;
  /* 
   * Content to use in performing the task
   */
  valuePositiveInt?: positiveInt;
  /* 
   * Content to use in performing the task
   */
  valueString?: string;
  /* 
   * Content to use in performing the task
   */
  valueTime?: time;
  /* 
   * Content to use in performing the task
   */
  valueUnsignedInt?: unsignedInt;
  /* 
   * Content to use in performing the task
   */
  valueUri?: uri;
  /* 
   * Content to use in performing the task
   */
  valueUrl?: url;
  /* 
   * Content to use in performing the task
   */
  valueUuid?: uuid;
  /* 
   * Content to use in performing the task
   */
  valueAddress?: Address;
  /* 
   * Content to use in performing the task
   */
  valueAge?: Age;
  /* 
   * Content to use in performing the task
   */
  valueAnnotation?: Annotation;
  /* 
   * Content to use in performing the task
   */
  valueAttachment?: Attachment;
  /* 
   * Content to use in performing the task
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * Content to use in performing the task
   */
  valueCoding?: Coding;
  /* 
   * Content to use in performing the task
   */
  valueContactPoint?: ContactPoint;
  /* 
   * Content to use in performing the task
   */
  valueCount?: Count;
  /* 
   * Content to use in performing the task
   */
  valueDistance?: Distance;
  /* 
   * Content to use in performing the task
   */
  valueDuration?: Duration;
  /* 
   * Content to use in performing the task
   */
  valueHumanName?: HumanName;
  /* 
   * Content to use in performing the task
   */
  valueIdentifier?: Identifier;
  /* 
   * Content to use in performing the task
   */
  valueMoney?: Money;
  /* 
   * Content to use in performing the task
   */
  valuePeriod?: Period;
  /* 
   * Content to use in performing the task
   */
  valueQuantity?: Quantity;
  /* 
   * Content to use in performing the task
   */
  valueRange?: Range;
  /* 
   * Content to use in performing the task
   */
  valueRatio?: Ratio;
  /* 
   * Content to use in performing the task
   */
  valueReference?: Reference;
  /* 
   * Content to use in performing the task
   */
  valueSampledData?: SampledData;
  /* 
   * Content to use in performing the task
   */
  valueSignature?: Signature;
  /* 
   * Content to use in performing the task
   */
  valueTiming?: Timing;
  /* 
   * Content to use in performing the task
   */
  valueContactDetail?: ContactDetail;
  /* 
   * Content to use in performing the task
   */
  valueContributor?: Contributor;
  /* 
   * Content to use in performing the task
   */
  valueDataRequirement?: DataRequirement;
  /* 
   * Content to use in performing the task
   */
  valueExpression?: Expression;
  /* 
   * Content to use in performing the task
   */
  valueParameterDefinition?: ParameterDefinition;
  /* 
   * Content to use in performing the task
   */
  valueRelatedArtifact?: RelatedArtifact;
  /* 
   * Content to use in performing the task
   */
  valueTriggerDefinition?: TriggerDefinition;
  /* 
   * Content to use in performing the task
   */
  valueUsageContext?: UsageContext;
  /* 
   * Content to use in performing the task
   */
  valueDosage?: Dosage;
  /* 
   * Content to use in performing the task
   */
  valueMeta?: Meta;
}
export interface TaskOutput {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Label for output
   */
  type: CodeableConcept;
  /* 
   * Result of output
   */
  valueBase64Binary?: base64Binary;
  /* 
   * Result of output
   */
  valueBoolean?: boolean;
  /* 
   * Result of output
   */
  valueCanonical?: canonical;
  /* 
   * Result of output
   */
  valueCode?: code;
  /* 
   * Result of output
   */
  valueDate?: date;
  /* 
   * Result of output
   */
  valueDateTime?: dateTime;
  /* 
   * Result of output
   */
  valueDecimal?: decimal;
  /* 
   * Result of output
   */
  valueId?: id;
  /* 
   * Result of output
   */
  valueInstant?: instant;
  /* 
   * Result of output
   */
  valueInteger?: integer;
  /* 
   * Result of output
   */
  valueMarkdown?: markdown;
  /* 
   * Result of output
   */
  valueOid?: oid;
  /* 
   * Result of output
   */
  valuePositiveInt?: positiveInt;
  /* 
   * Result of output
   */
  valueString?: string;
  /* 
   * Result of output
   */
  valueTime?: time;
  /* 
   * Result of output
   */
  valueUnsignedInt?: unsignedInt;
  /* 
   * Result of output
   */
  valueUri?: uri;
  /* 
   * Result of output
   */
  valueUrl?: url;
  /* 
   * Result of output
   */
  valueUuid?: uuid;
  /* 
   * Result of output
   */
  valueAddress?: Address;
  /* 
   * Result of output
   */
  valueAge?: Age;
  /* 
   * Result of output
   */
  valueAnnotation?: Annotation;
  /* 
   * Result of output
   */
  valueAttachment?: Attachment;
  /* 
   * Result of output
   */
  valueCodeableConcept?: CodeableConcept;
  /* 
   * Result of output
   */
  valueCoding?: Coding;
  /* 
   * Result of output
   */
  valueContactPoint?: ContactPoint;
  /* 
   * Result of output
   */
  valueCount?: Count;
  /* 
   * Result of output
   */
  valueDistance?: Distance;
  /* 
   * Result of output
   */
  valueDuration?: Duration;
  /* 
   * Result of output
   */
  valueHumanName?: HumanName;
  /* 
   * Result of output
   */
  valueIdentifier?: Identifier;
  /* 
   * Result of output
   */
  valueMoney?: Money;
  /* 
   * Result of output
   */
  valuePeriod?: Period;
  /* 
   * Result of output
   */
  valueQuantity?: Quantity;
  /* 
   * Result of output
   */
  valueRange?: Range;
  /* 
   * Result of output
   */
  valueRatio?: Ratio;
  /* 
   * Result of output
   */
  valueReference?: Reference;
  /* 
   * Result of output
   */
  valueSampledData?: SampledData;
  /* 
   * Result of output
   */
  valueSignature?: Signature;
  /* 
   * Result of output
   */
  valueTiming?: Timing;
  /* 
   * Result of output
   */
  valueContactDetail?: ContactDetail;
  /* 
   * Result of output
   */
  valueContributor?: Contributor;
  /* 
   * Result of output
   */
  valueDataRequirement?: DataRequirement;
  /* 
   * Result of output
   */
  valueExpression?: Expression;
  /* 
   * Result of output
   */
  valueParameterDefinition?: ParameterDefinition;
  /* 
   * Result of output
   */
  valueRelatedArtifact?: RelatedArtifact;
  /* 
   * Result of output
   */
  valueTriggerDefinition?: TriggerDefinition;
  /* 
   * Result of output
   */
  valueUsageContext?: UsageContext;
  /* 
   * Result of output
   */
  valueDosage?: Dosage;
  /* 
   * Result of output
   */
  valueMeta?: Meta;
}
export interface Task {
resourceType: "Task"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Task Instance Identifier
   */
  identifier?: Array<Identifier>;
  /* 
   * Formal definition of task
   */
  instantiatesCanonical?: canonical;
  /* 
   * Formal definition of task
   */
  instantiatesUri?: uri;
  /* 
   * Request fulfilled by this task
   */
  basedOn?: Array<Reference>;
  /* 
   * Requisition or grouper id
   */
  groupIdentifier?: Identifier;
  /* 
   * Composite task
   */
  partOf?: Array<Reference>;
  /* 
   * draft | requested | received | accepted | +
   */
  status: code;
  /* 
   * Reason for current status
   */
  statusReason?: CodeableConcept;
  /* 
   * E.g. "Specimen collected", "IV prepped"
   */
  businessStatus?: CodeableConcept;
  /* 
   * unknown | proposal | plan | order | original-order | reflex-order | filler-order | instance-order | option
   */
  intent: code;
  /* 
   * routine | urgent | asap | stat
   */
  priority?: code;
  /* 
   * Task Type
   */
  code?: CodeableConcept;
  /* 
   * Human-readable explanation of task
   */
  description?: string;
  /* 
   * What task is acting on
   */
  focus?: Reference;
  /* 
   * Beneficiary of the Task
   */
  for?: Reference;
  /* 
   * Healthcare event during which this task originated
   */
  encounter?: Reference;
  /* 
   * Start and end time of execution
   */
  executionPeriod?: Period;
  /* 
   * Task Creation Date
   */
  authoredOn?: dateTime;
  /* 
   * Task Last Modified Date
   */
  lastModified?: dateTime;
  /* 
   * Who is asking for task to be done
   */
  requester?: Reference;
  /* 
   * Requested performer
   */
  performerType?: Array<CodeableConcept>;
  /* 
   * Responsible individual
   */
  owner?: Reference;
  /* 
   * Where task occurs
   */
  location?: Reference;
  /* 
   * Why task is needed
   */
  reasonCode?: CodeableConcept;
  /* 
   * Why task is needed
   */
  reasonReference?: Reference;
  /* 
   * Associated insurance coverage
   */
  insurance?: Array<Reference>;
  /* 
   * Comments made about the task
   */
  note?: Array<Annotation>;
  /* 
   * Key events in history of the Task
   */
  relevantHistory?: Array<Reference>;
  /* 
   * Constraints on fulfillment tasks
   */
  restriction?: TaskRestriction;
  /* 
   * Information used to perform task
   */
  input?: Array<TaskInput>;
  /* 
   * Information produced as part of task
   */
  output?: Array<TaskOutput>;
}

export interface TerminologyCapabilitiesSoftware {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A name the software is known by
   */
  name: string;
  /* 
   * Version covered by this statement
   */
  version?: string;
}
export interface TerminologyCapabilitiesImplementation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Describes this specific instance
   */
  description: string;
  /* 
   * Base URL for the implementation
   */
  url?: url;
}
export interface TerminologyCapabilitiesCodeSystemVersionFilter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code of the property supported
   */
  code: code;
  /* 
   * Operations supported for the property
   */
  op: Array<code>;
}
export interface TerminologyCapabilitiesCodeSystemVersion {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Version identifier for this version
   */
  code?: string;
  /* 
   * If this is the default version for this code system
   */
  isDefault?: boolean;
  /* 
   * If compositional grammar is supported
   */
  compositional?: boolean;
  /* 
   * Language Displays supported
   */
  language?: Array<code>;
  /* 
   * Filter Properties supported
   */
  filter?: Array<TerminologyCapabilitiesCodeSystemVersionFilter>;
  /* 
   * Properties supported for $lookup
   */
  property?: Array<code>;
}
export interface TerminologyCapabilitiesCodeSystem {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * URI for the Code System
   */
  uri?: canonical;
  /* 
   * Version of Code System supported
   */
  version?: Array<TerminologyCapabilitiesCodeSystemVersion>;
  /* 
   * Whether subsumption is supported
   */
  subsumption?: boolean;
}
export interface TerminologyCapabilitiesExpansionParameter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Expansion Parameter name
   */
  name: code;
  /* 
   * Description of support for parameter
   */
  documentation?: string;
}
export interface TerminologyCapabilitiesExpansion {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Whether the server can return nested value sets
   */
  hierarchical?: boolean;
  /* 
   * Whether the server supports paging on expansion
   */
  paging?: boolean;
  /* 
   * Allow request for incomplete expansions?
   */
  incomplete?: boolean;
  /* 
   * Supported expansion parameter
   */
  parameter?: Array<TerminologyCapabilitiesExpansionParameter>;
  /* 
   * Documentation about text searching works
   */
  textFilter?: markdown;
}
export interface TerminologyCapabilitiesValidateCode {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Whether translations are validated
   */
  translations: boolean;
}
export interface TerminologyCapabilitiesTranslation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Whether the client must identify the map
   */
  needsMap: boolean;
}
export interface TerminologyCapabilitiesClosure {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * If cross-system closure is supported
   */
  translation?: boolean;
}
export interface TerminologyCapabilities {
resourceType: "TerminologyCapabilities"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this terminology capabilities, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Business version of the terminology capabilities
   */
  version?: string;
  /* 
   * Name for this terminology capabilities (computer friendly)
   */
  name?: string;
  /* 
   * Name for this terminology capabilities (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the terminology capabilities
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for terminology capabilities (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this terminology capabilities is defined
   */
  purpose?: markdown;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * instance | capability | requirements
   */
  kind: code;
  /* 
   * Software that is covered by this terminology capability statement
   */
  software?: TerminologyCapabilitiesSoftware;
  /* 
   * If this describes a specific instance
   */
  implementation?: TerminologyCapabilitiesImplementation;
  /* 
   * Whether lockedDate is supported
   */
  lockedDate?: boolean;
  /* 
   * A code system supported by the server
   */
  codeSystem?: Array<TerminologyCapabilitiesCodeSystem>;
  /* 
   * Information about the [ValueSet/$expand](valueset-operation-expand.html) operation
   */
  expansion?: TerminologyCapabilitiesExpansion;
  /* 
   * explicit | all
   */
  codeSearch?: code;
  /* 
   * Information about the [ValueSet/$validate-code](valueset-operation-validate-code.html) operation
   */
  validateCode?: TerminologyCapabilitiesValidateCode;
  /* 
   * Information about the [ConceptMap/$translate](conceptmap-operation-translate.html) operation
   */
  translation?: TerminologyCapabilitiesTranslation;
  /* 
   * Information about the [ConceptMap/$closure](conceptmap-operation-closure.html) operation
   */
  closure?: TerminologyCapabilitiesClosure;
}

export interface TestReportParticipant {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * test-engine | client | server
   */
  type: code;
  /* 
   * The uri of the participant. An absolute URL is preferred
   */
  uri: uri;
  /* 
   * The display name of the participant
   */
  display?: string;
}
export interface TestReportSetupActionOperation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * pass | skip | fail | warning | error
   */
  result: code;
  /* 
   * A message associated with the result
   */
  message?: markdown;
  /* 
   * A link to further details on the result
   */
  detail?: uri;
}
export interface TestReportSetupActionAssert {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * pass | skip | fail | warning | error
   */
  result: code;
  /* 
   * A message associated with the result
   */
  message?: markdown;
  /* 
   * A link to further details on the result
   */
  detail?: string;
}
export interface TestReportSetupAction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The operation to perform
   */
  operation?: TestReportSetupActionOperation;
  /* 
   * The assertion to perform
   */
  assert?: TestReportSetupActionAssert;
}
export interface TestReportSetup {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A setup operation or assert that was executed
   */
  action: Array<TestReportSetupAction>;
}
export interface TestReportTestAction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The operation performed
   */
  operation?: TestReportSetupActionOperation;
  /* 
   * The assertion performed
   */
  assert?: TestReportSetupActionAssert;
}
export interface TestReportTest {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Tracking/logging name of this test
   */
  name?: string;
  /* 
   * Tracking/reporting short description of the test
   */
  description?: string;
  /* 
   * A test operation or assert that was performed
   */
  action: Array<TestReportTestAction>;
}
export interface TestReportTeardownAction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The teardown operation performed
   */
  operation: TestReportSetupActionOperation;
}
export interface TestReportTeardown {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * One or more teardown operations performed
   */
  action: Array<TestReportTeardownAction>;
}
export interface TestReport {
resourceType: "TestReport"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * External identifier
   */
  identifier?: Identifier;
  /* 
   * Informal name of the executed TestScript
   */
  name?: string;
  /* 
   * completed | in-progress | waiting | stopped | entered-in-error
   */
  status: code;
  /* 
   * Reference to the  version-specific TestScript that was executed to produce this TestReport
   */
  testScript: Reference;
  /* 
   * pass | fail | pending
   */
  result: code;
  /* 
   * The final score (percentage of tests passed) resulting from the execution of the TestScript
   */
  score?: decimal;
  /* 
   * Name of the tester producing this report (Organization or individual)
   */
  tester?: string;
  /* 
   * When the TestScript was executed and this TestReport was generated
   */
  issued?: dateTime;
  /* 
   * A participant in the test execution, either the execution engine, a client, or a server
   */
  participant?: Array<TestReportParticipant>;
  /* 
   * The results of the series of required setup operations before the tests were executed
   */
  setup?: TestReportSetup;
  /* 
   * A test executed from the test script
   */
  test?: Array<TestReportTest>;
  /* 
   * The results of running the series of required clean up steps
   */
  teardown?: TestReportTeardown;
}

export interface TestScriptOrigin {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The index of the abstract origin server starting at 1
   */
  index: integer;
  /* 
   * FHIR-Client | FHIR-SDC-FormFiller
   */
  profile: Coding;
}
export interface TestScriptDestination {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The index of the abstract destination server starting at 1
   */
  index: integer;
  /* 
   * FHIR-Server | FHIR-SDC-FormManager | FHIR-SDC-FormReceiver | FHIR-SDC-FormProcessor
   */
  profile: Coding;
}
export interface TestScriptMetadataLink {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * URL to the specification
   */
  url: uri;
  /* 
   * Short description
   */
  description?: string;
}
export interface TestScriptMetadataCapability {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Are the capabilities required?
   */
  required: boolean;
  /* 
   * Are the capabilities validated?
   */
  validated: boolean;
  /* 
   * The expected capabilities of the server
   */
  description?: string;
  /* 
   * Which origin server these requirements apply to
   */
  origin?: Array<integer>;
  /* 
   * Which server these requirements apply to
   */
  destination?: integer;
  /* 
   * Links to the FHIR specification
   */
  link?: Array<uri>;
  /* 
   * Required Capability Statement
   */
  capabilities: canonical;
}
export interface TestScriptMetadata {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Links to the FHIR specification
   */
  link?: Array<TestScriptMetadataLink>;
  /* 
   * Capabilities  that are assumed to function correctly on the FHIR server being tested
   */
  capability: Array<TestScriptMetadataCapability>;
}
export interface TestScriptFixture {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Whether or not to implicitly create the fixture during setup
   */
  autocreate: boolean;
  /* 
   * Whether or not to implicitly delete the fixture during teardown
   */
  autodelete: boolean;
  /* 
   * Reference of the resource
   */
  resource?: Reference;
}
export interface TestScriptVariable {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Descriptive name for this variable
   */
  name: string;
  /* 
   * Default, hard-coded, or user-defined value for this variable
   */
  defaultValue?: string;
  /* 
   * Natural language description of the variable
   */
  description?: string;
  /* 
   * The FHIRPath expression against the fixture body
   */
  expression?: string;
  /* 
   * HTTP header field name for source
   */
  headerField?: string;
  /* 
   * Hint help text for default value to enter
   */
  hint?: string;
  /* 
   * XPath or JSONPath against the fixture body
   */
  path?: string;
  /* 
   * Fixture Id of source expression or headerField within this variable
   */
  sourceId?: id;
}
export interface TestScriptSetupActionOperationRequestHeader {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * HTTP header field name
   */
  field: string;
  /* 
   * HTTP headerfield value
   */
  value: string;
}
export interface TestScriptSetupActionOperation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The operation code type that will be executed
   */
  type?: Coding;
  /* 
   * Resource type
   */
  resource?: code;
  /* 
   * Tracking/logging operation label
   */
  label?: string;
  /* 
   * Tracking/reporting operation description
   */
  description?: string;
  /* 
   * Mime type to accept in the payload of the response, with charset etc.
   */
  accept?: code;
  /* 
   * Mime type of the request payload contents, with charset etc.
   */
  contentType?: code;
  /* 
   * Server responding to the request
   */
  destination?: integer;
  /* 
   * Whether or not to send the request url in encoded format
   */
  encodeRequestUrl: boolean;
  /* 
   * delete | get | options | patch | post | put | head
   */
  method?: code;
  /* 
   * Server initiating the request
   */
  origin?: integer;
  /* 
   * Explicitly defined path parameters
   */
  params?: string;
  /* 
   * Each operation can have one or more header elements
   */
  requestHeader?: Array<TestScriptSetupActionOperationRequestHeader>;
  /* 
   * Fixture Id of mapped request
   */
  requestId?: id;
  /* 
   * Fixture Id of mapped response
   */
  responseId?: id;
  /* 
   * Fixture Id of body for PUT and POST requests
   */
  sourceId?: id;
  /* 
   * Id of fixture used for extracting the [id],  [type], and [vid] for GET requests
   */
  targetId?: id;
  /* 
   * Request URL
   */
  url?: string;
}
export interface TestScriptSetupActionAssert {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Tracking/logging assertion label
   */
  label?: string;
  /* 
   * Tracking/reporting assertion description
   */
  description?: string;
  /* 
   * response | request
   */
  direction?: code;
  /* 
   * Id of the source fixture to be evaluated
   */
  compareToSourceId?: string;
  /* 
   * The FHIRPath expression to evaluate against the source fixture
   */
  compareToSourceExpression?: string;
  /* 
   * XPath or JSONPath expression to evaluate against the source fixture
   */
  compareToSourcePath?: string;
  /* 
   * Mime type to compare against the 'Content-Type' header
   */
  contentType?: code;
  /* 
   * The FHIRPath expression to be evaluated
   */
  expression?: string;
  /* 
   * HTTP header field name
   */
  headerField?: string;
  /* 
   * Fixture Id of minimum content resource
   */
  minimumId?: string;
  /* 
   * Perform validation on navigation links?
   */
  navigationLinks?: boolean;
  /* 
   * equals | notEquals | in | notIn | greaterThan | lessThan | empty | notEmpty | contains | notContains | eval
   */
  operator?: code;
  /* 
   * XPath or JSONPath expression
   */
  path?: string;
  /* 
   * delete | get | options | patch | post | put | head
   */
  requestMethod?: code;
  /* 
   * Request URL comparison value
   */
  requestURL?: string;
  /* 
   * Resource type
   */
  resource?: code;
  /* 
   * okay | created | noContent | notModified | bad | forbidden | notFound | methodNotAllowed | conflict | gone | preconditionFailed | unprocessable
   */
  response?: code;
  /* 
   * HTTP response code to test
   */
  responseCode?: string;
  /* 
   * Fixture Id of source expression or headerField
   */
  sourceId?: id;
  /* 
   * Profile Id of validation profile reference
   */
  validateProfileId?: id;
  /* 
   * The value to compare to
   */
  value?: string;
  /* 
   * Will this assert produce a warning only on error?
   */
  warningOnly: boolean;
}
export interface TestScriptSetupAction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The setup operation to perform
   */
  operation?: TestScriptSetupActionOperation;
  /* 
   * The assertion to perform
   */
  assert?: TestScriptSetupActionAssert;
}
export interface TestScriptSetup {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A setup operation or assert to perform
   */
  action: Array<TestScriptSetupAction>;
}
export interface TestScriptTestAction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The setup operation to perform
   */
  operation?: TestScriptSetupActionOperation;
  /* 
   * The setup assertion to perform
   */
  assert?: TestScriptSetupActionAssert;
}
export interface TestScriptTest {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Tracking/logging name of this test
   */
  name?: string;
  /* 
   * Tracking/reporting short description of the test
   */
  description?: string;
  /* 
   * A test operation or assert to perform
   */
  action: Array<TestScriptTestAction>;
}
export interface TestScriptTeardownAction {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The teardown operation to perform
   */
  operation: TestScriptSetupActionOperation;
}
export interface TestScriptTeardown {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * One or more teardown operations to perform
   */
  action: Array<TestScriptTeardownAction>;
}
export interface TestScript {
resourceType: "TestScript"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this test script, represented as a URI (globally unique)
   */
  url: uri;
  /* 
   * Additional identifier for the test script
   */
  identifier?: Identifier;
  /* 
   * Business version of the test script
   */
  version?: string;
  /* 
   * Name for this test script (computer friendly)
   */
  name: string;
  /* 
   * Name for this test script (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the test script
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for test script (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Why this test script is defined
   */
  purpose?: markdown;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * An abstract server representing a client or sender in a message exchange
   */
  origin?: Array<TestScriptOrigin>;
  /* 
   * An abstract server representing a destination or receiver in a message exchange
   */
  destination?: Array<TestScriptDestination>;
  /* 
   * Required capability that is assumed to function correctly on the FHIR server being tested
   */
  metadata?: TestScriptMetadata;
  /* 
   * Fixture in the test script - by reference (uri)
   */
  fixture?: Array<TestScriptFixture>;
  /* 
   * Reference of the validation profile
   */
  profile?: Array<Reference>;
  /* 
   * Placeholder for evaluated elements
   */
  variable?: Array<TestScriptVariable>;
  /* 
   * A series of required setup operations before tests are executed
   */
  setup?: TestScriptSetup;
  /* 
   * A test in this script
   */
  test?: Array<TestScriptTest>;
  /* 
   * A series of required clean up steps
   */
  teardown?: TestScriptTeardown;
}

export interface ValueSetComposeIncludeConceptDesignation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Human language of the designation
   */
  language?: code;
  /* 
   * Types of uses of designations
   */
  use?: Coding;
  /* 
   * The text value for this designation
   */
  value: string;
}
export interface ValueSetComposeIncludeConcept {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Code or expression from system
   */
  code: code;
  /* 
   * Text to display for this code for this value set in this valueset
   */
  display?: string;
  /* 
   * Additional representations for this concept
   */
  designation?: Array<ValueSetComposeIncludeConceptDesignation>;
}
export interface ValueSetComposeIncludeFilter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A property/filter defined by the code system
   */
  property: code;
  /* 
   * = | is-a | descendent-of | is-not-a | regex | in | not-in | generalizes | exists
   */
  op: code;
  /* 
   * Code from the system, or regex criteria, or boolean value for exists
   */
  value: string;
}
export interface ValueSetComposeInclude {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The system the codes come from
   */
  system?: uri;
  /* 
   * Specific version of the code system referred to
   */
  version?: string;
  /* 
   * A concept defined in the system
   */
  concept?: Array<ValueSetComposeIncludeConcept>;
  /* 
   * Select codes/concepts by their properties (including relationships)
   */
  filter?: Array<ValueSetComposeIncludeFilter>;
  /* 
   * Select the contents included in this value set
   */
  valueSet?: Array<canonical>;
}
export interface ValueSetCompose {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Fixed date for references with no specified version (transitive)
   */
  lockedDate?: date;
  /* 
   * Whether inactive codes are in the value set
   */
  inactive?: boolean;
  /* 
   * Include one or more codes from a code system or other value set(s)
   */
  include: Array<ValueSetComposeInclude>;
  /* 
   * Explicitly exclude codes from a code system or other value sets
   */
  exclude?: ValueSetComposeInclude;
}
export interface ValueSetExpansionParameter {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Name as assigned by the client or server
   */
  name: string;
  /* 
   * Value of the named parameter
   */
  valueString?: string;
  /* 
   * Value of the named parameter
   */
  valueBoolean?: boolean;
  /* 
   * Value of the named parameter
   */
  valueInteger?: integer;
  /* 
   * Value of the named parameter
   */
  valueDecimal?: decimal;
  /* 
   * Value of the named parameter
   */
  valueUri?: uri;
  /* 
   * Value of the named parameter
   */
  valueCode?: code;
  /* 
   * Value of the named parameter
   */
  valueDateTime?: dateTime;
}
export interface ValueSetExpansionContains {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * System value for the code
   */
  system?: uri;
  /* 
   * If user cannot select this entry
   */
  abstract?: boolean;
  /* 
   * If concept is inactive in the code system
   */
  inactive?: boolean;
  /* 
   * Version in which this code/display is defined
   */
  version?: string;
  /* 
   * Code - if blank, this is not a selectable code
   */
  code?: code;
  /* 
   * User display for the concept
   */
  display?: string;
  /* 
   * Additional representations for this item
   */
  designation?: ValueSetComposeIncludeConceptDesignation;
  /* 
   * Codes contained under this entry
   */
  contains?: ValueSetExpansionContains;
}
export interface ValueSetExpansion {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Identifies the value set expansion (business identifier)
   */
  identifier?: uri;
  /* 
   * Time ValueSet expansion happened
   */
  timestamp: dateTime;
  /* 
   * Total number of codes in the expansion
   */
  total?: integer;
  /* 
   * Offset at which this resource starts
   */
  offset?: integer;
  /* 
   * Parameter that controlled the expansion process
   */
  parameter?: Array<ValueSetExpansionParameter>;
  /* 
   * Codes in the value set
   */
  contains?: Array<ValueSetExpansionContains>;
}
export interface ValueSet {
resourceType: "ValueSet"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Canonical identifier for this value set, represented as a URI (globally unique)
   */
  url?: uri;
  /* 
   * Additional identifier for the value set (business identifier)
   */
  identifier?: Array<Identifier>;
  /* 
   * Business version of the value set
   */
  version?: string;
  /* 
   * Name for this value set (computer friendly)
   */
  name?: string;
  /* 
   * Name for this value set (human friendly)
   */
  title?: string;
  /* 
   * draft | active | retired | unknown
   */
  status: code;
  /* 
   * For testing purposes, not real usage
   */
  experimental?: boolean;
  /* 
   * Date last changed
   */
  date?: dateTime;
  /* 
   * Name of the publisher (organization or individual)
   */
  publisher?: string;
  /* 
   * Contact details for the publisher
   */
  contact?: Array<ContactDetail>;
  /* 
   * Natural language description of the value set
   */
  description?: markdown;
  /* 
   * The context that the content is intended to support
   */
  useContext?: Array<UsageContext>;
  /* 
   * Intended jurisdiction for value set (if applicable)
   */
  jurisdiction?: Array<CodeableConcept>;
  /* 
   * Indicates whether or not any change to the content logical definition may occur
   */
  immutable?: boolean;
  /* 
   * Why this value set is defined
   */
  purpose?: markdown;
  /* 
   * Use and/or publishing restrictions
   */
  copyright?: markdown;
  /* 
   * Content logical definition of the value set (CLD)
   */
  compose?: ValueSetCompose;
  /* 
   * Used when the value set is "expanded"
   */
  expansion?: ValueSetExpansion;
}

export interface VerificationResultPrimarySource {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Reference to the primary source
   */
  who?: Reference;
  /* 
   * Type of primary source (License Board; Primary Education; Continuing Education; Postal Service; Relationship owner; Registration Authority; legal source; issuing source; authoritative source)
   */
  type?: Array<CodeableConcept>;
  /* 
   * Method for exchanging information with the primary source
   */
  communicationMethod?: Array<CodeableConcept>;
  /* 
   * successful | failed | unknown
   */
  validationStatus?: CodeableConcept;
  /* 
   * When the target was validated against the primary source
   */
  validationDate?: dateTime;
  /* 
   * yes | no | undetermined
   */
  canPushUpdates?: CodeableConcept;
  /* 
   * specific | any | source
   */
  pushTypeAvailable?: Array<CodeableConcept>;
}
export interface VerificationResultAttestation {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * The individual or organization attesting to information
   */
  who?: Reference;
  /* 
   * When the who is asserting on behalf of another (organization or individual)
   */
  onBehalfOf?: Reference;
  /* 
   * The method by which attested information was submitted/retrieved
   */
  communicationMethod?: CodeableConcept;
  /* 
   * The date the information was attested to
   */
  date?: date;
  /* 
   * A digital identity certificate associated with the attestation source
   */
  sourceIdentityCertificate?: string;
  /* 
   * A digital identity certificate associated with the proxy entity submitting attested information on behalf of the attestation source
   */
  proxyIdentityCertificate?: string;
  /* 
   * Proxy signature
   */
  proxySignature?: Signature;
  /* 
   * Attester signature
   */
  sourceSignature?: Signature;
}
export interface VerificationResultValidator {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Reference to the organization validating information
   */
  organization: Reference;
  /* 
   * A digital identity certificate associated with the validator
   */
  identityCertificate?: string;
  /* 
   * Validator signature
   */
  attestationSignature?: Signature;
}
export interface VerificationResult {
resourceType: "VerificationResult"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * A resource that was validated
   */
  target?: Array<Reference>;
  /* 
   * The fhirpath location(s) within the resource that was validated
   */
  targetLocation?: Array<string>;
  /* 
   * none | initial | periodic
   */
  need?: CodeableConcept;
  /* 
   * attested | validated | in-process | req-revalid | val-fail | reval-fail
   */
  status: code;
  /* 
   * When the validation status was updated
   */
  statusDate?: dateTime;
  /* 
   * nothing | primary | multiple
   */
  validationType?: CodeableConcept;
  /* 
   * The primary process by which the target is validated (edit check; value set; primary source; multiple sources; standalone; in context)
   */
  validationProcess?: Array<CodeableConcept>;
  /* 
   * Frequency of revalidation
   */
  frequency?: Timing;
  /* 
   * The date/time validation was last completed (including failed validations)
   */
  lastPerformed?: dateTime;
  /* 
   * The date when target is next validated, if appropriate
   */
  nextScheduled?: date;
  /* 
   * fatal | warn | rec-only | none
   */
  failureAction?: CodeableConcept;
  /* 
   * Information about the primary source(s) involved in validation
   */
  primarySource?: Array<VerificationResultPrimarySource>;
  /* 
   * Information about the entity attesting to information
   */
  attestation?: VerificationResultAttestation;
  /* 
   * Information about the entity validating information
   */
  validator?: Array<VerificationResultValidator>;
}

export interface VisionPrescriptionLensSpecificationPrism {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Amount of adjustment
   */
  amount: decimal;
  /* 
   * up | down | in | out
   */
  base: code;
}
export interface VisionPrescriptionLensSpecification {
  /* 
   * Unique id for inter-element referencing
   */
  id?: string;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored even if unrecognized
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Product to be supplied
   */
  product: CodeableConcept;
  /* 
   * right | left
   */
  eye: code;
  /* 
   * Power of the lens
   */
  sphere?: decimal;
  /* 
   * Lens power for astigmatism
   */
  cylinder?: decimal;
  /* 
   * Lens meridian which contain no power for astigmatism
   */
  axis?: integer;
  /* 
   * Eye alignment compensation
   */
  prism?: Array<VisionPrescriptionLensSpecificationPrism>;
  /* 
   * Added power for multifocal levels
   */
  add?: decimal;
  /* 
   * Contact lens power
   */
  power?: decimal;
  /* 
   * Contact lens back curvature
   */
  backCurve?: decimal;
  /* 
   * Contact lens diameter
   */
  diameter?: decimal;
  /* 
   * Lens wear duration
   */
  duration?: Quantity;
  /* 
   * Color required
   */
  color?: string;
  /* 
   * Brand required
   */
  brand?: string;
  /* 
   * Notes for coatings
   */
  note?: Array<Annotation>;
}
export interface VisionPrescription {
resourceType: "VisionPrescription"
  /* 
   * Logical id of this artifact
   */
  id?: string;
  /* 
   * Metadata about the resource
   */
  meta?: Meta;
  /* 
   * A set of rules under which this content was created
   */
  implicitRules?: uri;
  /* 
   * Language of the resource content
   */
  language?: code;
  /* 
   * Text summary of the resource, for human interpretation
   */
  text?: Narrative;
  /* 
   * Contained, inline Resources
   */
  contained?: Array<Resource>;
  /* 
   * Additional content defined by implementations
   */
  extension?: Array<Extension>;
  /* 
   * Extensions that cannot be ignored
   */
  modifierExtension?: Array<Extension>;
  /* 
   * Business Identifier for vision prescription
   */
  identifier?: Array<Identifier>;
  /* 
   * active | cancelled | draft | entered-in-error
   */
  status: code;
  /* 
   * Response creation date
   */
  created: dateTime;
  /* 
   * Who prescription is for
   */
  patient: Reference;
  /* 
   * Created during encounter / admission / stay
   */
  encounter?: Reference;
  /* 
   * When prescription was authorized
   */
  dateWritten: dateTime;
  /* 
   * Who authorized the vision prescription
   */
  prescriber: Reference;
  /* 
   * Vision lens authorization
   */
  lensSpecification: Array<VisionPrescriptionLensSpecification>;
}