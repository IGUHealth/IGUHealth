CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE IF NOT EXISTS tenant_owners  (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Login credentials
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  -- Personal information
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  -- System fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--;;

-- Encryption logic to auto-encrypt password column.
CREATE FUNCTION user_password_encryption() RETURNS trigger AS $user_password_encryption$
    BEGIN
        NEW.password := crypt(NEW.password, gen_salt('bf'));
        RETURN NEW;
    END;
$user_password_encryption$ LANGUAGE plpgsql;

--;;

-- Associate encryption logic with update trigger.
CREATE TRIGGER user_password_encryption_trigger BEFORE INSERT OR UPDATE ON tenant_owners
    FOR EACH ROW EXECUTE FUNCTION user_password_encryption();