ALTER TABLE date_idx      RENAME COLUMN workspace TO tenant;
ALTER TABLE number_idx    RENAME COLUMN workspace TO tenant;
ALTER TABLE quantity_idx  RENAME COLUMN workspace TO tenant;
ALTER TABLE reference_idx RENAME COLUMN workspace TO tenant;
ALTER TABLE string_idx    RENAME COLUMN workspace TO tenant;
ALTER TABLE token_idx     RENAME COLUMN workspace TO tenant;
ALTER TABLE uri_idx       RENAME COLUMN workspace TO tenant;

ALTER TABLE resources     RENAME COLUMN workspace TO tenant;
ALTER TABLE workspaces    RENAME COLUMN workspace TO tenant;
ALTER TABLE workspaces RENAME TO tenants;
