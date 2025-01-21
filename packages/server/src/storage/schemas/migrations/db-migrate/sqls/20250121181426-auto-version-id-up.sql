ALTER TABLE resources
DROP COLUMN version_id,
ADD COLUMN version_id TEXT NOT NULL GENERATED ALWAYS AS (resource -> 'meta' ->> 'versionId') STORED PRIMARY KEY;


CREATE OR REPLACE FUNCTION proc_update_resource_meta() RETURNS trigger AS $proc_update_resource_meta$
    BEGIN
        NEW.resource := jsonb_set(NEW.resource, '{meta,lastUpdated}', to_jsonb(generate_fhir_instant_string(NEW.created_at)));

        RETURN NEW;
    END;
$proc_update_resource_meta$ LANGUAGE plpgsql;

