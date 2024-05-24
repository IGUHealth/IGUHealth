# Setup CLI

For this tutorial, we will set up the IGUHealth CLI.

## Install​

To start out, we need to install the cli package via npm.

```bash
npm install -g @iguhealth/cli
```

## Setup client application ​

For CLI authorization, we need to setup a client app with client credentials.

1. Go to the [cloud admin console](https://admin.iguhealth.app/) or your self-hosted console.
2. Under **Security**, click **Client Applications**.
3. Set a name for the application, and under the **Grant Type** dropdown, select **Client Credentials**.
4. Set a client secret.
5. At the top, click the **Actions** button and then choose **Create**.
6. Write down the client ID and client secret.
7. Click Access Policies under the Security group.
8. Click Create New (or, if you have an existing policy you want to use, click that policy).
9. Fill in the name and code.
10. For full access, set the type property to Full Access; if limited access, set FHIR Rest.
11. If not set to full access, click Add Access and set what access you want for CLI.
12. Click Add Target and link your client application you created in step 5.

## Setup the CLI tenant. ​

1. In the CLI, run `iguhealth config add-tenant`.
2. Set the API origin (defaults to the cloud API URL).
3. Set the tenant ID. In the admin console, this will be the section: `https://{tenantID}.admin.iguhealth.app/`.
4. Set a unique value for what you call this tenant.
5. Set up the client ID and client secret you wrote down in Step 6 of the Setup Client application.
6. Switch to the tenant you've setup in `iguhealth config switch-tenant`.
7. Test your connection with various API commands. Run the following to see the API commands available: `iguhealth api`
