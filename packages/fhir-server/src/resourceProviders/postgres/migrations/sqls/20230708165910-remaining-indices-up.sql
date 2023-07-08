CREATE TABLE date_idx (
  id             SERIAL      NOT NULL PRIMARY KEY,
  workspace      UUID        NOT NULL, 
  r_id           TEXT        NOT NULL,
  r_version_id   SERIAL      NOT NULL,
  parameter_name TEXT        NOT NULL,
  parameter_url  TEXT        NOT NULL,

  start_date     TIMESTAMPTZ NOT NULL,
  end_date       TIMESTAMPTZ NOT NULL,
  
  -- When was indexed
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id) 
	  REFERENCES resources(version_id)
);

CREATE TABLE token_idx (
  id             SERIAL      NOT NULL PRIMARY KEY,
  workspace      UUID        NOT NULL, 
  r_id           TEXT        NOT NULL,
  r_version_id   SERIAL      NOT NULL,
  parameter_name TEXT        NOT NULL,
  parameter_url  TEXT        NOT NULL,

  system         TEXT        ,
  value          TEXT        ,
  
  -- When was indexed
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id) 
	  REFERENCES resources(version_id)
);

CREATE TABLE reference_idx (
  id             SERIAL      NOT NULL PRIMARY KEY,
  workspace      UUID        NOT NULL, 
  r_id           TEXT        NOT NULL,
  r_version_id   SERIAL      NOT NULL,
  parameter_name TEXT        NOT NULL,
  parameter_url  TEXT        NOT NULL,

  reference      JSONB       NOT NULL,
  -- Should be generating off of these from reference type with procedure?
  resource_type  TEXT        NOT NULL,
  resource_id    TEXT        NOT NULL,
  
  -- When was indexed
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id) 
	  REFERENCES resources(version_id)
);


CREATE TABLE quantity_idx (
  id             SERIAL      NOT NULL PRIMARY KEY,
  workspace      UUID        NOT NULL, 
  r_id           TEXT        NOT NULL,
  r_version_id   SERIAL      NOT NULL,
  parameter_name TEXT        NOT NULL,
  parameter_url  TEXT        NOT NULL,

  start_quantity JSONB       NOT NULL,
   -- All these Values can be null given quantity type
  start_value          NUMERIC     GENERATED ALWAYS AS (CAST(start_quantity ->> 'value'  as NUMERIC)) STORED,
  start_system         TEXT        GENERATED ALWAYS AS (CAST(start_quantity ->> 'system' as TEXT))    STORED,
  start_code           TEXT        GENERATED ALWAYS AS (CAST(start_quantity ->> 'code'   as TEXT))    STORED,

  end_quantity JSONB         NOT NULL,
   -- All these Values can be null given quantity type
  end_value          NUMERIC     GENERATED ALWAYS AS (CAST(end_quantity ->> 'value'  as NUMERIC)) STORED,
  end_system         TEXT        GENERATED ALWAYS AS (CAST(end_quantity ->> 'system' as TEXT))    STORED,
  end_code           TEXT        GENERATED ALWAYS AS (CAST(end_quantity ->> 'code'   as TEXT))    STORED,
  
  -- When was indexed
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id) 
	  REFERENCES resources(version_id)
);

CREATE TABLE uri_idx (
  id             SERIAL      NOT NULL PRIMARY KEY,
  workspace      UUID        NOT NULL, 
  r_id           TEXT        NOT NULL,
  r_version_id   SERIAL      NOT NULL,
  parameter_name TEXT        NOT NULL,
  parameter_url  TEXT        NOT NULL,

  value          TEXT        NOT NULL,
  
  -- When was indexed
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id) 
	  REFERENCES resources(version_id)
);
