ALTER TABLE users
    DROP CONSTRAINT unique_email,   
    ADD CONSTRAINT unique_email UNIQUE (email, scope, tenant, method, fhir_provider_id);