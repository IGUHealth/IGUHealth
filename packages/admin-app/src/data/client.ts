import { atom } from "recoil";
import createHTTPClient from "@iguhealth/client/http";

export const getClient = atom<ReturnType<typeof createHTTPClient>>({
  key: "client",
  default: undefined,
});
