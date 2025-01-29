-- R4 Search tables
ALTER TABLE r4_sp1_idx
DROP CONSTRAINT sp1_fk_tenant,
ADD CONSTRAINT sp1_fk_tenant FOREIGN KEY (tenant) REFERENCES tenants (id) ON DELETE CASCADE;

-- R4 Search tables
ALTER TABLE r4b_sp1_idx
DROP CONSTRAINT sp1_fk_tenant,
ADD CONSTRAINT sp1_fk_tenant FOREIGN KEY (tenant) REFERENCES tenants (id) ON DELETE CASCADE;