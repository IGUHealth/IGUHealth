-- R4 Indices
DROP INDEX idx_number_idx_rid;

CREATE INDEX idx_number_idx_rid on r4_number_idx (tenant, r_id);

DROP INDEX idx_uri_idx_rid;

CREATE INDEX idx_uri_idx_rid on r4_uri_idx (tenant, r_id);

DROP INDEX idx_quantity_idx_rid;

CREATE INDEX idx_quantity_idx_rid on r4_quantity_idx (tenant, r_id);

DROP INDEX idx_reference_idx_rid;

CREATE INDEX idx_reference_idx_rid on r4_reference_idx (tenant, r_id);

DROP INDEX idx_date_idx_rid;

CREATE INDEX idx_date_idx_rid on r4_date_idx (tenant, r_id);

DROP INDEX idx_token_idx_rid;

CREATE INDEX idx_token_idx_rid on r4_token_idx (tenant, r_id);

DROP INDEX idx_string_idx_rid;

CREATE INDEX idx_string_idx_rid on r4_string_idx (tenant, r_id);

-- R4B Indices
DROP INDEX r4b_idx_date_idx_rid;

CREATE INDEX r4b_idx_date_idx_rid on r4b_date_idx (tenant, r_id);

DROP INDEX r4b_idx_number_idx_rid;

CREATE INDEX r4b_idx_number_idx_rid on r4b_number_idx (tenant, r_id);

DROP INDEX r4b_idx_quantity_idx_rid;

CREATE INDEX r4b_idx_quantity_idx_rid on r4b_quantity_idx (tenant, r_id);

DROP INDEX r4b_idx_reference_idx_rid;

CREATE INDEX r4b_idx_reference_idx_rid on r4b_reference_idx (tenant, r_id);

DROP INDEX r4b_idx_string_idx_rid;

CREATE INDEX r4b_idx_string_idx_rid on r4b_string_idx (tenant, r_id);

DROP INDEX r4b_idx_token_idx_rid;

CREATE INDEX r4b_idx_token_idx_rid on r4b_token_idx (tenant, r_id);

DROP INDEX r4b_idx_uri_idx_rid;

CREATE INDEX r4b_idx_uri_idx_rid on r4b_uri_idx (tenant, r_id);