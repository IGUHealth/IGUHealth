ALTER TABLE users
    DROP CONSTRAINT unique_email,
    DROP COLUMN method,
    DROP COLUMN fhir_provider_id,
    ADD CONSTRAINT unique_email_global UNIQUE (email, scope);

DROP TABLE auth_method;