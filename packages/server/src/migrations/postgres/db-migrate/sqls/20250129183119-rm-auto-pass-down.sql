
ALTER TABLE users ADD COLUMN password_encrypted boolean NOT NULL DEFAULT false;

UPDATE users SET password_encrypted = true;

-- Encryption logic to auto-encrypt password column.
CREATE OR REPLACE FUNCTION user_password_encryption() RETURNS trigger AS $user_password_encryption$
    BEGIN
        -- Null check does not work for equality operators.
        IF NEW.password_encrypted != true THEN
          NEW.password := crypt(NEW.password, gen_salt('bf'));
          NEW.password_encrypted := true;
        END IF;

        RETURN NEW;
    END;
$user_password_encryption$ LANGUAGE plpgsql;

-- Associate encryption logic with update trigger.
CREATE TRIGGER user_password_encryption_trigger BEFORE INSERT
OR
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION user_password_encryption ();

