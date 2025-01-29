/* R4 */
ALTER TABLE r4_date_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4_number_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4_quantity_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4_reference_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4_sp1_idx
DROP CONSTRAINT sp1_fk_resource;

ALTER TABLE r4_string_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4_token_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4_uri_idx
DROP CONSTRAINT fk_resource;

/* R4B */
ALTER TABLE r4b_date_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4b_number_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4b_quantity_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4b_reference_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4b_sp1_idx
DROP CONSTRAINT sp1_fk_resource;

ALTER TABLE r4b_string_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4b_token_idx
DROP CONSTRAINT fk_resource;

ALTER TABLE r4b_uri_idx
DROP CONSTRAINT fk_resource;