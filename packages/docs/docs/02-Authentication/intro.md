---
sidebar_position: 1
---

# Intro

Authentication is built around tenants. Tenants are a logical seperation of resources. Each tenant will have it's own isolated set of resources.
Access to a tenant is determined by JWT tokens. JWT tokens are expected to have custom claims specifying what tenant they have access too.

## URL Structure for tenant access

Requests are structured in the following format:
URL: /w/:tenant/api/:version/fhir/:fhir_version/:\*,

- **tenant:** slug identifying the tenant a user is attempting to access.
- **version:** IGUHealth api version.
- **fhir_version:** FHIR version for the request.

## JWT Structure

When a request comes in the tenant slug is extracted and then checked against the JWT to see if a user can access the tenant.

### Custom Claims

| Name                          | type                                  | description                                                            |
| ----------------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| https://iguhealth.app/tenants | `{id: string, superAdmin: boolean}[]` | Which tenants a user has access too and whether they are a superadmin. |
