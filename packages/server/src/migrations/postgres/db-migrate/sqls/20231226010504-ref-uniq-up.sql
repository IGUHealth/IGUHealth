-- This migration is needed to remove duplicate entries in the reference_idx table
DELETE FROM
    reference_idx a
        USING reference_idx b
WHERE
    a.id < b.id AND
    a.workspace = b.workspace AND
    a.r_version_id = b.r_version_id AND
    a.parameter_url = b.parameter_url AND
    a.reference_type = b.reference_type AND
    a.reference_id = b.reference_id;

ALTER TABLE reference_idx ADD CONSTRAINT reference_idx_unique UNIQUE (workspace, r_version_id, parameter_url, reference_type, reference_id);