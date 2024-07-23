ALTER TABLE authorization_code
DROP COLUMN redirect_uri,
ADD COLUMN payload JSONB;