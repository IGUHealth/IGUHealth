INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-free-messagetopic-total',          'R4B Free MessageTopic Limitation',       'r4b', 'LIMIT_TOTAL', 'MessageTopic', 0, 'free');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-free-messagebroker-total',         'R4B Free MessageBroker Limitation',      'r4b', 'LIMIT_TOTAL', 'MessageBroker', 0, 'free');

INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-professional-messagetopic-total',         'R4B Professional MessageTopic Limitation',        'r4b', 'LIMIT_TOTAL', 'MessageTopic', 5, 'professional');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-professional-messagebroker-total',        'R4B Professional MessageBroker Limitation',       'r4b', 'LIMIT_TOTAL', 'MessageBroker', 2, 'professional');

INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-team-messagetopic-total',         'R4B Team MessageTopic Limitation',        'r4b', 'LIMIT_TOTAL', 'MessageTopic', 50, 'team');
INSERT INTO limitations (id, name, fhir_version, type, resource_type, value, tier) VALUES ('r4b-team-messagebroker-total',        'R4B Team MessageBroker Limitation',       'r4b', 'LIMIT_TOTAL', 'MessageBroker', 10, 'team');