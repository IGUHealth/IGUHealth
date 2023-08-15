# IGUHealth

FHIR development environment. Code is written in typescript

## Code Organizationg

Code is organized as separate packages in /packages.

## Staring Local Server

### Prerequisite

Running postgres that has a database with same name specified in environment variables.
Running instance of redis.

### Command

```bash
cd packages/server
# If not present .env
mv .env.defaults .env
yarn watch
```

### Environment Variables

#### Data layer

| name                   | description             | required | defaults  |
| ---------------------- | ----------------------- | -------- | --------- |
| FHIR_DATABASE_NAME     | Postgres database name. | true     | iguhealth |
| FHIR_DATABASE_HOST     | Postgres host           | true     | localhost |
| FHIR_DATABASE_PORT     | Postgres port           | true     | 5432      |
| FHIR_DATABASE_PASSWORD | Postgres password       | true     | ""        |
| FHIR_DATABASE_USERNAME | Postgres username       | true     | postgres  |
| REDIS_HOST             | Redis Host              | true     | 127.0.0.1 |
| REDIS_PORT             | Redis port              | true     | 6379      |

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
