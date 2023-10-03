---
sidebar_position: 1
---

# Intro

Authentication is built around workspaces. Workspaces are a logical seperation of resources. Each workspace will have it's own isolated set of resources.
Access to a workspace is determined by JWT tokens. JWT tokens are expected to have custom claims specifying what workspace they have access too.

## URL Structure for workspace access

Requests are structured in the following format:
URL: /w/:workspace/api/:version/fhir/:fhir_version/:\*,

- **workspace:**
  slug identifying the workspace a user is attempting to access.
- **version:** IGUHealth api version.
- **fhir_version:** FHIR version for the request.

## JWT Structure

When a request comes in the workspace slug is extracted and then checked against the JWT to see if a user can access the workspace.

### Custom Claims

| Name                             | type      | description                                       |
| -------------------------------- | --------- | ------------------------------------------------- |
| https://iguhealth.app/workspaces | string [] | String array of workspaces a user has access too. |
