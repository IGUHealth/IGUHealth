CREATE TYPE code_type AS ENUM ('oauth2_code_grant', 'password_reset', 'signup_confirmation');

--;;

CREATE TABLE IF NOT EXISTS authorization_code  (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Code
    type code_type NOT NULL,
    code TEXT NOT NULL UNIQUE,

    -- Identifier for the client and resource owner.
    user_id TEXT NOT NULL,
    client_id TEXT,
    tenant TEXT,


    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_valid_seconds INTERVAL NOT NULL,

    CONSTRAINT fk_tenant
      FOREIGN KEY(tenant) 
	  REFERENCES tenants(id)
);