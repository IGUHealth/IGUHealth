# Overview

| Name      | Image Download                                                              | Description                              |
| --------- | --------------------------------------------------------------------------- | ---------------------------------------- |
| Server    | https://github.com/IGUHealth/IGUHealth/pkgs/container/iguhealth%2Figuhealth | Server Docker image                      |
| Admin App | https://github.com/IGUHealth/IGUHealth/pkgs/container/iguhealth%2Fadmin-app | Admin app for managing a server instance |

## Server

Our docker image for the server takes the same environment variables specified [here](../NPM%20Packages/@iguhealth_server)

## Admin App

The admin app provides an interface for basic crud and management of your tenant.

### Environment variables

| Name                      | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| `REACT_APP_FHIR_BASE_URL` | The Base domain where your IGUHealth server is hosted |
