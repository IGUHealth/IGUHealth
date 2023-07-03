/* Replace with your SQL commands */

CREATE TABLE string_search (
  workspace     UUID        NOT NULL, 
  r_id          TEXT        NOT NULL,
  r_version_id  SERIAL      NOT NULL PRIMARY KEY,
  name          TEXT        NOT NULL,
  parameter_url TEXT        NOT NULL,
  value         TEXT        NOT NULL,
  
  -- When was indexed
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_resource
      FOREIGN KEY(r_version_id) 
	  REFERENCES resources(version_id)
);