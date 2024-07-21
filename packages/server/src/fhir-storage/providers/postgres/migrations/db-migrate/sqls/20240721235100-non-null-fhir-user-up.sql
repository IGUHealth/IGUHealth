ALTER TABLE users
ALTER COLUMN fhir_user_id
SET
    NOT NULL,
ALTER COLUMN fhir_user_versionid
SET
    NOT NULL;