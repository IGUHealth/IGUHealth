DROP TABLE IF EXISTS iguhealth_locks;

CREATE TYPE lock_type AS ENUM ('queue-loc');

CREATE TABLE
    IF NOT EXISTS locks (
        tenant TEXT,
        type lock_type NOT NULL,
        id TEXT NOT NULL PRIMARY KEY,
        -- Use JSONB for value for flexiblity
        value JSONB,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );