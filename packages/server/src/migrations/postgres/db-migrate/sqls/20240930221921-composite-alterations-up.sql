-- R4 Alterations
ALTER TABLE r4_date_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4_number_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4_quantity_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4_reference_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4_string_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4_token_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4_uri_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

-- R4B Alterations
ALTER TABLE r4b_date_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4b_number_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4b_quantity_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4b_reference_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4b_string_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4b_token_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;

ALTER TABLE r4b_uri_idx
ADD COLUMN composite_id_idx smallint,
ADD COLUMN composite_chunk_idx smallint;