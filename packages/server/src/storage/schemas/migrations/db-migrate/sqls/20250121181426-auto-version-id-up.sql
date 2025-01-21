ALTER TABLE resources
DROP COLUMN version_id,
ADD COLUMN version_id TEXT NOT NULL GENERATED ALWAYS AS (resource -> 'meta' ->> 'versionId') STORED PRIMARY KEY;