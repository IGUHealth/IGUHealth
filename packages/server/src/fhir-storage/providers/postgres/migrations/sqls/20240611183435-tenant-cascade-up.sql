-- R4 Search tables
ALTER TABLE r4_date_idx
    DROP CONSTRAINT workspace_constraint,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4_number_idx
    DROP CONSTRAINT workspace_constraint,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4_quantity_idx
    DROP CONSTRAINT workspace_constraint,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4_reference_idx
    DROP CONSTRAINT workspace_constraint,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4_string_idx
    DROP CONSTRAINT workspace_constraint,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4_token_idx
    DROP CONSTRAINT workspace_constraint,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4_uri_idx
    DROP CONSTRAINT workspace_constraint,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

-- R4B Search tables
ALTER TABLE r4b_date_idx
    DROP CONSTRAINT fk_tenant,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4b_number_idx
    DROP CONSTRAINT fk_tenant,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4b_quantity_idx
    DROP CONSTRAINT fk_tenant,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4b_reference_idx
    DROP CONSTRAINT fk_tenant,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4b_string_idx
    DROP CONSTRAINT fk_tenant,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4b_token_idx
    DROP CONSTRAINT fk_tenant,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

ALTER TABLE r4b_uri_idx
    DROP CONSTRAINT fk_tenant,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

-- Resources Update tenants
ALTER TABLE resources
    DROP CONSTRAINT workspace_constraint,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;

-- Update User tables

ALTER TABLE users
    DROP CONSTRAINT fk_tenant,
    ADD CONSTRAINT fk_tenant
     FOREIGN KEY (tenant) 
     REFERENCES tenants(id)
     ON DELETE CASCADE;