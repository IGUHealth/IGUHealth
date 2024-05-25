import * as db from "zapatos/db";

import { KoaContext } from "../../fhir-api/types.js";

export interface ModelManagement<
  Model extends Insertable & Updateable,
  Whereable,
  Insertable,
  Updateable,
> {
  get(ctx: KoaContext.FHIRServices, id: string): Promise<Model | undefined>;
  search(ctx: KoaContext.FHIRServices, where: Whereable): Promise<Model[]>;
  create(ctx: KoaContext.FHIRServices, model: Insertable): Promise<Model>;
  update(
    ctx: KoaContext.FHIRServices,
    id: string,
    update: Updateable,
  ): Promise<Model>;
  delete(ctx: KoaContext.FHIRServices, where: Whereable): Promise<void>;
}
