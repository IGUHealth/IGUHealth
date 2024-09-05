import { expect, test } from "@jest/globals";

import { code, id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS, Issuer, Subject, TenantId } from "@iguhealth/jwt";

import * as v2 from "./index.js";

function getContext(): v2.pip.PolicyContext<any> {
  return {
    variables: {},
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
    v2.pdp.evaluate(getContext(), {
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
        severity: "error",
        expression: ["/rule/0"],
      },
    ],
    resourceType: "OperationOutcome",
  });

  const res = await v2.pdp.evaluate(getContext(), {
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
    v2.pdp.evaluate(getContext(), {
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
    v2.pdp.evaluate(getContext(), {
      name: "Request Check",
      resourceType: "AccessPolicyV2",
      engine: "rule-engine" as code,
      rule: [
        {
          name: "And Logic",
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
        expression: ["/rule/0/rule/0"],
        severity: "error",
      },
    ],
    resourceType: "OperationOutcome",
  });
});

test("Simple Target Logic", async () => {
  expect(
    v2.pdp.evaluate(getContext(), {
      name: "Request Check",
      resourceType: "AccessPolicyV2",
      engine: "rule-engine" as code,
      rule: [
        {
          name: "And Logic",
          combineBehavior: "all" as code,
          rule: [
            {
              name: "Skip over because of target",
              target: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression:
                    "%user.claims.`https://iguhealth.app/role` = 'owner'",
                },
              },
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
                  expression: "true",
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

  expect(
    v2.pdp.evaluate(getContext(), {
      name: "Request Check",
      resourceType: "AccessPolicyV2",
      engine: "rule-engine" as code,
      rule: [
        {
          name: "And Logic",
          combineBehavior: "all" as code,
          rule: [
            {
              name: "Skip over because of target",
              target: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression:
                    "%user.claims.`https://iguhealth.app/role` = 'admin'",
                },
              },
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
                  expression: "true",
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
        expression: ["/rule/0/rule/0"],
        severity: "error",
      },
    ],
    resourceType: "OperationOutcome",
  });
});

test("Test Rule Effect Log", async () => {
  expect(
    v2.pdp.evaluate(getContext(), {
      name: "Request Check",
      resourceType: "AccessPolicyV2",
      engine: "rule-engine" as code,
      rule: [
        {
          name: "And Logic",
          combineBehavior: "all" as code,
          rule: [
            {
              name: "Skip over because of target",
              target: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression:
                    "%user.claims.`https://iguhealth.app/role` = 'owner'",
                },
              },
              condition: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression: "false",
                },
              },
            },
            {
              name: "Admin check",
              effect: "deny" as code,
              condition: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression: "false",
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

  expect(
    v2.pdp.evaluate(getContext(), {
      name: "Request Check",
      resourceType: "AccessPolicyV2",
      engine: "rule-engine" as code,
      rule: [
        {
          name: "And Logic",
          combineBehavior: "all" as code,
          rule: [
            {
              name: "Skip over because of target",
              target: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression:
                    "%user.claims.`https://iguhealth.app/role` = 'owner'",
                },
              },
              condition: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression: "false",
                },
              },
            },
            {
              name: "Admin check",
              effect: "permit" as code,
              condition: {
                expression: {
                  language: "text/fhirpath" as code,
                  expression: "false",
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
        expression: ["/rule/0/rule/1"],
        severity: "error",
      },
    ],
    resourceType: "OperationOutcome",
  });
});
