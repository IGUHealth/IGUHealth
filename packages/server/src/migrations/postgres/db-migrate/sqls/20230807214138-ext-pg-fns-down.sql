DROP FUNCTION filter_fhir_extensions;
DROP FUNCTION igu_fhir_extensions;

CREATE OR REPLACE FUNCTION proc_update_resource_meta() RETURNS trigger AS $proc_update_resource_meta$
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