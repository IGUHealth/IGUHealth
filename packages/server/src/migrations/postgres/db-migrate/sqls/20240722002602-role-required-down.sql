ALTER TABLE users
ADD COLUMN scope user_scope NOT NULL default 'global',
ALTER COLUMN role
DROP NOT NULL;