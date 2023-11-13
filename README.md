# IGUHealth

FHIR development environment. Code is written in typescript

## Code Organizationg

Code is organized as separate packages in /packages.

## Starting Local Server

### Prerequisite

- Running postgres that has a database with same name specified in environment variables.
- Running instance of redis.

### Command

```bash
cd packages/server
# If not present .env
mv .env.defaults .env
yarn watch
```

### Environment Variables

#### Data layer

| name                   | description                        | required | defaults  |
| ---------------------- | ---------------------------------- | -------- | --------- |
| FHIR_DATABASE_NAME     | Postgres database name.            | true     | iguhealth |
| FHIR_DATABASE_HOST     | Postgres host                      | true     | localhost |
| FHIR_DATABASE_PORT     | Postgres port                      | true     | 5432      |
| FHIR_DATABASE_PASSWORD | Postgres password                  | true     | ""        |
| FHIR_DATABASE_USERNAME | Postgres username                  | true     | postgres  |
| FHIR_DATABASE_SSL      | Whether Postgres connection is SSL | false    | false     |
| REDIS_HOST             | Redis Host                         | true     | 127.0.0.1 |
| REDIS_PORT             | Redis port                         | true     | 6379      |

#### Meta Information

| name    | description                                                                 | required |
| ------- | --------------------------------------------------------------------------- | -------- |
| API_URL | Current url where API is hosted from (used in operation execution clients). | false    |

#### AWS Operation Invocation variables

Optional depending on whether you are executing custom code for operations

| name                         | description                                                                                 | required |
| ---------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| AWS_REGION                   | AWS Region where you want lambdas to be executed from.                                      | false    |
| AWS_LAMBDA_ROLE              | Execution role of lambda functions.                                                         | false    |
| AWS_LAMBDA_ACCESS_KEY_ID     | Access key id for lambda (must have permission to invoke and create lambda functions)       | false    |
| AWS_LAMBDA_ACCESS_KEY_SECRET | Access key secret for lambda (must have permission to invoke and create lambda functions).  | false    |
| AWS_LAMBDA_LAYER_ARN         | ARN Layer for lambda (current expectation is layer installed with all @iguhealth packages). | false    |

#### AUTHENTICATION

Authentication environment variables

| name                        | description                                            | required | defaults                  |
| --------------------------- | ------------------------------------------------------ | -------- | ------------------------- |
| AUTH_JWK_URI                | JWK remote url to pull JSON WEB Key Set.               | true     |                           |
| AUTH_JWT_AUDIENCE           | String representing audience for jwt.                  | false    | https://iguhealth.app/api |
| AUTH_JWT_ISSUER             | Issuer of the JWT.                                     | true     |                           |
| AUTH_JWT_ALGORITHM          |                                                        | false    | RS256                     |
| AUTH_CERTIFICATION_LOCATION | Location for local certifications for IGUHEALTH ISSUER | false    |                           |
| AUTH_SIGNING_KEY            | The signing key used to generate new local tokens      | false    |                           |

#### Encryption

Encryption is used for user passed in secrets (for example an external token for a service ). We currently only support encyrption via AWS KMS
using the AWS encryption sdk.

| name                         | description                                           | required | defaults                                   |
| ---------------------------- | ----------------------------------------------------- | -------- | ------------------------------------------ |
| ENCRYPTION_TYPE              | The type of encryption (used to encrypt user secrets) | false    | none (currently aws only option supported) |
| AWS_KMS_ACCESS_KEY_ID        | KMS client access key ID                              | false    |                                            |
| AWS_KMS_ACCESS_KEY_SECRET    | KMS client access key secret                          | false    |                                            |
| AWS_ENCRYPTION_GENERATOR_KEY | KMS key used to generate data keys on keyring         | false    |                                            |
| AWS_ENCRYPTION_KEY           | Additional KMS key used for encryption                | false    |                                            |

#### Performance

| name                             | description                      | required | defaults |
| -------------------------------- | -------------------------------- | -------- | -------- |
| RATE_LIMIT_MAX                   | Rate limiting amount per minute  | false    | 100      |
| POSTGRES_TRANSACTION_ENTRY_LIMIT | Postgres transaction entry limit | false    | 20       |

#### Monitoring

Monitoring services

| name                        | description                                                   | required | defaults |
| --------------------------- | ------------------------------------------------------------- | -------- | -------- |
| SENTRY_SERVER_DSN           | Sentry DSN URL for monitoring errors and performance.         | false    |          |
| SENTRY_WORKER_DSN           | Sentry Worker for monitoring errors and performance on worker | false    |          |
| SENTRY_TRACES_SAMPLE_RATE   | Sentry sample rate.                                           | false    |          |
| SENTRY_PROFILES_SAMPLE_RATE | Sentry profiles rate.                                         | false    |          |
