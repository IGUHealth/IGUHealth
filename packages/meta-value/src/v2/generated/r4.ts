// Do not this code is generated 
export default {
  "Resource": [
    {
      "_type_": "complex",
      "type": "Resource",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "Account": [
    {
      "_type_": "complex",
      "type": "Account",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "type": 11,
        "name": 12,
        "subject": 13,
        "servicePeriod": 14,
        "coverage": 15,
        "owner": 21,
        "description": 22,
        "guarantor": 23,
        "partOf": 30
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 16,
        "extension": 17,
        "modifierExtension": 18,
        "coverage": 19,
        "priority": 20
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "party": 27,
        "onHold": 28,
        "period": 29
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "ActivityDefinition": [
    {
      "_type_": "complex",
      "type": "ActivityDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "subtitle": 14,
        "status": 15,
        "experimental": 16,
        "subject": 17,
        "date": 18,
        "publisher": 19,
        "contact": 20,
        "description": 21,
        "useContext": 22,
        "jurisdiction": 23,
        "purpose": 24,
        "usage": 25,
        "copyright": 26,
        "approvalDate": 27,
        "lastReviewDate": 28,
        "effectivePeriod": 29,
        "topic": 30,
        "author": 31,
        "editor": 32,
        "reviewer": 33,
        "endorser": 34,
        "relatedArtifact": 35,
        "library": 36,
        "kind": 37,
        "profile": 38,
        "code": 39,
        "intent": 40,
        "priority": 41,
        "doNotPerform": 42,
        "timing": 43,
        "location": 44,
        "participant": 45,
        "product": 51,
        "quantity": 52,
        "dosage": 53,
        "bodySite": 54,
        "specimenRequirement": 55,
        "observationRequirement": 56,
        "observationResultRequirement": 57,
        "transform": 58,
        "dynamicValue": 59
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "subjectCodeableConcept": "CodeableConcept",
        "subjectReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "timingTiming": "Timing",
        "timingDateTime": "dateTime",
        "timingAge": "Age",
        "timingPeriod": "Period",
        "timingRange": "Range",
        "timingDuration": "Duration"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 46,
        "extension": 47,
        "modifierExtension": 48,
        "type": 49,
        "role": 50
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "productReference": "Reference",
        "productCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Dosage",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 60,
        "extension": 61,
        "modifierExtension": 62,
        "path": 63,
        "expression": 64
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    }
  ],
  "AdverseEvent": [
    {
      "_type_": "complex",
      "type": "AdverseEvent",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "actuality": 10,
        "category": 11,
        "event": 12,
        "subject": 13,
        "encounter": 14,
        "date": 15,
        "detected": 16,
        "recordedDate": 17,
        "resultingCondition": 18,
        "location": 19,
        "seriousness": 20,
        "severity": 21,
        "outcome": 22,
        "recorder": 23,
        "contributor": 24,
        "suspectEntity": 25,
        "subjectMedicalHistory": 38,
        "referenceDocument": 39,
        "study": 40
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 26,
        "extension": 27,
        "modifierExtension": 28,
        "instance": 29,
        "causality": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "assessment": 34,
        "productRelatedness": 35,
        "author": 36,
        "method": 37
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "AllergyIntolerance": [
    {
      "_type_": "complex",
      "type": "AllergyIntolerance",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "clinicalStatus": 10,
        "verificationStatus": 11,
        "type": 12,
        "category": 13,
        "criticality": 14,
        "code": 15,
        "patient": 16,
        "encounter": 17,
        "onset": 18,
        "recordedDate": 19,
        "recorder": 20,
        "asserter": 21,
        "lastOccurrence": 22,
        "note": 23,
        "reaction": 24
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "onsetDateTime": "dateTime",
        "onsetAge": "Age",
        "onsetPeriod": "Period",
        "onsetRange": "Range",
        "onsetString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 25,
        "extension": 26,
        "modifierExtension": 27,
        "substance": 28,
        "manifestation": 29,
        "description": 30,
        "onset": 31,
        "severity": 32,
        "exposureRoute": 33,
        "note": 34
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "Appointment": [
    {
      "_type_": "complex",
      "type": "Appointment",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "cancelationReason": 11,
        "serviceCategory": 12,
        "serviceType": 13,
        "specialty": 14,
        "appointmentType": 15,
        "reasonCode": 16,
        "reasonReference": 17,
        "priority": 18,
        "description": 19,
        "supportingInformation": 20,
        "start": 21,
        "end": 22,
        "minutesDuration": 23,
        "slot": 24,
        "created": 25,
        "comment": 26,
        "patientInstruction": 27,
        "basedOn": 28,
        "participant": 29,
        "requestedPeriod": 38
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 30,
        "extension": 31,
        "modifierExtension": 32,
        "type": 33,
        "actor": 34,
        "required": 35,
        "status": 36,
        "period": 37
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "array"
    }
  ],
  "AppointmentResponse": [
    {
      "_type_": "complex",
      "type": "AppointmentResponse",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "appointment": 10,
        "start": 11,
        "end": 12,
        "participantType": 13,
        "actor": 14,
        "participantStatus": 15,
        "comment": 16
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "AuditEvent": [
    {
      "_type_": "complex",
      "type": "AuditEvent",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "type": 9,
        "subtype": 10,
        "action": 11,
        "period": 12,
        "recorded": 13,
        "outcome": 14,
        "outcomeDesc": 15,
        "purposeOfEvent": 16,
        "agent": 17,
        "source": 37,
        "entity": 44
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 18,
        "extension": 19,
        "modifierExtension": 20,
        "type": 21,
        "role": 22,
        "who": 23,
        "altId": 24,
        "name": 25,
        "requestor": 26,
        "location": 27,
        "policy": 28,
        "media": 29,
        "network": 30,
        "purposeOfUse": 36
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "address": 34,
        "type": 35
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 38,
        "extension": 39,
        "modifierExtension": 40,
        "site": 41,
        "observer": 42,
        "type": 43
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 45,
        "extension": 46,
        "modifierExtension": 47,
        "what": 48,
        "type": 49,
        "role": 50,
        "lifecycle": 51,
        "securityLabel": 52,
        "name": 53,
        "description": 54,
        "query": 55,
        "detail": 56
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "base64Binary",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 57,
        "extension": 58,
        "modifierExtension": 59,
        "type": 60,
        "value": 61
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueString": "string",
        "valueBase64Binary": "base64Binary"
      }
    }
  ],
  "Basic": [
    {
      "_type_": "complex",
      "type": "Basic",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "code": 10,
        "subject": 11,
        "created": 12,
        "author": 13
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "Binary": [
    {
      "_type_": "complex",
      "type": "Binary",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "contentType": 5,
        "securityContext": 6,
        "data": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "base64Binary",
      "cardinality": "single"
    }
  ],
  "BiologicallyDerivedProduct": [
    {
      "_type_": "complex",
      "type": "BiologicallyDerivedProduct",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "productCategory": 10,
        "productCode": 11,
        "status": 12,
        "request": 13,
        "quantity": 14,
        "parent": 15,
        "collection": 16,
        "processing": 23,
        "manipulation": 31,
        "storage": 37
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 17,
        "extension": 18,
        "modifierExtension": 19,
        "collector": 20,
        "source": 21,
        "collected": 22
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "collectedDateTime": "dateTime",
        "collectedPeriod": "Period"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "description": 27,
        "procedure": 28,
        "additive": 29,
        "time": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "timeDateTime": "dateTime",
        "timePeriod": "Period"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 32,
        "extension": 33,
        "modifierExtension": 34,
        "description": 35,
        "time": 36
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "timeDateTime": "dateTime",
        "timePeriod": "Period"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 38,
        "extension": 39,
        "modifierExtension": 40,
        "description": 41,
        "temperature": 42,
        "scale": 43,
        "duration": 44
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    }
  ],
  "BodyStructure": [
    {
      "_type_": "complex",
      "type": "BodyStructure",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "active": 10,
        "morphology": 11,
        "location": 12,
        "locationQualifier": 13,
        "description": 14,
        "image": 15,
        "patient": 16
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "Bundle": [
    {
      "_type_": "complex",
      "type": "Bundle",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "identifier": 5,
        "type": 6,
        "timestamp": 7,
        "total": 8,
        "link": 9,
        "entry": 15,
        "signature": 47
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 10,
        "extension": 11,
        "modifierExtension": 12,
        "relation": 13,
        "url": 14
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 16,
        "extension": 17,
        "modifierExtension": 18,
        "link": 9,
        "fullUrl": 20,
        "resource": 21,
        "search": 22,
        "request": 28,
        "response": 38
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 23,
        "extension": 24,
        "modifierExtension": 25,
        "mode": 26,
        "score": 27
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 29,
        "extension": 30,
        "modifierExtension": 31,
        "method": 32,
        "url": 33,
        "ifNoneMatch": 34,
        "ifModifiedSince": 35,
        "ifMatch": 36,
        "ifNoneExist": 37
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "status": 42,
        "location": 43,
        "etag": 44,
        "lastModified": 45,
        "outcome": 46
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Signature",
      "cardinality": "single"
    }
  ],
  "CapabilityStatement": [
    {
      "_type_": "complex",
      "type": "CapabilityStatement",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "version": 10,
        "name": 11,
        "title": 12,
        "status": 13,
        "experimental": 14,
        "date": 15,
        "publisher": 16,
        "contact": 17,
        "description": 18,
        "useContext": 19,
        "jurisdiction": 20,
        "purpose": 21,
        "copyright": 22,
        "kind": 23,
        "instantiates": 24,
        "imports": 25,
        "software": 26,
        "implementation": 33,
        "fhirVersion": 40,
        "format": 41,
        "patchFormat": 42,
        "implementationGuide": 43,
        "rest": 44,
        "messaging": 105,
        "document": 123
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 27,
        "extension": 28,
        "modifierExtension": 29,
        "name": 30,
        "version": 31,
        "releaseDate": 32
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 34,
        "extension": 35,
        "modifierExtension": 36,
        "description": 37,
        "url": 38,
        "custodian": 39
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "url",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 45,
        "extension": 46,
        "modifierExtension": 47,
        "mode": 48,
        "documentation": 49,
        "security": 50,
        "resource": 57,
        "interaction": 96,
        "searchParam": 81,
        "operation": 89,
        "compartment": 104
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 51,
        "extension": 52,
        "modifierExtension": 53,
        "cors": 54,
        "service": 55,
        "description": 56
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 58,
        "extension": 59,
        "modifierExtension": 60,
        "type": 61,
        "profile": 62,
        "supportedProfile": 63,
        "documentation": 64,
        "interaction": 65,
        "versioning": 71,
        "readHistory": 72,
        "updateCreate": 73,
        "conditionalCreate": 74,
        "conditionalRead": 75,
        "conditionalUpdate": 76,
        "conditionalDelete": 77,
        "referencePolicy": 78,
        "searchInclude": 79,
        "searchRevInclude": 80,
        "searchParam": 81,
        "operation": 89
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 66,
        "extension": 67,
        "modifierExtension": 68,
        "code": 69,
        "documentation": 70
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 82,
        "extension": 83,
        "modifierExtension": 84,
        "name": 85,
        "definition": 86,
        "type": 87,
        "documentation": 88
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 90,
        "extension": 91,
        "modifierExtension": 92,
        "name": 93,
        "definition": 94,
        "documentation": 95
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 97,
        "extension": 98,
        "modifierExtension": 99,
        "code": 100,
        "documentation": 101
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    null,
    null,
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 106,
        "extension": 107,
        "modifierExtension": 108,
        "endpoint": 109,
        "reliableCache": 115,
        "documentation": 116,
        "supportedMessage": 117
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 110,
        "extension": 111,
        "modifierExtension": 112,
        "protocol": 113,
        "address": 114
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "url",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 118,
        "extension": 119,
        "modifierExtension": 120,
        "mode": 121,
        "definition": 122
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 124,
        "extension": 125,
        "modifierExtension": 126,
        "mode": 127,
        "documentation": 128,
        "profile": 129
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    }
  ],
  "CarePlan": [
    {
      "_type_": "complex",
      "type": "CarePlan",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "instantiatesCanonical": 10,
        "instantiatesUri": 11,
        "basedOn": 12,
        "replaces": 13,
        "partOf": 14,
        "status": 15,
        "intent": 16,
        "category": 17,
        "title": 18,
        "description": 19,
        "subject": 20,
        "encounter": 21,
        "period": 22,
        "created": 23,
        "author": 24,
        "contributor": 25,
        "careTeam": 26,
        "addresses": 27,
        "supportingInfo": 28,
        "goal": 29,
        "activity": 30,
        "note": 59
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "outcomeCodeableConcept": 34,
        "outcomeReference": 35,
        "progress": 36,
        "reference": 37,
        "detail": 38
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "kind": 42,
        "instantiatesCanonical": 43,
        "instantiatesUri": 44,
        "code": 45,
        "reasonCode": 46,
        "reasonReference": 47,
        "goal": 48,
        "status": 49,
        "statusReason": 50,
        "doNotPerform": 51,
        "scheduled": 52,
        "location": 53,
        "performer": 54,
        "product": 55,
        "dailyAmount": 56,
        "quantity": 57,
        "description": 58
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "scheduledTiming": "Timing",
        "scheduledPeriod": "Period",
        "scheduledString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "productCodeableConcept": "CodeableConcept",
        "productReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "CareTeam": [
    {
      "_type_": "complex",
      "type": "CareTeam",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "category": 11,
        "name": 12,
        "subject": 13,
        "encounter": 14,
        "period": 15,
        "participant": 16,
        "reasonCode": 24,
        "reasonReference": 25,
        "managingOrganization": 26,
        "telecom": 27,
        "note": 28
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 17,
        "extension": 18,
        "modifierExtension": 19,
        "role": 20,
        "member": 21,
        "onBehalfOf": 22,
        "period": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "CatalogEntry": [
    {
      "_type_": "complex",
      "type": "CatalogEntry",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "type": 10,
        "orderable": 11,
        "referencedItem": 12,
        "additionalIdentifier": 13,
        "classification": 14,
        "status": 15,
        "validityPeriod": 16,
        "validTo": 17,
        "lastUpdated": 18,
        "additionalCharacteristic": 19,
        "additionalClassification": 20,
        "relatedEntry": 21
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 22,
        "extension": 23,
        "modifierExtension": 24,
        "relationtype": 25,
        "item": 26
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "ChargeItem": [
    {
      "_type_": "complex",
      "type": "ChargeItem",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "definitionUri": 10,
        "definitionCanonical": 11,
        "status": 12,
        "partOf": 13,
        "code": 14,
        "subject": 15,
        "context": 16,
        "occurrence": 17,
        "performer": 18,
        "performingOrganization": 24,
        "requestingOrganization": 25,
        "costCenter": 26,
        "quantity": 27,
        "bodysite": 28,
        "factorOverride": 29,
        "priceOverride": 30,
        "overrideReason": 31,
        "enterer": 32,
        "enteredDate": 33,
        "reason": 34,
        "service": 35,
        "product": 36,
        "account": 37,
        "note": 38,
        "supportingInformation": 39
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "occurrenceDateTime": "dateTime",
        "occurrencePeriod": "Period",
        "occurrenceTiming": "Timing"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 19,
        "extension": 20,
        "modifierExtension": 21,
        "function": 22,
        "actor": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "productReference": "Reference",
        "productCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "ChargeItemDefinition": [
    {
      "_type_": "complex",
      "type": "ChargeItemDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "title": 12,
        "derivedFromUri": 13,
        "partOf": 14,
        "replaces": 15,
        "status": 16,
        "experimental": 17,
        "date": 18,
        "publisher": 19,
        "contact": 20,
        "description": 21,
        "useContext": 22,
        "jurisdiction": 23,
        "copyright": 24,
        "approvalDate": 25,
        "lastReviewDate": 26,
        "effectivePeriod": 27,
        "code": 28,
        "instance": 29,
        "applicability": 30,
        "propertyGroup": 37
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "description": 34,
        "language": 35,
        "expression": 36
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 38,
        "extension": 39,
        "modifierExtension": 40,
        "applicability": 30,
        "priceComponent": 42
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 43,
        "extension": 44,
        "modifierExtension": 45,
        "type": 46,
        "code": 47,
        "factor": 48,
        "amount": 49
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    }
  ],
  "Claim": [
    {
      "_type_": "complex",
      "type": "Claim",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "type": 11,
        "subType": 12,
        "use": 13,
        "patient": 14,
        "billablePeriod": 15,
        "created": 16,
        "enterer": 17,
        "insurer": 18,
        "provider": 19,
        "priority": 20,
        "fundsReserve": 21,
        "related": 22,
        "prescription": 29,
        "originalPrescription": 30,
        "payee": 31,
        "referral": 37,
        "facility": 38,
        "careTeam": 39,
        "supportingInfo": 48,
        "diagnosis": 58,
        "procedure": 67,
        "insurance": 76,
        "accident": 87,
        "item": 94,
        "total": 148
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 23,
        "extension": 24,
        "modifierExtension": 25,
        "claim": 26,
        "relationship": 27,
        "reference": 28
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 32,
        "extension": 33,
        "modifierExtension": 34,
        "type": 35,
        "party": 36
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 40,
        "extension": 41,
        "modifierExtension": 42,
        "sequence": 43,
        "provider": 44,
        "responsible": 45,
        "role": 46,
        "qualification": 47
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 49,
        "extension": 50,
        "modifierExtension": 51,
        "sequence": 52,
        "category": 53,
        "code": 54,
        "timing": 55,
        "value": 56,
        "reason": 57
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "timingDate": "date",
        "timingPeriod": "Period"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueBoolean": "boolean",
        "valueString": "string",
        "valueQuantity": "Quantity",
        "valueAttachment": "Attachment",
        "valueReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 59,
        "extension": 60,
        "modifierExtension": 61,
        "sequence": 62,
        "diagnosis": 63,
        "type": 64,
        "onAdmission": 65,
        "packageCode": 66
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "diagnosisCodeableConcept": "CodeableConcept",
        "diagnosisReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 68,
        "extension": 69,
        "modifierExtension": 70,
        "sequence": 71,
        "type": 72,
        "date": 73,
        "procedure": 74,
        "udi": 75
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "procedureCodeableConcept": "CodeableConcept",
        "procedureReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 77,
        "extension": 78,
        "modifierExtension": 79,
        "sequence": 80,
        "focal": 81,
        "identifier": 82,
        "coverage": 83,
        "businessArrangement": 84,
        "preAuthRef": 85,
        "claimResponse": 86
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 88,
        "extension": 89,
        "modifierExtension": 90,
        "date": 91,
        "type": 92,
        "location": 93
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "locationAddress": "Address",
        "locationReference": "Reference"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 95,
        "extension": 96,
        "modifierExtension": 97,
        "sequence": 98,
        "careTeamSequence": 99,
        "diagnosisSequence": 100,
        "procedureSequence": 101,
        "informationSequence": 102,
        "revenue": 103,
        "category": 104,
        "productOrService": 105,
        "modifier": 106,
        "programCode": 107,
        "serviced": 108,
        "location": 109,
        "quantity": 110,
        "unitPrice": 111,
        "factor": 112,
        "net": 113,
        "udi": 114,
        "bodySite": 115,
        "subSite": 116,
        "encounter": 117,
        "detail": 118
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "servicedDate": "date",
        "servicedPeriod": "Period"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "locationCodeableConcept": "CodeableConcept",
        "locationAddress": "Address",
        "locationReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 119,
        "extension": 120,
        "modifierExtension": 121,
        "sequence": 122,
        "revenue": 123,
        "category": 124,
        "productOrService": 125,
        "modifier": 126,
        "programCode": 127,
        "quantity": 128,
        "unitPrice": 129,
        "factor": 130,
        "net": 131,
        "udi": 132,
        "subDetail": 133
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 134,
        "extension": 135,
        "modifierExtension": 136,
        "sequence": 137,
        "revenue": 138,
        "category": 139,
        "productOrService": 140,
        "modifier": 141,
        "programCode": 142,
        "quantity": 143,
        "unitPrice": 144,
        "factor": 145,
        "net": 146,
        "udi": 147
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    }
  ],
  "ClaimResponse": [
    {
      "_type_": "complex",
      "type": "ClaimResponse",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "type": 11,
        "subType": 12,
        "use": 13,
        "patient": 14,
        "created": 15,
        "insurer": 16,
        "requestor": 17,
        "request": 18,
        "outcome": 19,
        "disposition": 20,
        "preAuthRef": 21,
        "preAuthPeriod": 22,
        "payeeType": 23,
        "item": 24,
        "addItem": 52,
        "adjudication": 30,
        "total": 98,
        "payment": 104,
        "fundsReserve": 114,
        "formCode": 115,
        "form": 116,
        "processNote": 117,
        "communicationRequest": 125,
        "insurance": 126,
        "error": 135
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 25,
        "extension": 26,
        "modifierExtension": 27,
        "itemSequence": 28,
        "noteNumber": 29,
        "adjudication": 30,
        "detail": 38
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "category": 34,
        "reason": 35,
        "amount": 36,
        "value": 37
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "detailSequence": 42,
        "noteNumber": 43,
        "adjudication": 30,
        "subDetail": 45
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 46,
        "extension": 47,
        "modifierExtension": 48,
        "subDetailSequence": 49,
        "noteNumber": 50,
        "adjudication": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 53,
        "extension": 54,
        "modifierExtension": 55,
        "itemSequence": 56,
        "detailSequence": 57,
        "subdetailSequence": 58,
        "provider": 59,
        "productOrService": 60,
        "modifier": 61,
        "programCode": 62,
        "serviced": 63,
        "location": 64,
        "quantity": 65,
        "unitPrice": 66,
        "factor": 67,
        "net": 68,
        "bodySite": 69,
        "subSite": 70,
        "noteNumber": 71,
        "adjudication": 30,
        "detail": 73
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "servicedDate": "date",
        "servicedPeriod": "Period"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "locationCodeableConcept": "CodeableConcept",
        "locationAddress": "Address",
        "locationReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 74,
        "extension": 75,
        "modifierExtension": 76,
        "productOrService": 77,
        "modifier": 78,
        "quantity": 79,
        "unitPrice": 80,
        "factor": 81,
        "net": 82,
        "noteNumber": 83,
        "adjudication": 30,
        "subDetail": 85
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 86,
        "extension": 87,
        "modifierExtension": 88,
        "productOrService": 89,
        "modifier": 90,
        "quantity": 91,
        "unitPrice": 92,
        "factor": 93,
        "net": 94,
        "noteNumber": 95,
        "adjudication": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    null,
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 99,
        "extension": 100,
        "modifierExtension": 101,
        "category": 102,
        "amount": 103
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 105,
        "extension": 106,
        "modifierExtension": 107,
        "type": 108,
        "adjustment": 109,
        "adjustmentReason": 110,
        "date": 111,
        "amount": 112,
        "identifier": 113
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 118,
        "extension": 119,
        "modifierExtension": 120,
        "number": 121,
        "type": 122,
        "text": 123,
        "language": 124
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 127,
        "extension": 128,
        "modifierExtension": 129,
        "sequence": 130,
        "focal": 131,
        "coverage": 132,
        "businessArrangement": 133,
        "claimResponse": 134
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 136,
        "extension": 137,
        "modifierExtension": 138,
        "itemSequence": 139,
        "detailSequence": 140,
        "subDetailSequence": 141,
        "code": 142
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "ClinicalImpression": [
    {
      "_type_": "complex",
      "type": "ClinicalImpression",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "statusReason": 11,
        "code": 12,
        "description": 13,
        "subject": 14,
        "encounter": 15,
        "effective": 16,
        "date": 17,
        "assessor": 18,
        "previous": 19,
        "problem": 20,
        "investigation": 21,
        "protocol": 27,
        "summary": 28,
        "finding": 29,
        "prognosisCodeableConcept": 36,
        "prognosisReference": 37,
        "supportingInfo": 38,
        "note": 39
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "effectiveDateTime": "dateTime",
        "effectivePeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 22,
        "extension": 23,
        "modifierExtension": 24,
        "code": 25,
        "item": 26
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 30,
        "extension": 31,
        "modifierExtension": 32,
        "itemCodeableConcept": 33,
        "itemReference": 34,
        "basis": 35
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "CodeSystem": [
    {
      "_type_": "complex",
      "type": "CodeSystem",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "status": 14,
        "experimental": 15,
        "date": 16,
        "publisher": 17,
        "contact": 18,
        "description": 19,
        "useContext": 20,
        "jurisdiction": 21,
        "purpose": 22,
        "copyright": 23,
        "caseSensitive": 24,
        "valueSet": 25,
        "hierarchyMeaning": 26,
        "compositional": 27,
        "versionNeeded": 28,
        "content": 29,
        "supplements": 30,
        "count": 31,
        "filter": 32,
        "property": 40,
        "concept": 48
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 33,
        "extension": 34,
        "modifierExtension": 35,
        "code": 36,
        "description": 37,
        "operator": 38,
        "value": 39
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 41,
        "extension": 42,
        "modifierExtension": 43,
        "code": 44,
        "uri": 45,
        "description": 46,
        "type": 47
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 49,
        "extension": 50,
        "modifierExtension": 51,
        "code": 52,
        "display": 53,
        "definition": 54,
        "designation": 55,
        "property": 62,
        "concept": 48
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 56,
        "extension": 57,
        "modifierExtension": 58,
        "language": 59,
        "use": 60,
        "value": 61
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 63,
        "extension": 64,
        "modifierExtension": 65,
        "code": 66,
        "value": 67
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueCode": "code",
        "valueCoding": "Coding",
        "valueString": "string",
        "valueInteger": "integer",
        "valueBoolean": "boolean",
        "valueDateTime": "dateTime",
        "valueDecimal": "decimal"
      }
    }
  ],
  "Communication": [
    {
      "_type_": "complex",
      "type": "Communication",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "instantiatesCanonical": 10,
        "instantiatesUri": 11,
        "basedOn": 12,
        "partOf": 13,
        "inResponseTo": 14,
        "status": 15,
        "statusReason": 16,
        "category": 17,
        "priority": 18,
        "medium": 19,
        "subject": 20,
        "topic": 21,
        "about": 22,
        "encounter": 23,
        "sent": 24,
        "received": 25,
        "recipient": 26,
        "sender": 27,
        "reasonCode": 28,
        "reasonReference": 29,
        "payload": 30,
        "note": 35
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "content": 34
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "contentString": "string",
        "contentAttachment": "Attachment",
        "contentReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "CommunicationRequest": [
    {
      "_type_": "complex",
      "type": "CommunicationRequest",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "basedOn": 10,
        "replaces": 11,
        "groupIdentifier": 12,
        "status": 13,
        "statusReason": 14,
        "category": 15,
        "priority": 16,
        "doNotPerform": 17,
        "medium": 18,
        "subject": 19,
        "about": 20,
        "encounter": 21,
        "payload": 22,
        "occurrence": 27,
        "authoredOn": 28,
        "requester": 29,
        "recipient": 30,
        "sender": 31,
        "reasonCode": 32,
        "reasonReference": 33,
        "note": 34
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 23,
        "extension": 24,
        "modifierExtension": 25,
        "content": 26
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "contentString": "string",
        "contentAttachment": "Attachment",
        "contentReference": "Reference"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "occurrenceDateTime": "dateTime",
        "occurrencePeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "CompartmentDefinition": [
    {
      "_type_": "complex",
      "type": "CompartmentDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "version": 10,
        "name": 11,
        "status": 12,
        "experimental": 13,
        "date": 14,
        "publisher": 15,
        "contact": 16,
        "description": 17,
        "useContext": 18,
        "purpose": 19,
        "code": 20,
        "search": 21,
        "resource": 22
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 23,
        "extension": 24,
        "modifierExtension": 25,
        "code": 26,
        "param": 27,
        "documentation": 28
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "Composition": [
    {
      "_type_": "complex",
      "type": "Composition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "type": 11,
        "category": 12,
        "subject": 13,
        "encounter": 14,
        "date": 15,
        "author": 16,
        "title": 17,
        "confidentiality": 18,
        "attester": 19,
        "custodian": 26,
        "relatesTo": 27,
        "event": 33,
        "section": 40
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 20,
        "extension": 21,
        "modifierExtension": 22,
        "mode": 23,
        "time": 24,
        "party": 25
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 28,
        "extension": 29,
        "modifierExtension": 30,
        "code": 31,
        "target": 32
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "targetIdentifier": "Identifier",
        "targetReference": "Reference"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 34,
        "extension": 35,
        "modifierExtension": 36,
        "code": 37,
        "period": 38,
        "detail": 39
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 41,
        "extension": 42,
        "modifierExtension": 43,
        "title": 44,
        "code": 45,
        "author": 46,
        "focus": 47,
        "text": 48,
        "mode": 49,
        "orderedBy": 50,
        "entry": 51,
        "emptyReason": 52,
        "section": 40
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "ConceptMap": [
    {
      "_type_": "complex",
      "type": "ConceptMap",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "status": 14,
        "experimental": 15,
        "date": 16,
        "publisher": 17,
        "contact": 18,
        "description": 19,
        "useContext": 20,
        "jurisdiction": 21,
        "purpose": 22,
        "copyright": 23,
        "source": 24,
        "target": 25,
        "group": 26
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "sourceUri": "uri",
        "sourceCanonical": "canonical"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "targetUri": "uri",
        "targetCanonical": "canonical"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 27,
        "extension": 28,
        "modifierExtension": 29,
        "source": 30,
        "sourceVersion": 31,
        "target": 32,
        "targetVersion": 33,
        "element": 34,
        "unmapped": 57
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 35,
        "extension": 36,
        "modifierExtension": 37,
        "code": 38,
        "display": 39,
        "target": 40
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 41,
        "extension": 42,
        "modifierExtension": 43,
        "code": 44,
        "display": 45,
        "equivalence": 46,
        "comment": 47,
        "dependsOn": 48,
        "product": 48
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 49,
        "extension": 50,
        "modifierExtension": 51,
        "property": 52,
        "system": 53,
        "value": 54,
        "display": 55
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 58,
        "extension": 59,
        "modifierExtension": 60,
        "mode": 61,
        "code": 62,
        "display": 63,
        "url": 64
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    }
  ],
  "Condition": [
    {
      "_type_": "complex",
      "type": "Condition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "clinicalStatus": 10,
        "verificationStatus": 11,
        "category": 12,
        "severity": 13,
        "code": 14,
        "bodySite": 15,
        "subject": 16,
        "encounter": 17,
        "onset": 18,
        "abatement": 19,
        "recordedDate": 20,
        "recorder": 21,
        "asserter": 22,
        "stage": 23,
        "evidence": 30,
        "note": 36
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "onsetDateTime": "dateTime",
        "onsetAge": "Age",
        "onsetPeriod": "Period",
        "onsetRange": "Range",
        "onsetString": "string"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "abatementDateTime": "dateTime",
        "abatementAge": "Age",
        "abatementPeriod": "Period",
        "abatementRange": "Range",
        "abatementString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "summary": 27,
        "assessment": 28,
        "type": 29
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "code": 34,
        "detail": 35
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "Consent": [
    {
      "_type_": "complex",
      "type": "Consent",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "scope": 11,
        "category": 12,
        "patient": 13,
        "dateTime": 14,
        "performer": 15,
        "organization": 16,
        "source": 17,
        "policy": 18,
        "policyRule": 24,
        "verification": 25,
        "provision": 32
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "sourceAttachment": "Attachment",
        "sourceReference": "Reference"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 19,
        "extension": 20,
        "modifierExtension": 21,
        "authority": 22,
        "uri": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 26,
        "extension": 27,
        "modifierExtension": 28,
        "verified": 29,
        "verifiedWith": 30,
        "verificationDate": 31
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 33,
        "extension": 34,
        "modifierExtension": 35,
        "type": 36,
        "period": 37,
        "actor": 38,
        "action": 44,
        "securityLabel": 45,
        "purpose": 46,
        "class": 47,
        "code": 48,
        "dataPeriod": 49,
        "data": 50,
        "provision": 32
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "role": 42,
        "reference": 43
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 51,
        "extension": 52,
        "modifierExtension": 53,
        "meaning": 54,
        "reference": 55
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "Contract": [
    {
      "_type_": "complex",
      "type": "Contract",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "url": 10,
        "version": 11,
        "status": 12,
        "legalState": 13,
        "instantiatesCanonical": 14,
        "instantiatesUri": 15,
        "contentDerivative": 16,
        "issued": 17,
        "applies": 18,
        "expirationType": 19,
        "subject": 20,
        "authority": 21,
        "domain": 22,
        "site": 23,
        "name": 24,
        "title": 25,
        "subtitle": 26,
        "alias": 27,
        "author": 28,
        "scope": 29,
        "topic": 30,
        "type": 31,
        "subType": 32,
        "contentDefinition": 33,
        "term": 43,
        "supportingInfo": 158,
        "relevantHistory": 159,
        "signer": 160,
        "friendly": 167,
        "legal": 172,
        "rule": 177,
        "legallyBinding": 182
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "topicCodeableConcept": "CodeableConcept",
        "topicReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 34,
        "extension": 35,
        "modifierExtension": 36,
        "type": 37,
        "subType": 38,
        "publisher": 39,
        "publicationDate": 40,
        "publicationStatus": 41,
        "copyright": 42
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 44,
        "extension": 45,
        "modifierExtension": 46,
        "identifier": 47,
        "issued": 48,
        "applies": 49,
        "topic": 50,
        "type": 51,
        "subType": 52,
        "text": 53,
        "securityLabel": 54,
        "offer": 62,
        "asset": 85,
        "action": 127,
        "group": 43
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "topicCodeableConcept": "CodeableConcept",
        "topicReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 55,
        "extension": 56,
        "modifierExtension": 57,
        "number": 58,
        "classification": 59,
        "category": 60,
        "control": 61
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 63,
        "extension": 64,
        "modifierExtension": 65,
        "identifier": 66,
        "party": 67,
        "topic": 73,
        "type": 74,
        "decision": 75,
        "decisionMode": 76,
        "answer": 77,
        "text": 82,
        "linkId": 83,
        "securityLabelNumber": 84
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 68,
        "extension": 69,
        "modifierExtension": 70,
        "reference": 71,
        "role": 72
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 78,
        "extension": 79,
        "modifierExtension": 80,
        "value": 81
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueBoolean": "boolean",
        "valueDecimal": "decimal",
        "valueInteger": "integer",
        "valueDate": "date",
        "valueDateTime": "dateTime",
        "valueTime": "time",
        "valueString": "string",
        "valueUri": "uri",
        "valueAttachment": "Attachment",
        "valueCoding": "Coding",
        "valueQuantity": "Quantity",
        "valueReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 86,
        "extension": 87,
        "modifierExtension": 88,
        "scope": 89,
        "type": 90,
        "typeReference": 91,
        "subtype": 92,
        "relationship": 93,
        "context": 94,
        "condition": 101,
        "periodType": 102,
        "period": 103,
        "usePeriod": 104,
        "text": 105,
        "linkId": 106,
        "answer": 77,
        "securityLabelNumber": 108,
        "valuedItem": 109
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 95,
        "extension": 96,
        "modifierExtension": 97,
        "reference": 98,
        "code": 99,
        "text": 100
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 110,
        "extension": 111,
        "modifierExtension": 112,
        "entity": 113,
        "identifier": 114,
        "effectiveTime": 115,
        "quantity": 116,
        "unitPrice": 117,
        "factor": 118,
        "points": 119,
        "net": 120,
        "payment": 121,
        "paymentDate": 122,
        "responsible": 123,
        "recipient": 124,
        "linkId": 125,
        "securityLabelNumber": 126
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "entityCodeableConcept": "CodeableConcept",
        "entityReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 128,
        "extension": 129,
        "modifierExtension": 130,
        "doNotPerform": 131,
        "type": 132,
        "subject": 133,
        "intent": 139,
        "linkId": 140,
        "status": 141,
        "context": 142,
        "contextLinkId": 143,
        "occurrence": 144,
        "requester": 145,
        "requesterLinkId": 146,
        "performerType": 147,
        "performerRole": 148,
        "performer": 149,
        "performerLinkId": 150,
        "reasonCode": 151,
        "reasonReference": 152,
        "reason": 153,
        "reasonLinkId": 154,
        "note": 155,
        "securityLabelNumber": 156
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 134,
        "extension": 135,
        "modifierExtension": 136,
        "reference": 137,
        "role": 138
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "occurrenceDateTime": "dateTime",
        "occurrencePeriod": "Period",
        "occurrenceTiming": "Timing"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 161,
        "extension": 162,
        "modifierExtension": 163,
        "type": 164,
        "party": 165,
        "signature": 166
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Signature",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 168,
        "extension": 169,
        "modifierExtension": 170,
        "content": 171
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "contentAttachment": "Attachment",
        "contentReference": "Reference"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 173,
        "extension": 174,
        "modifierExtension": 175,
        "content": 176
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "contentAttachment": "Attachment",
        "contentReference": "Reference"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 178,
        "extension": 179,
        "modifierExtension": 180,
        "content": 181
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "contentAttachment": "Attachment",
        "contentReference": "Reference"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "legallyBindingAttachment": "Attachment",
        "legallyBindingReference": "Reference"
      }
    }
  ],
  "Coverage": [
    {
      "_type_": "complex",
      "type": "Coverage",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "type": 11,
        "policyHolder": 12,
        "subscriber": 13,
        "subscriberId": 14,
        "beneficiary": 15,
        "dependent": 16,
        "relationship": 17,
        "period": 18,
        "payor": 19,
        "class": 20,
        "order": 27,
        "network": 28,
        "costToBeneficiary": 29,
        "subrogation": 41,
        "contract": 42
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "type": 24,
        "value": 25,
        "name": 26
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 30,
        "extension": 31,
        "modifierExtension": 32,
        "type": 33,
        "value": 34,
        "exception": 35
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueQuantity": "Quantity",
        "valueMoney": "Money"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 36,
        "extension": 37,
        "modifierExtension": 38,
        "type": 39,
        "period": 40
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "CoverageEligibilityRequest": [
    {
      "_type_": "complex",
      "type": "CoverageEligibilityRequest",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "priority": 11,
        "purpose": 12,
        "patient": 13,
        "serviced": 14,
        "created": 15,
        "enterer": 16,
        "provider": 17,
        "insurer": 18,
        "facility": 19,
        "supportingInfo": 20,
        "insurance": 27,
        "item": 34
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "servicedDate": "date",
        "servicedPeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "sequence": 24,
        "information": 25,
        "appliesToAll": 26
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 28,
        "extension": 29,
        "modifierExtension": 30,
        "focal": 31,
        "coverage": 32,
        "businessArrangement": 33
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 35,
        "extension": 36,
        "modifierExtension": 37,
        "supportingInfoSequence": 38,
        "category": 39,
        "productOrService": 40,
        "modifier": 41,
        "provider": 42,
        "quantity": 43,
        "unitPrice": 44,
        "facility": 45,
        "diagnosis": 46,
        "detail": 51
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 47,
        "extension": 48,
        "modifierExtension": 49,
        "diagnosis": 50
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "diagnosisCodeableConcept": "CodeableConcept",
        "diagnosisReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "CoverageEligibilityResponse": [
    {
      "_type_": "complex",
      "type": "CoverageEligibilityResponse",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "purpose": 11,
        "patient": 12,
        "serviced": 13,
        "created": 14,
        "requestor": 15,
        "request": 16,
        "outcome": 17,
        "disposition": 18,
        "insurer": 19,
        "insurance": 20,
        "preAuthRef": 51,
        "form": 52,
        "error": 53
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "servicedDate": "date",
        "servicedPeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "coverage": 24,
        "inforce": 25,
        "benefitPeriod": 26,
        "item": 27
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 28,
        "extension": 29,
        "modifierExtension": 30,
        "category": 31,
        "productOrService": 32,
        "modifier": 33,
        "provider": 34,
        "excluded": 35,
        "name": 36,
        "description": 37,
        "network": 38,
        "unit": 39,
        "term": 40,
        "benefit": 41,
        "authorizationRequired": 48,
        "authorizationSupporting": 49,
        "authorizationUrl": 50
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 42,
        "extension": 43,
        "modifierExtension": 44,
        "type": 45,
        "allowed": 46,
        "used": 47
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "allowedUnsignedInt": "unsignedInt",
        "allowedString": "string",
        "allowedMoney": "Money"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "usedUnsignedInt": "unsignedInt",
        "usedString": "string",
        "usedMoney": "Money"
      }
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 54,
        "extension": 55,
        "modifierExtension": 56,
        "code": 57
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "DetectedIssue": [
    {
      "_type_": "complex",
      "type": "DetectedIssue",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "code": 11,
        "severity": 12,
        "patient": 13,
        "identified": 14,
        "author": 15,
        "implicated": 16,
        "evidence": 17,
        "detail": 23,
        "reference": 24,
        "mitigation": 25
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "identifiedDateTime": "dateTime",
        "identifiedPeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 18,
        "extension": 19,
        "modifierExtension": 20,
        "code": 21,
        "detail": 22
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 26,
        "extension": 27,
        "modifierExtension": 28,
        "action": 29,
        "date": 30,
        "author": 31
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "Device": [
    {
      "_type_": "complex",
      "type": "Device",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "definition": 10,
        "udiCarrier": 11,
        "status": 21,
        "statusReason": 22,
        "distinctIdentifier": 23,
        "manufacturer": 24,
        "manufactureDate": 25,
        "expirationDate": 26,
        "lotNumber": 27,
        "serialNumber": 28,
        "deviceName": 29,
        "modelNumber": 35,
        "partNumber": 36,
        "type": 37,
        "specialization": 38,
        "version": 44,
        "property": 51,
        "patient": 58,
        "owner": 59,
        "contact": 60,
        "location": 61,
        "url": 62,
        "note": 63,
        "safety": 64,
        "parent": 65
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 12,
        "extension": 13,
        "modifierExtension": 14,
        "deviceIdentifier": 15,
        "issuer": 16,
        "jurisdiction": 17,
        "carrierAIDC": 18,
        "carrierHRF": 19,
        "entryType": 20
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "base64Binary",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 30,
        "extension": 31,
        "modifierExtension": 32,
        "name": 33,
        "type": 34
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "systemType": 42,
        "version": 43
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 45,
        "extension": 46,
        "modifierExtension": 47,
        "type": 48,
        "component": 49,
        "value": 50
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 52,
        "extension": 53,
        "modifierExtension": 54,
        "type": 55,
        "valueQuantity": 56,
        "valueCode": 57
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "DeviceDefinition": [
    {
      "_type_": "complex",
      "type": "DeviceDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "udiDeviceIdentifier": 10,
        "manufacturer": 17,
        "deviceName": 18,
        "modelNumber": 24,
        "type": 25,
        "specialization": 26,
        "version": 32,
        "safety": 33,
        "shelfLifeStorage": 34,
        "physicalCharacteristics": 35,
        "languageCode": 36,
        "capability": 37,
        "property": 43,
        "owner": 50,
        "contact": 51,
        "url": 52,
        "onlineInformation": 53,
        "note": 54,
        "quantity": 55,
        "parentDevice": 56,
        "material": 57
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 11,
        "extension": 12,
        "modifierExtension": 13,
        "deviceIdentifier": 14,
        "issuer": 15,
        "jurisdiction": 16
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "manufacturerString": "string",
        "manufacturerReference": "Reference"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 19,
        "extension": 20,
        "modifierExtension": 21,
        "name": 22,
        "type": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 27,
        "extension": 28,
        "modifierExtension": 29,
        "systemType": 30,
        "version": 31
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ProductShelfLife",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ProdCharacteristic",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 38,
        "extension": 39,
        "modifierExtension": 40,
        "type": 41,
        "description": 42
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 44,
        "extension": 45,
        "modifierExtension": 46,
        "type": 47,
        "valueQuantity": 48,
        "valueCode": 49
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 58,
        "extension": 59,
        "modifierExtension": 60,
        "substance": 61,
        "alternate": 62,
        "allergenicIndicator": 63
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    }
  ],
  "DeviceMetric": [
    {
      "_type_": "complex",
      "type": "DeviceMetric",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "type": 10,
        "unit": 11,
        "source": 12,
        "parent": 13,
        "operationalStatus": 14,
        "color": 15,
        "category": 16,
        "measurementPeriod": 17,
        "calibration": 18
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Timing",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 19,
        "extension": 20,
        "modifierExtension": 21,
        "type": 22,
        "state": 23,
        "time": 24
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    }
  ],
  "DeviceRequest": [
    {
      "_type_": "complex",
      "type": "DeviceRequest",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "instantiatesCanonical": 10,
        "instantiatesUri": 11,
        "basedOn": 12,
        "priorRequest": 13,
        "groupIdentifier": 14,
        "status": 15,
        "intent": 16,
        "priority": 17,
        "code": 18,
        "parameter": 19,
        "subject": 25,
        "encounter": 26,
        "occurrence": 27,
        "authoredOn": 28,
        "requester": 29,
        "performerType": 30,
        "performer": 31,
        "reasonCode": 32,
        "reasonReference": 33,
        "insurance": 34,
        "supportingInfo": 35,
        "note": 36,
        "relevantHistory": 37
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "codeReference": "Reference",
        "codeCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 20,
        "extension": 21,
        "modifierExtension": 22,
        "code": 23,
        "value": 24
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueCodeableConcept": "CodeableConcept",
        "valueQuantity": "Quantity",
        "valueRange": "Range",
        "valueBoolean": "boolean"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "occurrenceDateTime": "dateTime",
        "occurrencePeriod": "Period",
        "occurrenceTiming": "Timing"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "DeviceUseStatement": [
    {
      "_type_": "complex",
      "type": "DeviceUseStatement",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "basedOn": 10,
        "status": 11,
        "subject": 12,
        "derivedFrom": 13,
        "timing": 14,
        "recordedOn": 15,
        "source": 16,
        "device": 17,
        "reasonCode": 18,
        "reasonReference": 19,
        "bodySite": 20,
        "note": 21
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "timingTiming": "Timing",
        "timingPeriod": "Period",
        "timingDateTime": "dateTime"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "DiagnosticReport": [
    {
      "_type_": "complex",
      "type": "DiagnosticReport",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "basedOn": 10,
        "status": 11,
        "category": 12,
        "code": 13,
        "subject": 14,
        "encounter": 15,
        "effective": 16,
        "issued": 17,
        "performer": 18,
        "resultsInterpreter": 19,
        "specimen": 20,
        "result": 21,
        "imagingStudy": 22,
        "media": 23,
        "conclusion": 29,
        "conclusionCode": 30,
        "presentedForm": 31
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "effectiveDateTime": "dateTime",
        "effectivePeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "comment": 27,
        "link": 28
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "array"
    }
  ],
  "DocumentManifest": [
    {
      "_type_": "complex",
      "type": "DocumentManifest",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "masterIdentifier": 9,
        "identifier": 10,
        "status": 11,
        "type": 12,
        "subject": 13,
        "created": 14,
        "author": 15,
        "recipient": 16,
        "source": 17,
        "description": 18,
        "content": 19,
        "related": 20
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "identifier": 24,
        "ref": 25
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "DocumentReference": [
    {
      "_type_": "complex",
      "type": "DocumentReference",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "masterIdentifier": 9,
        "identifier": 10,
        "status": 11,
        "docStatus": 12,
        "type": 13,
        "category": 14,
        "subject": 15,
        "date": 16,
        "author": 17,
        "authenticator": 18,
        "custodian": 19,
        "relatesTo": 20,
        "description": 26,
        "securityLabel": 27,
        "content": 28,
        "context": 34
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "code": 24,
        "target": 25
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 29,
        "extension": 30,
        "modifierExtension": 31,
        "attachment": 32,
        "format": 33
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 35,
        "extension": 36,
        "modifierExtension": 37,
        "encounter": 38,
        "event": 39,
        "period": 40,
        "facilityType": 41,
        "practiceSetting": 42,
        "sourcePatientInfo": 43,
        "related": 44
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "DomainResource": [
    {
      "_type_": "complex",
      "type": "DomainResource",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    }
  ],
  "EffectEvidenceSynthesis": [
    {
      "_type_": "complex",
      "type": "EffectEvidenceSynthesis",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "status": 14,
        "date": 15,
        "publisher": 16,
        "contact": 17,
        "description": 18,
        "note": 19,
        "useContext": 20,
        "jurisdiction": 21,
        "copyright": 22,
        "approvalDate": 23,
        "lastReviewDate": 24,
        "effectivePeriod": 25,
        "topic": 26,
        "author": 27,
        "editor": 28,
        "reviewer": 29,
        "endorser": 30,
        "relatedArtifact": 31,
        "synthesisType": 32,
        "studyType": 33,
        "population": 34,
        "exposure": 35,
        "exposureAlternative": 36,
        "outcome": 37,
        "sampleSize": 38,
        "resultsByExposure": 45,
        "effectEstimate": 53,
        "certainty": 70
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "description": 42,
        "numberOfStudies": 43,
        "numberOfParticipants": 44
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 46,
        "extension": 47,
        "modifierExtension": 48,
        "description": 49,
        "exposureState": 50,
        "variantState": 51,
        "riskEvidenceSynthesis": 52
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 54,
        "extension": 55,
        "modifierExtension": 56,
        "description": 57,
        "type": 58,
        "variantState": 59,
        "value": 60,
        "unitOfMeasure": 61,
        "precisionEstimate": 62
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 63,
        "extension": 64,
        "modifierExtension": 65,
        "type": 66,
        "level": 67,
        "from": 68,
        "to": 69
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 71,
        "extension": 72,
        "modifierExtension": 73,
        "rating": 74,
        "note": 75,
        "certaintySubcomponent": 76
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 77,
        "extension": 78,
        "modifierExtension": 79,
        "type": 80,
        "rating": 81,
        "note": 82
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "Encounter": [
    {
      "_type_": "complex",
      "type": "Encounter",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "statusHistory": 11,
        "class": 17,
        "classHistory": 18,
        "type": 24,
        "serviceType": 25,
        "priority": 26,
        "subject": 27,
        "episodeOfCare": 28,
        "basedOn": 29,
        "participant": 30,
        "appointment": 37,
        "period": 38,
        "length": 39,
        "reasonCode": 40,
        "reasonReference": 41,
        "diagnosis": 42,
        "account": 49,
        "hospitalization": 50,
        "location": 63,
        "serviceProvider": 71,
        "partOf": 72
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 12,
        "extension": 13,
        "modifierExtension": 14,
        "status": 15,
        "period": 16
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 19,
        "extension": 20,
        "modifierExtension": 21,
        "class": 22,
        "period": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "type": 34,
        "period": 35,
        "individual": 36
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 43,
        "extension": 44,
        "modifierExtension": 45,
        "condition": 46,
        "use": 47,
        "rank": 48
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 51,
        "extension": 52,
        "modifierExtension": 53,
        "preAdmissionIdentifier": 54,
        "origin": 55,
        "admitSource": 56,
        "reAdmission": 57,
        "dietPreference": 58,
        "specialCourtesy": 59,
        "specialArrangement": 60,
        "destination": 61,
        "dischargeDisposition": 62
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 64,
        "extension": 65,
        "modifierExtension": 66,
        "location": 67,
        "status": 68,
        "physicalType": 69,
        "period": 70
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "Endpoint": [
    {
      "_type_": "complex",
      "type": "Endpoint",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "connectionType": 11,
        "name": 12,
        "managingOrganization": 13,
        "contact": 14,
        "period": 15,
        "payloadType": 16,
        "payloadMimeType": 17,
        "address": 18,
        "header": 19
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "url",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    }
  ],
  "EnrollmentRequest": [
    {
      "_type_": "complex",
      "type": "EnrollmentRequest",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "created": 11,
        "insurer": 12,
        "provider": 13,
        "candidate": 14,
        "coverage": 15
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "EnrollmentResponse": [
    {
      "_type_": "complex",
      "type": "EnrollmentResponse",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "request": 11,
        "outcome": 12,
        "disposition": 13,
        "created": 14,
        "organization": 15,
        "requestProvider": 16
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "EpisodeOfCare": [
    {
      "_type_": "complex",
      "type": "EpisodeOfCare",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "statusHistory": 11,
        "type": 17,
        "diagnosis": 18,
        "patient": 25,
        "managingOrganization": 26,
        "period": 27,
        "referralRequest": 28,
        "careManager": 29,
        "team": 30,
        "account": 31
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 12,
        "extension": 13,
        "modifierExtension": 14,
        "status": 15,
        "period": 16
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 19,
        "extension": 20,
        "modifierExtension": 21,
        "condition": 22,
        "role": 23,
        "rank": 24
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "EventDefinition": [
    {
      "_type_": "complex",
      "type": "EventDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "subtitle": 14,
        "status": 15,
        "experimental": 16,
        "subject": 17,
        "date": 18,
        "publisher": 19,
        "contact": 20,
        "description": 21,
        "useContext": 22,
        "jurisdiction": 23,
        "purpose": 24,
        "usage": 25,
        "copyright": 26,
        "approvalDate": 27,
        "lastReviewDate": 28,
        "effectivePeriod": 29,
        "topic": 30,
        "author": 31,
        "editor": 32,
        "reviewer": 33,
        "endorser": 34,
        "relatedArtifact": 35,
        "trigger": 36
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "subjectCodeableConcept": "CodeableConcept",
        "subjectReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "TriggerDefinition",
      "cardinality": "array"
    }
  ],
  "Evidence": [
    {
      "_type_": "complex",
      "type": "Evidence",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "shortTitle": 14,
        "subtitle": 15,
        "status": 16,
        "date": 17,
        "publisher": 18,
        "contact": 19,
        "description": 20,
        "note": 21,
        "useContext": 22,
        "jurisdiction": 23,
        "copyright": 24,
        "approvalDate": 25,
        "lastReviewDate": 26,
        "effectivePeriod": 27,
        "topic": 28,
        "author": 29,
        "editor": 30,
        "reviewer": 31,
        "endorser": 32,
        "relatedArtifact": 33,
        "exposureBackground": 34,
        "exposureVariant": 35,
        "outcome": 36
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "EvidenceVariable": [
    {
      "_type_": "complex",
      "type": "EvidenceVariable",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "shortTitle": 14,
        "subtitle": 15,
        "status": 16,
        "date": 17,
        "publisher": 18,
        "contact": 19,
        "description": 20,
        "note": 21,
        "useContext": 22,
        "jurisdiction": 23,
        "copyright": 24,
        "approvalDate": 25,
        "lastReviewDate": 26,
        "effectivePeriod": 27,
        "topic": 28,
        "author": 29,
        "editor": 30,
        "reviewer": 31,
        "endorser": 32,
        "relatedArtifact": 33,
        "type": 34,
        "characteristic": 35
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 36,
        "extension": 37,
        "modifierExtension": 38,
        "description": 39,
        "definition": 40,
        "usageContext": 41,
        "exclude": 42,
        "participantEffective": 43,
        "timeFromStart": 44,
        "groupMeasure": 45
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "definitionReference": "Reference",
        "definitionCanonical": "canonical",
        "definitionCodeableConcept": "CodeableConcept",
        "definitionExpression": "Expression",
        "definitionDataRequirement": "DataRequirement",
        "definitionTriggerDefinition": "TriggerDefinition"
      }
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "participantEffectiveDateTime": "dateTime",
        "participantEffectivePeriod": "Period",
        "participantEffectiveDuration": "Duration",
        "participantEffectiveTiming": "Timing"
      }
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "ExampleScenario": [
    {
      "_type_": "complex",
      "type": "ExampleScenario",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "status": 13,
        "experimental": 14,
        "date": 15,
        "publisher": 16,
        "contact": 17,
        "useContext": 18,
        "jurisdiction": 19,
        "copyright": 20,
        "purpose": 21,
        "actor": 22,
        "instance": 30,
        "process": 50,
        "workflow": 85
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 23,
        "extension": 24,
        "modifierExtension": 25,
        "actorId": 26,
        "type": 27,
        "name": 28,
        "description": 29
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "resourceId": 34,
        "resourceType": 35,
        "name": 36,
        "description": 37,
        "version": 38,
        "containedInstance": 44
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "versionId": 42,
        "description": 43
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 45,
        "extension": 46,
        "modifierExtension": 47,
        "resourceId": 48,
        "versionId": 49
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 51,
        "extension": 52,
        "modifierExtension": 53,
        "title": 54,
        "description": 55,
        "preConditions": 56,
        "postConditions": 57,
        "step": 58
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 59,
        "extension": 60,
        "modifierExtension": 61,
        "process": 50,
        "pause": 63,
        "operation": 64,
        "alternative": 78
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 65,
        "extension": 66,
        "modifierExtension": 67,
        "number": 68,
        "type": 69,
        "name": 70,
        "initiator": 71,
        "receiver": 72,
        "description": 73,
        "initiatorActive": 74,
        "receiverActive": 75,
        "request": 44,
        "response": 44
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    null,
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 79,
        "extension": 80,
        "modifierExtension": 81,
        "title": 82,
        "description": 83,
        "step": 58
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    null,
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    }
  ],
  "ExplanationOfBenefit": [
    {
      "_type_": "complex",
      "type": "ExplanationOfBenefit",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "type": 11,
        "subType": 12,
        "use": 13,
        "patient": 14,
        "billablePeriod": 15,
        "created": 16,
        "enterer": 17,
        "insurer": 18,
        "provider": 19,
        "priority": 20,
        "fundsReserveRequested": 21,
        "fundsReserve": 22,
        "related": 23,
        "prescription": 30,
        "originalPrescription": 31,
        "payee": 32,
        "referral": 38,
        "facility": 39,
        "claim": 40,
        "claimResponse": 41,
        "outcome": 42,
        "disposition": 43,
        "preAuthRef": 44,
        "preAuthRefPeriod": 45,
        "careTeam": 46,
        "supportingInfo": 55,
        "diagnosis": 65,
        "procedure": 74,
        "precedence": 83,
        "insurance": 84,
        "accident": 91,
        "item": 98,
        "addItem": 165,
        "adjudication": 123,
        "total": 211,
        "payment": 217,
        "formCode": 227,
        "form": 228,
        "processNote": 229,
        "benefitPeriod": 237,
        "benefitBalance": 238
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "claim": 27,
        "relationship": 28,
        "reference": 29
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 33,
        "extension": 34,
        "modifierExtension": 35,
        "type": 36,
        "party": 37
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 47,
        "extension": 48,
        "modifierExtension": 49,
        "sequence": 50,
        "provider": 51,
        "responsible": 52,
        "role": 53,
        "qualification": 54
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 56,
        "extension": 57,
        "modifierExtension": 58,
        "sequence": 59,
        "category": 60,
        "code": 61,
        "timing": 62,
        "value": 63,
        "reason": 64
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "timingDate": "date",
        "timingPeriod": "Period"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueBoolean": "boolean",
        "valueString": "string",
        "valueQuantity": "Quantity",
        "valueAttachment": "Attachment",
        "valueReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 66,
        "extension": 67,
        "modifierExtension": 68,
        "sequence": 69,
        "diagnosis": 70,
        "type": 71,
        "onAdmission": 72,
        "packageCode": 73
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "diagnosisCodeableConcept": "CodeableConcept",
        "diagnosisReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 75,
        "extension": 76,
        "modifierExtension": 77,
        "sequence": 78,
        "type": 79,
        "date": 80,
        "procedure": 81,
        "udi": 82
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "procedureCodeableConcept": "CodeableConcept",
        "procedureReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 85,
        "extension": 86,
        "modifierExtension": 87,
        "focal": 88,
        "coverage": 89,
        "preAuthRef": 90
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 92,
        "extension": 93,
        "modifierExtension": 94,
        "date": 95,
        "type": 96,
        "location": 97
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "locationAddress": "Address",
        "locationReference": "Reference"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 99,
        "extension": 100,
        "modifierExtension": 101,
        "sequence": 102,
        "careTeamSequence": 103,
        "diagnosisSequence": 104,
        "procedureSequence": 105,
        "informationSequence": 106,
        "revenue": 107,
        "category": 108,
        "productOrService": 109,
        "modifier": 110,
        "programCode": 111,
        "serviced": 112,
        "location": 113,
        "quantity": 114,
        "unitPrice": 115,
        "factor": 116,
        "net": 117,
        "udi": 118,
        "bodySite": 119,
        "subSite": 120,
        "encounter": 121,
        "noteNumber": 122,
        "adjudication": 123,
        "detail": 131
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "servicedDate": "date",
        "servicedPeriod": "Period"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "locationCodeableConcept": "CodeableConcept",
        "locationAddress": "Address",
        "locationReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 124,
        "extension": 125,
        "modifierExtension": 126,
        "category": 127,
        "reason": 128,
        "amount": 129,
        "value": 130
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 132,
        "extension": 133,
        "modifierExtension": 134,
        "sequence": 135,
        "revenue": 136,
        "category": 137,
        "productOrService": 138,
        "modifier": 139,
        "programCode": 140,
        "quantity": 141,
        "unitPrice": 142,
        "factor": 143,
        "net": 144,
        "udi": 145,
        "noteNumber": 146,
        "adjudication": 123,
        "subDetail": 148
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 149,
        "extension": 150,
        "modifierExtension": 151,
        "sequence": 152,
        "revenue": 153,
        "category": 154,
        "productOrService": 155,
        "modifier": 156,
        "programCode": 157,
        "quantity": 158,
        "unitPrice": 159,
        "factor": 160,
        "net": 161,
        "udi": 162,
        "noteNumber": 163,
        "adjudication": 123
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 166,
        "extension": 167,
        "modifierExtension": 168,
        "itemSequence": 169,
        "detailSequence": 170,
        "subDetailSequence": 171,
        "provider": 172,
        "productOrService": 173,
        "modifier": 174,
        "programCode": 175,
        "serviced": 176,
        "location": 177,
        "quantity": 178,
        "unitPrice": 179,
        "factor": 180,
        "net": 181,
        "bodySite": 182,
        "subSite": 183,
        "noteNumber": 184,
        "adjudication": 123,
        "detail": 186
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "servicedDate": "date",
        "servicedPeriod": "Period"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "locationCodeableConcept": "CodeableConcept",
        "locationAddress": "Address",
        "locationReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 187,
        "extension": 188,
        "modifierExtension": 189,
        "productOrService": 190,
        "modifier": 191,
        "quantity": 192,
        "unitPrice": 193,
        "factor": 194,
        "net": 195,
        "noteNumber": 196,
        "adjudication": 123,
        "subDetail": 198
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 199,
        "extension": 200,
        "modifierExtension": 201,
        "productOrService": 202,
        "modifier": 203,
        "quantity": 204,
        "unitPrice": 205,
        "factor": 206,
        "net": 207,
        "noteNumber": 208,
        "adjudication": 123
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "array"
    },
    null,
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 212,
        "extension": 213,
        "modifierExtension": 214,
        "category": 215,
        "amount": 216
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 218,
        "extension": 219,
        "modifierExtension": 220,
        "type": 221,
        "adjustment": 222,
        "adjustmentReason": 223,
        "date": 224,
        "amount": 225,
        "identifier": 226
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 230,
        "extension": 231,
        "modifierExtension": 232,
        "number": 233,
        "type": 234,
        "text": 235,
        "language": 236
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 239,
        "extension": 240,
        "modifierExtension": 241,
        "category": 242,
        "excluded": 243,
        "name": 244,
        "description": 245,
        "network": 246,
        "unit": 247,
        "term": 248,
        "financial": 249
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 250,
        "extension": 251,
        "modifierExtension": 252,
        "type": 253,
        "allowed": 254,
        "used": 255
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "allowedUnsignedInt": "unsignedInt",
        "allowedString": "string",
        "allowedMoney": "Money"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "usedUnsignedInt": "unsignedInt",
        "usedMoney": "Money"
      }
    }
  ],
  "FamilyMemberHistory": [
    {
      "_type_": "complex",
      "type": "FamilyMemberHistory",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "instantiatesCanonical": 10,
        "instantiatesUri": 11,
        "status": 12,
        "dataAbsentReason": 13,
        "patient": 14,
        "date": 15,
        "name": 16,
        "relationship": 17,
        "sex": 18,
        "born": 19,
        "age": 20,
        "estimatedAge": 21,
        "deceased": 22,
        "reasonCode": 23,
        "reasonReference": 24,
        "note": 25,
        "condition": 26
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "bornPeriod": "Period",
        "bornDate": "date",
        "bornString": "string"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "ageAge": "Age",
        "ageRange": "Range",
        "ageString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "deceasedBoolean": "boolean",
        "deceasedAge": "Age",
        "deceasedRange": "Range",
        "deceasedDate": "date",
        "deceasedString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 27,
        "extension": 28,
        "modifierExtension": 29,
        "code": 30,
        "outcome": 31,
        "contributedToDeath": 32,
        "onset": 33,
        "note": 34
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "onsetAge": "Age",
        "onsetRange": "Range",
        "onsetPeriod": "Period",
        "onsetString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "Flag": [
    {
      "_type_": "complex",
      "type": "Flag",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "category": 11,
        "code": 12,
        "subject": 13,
        "period": 14,
        "encounter": 15,
        "author": 16
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "Goal": [
    {
      "_type_": "complex",
      "type": "Goal",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "lifecycleStatus": 10,
        "achievementStatus": 11,
        "category": 12,
        "priority": 13,
        "description": 14,
        "subject": 15,
        "start": 16,
        "target": 17,
        "statusDate": 24,
        "statusReason": 25,
        "expressedBy": 26,
        "addresses": 27,
        "note": 28,
        "outcomeCode": 29,
        "outcomeReference": 30
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "startDate": "date",
        "startCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 18,
        "extension": 19,
        "modifierExtension": 20,
        "measure": 21,
        "detail": 22,
        "due": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "detailQuantity": "Quantity",
        "detailRange": "Range",
        "detailCodeableConcept": "CodeableConcept",
        "detailString": "string",
        "detailBoolean": "boolean",
        "detailInteger": "integer",
        "detailRatio": "Ratio"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "dueDate": "date",
        "dueDuration": "Duration"
      }
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "GraphDefinition": [
    {
      "_type_": "complex",
      "type": "GraphDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "version": 10,
        "name": 11,
        "status": 12,
        "experimental": 13,
        "date": 14,
        "publisher": 15,
        "contact": 16,
        "description": 17,
        "useContext": 18,
        "jurisdiction": 19,
        "purpose": 20,
        "start": 21,
        "profile": 22,
        "link": 23
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "path": 27,
        "sliceName": 28,
        "min": 29,
        "max": 30,
        "description": 31,
        "target": 32
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 33,
        "extension": 34,
        "modifierExtension": 35,
        "type": 36,
        "params": 37,
        "profile": 38,
        "compartment": 39,
        "link": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 40,
        "extension": 41,
        "modifierExtension": 42,
        "use": 43,
        "code": 44,
        "rule": 45,
        "expression": 46,
        "description": 47
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "Group": [
    {
      "_type_": "complex",
      "type": "Group",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "active": 10,
        "type": 11,
        "actual": 12,
        "code": 13,
        "name": 14,
        "quantity": 15,
        "managingEntity": 16,
        "characteristic": 17,
        "member": 25
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 18,
        "extension": 19,
        "modifierExtension": 20,
        "code": 21,
        "value": 22,
        "exclude": 23,
        "period": 24
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueCodeableConcept": "CodeableConcept",
        "valueBoolean": "boolean",
        "valueQuantity": "Quantity",
        "valueRange": "Range",
        "valueReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 26,
        "extension": 27,
        "modifierExtension": 28,
        "entity": 29,
        "period": 30,
        "inactive": 31
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    }
  ],
  "GuidanceResponse": [
    {
      "_type_": "complex",
      "type": "GuidanceResponse",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "requestIdentifier": 9,
        "identifier": 10,
        "module": 11,
        "status": 12,
        "subject": 13,
        "encounter": 14,
        "occurrenceDateTime": 15,
        "performer": 16,
        "reasonCode": 17,
        "reasonReference": 18,
        "note": 19,
        "evaluationMessage": 20,
        "outputParameters": 21,
        "result": 22,
        "dataRequirement": 23
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "moduleUri": "uri",
        "moduleCanonical": "canonical",
        "moduleCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "DataRequirement",
      "cardinality": "array"
    }
  ],
  "HealthcareService": [
    {
      "_type_": "complex",
      "type": "HealthcareService",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "active": 10,
        "providedBy": 11,
        "category": 12,
        "type": 13,
        "specialty": 14,
        "location": 15,
        "name": 16,
        "comment": 17,
        "extraDetails": 18,
        "photo": 19,
        "telecom": 20,
        "coverageArea": 21,
        "serviceProvisionCode": 22,
        "eligibility": 23,
        "program": 29,
        "characteristic": 30,
        "communication": 31,
        "referralMethod": 32,
        "appointmentRequired": 33,
        "availableTime": 34,
        "notAvailable": 42,
        "availabilityExceptions": 48,
        "endpoint": 49
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "code": 27,
        "comment": 28
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 35,
        "extension": 36,
        "modifierExtension": 37,
        "daysOfWeek": 38,
        "allDay": 39,
        "availableStartTime": 40,
        "availableEndTime": 41
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "time",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "time",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 43,
        "extension": 44,
        "modifierExtension": 45,
        "description": 46,
        "during": 47
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "ImagingStudy": [
    {
      "_type_": "complex",
      "type": "ImagingStudy",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "modality": 11,
        "subject": 12,
        "encounter": 13,
        "started": 14,
        "basedOn": 15,
        "referrer": 16,
        "interpreter": 17,
        "endpoint": 18,
        "numberOfSeries": 19,
        "numberOfInstances": 20,
        "procedureReference": 21,
        "procedureCode": 22,
        "location": 23,
        "reasonCode": 24,
        "reasonReference": 25,
        "note": 26,
        "description": 27,
        "series": 28
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 29,
        "extension": 30,
        "modifierExtension": 31,
        "uid": 32,
        "number": 33,
        "modality": 34,
        "description": 35,
        "numberOfInstances": 36,
        "endpoint": 37,
        "bodySite": 38,
        "laterality": 39,
        "specimen": 40,
        "started": 41,
        "performer": 42,
        "instance": 48
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 43,
        "extension": 44,
        "modifierExtension": 45,
        "function": 46,
        "actor": 47
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 49,
        "extension": 50,
        "modifierExtension": 51,
        "uid": 52,
        "sopClass": 53,
        "number": 54,
        "title": 55
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "Immunization": [
    {
      "_type_": "complex",
      "type": "Immunization",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "statusReason": 11,
        "vaccineCode": 12,
        "patient": 13,
        "encounter": 14,
        "occurrence": 15,
        "recorded": 16,
        "primarySource": 17,
        "reportOrigin": 18,
        "location": 19,
        "manufacturer": 20,
        "lotNumber": 21,
        "expirationDate": 22,
        "site": 23,
        "route": 24,
        "doseQuantity": 25,
        "performer": 26,
        "note": 32,
        "reasonCode": 33,
        "reasonReference": 34,
        "isSubpotent": 35,
        "subpotentReason": 36,
        "education": 37,
        "programEligibility": 45,
        "fundingSource": 46,
        "reaction": 47,
        "protocolApplied": 54
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "occurrenceDateTime": "dateTime",
        "occurrenceString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 27,
        "extension": 28,
        "modifierExtension": 29,
        "function": 30,
        "actor": 31
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 38,
        "extension": 39,
        "modifierExtension": 40,
        "documentType": 41,
        "reference": 42,
        "publicationDate": 43,
        "presentationDate": 44
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 48,
        "extension": 49,
        "modifierExtension": 50,
        "date": 51,
        "detail": 52,
        "reported": 53
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 55,
        "extension": 56,
        "modifierExtension": 57,
        "series": 58,
        "authority": 59,
        "targetDisease": 60,
        "doseNumber": 61,
        "seriesDoses": 62
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "doseNumberPositiveInt": "positiveInt",
        "doseNumberString": "string"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "seriesDosesPositiveInt": "positiveInt",
        "seriesDosesString": "string"
      }
    }
  ],
  "ImmunizationEvaluation": [
    {
      "_type_": "complex",
      "type": "ImmunizationEvaluation",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "patient": 11,
        "date": 12,
        "authority": 13,
        "targetDisease": 14,
        "immunizationEvent": 15,
        "doseStatus": 16,
        "doseStatusReason": 17,
        "description": 18,
        "series": 19,
        "doseNumber": 20,
        "seriesDoses": 21
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "doseNumberPositiveInt": "positiveInt",
        "doseNumberString": "string"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "seriesDosesPositiveInt": "positiveInt",
        "seriesDosesString": "string"
      }
    }
  ],
  "ImmunizationRecommendation": [
    {
      "_type_": "complex",
      "type": "ImmunizationRecommendation",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "patient": 10,
        "date": 11,
        "authority": 12,
        "recommendation": 13
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 14,
        "extension": 15,
        "modifierExtension": 16,
        "vaccineCode": 17,
        "targetDisease": 18,
        "contraindicatedVaccineCode": 19,
        "forecastStatus": 20,
        "forecastReason": 21,
        "dateCriterion": 22,
        "description": 28,
        "series": 29,
        "doseNumber": 30,
        "seriesDoses": 31,
        "supportingImmunization": 32,
        "supportingPatientInformation": 33
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 23,
        "extension": 24,
        "modifierExtension": 25,
        "code": 26,
        "value": 27
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "doseNumberPositiveInt": "positiveInt",
        "doseNumberString": "string"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "seriesDosesPositiveInt": "positiveInt",
        "seriesDosesString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "ImplementationGuide": [
    {
      "_type_": "complex",
      "type": "ImplementationGuide",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "version": 10,
        "name": 11,
        "title": 12,
        "status": 13,
        "experimental": 14,
        "date": 15,
        "publisher": 16,
        "contact": 17,
        "description": 18,
        "useContext": 19,
        "jurisdiction": 20,
        "copyright": 21,
        "packageId": 22,
        "license": 23,
        "fhirVersion": 24,
        "dependsOn": 25,
        "global": 32,
        "definition": 38,
        "manifest": 79
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 26,
        "extension": 27,
        "modifierExtension": 28,
        "uri": 29,
        "packageId": 30,
        "version": 31
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 33,
        "extension": 34,
        "modifierExtension": 35,
        "type": 36,
        "profile": 37
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "grouping": 42,
        "resource": 48,
        "page": 58,
        "parameter": 66,
        "template": 72
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 43,
        "extension": 44,
        "modifierExtension": 45,
        "name": 46,
        "description": 47
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 49,
        "extension": 50,
        "modifierExtension": 51,
        "reference": 52,
        "fhirVersion": 53,
        "name": 54,
        "description": 55,
        "example": 56,
        "groupingId": 57
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "exampleBoolean": "boolean",
        "exampleCanonical": "canonical"
      }
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 59,
        "extension": 60,
        "modifierExtension": 61,
        "name": 62,
        "title": 63,
        "generation": 64,
        "page": 58
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "nameUrl": "url",
        "nameReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 67,
        "extension": 68,
        "modifierExtension": 69,
        "code": 70,
        "value": 71
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 73,
        "extension": 74,
        "modifierExtension": 75,
        "code": 76,
        "source": 77,
        "scope": 78
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 80,
        "extension": 81,
        "modifierExtension": 82,
        "rendering": 83,
        "resource": 84,
        "page": 91,
        "image": 98,
        "other": 99
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "url",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 85,
        "extension": 86,
        "modifierExtension": 87,
        "reference": 88,
        "example": 89,
        "relativePath": 90
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "exampleBoolean": "boolean",
        "exampleCanonical": "canonical"
      }
    },
    {
      "_type_": "type",
      "type": "url",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 92,
        "extension": 93,
        "modifierExtension": 94,
        "name": 95,
        "title": 96,
        "anchor": 97
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    }
  ],
  "InsurancePlan": [
    {
      "_type_": "complex",
      "type": "InsurancePlan",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "type": 11,
        "name": 12,
        "alias": 13,
        "period": 14,
        "ownedBy": 15,
        "administeredBy": 16,
        "coverageArea": 17,
        "contact": 18,
        "endpoint": 26,
        "network": 27,
        "coverage": 28,
        "plan": 46
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 19,
        "extension": 20,
        "modifierExtension": 21,
        "purpose": 22,
        "name": 23,
        "telecom": 24,
        "address": 25
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "HumanName",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Address",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 29,
        "extension": 30,
        "modifierExtension": 31,
        "type": 32,
        "network": 33,
        "benefit": 34
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 35,
        "extension": 36,
        "modifierExtension": 37,
        "type": 38,
        "requirement": 39,
        "limit": 40
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 41,
        "extension": 42,
        "modifierExtension": 43,
        "value": 44,
        "code": 45
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 47,
        "extension": 48,
        "modifierExtension": 49,
        "identifier": 50,
        "type": 51,
        "coverageArea": 52,
        "network": 53,
        "generalCost": 54,
        "specificCost": 62
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 55,
        "extension": 56,
        "modifierExtension": 57,
        "type": 58,
        "groupSize": 59,
        "cost": 60,
        "comment": 61
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 63,
        "extension": 64,
        "modifierExtension": 65,
        "category": 66,
        "benefit": 67
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 68,
        "extension": 69,
        "modifierExtension": 70,
        "type": 71,
        "cost": 72
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 73,
        "extension": 74,
        "modifierExtension": 75,
        "type": 76,
        "applicability": 77,
        "qualifiers": 78,
        "value": 79
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    }
  ],
  "Invoice": [
    {
      "_type_": "complex",
      "type": "Invoice",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "cancelledReason": 11,
        "type": 12,
        "subject": 13,
        "recipient": 14,
        "date": 15,
        "participant": 16,
        "issuer": 22,
        "account": 23,
        "lineItem": 24,
        "totalPriceComponent": 30,
        "totalNet": 39,
        "totalGross": 40,
        "paymentTerms": 41,
        "note": 42
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 17,
        "extension": 18,
        "modifierExtension": 19,
        "role": 20,
        "actor": 21
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 25,
        "extension": 26,
        "modifierExtension": 27,
        "sequence": 28,
        "chargeItem": 29,
        "priceComponent": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "chargeItemReference": "Reference",
        "chargeItemCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "type": 34,
        "code": 35,
        "factor": 36,
        "amount": 37
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    null,
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "Library": [
    {
      "_type_": "complex",
      "type": "Library",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "subtitle": 14,
        "status": 15,
        "experimental": 16,
        "type": 17,
        "subject": 18,
        "date": 19,
        "publisher": 20,
        "contact": 21,
        "description": 22,
        "useContext": 23,
        "jurisdiction": 24,
        "purpose": 25,
        "usage": 26,
        "copyright": 27,
        "approvalDate": 28,
        "lastReviewDate": 29,
        "effectivePeriod": 30,
        "topic": 31,
        "author": 32,
        "editor": 33,
        "reviewer": 34,
        "endorser": 35,
        "relatedArtifact": 36,
        "parameter": 37,
        "dataRequirement": 38,
        "content": 39
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "subjectCodeableConcept": "CodeableConcept",
        "subjectReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ParameterDefinition",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "DataRequirement",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "array"
    }
  ],
  "Linkage": [
    {
      "_type_": "complex",
      "type": "Linkage",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "active": 9,
        "author": 10,
        "item": 11
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 12,
        "extension": 13,
        "modifierExtension": 14,
        "type": 15,
        "resource": 16
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "List": [
    {
      "_type_": "complex",
      "type": "List",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "mode": 11,
        "title": 12,
        "code": 13,
        "subject": 14,
        "encounter": 15,
        "date": 16,
        "source": 17,
        "orderedBy": 18,
        "note": 19,
        "entry": 20,
        "emptyReason": 28
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "flag": 24,
        "deleted": 25,
        "date": 26,
        "item": 27
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "Location": [
    {
      "_type_": "complex",
      "type": "Location",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "operationalStatus": 11,
        "name": 12,
        "alias": 13,
        "description": 14,
        "mode": 15,
        "type": 16,
        "telecom": 17,
        "address": 18,
        "physicalType": 19,
        "position": 20,
        "managingOrganization": 27,
        "partOf": 28,
        "hoursOfOperation": 29,
        "availabilityExceptions": 37,
        "endpoint": 38
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Address",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "longitude": 24,
        "latitude": 25,
        "altitude": 26
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 30,
        "extension": 31,
        "modifierExtension": 32,
        "daysOfWeek": 33,
        "allDay": 34,
        "openingTime": 35,
        "closingTime": 36
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "time",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "time",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "Measure": [
    {
      "_type_": "complex",
      "type": "Measure",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "subtitle": 14,
        "status": 15,
        "experimental": 16,
        "subject": 17,
        "date": 18,
        "publisher": 19,
        "contact": 20,
        "description": 21,
        "useContext": 22,
        "jurisdiction": 23,
        "purpose": 24,
        "usage": 25,
        "copyright": 26,
        "approvalDate": 27,
        "lastReviewDate": 28,
        "effectivePeriod": 29,
        "topic": 30,
        "author": 31,
        "editor": 32,
        "reviewer": 33,
        "endorser": 34,
        "relatedArtifact": 35,
        "library": 36,
        "disclaimer": 37,
        "scoring": 38,
        "compositeScoring": 39,
        "type": 40,
        "riskAdjustment": 41,
        "rateAggregation": 42,
        "rationale": 43,
        "clinicalRecommendationStatement": 44,
        "improvementNotation": 45,
        "definition": 46,
        "guidance": 47,
        "group": 48,
        "supplementalData": 75
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "subjectCodeableConcept": "CodeableConcept",
        "subjectReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 49,
        "extension": 50,
        "modifierExtension": 51,
        "code": 52,
        "description": 53,
        "population": 54,
        "stratifier": 61
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 55,
        "extension": 56,
        "modifierExtension": 57,
        "code": 58,
        "description": 59,
        "criteria": 60
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 62,
        "extension": 63,
        "modifierExtension": 64,
        "code": 65,
        "description": 66,
        "criteria": 67,
        "component": 68
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 69,
        "extension": 70,
        "modifierExtension": 71,
        "code": 72,
        "description": 73,
        "criteria": 74
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 76,
        "extension": 77,
        "modifierExtension": 78,
        "code": 79,
        "usage": 80,
        "description": 81,
        "criteria": 82
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    }
  ],
  "MeasureReport": [
    {
      "_type_": "complex",
      "type": "MeasureReport",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "type": 11,
        "measure": 12,
        "subject": 13,
        "date": 14,
        "reporter": 15,
        "period": 16,
        "improvementNotation": 17,
        "group": 18,
        "evaluatedResource": 55
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 19,
        "extension": 20,
        "modifierExtension": 21,
        "code": 22,
        "population": 23,
        "measureScore": 30,
        "stratifier": 31
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "code": 27,
        "count": 28,
        "subjectResults": 29
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 32,
        "extension": 33,
        "modifierExtension": 34,
        "code": 35,
        "stratum": 36
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 37,
        "extension": 38,
        "modifierExtension": 39,
        "value": 40,
        "component": 41,
        "population": 47,
        "measureScore": 54
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 42,
        "extension": 43,
        "modifierExtension": 44,
        "code": 45,
        "value": 46
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 48,
        "extension": 49,
        "modifierExtension": 50,
        "code": 51,
        "count": 52,
        "subjectResults": 53
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "Media": [
    {
      "_type_": "complex",
      "type": "Media",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "basedOn": 10,
        "partOf": 11,
        "status": 12,
        "type": 13,
        "modality": 14,
        "view": 15,
        "subject": 16,
        "encounter": 17,
        "created": 18,
        "issued": 19,
        "operator": 20,
        "reasonCode": 21,
        "bodySite": 22,
        "deviceName": 23,
        "device": 24,
        "height": 25,
        "width": 26,
        "frames": 27,
        "duration": 28,
        "content": 29,
        "note": 30
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "createdDateTime": "dateTime",
        "createdPeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "Medication": [
    {
      "_type_": "complex",
      "type": "Medication",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "code": 10,
        "status": 11,
        "manufacturer": 12,
        "form": 13,
        "amount": 14,
        "ingredient": 15,
        "batch": 22
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 16,
        "extension": 17,
        "modifierExtension": 18,
        "item": 19,
        "isActive": 20,
        "strength": 21
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "itemCodeableConcept": "CodeableConcept",
        "itemReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 23,
        "extension": 24,
        "modifierExtension": 25,
        "lotNumber": 26,
        "expirationDate": 27
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    }
  ],
  "MedicationAdministration": [
    {
      "_type_": "complex",
      "type": "MedicationAdministration",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "instantiates": 10,
        "partOf": 11,
        "status": 12,
        "statusReason": 13,
        "category": 14,
        "medication": 15,
        "subject": 16,
        "context": 17,
        "supportingInformation": 18,
        "effective": 19,
        "performer": 20,
        "reasonCode": 26,
        "reasonReference": 27,
        "request": 28,
        "device": 29,
        "note": 30,
        "dosage": 31,
        "eventHistory": 41
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "medicationCodeableConcept": "CodeableConcept",
        "medicationReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "effectiveDateTime": "dateTime",
        "effectivePeriod": "Period"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "function": 24,
        "actor": 25
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 32,
        "extension": 33,
        "modifierExtension": 34,
        "text": 35,
        "site": 36,
        "route": 37,
        "method": 38,
        "dose": 39,
        "rate": 40
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "rateRatio": "Ratio",
        "rateQuantity": "Quantity"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "MedicationDispense": [
    {
      "_type_": "complex",
      "type": "MedicationDispense",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "partOf": 10,
        "status": 11,
        "statusReason": 12,
        "category": 13,
        "medication": 14,
        "subject": 15,
        "context": 16,
        "supportingInformation": 17,
        "performer": 18,
        "location": 24,
        "authorizingPrescription": 25,
        "type": 26,
        "quantity": 27,
        "daysSupply": 28,
        "whenPrepared": 29,
        "whenHandedOver": 30,
        "destination": 31,
        "receiver": 32,
        "note": 33,
        "dosageInstruction": 34,
        "substitution": 35,
        "detectedIssue": 43,
        "eventHistory": 44
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "statusReasonCodeableConcept": "CodeableConcept",
        "statusReasonReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "medicationCodeableConcept": "CodeableConcept",
        "medicationReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 19,
        "extension": 20,
        "modifierExtension": 21,
        "function": 22,
        "actor": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Dosage",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 36,
        "extension": 37,
        "modifierExtension": 38,
        "wasSubstituted": 39,
        "type": 40,
        "reason": 41,
        "responsibleParty": 42
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "MedicationKnowledge": [
    {
      "_type_": "complex",
      "type": "MedicationKnowledge",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "code": 9,
        "status": 10,
        "manufacturer": 11,
        "doseForm": 12,
        "amount": 13,
        "synonym": 14,
        "relatedMedicationKnowledge": 15,
        "associatedMedication": 21,
        "productType": 22,
        "monograph": 23,
        "ingredient": 29,
        "preparationInstruction": 36,
        "intendedRoute": 37,
        "cost": 38,
        "monitoringProgram": 45,
        "administrationGuidelines": 51,
        "medicineClassification": 68,
        "packaging": 74,
        "drugCharacteristic": 80,
        "contraindication": 86,
        "regulatory": 87,
        "kinetics": 109
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 16,
        "extension": 17,
        "modifierExtension": 18,
        "type": 19,
        "reference": 20
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "type": 27,
        "source": 28
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 30,
        "extension": 31,
        "modifierExtension": 32,
        "item": 33,
        "isActive": 34,
        "strength": 35
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "itemCodeableConcept": "CodeableConcept",
        "itemReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "type": 42,
        "source": 43,
        "cost": 44
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 46,
        "extension": 47,
        "modifierExtension": 48,
        "type": 49,
        "name": 50
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 52,
        "extension": 53,
        "modifierExtension": 54,
        "dosage": 55,
        "indication": 61,
        "patientCharacteristics": 62
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 56,
        "extension": 57,
        "modifierExtension": 58,
        "type": 59,
        "dosage": 60
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Dosage",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "indicationCodeableConcept": "CodeableConcept",
        "indicationReference": "Reference"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 63,
        "extension": 64,
        "modifierExtension": 65,
        "characteristic": 66,
        "value": 67
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "characteristicCodeableConcept": "CodeableConcept",
        "characteristicQuantity": "Quantity"
      }
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 69,
        "extension": 70,
        "modifierExtension": 71,
        "type": 72,
        "classification": 73
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 75,
        "extension": 76,
        "modifierExtension": 77,
        "type": 78,
        "quantity": 79
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 81,
        "extension": 82,
        "modifierExtension": 83,
        "type": 84,
        "value": 85
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueCodeableConcept": "CodeableConcept",
        "valueString": "string",
        "valueQuantity": "Quantity",
        "valueBase64Binary": "base64Binary"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 88,
        "extension": 89,
        "modifierExtension": 90,
        "regulatoryAuthority": 91,
        "substitution": 92,
        "schedule": 98,
        "maxDispense": 103
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 93,
        "extension": 94,
        "modifierExtension": 95,
        "type": 96,
        "allowed": 97
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 99,
        "extension": 100,
        "modifierExtension": 101,
        "schedule": 102
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 104,
        "extension": 105,
        "modifierExtension": 106,
        "quantity": 107,
        "period": 108
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 110,
        "extension": 111,
        "modifierExtension": 112,
        "areaUnderCurve": 113,
        "lethalDose50": 114,
        "halfLifePeriod": 115
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    }
  ],
  "MedicationRequest": [
    {
      "_type_": "complex",
      "type": "MedicationRequest",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "statusReason": 11,
        "intent": 12,
        "category": 13,
        "priority": 14,
        "doNotPerform": 15,
        "reported": 16,
        "medication": 17,
        "subject": 18,
        "encounter": 19,
        "supportingInformation": 20,
        "authoredOn": 21,
        "requester": 22,
        "performer": 23,
        "performerType": 24,
        "recorder": 25,
        "reasonCode": 26,
        "reasonReference": 27,
        "instantiatesCanonical": 28,
        "instantiatesUri": 29,
        "basedOn": 30,
        "groupIdentifier": 31,
        "courseOfTherapyType": 32,
        "insurance": 33,
        "note": 34,
        "dosageInstruction": 35,
        "dispenseRequest": 36,
        "substitution": 52,
        "priorPrescription": 58,
        "detectedIssue": 59,
        "eventHistory": 60
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "reportedBoolean": "boolean",
        "reportedReference": "Reference"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "medicationCodeableConcept": "CodeableConcept",
        "medicationReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Dosage",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 37,
        "extension": 38,
        "modifierExtension": 39,
        "initialFill": 40,
        "dispenseInterval": 46,
        "validityPeriod": 47,
        "numberOfRepeatsAllowed": 48,
        "quantity": 49,
        "expectedSupplyDuration": 50,
        "performer": 51
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 41,
        "extension": 42,
        "modifierExtension": 43,
        "quantity": 44,
        "duration": 45
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 53,
        "extension": 54,
        "modifierExtension": 55,
        "allowed": 56,
        "reason": 57
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "allowedBoolean": "boolean",
        "allowedCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "MedicationStatement": [
    {
      "_type_": "complex",
      "type": "MedicationStatement",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "basedOn": 10,
        "partOf": 11,
        "status": 12,
        "statusReason": 13,
        "category": 14,
        "medication": 15,
        "subject": 16,
        "context": 17,
        "effective": 18,
        "dateAsserted": 19,
        "informationSource": 20,
        "derivedFrom": 21,
        "reasonCode": 22,
        "reasonReference": 23,
        "note": 24,
        "dosage": 25
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "medicationCodeableConcept": "CodeableConcept",
        "medicationReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "effectiveDateTime": "dateTime",
        "effectivePeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Dosage",
      "cardinality": "array"
    }
  ],
  "MedicinalProduct": [
    {
      "_type_": "complex",
      "type": "MedicinalProduct",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "type": 10,
        "domain": 11,
        "combinedPharmaceuticalDoseForm": 12,
        "legalStatusOfSupply": 13,
        "additionalMonitoringIndicator": 14,
        "specialMeasures": 15,
        "paediatricUseIndicator": 16,
        "productClassification": 17,
        "marketingStatus": 18,
        "pharmaceuticalProduct": 19,
        "packagedMedicinalProduct": 20,
        "attachedDocument": 21,
        "masterFile": 22,
        "contact": 23,
        "clinicalTrial": 24,
        "name": 25,
        "crossReference": 43,
        "manufacturingBusinessOperation": 44,
        "specialDesignation": 54
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "MarketingStatus",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 26,
        "extension": 27,
        "modifierExtension": 28,
        "productName": 29,
        "namePart": 30,
        "countryLanguage": 36
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "part": 34,
        "type": 35
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 37,
        "extension": 38,
        "modifierExtension": 39,
        "country": 40,
        "jurisdiction": 41,
        "language": 42
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 45,
        "extension": 46,
        "modifierExtension": 47,
        "operationType": 48,
        "authorisationReferenceNumber": 49,
        "effectiveDate": 50,
        "confidentialityIndicator": 51,
        "manufacturer": 52,
        "regulator": 53
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 55,
        "extension": 56,
        "modifierExtension": 57,
        "identifier": 58,
        "type": 59,
        "intendedUse": 60,
        "indication": 61,
        "status": 62,
        "date": 63,
        "species": 64
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "indicationCodeableConcept": "CodeableConcept",
        "indicationReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "MedicinalProductAuthorization": [
    {
      "_type_": "complex",
      "type": "MedicinalProductAuthorization",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "subject": 10,
        "country": 11,
        "jurisdiction": 12,
        "status": 13,
        "statusDate": 14,
        "restoreDate": 15,
        "validityPeriod": 16,
        "dataExclusivityPeriod": 17,
        "dateOfFirstAuthorization": 18,
        "internationalBirthDate": 19,
        "legalBasis": 20,
        "jurisdictionalAuthorization": 21,
        "holder": 30,
        "regulator": 31,
        "procedure": 32
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 22,
        "extension": 23,
        "modifierExtension": 24,
        "identifier": 25,
        "country": 26,
        "jurisdiction": 27,
        "legalStatusOfSupply": 28,
        "validityPeriod": 29
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 33,
        "extension": 34,
        "modifierExtension": 35,
        "identifier": 36,
        "type": 37,
        "date": 38,
        "application": 32
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "datePeriod": "Period",
        "dateDateTime": "dateTime"
      }
    }
  ],
  "MedicinalProductContraindication": [
    {
      "_type_": "complex",
      "type": "MedicinalProductContraindication",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "subject": 9,
        "disease": 10,
        "diseaseStatus": 11,
        "comorbidity": 12,
        "therapeuticIndication": 13,
        "otherTherapy": 14,
        "population": 20
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 15,
        "extension": 16,
        "modifierExtension": 17,
        "therapyRelationshipType": 18,
        "medication": 19
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "medicationCodeableConcept": "CodeableConcept",
        "medicationReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Population",
      "cardinality": "array"
    }
  ],
  "MedicinalProductIndication": [
    {
      "_type_": "complex",
      "type": "MedicinalProductIndication",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "subject": 9,
        "diseaseSymptomProcedure": 10,
        "diseaseStatus": 11,
        "comorbidity": 12,
        "intendedEffect": 13,
        "duration": 14,
        "otherTherapy": 15,
        "undesirableEffect": 21,
        "population": 22
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 16,
        "extension": 17,
        "modifierExtension": 18,
        "therapyRelationshipType": 19,
        "medication": 20
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "medicationCodeableConcept": "CodeableConcept",
        "medicationReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Population",
      "cardinality": "array"
    }
  ],
  "MedicinalProductIngredient": [
    {
      "_type_": "complex",
      "type": "MedicinalProductIngredient",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "role": 10,
        "allergenicIndicator": 11,
        "manufacturer": 12,
        "specifiedSubstance": 13,
        "substance": 39
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 14,
        "extension": 15,
        "modifierExtension": 16,
        "code": 17,
        "group": 18,
        "confidentiality": 19,
        "strength": 20
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "presentation": 24,
        "presentationLowLimit": 25,
        "concentration": 26,
        "concentrationLowLimit": 27,
        "measurementPoint": 28,
        "country": 29,
        "referenceStrength": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "substance": 34,
        "strength": 35,
        "strengthLowLimit": 36,
        "measurementPoint": 37,
        "country": 38
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 40,
        "extension": 41,
        "modifierExtension": 42,
        "code": 43,
        "strength": 20
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "MedicinalProductInteraction": [
    {
      "_type_": "complex",
      "type": "MedicinalProductInteraction",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "subject": 9,
        "description": 10,
        "interactant": 11,
        "type": 16,
        "effect": 17,
        "incidence": 18,
        "management": 19
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 12,
        "extension": 13,
        "modifierExtension": 14,
        "item": 15
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "itemReference": "Reference",
        "itemCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "MedicinalProductManufactured": [
    {
      "_type_": "complex",
      "type": "MedicinalProductManufactured",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "manufacturedDoseForm": 9,
        "unitOfPresentation": 10,
        "quantity": 11,
        "manufacturer": 12,
        "ingredient": 13,
        "physicalCharacteristics": 14,
        "otherCharacteristics": 15
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ProdCharacteristic",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    }
  ],
  "MedicinalProductPackaged": [
    {
      "_type_": "complex",
      "type": "MedicinalProductPackaged",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "subject": 10,
        "description": 11,
        "legalStatusOfSupply": 12,
        "marketingStatus": 13,
        "marketingAuthorization": 14,
        "manufacturer": 15,
        "batchIdentifier": 16,
        "packageItem": 22
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "MarketingStatus",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 17,
        "extension": 18,
        "modifierExtension": 19,
        "outerPackaging": 20,
        "immediatePackaging": 21
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 23,
        "extension": 24,
        "modifierExtension": 25,
        "identifier": 26,
        "type": 27,
        "quantity": 28,
        "material": 29,
        "alternateMaterial": 30,
        "device": 31,
        "manufacturedItem": 32,
        "packageItem": 22,
        "physicalCharacteristics": 34,
        "otherCharacteristics": 35,
        "shelfLifeStorage": 36,
        "manufacturer": 37
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "type",
      "type": "ProdCharacteristic",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ProductShelfLife",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "MedicinalProductPharmaceutical": [
    {
      "_type_": "complex",
      "type": "MedicinalProductPharmaceutical",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "administrableDoseForm": 10,
        "unitOfPresentation": 11,
        "ingredient": 12,
        "device": 13,
        "characteristics": 14,
        "routeOfAdministration": 20
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 15,
        "extension": 16,
        "modifierExtension": 17,
        "code": 18,
        "status": 19
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "code": 24,
        "firstDose": 25,
        "maxSingleDose": 26,
        "maxDosePerDay": 27,
        "maxDosePerTreatmentPeriod": 28,
        "maxTreatmentPeriod": 29,
        "targetSpecies": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "code": 34,
        "withdrawalPeriod": 35
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 36,
        "extension": 37,
        "modifierExtension": 38,
        "tissue": 39,
        "value": 40,
        "supportingInformation": 41
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "MedicinalProductUndesirableEffect": [
    {
      "_type_": "complex",
      "type": "MedicinalProductUndesirableEffect",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "subject": 9,
        "symptomConditionEffect": 10,
        "classification": 11,
        "frequencyOfOccurrence": 12,
        "population": 13
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Population",
      "cardinality": "array"
    }
  ],
  "MessageDefinition": [
    {
      "_type_": "complex",
      "type": "MessageDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "replaces": 14,
        "status": 15,
        "experimental": 16,
        "date": 17,
        "publisher": 18,
        "contact": 19,
        "description": 20,
        "useContext": 21,
        "jurisdiction": 22,
        "purpose": 23,
        "copyright": 24,
        "base": 25,
        "parent": 26,
        "event": 27,
        "category": 28,
        "focus": 29,
        "responseRequired": 37,
        "allowedResponse": 38,
        "graph": 44
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "eventCoding": "Coding",
        "eventUri": "uri"
      }
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 30,
        "extension": 31,
        "modifierExtension": 32,
        "code": 33,
        "profile": 34,
        "min": 35,
        "max": 36
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "message": 42,
        "situation": 43
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    }
  ],
  "MessageHeader": [
    {
      "_type_": "complex",
      "type": "MessageHeader",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "event": 9,
        "destination": 10,
        "sender": 18,
        "enterer": 19,
        "author": 20,
        "source": 21,
        "responsible": 30,
        "reason": 31,
        "response": 32,
        "focus": 39,
        "definition": 40
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "eventCoding": "Coding",
        "eventUri": "uri"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 11,
        "extension": 12,
        "modifierExtension": 13,
        "name": 14,
        "target": 15,
        "endpoint": 16,
        "receiver": 17
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "url",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 22,
        "extension": 23,
        "modifierExtension": 24,
        "name": 25,
        "software": 26,
        "version": 27,
        "contact": 28,
        "endpoint": 29
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "url",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 33,
        "extension": 34,
        "modifierExtension": 35,
        "identifier": 36,
        "code": 37,
        "details": 38
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    }
  ],
  "MolecularSequence": [
    {
      "_type_": "complex",
      "type": "MolecularSequence",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "type": 10,
        "coordinateSystem": 11,
        "patient": 12,
        "specimen": 13,
        "device": 14,
        "performer": 15,
        "quantity": 16,
        "referenceSeq": 17,
        "variant": 30,
        "observedSeq": 40,
        "quality": 41,
        "readCoverage": 70,
        "repository": 71,
        "pointer": 81,
        "structureVariant": 82
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 18,
        "extension": 19,
        "modifierExtension": 20,
        "chromosome": 21,
        "genomeBuild": 22,
        "orientation": 23,
        "referenceSeqId": 24,
        "referenceSeqPointer": 25,
        "referenceSeqString": 26,
        "strand": 27,
        "windowStart": 28,
        "windowEnd": 29
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "start": 34,
        "end": 35,
        "observedAllele": 36,
        "referenceAllele": 37,
        "cigar": 38,
        "variantPointer": 39
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 42,
        "extension": 43,
        "modifierExtension": 44,
        "type": 45,
        "standardSequence": 46,
        "start": 47,
        "end": 48,
        "score": 49,
        "method": 50,
        "truthTP": 51,
        "queryTP": 52,
        "truthFN": 53,
        "queryFP": 54,
        "gtFP": 55,
        "precision": 56,
        "recall": 57,
        "fScore": 58,
        "roc": 59
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 60,
        "extension": 61,
        "modifierExtension": 62,
        "score": 63,
        "numTP": 64,
        "numFP": 65,
        "numFN": 66,
        "precision": 67,
        "sensitivity": 68,
        "fMeasure": 69
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 72,
        "extension": 73,
        "modifierExtension": 74,
        "type": 75,
        "url": 76,
        "name": 77,
        "datasetId": 78,
        "variantsetId": 79,
        "readsetId": 80
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 83,
        "extension": 84,
        "modifierExtension": 85,
        "variantType": 86,
        "exact": 87,
        "length": 88,
        "outer": 89,
        "inner": 95
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 90,
        "extension": 91,
        "modifierExtension": 92,
        "start": 93,
        "end": 94
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 96,
        "extension": 97,
        "modifierExtension": 98,
        "start": 99,
        "end": 100
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    }
  ],
  "NamingSystem": [
    {
      "_type_": "complex",
      "type": "NamingSystem",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "name": 9,
        "status": 10,
        "kind": 11,
        "date": 12,
        "publisher": 13,
        "contact": 14,
        "responsible": 15,
        "type": 16,
        "description": 17,
        "useContext": 18,
        "jurisdiction": 19,
        "usage": 20,
        "uniqueId": 21
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 22,
        "extension": 23,
        "modifierExtension": 24,
        "type": 25,
        "value": 26,
        "preferred": 27,
        "comment": 28,
        "period": 29
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    }
  ],
  "NutritionOrder": [
    {
      "_type_": "complex",
      "type": "NutritionOrder",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "instantiatesCanonical": 10,
        "instantiatesUri": 11,
        "instantiates": 12,
        "status": 13,
        "intent": 14,
        "patient": 15,
        "encounter": 16,
        "dateTime": 17,
        "orderer": 18,
        "allergyIntolerance": 19,
        "foodPreferenceModifier": 20,
        "excludeFoodModifier": 21,
        "oralDiet": 22,
        "supplement": 42,
        "enteralFormula": 51,
        "note": 70
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 23,
        "extension": 24,
        "modifierExtension": 25,
        "type": 26,
        "schedule": 27,
        "nutrient": 28,
        "texture": 34,
        "fluidConsistencyType": 40,
        "instruction": 41
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Timing",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 29,
        "extension": 30,
        "modifierExtension": 31,
        "modifier": 32,
        "amount": 33
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 35,
        "extension": 36,
        "modifierExtension": 37,
        "modifier": 38,
        "foodType": 39
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 43,
        "extension": 44,
        "modifierExtension": 45,
        "type": 46,
        "productName": 47,
        "schedule": 48,
        "quantity": 49,
        "instruction": 50
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Timing",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 52,
        "extension": 53,
        "modifierExtension": 54,
        "baseFormulaType": 55,
        "baseFormulaProductName": 56,
        "additiveType": 57,
        "additiveProductName": 58,
        "caloricDensity": 59,
        "routeofAdministration": 60,
        "administration": 61,
        "maxVolumeToDeliver": 68,
        "administrationInstruction": 69
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 62,
        "extension": 63,
        "modifierExtension": 64,
        "schedule": 65,
        "quantity": 66,
        "rate": 67
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Timing",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "rateQuantity": "Quantity",
        "rateRatio": "Ratio"
      }
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "Observation": [
    {
      "_type_": "complex",
      "type": "Observation",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "basedOn": 10,
        "partOf": 11,
        "status": 12,
        "category": 13,
        "code": 14,
        "subject": 15,
        "focus": 16,
        "encounter": 17,
        "effective": 18,
        "issued": 19,
        "performer": 20,
        "value": 21,
        "dataAbsentReason": 22,
        "interpretation": 23,
        "note": 24,
        "bodySite": 25,
        "method": 26,
        "specimen": 27,
        "device": 28,
        "referenceRange": 29,
        "hasMember": 39,
        "derivedFrom": 40,
        "component": 41
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "effectiveDateTime": "dateTime",
        "effectivePeriod": "Period",
        "effectiveTiming": "Timing",
        "effectiveInstant": "instant"
      }
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueQuantity": "Quantity",
        "valueCodeableConcept": "CodeableConcept",
        "valueString": "string",
        "valueBoolean": "boolean",
        "valueInteger": "integer",
        "valueRange": "Range",
        "valueRatio": "Ratio",
        "valueSampledData": "SampledData",
        "valueTime": "time",
        "valueDateTime": "dateTime",
        "valuePeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 30,
        "extension": 31,
        "modifierExtension": 32,
        "low": 33,
        "high": 34,
        "type": 35,
        "appliesTo": 36,
        "age": 37,
        "text": 38
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Range",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 42,
        "extension": 43,
        "modifierExtension": 44,
        "code": 45,
        "value": 46,
        "dataAbsentReason": 47,
        "interpretation": 48,
        "referenceRange": 29
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueQuantity": "Quantity",
        "valueCodeableConcept": "CodeableConcept",
        "valueString": "string",
        "valueBoolean": "boolean",
        "valueInteger": "integer",
        "valueRange": "Range",
        "valueRatio": "Ratio",
        "valueSampledData": "SampledData",
        "valueTime": "time",
        "valueDateTime": "dateTime",
        "valuePeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    }
  ],
  "ObservationDefinition": [
    {
      "_type_": "complex",
      "type": "ObservationDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "category": 9,
        "code": 10,
        "identifier": 11,
        "permittedDataType": 12,
        "multipleResultsAllowed": 13,
        "method": 14,
        "preferredReportName": 15,
        "quantitativeDetails": 16,
        "qualifiedInterval": 24,
        "validCodedValueSet": 36,
        "normalCodedValueSet": 37,
        "abnormalCodedValueSet": 38,
        "criticalCodedValueSet": 39
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 17,
        "extension": 18,
        "modifierExtension": 19,
        "customaryUnit": 20,
        "unit": 21,
        "conversionFactor": 22,
        "decimalPrecision": 23
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 25,
        "extension": 26,
        "modifierExtension": 27,
        "category": 28,
        "range": 29,
        "context": 30,
        "appliesTo": 31,
        "gender": 32,
        "age": 33,
        "gestationalAge": 34,
        "condition": 35
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Range",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Range",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Range",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "OperationDefinition": [
    {
      "_type_": "complex",
      "type": "OperationDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "version": 10,
        "name": 11,
        "title": 12,
        "status": 13,
        "kind": 14,
        "experimental": 15,
        "date": 16,
        "publisher": 17,
        "contact": 18,
        "description": 19,
        "useContext": 20,
        "jurisdiction": 21,
        "purpose": 22,
        "affectsState": 23,
        "code": 24,
        "comment": 25,
        "base": 26,
        "resource": 27,
        "system": 28,
        "type": 29,
        "instance": 30,
        "inputProfile": 31,
        "outputProfile": 32,
        "parameter": 33,
        "overload": 58
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 34,
        "extension": 35,
        "modifierExtension": 36,
        "name": 37,
        "use": 38,
        "min": 39,
        "max": 40,
        "documentation": 41,
        "type": 42,
        "targetProfile": 43,
        "searchType": 44,
        "binding": 45,
        "referencedFrom": 51,
        "part": 33
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 46,
        "extension": 47,
        "modifierExtension": 48,
        "strength": 49,
        "valueSet": 50
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 52,
        "extension": 53,
        "modifierExtension": 54,
        "source": 55,
        "sourceId": 56
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 59,
        "extension": 60,
        "modifierExtension": 61,
        "parameterName": 62,
        "comment": 63
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "OperationOutcome": [
    {
      "_type_": "complex",
      "type": "OperationOutcome",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "issue": 9
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 10,
        "extension": 11,
        "modifierExtension": 12,
        "severity": 13,
        "code": 14,
        "details": 15,
        "diagnostics": 16,
        "location": 17,
        "expression": 18
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    }
  ],
  "Organization": [
    {
      "_type_": "complex",
      "type": "Organization",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "active": 10,
        "type": 11,
        "name": 12,
        "alias": 13,
        "telecom": 14,
        "address": 15,
        "partOf": 16,
        "contact": 17,
        "endpoint": 25
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Address",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 18,
        "extension": 19,
        "modifierExtension": 20,
        "purpose": 21,
        "name": 22,
        "telecom": 23,
        "address": 24
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "HumanName",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Address",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "OrganizationAffiliation": [
    {
      "_type_": "complex",
      "type": "OrganizationAffiliation",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "active": 10,
        "period": 11,
        "organization": 12,
        "participatingOrganization": 13,
        "network": 14,
        "code": 15,
        "specialty": 16,
        "location": 17,
        "healthcareService": 18,
        "telecom": 19,
        "endpoint": 20
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "Parameters": [
    {
      "_type_": "complex",
      "type": "Parameters",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "parameter": 5
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 6,
        "extension": 7,
        "modifierExtension": 8,
        "name": 9,
        "value": 10,
        "resource": 11,
        "part": 5
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueBase64Binary": "base64Binary",
        "valueBoolean": "boolean",
        "valueCanonical": "canonical",
        "valueCode": "code",
        "valueDate": "date",
        "valueDateTime": "dateTime",
        "valueDecimal": "decimal",
        "valueId": "id",
        "valueInstant": "instant",
        "valueInteger": "integer",
        "valueMarkdown": "markdown",
        "valueOid": "oid",
        "valuePositiveInt": "positiveInt",
        "valueString": "string",
        "valueTime": "time",
        "valueUnsignedInt": "unsignedInt",
        "valueUri": "uri",
        "valueUrl": "url",
        "valueUuid": "uuid",
        "valueAddress": "Address",
        "valueAge": "Age",
        "valueAnnotation": "Annotation",
        "valueAttachment": "Attachment",
        "valueCodeableConcept": "CodeableConcept",
        "valueCoding": "Coding",
        "valueContactPoint": "ContactPoint",
        "valueCount": "Count",
        "valueDistance": "Distance",
        "valueDuration": "Duration",
        "valueHumanName": "HumanName",
        "valueIdentifier": "Identifier",
        "valueMoney": "Money",
        "valuePeriod": "Period",
        "valueQuantity": "Quantity",
        "valueRange": "Range",
        "valueRatio": "Ratio",
        "valueReference": "Reference",
        "valueSampledData": "SampledData",
        "valueSignature": "Signature",
        "valueTiming": "Timing",
        "valueContactDetail": "ContactDetail",
        "valueContributor": "Contributor",
        "valueDataRequirement": "DataRequirement",
        "valueExpression": "Expression",
        "valueParameterDefinition": "ParameterDefinition",
        "valueRelatedArtifact": "RelatedArtifact",
        "valueTriggerDefinition": "TriggerDefinition",
        "valueUsageContext": "UsageContext",
        "valueDosage": "Dosage",
        "valueMeta": "Meta"
      }
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "single"
    }
  ],
  "Patient": [
    {
      "_type_": "complex",
      "type": "Patient",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "active": 10,
        "name": 11,
        "telecom": 12,
        "gender": 13,
        "birthDate": 14,
        "deceased": 15,
        "address": 16,
        "maritalStatus": 17,
        "multipleBirth": 18,
        "photo": 19,
        "contact": 20,
        "communication": 31,
        "generalPractitioner": 37,
        "managingOrganization": 38,
        "link": 39
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "HumanName",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "deceasedBoolean": "boolean",
        "deceasedDateTime": "dateTime"
      }
    },
    {
      "_type_": "type",
      "type": "Address",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "multipleBirthBoolean": "boolean",
        "multipleBirthInteger": "integer"
      }
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "relationship": 24,
        "name": 25,
        "telecom": 26,
        "address": 27,
        "gender": 28,
        "organization": 29,
        "period": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "HumanName",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Address",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 32,
        "extension": 33,
        "modifierExtension": 34,
        "language": 35,
        "preferred": 36
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 40,
        "extension": 41,
        "modifierExtension": 42,
        "other": 43,
        "type": 44
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "PaymentNotice": [
    {
      "_type_": "complex",
      "type": "PaymentNotice",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "request": 11,
        "response": 12,
        "created": 13,
        "provider": 14,
        "payment": 15,
        "paymentDate": 16,
        "payee": 17,
        "recipient": 18,
        "amount": 19,
        "paymentStatus": 20
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "PaymentReconciliation": [
    {
      "_type_": "complex",
      "type": "PaymentReconciliation",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "period": 11,
        "created": 12,
        "paymentIssuer": 13,
        "request": 14,
        "requestor": 15,
        "outcome": 16,
        "disposition": 17,
        "paymentDate": 18,
        "paymentAmount": 19,
        "paymentIdentifier": 20,
        "detail": 21,
        "formCode": 35,
        "processNote": 36
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 22,
        "extension": 23,
        "modifierExtension": 24,
        "identifier": 25,
        "predecessor": 26,
        "type": 27,
        "request": 28,
        "submitter": 29,
        "response": 30,
        "date": 31,
        "responsible": 32,
        "payee": 33,
        "amount": 34
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Money",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 37,
        "extension": 38,
        "modifierExtension": 39,
        "type": 40,
        "text": 41
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "Person": [
    {
      "_type_": "complex",
      "type": "Person",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "name": 10,
        "telecom": 11,
        "gender": 12,
        "birthDate": 13,
        "address": 14,
        "photo": 15,
        "managingOrganization": 16,
        "active": 17,
        "link": 18
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "HumanName",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Address",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 19,
        "extension": 20,
        "modifierExtension": 21,
        "target": 22,
        "assurance": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "PlanDefinition": [
    {
      "_type_": "complex",
      "type": "PlanDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "subtitle": 14,
        "type": 15,
        "status": 16,
        "experimental": 17,
        "subject": 18,
        "date": 19,
        "publisher": 20,
        "contact": 21,
        "description": 22,
        "useContext": 23,
        "jurisdiction": 24,
        "purpose": 25,
        "usage": 26,
        "copyright": 27,
        "approvalDate": 28,
        "lastReviewDate": 29,
        "effectivePeriod": 30,
        "topic": 31,
        "author": 32,
        "editor": 33,
        "reviewer": 34,
        "endorser": 35,
        "relatedArtifact": 36,
        "library": 37,
        "goal": 38,
        "action": 55
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "subjectCodeableConcept": "CodeableConcept",
        "subjectReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "category": 42,
        "description": 43,
        "priority": 44,
        "start": 45,
        "addresses": 46,
        "documentation": 47,
        "target": 48
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 49,
        "extension": 50,
        "modifierExtension": 51,
        "measure": 52,
        "detail": 53,
        "due": 54
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "detailQuantity": "Quantity",
        "detailRange": "Range",
        "detailCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 56,
        "extension": 57,
        "modifierExtension": 58,
        "prefix": 59,
        "title": 60,
        "description": 61,
        "textEquivalent": 62,
        "priority": 63,
        "code": 64,
        "reason": 65,
        "documentation": 66,
        "goalId": 67,
        "subject": 68,
        "trigger": 69,
        "condition": 70,
        "input": 76,
        "output": 77,
        "relatedAction": 78,
        "timing": 85,
        "participant": 86,
        "type": 92,
        "groupingBehavior": 93,
        "selectionBehavior": 94,
        "requiredBehavior": 95,
        "precheckBehavior": 96,
        "cardinalityBehavior": 97,
        "definition": 98,
        "transform": 99,
        "dynamicValue": 100,
        "action": 55
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "subjectCodeableConcept": "CodeableConcept",
        "subjectReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "TriggerDefinition",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 71,
        "extension": 72,
        "modifierExtension": 73,
        "kind": 74,
        "expression": 75
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "DataRequirement",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "DataRequirement",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 79,
        "extension": 80,
        "modifierExtension": 81,
        "actionId": 82,
        "relationship": 83,
        "offset": 84
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "offsetDuration": "Duration",
        "offsetRange": "Range"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "timingDateTime": "dateTime",
        "timingAge": "Age",
        "timingPeriod": "Period",
        "timingDuration": "Duration",
        "timingRange": "Range",
        "timingTiming": "Timing"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 87,
        "extension": 88,
        "modifierExtension": 89,
        "type": 90,
        "role": 91
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "definitionCanonical": "canonical",
        "definitionUri": "uri"
      }
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 101,
        "extension": 102,
        "modifierExtension": 103,
        "path": 104,
        "expression": 105
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    }
  ],
  "Practitioner": [
    {
      "_type_": "complex",
      "type": "Practitioner",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "active": 10,
        "name": 11,
        "telecom": 12,
        "address": 13,
        "gender": 14,
        "birthDate": 15,
        "photo": 16,
        "qualification": 17,
        "communication": 25
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "HumanName",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Address",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 18,
        "extension": 19,
        "modifierExtension": 20,
        "identifier": 21,
        "code": 22,
        "period": 23,
        "issuer": 24
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    }
  ],
  "PractitionerRole": [
    {
      "_type_": "complex",
      "type": "PractitionerRole",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "active": 10,
        "period": 11,
        "practitioner": 12,
        "organization": 13,
        "code": 14,
        "specialty": 15,
        "location": 16,
        "healthcareService": 17,
        "telecom": 18,
        "availableTime": 19,
        "notAvailable": 27,
        "availabilityExceptions": 33,
        "endpoint": 34
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 20,
        "extension": 21,
        "modifierExtension": 22,
        "daysOfWeek": 23,
        "allDay": 24,
        "availableStartTime": 25,
        "availableEndTime": 26
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "time",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "time",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 28,
        "extension": 29,
        "modifierExtension": 30,
        "description": 31,
        "during": 32
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "Procedure": [
    {
      "_type_": "complex",
      "type": "Procedure",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "instantiatesCanonical": 10,
        "instantiatesUri": 11,
        "basedOn": 12,
        "partOf": 13,
        "status": 14,
        "statusReason": 15,
        "category": 16,
        "code": 17,
        "subject": 18,
        "encounter": 19,
        "performed": 20,
        "recorder": 21,
        "asserter": 22,
        "performer": 23,
        "location": 30,
        "reasonCode": 31,
        "reasonReference": 32,
        "bodySite": 33,
        "outcome": 34,
        "report": 35,
        "complication": 36,
        "complicationDetail": 37,
        "followUp": 38,
        "note": 39,
        "focalDevice": 40,
        "usedReference": 46,
        "usedCode": 47
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "performedDateTime": "dateTime",
        "performedPeriod": "Period",
        "performedString": "string",
        "performedAge": "Age",
        "performedRange": "Range"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "function": 27,
        "actor": 28,
        "onBehalfOf": 29
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 41,
        "extension": 42,
        "modifierExtension": 43,
        "action": 44,
        "manipulated": 45
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    }
  ],
  "Provenance": [
    {
      "_type_": "complex",
      "type": "Provenance",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "target": 9,
        "occurred": 10,
        "recorded": 11,
        "policy": 12,
        "location": 13,
        "reason": 14,
        "activity": 15,
        "agent": 16,
        "entity": 24,
        "signature": 31
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "occurredPeriod": "Period",
        "occurredDateTime": "dateTime"
      }
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 17,
        "extension": 18,
        "modifierExtension": 19,
        "type": 20,
        "role": 21,
        "who": 22,
        "onBehalfOf": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 25,
        "extension": 26,
        "modifierExtension": 27,
        "role": 28,
        "what": 29,
        "agent": 16
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    null,
    {
      "_type_": "type",
      "type": "Signature",
      "cardinality": "array"
    }
  ],
  "Questionnaire": [
    {
      "_type_": "complex",
      "type": "Questionnaire",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "derivedFrom": 14,
        "status": 15,
        "experimental": 16,
        "subjectType": 17,
        "date": 18,
        "publisher": 19,
        "contact": 20,
        "description": 21,
        "useContext": 22,
        "jurisdiction": 23,
        "purpose": 24,
        "copyright": 25,
        "approvalDate": 26,
        "lastReviewDate": 27,
        "effectivePeriod": 28,
        "code": 29,
        "item": 30
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "linkId": 34,
        "definition": 35,
        "code": 36,
        "prefix": 37,
        "text": 38,
        "type": 39,
        "enableWhen": 40,
        "enableBehavior": 47,
        "required": 48,
        "repeats": 49,
        "readOnly": 50,
        "maxLength": 51,
        "answerValueSet": 52,
        "answerOption": 53,
        "initial": 59,
        "item": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 41,
        "extension": 42,
        "modifierExtension": 43,
        "question": 44,
        "operator": 45,
        "answer": 46
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "answerBoolean": "boolean",
        "answerDecimal": "decimal",
        "answerInteger": "integer",
        "answerDate": "date",
        "answerDateTime": "dateTime",
        "answerTime": "time",
        "answerString": "string",
        "answerCoding": "Coding",
        "answerQuantity": "Quantity",
        "answerReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 54,
        "extension": 55,
        "modifierExtension": 56,
        "value": 57,
        "initialSelected": 58
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueInteger": "integer",
        "valueDate": "date",
        "valueTime": "time",
        "valueString": "string",
        "valueCoding": "Coding",
        "valueReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 60,
        "extension": 61,
        "modifierExtension": 62,
        "value": 63
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueBoolean": "boolean",
        "valueDecimal": "decimal",
        "valueInteger": "integer",
        "valueDate": "date",
        "valueDateTime": "dateTime",
        "valueTime": "time",
        "valueString": "string",
        "valueUri": "uri",
        "valueAttachment": "Attachment",
        "valueCoding": "Coding",
        "valueQuantity": "Quantity",
        "valueReference": "Reference"
      }
    }
  ],
  "QuestionnaireResponse": [
    {
      "_type_": "complex",
      "type": "QuestionnaireResponse",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "basedOn": 10,
        "partOf": 11,
        "questionnaire": 12,
        "status": 13,
        "subject": 14,
        "encounter": 15,
        "authored": 16,
        "author": 17,
        "source": 18,
        "item": 19
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 20,
        "extension": 21,
        "modifierExtension": 22,
        "linkId": 23,
        "definition": 24,
        "text": 25,
        "answer": 26,
        "item": 19
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 27,
        "extension": 28,
        "modifierExtension": 29,
        "value": 30,
        "item": 19
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueBoolean": "boolean",
        "valueDecimal": "decimal",
        "valueInteger": "integer",
        "valueDate": "date",
        "valueDateTime": "dateTime",
        "valueTime": "time",
        "valueString": "string",
        "valueUri": "uri",
        "valueAttachment": "Attachment",
        "valueCoding": "Coding",
        "valueQuantity": "Quantity",
        "valueReference": "Reference"
      }
    },
    null
  ],
  "RelatedPerson": [
    {
      "_type_": "complex",
      "type": "RelatedPerson",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "active": 10,
        "patient": 11,
        "relationship": 12,
        "name": 13,
        "telecom": 14,
        "gender": 15,
        "birthDate": 16,
        "address": 17,
        "photo": 18,
        "period": 19,
        "communication": 20
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "HumanName",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Address",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "language": 24,
        "preferred": 25
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    }
  ],
  "RequestGroup": [
    {
      "_type_": "complex",
      "type": "RequestGroup",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "instantiatesCanonical": 10,
        "instantiatesUri": 11,
        "basedOn": 12,
        "replaces": 13,
        "groupIdentifier": 14,
        "status": 15,
        "intent": 16,
        "priority": 17,
        "code": 18,
        "subject": 19,
        "encounter": 20,
        "authoredOn": 21,
        "author": 22,
        "reasonCode": 23,
        "reasonReference": 24,
        "note": 25,
        "action": 26
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 27,
        "extension": 28,
        "modifierExtension": 29,
        "prefix": 30,
        "title": 31,
        "description": 32,
        "textEquivalent": 33,
        "priority": 34,
        "code": 35,
        "documentation": 36,
        "condition": 37,
        "relatedAction": 43,
        "timing": 50,
        "participant": 51,
        "type": 52,
        "groupingBehavior": 53,
        "selectionBehavior": 54,
        "requiredBehavior": 55,
        "precheckBehavior": 56,
        "cardinalityBehavior": 57,
        "resource": 58,
        "action": 26
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 38,
        "extension": 39,
        "modifierExtension": 40,
        "kind": 41,
        "expression": 42
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 44,
        "extension": 45,
        "modifierExtension": 46,
        "actionId": 47,
        "relationship": 48,
        "offset": 49
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "offsetDuration": "Duration",
        "offsetRange": "Range"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "timingDateTime": "dateTime",
        "timingAge": "Age",
        "timingPeriod": "Period",
        "timingDuration": "Duration",
        "timingRange": "Range",
        "timingTiming": "Timing"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "ResearchDefinition": [
    {
      "_type_": "complex",
      "type": "ResearchDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "shortTitle": 14,
        "subtitle": 15,
        "status": 16,
        "experimental": 17,
        "subject": 18,
        "date": 19,
        "publisher": 20,
        "contact": 21,
        "description": 22,
        "comment": 23,
        "useContext": 24,
        "jurisdiction": 25,
        "purpose": 26,
        "usage": 27,
        "copyright": 28,
        "approvalDate": 29,
        "lastReviewDate": 30,
        "effectivePeriod": 31,
        "topic": 32,
        "author": 33,
        "editor": 34,
        "reviewer": 35,
        "endorser": 36,
        "relatedArtifact": 37,
        "library": 38,
        "population": 39,
        "exposure": 40,
        "exposureAlternative": 41,
        "outcome": 42
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "subjectCodeableConcept": "CodeableConcept",
        "subjectReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "ResearchElementDefinition": [
    {
      "_type_": "complex",
      "type": "ResearchElementDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "shortTitle": 14,
        "subtitle": 15,
        "status": 16,
        "experimental": 17,
        "subject": 18,
        "date": 19,
        "publisher": 20,
        "contact": 21,
        "description": 22,
        "comment": 23,
        "useContext": 24,
        "jurisdiction": 25,
        "purpose": 26,
        "usage": 27,
        "copyright": 28,
        "approvalDate": 29,
        "lastReviewDate": 30,
        "effectivePeriod": 31,
        "topic": 32,
        "author": 33,
        "editor": 34,
        "reviewer": 35,
        "endorser": 36,
        "relatedArtifact": 37,
        "library": 38,
        "type": 39,
        "variableType": 40,
        "characteristic": 41
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "subjectCodeableConcept": "CodeableConcept",
        "subjectReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 42,
        "extension": 43,
        "modifierExtension": 44,
        "definition": 45,
        "usageContext": 46,
        "exclude": 47,
        "unitOfMeasure": 48,
        "studyEffectiveDescription": 49,
        "studyEffective": 50,
        "studyEffectiveTimeFromStart": 51,
        "studyEffectiveGroupMeasure": 52,
        "participantEffectiveDescription": 53,
        "participantEffective": 54,
        "participantEffectiveTimeFromStart": 55,
        "participantEffectiveGroupMeasure": 56
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "definitionCodeableConcept": "CodeableConcept",
        "definitionCanonical": "canonical",
        "definitionExpression": "Expression",
        "definitionDataRequirement": "DataRequirement"
      }
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "studyEffectiveDateTime": "dateTime",
        "studyEffectivePeriod": "Period",
        "studyEffectiveDuration": "Duration",
        "studyEffectiveTiming": "Timing"
      }
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "participantEffectiveDateTime": "dateTime",
        "participantEffectivePeriod": "Period",
        "participantEffectiveDuration": "Duration",
        "participantEffectiveTiming": "Timing"
      }
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "ResearchStudy": [
    {
      "_type_": "complex",
      "type": "ResearchStudy",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "title": 10,
        "protocol": 11,
        "partOf": 12,
        "status": 13,
        "primaryPurposeType": 14,
        "phase": 15,
        "category": 16,
        "focus": 17,
        "condition": 18,
        "contact": 19,
        "relatedArtifact": 20,
        "keyword": 21,
        "location": 22,
        "description": 23,
        "enrollment": 24,
        "period": 25,
        "sponsor": 26,
        "principalInvestigator": 27,
        "site": 28,
        "reasonStopped": 29,
        "note": 30,
        "arm": 31,
        "objective": 38
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 32,
        "extension": 33,
        "modifierExtension": 34,
        "name": 35,
        "type": 36,
        "description": 37
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 39,
        "extension": 40,
        "modifierExtension": 41,
        "name": 42,
        "type": 43
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "ResearchSubject": [
    {
      "_type_": "complex",
      "type": "ResearchSubject",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "period": 11,
        "study": 12,
        "individual": 13,
        "assignedArm": 14,
        "actualArm": 15,
        "consent": 16
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "RiskAssessment": [
    {
      "_type_": "complex",
      "type": "RiskAssessment",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "basedOn": 10,
        "parent": 11,
        "status": 12,
        "method": 13,
        "code": 14,
        "subject": 15,
        "encounter": 16,
        "occurrence": 17,
        "condition": 18,
        "performer": 19,
        "reasonCode": 20,
        "reasonReference": 21,
        "basis": 22,
        "prediction": 23,
        "mitigation": 33,
        "note": 34
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "occurrenceDateTime": "dateTime",
        "occurrencePeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "outcome": 27,
        "probability": 28,
        "qualitativeRisk": 29,
        "relativeRisk": 30,
        "when": 31,
        "rationale": 32
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "probabilityDecimal": "decimal",
        "probabilityRange": "Range"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "whenPeriod": "Period",
        "whenRange": "Range"
      }
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "RiskEvidenceSynthesis": [
    {
      "_type_": "complex",
      "type": "RiskEvidenceSynthesis",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "status": 14,
        "date": 15,
        "publisher": 16,
        "contact": 17,
        "description": 18,
        "note": 19,
        "useContext": 20,
        "jurisdiction": 21,
        "copyright": 22,
        "approvalDate": 23,
        "lastReviewDate": 24,
        "effectivePeriod": 25,
        "topic": 26,
        "author": 27,
        "editor": 28,
        "reviewer": 29,
        "endorser": 30,
        "relatedArtifact": 31,
        "synthesisType": 32,
        "studyType": 33,
        "population": 34,
        "exposure": 35,
        "outcome": 36,
        "sampleSize": 37,
        "riskEstimate": 44,
        "certainty": 62
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "RelatedArtifact",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 38,
        "extension": 39,
        "modifierExtension": 40,
        "description": 41,
        "numberOfStudies": 42,
        "numberOfParticipants": 43
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 45,
        "extension": 46,
        "modifierExtension": 47,
        "description": 48,
        "type": 49,
        "value": 50,
        "unitOfMeasure": 51,
        "denominatorCount": 52,
        "numeratorCount": 53,
        "precisionEstimate": 54
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 55,
        "extension": 56,
        "modifierExtension": 57,
        "type": 58,
        "level": 59,
        "from": 60,
        "to": 61
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 63,
        "extension": 64,
        "modifierExtension": 65,
        "rating": 66,
        "note": 67,
        "certaintySubcomponent": 68
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 69,
        "extension": 70,
        "modifierExtension": 71,
        "type": 72,
        "rating": 73,
        "note": 74
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "Schedule": [
    {
      "_type_": "complex",
      "type": "Schedule",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "active": 10,
        "serviceCategory": 11,
        "serviceType": 12,
        "specialty": 13,
        "actor": 14,
        "planningHorizon": 15,
        "comment": 16
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "SearchParameter": [
    {
      "_type_": "complex",
      "type": "SearchParameter",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "version": 10,
        "name": 11,
        "derivedFrom": 12,
        "status": 13,
        "experimental": 14,
        "date": 15,
        "publisher": 16,
        "contact": 17,
        "description": 18,
        "useContext": 19,
        "jurisdiction": 20,
        "purpose": 21,
        "code": 22,
        "base": 23,
        "type": 24,
        "expression": 25,
        "xpath": 26,
        "xpathUsage": 27,
        "target": 28,
        "multipleOr": 29,
        "multipleAnd": 30,
        "comparator": 31,
        "modifier": 32,
        "chain": 33,
        "component": 34
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 35,
        "extension": 36,
        "modifierExtension": 37,
        "definition": 38,
        "expression": 39
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "ServiceRequest": [
    {
      "_type_": "complex",
      "type": "ServiceRequest",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "instantiatesCanonical": 10,
        "instantiatesUri": 11,
        "basedOn": 12,
        "replaces": 13,
        "requisition": 14,
        "status": 15,
        "intent": 16,
        "category": 17,
        "priority": 18,
        "doNotPerform": 19,
        "code": 20,
        "orderDetail": 21,
        "quantity": 22,
        "subject": 23,
        "encounter": 24,
        "occurrence": 25,
        "asNeeded": 26,
        "authoredOn": 27,
        "requester": 28,
        "performerType": 29,
        "performer": 30,
        "locationCode": 31,
        "locationReference": 32,
        "reasonCode": 33,
        "reasonReference": 34,
        "insurance": 35,
        "supportingInfo": 36,
        "specimen": 37,
        "bodySite": 38,
        "note": 39,
        "patientInstruction": 40,
        "relevantHistory": 41
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "quantityQuantity": "Quantity",
        "quantityRatio": "Ratio",
        "quantityRange": "Range"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "occurrenceDateTime": "dateTime",
        "occurrencePeriod": "Period",
        "occurrenceTiming": "Timing"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "asNeededBoolean": "boolean",
        "asNeededCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "Slot": [
    {
      "_type_": "complex",
      "type": "Slot",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "serviceCategory": 10,
        "serviceType": 11,
        "specialty": 12,
        "appointmentType": 13,
        "schedule": 14,
        "status": 15,
        "start": 16,
        "end": 17,
        "overbooked": 18,
        "comment": 19
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "Specimen": [
    {
      "_type_": "complex",
      "type": "Specimen",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "accessionIdentifier": 10,
        "status": 11,
        "type": 12,
        "subject": 13,
        "receivedTime": 14,
        "parent": 15,
        "request": 16,
        "collection": 17,
        "processing": 28,
        "container": 36,
        "condition": 46,
        "note": 47
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 18,
        "extension": 19,
        "modifierExtension": 20,
        "collector": 21,
        "collected": 22,
        "duration": 23,
        "quantity": 24,
        "method": 25,
        "bodySite": 26,
        "fastingStatus": 27
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "collectedDateTime": "dateTime",
        "collectedPeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "fastingStatusCodeableConcept": "CodeableConcept",
        "fastingStatusDuration": "Duration"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 29,
        "extension": 30,
        "modifierExtension": 31,
        "description": 32,
        "procedure": 33,
        "additive": 34,
        "time": 35
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "timeDateTime": "dateTime",
        "timePeriod": "Period"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 37,
        "extension": 38,
        "modifierExtension": 39,
        "identifier": 40,
        "description": 41,
        "type": 42,
        "capacity": 43,
        "specimenQuantity": 44,
        "additive": 45
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "additiveCodeableConcept": "CodeableConcept",
        "additiveReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "SpecimenDefinition": [
    {
      "_type_": "complex",
      "type": "SpecimenDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "typeCollected": 10,
        "patientPreparation": 11,
        "timeAspect": 12,
        "collection": 13,
        "typeTested": 14
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 15,
        "extension": 16,
        "modifierExtension": 17,
        "isDerived": 18,
        "type": 19,
        "preference": 20,
        "container": 21,
        "requirement": 37,
        "retentionTime": 38,
        "rejectionCriterion": 39,
        "handling": 40
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 22,
        "extension": 23,
        "modifierExtension": 24,
        "material": 25,
        "type": 26,
        "cap": 27,
        "description": 28,
        "capacity": 29,
        "minimumVolume": 30,
        "additive": 31,
        "preparation": 36
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "minimumVolumeQuantity": "Quantity",
        "minimumVolumeString": "string"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 32,
        "extension": 33,
        "modifierExtension": 34,
        "additive": 35
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "additiveCodeableConcept": "CodeableConcept",
        "additiveReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 41,
        "extension": 42,
        "modifierExtension": 43,
        "temperatureQualifier": 44,
        "temperatureRange": 45,
        "maxDuration": 46,
        "instruction": 47
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Range",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Duration",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "StructureDefinition": [
    {
      "_type_": "complex",
      "type": "StructureDefinition",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "status": 14,
        "experimental": 15,
        "date": 16,
        "publisher": 17,
        "contact": 18,
        "description": 19,
        "useContext": 20,
        "jurisdiction": 21,
        "purpose": 22,
        "copyright": 23,
        "keyword": 24,
        "fhirVersion": 25,
        "mapping": 26,
        "kind": 34,
        "abstract": 35,
        "context": 36,
        "contextInvariant": 42,
        "type": 43,
        "baseDefinition": 44,
        "derivation": 45,
        "snapshot": 46,
        "differential": 51
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 27,
        "extension": 28,
        "modifierExtension": 29,
        "identity": 30,
        "uri": 31,
        "name": 32,
        "comment": 33
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 37,
        "extension": 38,
        "modifierExtension": 39,
        "type": 40,
        "expression": 41
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 47,
        "extension": 48,
        "modifierExtension": 49,
        "element": 50
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ElementDefinition",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 52,
        "extension": 53,
        "modifierExtension": 54,
        "element": 55
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "ElementDefinition",
      "cardinality": "array"
    }
  ],
  "StructureMap": [
    {
      "_type_": "complex",
      "type": "StructureMap",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "status": 14,
        "experimental": 15,
        "date": 16,
        "publisher": 17,
        "contact": 18,
        "description": 19,
        "useContext": 20,
        "jurisdiction": 21,
        "purpose": 22,
        "copyright": 23,
        "structure": 24,
        "import": 32,
        "group": 33
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 25,
        "extension": 26,
        "modifierExtension": 27,
        "url": 28,
        "mode": 29,
        "alias": 30,
        "documentation": 31
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 34,
        "extension": 35,
        "modifierExtension": 36,
        "name": 37,
        "extends": 38,
        "typeMode": 39,
        "documentation": 40,
        "input": 41,
        "rule": 49
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 42,
        "extension": 43,
        "modifierExtension": 44,
        "name": 45,
        "type": 46,
        "mode": 47,
        "documentation": 48
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 50,
        "extension": 51,
        "modifierExtension": 52,
        "name": 53,
        "source": 54,
        "target": 69,
        "rule": 49,
        "dependent": 86,
        "documentation": 92
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 55,
        "extension": 56,
        "modifierExtension": 57,
        "context": 58,
        "min": 59,
        "max": 60,
        "type": 61,
        "defaultValue": 62,
        "element": 63,
        "listMode": 64,
        "variable": 65,
        "condition": 66,
        "check": 67,
        "logMessage": 68
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "defaultValueBase64Binary": "base64Binary",
        "defaultValueBoolean": "boolean",
        "defaultValueCanonical": "canonical",
        "defaultValueCode": "code",
        "defaultValueDate": "date",
        "defaultValueDateTime": "dateTime",
        "defaultValueDecimal": "decimal",
        "defaultValueId": "id",
        "defaultValueInstant": "instant",
        "defaultValueInteger": "integer",
        "defaultValueMarkdown": "markdown",
        "defaultValueOid": "oid",
        "defaultValuePositiveInt": "positiveInt",
        "defaultValueString": "string",
        "defaultValueTime": "time",
        "defaultValueUnsignedInt": "unsignedInt",
        "defaultValueUri": "uri",
        "defaultValueUrl": "url",
        "defaultValueUuid": "uuid",
        "defaultValueAddress": "Address",
        "defaultValueAge": "Age",
        "defaultValueAnnotation": "Annotation",
        "defaultValueAttachment": "Attachment",
        "defaultValueCodeableConcept": "CodeableConcept",
        "defaultValueCoding": "Coding",
        "defaultValueContactPoint": "ContactPoint",
        "defaultValueCount": "Count",
        "defaultValueDistance": "Distance",
        "defaultValueDuration": "Duration",
        "defaultValueHumanName": "HumanName",
        "defaultValueIdentifier": "Identifier",
        "defaultValueMoney": "Money",
        "defaultValuePeriod": "Period",
        "defaultValueQuantity": "Quantity",
        "defaultValueRange": "Range",
        "defaultValueRatio": "Ratio",
        "defaultValueReference": "Reference",
        "defaultValueSampledData": "SampledData",
        "defaultValueSignature": "Signature",
        "defaultValueTiming": "Timing",
        "defaultValueContactDetail": "ContactDetail",
        "defaultValueContributor": "Contributor",
        "defaultValueDataRequirement": "DataRequirement",
        "defaultValueExpression": "Expression",
        "defaultValueParameterDefinition": "ParameterDefinition",
        "defaultValueRelatedArtifact": "RelatedArtifact",
        "defaultValueTriggerDefinition": "TriggerDefinition",
        "defaultValueUsageContext": "UsageContext",
        "defaultValueDosage": "Dosage",
        "defaultValueMeta": "Meta"
      }
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 70,
        "extension": 71,
        "modifierExtension": 72,
        "context": 73,
        "contextType": 74,
        "element": 75,
        "variable": 76,
        "listMode": 77,
        "listRuleId": 78,
        "transform": 79,
        "parameter": 80
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 81,
        "extension": 82,
        "modifierExtension": 83,
        "value": 84
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueId": "id",
        "valueString": "string",
        "valueBoolean": "boolean",
        "valueInteger": "integer",
        "valueDecimal": "decimal"
      }
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 87,
        "extension": 88,
        "modifierExtension": 89,
        "name": 90,
        "variable": 91
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "Subscription": [
    {
      "_type_": "complex",
      "type": "Subscription",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "status": 9,
        "contact": 10,
        "end": 11,
        "reason": 12,
        "criteria": 13,
        "error": 14,
        "channel": 15
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 16,
        "extension": 17,
        "modifierExtension": 18,
        "type": 19,
        "endpoint": 20,
        "payload": 21,
        "header": 22
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "url",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    }
  ],
  "Substance": [
    {
      "_type_": "complex",
      "type": "Substance",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "category": 11,
        "code": 12,
        "description": 13,
        "instance": 14,
        "ingredient": 21
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 15,
        "extension": 16,
        "modifierExtension": 17,
        "identifier": 18,
        "expiry": 19,
        "quantity": 20
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 22,
        "extension": 23,
        "modifierExtension": 24,
        "quantity": 25,
        "substance": 26
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "substanceCodeableConcept": "CodeableConcept",
        "substanceReference": "Reference"
      }
    }
  ],
  "SubstanceNucleicAcid": [
    {
      "_type_": "complex",
      "type": "SubstanceNucleicAcid",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "sequenceType": 9,
        "numberOfSubunits": 10,
        "areaOfHybridisation": 11,
        "oligoNucleotideType": 12,
        "subunit": 13
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 14,
        "extension": 15,
        "modifierExtension": 16,
        "subunit": 17,
        "sequence": 18,
        "length": 19,
        "sequenceAttachment": 20,
        "fivePrime": 21,
        "threePrime": 22,
        "linkage": 23,
        "sugar": 31
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 24,
        "extension": 25,
        "modifierExtension": 26,
        "connectivity": 27,
        "identifier": 28,
        "name": 29,
        "residueSite": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 32,
        "extension": 33,
        "modifierExtension": 34,
        "identifier": 35,
        "name": 36,
        "residueSite": 37
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "SubstancePolymer": [
    {
      "_type_": "complex",
      "type": "SubstancePolymer",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "class": 9,
        "geometry": 10,
        "copolymerConnectivity": 11,
        "modification": 12,
        "monomerSet": 13,
        "repeat": 26
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 14,
        "extension": 15,
        "modifierExtension": 16,
        "ratioType": 17,
        "startingMaterial": 18
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 19,
        "extension": 20,
        "modifierExtension": 21,
        "material": 22,
        "type": 23,
        "isDefining": 24,
        "amount": 25
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "SubstanceAmount",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 27,
        "extension": 28,
        "modifierExtension": 29,
        "numberOfUnits": 30,
        "averageMolecularFormula": 31,
        "repeatUnitAmountType": 32,
        "repeatUnit": 33
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 34,
        "extension": 35,
        "modifierExtension": 36,
        "orientationOfPolymerisation": 37,
        "repeatUnit": 38,
        "amount": 39,
        "degreeOfPolymerisation": 40,
        "structuralRepresentation": 46
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "SubstanceAmount",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 41,
        "extension": 42,
        "modifierExtension": 43,
        "degree": 44,
        "amount": 45
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "SubstanceAmount",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 47,
        "extension": 48,
        "modifierExtension": 49,
        "type": 50,
        "representation": 51,
        "attachment": 52
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "single"
    }
  ],
  "SubstanceProtein": [
    {
      "_type_": "complex",
      "type": "SubstanceProtein",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "sequenceType": 9,
        "numberOfSubunits": 10,
        "disulfideLinkage": 11,
        "subunit": 12
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 13,
        "extension": 14,
        "modifierExtension": 15,
        "subunit": 16,
        "sequence": 17,
        "length": 18,
        "sequenceAttachment": 19,
        "nTerminalModificationId": 20,
        "nTerminalModification": 21,
        "cTerminalModificationId": 22,
        "cTerminalModification": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "SubstanceReferenceInformation": [
    {
      "_type_": "complex",
      "type": "SubstanceReferenceInformation",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "comment": 9,
        "gene": 10,
        "geneElement": 17,
        "classification": 24,
        "target": 32
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 11,
        "extension": 12,
        "modifierExtension": 13,
        "geneSequenceOrigin": 14,
        "gene": 15,
        "source": 16
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 18,
        "extension": 19,
        "modifierExtension": 20,
        "type": 21,
        "element": 22,
        "source": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 25,
        "extension": 26,
        "modifierExtension": 27,
        "domain": 28,
        "classification": 29,
        "subtype": 30,
        "source": 31
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 33,
        "extension": 34,
        "modifierExtension": 35,
        "target": 36,
        "type": 37,
        "interaction": 38,
        "organism": 39,
        "organismType": 40,
        "amount": 41,
        "amountType": 42,
        "source": 43
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "amountQuantity": "Quantity",
        "amountRange": "Range",
        "amountString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "SubstanceSourceMaterial": [
    {
      "_type_": "complex",
      "type": "SubstanceSourceMaterial",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "sourceMaterialClass": 9,
        "sourceMaterialType": 10,
        "sourceMaterialState": 11,
        "organismId": 12,
        "organismName": 13,
        "parentSubstanceId": 14,
        "parentSubstanceName": 15,
        "countryOfOrigin": 16,
        "geographicalLocation": 17,
        "developmentStage": 18,
        "fractionDescription": 19,
        "organism": 25,
        "partDescription": 57
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 20,
        "extension": 21,
        "modifierExtension": 22,
        "fraction": 23,
        "materialType": 24
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 26,
        "extension": 27,
        "modifierExtension": 28,
        "family": 29,
        "genus": 30,
        "species": 31,
        "intraspecificType": 32,
        "intraspecificDescription": 33,
        "author": 34,
        "hybrid": 40,
        "organismGeneral": 49
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 35,
        "extension": 36,
        "modifierExtension": 37,
        "authorType": 38,
        "authorDescription": 39
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 41,
        "extension": 42,
        "modifierExtension": 43,
        "maternalOrganismId": 44,
        "maternalOrganismName": 45,
        "paternalOrganismId": 46,
        "paternalOrganismName": 47,
        "hybridType": 48
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 50,
        "extension": 51,
        "modifierExtension": 52,
        "kingdom": 53,
        "phylum": 54,
        "class": 55,
        "order": 56
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 58,
        "extension": 59,
        "modifierExtension": 60,
        "part": 61,
        "partLocation": 62
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "SubstanceSpecification": [
    {
      "_type_": "complex",
      "type": "SubstanceSpecification",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "type": 10,
        "status": 11,
        "domain": 12,
        "description": 13,
        "source": 14,
        "comment": 15,
        "moiety": 16,
        "property": 27,
        "referenceInformation": 36,
        "structure": 37,
        "code": 69,
        "name": 78,
        "molecularWeight": 53,
        "relationship": 100,
        "nucleicAcid": 111,
        "polymer": 112,
        "protein": 113,
        "sourceMaterial": 114
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 17,
        "extension": 18,
        "modifierExtension": 19,
        "role": 20,
        "identifier": 21,
        "name": 22,
        "stereochemistry": 23,
        "opticalActivity": 24,
        "molecularFormula": 25,
        "amount": 26
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "amountQuantity": "Quantity",
        "amountString": "string"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 28,
        "extension": 29,
        "modifierExtension": 30,
        "category": 31,
        "code": 32,
        "parameters": 33,
        "definingSubstance": 34,
        "amount": 35
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "definingSubstanceReference": "Reference",
        "definingSubstanceCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "amountQuantity": "Quantity",
        "amountString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 38,
        "extension": 39,
        "modifierExtension": 40,
        "stereochemistry": 41,
        "opticalActivity": 42,
        "molecularFormula": 43,
        "molecularFormulaByMoiety": 44,
        "isotope": 45,
        "molecularWeight": 53,
        "source": 61,
        "representation": 62
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 46,
        "extension": 47,
        "modifierExtension": 48,
        "identifier": 49,
        "name": 50,
        "substitution": 51,
        "halfLife": 52,
        "molecularWeight": 53
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 54,
        "extension": 55,
        "modifierExtension": 56,
        "method": 57,
        "type": 58,
        "amount": 59
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    null,
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 63,
        "extension": 64,
        "modifierExtension": 65,
        "type": 66,
        "representation": 67,
        "attachment": 68
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 70,
        "extension": 71,
        "modifierExtension": 72,
        "code": 73,
        "status": 74,
        "statusDate": 75,
        "comment": 76,
        "source": 77
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 79,
        "extension": 80,
        "modifierExtension": 81,
        "name": 82,
        "type": 83,
        "status": 84,
        "preferred": 85,
        "language": 86,
        "domain": 87,
        "jurisdiction": 88,
        "synonym": 78,
        "translation": 78,
        "official": 91,
        "source": 98
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    null,
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 92,
        "extension": 93,
        "modifierExtension": 94,
        "authority": 95,
        "status": 96,
        "date": 97
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 101,
        "extension": 102,
        "modifierExtension": 103,
        "substance": 104,
        "relationship": 105,
        "isDefining": 106,
        "amount": 107,
        "amountRatioLowLimit": 108,
        "amountType": 109,
        "source": 110
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "substanceReference": "Reference",
        "substanceCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "amountQuantity": "Quantity",
        "amountRange": "Range",
        "amountRatio": "Ratio",
        "amountString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "SupplyDelivery": [
    {
      "_type_": "complex",
      "type": "SupplyDelivery",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "basedOn": 10,
        "partOf": 11,
        "status": 12,
        "patient": 13,
        "type": 14,
        "suppliedItem": 15,
        "occurrence": 21,
        "supplier": 22,
        "destination": 23,
        "receiver": 24
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 16,
        "extension": 17,
        "modifierExtension": 18,
        "quantity": 19,
        "item": 20
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "itemCodeableConcept": "CodeableConcept",
        "itemReference": "Reference"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "occurrenceDateTime": "dateTime",
        "occurrencePeriod": "Period",
        "occurrenceTiming": "Timing"
      }
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    }
  ],
  "SupplyRequest": [
    {
      "_type_": "complex",
      "type": "SupplyRequest",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "category": 11,
        "priority": 12,
        "item": 13,
        "quantity": 14,
        "parameter": 15,
        "occurrence": 21,
        "authoredOn": 22,
        "requester": 23,
        "supplier": 24,
        "reasonCode": 25,
        "reasonReference": 26,
        "deliverFrom": 27,
        "deliverTo": 28
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "itemCodeableConcept": "CodeableConcept",
        "itemReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 16,
        "extension": 17,
        "modifierExtension": 18,
        "code": 19,
        "value": 20
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueCodeableConcept": "CodeableConcept",
        "valueQuantity": "Quantity",
        "valueRange": "Range",
        "valueBoolean": "boolean"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "occurrenceDateTime": "dateTime",
        "occurrencePeriod": "Period",
        "occurrenceTiming": "Timing"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "Task": [
    {
      "_type_": "complex",
      "type": "Task",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "instantiatesCanonical": 10,
        "instantiatesUri": 11,
        "basedOn": 12,
        "groupIdentifier": 13,
        "partOf": 14,
        "status": 15,
        "statusReason": 16,
        "businessStatus": 17,
        "intent": 18,
        "priority": 19,
        "code": 20,
        "description": 21,
        "focus": 22,
        "for": 23,
        "encounter": 24,
        "executionPeriod": 25,
        "authoredOn": 26,
        "lastModified": 27,
        "requester": 28,
        "performerType": 29,
        "owner": 30,
        "location": 31,
        "reasonCode": 32,
        "reasonReference": 33,
        "insurance": 34,
        "note": 35,
        "relevantHistory": 36,
        "restriction": 37,
        "input": 44,
        "output": 50
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 38,
        "extension": 39,
        "modifierExtension": 40,
        "repetitions": 41,
        "period": 42,
        "recipient": 43
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 45,
        "extension": 46,
        "modifierExtension": 47,
        "type": 48,
        "value": 49
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueBase64Binary": "base64Binary",
        "valueBoolean": "boolean",
        "valueCanonical": "canonical",
        "valueCode": "code",
        "valueDate": "date",
        "valueDateTime": "dateTime",
        "valueDecimal": "decimal",
        "valueId": "id",
        "valueInstant": "instant",
        "valueInteger": "integer",
        "valueMarkdown": "markdown",
        "valueOid": "oid",
        "valuePositiveInt": "positiveInt",
        "valueString": "string",
        "valueTime": "time",
        "valueUnsignedInt": "unsignedInt",
        "valueUri": "uri",
        "valueUrl": "url",
        "valueUuid": "uuid",
        "valueAddress": "Address",
        "valueAge": "Age",
        "valueAnnotation": "Annotation",
        "valueAttachment": "Attachment",
        "valueCodeableConcept": "CodeableConcept",
        "valueCoding": "Coding",
        "valueContactPoint": "ContactPoint",
        "valueCount": "Count",
        "valueDistance": "Distance",
        "valueDuration": "Duration",
        "valueHumanName": "HumanName",
        "valueIdentifier": "Identifier",
        "valueMoney": "Money",
        "valuePeriod": "Period",
        "valueQuantity": "Quantity",
        "valueRange": "Range",
        "valueRatio": "Ratio",
        "valueReference": "Reference",
        "valueSampledData": "SampledData",
        "valueSignature": "Signature",
        "valueTiming": "Timing",
        "valueContactDetail": "ContactDetail",
        "valueContributor": "Contributor",
        "valueDataRequirement": "DataRequirement",
        "valueExpression": "Expression",
        "valueParameterDefinition": "ParameterDefinition",
        "valueRelatedArtifact": "RelatedArtifact",
        "valueTriggerDefinition": "TriggerDefinition",
        "valueUsageContext": "UsageContext",
        "valueDosage": "Dosage",
        "valueMeta": "Meta"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 51,
        "extension": 52,
        "modifierExtension": 53,
        "type": 54,
        "value": 55
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueBase64Binary": "base64Binary",
        "valueBoolean": "boolean",
        "valueCanonical": "canonical",
        "valueCode": "code",
        "valueDate": "date",
        "valueDateTime": "dateTime",
        "valueDecimal": "decimal",
        "valueId": "id",
        "valueInstant": "instant",
        "valueInteger": "integer",
        "valueMarkdown": "markdown",
        "valueOid": "oid",
        "valuePositiveInt": "positiveInt",
        "valueString": "string",
        "valueTime": "time",
        "valueUnsignedInt": "unsignedInt",
        "valueUri": "uri",
        "valueUrl": "url",
        "valueUuid": "uuid",
        "valueAddress": "Address",
        "valueAge": "Age",
        "valueAnnotation": "Annotation",
        "valueAttachment": "Attachment",
        "valueCodeableConcept": "CodeableConcept",
        "valueCoding": "Coding",
        "valueContactPoint": "ContactPoint",
        "valueCount": "Count",
        "valueDistance": "Distance",
        "valueDuration": "Duration",
        "valueHumanName": "HumanName",
        "valueIdentifier": "Identifier",
        "valueMoney": "Money",
        "valuePeriod": "Period",
        "valueQuantity": "Quantity",
        "valueRange": "Range",
        "valueRatio": "Ratio",
        "valueReference": "Reference",
        "valueSampledData": "SampledData",
        "valueSignature": "Signature",
        "valueTiming": "Timing",
        "valueContactDetail": "ContactDetail",
        "valueContributor": "Contributor",
        "valueDataRequirement": "DataRequirement",
        "valueExpression": "Expression",
        "valueParameterDefinition": "ParameterDefinition",
        "valueRelatedArtifact": "RelatedArtifact",
        "valueTriggerDefinition": "TriggerDefinition",
        "valueUsageContext": "UsageContext",
        "valueDosage": "Dosage",
        "valueMeta": "Meta"
      }
    }
  ],
  "TerminologyCapabilities": [
    {
      "_type_": "complex",
      "type": "TerminologyCapabilities",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "version": 10,
        "name": 11,
        "title": 12,
        "status": 13,
        "experimental": 14,
        "date": 15,
        "publisher": 16,
        "contact": 17,
        "description": 18,
        "useContext": 19,
        "jurisdiction": 20,
        "purpose": 21,
        "copyright": 22,
        "kind": 23,
        "software": 24,
        "implementation": 30,
        "lockedDate": 36,
        "codeSystem": 37,
        "expansion": 58,
        "codeSearch": 72,
        "validateCode": 73,
        "translation": 78,
        "closure": 83
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 25,
        "extension": 26,
        "modifierExtension": 27,
        "name": 28,
        "version": 29
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "description": 34,
        "url": 35
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "url",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 38,
        "extension": 39,
        "modifierExtension": 40,
        "uri": 41,
        "version": 42,
        "subsumption": 57
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 43,
        "extension": 44,
        "modifierExtension": 45,
        "code": 46,
        "isDefault": 47,
        "compositional": 48,
        "language": 49,
        "filter": 50,
        "property": 56
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 51,
        "extension": 52,
        "modifierExtension": 53,
        "code": 54,
        "op": 55
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 59,
        "extension": 60,
        "modifierExtension": 61,
        "hierarchical": 62,
        "paging": 63,
        "incomplete": 64,
        "parameter": 65,
        "textFilter": 71
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 66,
        "extension": 67,
        "modifierExtension": 68,
        "name": 69,
        "documentation": 70
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 74,
        "extension": 75,
        "modifierExtension": 76,
        "translations": 77
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 79,
        "extension": 80,
        "modifierExtension": 81,
        "needsMap": 82
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 84,
        "extension": 85,
        "modifierExtension": 86,
        "translation": 87
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    }
  ],
  "TestReport": [
    {
      "_type_": "complex",
      "type": "TestReport",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "name": 10,
        "status": 11,
        "testScript": 12,
        "result": 13,
        "score": 14,
        "tester": 15,
        "issued": 16,
        "participant": 17,
        "setup": 24,
        "test": 46,
        "teardown": 58
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 18,
        "extension": 19,
        "modifierExtension": 20,
        "type": 21,
        "uri": 22,
        "display": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 25,
        "extension": 26,
        "modifierExtension": 27,
        "action": 28
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 29,
        "extension": 30,
        "modifierExtension": 31,
        "operation": 32,
        "assert": 39
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 33,
        "extension": 34,
        "modifierExtension": 35,
        "result": 36,
        "message": 37,
        "detail": 38
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 40,
        "extension": 41,
        "modifierExtension": 42,
        "result": 43,
        "message": 44,
        "detail": 45
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 47,
        "extension": 48,
        "modifierExtension": 49,
        "name": 50,
        "description": 51,
        "action": 52
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 53,
        "extension": 54,
        "modifierExtension": 55,
        "operation": 32,
        "assert": 39
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    null,
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 59,
        "extension": 60,
        "modifierExtension": 61,
        "action": 62
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 63,
        "extension": 64,
        "modifierExtension": 65,
        "operation": 32
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    }
  ],
  "TestScript": [
    {
      "_type_": "complex",
      "type": "TestScript",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "status": 14,
        "experimental": 15,
        "date": 16,
        "publisher": 17,
        "contact": 18,
        "description": 19,
        "useContext": 20,
        "jurisdiction": 21,
        "purpose": 22,
        "copyright": 23,
        "origin": 24,
        "destination": 30,
        "metadata": 36,
        "fixture": 57,
        "profile": 64,
        "variable": 65,
        "setup": 77,
        "test": 137,
        "teardown": 149
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 25,
        "extension": 26,
        "modifierExtension": 27,
        "index": 28,
        "profile": 29
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 31,
        "extension": 32,
        "modifierExtension": 33,
        "index": 34,
        "profile": 35
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 37,
        "extension": 38,
        "modifierExtension": 39,
        "link": 40,
        "capability": 46
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 41,
        "extension": 42,
        "modifierExtension": 43,
        "url": 44,
        "description": 45
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 47,
        "extension": 48,
        "modifierExtension": 49,
        "required": 50,
        "validated": 51,
        "description": 52,
        "origin": 53,
        "destination": 54,
        "link": 55,
        "capabilities": 56
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 58,
        "extension": 59,
        "modifierExtension": 60,
        "autocreate": 61,
        "autodelete": 62,
        "resource": 63
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 66,
        "extension": 67,
        "modifierExtension": 68,
        "name": 69,
        "defaultValue": 70,
        "description": 71,
        "expression": 72,
        "headerField": 73,
        "hint": 74,
        "path": 75,
        "sourceId": 76
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 78,
        "extension": 79,
        "modifierExtension": 80,
        "action": 81
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 82,
        "extension": 83,
        "modifierExtension": 84,
        "operation": 85,
        "assert": 111
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 86,
        "extension": 87,
        "modifierExtension": 88,
        "type": 89,
        "resource": 90,
        "label": 91,
        "description": 92,
        "accept": 93,
        "contentType": 94,
        "destination": 95,
        "encodeRequestUrl": 96,
        "method": 97,
        "origin": 98,
        "params": 99,
        "requestHeader": 100,
        "requestId": 106,
        "responseId": 107,
        "sourceId": 108,
        "targetId": 109,
        "url": 110
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 101,
        "extension": 102,
        "modifierExtension": 103,
        "field": 104,
        "value": 105
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 112,
        "extension": 113,
        "modifierExtension": 114,
        "label": 115,
        "description": 116,
        "direction": 117,
        "compareToSourceId": 118,
        "compareToSourceExpression": 119,
        "compareToSourcePath": 120,
        "contentType": 121,
        "expression": 122,
        "headerField": 123,
        "minimumId": 124,
        "navigationLinks": 125,
        "operator": 126,
        "path": 127,
        "requestMethod": 128,
        "requestURL": 129,
        "resource": 130,
        "response": 131,
        "responseCode": 132,
        "sourceId": 133,
        "validateProfileId": 134,
        "value": 135,
        "warningOnly": 136
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 138,
        "extension": 139,
        "modifierExtension": 140,
        "name": 141,
        "description": 142,
        "action": 143
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 144,
        "extension": 145,
        "modifierExtension": 146,
        "operation": 85,
        "assert": 111
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    null,
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 150,
        "extension": 151,
        "modifierExtension": 152,
        "action": 153
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 154,
        "extension": 155,
        "modifierExtension": 156,
        "operation": 85
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    }
  ],
  "ValueSet": [
    {
      "_type_": "complex",
      "type": "ValueSet",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "url": 9,
        "identifier": 10,
        "version": 11,
        "name": 12,
        "title": 13,
        "status": 14,
        "experimental": 15,
        "date": 16,
        "publisher": 17,
        "contact": 18,
        "description": 19,
        "useContext": 20,
        "jurisdiction": 21,
        "immutable": 22,
        "purpose": 23,
        "copyright": 24,
        "compose": 25,
        "expansion": 59
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "UsageContext",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 26,
        "extension": 27,
        "modifierExtension": 28,
        "lockedDate": 29,
        "inactive": 30,
        "include": 31,
        "exclude": 31
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 32,
        "extension": 33,
        "modifierExtension": 34,
        "system": 35,
        "version": 36,
        "concept": 37,
        "filter": 50,
        "valueSet": 57
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 38,
        "extension": 39,
        "modifierExtension": 40,
        "code": 41,
        "display": 42,
        "designation": 43
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 44,
        "extension": 45,
        "modifierExtension": 46,
        "language": 47,
        "use": 48,
        "value": 49
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 51,
        "extension": 52,
        "modifierExtension": 53,
        "property": 54,
        "op": 55,
        "value": 56
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 60,
        "extension": 61,
        "modifierExtension": 62,
        "identifier": 63,
        "timestamp": 64,
        "total": 65,
        "offset": 66,
        "parameter": 67,
        "contains": 73
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 68,
        "extension": 69,
        "modifierExtension": 70,
        "name": 71,
        "value": 72
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueString": "string",
        "valueBoolean": "boolean",
        "valueInteger": "integer",
        "valueDecimal": "decimal",
        "valueUri": "uri",
        "valueCode": "code",
        "valueDateTime": "dateTime"
      }
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 74,
        "extension": 75,
        "modifierExtension": 76,
        "system": 77,
        "abstract": 78,
        "inactive": 79,
        "version": 80,
        "code": 81,
        "display": 82,
        "designation": 43,
        "contains": 73
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    null
  ],
  "VerificationResult": [
    {
      "_type_": "complex",
      "type": "VerificationResult",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "target": 9,
        "targetLocation": 10,
        "need": 11,
        "status": 12,
        "statusDate": 13,
        "validationType": 14,
        "validationProcess": 15,
        "frequency": 16,
        "lastPerformed": 17,
        "nextScheduled": 18,
        "failureAction": 19,
        "primarySource": 20,
        "attestation": 31,
        "validator": 43
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Timing",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 21,
        "extension": 22,
        "modifierExtension": 23,
        "who": 24,
        "type": 25,
        "communicationMethod": 26,
        "validationStatus": 27,
        "validationDate": 28,
        "canPushUpdates": 29,
        "pushTypeAvailable": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 32,
        "extension": 33,
        "modifierExtension": 34,
        "who": 35,
        "onBehalfOf": 36,
        "communicationMethod": 37,
        "date": 38,
        "sourceIdentityCertificate": 39,
        "proxyIdentityCertificate": 40,
        "proxySignature": 41,
        "sourceSignature": 42
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "date",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Signature",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Signature",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 44,
        "extension": 45,
        "modifierExtension": 46,
        "organization": 47,
        "identityCertificate": 48,
        "attestationSignature": 49
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Signature",
      "cardinality": "single"
    }
  ],
  "VisionPrescription": [
    {
      "_type_": "complex",
      "type": "VisionPrescription",
      "properties": {
        "id": 1,
        "meta": 2,
        "implicitRules": 3,
        "language": 4,
        "text": 5,
        "contained": 6,
        "extension": 7,
        "modifierExtension": 8,
        "identifier": 9,
        "status": 10,
        "created": 11,
        "patient": 12,
        "encounter": 13,
        "dateWritten": 14,
        "prescriber": 15,
        "lensSpecification": 16
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Narrative",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Resource",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 17,
        "extension": 18,
        "modifierExtension": 19,
        "product": 20,
        "eye": 21,
        "sphere": 22,
        "cylinder": 23,
        "axis": 24,
        "prism": 25,
        "add": 31,
        "power": 32,
        "backCurve": 33,
        "diameter": 34,
        "duration": 35,
        "color": 36,
        "brand": 37,
        "note": 38
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 26,
        "extension": 27,
        "modifierExtension": 28,
        "amount": 29,
        "base": 30
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Annotation",
      "cardinality": "array"
    }
  ],
  "Element": [
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 1,
        "extension": 2
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    }
  ],
  "BackboneElement": [
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "id": 1,
        "extension": 2,
        "modifierExtension": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    }
  ],
  "base64Binary": [
    {
      "_type_": "complex",
      "type": "base64Binary",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    }
  ],
  "boolean": [
    {
      "_type_": "complex",
      "type": "boolean",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.Boolean",
      "cardinality": "single"
    }
  ],
  "canonical": [
    {
      "_type_": "complex",
      "type": "canonical",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    }
  ],
  "code": [
    {
      "_type_": "complex",
      "type": "code",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    }
  ],
  "date": [
    {
      "_type_": "complex",
      "type": "date",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.Date",
      "cardinality": "single"
    }
  ],
  "dateTime": [
    {
      "_type_": "complex",
      "type": "dateTime",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.DateTime",
      "cardinality": "single"
    }
  ],
  "decimal": [
    {
      "_type_": "complex",
      "type": "decimal",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.Decimal",
      "cardinality": "single"
    }
  ],
  "id": [
    {
      "_type_": "complex",
      "type": "id",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    }
  ],
  "instant": [
    {
      "_type_": "complex",
      "type": "instant",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.DateTime",
      "cardinality": "single"
    }
  ],
  "integer": [
    {
      "_type_": "complex",
      "type": "integer",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.Integer",
      "cardinality": "single"
    }
  ],
  "markdown": [
    {
      "_type_": "complex",
      "type": "markdown",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    }
  ],
  "oid": [
    {
      "_type_": "complex",
      "type": "oid",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    }
  ],
  "positiveInt": [
    {
      "_type_": "complex",
      "type": "positiveInt",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.Integer",
      "cardinality": "single"
    }
  ],
  "string": [
    {
      "_type_": "complex",
      "type": "string",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    }
  ],
  "time": [
    {
      "_type_": "complex",
      "type": "time",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.Time",
      "cardinality": "single"
    }
  ],
  "unsignedInt": [
    {
      "_type_": "complex",
      "type": "unsignedInt",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.Integer",
      "cardinality": "single"
    }
  ],
  "uri": [
    {
      "_type_": "complex",
      "type": "uri",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    }
  ],
  "url": [
    {
      "_type_": "complex",
      "type": "url",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    }
  ],
  "uuid": [
    {
      "_type_": "complex",
      "type": "uuid",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    }
  ],
  "xhtml": [
    {
      "_type_": "complex",
      "type": "xhtml",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    }
  ],
  "Address": [
    {
      "_type_": "complex",
      "type": "Address",
      "properties": {
        "id": 1,
        "extension": 2,
        "use": 3,
        "type": 4,
        "text": 5,
        "line": 6,
        "city": 7,
        "district": 8,
        "state": 9,
        "postalCode": 10,
        "country": 11,
        "period": 12
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    }
  ],
  "Age": [
    {
      "_type_": "complex",
      "type": "Age",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3,
        "comparator": 4,
        "unit": 5,
        "system": 6,
        "code": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "Annotation": [
    {
      "_type_": "complex",
      "type": "Annotation",
      "properties": {
        "id": 1,
        "extension": 2,
        "author": 3,
        "time": 4,
        "text": 5
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "authorReference": "Reference",
        "authorString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    }
  ],
  "Attachment": [
    {
      "_type_": "complex",
      "type": "Attachment",
      "properties": {
        "id": 1,
        "extension": 2,
        "contentType": 3,
        "language": 4,
        "data": 5,
        "url": 6,
        "size": 7,
        "hash": 8,
        "title": 9,
        "creation": 10
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "base64Binary",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "url",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "base64Binary",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    }
  ],
  "CodeableConcept": [
    {
      "_type_": "complex",
      "type": "CodeableConcept",
      "properties": {
        "id": 1,
        "extension": 2,
        "coding": 3,
        "text": 4
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "Coding": [
    {
      "_type_": "complex",
      "type": "Coding",
      "properties": {
        "id": 1,
        "extension": 2,
        "system": 3,
        "version": 4,
        "code": 5,
        "display": 6,
        "userSelected": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    }
  ],
  "ContactDetail": [
    {
      "_type_": "complex",
      "type": "ContactDetail",
      "properties": {
        "id": 1,
        "extension": 2,
        "name": 3,
        "telecom": 4
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "array"
    }
  ],
  "ContactPoint": [
    {
      "_type_": "complex",
      "type": "ContactPoint",
      "properties": {
        "id": 1,
        "extension": 2,
        "system": 3,
        "value": 4,
        "use": 5,
        "rank": 6,
        "period": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    }
  ],
  "Contributor": [
    {
      "_type_": "complex",
      "type": "Contributor",
      "properties": {
        "id": 1,
        "extension": 2,
        "type": 3,
        "name": 4,
        "contact": 5
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactDetail",
      "cardinality": "array"
    }
  ],
  "Count": [
    {
      "_type_": "complex",
      "type": "Count",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3,
        "comparator": 4,
        "unit": 5,
        "system": 6,
        "code": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "DataRequirement": [
    {
      "_type_": "complex",
      "type": "DataRequirement",
      "properties": {
        "id": 1,
        "extension": 2,
        "type": 3,
        "profile": 4,
        "subject": 5,
        "mustSupport": 6,
        "codeFilter": 7,
        "dateFilter": 14,
        "limit": 20,
        "sort": 21
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "subjectCodeableConcept": "CodeableConcept",
        "subjectReference": "Reference"
      }
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 8,
        "extension": 9,
        "path": 10,
        "searchParam": 11,
        "valueSet": 12,
        "code": 13
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 15,
        "extension": 16,
        "path": 17,
        "searchParam": 18,
        "value": 19
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueDateTime": "dateTime",
        "valuePeriod": "Period",
        "valueDuration": "Duration"
      }
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 22,
        "extension": 23,
        "path": 24,
        "direction": 25
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "Distance": [
    {
      "_type_": "complex",
      "type": "Distance",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3,
        "comparator": 4,
        "unit": 5,
        "system": 6,
        "code": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "Dosage": [
    {
      "_type_": "complex",
      "type": "Dosage",
      "properties": {
        "id": 1,
        "extension": 2,
        "modifierExtension": 3,
        "sequence": 4,
        "text": 5,
        "additionalInstruction": 6,
        "patientInstruction": 7,
        "timing": 8,
        "asNeeded": 9,
        "site": 10,
        "route": 11,
        "method": 12,
        "doseAndRate": 13,
        "maxDosePerPeriod": 19,
        "maxDosePerAdministration": 20,
        "maxDosePerLifetime": 21
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Timing",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "asNeededBoolean": "boolean",
        "asNeededCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 14,
        "extension": 15,
        "type": 16,
        "dose": 17,
        "rate": 18
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "doseRange": "Range",
        "doseQuantity": "Quantity"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "rateRatio": "Ratio",
        "rateRange": "Range",
        "rateQuantity": "Quantity"
      }
    },
    {
      "_type_": "type",
      "type": "Ratio",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    }
  ],
  "Duration": [
    {
      "_type_": "complex",
      "type": "Duration",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3,
        "comparator": 4,
        "unit": 5,
        "system": 6,
        "code": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "ElementDefinition": [
    {
      "_type_": "complex",
      "type": "ElementDefinition",
      "properties": {
        "id": 1,
        "extension": 2,
        "modifierExtension": 3,
        "path": 4,
        "representation": 5,
        "sliceName": 6,
        "sliceIsConstraining": 7,
        "label": 8,
        "code": 9,
        "slicing": 10,
        "short": 21,
        "definition": 22,
        "comment": 23,
        "requirements": 24,
        "alias": 25,
        "min": 26,
        "max": 27,
        "base": 28,
        "contentReference": 34,
        "type": 35,
        "defaultValue": 43,
        "meaningWhenMissing": 44,
        "orderMeaning": 45,
        "fixed": 46,
        "pattern": 47,
        "example": 48,
        "minValue": 53,
        "maxValue": 54,
        "maxLength": 55,
        "condition": 56,
        "constraint": 57,
        "mustSupport": 67,
        "isModifier": 68,
        "isModifierReason": 69,
        "isSummary": 70,
        "binding": 71,
        "mapping": 77
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 11,
        "extension": 12,
        "discriminator": 13,
        "description": 18,
        "ordered": 19,
        "rules": 20
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 14,
        "extension": 15,
        "type": 16,
        "path": 17
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 29,
        "extension": 30,
        "path": 31,
        "min": 32,
        "max": 33
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 36,
        "extension": 37,
        "code": 38,
        "profile": 39,
        "targetProfile": 40,
        "aggregation": 41,
        "versioning": 42
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "defaultValueBase64Binary": "base64Binary",
        "defaultValueBoolean": "boolean",
        "defaultValueCanonical": "canonical",
        "defaultValueCode": "code",
        "defaultValueDate": "date",
        "defaultValueDateTime": "dateTime",
        "defaultValueDecimal": "decimal",
        "defaultValueId": "id",
        "defaultValueInstant": "instant",
        "defaultValueInteger": "integer",
        "defaultValueMarkdown": "markdown",
        "defaultValueOid": "oid",
        "defaultValuePositiveInt": "positiveInt",
        "defaultValueString": "string",
        "defaultValueTime": "time",
        "defaultValueUnsignedInt": "unsignedInt",
        "defaultValueUri": "uri",
        "defaultValueUrl": "url",
        "defaultValueUuid": "uuid",
        "defaultValueAddress": "Address",
        "defaultValueAge": "Age",
        "defaultValueAnnotation": "Annotation",
        "defaultValueAttachment": "Attachment",
        "defaultValueCodeableConcept": "CodeableConcept",
        "defaultValueCoding": "Coding",
        "defaultValueContactPoint": "ContactPoint",
        "defaultValueCount": "Count",
        "defaultValueDistance": "Distance",
        "defaultValueDuration": "Duration",
        "defaultValueHumanName": "HumanName",
        "defaultValueIdentifier": "Identifier",
        "defaultValueMoney": "Money",
        "defaultValuePeriod": "Period",
        "defaultValueQuantity": "Quantity",
        "defaultValueRange": "Range",
        "defaultValueRatio": "Ratio",
        "defaultValueReference": "Reference",
        "defaultValueSampledData": "SampledData",
        "defaultValueSignature": "Signature",
        "defaultValueTiming": "Timing",
        "defaultValueContactDetail": "ContactDetail",
        "defaultValueContributor": "Contributor",
        "defaultValueDataRequirement": "DataRequirement",
        "defaultValueExpression": "Expression",
        "defaultValueParameterDefinition": "ParameterDefinition",
        "defaultValueRelatedArtifact": "RelatedArtifact",
        "defaultValueTriggerDefinition": "TriggerDefinition",
        "defaultValueUsageContext": "UsageContext",
        "defaultValueDosage": "Dosage",
        "defaultValueMeta": "Meta"
      }
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "fixedBase64Binary": "base64Binary",
        "fixedBoolean": "boolean",
        "fixedCanonical": "canonical",
        "fixedCode": "code",
        "fixedDate": "date",
        "fixedDateTime": "dateTime",
        "fixedDecimal": "decimal",
        "fixedId": "id",
        "fixedInstant": "instant",
        "fixedInteger": "integer",
        "fixedMarkdown": "markdown",
        "fixedOid": "oid",
        "fixedPositiveInt": "positiveInt",
        "fixedString": "string",
        "fixedTime": "time",
        "fixedUnsignedInt": "unsignedInt",
        "fixedUri": "uri",
        "fixedUrl": "url",
        "fixedUuid": "uuid",
        "fixedAddress": "Address",
        "fixedAge": "Age",
        "fixedAnnotation": "Annotation",
        "fixedAttachment": "Attachment",
        "fixedCodeableConcept": "CodeableConcept",
        "fixedCoding": "Coding",
        "fixedContactPoint": "ContactPoint",
        "fixedCount": "Count",
        "fixedDistance": "Distance",
        "fixedDuration": "Duration",
        "fixedHumanName": "HumanName",
        "fixedIdentifier": "Identifier",
        "fixedMoney": "Money",
        "fixedPeriod": "Period",
        "fixedQuantity": "Quantity",
        "fixedRange": "Range",
        "fixedRatio": "Ratio",
        "fixedReference": "Reference",
        "fixedSampledData": "SampledData",
        "fixedSignature": "Signature",
        "fixedTiming": "Timing",
        "fixedContactDetail": "ContactDetail",
        "fixedContributor": "Contributor",
        "fixedDataRequirement": "DataRequirement",
        "fixedExpression": "Expression",
        "fixedParameterDefinition": "ParameterDefinition",
        "fixedRelatedArtifact": "RelatedArtifact",
        "fixedTriggerDefinition": "TriggerDefinition",
        "fixedUsageContext": "UsageContext",
        "fixedDosage": "Dosage",
        "fixedMeta": "Meta"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "patternBase64Binary": "base64Binary",
        "patternBoolean": "boolean",
        "patternCanonical": "canonical",
        "patternCode": "code",
        "patternDate": "date",
        "patternDateTime": "dateTime",
        "patternDecimal": "decimal",
        "patternId": "id",
        "patternInstant": "instant",
        "patternInteger": "integer",
        "patternMarkdown": "markdown",
        "patternOid": "oid",
        "patternPositiveInt": "positiveInt",
        "patternString": "string",
        "patternTime": "time",
        "patternUnsignedInt": "unsignedInt",
        "patternUri": "uri",
        "patternUrl": "url",
        "patternUuid": "uuid",
        "patternAddress": "Address",
        "patternAge": "Age",
        "patternAnnotation": "Annotation",
        "patternAttachment": "Attachment",
        "patternCodeableConcept": "CodeableConcept",
        "patternCoding": "Coding",
        "patternContactPoint": "ContactPoint",
        "patternCount": "Count",
        "patternDistance": "Distance",
        "patternDuration": "Duration",
        "patternHumanName": "HumanName",
        "patternIdentifier": "Identifier",
        "patternMoney": "Money",
        "patternPeriod": "Period",
        "patternQuantity": "Quantity",
        "patternRange": "Range",
        "patternRatio": "Ratio",
        "patternReference": "Reference",
        "patternSampledData": "SampledData",
        "patternSignature": "Signature",
        "patternTiming": "Timing",
        "patternContactDetail": "ContactDetail",
        "patternContributor": "Contributor",
        "patternDataRequirement": "DataRequirement",
        "patternExpression": "Expression",
        "patternParameterDefinition": "ParameterDefinition",
        "patternRelatedArtifact": "RelatedArtifact",
        "patternTriggerDefinition": "TriggerDefinition",
        "patternUsageContext": "UsageContext",
        "patternDosage": "Dosage",
        "patternMeta": "Meta"
      }
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 49,
        "extension": 50,
        "label": 51,
        "value": 52
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueBase64Binary": "base64Binary",
        "valueBoolean": "boolean",
        "valueCanonical": "canonical",
        "valueCode": "code",
        "valueDate": "date",
        "valueDateTime": "dateTime",
        "valueDecimal": "decimal",
        "valueId": "id",
        "valueInstant": "instant",
        "valueInteger": "integer",
        "valueMarkdown": "markdown",
        "valueOid": "oid",
        "valuePositiveInt": "positiveInt",
        "valueString": "string",
        "valueTime": "time",
        "valueUnsignedInt": "unsignedInt",
        "valueUri": "uri",
        "valueUrl": "url",
        "valueUuid": "uuid",
        "valueAddress": "Address",
        "valueAge": "Age",
        "valueAnnotation": "Annotation",
        "valueAttachment": "Attachment",
        "valueCodeableConcept": "CodeableConcept",
        "valueCoding": "Coding",
        "valueContactPoint": "ContactPoint",
        "valueCount": "Count",
        "valueDistance": "Distance",
        "valueDuration": "Duration",
        "valueHumanName": "HumanName",
        "valueIdentifier": "Identifier",
        "valueMoney": "Money",
        "valuePeriod": "Period",
        "valueQuantity": "Quantity",
        "valueRange": "Range",
        "valueRatio": "Ratio",
        "valueReference": "Reference",
        "valueSampledData": "SampledData",
        "valueSignature": "Signature",
        "valueTiming": "Timing",
        "valueContactDetail": "ContactDetail",
        "valueContributor": "Contributor",
        "valueDataRequirement": "DataRequirement",
        "valueExpression": "Expression",
        "valueParameterDefinition": "ParameterDefinition",
        "valueRelatedArtifact": "RelatedArtifact",
        "valueTriggerDefinition": "TriggerDefinition",
        "valueUsageContext": "UsageContext",
        "valueDosage": "Dosage",
        "valueMeta": "Meta"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "minValueDate": "date",
        "minValueDateTime": "dateTime",
        "minValueInstant": "instant",
        "minValueTime": "time",
        "minValueDecimal": "decimal",
        "minValueInteger": "integer",
        "minValuePositiveInt": "positiveInt",
        "minValueUnsignedInt": "unsignedInt",
        "minValueQuantity": "Quantity"
      }
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "maxValueDate": "date",
        "maxValueDateTime": "dateTime",
        "maxValueInstant": "instant",
        "maxValueTime": "time",
        "maxValueDecimal": "decimal",
        "maxValueInteger": "integer",
        "maxValuePositiveInt": "positiveInt",
        "maxValueUnsignedInt": "unsignedInt",
        "maxValueQuantity": "Quantity"
      }
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 58,
        "extension": 59,
        "key": 60,
        "requirements": 61,
        "severity": 62,
        "human": 63,
        "expression": 64,
        "xpath": 65,
        "source": 66
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 72,
        "extension": 73,
        "strength": 74,
        "description": 75,
        "valueSet": 76
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 78,
        "extension": 79,
        "identity": 80,
        "language": 81,
        "map": 82,
        "comment": 83
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "Expression": [
    {
      "_type_": "complex",
      "type": "Expression",
      "properties": {
        "id": 1,
        "extension": 2,
        "description": 3,
        "name": 4,
        "language": 5,
        "expression": 6,
        "reference": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    }
  ],
  "Extension": [
    {
      "_type_": "complex",
      "type": "Extension",
      "properties": {
        "id": 1,
        "extension": 2,
        "url": 3,
        "value": 4
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueBase64Binary": "base64Binary",
        "valueBoolean": "boolean",
        "valueCanonical": "canonical",
        "valueCode": "code",
        "valueDate": "date",
        "valueDateTime": "dateTime",
        "valueDecimal": "decimal",
        "valueId": "id",
        "valueInstant": "instant",
        "valueInteger": "integer",
        "valueMarkdown": "markdown",
        "valueOid": "oid",
        "valuePositiveInt": "positiveInt",
        "valueString": "string",
        "valueTime": "time",
        "valueUnsignedInt": "unsignedInt",
        "valueUri": "uri",
        "valueUrl": "url",
        "valueUuid": "uuid",
        "valueAddress": "Address",
        "valueAge": "Age",
        "valueAnnotation": "Annotation",
        "valueAttachment": "Attachment",
        "valueCodeableConcept": "CodeableConcept",
        "valueCoding": "Coding",
        "valueContactPoint": "ContactPoint",
        "valueCount": "Count",
        "valueDistance": "Distance",
        "valueDuration": "Duration",
        "valueHumanName": "HumanName",
        "valueIdentifier": "Identifier",
        "valueMoney": "Money",
        "valuePeriod": "Period",
        "valueQuantity": "Quantity",
        "valueRange": "Range",
        "valueRatio": "Ratio",
        "valueReference": "Reference",
        "valueSampledData": "SampledData",
        "valueSignature": "Signature",
        "valueTiming": "Timing",
        "valueContactDetail": "ContactDetail",
        "valueContributor": "Contributor",
        "valueDataRequirement": "DataRequirement",
        "valueExpression": "Expression",
        "valueParameterDefinition": "ParameterDefinition",
        "valueRelatedArtifact": "RelatedArtifact",
        "valueTriggerDefinition": "TriggerDefinition",
        "valueUsageContext": "UsageContext",
        "valueDosage": "Dosage",
        "valueMeta": "Meta"
      }
    }
  ],
  "HumanName": [
    {
      "_type_": "complex",
      "type": "HumanName",
      "properties": {
        "id": 1,
        "extension": 2,
        "use": 3,
        "text": 4,
        "family": 5,
        "given": 6,
        "prefix": 7,
        "suffix": 8,
        "period": 9
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    }
  ],
  "Identifier": [
    {
      "_type_": "complex",
      "type": "Identifier",
      "properties": {
        "id": 1,
        "extension": 2,
        "use": 3,
        "type": 4,
        "system": 5,
        "value": 6,
        "period": 7,
        "assigner": 8
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "MarketingStatus": [
    {
      "_type_": "complex",
      "type": "MarketingStatus",
      "properties": {
        "id": 1,
        "extension": 2,
        "modifierExtension": 3,
        "country": 4,
        "jurisdiction": 5,
        "status": 6,
        "dateRange": 7,
        "restoreDate": 8
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Period",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    }
  ],
  "Meta": [
    {
      "_type_": "complex",
      "type": "Meta",
      "properties": {
        "id": 1,
        "extension": 2,
        "versionId": 3,
        "lastUpdated": 4,
        "source": 5,
        "profile": 6,
        "security": 7,
        "tag": 8
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    }
  ],
  "Money": [
    {
      "_type_": "complex",
      "type": "Money",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3,
        "currency": 4
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "Narrative": [
    {
      "_type_": "complex",
      "type": "Narrative",
      "properties": {
        "id": 1,
        "extension": 2,
        "status": 3,
        "div": 4
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "xhtml",
      "cardinality": "single"
    }
  ],
  "ParameterDefinition": [
    {
      "_type_": "complex",
      "type": "ParameterDefinition",
      "properties": {
        "id": 1,
        "extension": 2,
        "name": 3,
        "use": 4,
        "min": 5,
        "max": 6,
        "documentation": 7,
        "type": 8,
        "profile": 9
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "integer",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    }
  ],
  "Period": [
    {
      "_type_": "complex",
      "type": "Period",
      "properties": {
        "id": 1,
        "extension": 2,
        "start": 3,
        "end": 4
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "single"
    }
  ],
  "Population": [
    {
      "_type_": "complex",
      "type": "Population",
      "properties": {
        "id": 1,
        "extension": 2,
        "modifierExtension": 3,
        "age": 4,
        "gender": 5,
        "race": 6,
        "physiologicalCondition": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "ageRange": "Range",
        "ageCodeableConcept": "CodeableConcept"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "ProdCharacteristic": [
    {
      "_type_": "complex",
      "type": "ProdCharacteristic",
      "properties": {
        "id": 1,
        "extension": 2,
        "modifierExtension": 3,
        "height": 4,
        "width": 5,
        "depth": 6,
        "weight": 7,
        "nominalVolume": 8,
        "externalDiameter": 9,
        "shape": 10,
        "color": 11,
        "imprint": 12,
        "image": 13,
        "scoring": 14
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "ProductShelfLife": [
    {
      "_type_": "complex",
      "type": "ProductShelfLife",
      "properties": {
        "id": 1,
        "extension": 2,
        "modifierExtension": 3,
        "identifier": 4,
        "type": 5,
        "period": 6,
        "specialPrecautionsForStorage": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "array"
    }
  ],
  "Quantity": [
    {
      "_type_": "complex",
      "type": "Quantity",
      "properties": {
        "id": 1,
        "extension": 2,
        "value": 3,
        "comparator": 4,
        "unit": 5,
        "system": 6,
        "code": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    }
  ],
  "Range": [
    {
      "_type_": "complex",
      "type": "Range",
      "properties": {
        "id": 1,
        "extension": 2,
        "low": 3,
        "high": 4
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    }
  ],
  "Ratio": [
    {
      "_type_": "complex",
      "type": "Ratio",
      "properties": {
        "id": 1,
        "extension": 2,
        "numerator": 3,
        "denominator": 4
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    }
  ],
  "Reference": [
    {
      "_type_": "complex",
      "type": "Reference",
      "properties": {
        "id": 1,
        "extension": 2,
        "reference": 3,
        "type": 4,
        "identifier": 5,
        "display": 6
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Identifier",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "RelatedArtifact": [
    {
      "_type_": "complex",
      "type": "RelatedArtifact",
      "properties": {
        "id": 1,
        "extension": 2,
        "type": 3,
        "label": 4,
        "display": 5,
        "citation": 6,
        "url": 7,
        "document": 8,
        "resource": 9
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "markdown",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "url",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Attachment",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "canonical",
      "cardinality": "single"
    }
  ],
  "SampledData": [
    {
      "_type_": "complex",
      "type": "SampledData",
      "properties": {
        "id": 1,
        "extension": 2,
        "origin": 3,
        "period": 4,
        "factor": 5,
        "lowerLimit": 6,
        "upperLimit": 7,
        "dimensions": 8,
        "data": 9
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "Signature": [
    {
      "_type_": "complex",
      "type": "Signature",
      "properties": {
        "id": 1,
        "extension": 2,
        "type": 3,
        "when": 4,
        "who": 5,
        "onBehalfOf": 6,
        "targetFormat": 7,
        "sigFormat": 8,
        "data": 9
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "instant",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "base64Binary",
      "cardinality": "single"
    }
  ],
  "SubstanceAmount": [
    {
      "_type_": "complex",
      "type": "SubstanceAmount",
      "properties": {
        "id": 1,
        "extension": 2,
        "modifierExtension": 3,
        "amount": 4,
        "amountType": 5,
        "amountText": 6,
        "referenceRange": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "amountQuantity": "Quantity",
        "amountRange": "Range",
        "amountString": "string"
      }
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 8,
        "extension": 9,
        "lowLimit": 10,
        "highLimit": 11
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Quantity",
      "cardinality": "single"
    }
  ],
  "Timing": [
    {
      "_type_": "complex",
      "type": "Timing",
      "properties": {
        "id": 1,
        "extension": 2,
        "modifierExtension": 3,
        "event": 4,
        "repeat": 5,
        "code": 23
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "dateTime",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "Element",
      "properties": {
        "id": 6,
        "extension": 7,
        "bounds": 8,
        "count": 9,
        "countMax": 10,
        "duration": 11,
        "durationMax": 12,
        "durationUnit": 13,
        "frequency": 14,
        "frequencyMax": 15,
        "period": 16,
        "periodMax": 17,
        "periodUnit": 18,
        "dayOfWeek": 19,
        "timeOfDay": 20,
        "when": 21,
        "offset": 22
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "boundsDuration": "Duration",
        "boundsRange": "Range",
        "boundsPeriod": "Period"
      }
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "positiveInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "decimal",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "time",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "unsignedInt",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "CodeableConcept",
      "cardinality": "single"
    }
  ],
  "TriggerDefinition": [
    {
      "_type_": "complex",
      "type": "TriggerDefinition",
      "properties": {
        "id": 1,
        "extension": 2,
        "type": 3,
        "name": 4,
        "timing": 5,
        "data": 6,
        "condition": 7
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "timingTiming": "Timing",
        "timingReference": "Reference",
        "timingDate": "date",
        "timingDateTime": "dateTime"
      }
    },
    {
      "_type_": "type",
      "type": "DataRequirement",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    }
  ],
  "UsageContext": [
    {
      "_type_": "complex",
      "type": "UsageContext",
      "properties": {
        "id": 1,
        "extension": 2,
        "code": 3,
        "value": 4
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Extension",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Coding",
      "cardinality": "single"
    },
    {
      "_type_": "typechoice",
      "cardinality": "single",
      "fields": {
        "valueCodeableConcept": "CodeableConcept",
        "valueQuantity": "Quantity",
        "valueRange": "Range",
        "valueReference": "Reference"
      }
    }
  ],
  "AccessPolicyV2": [
    {
      "_type_": "complex",
      "type": "AccessPolicyV2",
      "properties": {
        "id": 1,
        "meta": 2,
        "name": 3,
        "description": 4,
        "engine": 5,
        "attribute": 6,
        "rule": 12,
        "target": 22
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "attributeId": 7,
        "operation": 8
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "id",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "type": 9,
        "path": 10,
        "params": 11
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "name": 13,
        "description": 14,
        "combineBehavior": 15,
        "effect": 16,
        "target": 17,
        "condition": 19,
        "rule": 12
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "expression": 18
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "expression": 20
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Expression",
      "cardinality": "single"
    },
    null,
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "link": 23
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "AccessPolicy": [
    {
      "_type_": "complex",
      "type": "AccessPolicy",
      "properties": {
        "id": 1,
        "meta": 2,
        "name": 3,
        "code": 4,
        "description": 5,
        "type": 6,
        "target": 7,
        "access": 9
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "link": 8
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "fhir": 10
      },
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "method": 11,
        "resourceType": 12,
        "parameter": 13
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "name": 14,
        "value": 15
      },
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "ClientApplication": [
    {
      "_type_": "complex",
      "type": "ClientApplication",
      "properties": {
        "id": 1,
        "meta": 2,
        "name": 3,
        "description": 4,
        "grantType": 5,
        "responseTypes": 6,
        "secret": 7,
        "redirectUri": 8,
        "uri": 9,
        "logoUri": 10,
        "scope": 11,
        "contact": 12,
        "tosUri": 13,
        "policyUri": 14
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "ContactPoint",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    }
  ],
  "IdentityProvider": [
    {
      "_type_": "complex",
      "type": "IdentityProvider",
      "properties": {
        "id": 1,
        "meta": 2,
        "name": 3,
        "status": 4,
        "accessType": 5,
        "oidc": 6
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "authorization_endpoint": 7,
        "token_endpoint": 8,
        "userinfo_endpoint": 9,
        "jwks_uri": 10,
        "scopes": 11,
        "client": 12,
        "pkce": 15
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "array"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "clientId": 13,
        "secret": 14
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "code_challenge_method": 16,
        "enabled": 17
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    }
  ],
  "Membership": [
    {
      "_type_": "complex",
      "type": "Membership",
      "properties": {
        "id": 1,
        "meta": 2,
        "link": 3,
        "email": 4,
        "emailVerified": 5,
        "name": 6,
        "role": 7,
        "federated": 8
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "boolean",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "HumanName",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "MessageBroker": [
    {
      "_type_": "complex",
      "type": "MessageBroker",
      "properties": {
        "id": 1,
        "meta": 2,
        "name": 3,
        "host": 4,
        "type": 5,
        "security": 6
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "uri",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "complex",
      "type": "BackboneElement",
      "properties": {
        "type": 7,
        "username": 8,
        "password": 9
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "string",
      "cardinality": "single"
    }
  ],
  "MessageTopic": [
    {
      "_type_": "complex",
      "type": "MessageTopic",
      "properties": {
        "id": 1,
        "meta": 2,
        "topicId": 3,
        "broker": 4
      },
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Meta",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "code",
      "cardinality": "single"
    },
    {
      "_type_": "type",
      "type": "Reference",
      "cardinality": "single"
    }
  ],
  "http://hl7.org/fhirpath/System.Boolean": [
    {
      "_type_": "complex",
      "type": "http://hl7.org/fhirpath/System.Boolean",
      "cardinality": "array"
    }
  ],
  "http://hl7.org/fhirpath/System.String": [
    {
      "_type_": "complex",
      "type": "http://hl7.org/fhirpath/System.String",
      "cardinality": "array"
    }
  ],
  "http://hl7.org/fhirpath/System.Date": [
    {
      "_type_": "complex",
      "type": "http://hl7.org/fhirpath/System.Date",
      "cardinality": "array"
    }
  ],
  "http://hl7.org/fhirpath/System.DateTime": [
    {
      "_type_": "complex",
      "type": "http://hl7.org/fhirpath/System.DateTime",
      "cardinality": "array"
    }
  ],
  "http://hl7.org/fhirpath/System.Decimal": [
    {
      "_type_": "complex",
      "type": "http://hl7.org/fhirpath/System.Decimal",
      "cardinality": "array"
    }
  ],
  "http://hl7.org/fhirpath/System.Integer": [
    {
      "_type_": "complex",
      "type": "http://hl7.org/fhirpath/System.Integer",
      "cardinality": "array"
    }
  ],
  "http://hl7.org/fhirpath/System.Time": [
    {
      "_type_": "complex",
      "type": "http://hl7.org/fhirpath/System.Time",
      "cardinality": "array"
    }
  ]
}