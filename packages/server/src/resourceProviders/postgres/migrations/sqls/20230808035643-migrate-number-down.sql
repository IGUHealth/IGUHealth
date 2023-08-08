ALTER TABLE number_idx DROP COLUMN "end_value";
ALTER TABLE number_idx RENAME COLUMN "start_value" TO "value";