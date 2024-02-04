CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE IF NOT EXISTS tenant_owners  (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--;;

CREATE FUNCTION user_password_encryption() RETURNS trigger AS $user_password_encryption$
    BEGIN
        NEW.password := crypt(NEW.password, gen_salt('bf'));
        RETURN NEW;
    END;
$user_password_encryption$ LANGUAGE plpgsql;

--;;

CREATE TRIGGER user_password_encryption_trigger BEFORE INSERT OR UPDATE ON tenant_owners
    FOR EACH ROW EXECUTE FUNCTION user_password_encryption();