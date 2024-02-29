import * as db from "zapatos/db";

export interface ModelManagement<
  Model extends Insertable & Updateable,
  Whereable,
  Insertable,
  Updateable,
> {
  get(client: db.Queryable, id: string): Promise<Model | undefined>;
  search(client: db.Queryable, where: Whereable): Promise<Model[]>;
  create(client: db.Queryable, model: Insertable): Promise<Model>;
  update(client: db.Queryable, id: string, update: Updateable): Promise<Model>;
  delete(client: db.Queryable, where: Whereable): Promise<void>;
}
