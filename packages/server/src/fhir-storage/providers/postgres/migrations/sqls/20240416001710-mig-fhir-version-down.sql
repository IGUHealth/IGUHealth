ALTER TABLE resources 
  DROP COLUMN fhir_version;

ALTER TABLE r4_date_idx  RENAME TO date_idx;
ALTER TABLE r4_number_idx RENAME TO number_idx;
ALTER TABLE r4_quantity_idx RENAME TO quantity_idx;
ALTER TABLE r4_reference_idx RENAME TO reference_idx;
ALTER TABLE r4_string_idx RENAME TO string_idx;
ALTER TABLE r4_token_idx RENAME TO token_idx;
ALTER TABLE r4_uri_idx RENAME TO uri_idx;

DROP TYPE fhir_version;