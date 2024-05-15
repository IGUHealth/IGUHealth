ALTER TABLE tenants 
  DROP COLUMN subscription_tier;

DROP TABLE limitations;
DROP TABLE subscription_tier;
DROP TYPE limitation_type;