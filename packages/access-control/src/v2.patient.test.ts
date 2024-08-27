import { expect, test } from "@jest/globals";

import {
  AccessPolicyV2,
  code,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS, Issuer, Subject, TenantId } from "@iguhealth/jwt";

import * as v2 from "./v2.js";

function getContext(): v2.PolicyContext {
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
        link: {
          reference: "Patient/123",
        },
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

const PatientAccessPolicy: AccessPolicyV2 = {
  resourceType: "AccessPolicyV2",
  engine: "rule-engine" as code,
  id: "patient-access-policy" as id,
  name: "Patient Access Policy",
  description: "Policy for patient access.",
  rule: [
    {
      name: "Patient access",
      target: {
        expression: {
          language: "text/fhirpath" as code,
          expression: "%request.resourceType = 'Patient'",
        },
      },
      combineBehavior: "any" as code,
      rule: [
        {
          name: "Allow user to only read their Patient resource",
          target: {
            expression: {
              language: "text/fhirpath" as code,
              expression: "%request.type = 'read-request'",
            },
          },
          condition: {
            expression: {
              language: "text/fhirpath" as code,
              expression:
                "%request.id = %user.membership.link.reference.replace('Patient/', '')",
            },
          },
        },
      ],
    },
  ],
};

test("Evaluate patient access controls", async () => {
  const context = getContext();

  expect(
    await v2.evaluate(
      {
        ...context,
        request: {
          type: "read-request",
          fhirVersion: R4,
          level: "instance",
          resourceType: "Patient",
          id: "123" as id,
        },
      },
      PatientAccessPolicy,
    ),
  ).toEqual({
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
    await v2.evaluate(
      {
        ...context,
        request: {
          type: "read-request",
          fhirVersion: R4,
          level: "instance",
          resourceType: "Patient",
          id: "not-id" as id,
        },
      },
      PatientAccessPolicy,
    ),
  ).toEqual({
    issue: [
      {
        code: "forbidden",
        diagnostics: "Access Denied.",
        expression: ["/rule/0"],
        severity: "error",
      },
    ],
    resourceType: "OperationOutcome",
  });
});
