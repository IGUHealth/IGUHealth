ALTER TABLE date_idx      RENAME COLUMN tenant TO workspace;
ALTER TABLE number_idx    RENAME COLUMN tenant TO workspace;
ALTER TABLE quantity_idx  RENAME COLUMN tenant TO workspace;
ALTER TABLE reference_idx RENAME COLUMN tenant TO workspace;
ALTER TABLE string_idx    RENAME COLUMN tenant TO workspace;
ALTER TABLE token_idx     RENAME COLUMN tenant TO workspace;
ALTER TABLE uri_idx       RENAME COLUMN tenant TO workspace;

ALTER TABLE resources     RENAME COLUMN tenant TO workspace;
ALTER TABLE tenants RENAME TO workspaces;
ALTER TABLE workspaces    RENAME COLUMN tenant TO workspace;