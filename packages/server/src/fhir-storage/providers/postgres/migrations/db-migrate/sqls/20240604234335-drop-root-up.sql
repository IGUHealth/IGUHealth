
ALTER TABLE users DROP COLUMN root_user;
DELETE from users where scope = 'global';