import { createContext } from "react";

import createHTTPClient from "@iguhealth/client/http";
import { Membership } from "@iguhealth/fhir-types/r4/types";

export type IGUHealthContextState = {
  getClient: () => ReturnType<typeof createHTTPClient>;
  isAuthenticated: boolean;
  user: Membership | undefined;
};

const stub = (): never => {
  throw new Error("IGUHealth has not been initiated.");
};

export const InitialContext: IGUHealthContextState = {
  getClient: stub,
  isAuthenticated: false,
  user: undefined,
};

const IGUHealthContext = createContext<IGUHealthContextState>({
  ...InitialContext,
});

export default IGUHealthContext;
