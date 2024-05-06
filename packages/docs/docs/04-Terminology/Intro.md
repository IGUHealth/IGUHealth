---
sidebar_position: 1
---

# Intro

This is an overview of IGUHealth Terminology module support. For a descriptive definition of the terminology module with FHIR click [here](https://hl7.org/fhir/r4/terminology-module.html). In short, terminologies are a defined set ([ValueSet](../05-R4-FHIR/ValueSet.mdx), [CodeSystem](../05-R4-FHIR/CodeSystem.mdx)) of fixed string values ([codes](https://hl7.org/fhir/r4/datatypes.html#code)). The terminology module defines ways for looking up, validating, pulling in additional information, and translating between terminology sets (see [here](https://hl7.org/fhir/r4/terminology-module.html#index)).

## Supported Resources

| Name       | Supported |
| ---------- | --------- |
| CodeSystem | yes       |
| ValueSet   | yes       |
| ConceptMap | yes       |

## Supported Operations

This is a list of supported operations we support in the terminology module. To use any of these operations, issue an HTTP post at $code with the parameters resource.

### ValueSet

| Operation      | Supported | Url                                                           | Description                                                                                                                                      |
| -------------- | --------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| $expand        | Yes       | https://hl7.org/fhir/r4/valueset-operation-expand.html        | Generates an expansion on a valueset based on parameter inputs. See [here](https://hl7.org/fhir/r4/valueset-definitions.html#ValueSet.expansion) |
| $validate-code | Yes       | https://hl7.org/fhir/r4/valueset-operation-validate-code.html | Validates that a code is within the set of codes of a ValueSet.                                                                                  |

### CodeSystem

| Operation      | Supported | Url                                                             | Description                                                       |
| -------------- | --------- | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| $lookup        | yes       | https://hl7.org/fhir/r4/codesystem-operation-lookup.html        | Retrieve additional details about a concept.                      |
| $validate-code | no        | https://hl7.org/fhir/r4/codesystem-operation-validate-code.html | Validate code is in a codeystem.                                  |
| $subsumes      | no        | https://hl7.org/fhir/r4/codesystem-operation-subsumes.html      | Check subsumption relationship between two codes.                 |
| $find-matches  | no        | https://hl7.org/fhir/r4/codesystem-operation-find-matches.html  | Given list of properties return matching codes that fit criteria. |

### ConceptMap

| Operation  | Supported | Url                                                         | Description                                          |
| ---------- | --------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| $translate | no        | https://hl7.org/fhir/r4/conceptmap-operation-translate.html | Translates a code from one valueset to another.      |
| $closure   | no        | https://hl7.org/fhir/r4/conceptmap-operation-closure.html   | Support for maintanence of transitive closure table. |
