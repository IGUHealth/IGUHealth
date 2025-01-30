--;;
DROP TRIGGER user_password_encryption_trigger on users;

--;;
DROP FUNCTION user_password_encryption;

ALTER TABLE users
DROP COLUMN password_encrypted;