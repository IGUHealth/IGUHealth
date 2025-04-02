DROP TABLE sub_queue;

DROP TYPE interaction_trigger;

CREATE TABLE
    sub_queue (
        id SERIAL PRIMARY KEY,
        topic_id TEXT NOT NULL,
        -- Derived from Kafka
        key TEXT,
        headers JSONB NOT NULL,
        value JSONB NOT NULL,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );