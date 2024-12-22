ALTER TABLE users
    DROP CONSTRAINT unique_email,   
    ADD CONSTRAINT unique_email UNIQUE NULLS NOT DISTINCT(fhir_provider_id, email, scope, tenant, method);