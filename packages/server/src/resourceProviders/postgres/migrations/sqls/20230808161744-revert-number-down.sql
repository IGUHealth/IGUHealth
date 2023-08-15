ALTER TABLE number_idx ADD COLUMN "end_value" NUMERIC;
ALTER TABLE number_idx RENAME COLUMN "value" TO "start_value";
UPDATE number_idx SET end_value = start_value;

DROP INDEX idx_number_idx_value;
CREATE INDEX idx_number_idx_value on number_idx(workspace, parameter_url, start_value, end_value);