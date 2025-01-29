ALTER TABLE "r4_string_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4_number_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4_date_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4_token_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4_reference_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4_quantity_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4_uri_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "users" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4b_date_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4b_number_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4b_quantity_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4b_reference_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4b_string_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4b_token_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4b_uri_idx" DROP CONSTRAINT "fk_resource";
ALTER TABLE "r4_sp1_idx" DROP CONSTRAINT "sp1_fk_resource";
ALTER TABLE "r4b_sp1_idx" DROP CONSTRAINT "sp1_fk_resource";


-- UPDATE "resources"         set version_id = regexp_replace(version_id, 'old-version-', '', 'g');

-- UPDATE "r4_string_idx"     set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g'); 
-- UPDATE "r4_number_idx"     set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4_date_idx"       set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4_token_idx"      set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4_reference_idx"  set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4_quantity_idx"   set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4_uri_idx"        set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "users"             set fhir_user_versionid = regexp_replace(fhir_user_versionid, 'old-version-', '', 'g');
-- UPDATE "r4b_date_idx"      set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4b_number_idx"    set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4b_quantity_idx"  set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4b_reference_idx" set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4b_string_idx"    set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4b_token_idx"     set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4b_uri_idx"       set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4_sp1_idx"        set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');
-- UPDATE "r4b_sp1_idx"       set r_version_id = regexp_replace(r_version_id, 'old-version-', '', 'g');


ALTER table resources alter column version_id TYPE TEXT USING FORMAT('%s', version_id::text);

ALTER TABLE "r4_string_idx"     alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4_number_idx"     alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4_date_idx"       alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4_token_idx"      alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4_reference_idx"  alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4_quantity_idx"   alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4_uri_idx"        alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "users"             alter column fhir_user_versionid TYPE TEXT USING FORMAT('%s', fhir_user_versionid::text);
ALTER TABLE "r4b_date_idx"      alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4b_number_idx"    alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4b_quantity_idx"  alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4b_reference_idx" alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4b_string_idx"    alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4b_token_idx"     alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4b_uri_idx"       alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4_sp1_idx"        alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);
ALTER TABLE "r4b_sp1_idx"       alter column r_version_id TYPE TEXT USING FORMAT('%s', r_version_id::text);


ALTER TABLE "r4_string_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4_number_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4_date_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4_token_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4_reference_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4_quantity_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4_uri_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "users" ADD CONSTRAINT "fk_resource" FOREIGN KEY (fhir_user_versionid) REFERENCES resources(version_id);
ALTER TABLE "r4b_date_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4b_number_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4b_quantity_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4b_reference_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4b_string_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4b_token_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4b_uri_idx" ADD CONSTRAINT "fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4_sp1_idx" ADD CONSTRAINT "sp1_fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);
ALTER TABLE "r4b_sp1_idx" ADD CONSTRAINT "sp1_fk_resource" FOREIGN KEY (r_version_id) REFERENCES resources(version_id);

ALTER TABLE resources ALTER COLUMN version_id SET DEFAULT gen_random_uuid()::text;

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