CREATE INDEX idx_number_idx_rid   on number_idx USING HASH (r_id);
CREATE INDEX idx_number_idx_value on number_idx(workspace, parameter_url, value);

CREATE INDEX idx_uri_idx_rid   on uri_idx USING HASH (r_id);
CREATE INDEX idx_uri_idx_value on uri_idx(workspace, parameter_url, value);

CREATE INDEX idx_quantity_idx_r_id  on quantity_idx USING HASH(r_id);
-- CREATE INDEX idx_quantity_idx_value on quantity_idx(workspace, parameter_url, start_value, end_value);

CREATE INDEX idx_reference_idx_rid   on reference_idx USING HASH(r_id);
CREATE INDEX idx_reference_idx_value on reference_idx(workspace, parameter_url, reference_id);

CREATE INDEX idx_date_idx_r_id  on date_idx USING HASH (r_id);
-- CREATE INDEX idx_date_idx_value on date_idx(workspace, parameter_url, start_date, end_date);

CREATE INDEX idx_token_idx_rid   on token_idx USING HASH(r_id);
CREATE INDEX idx_token_idx_value on token_idx(workspace, parameter_url, value);


CREATE INDEX idx_string_idx_rid   on string_idx USING HASH(r_id);
CREATE INDEX idx_string_idx_value on string_idx(workspace, parameter_url, value);
