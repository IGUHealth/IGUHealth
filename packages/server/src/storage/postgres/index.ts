import * as db from "zapatos/db";

import { IGUHealthServerCTX } from "../../fhir-server/types.js";
import { IAuthAdmin } from "../interfaces/authAdmin/index.js";
import { FHIRResourceStore } from "../interfaces/fhirStore.js";
import { Store } from "../interfaces/index.js";
import { PostgresAuthAdmin } from "./authAdmin/index.js";
import { PostgresFHIRStore } from "./fhirStore.js";

export class PostgresStore<CTX extends IGUHealthServerCTX>
  implements Store<CTX>
{
  public auth: IAuthAdmin<CTX>;
  public fhir: FHIRResourceStore<CTX>;
  private readonly client: db.Queryable;

  constructor(client: db.Queryable) {
    this.fhir = new PostgresFHIRStore<CTX>(client);
    this.auth = new PostgresAuthAdmin<CTX>(client);
    this.client = client;
  }

  getClient(): db.Queryable {
    return this.client;
  }
}
