CREATE TABLE resources (
  id            TEXT        NOT NULL GENERATED ALWAYS AS (CAST(resource ->> 'id' as TEXT)) STORED,
  workspace     UUID        NOT NULL,
  resource_type TEXT        NOT NULL GENERATED ALWAYS AS (resource ->> 'resourceType')     STORED,
  author        TEXT        NOT NULL,
  version_id    SERIAL      NOT NULL PRIMARY KEY,
  resource      JSONB       NOT NULL,
  deleted       BOOLEAN     NOT NULL DEFAULT false,
  -- Also serves as an updated at (for updates we reinsert).
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Series of patches used to update resource.
  patches       JSONB
);

ALTER TABLE resources
ADD COLUMN prev_version_id BIGINT;
--;;
ALTER TABLE resources
ADD CONSTRAINT prev_version_id_constraint FOREIGN KEY (prev_version_id) REFERENCES resources(version_id) MATCH FULL;

--;;

CREATE OR REPLACE FUNCTION generate_fhir_instant_string (tstamp TIMESTAMPTZ) RETURNS TEXT AS $$
     declare utc_time TIMESTAMPTZ;
     BEGIN
          utc_time := tstamp AT TIME ZONE 'UTC';
	  RETURN to_char(utc_time, 'YYYY-MM-DD') ||
	         'T' ||
         	 to_char(utc_time, 'HH24:MI:SS.MS+00:00');
	  
     END;
$$  LANGUAGE plpgsql;


--;;

CREATE FUNCTION proc_update_resource_meta() RETURNS trigger AS $proc_update_resource_meta$
    BEGIN
        IF (NEW.resource -> 'id') IS NULL THEN
    	   NEW.resource := jsonb_set(NEW.resource, '{id}', to_jsonb(gen_random_uuid()));
        END IF;
        IF (NEW.resource -> 'meta') IS NULL THEN
    	   NEW.resource := jsonb_set(NEW.resource, '{meta}', '{}');
        END IF;
	
        NEW.resource := jsonb_set(NEW.resource, '{meta,versionId}',   to_jsonb(CAST(NEW.version_id as TEXT)));
	    NEW.resource := jsonb_set(NEW.resource, '{meta,lastUpdated}', to_jsonb(generate_fhir_instant_string(NEW.created_at)));
        RETURN NEW;
    END;
$proc_update_resource_meta$ LANGUAGE plpgsql;

--;;

CREATE TRIGGER update_resource_meta_trigger BEFORE INSERT OR UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION proc_update_resource_meta();

