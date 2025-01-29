ALTER TABLE users DROP CONSTRAINT fk_resource;
ALTER TABLE users DROP COLUMN fhir_user_versionid;


ALTER TABLE users DROP CONSTRAINT unique_email_global;
ALTER TABLE users DROP CONSTRAINT fk_tenant;
ALTER TABLE users DROP COLUMN tenant;

ALTER TABLE users DROP CONSTRAINT fk_root_user;
ALTER TABLE users DROP COLUMN root_user;
ALTER TABLE users DROP COLUMN role;
ALTER TABLE users DROP COLUMN scope;

CREATE TABLE membership (
  user_id uuid NOT NULL,
  tenant_id TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'owner',

  PRIMARY KEY (user_id, tenant_id),

  CONSTRAINT fk_tenant_owner
    FOREIGN KEY(user_id) 
    REFERENCES users(id),

  CONSTRAINT fk_tenant
    FOREIGN KEY(tenant_id) 
    REFERENCES tenants(id)
);