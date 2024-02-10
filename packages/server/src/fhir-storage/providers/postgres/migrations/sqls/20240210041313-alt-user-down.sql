ALTER TABLE tenant_owners ALTER COLUMN password SET NOT NULL;
ALTER TYPE code_type ADD VALUE 'signup_confirmation';