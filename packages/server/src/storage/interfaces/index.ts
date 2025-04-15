import { IAuthAdmin } from "./authAdmin/index.js";
import { FHIRResourceStore } from "./fhirStore.js";

export interface Store<CTX> {
  fhir: FHIRResourceStore<CTX>;
  auth: IAuthAdmin<CTX>;
}
