CREATE TABLE
    iguhealth_locks (
        tenant TEXT NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        id TEXT NOT NULL,
        PRIMARY KEY (tenant, type, id),
        fhir_version TEXT NOT NULL,
        -- Use JSONB for value for flexiblity
        value JSONB,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );