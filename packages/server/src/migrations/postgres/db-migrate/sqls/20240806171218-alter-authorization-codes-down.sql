-- # remove references to the deprecated value
DELETE from authorization_code WHERE type = 'refresh_token';

-- # rename the existing type
ALTER TYPE code_type RENAME TO code_type_old;

-- # create the new type
CREATE TYPE code_type AS ENUM('password_reset', 'oauth2_code_grant');

-- # update the columns to use the new type
ALTER TABLE authorization_code ALTER COLUMN type TYPE code_type USING type::text::code_type;
-- # if you get an error, see bottom of post

-- # remove the old type
DROP TYPE code_type_old;