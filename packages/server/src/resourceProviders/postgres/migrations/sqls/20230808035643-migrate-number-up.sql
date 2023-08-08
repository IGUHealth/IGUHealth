ALTER TABLE number_idx ADD COLUMN "end_value" NUMERIC;
ALTER TABLE number_idx RENAME COLUMN "value" TO "start_value";
UPDATE number_idx SET end_value = start_value;