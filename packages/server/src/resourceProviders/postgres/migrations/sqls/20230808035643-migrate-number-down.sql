ALTER TABLE number_idx DROP COLUMN "end_value";
ALTER TABLE number_idx RENAME COLUMN "start_value" TO "value";

DROP INDEX idx_number_idx_value;
CREATE INDEX idx_number_idx_value on number_idx(workspace, parameter_url, value);