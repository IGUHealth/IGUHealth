ALTER TABLE authorization_scopes
DROP CONSTRAINT authorization_scopes_pkey,
ADD COLUMN tenant TEXT NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
ADD PRIMARY KEY (tenant, client_id, user_id);