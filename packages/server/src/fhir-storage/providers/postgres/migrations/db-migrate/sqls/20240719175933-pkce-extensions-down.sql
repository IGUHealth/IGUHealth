ALTER TABLE authorization_code
 DROP COLUMN pkce_code_challenge,
 DROP COLUMN pkce_code_challenge_method;

DROP TYPE PKCE_METHOD;