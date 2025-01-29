-- This migration is needed to remove duplicate entries in the token_idx table
DELETE FROM
    token_idx a
        USING token_idx b
WHERE
    a.id < b.id AND
    a.workspace = b.workspace AND
    a.r_version_id = b.r_version_id AND
    a.parameter_url = b.parameter_url AND
    a.system = b.system AND
    a.value = b.value;

ALTER TABLE token_idx ADD CONSTRAINT token_idx_unique UNIQUE (workspace, r_version_id, parameter_url, system, value);