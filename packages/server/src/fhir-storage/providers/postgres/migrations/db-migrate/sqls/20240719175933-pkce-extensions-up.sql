CREATE TYPE PKCE_METHOD AS ENUM ('S256', 'plain');

ALTER TABLE authorization_code
ADD COLUMN pkce_code_challenge TEXT,
ADD COLUMN pkce_code_challenge_method PKCE_METHOD;