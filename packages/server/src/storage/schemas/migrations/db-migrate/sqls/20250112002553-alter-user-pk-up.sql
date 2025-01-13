DELETE from users
where
    fhir_user_id IS NULL
    or tenant is null;

/* Removing all data referencing users */
DELETE from authorization_code;

DELETE from authorization_scopes;

ALTER TABLE authorization_code
DROP CONSTRAINT fk_user;

ALTER TABLE authorization_scopes
DROP CONSTRAINT authorization_scopes_user_id_fkey;

ALTER TABLE users
DROP CONSTRAINT tenant_owners_pkey,
ADD PRIMARY KEY (tenant, fhir_user_id),
ALTER COLUMN tenant
SET
    NOT NULL,
DROP COLUMN id;

ALTER TABLE authorization_code ADD CONSTRAINT "fk_user" FOREIGN KEY (tenant, user_id) REFERENCES users (tenant, fhir_user_id);

ALTER TABLE authorization_scopes ADD CONSTRAINT "fk_user" FOREIGN KEY (tenant, user_id) REFERENCES users (tenant, fhir_user_id);