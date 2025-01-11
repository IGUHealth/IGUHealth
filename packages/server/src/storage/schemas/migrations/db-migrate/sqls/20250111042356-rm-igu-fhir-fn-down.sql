CREATE OR REPLACE FUNCTION proc_update_resource_meta() RETURNS trigger AS $proc_update_resource_meta$

    declare extensions JSONB;

    BEGIN
        IF (NEW.resource -> 'id') IS NULL THEN
    	   NEW.resource := jsonb_set(NEW.resource, '{id}', to_jsonb(gen_random_uuid()));
        END IF;
        
        IF (NEW.resource -> 'meta') IS NULL THEN
    	   NEW.resource := jsonb_set(NEW.resource, '{meta}', '{}');
        END IF;

        IF (NEW.resource -> 'meta' -> 'extension') IS NULL THEN
           NEW.resource := jsonb_set(NEW.resource, '{meta, extension}', '[]');
        END IF;

        NEW.resource := jsonb_set(NEW.resource, '{meta,extension}',   igu_fhir_extensions(NEW.version_id, NEW.author_type, NEW.author_id, NEW.resource -> 'meta' -> 'extension'));
        NEW.resource := jsonb_set(NEW.resource, '{meta,versionId}',   to_jsonb(CAST(NEW.version_id as TEXT)));
        NEW.resource := jsonb_set(NEW.resource, '{meta,lastUpdated}', to_jsonb(generate_fhir_instant_string(NEW.created_at)));

        RETURN NEW;
    END;
$proc_update_resource_meta$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION igu_fhir_extensions (version_id TEXT, author_type Text, author_id Text, extensions JSONB) RETURNS JSONB AS $$
    declare ext_author_url TEXT;
    declare new_ext_author JSONB;
    declare author_reference JSONB;

     BEGIN
        ext_author_url := 'https://iguhealth.app/author';

        author_reference := jsonb_set('{}'::jsonb, '{reference}', to_jsonb(concat(author_type, '/', author_id)::text));
        new_ext_author := jsonb_set('{}'::jsonb, '{url}', to_jsonb(ext_author_url::text));
        new_ext_author := jsonb_set(new_ext_author, '{valueReference}', author_reference);
        
        extensions := 
          filter_fhir_extensions(ext_author_url, extensions)  ||
          new_ext_author;

        return extensions;
     END;
$$  LANGUAGE plpgsql;