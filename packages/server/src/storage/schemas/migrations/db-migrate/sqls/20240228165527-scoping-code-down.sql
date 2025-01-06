-- Drop the scope column
DELETE FROM authorization_code;

ALTER TABLE authorization_code
 DROP COLUMN scope,
 DROP CONSTRAINT fk_user,
 DROP COLUMN user_id,
 ADD COLUMN user_id TEXT,
 DROP COLUMN payload;
