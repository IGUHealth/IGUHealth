import { KoaContext } from "../../fhir-api/types.js";

export interface ModelManagement<
  Model extends Insertable & Updateable,
  Whereable,
  Insertable,
  Updateable,
> {
  get(
    ctx: KoaContext.IGUHealthServices["iguhealth"],
    id: string,
  ): Promise<Model | undefined>;
  search(
    ctx: KoaContext.IGUHealthServices["iguhealth"],
    where: Whereable,
  ): Promise<Model[]>;
  create(
    ctx: KoaContext.IGUHealthServices["iguhealth"],
    model: Insertable,
  ): Promise<Model>;
  update(
    ctx: KoaContext.IGUHealthServices["iguhealth"],
    id: string,
    update: Updateable,
  ): Promise<Model>;
  delete(
    ctx: KoaContext.IGUHealthServices["iguhealth"],
    where: Whereable,
  ): Promise<void>;
}
