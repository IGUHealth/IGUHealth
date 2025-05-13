import { IGUHealthServerCTX } from "../../fhir-server/types.js";
import { IAuthAdmin } from "./authAdmin/index.js";
import { FHIRResourceStore } from "./fhir.js";

export interface Store<CTX extends IGUHealthServerCTX> {
  fhir: FHIRResourceStore<CTX>;
  auth: IAuthAdmin<CTX>;
}
