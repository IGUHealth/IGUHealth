# IGUHealth

FHIR development environment. Code is written in typescript

## Repository Structure

**The repository is organized as follows:**

- **artifacts/**

  StructureDefinition, ValueSet, CodeSystem, etc. definitions for the FHIR resources.
  This includes our own custom resources and parameters under the `iguhealth` namespace and those provided by `hl7`.

- **config/**

  Contains configuration shared across packages such as jest and tsconfig

- **packages/**

  Library and application code. This includes iguhealth server, fhirpath, admin app and others.

- **docker/**

  Dockerfiles for our server. Docker images are available to download here: https://github.com/orgs/IGUHealth/packages?repo_name=IGUHealth.

- **layers/**

  Lambda layers used in Custom Operations.

## Code Systems

### LOINC

This material contains content from LOINC (http://loinc.org). LOINC is copyright © 1995-2024, Regenstrief Institute, Inc. and the Logical Observation Identifiers Names and Codes (LOINC) Committee and is available at no cost under the license at http://loinc.org/license. LOINC® is a registered United States trademark of Regenstrief Institute, Inc
