export const CUSTOM_CLAIMS = {
  RESOURCE_TYPE: <const>"https://iguhealth.app/resourceType",
  RESOURCE_ID: <const>"https://iguhealth.app/resourceId",
  ACCESS_POLICY_VERSION_IDS: <const>(
    "https://iguhealth.app/accessPolicyVersionIds"
  ),
  TENANT: <const>"https://iguhealth.app/tenant",
  ROLE: <const>"https://iguhealth.app/role",
};

export type ALGORITHMS_ALLOWED = typeof ALGORITHMS[keyof typeof ALGORITHMS];

export const ALGORITHMS = <const>{
  RS256: "RS256",
  RS384: "RS384",
};
