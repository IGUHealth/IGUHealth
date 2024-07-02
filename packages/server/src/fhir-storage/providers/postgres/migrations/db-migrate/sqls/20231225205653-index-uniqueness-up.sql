-- This migration is needed to remove duplicate entries in the string_idx table
DELETE FROM
    string_idx a
        USING string_idx b
WHERE
    a.id < b.id AND
    a.workspace = b.workspace AND
    a.r_version_id = b.r_version_id AND
    a.parameter_url = b.parameter_url AND
    a.value = b.value;

ALTER TABLE string_idx ADD CONSTRAINT string_idx_unique UNIQUE (workspace, r_version_id, parameter_url, value);