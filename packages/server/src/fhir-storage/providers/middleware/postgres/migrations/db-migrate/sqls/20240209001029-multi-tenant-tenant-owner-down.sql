ALTER TABLE tenant_owners ADD tenant TEXT;
ALTER TABLE tenant_owners ADD CONSTRAINT fk_tenant FOREIGN KEY(tenant) REFERENCES tenants(id);
DROP TABLE tenant_owners_to_tenants;
DROP TYPE user_role;