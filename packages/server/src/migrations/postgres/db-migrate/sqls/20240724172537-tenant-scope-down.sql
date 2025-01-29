ALTER TABLE authorization_scopes
DROP CONSTRAINT authorization_scopes_pkey,
DROP COLUMN tenant,
ADD PRIMARY KEY (client_id, user_id);