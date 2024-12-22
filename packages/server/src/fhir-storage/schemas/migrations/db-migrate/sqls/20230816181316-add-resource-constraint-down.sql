

ALTER TABLE resources DROP CONSTRAINT workspace_constraint;
ALTER TABLE date_idx DROP CONSTRAINT workspace_constraint;
ALTER TABLE number_idx DROP CONSTRAINT workspace_constraint;
ALTER TABLE quantity_idx DROP CONSTRAINT workspace_constraint;
ALTER TABLE reference_idx DROP CONSTRAINT workspace_constraint;
ALTER TABLE string_idx DROP CONSTRAINT workspace_constraint;
ALTER TABLE token_idx DROP CONSTRAINT workspace_constraint;
ALTER TABLE uri_idx DROP CONSTRAINT workspace_constraint;