-- Modify scopes
ALTER TABLE authorization_scopes
DROP CONSTRAINT authorization_scopes_user_id_fkey;

ALTER TABLE authorization_scopes
ALTER COLUMN user_id TYPE TEXT;

-- Modify codes
ALTER TABLE authorization_code
DROP CONSTRAINT fk_user;

ALTER TABLE authorization_code
ALTER COLUMN user_id TYPE TEXT;

-- Modify user table itself
ALTER TABLE users
ALTER COLUMN id TYPE TEXT;

-- Add constraints back
ALTER TABLE authorization_scopes ADD CONSTRAINT authorization_scopes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE authorization_code ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;