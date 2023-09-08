import { atom } from "recoil";
import createHTTPClient from "@iguhealth/client/lib/http";

export const getClient = atom<ReturnType<typeof createHTTPClient>>({
  key: "client",
});
