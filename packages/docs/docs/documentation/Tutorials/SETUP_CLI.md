# Setup CLI

For this tutorial, we will set up the IGUHealth CLI.

## Install​

To start out, we need to install the cli package via npm.

```bash
npm install -g @iguhealth/cli
```

## Setup client application ​

For CLI authorization, we need to setup a client app with client credentials.

1. Login to the [cloud admin console](https://api.iguhealth.app/oidc/interaction/login) or your self-hosted console.
2. Click Client Application under the Security Group.
3. Set a name and grant the type of client credentials.
4. Set a client secret
5. Click Actions and click Create.
6. Write down the client ID and client secret.
7. Click Access Policies under the Security group.
8. Click Create New (or, if you have an existing policy you want to use, click that policy).
9. Fill in the name and code.
10. For full access, set the type property to Full Access; if limited access, set FHIR Rest.
11. If not set to full access, click Add Access and set what access you want for CLI.
12. Click Add Target and link your client application you created in step 5.

## Setup the CLI tenant. ​

1. In the CLI, run `iguhealth config add-tenant`.
2. Fill in the prompts with values pulled from the Admin Application settings page.
3. Set up the client ID and client secret you wrote down in Step 6 of the Setup Client application.
4. Switch to the tenant you've setup in `iguhealth config switch-tenant`.
5. Test your connection with various API commands. Run the following to see the API commands available: `iguhealth api`
