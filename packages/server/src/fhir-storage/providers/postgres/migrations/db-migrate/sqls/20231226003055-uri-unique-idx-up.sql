-- This migration is needed to remove duplicate entries in the uri_idx table
DELETE FROM
    uri_idx a
        USING uri_idx b
WHERE
    a.id < b.id AND
    a.workspace = b.workspace AND
    a.r_version_id = b.r_version_id AND
    a.parameter_url = b.parameter_url AND
    a.value = b.value;

ALTER TABLE uri_idx ADD CONSTRAINT uri_idx_unique UNIQUE (workspace, r_version_id, parameter_url, value);