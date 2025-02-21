ALTER TABLE r4_sp1_idx
DROP CONSTRAINT r4_sp1_idx_tenant_r_id_key;

ALTER TABLE r4_sp1_idx ADD CONSTRAINT r4_sp1_idx_tenant_r_id_key UNIQUE (tenant, resource_type, r_id);

ALTER TABLE r4b_sp1_idx
DROP CONSTRAINT r4b_sp1_idx_tenant_r_id_key;

ALTER TABLE r4b_sp1_idx ADD CONSTRAINT r4b_sp1_idx_tenant_r_id_key UNIQUE (tenant, resource_type, r_id);