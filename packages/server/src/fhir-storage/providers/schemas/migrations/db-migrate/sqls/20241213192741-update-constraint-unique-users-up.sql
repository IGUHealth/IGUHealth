ALTER TABLE users
DROP CONSTRAINT unique_fhir_user,
DROP CONSTRAINT unique_fhir_user_versionid;

ALTER TABLE users ADD CONSTRAINT unique_fhir_user UNIQUE (tenant, fhir_user_id),
ADD CONSTRAINT unique_fhir_user_versionid UNIQUE (tenant, fhir_user_versionid);