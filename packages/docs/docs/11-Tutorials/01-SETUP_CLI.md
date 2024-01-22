# Setup CLI

For this tutorial we will setup the IGUHealth CLI.

## Install

To start out we need to install the cli package via [npm](https://www.npmjs.com/package/@iguhealth/cli).

```bash
npm install -g @iguhealth/cli
```

## Setup Client Application

For CLI authorization we need to setup a Client app with client credentials.

1. Go to [Cloud Admin Console](https://admin.iguhealth.app/) or your self hosted console.
2. Click Client Application under the Security Group
3. Set a name and grant type of Client Credentails.
4. Set a client secret
5. Click Actions and click create.
6. Write down the client id and client secret.
7. Click Access Policies under Security group.
8. Click create new (or if you have an existing policy you want to use click that policy).
9. Fill in name and code.
10. For full access set type to Full Access, if limited access set FHIR Rest.
11. If not set to full access click Add access and set what access you want for CLI.
12. Click Add target and link your Client Application you created in step 5.

## Setup the CLI tenant.

1. In the CLI run `iguhealth config add-tenant`
2. Set the api origin (defaults to cloud api url).
3. Set the tenant id. In the admin console this will be the section `https://admin.iguhealth.app/w/{tenantID}`
4. Set a unique value of what you call this tenant.
5. Set the client.id you wrote down in step 6 of Setup Client application.
6. Set the client.secret you wrote down in step 6.
7. Switch to tenant you've setup `iguhealth config switch-tenant`
8. Test your connection with various api commands
   Run the following to see api commands available.`iguhealth api`
