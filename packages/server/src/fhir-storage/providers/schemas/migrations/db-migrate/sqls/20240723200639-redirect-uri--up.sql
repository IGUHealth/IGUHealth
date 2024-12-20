ALTER TABLE authorization_code
DROP COLUMN payload,
ADD COLUMN redirect_uri VARCHAR(255);