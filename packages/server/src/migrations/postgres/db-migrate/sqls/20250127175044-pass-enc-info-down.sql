ALTER TABLE users DROP COLUMN password_encrypted;

-- Encryption logic to auto-encrypt password column.
CREATE OR REPLACE FUNCTION user_password_encryption() RETURNS trigger AS $user_password_encryption$
    BEGIN
        -- Null check does not work for equality operators.
        IF NEW.password IS DISTINCT FROM OLD.password THEN
          NEW.password := crypt(NEW.password, gen_salt('bf'));
        END IF;

        RETURN NEW;
    END;
$user_password_encryption$ LANGUAGE plpgsql;

--;;