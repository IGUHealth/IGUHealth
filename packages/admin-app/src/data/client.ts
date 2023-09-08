import { atom } from "recoil";
import createHTTPClient from "@iguhealth/client/lib/http";

export const client = atom<ReturnType<typeof createHTTPClient>>({
  key: "client",
});
