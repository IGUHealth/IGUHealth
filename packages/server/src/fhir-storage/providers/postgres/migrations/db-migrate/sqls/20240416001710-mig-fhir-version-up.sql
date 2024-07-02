CREATE TYPE fhir_version AS ENUM ('r4', 'r4b', 'r5');

ALTER TABLE resources 
  ADD COLUMN fhir_version fhir_version NOT NULL DEFAULT 'r4';

ALTER TABLE resources
    ALTER COLUMN fhir_version DROP DEFAULT;

ALTER TABLE date_idx RENAME TO r4_date_idx;
ALTER TABLE number_idx RENAME TO r4_number_idx;
ALTER TABLE quantity_idx RENAME TO r4_quantity_idx;
ALTER TABLE reference_idx RENAME TO r4_reference_idx;
ALTER TABLE string_idx RENAME TO r4_string_idx;
ALTER TABLE token_idx RENAME TO r4_token_idx;
ALTER TABLE uri_idx RENAME TO r4_uri_idx;

