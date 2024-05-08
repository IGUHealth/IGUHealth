# Artifacts

Loads FHIR artifacts based around fhirVersion on package.json and .index.json file.

## API

```typescript
/**
 * Interface used to search dependencies for .index.json files and load their contents.
 * @param options Artifact Load options
 * @returns A list of resources of type T
 */
export default function loadArtifacts<
  Version extends FHIR_VERSION,
  T extends ResourceType<Version>,
>({
  fhirVersion,
  resourceType,
  packageLocation,
  silence,
  onlyPackages,
}: {
  // Only support R4 and R4B for now.
  fhirVersion: Version;
  resourceType: T;
  packageLocation: string;
  silence?: boolean;
  onlyPackages?: string[];
}): Resource<Version, T>[];
```
