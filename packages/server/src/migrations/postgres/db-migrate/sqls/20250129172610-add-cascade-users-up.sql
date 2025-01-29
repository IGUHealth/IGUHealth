-- Resources Update tenants
ALTER TABLE authorization_code
DROP CONSTRAINT fk_user,
ADD CONSTRAINT fk_user FOREIGN KEY (tenant, user_id) REFERENCES users (tenant, fhir_user_id) ON DELETE CASCADE;

ALTER TABLE authorization_scopes
DROP CONSTRAINT fk_user,
ADD CONSTRAINT fk_user FOREIGN KEY (tenant, user_id) REFERENCES users (tenant, fhir_user_id) ON DELETE CASCADE;