-- Allow a user to be linked to a FHIR Resource.
ALTER TABLE users ADD COLUMN fhir_user_versionid integer;
ALTER TABLE users ADD CONSTRAINT fk_resource
      FOREIGN KEY(fhir_user_versionid) 
	  REFERENCES resources(version_id);

-- Add column to link to a tenant
ALTER TABLE users ADD COLUMN tenant  text;
ALTER TABLE users ADD CONSTRAINT fk_tenant
      FOREIGN KEY(tenant)
	  REFERENCES tenants(id);

-- Add column to link to a root user if not a tenant exclusive user.
ALTER TABLE users ADD COLUMN root_user  UUID;
ALTER TABLE users ADD CONSTRAINT fk_root_user
      FOREIGN KEY(root_user)
	  REFERENCES users(id);

-- Special handling as type could already exist.
DO $$ BEGIN
    CREATE TYPE user_scope AS ENUM ('global', 'tenant');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE users ADD COLUMN scope user_scope NOT NULL default 'global';
ALTER TABLE users ADD CONSTRAINT unique_email_global UNIQUE (email, scope);


DROP TYPE user_role cascade;
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
ALTER TABLE users add COLUMN role user_role;

-- Dropping in favor of membership being linked users.
DROP TABLE membership;

-- Allow multiple users to have the same email
ALTER TABLE users DROP CONSTRAINT IF EXISTS tenant_owners_email_key;
