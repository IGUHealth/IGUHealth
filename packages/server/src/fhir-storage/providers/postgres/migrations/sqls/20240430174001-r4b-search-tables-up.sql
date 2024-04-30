
-- R4B Date search table.
CREATE TABLE r4b_date_idx (
    id             SERIAL       NOT NULL PRIMARY KEY,
    tenant         TEXT         NOT NULL,
    r_id           TEXT         NOT NULL,
    r_version_id   INTEGER      NOT NULL,
    parameter_name TEXT         NOT NULL,
    parameter_url  TEXT         NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    resource_type  TEXT         NOT NULL,
    -- Unique date columns.
    start_date     TIMESTAMPTZ  NOT NULL,
    end_date       TIMESTAMPTZ  NOT NULL,

  CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id) 
	  REFERENCES resources(version_id),

  CONSTRAINT fk_tenant
      FOREIGN KEY(tenant) 
	  REFERENCES tenants(id)
);

CREATE INDEX r4b_idx_date_idx_rid ON r4b_date_idx USING hash (r_id);
CREATE INDEX r4b_idx_date_idx_sort ON r4b_date_idx USING btree (tenant, parameter_url, r_id);
CREATE INDEX r4b_idx_date_idx_value ON r4b_date_idx USING btree (tenant, parameter_url, start_date, end_date);

-- R4b Number search table.

CREATE TABLE r4b_number_idx (
    id             SERIAL       NOT NULL PRIMARY KEY,
    tenant         TEXT         NOT NULL,
    r_id           TEXT         NOT NULL,
    r_version_id   INTEGER      NOT NULL,
    parameter_name TEXT         NOT NULL,
    parameter_url  TEXT         NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    resource_type  TEXT         NOT NULL,
    -- Unique date columns.
    value          NUMERIC      NOT NULL,

    CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id)
	  REFERENCES resources(version_id),

    CONSTRAINT fk_tenant
      FOREIGN KEY(tenant)
	  REFERENCES tenants(id),

    CONSTRAINT r4b_number_idx_unique UNIQUE (tenant, r_version_id, parameter_url, value)
);

CREATE INDEX r4b_idx_number_idx_rid ON r4b_number_idx USING hash (r_id);
CREATE INDEX r4b_idx_number_idx_sort ON r4b_number_idx USING btree (tenant, parameter_url, r_id);
CREATE INDEX r4b_idx_number_idx_value ON r4b_number_idx USING btree (tenant, parameter_url, value);