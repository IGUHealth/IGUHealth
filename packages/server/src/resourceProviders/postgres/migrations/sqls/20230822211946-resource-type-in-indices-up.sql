ALTER TABLE date_idx ADD COLUMN resource_type TEXT NOT NULL;
ALTER TABLE number_idx ADD COLUMN resource_type TEXT NOT NULL;
ALTER TABLE quantity_idx ADD COLUMN resource_type TEXT NOT NULL;
ALTER TABLE reference_idx ADD COLUMN resource_type TEXT NOT NULL;
ALTER TABLE string_idx ADD COLUMN resource_type TEXT NOT NULL;
ALTER TABLE token_idx ADD COLUMN resource_type TEXT NOT NULL;
ALTER TABLE uri_idx ADD COLUMN resource_type TEXT NOT NULL;