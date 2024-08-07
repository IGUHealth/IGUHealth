import { useContext, useMemo } from "react";

import createHTTPClient from "@iguhealth/client/lib/http";

import IGUHealthContext, { IGUHealthContextState } from "../IGUHealthContext";

export function useIGUHealth(): IGUHealthContextState & {
  client: ReturnType<typeof createHTTPClient>;
} {
  const context = useContext(IGUHealthContext);

  const client = useMemo(() => {
    return createHTTPClient({
      authenticate: () => context.reAuthenticate(context),
      getAccessToken: () =>
        Promise.resolve(context.payload?.access_token as string),
      url: context.rootURL as string,
    });
  }, [context.payload]);

  return {
    ...context,
    client,
  };
}
