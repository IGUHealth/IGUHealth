CREATE TABLE subscription_tier (
    id             TEXT         NOT NULL PRIMARY KEY,
    name           TEXT         NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TYPE limitation_type AS ENUM ('LIMIT_TOTAL');

CREATE TABLE limitations (
    id             TEXT            NOT NULL PRIMARY KEY,
    name           TEXT            NOT NULL,
    fhir_version   fhir_version    NOT NULL,
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


-- Set system tenant to unlimited.
UPDATE tenants SET subscription_tier = 'unlimited' where id = 'system';

-- Limitations

-- Free
-- R4
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-free-total',                       'R4 Free Total Limitation',                'r4',  'LIMIT_TOTAL', 'ALL', 3000, 'free');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-free-operation-definition-total',  'R4 Free OperationDefinition Limitation',  'r4',  'LIMIT_TOTAL', 'OperationDefinition', 0, 'free');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-free-subscription-total',          'R4 Free Subscription Limitation',         'r4',  'LIMIT_TOTAL', 'Subscription', 0, 'free');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-free-messagetopic-total',          'R4 Free MessageTopic Limitation',         'r4',  'LIMIT_TOTAL', 'MessageTopic', 0, 'free');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-free-messagebroker-total',         'R4 Free MessageBroker Limitation',        'r4',  'LIMIT_TOTAL', 'MessageBroker', 0, 'free');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-free-membership-total',            'R4 Free Membership Limitation',           'r4',  'LIMIT_TOTAL', 'Membership', 5, 'free');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-free-client-application-total',    'R4 Free ClientApplication Limitation',    'r4',  'LIMIT_TOTAL', 'ClientApplication', 5, 'free');

-- R4B
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-free-total',                       'R4B Free Total Limitation',              'r4b', 'LIMIT_TOTAL', 'ALL', 3000, 'free');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-free-operation-definition-total',  'R4B Free OperationDefinition Limitation','r4b', 'LIMIT_TOTAL', 'OperationDefinition', 0, 'free');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-free-subscription-total',          'R4B Free Subscription Limitation',       'r4b', 'LIMIT_TOTAL', 'Subscription', 0, 'free');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-free-messagetopic-total',          'R4B Free MessageTopic Limitation',       'r4b', 'LIMIT_TOTAL', 'MessageTopic', 0, 'free');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-free-messagebroker-total',         'R4B Free MessageBroker Limitation',      'r4b', 'LIMIT_TOTAL', 'MessageBroker', 0, 'free');

-- Professional
-- R4
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-professional-total',                       'R4 Professional Total Limitation',               'r4',   'LIMIT_TOTAL', 'ALL', 50000, 'professional');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-professional-operation-definition-total',  'R4 Professional OperationDefinition Limitation', 'r4',   'LIMIT_TOTAL', 'OperationDefinition', 5, 'professional');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-professional-subscription-total',          'R4 Professional Subscription Limitation',        'r4',   'LIMIT_TOTAL', 'Subscription', 5, 'professional');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-professional-messagetopic-total',          'R4 Professional MessageTopic Limitation',        'r4',   'LIMIT_TOTAL', 'MessageTopic', 5, 'professional');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-professional-messagebroker-total',         'R4 Professional MessageBroker Limitation',       'r4',   'LIMIT_TOTAL', 'MessageBroker', 2, 'professional');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-professional-membership-total',            'R4 Professional Membership Limitation',          'r4',   'LIMIT_TOTAL', 'Membership', 100, 'professional');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-professional-client-application-total',    'R4 Professional ClientApplication Limitation',   'r4',   'LIMIT_TOTAL', 'ClientApplication', 50, 'professional');
-- R4B
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-professional-total',                      'R4B Professional Total Limitation',               'r4b', 'LIMIT_TOTAL', 'ALL', 50000, 'professional');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-professional-operation-definition-total', 'R4B Professional OperationDefinition Limitation', 'r4b', 'LIMIT_TOTAL', 'OperationDefinition', 5, 'professional');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-professional-subscription-total',         'R4B Professional Subscription Limitation',        'r4b', 'LIMIT_TOTAL', 'Subscription', 5, 'professional');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-professional-messagetopic-total',         'R4B Professional MessageTopic Limitation',        'r4b', 'LIMIT_TOTAL', 'MessageTopic', 5, 'professional');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-professional-messagebroker-total',        'R4B Professional MessageBroker Limitation',       'r4b', 'LIMIT_TOTAL', 'MessageBroker', 2, 'professional');



-- Team
-- R4
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-team-total',                       'R4 Team Total Limitation',                'r4',  'LIMIT_TOTAL', 'ALL', 100000, 'team');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-team-operation-definition-total',  'R4 Team OperationDefinition Limitation',  'r4',  'LIMIT_TOTAL', 'OperationDefinition', 30, 'team');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-team-subscription-total',          'R4 Team Subscription Limitation',         'r4',  'LIMIT_TOTAL', 'Subscription', 30, 'team');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-team-messagetopic-total',          'R4 Team MessageTopic Limitation',         'r4',  'LIMIT_TOTAL', 'MessageTopic', 50, 'team');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-team-messagebroker-total',         'R4 Team MessageBroker Limitation',        'r4',  'LIMIT_TOTAL', 'MessageBroker', 10, 'team');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-team-membership-total',            'R4 Team Membership Limitation',           'r4',   'LIMIT_TOTAL', 'Membership', 5000, 'team');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4-team-client-application-total',    'R4 Team ClientApplication Limitation',    'r4',   'LIMIT_TOTAL', 'ClientApplication', 500, 'team');
-- R4B
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-team-total',                      'R4B Team Total Limitation',               'r4b', 'LIMIT_TOTAL', 'ALL', 100000, 'team');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-team-operation-definition-total', 'R4B Team OperationDefinition Limitation', 'r4b', 'LIMIT_TOTAL', 'OperationDefinition', 30, 'team');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-team-subscription-total',         'R4B Team Subscription Limitation',        'r4b', 'LIMIT_TOTAL', 'Subscription', 30, 'team');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-team-messagetopic-total',         'R4B Team MessageTopic Limitation',        'r4b', 'LIMIT_TOTAL', 'MessageTopic', 50, 'team');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-team-messagebroker-total',        'R4B Team MessageBroker Limitation',       'r4b', 'LIMIT_TOTAL', 'MessageBroker', 10, 'team');

-- Unlimited
-- No flags, no limitations.
