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

CREATE OR REPLACE FUNCTION filter_fhir_extensions (url TEXT, value JSONB) RETURNS JSONB AS $$
     declare variables JSONB;
     declare res JSONB;
     BEGIN
          variables := jsonb_set('{}'::jsonb, '{url}', to_jsonb(url::text));
      -- Filters all extensions that don't have url or equal to the url passed in.
	    res := (SELECT jsonb_agg(jsonb_path_query) 
            FROM jsonb_path_query(value, '$ ? (@.url != $url)', variables));

        IF res is NULL THEN
            res:= '[]'::jsonb;
        END IF;

        RETURN res;
	  
     END;
$$  LANGUAGE plpgsql;