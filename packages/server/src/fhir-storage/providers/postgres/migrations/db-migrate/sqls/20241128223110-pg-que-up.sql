-- Interaction triggers pulled from http://hl7.org/fhir/ValueSet/interaction-trigger.
CREATE TYPE interaction_trigger AS ENUM ('create', 'update', 'delete');

CREATE TABLE
    sub_queue (
        id SERIAL PRIMARY KEY,
        tenant TEXT NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
        fhir_version TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        resource_id TEXT NOT NULL,
        resource_version_id INTEGER NOT NULL,
        interaction interaction_trigger NOT NULL,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );