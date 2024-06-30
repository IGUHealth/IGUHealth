import { KoaState } from "../../fhir-api/types.js";

export interface ModelManagement<
  Model extends Insertable & Updateable,
  Whereable,
  Insertable,
  Updateable,
> {
  get(
    ctx: KoaState.IGUHealthServices["iguhealth"],
    id: string,
  ): Promise<Model | undefined>;
  search(
    ctx: KoaState.IGUHealthServices["iguhealth"],
    where: Whereable,
  ): Promise<Model[]>;
  create(
    ctx: KoaState.IGUHealthServices["iguhealth"],
    model: Insertable,
  ): Promise<Model>;
  update(
    ctx: KoaState.IGUHealthServices["iguhealth"],
    id: string,
    update: Updateable,
  ): Promise<Model>;
  delete(
    ctx: KoaState.IGUHealthServices["iguhealth"],
    where: Whereable,
  ): Promise<void>;
}
