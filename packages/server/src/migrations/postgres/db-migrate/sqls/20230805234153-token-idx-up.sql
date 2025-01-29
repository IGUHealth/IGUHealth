-- Indices are used in two scenarios
-- r_id used in Deletion/Update to find all indices tied to resource
-- idx_value which is used for filtering in search
-- idx_sort which is used for sorting in search namely to aggregate off of r_id
--

CREATE INDEX idx_number_idx_rid   on number_idx USING HASH (r_id);
CREATE INDEX idx_number_idx_value on number_idx(workspace, parameter_url, value);
CREATE INDEX idx_number_idx_sort  on number_idx(workspace, parameter_url, r_id);

CREATE INDEX idx_uri_idx_rid   on uri_idx USING HASH (r_id);
CREATE INDEX idx_uri_idx_value on uri_idx(workspace, parameter_url, value);
CREATE INDEX idx_uri_idx_sort  on uri_idx(workspace, parameter_url, r_id);

CREATE INDEX idx_quantity_idx_rid  on quantity_idx USING HASH(r_id);
-- CREATE INDEX idx_quantity_idx_value on quantity_idx(workspace, parameter_url, start_value, end_value);
CREATE INDEX idx_quantity_idx_sort  on quantity_idx(workspace, parameter_url, r_id);

CREATE INDEX idx_reference_idx_rid   on reference_idx USING HASH(r_id);
CREATE INDEX idx_reference_idx_value on reference_idx(workspace, parameter_url, reference_id);
CREATE INDEX idx_reference_idx_sort  on reference_idx(workspace, parameter_url, r_id);

CREATE INDEX idx_date_idx_rid   on date_idx USING HASH (r_id);
-- CREATE INDEX idx_date_idx_value on date_idx(workspace, parameter_url, start_date, end_date);
CREATE INDEX idx_date_idx_sort  on date_idx(workspace, parameter_url, r_id);

CREATE INDEX idx_token_idx_rid   on token_idx USING HASH(r_id);
CREATE INDEX idx_token_idx_value on token_idx(workspace, parameter_url, value);
CREATE INDEX idx_token_idx_sort  on token_idx(workspace, parameter_url, r_id);


CREATE INDEX idx_string_idx_rid   on string_idx USING HASH(r_id);
CREATE INDEX idx_string_idx_value on string_idx(workspace, parameter_url, value);
CREATE INDEX idx_string_idx_sort  on string_idx(workspace, parameter_url, r_id);
