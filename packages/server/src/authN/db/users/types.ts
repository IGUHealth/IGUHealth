import * as s from "zapatos/schema";
export const USER_QUERY_COLS = <const>[
  "id",
  "tenant",
  "scope",
  "email",
  "first_name",
  "last_name",
  "email_verified",
  "role",
  "fhir_user_id",
  "fhir_user_versionid",
];

export type User = s.users.OnlyCols<typeof USER_QUERY_COLS>;

export type LoginParameters = {
  "email-password" : {
    email: string;
    password: string;
  },
  "oidc-provider": {
    email: string;
    provider: string;
  }
};
