CREATE TABLE subscription_tier (
    id             TEXT         NOT NULL PRIMARY KEY,
    name           TEXT         NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);




CREATE TYPE limitation_type AS ENUM ('LIMIT_TOTAL');

CREATE TABLE limitations (
    id             TEXT            NOT NULL PRIMARY KEY,
    name           TEXT            NOT NULL,
    fhir_version   TEXT            NOT NULL DEFAULT 'all',
    type           limitation_type NOT NULL,
     -- Allow either 'ALL' for a limitation of all or a specific resource type.
    resource_type  TEXT            NOT NULL,
    value          INTEGER         NOT NULL,
    tier           TEXT            NOT NULL,

    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_subscription_tier
        FOREIGN KEY(tier)
        REFERENCES subscription_tier(id)
);


-- Tiers
INSERT INTO subscription_tier (id, name) VALUES ('free', 'Free');
INSERT INTO subscription_tier (id, name) VALUES ('professional', 'Professional');
INSERT INTO subscription_tier (id, name) VALUES ('team', 'Team');
INSERT INTO subscription_tier (id, name) VALUES ('unlimited', 'Unlimited');

-- Alter tenants table to reference subscirption tier.

ALTER TABLE tenants 
  ADD COLUMN subscription_tier TEXT NOT NULL DEFAULT 'free',
  ADD CONSTRAINT fk_subscription_tier FOREIGN KEY(subscription_tier) REFERENCES subscription_tier(id);


-- Limitations

-- Free
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('free-total',                      'Free Total Limitation',               'LIMIT_TOTAL', 'ALL', 1000, 'free');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('free-operation-definition-total', 'Free OperationDefinition Limitation', 'LIMIT_TOTAL', 'OperationDefinition', 0, 'free');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('free-subscription-total',          'Free Subscription Limitation',       'LIMIT_TOTAL', 'Subscription', 0, 'free');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('free-messagetopic-total',          'Free MessageTopic Limitation',       'LIMIT_TOTAL', 'MessageTopic', 0, 'free');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('free-messagebroker-total',         'Free MessageBroker Limitation',      'LIMIT_TOTAL', 'MessageBroker', 0, 'free');
-- Should we allow ClientApplications on free?

-- Professional
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('professional-total',                      'Professional Total Limitation',               'LIMIT_TOTAL', 'ALL', 50000, 'professional');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('professional-operation-definition-total', 'Professional OperationDefinition Limitation', 'LIMIT_TOTAL', 'OperationDefinition', 5, 'professional');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('professional-subscription-total',         'Professional Subscription Limitation',        'LIMIT_TOTAL', 'Subscription', 5, 'professional');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('professional-messagetopic-total',         'Professional MessageTopic Limitation',        'LIMIT_TOTAL', 'MessageTopic', 5, 'professional');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('professional-messagebroker-total',        'Professional MessageBroker Limitation',       'LIMIT_TOTAL', 'MessageBroker', 2, 'professional');



-- Professional
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('team-total',                      'Team Total Limitation',               'LIMIT_TOTAL', 'ALL', 100000, 'team');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('team-operation-definition-total', 'Team OperationDefinition Limitation', 'LIMIT_TOTAL', 'OperationDefinition', 30, 'team');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('team-subscription-total',         'Team Subscription Limitation',        'LIMIT_TOTAL', 'Subscription', 30, 'team');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('team-messagetopic-total',         'Team MessageTopic Limitation',        'LIMIT_TOTAL', 'MessageTopic', 50, 'team');
INSERT INTO limitations (id, name, type, resource_type, value, tier) VALUES ('team-messagebroker-total',        'Team MessageBroker Limitation',       'LIMIT_TOTAL', 'MessageBroker', 10, 'team');

-- Unlimited
-- No flags, no limitations.
