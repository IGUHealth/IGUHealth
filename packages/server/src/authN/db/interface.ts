import { KoaExtensions } from "../../fhir-api/types.js";

export interface ModelManagement<
  Model extends Insertable & Updateable,
  Whereable,
  Insertable,
  Updateable,
> {
  get(
    ctx: KoaExtensions.IGUHealthServices["iguhealth"],
    id: string,
  ): Promise<Model | undefined>;
  search(
    ctx: KoaExtensions.IGUHealthServices["iguhealth"],
    where: Whereable,
  ): Promise<Model[]>;
  create(
    ctx: KoaExtensions.IGUHealthServices["iguhealth"],
    model: Insertable,
  ): Promise<Model>;
  update(
    ctx: KoaExtensions.IGUHealthServices["iguhealth"],
    id: string,
    update: Updateable,
  ): Promise<Model>;
  delete(
    ctx: KoaExtensions.IGUHealthServices["iguhealth"],
    where: Whereable,
  ): Promise<void>;
}
