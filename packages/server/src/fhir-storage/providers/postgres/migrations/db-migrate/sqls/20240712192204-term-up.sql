CREATE TABLE terminology_systems (
    url    TEXT        NOT NULL PRIMARY KEY
);

CREATE TABLE terminology_codes (
  code          TEXT        NOT NULL,
  display       TEXT        NOT NULL,
  system        TEXT        NOT NULL REFERENCES terminology_systems(url) ON DELETE CASCADE,
  PRIMARY KEY (system, code),

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE terminology_edge (
    system TEXT NOT NULL,
    parent_code   TEXT NOT NULL,
    child_code    TEXT NOT NULL,

    FOREIGN KEY (system, parent_code) references terminology_codes (system, code) ON DELETE CASCADE,
    FOREIGN KEY (system, child_code) references terminology_codes (system, code) ON DELETE CASCADE,

    PRIMARY KEY (system, parent_code, child_code)
);