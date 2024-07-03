ALTER TABLE tenant_owners DROP CONSTRAINT fk_tenant;

ALTER TABLE tenant_owners DROP tenant;

CREATE TYPE user_role AS ENUM ('owner');

CREATE TABLE tenant_owners_to_tenants (
  user_email TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'owner',

  PRIMARY KEY (user_email, tenant_id),

  CONSTRAINT fk_tenant_owner
    FOREIGN KEY(user_email) 
    REFERENCES tenant_owners(email),

  CONSTRAINT fk_tenant
    FOREIGN KEY(tenant_id) 
    REFERENCES tenants(id)
);