ALTER TABLE resources
    RENAME COLUMN author_id TO author;

ALTER TABLE resources    
    DROP COLUMN author_type;


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

        NEW.resource := jsonb_set(NEW.resource, '{meta,extension}',   igu_fhir_extensions(NEW.version_id, NEW.author, NEW.resource -> 'meta' -> 'extension'));
        NEW.resource := jsonb_set(NEW.resource, '{meta,versionId}',   to_jsonb(CAST(NEW.version_id as TEXT)));
        NEW.resource := jsonb_set(NEW.resource, '{meta,lastUpdated}', to_jsonb(generate_fhir_instant_string(NEW.created_at)));

        RETURN NEW;
    END;
$proc_update_resource_meta$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION igu_fhir_extensions (version_id INTEGER, author Text, extensions JSONB) RETURNS JSONB AS $$
    declare ext_sequence_url TEXT;
    declare ext_author_url TEXT;
    declare new_ext_author JSONB;
    declare new_ext_sequence JSONB;

     BEGIN
        ext_sequence_url := 'https://iguhealth.app/version-sequence';
        ext_author_url := 'https://iguhealth.app/author';

        new_ext_author := jsonb_set('{}'::jsonb, '{url}', to_jsonb(ext_author_url::text));
        new_ext_author := jsonb_set(new_ext_author, '{valueString}', to_jsonb(author::text));

        new_ext_sequence := jsonb_set('{}'::jsonb, '{url}', to_jsonb(ext_sequence_url::text));
        new_ext_sequence := jsonb_set(new_ext_sequence, '{valueInteger}', to_jsonb(CAST(version_id as integer)));
        
        extensions := 
          filter_fhir_extensions(ext_author_url, 
              filter_fhir_extensions(ext_sequence_url, extensions))  ||
          new_ext_sequence ||
          new_ext_author;

        return extensions;
     END;
$$  LANGUAGE plpgsql;