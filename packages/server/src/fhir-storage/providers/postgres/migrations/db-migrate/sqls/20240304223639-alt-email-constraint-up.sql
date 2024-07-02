CREATE TABLE auth_method (
    method TEXT UNIQUE NOT NULL PRIMARY KEY,
    description TEXT
);

INSERT INTO auth_method (method, description) VALUES 
    ('email-password', 'Email and password'), 
    ('oidc-provider', 'FHIR Provider');

ALTER TABLE users
    DROP CONSTRAINT unique_email_global,
    ADD COLUMN method TEXT NOT NULL DEFAULT 'email-password',
    ADD COLUMN fhir_provider_id TEXT,
    ADD CONSTRAINT unique_email UNIQUE (email, scope, tenant, method, fhir_provider_id),
    ADD CONSTRAINT fk_auth_method
      FOREIGN KEY(method)
	  REFERENCES auth_method(method);