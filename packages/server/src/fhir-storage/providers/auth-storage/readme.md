# Auth Storage

Provides storage mechanisms for auth resources for a tenant.
These include users, oidc providers, tokens, codes.
Under the hood this uses custom tables that are synced with FHIR Resources IE users are within the user table but are also provided as FHIR resources to search and update via FHIR API.
