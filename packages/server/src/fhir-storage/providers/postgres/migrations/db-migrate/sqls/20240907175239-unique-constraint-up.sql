ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE NULLS NOT DISTINCT (tenant, email, method, fhir_provider_id);

CREATE UNIQUE INDEX owner_unique_idx ON users (email)
WHERE
    role = 'owner';