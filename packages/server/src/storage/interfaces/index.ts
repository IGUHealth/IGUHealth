import { IGUHealthServerCTX } from "../../fhir-server/types.js";
import { IAuthAdmin } from "./authAdmin/index.js";
import { FHIRResourceStore } from "./fhirStore.js";

export interface Store<CTX extends IGUHealthServerCTX> {
  fhir: FHIRResourceStore<CTX>;
  auth: IAuthAdmin<CTX>;
}
