DROP TABLE IF EXISTS iguhealth_locks;

CREATE TABLE
    IF NOT EXISTS locks (
        tenant TEXT,
        type TEXT,
        id TEXT NOT NULL PRIMARY KEY,
        -- Use JSONB for value for flexiblity
        value JSONB,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );