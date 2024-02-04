DROP EXTENSION IF EXISTS pgcrypto;
--;;
DROP TRIGGER  user_password_encryption_trigger on tenant_owners;
--;;
DROP FUNCTION user_password_encryption;
--;;
DROP TABLE  tenant_owners;
