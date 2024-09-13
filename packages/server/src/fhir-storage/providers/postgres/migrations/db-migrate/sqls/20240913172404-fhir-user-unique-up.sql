ALTER TABLE users ADD CONSTRAINT unique_fhir_user UNIQUE (fhir_user_id),
ADD CONSTRAINT unique_fhir_user_versionid UNIQUE (fhir_user_versionid);