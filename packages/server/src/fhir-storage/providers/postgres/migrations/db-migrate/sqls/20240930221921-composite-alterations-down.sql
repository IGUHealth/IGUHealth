-- R4 Alterations
ALTER TABLE r4_date_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4_number_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4_quantity_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4_reference_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4_string_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4_token_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4_uri_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

-- R4B Alterations
ALTER TABLE r4b_date_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4b_number_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4b_quantity_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4b_reference_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4b_string_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4b_token_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;

ALTER TABLE r4b_uri_idx
DROP COLUMN composite_id_idx,
DROP COLUMN composite_chunk_idx;