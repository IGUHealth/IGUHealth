CREATE INDEX idx_token_idx_value on token_idx(workspace, parameter_url, value);
CREATE INDEX idx_token_idx_rid on token_idx(r_id);

CREATE INDEX idx_string_idx_value on string_idx(workspace, parameter_url, value);
CREATE INDEX idx_string_idx_rid on string_idx(r_id);