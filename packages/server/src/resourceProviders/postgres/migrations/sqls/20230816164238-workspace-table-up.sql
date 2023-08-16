/* Replace with your SQL commands */

CREATE TABLE workspaces (
  id            TEXT        NOT NULL PRIMARY KEY,
  workspace     JSONB       NOT NULL,
  deleted       BOOLEAN     NOT NULL DEFAULT false,
  -- Also serves as an updated at (for updates we reinsert).
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO workspaces (id, workspace) VALUES ('system', '{"id": "system", "name": "IGUHealth System"}'::jsonb);