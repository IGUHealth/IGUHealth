/* Replace with your SQL commands */-- This migration is needed to remove duplicate entries in the string_idx table
DELETE FROM
    number_idx a
        USING number_idx b
WHERE
    a.id < b.id AND
    a.workspace = b.workspace AND
    a.r_version_id = b.r_version_id AND
    a.parameter_url = b.parameter_url AND
    a.value = b.value;

ALTER TABLE number_idx ADD CONSTRAINT number_idx_unique UNIQUE (workspace, r_version_id, parameter_url, value);