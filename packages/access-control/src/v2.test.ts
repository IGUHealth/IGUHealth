import { expect, test } from "@jest/globals";

import {
  AccessPolicyV2,
  code,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS, Issuer, Subject, TenantId } from "@iguhealth/jwt";

import evaluatePolicy, { PolicyContext } from "./v2.js";

function getContext(): PolicyContext {
  return {
    user: {
      claims: {
        iss: "https://iguhealth.test" as Issuer,
        aud: "iguhealth",
        sub: "public-user" as Subject,
        scope: "user/*.*",
        [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
        [CUSTOM_CLAIMS.RESOURCE_ID]: "public" as id,
        [CUSTOM_CLAIMS.TENANT]: "my-tenant" as TenantId,
        [CUSTOM_CLAIMS.ROLE]: "admin",
      },
      membership: {
        email: "test-user@gmail.com",
        role: "admin" as code,
        resourceType: "Membership",
      },
    },
    request: {
      fhirVersion: R4,
      level: "system",
      type: "search-request",
      parameters: [],
    },
  };
}

test("Simple conditional check", async () => {
  expect(
    evaluatePolicy(getContext(), {
      name: "Request Check",
      resourceType: "AccessPolicyV2",
      engine: "rule-engine" as code,
      rule: [
        {
          name: "Admin Check",
          condition: {
            expression: {
              language: "text/fhirpath" as code,
              expression: "%user.claims.role = 'admin'",
            },
          },
        },
      ],
    }),
  ).resolves.toEqual({
    issue: [
      {
        code: "forbidden",
        diagnostics: "Access Denied.",
        expression: undefined,
        severity: "error",
      },
    ],
    resourceType: "OperationOutcome",
  });

  const res = await evaluatePolicy(getContext(), {
    name: "Request Check",
    resourceType: "AccessPolicyV2",
    engine: "rule-engine" as code,
    rule: [
      {
        name: "Admin Check",
        condition: {
          expression: {
            language: "text/fhirpath" as code,
            expression: "%user.claims.`https://iguhealth.app/role` = 'admin'",
          },
        },
      },
    ],
  });

  expect(res).toEqual({
    issue: [
      {
        code: "informational",
        diagnostics: "Access succeeded.",
        expression: undefined,
        severity: "information",
      },
    ],
    resourceType: "OperationOutcome",
  });
});

test("Simple Or Logic", async () => {
  expect(
    evaluatePolicy(getContext(), {
      name: "Request Check",
      resourceType: "AccessPolicyV2",
      engine: "rule-engine" as code,
      rule: [
        {
          name: "Or Logic",
          combineBehavior: "any" as code,
          rule: [
            {
              name: "Fail Check",
              condition: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression: "false",
                },
              },
            },
            {
              name: "Admin check",
              condition: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression:
                    "%user.claims.`https://iguhealth.app/role` = 'admin'",
                },
              },
            },
          ],
        },
      ],
    }),
  ).resolves.toEqual({
    issue: [
      {
        code: "informational",
        diagnostics: "Access succeeded.",
        expression: undefined,
        severity: "information",
      },
    ],
    resourceType: "OperationOutcome",
  });
});

test("Simple And Logic", async () => {
  expect(
    evaluatePolicy(getContext(), {
      name: "Request Check",
      resourceType: "AccessPolicyV2",
      engine: "rule-engine" as code,
      rule: [
        {
          name: "Or Logic",
          combineBehavior: "all" as code,
          rule: [
            {
              name: "Fail Check",
              condition: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression: "false",
                },
              },
            },
            {
              name: "Admin check",
              condition: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression:
                    "%user.claims.`https://iguhealth.app/role` = 'admin'",
                },
              },
            },
          ],
        },
      ],
    }),
  ).resolves.toEqual({
    issue: [
      {
        code: "forbidden",
        diagnostics: "Access Denied.",
        expression: undefined,
        severity: "error",
      },
    ],
    resourceType: "OperationOutcome",
  });
});
