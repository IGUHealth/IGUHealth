
-- R4B Date search table.
CREATE TABLE r4b_date_idx (
    id             SERIAL       NOT NULL PRIMARY KEY,
    tenant         TEXT         NOT NULL,
    r_id           TEXT         NOT NULL,
    r_version_id   INTEGER      NOT NULL,
    parameter_name TEXT         NOT NULL,
    parameter_url  TEXT         NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
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

CREATE INDEX r4b_idx_date_idx_rid   ON r4b_date_idx USING hash (r_id);
CREATE INDEX r4b_idx_date_idx_sort  ON r4b_date_idx USING btree (tenant, parameter_url, r_id);
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

CREATE INDEX r4b_idx_number_idx_rid   ON r4b_number_idx USING hash (r_id);
CREATE INDEX r4b_idx_number_idx_sort  ON r4b_number_idx USING btree (tenant, parameter_url, r_id);
CREATE INDEX r4b_idx_number_idx_value ON r4b_number_idx USING btree (tenant, parameter_url, value);

-- R4b Quantity search table.

CREATE TABLE r4b_quantity_idx (
    id             SERIAL       NOT NULL PRIMARY KEY,
    tenant         TEXT         NOT NULL,
    r_id           TEXT         NOT NULL,
    r_version_id   INTEGER      NOT NULL,
    parameter_name TEXT         NOT NULL,
    parameter_url  TEXT         NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    resource_type  TEXT         NOT NULL,
    -- Unique quantity columns.
    start_value    NUMERIC,
    start_system   TEXT,
    start_code     TEXT,
    end_value      NUMERIC,
    end_system     TEXT,
    end_code       TEXT,

    CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id)
	  REFERENCES resources(version_id),

    CONSTRAINT fk_tenant
      FOREIGN KEY(tenant)
	  REFERENCES tenants(id)
);

CREATE INDEX r4b_idx_quantity_idx_rid  ON r4b_quantity_idx USING hash (r_id);
CREATE INDEX r4b_idx_quantity_idx_sort ON r4b_quantity_idx USING btree (tenant, parameter_url, r_id);

-- R4b Reference search table.

CREATE TABLE r4b_reference_idx (
    id             SERIAL       NOT NULL PRIMARY KEY,
    tenant         TEXT         NOT NULL,
    r_id           TEXT         NOT NULL,
    r_version_id   INTEGER      NOT NULL,
    parameter_name TEXT         NOT NULL,
    parameter_url  TEXT         NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    resource_type  TEXT         NOT NULL,
    -- Unique Reference columns.
    reference      JSONB        NOT NULL,
    reference_type TEXT         NOT NULL,
    reference_id   TEXT         NOT NULL,
    
    CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id)
	  REFERENCES resources(version_id),

    CONSTRAINT fk_tenant
      FOREIGN KEY(tenant)
	  REFERENCES tenants(id),

    CONSTRAINT r4b_reference_idx_unique UNIQUE (tenant, r_version_id, parameter_url, reference_type, reference_id)
);

CREATE INDEX r4b_idx_reference_idx_rid   ON r4b_reference_idx USING hash (r_id);
CREATE INDEX r4b_idx_reference_idx_sort  ON r4b_reference_idx USING btree (tenant, parameter_url, r_id);
CREATE INDEX r4b_idx_reference_idx_value ON r4b_reference_idx USING btree (tenant, parameter_url, reference_id);

-- R4b String search table.

CREATE TABLE r4b_string_idx (
    id             SERIAL       NOT NULL PRIMARY KEY,
    tenant         TEXT         NOT NULL,
    r_id           TEXT         NOT NULL,
    r_version_id   INTEGER      NOT NULL,
    parameter_name TEXT         NOT NULL,
    parameter_url  TEXT         NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    resource_type  TEXT         NOT NULL,
    -- Unique String columns.
    value          TEXT         NOT NULL,

    CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id)
	  REFERENCES resources(version_id),

    CONSTRAINT fk_tenant
      FOREIGN KEY(tenant)
	  REFERENCES tenants(id),

    CONSTRAINT r4b_string_idx_unique UNIQUE (tenant, r_version_id, parameter_url, value)
);

CREATE INDEX r4b_idx_string_idx_rid   ON r4b_string_idx USING hash (r_id);
CREATE INDEX r4b_idx_string_idx_sort  ON r4b_string_idx USING btree (tenant, parameter_url, r_id);
CREATE INDEX r4b_idx_string_idx_value ON r4b_string_idx USING btree (tenant, parameter_url, value);

-- R4b Token search table.

CREATE TABLE r4b_token_idx (
    id             SERIAL       NOT NULL PRIMARY KEY,
    tenant         TEXT         NOT NULL,
    r_id           TEXT         NOT NULL,
    r_version_id   INTEGER      NOT NULL,
    parameter_name TEXT         NOT NULL,
    parameter_url  TEXT         NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    resource_type  TEXT         NOT NULL,
    -- Unique Token columns.
    system         TEXT,
    value          TEXT,

    CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id)
	  REFERENCES resources(version_id),

    CONSTRAINT fk_tenant
      FOREIGN KEY(tenant)
	  REFERENCES tenants(id),

    CONSTRAINT r4b_token_idx_unique UNIQUE (tenant, r_version_id, parameter_url, system, value)
);

CREATE INDEX r4b_idx_token_idx_rid   ON r4b_token_idx USING hash (r_id);
CREATE INDEX r4b_idx_token_idx_sort  ON r4b_token_idx USING btree (tenant, parameter_url, r_id);
CREATE INDEX r4b_idx_token_idx_value ON r4b_token_idx USING btree (tenant, parameter_url, value);

-- R4b URI search table.

CREATE TABLE r4b_uri_idx (
    id             SERIAL       NOT NULL PRIMARY KEY,
    tenant         TEXT         NOT NULL,
    r_id           TEXT         NOT NULL,
    r_version_id   INTEGER      NOT NULL,
    parameter_name TEXT         NOT NULL,
    parameter_url  TEXT         NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    resource_type  TEXT         NOT NULL,
    -- Unique URI columns.
    value          TEXT         NOT NULL,

    CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id)
	  REFERENCES resources(version_id),

    CONSTRAINT fk_tenant
      FOREIGN KEY(tenant)
	  REFERENCES tenants(id),

    CONSTRAINT r4b_uri_idx_unique UNIQUE (tenant, r_version_id, parameter_url, value)
);

CREATE INDEX r4b_idx_uri_idx_rid   ON r4b_uri_idx USING hash (r_id);
CREATE INDEX r4b_idx_uri_idx_sort  ON r4b_uri_idx USING btree (tenant, parameter_url, r_id);
CREATE INDEX r4b_idx_uri_idx_value ON r4b_uri_idx USING btree (tenant, parameter_url, value);