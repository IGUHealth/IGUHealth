import { KoaContext } from "../../fhir-api/types.js";

export interface ModelManagement<
  Model extends Insertable & Updateable,
  Whereable,
  Insertable,
  Updateable,
> {
  get(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    id: string,
  ): Promise<Model | undefined>;
  search(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    where: Whereable,
  ): Promise<Model[]>;
  create(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    model: Insertable,
  ): Promise<Model>;
  update(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    id: string,
    update: Updateable,
  ): Promise<Model>;
  delete(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    where: Whereable,
  ): Promise<void>;
}
