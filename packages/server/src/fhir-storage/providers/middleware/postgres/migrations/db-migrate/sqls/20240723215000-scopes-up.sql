CREATE TABLE
    authorization_scopes (
        client_id TEXT NOT NULL,
        user_id UUID NOT NULL references users (id) ON DELETE CASCADE,
        scope VARCHAR(255) NOT NULL,
        -- Auto stamps.
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        PRIMARY KEY (client_id, user_id)
    );