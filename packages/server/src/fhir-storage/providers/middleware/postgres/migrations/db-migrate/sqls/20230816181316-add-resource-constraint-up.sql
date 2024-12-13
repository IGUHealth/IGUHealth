ALTER TABLE resources ADD CONSTRAINT workspace_constraint FOREIGN KEY (workspace)  REFERENCES workspaces(id);


ALTER TABLE date_idx ALTER COLUMN workspace SET DATA TYPE TEXT;
ALTER TABLE date_idx ADD CONSTRAINT workspace_constraint FOREIGN KEY (workspace)  REFERENCES workspaces(id);

ALTER TABLE number_idx ALTER COLUMN workspace SET DATA TYPE TEXT;
ALTER TABLE number_idx ADD CONSTRAINT workspace_constraint FOREIGN KEY (workspace)  REFERENCES workspaces(id);

ALTER TABLE quantity_idx ALTER COLUMN workspace SET DATA TYPE TEXT;
ALTER TABLE quantity_idx ADD CONSTRAINT workspace_constraint FOREIGN KEY (workspace)  REFERENCES workspaces(id);

ALTER TABLE reference_idx ALTER COLUMN workspace SET DATA TYPE TEXT;
ALTER TABLE reference_idx ADD CONSTRAINT workspace_constraint FOREIGN KEY (workspace)  REFERENCES workspaces(id);

ALTER TABLE string_idx ALTER COLUMN workspace SET DATA TYPE TEXT;
ALTER TABLE string_idx ADD CONSTRAINT workspace_constraint FOREIGN KEY (workspace)  REFERENCES workspaces(id);

ALTER TABLE token_idx ALTER COLUMN workspace SET DATA TYPE TEXT;
ALTER TABLE token_idx ADD CONSTRAINT workspace_constraint FOREIGN KEY (workspace)  REFERENCES workspaces(id);

ALTER TABLE uri_idx ALTER COLUMN workspace SET DATA TYPE TEXT;
ALTER TABLE uri_idx ADD CONSTRAINT workspace_constraint FOREIGN KEY (workspace)  REFERENCES workspaces(id);