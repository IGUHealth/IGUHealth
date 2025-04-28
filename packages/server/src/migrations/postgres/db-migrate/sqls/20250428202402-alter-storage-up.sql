CREATE TYPE FHIR_METHOD AS ENUM ('update', 'patch', 'delete', 'create');

ALTER TABLE resources
ADD COLUMN IF NOT EXISTS fhir_method FHIR_METHOD NOT NULL DEFAULT 'update';

ALTER TABLE resources
ALTER COLUMN fhir_method
DROP DEFAULT;