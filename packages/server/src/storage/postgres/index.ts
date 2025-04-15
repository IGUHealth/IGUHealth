import * as db from "zapatos/db";

import { IGUHealthServerCTX } from "../../fhir-server/types.js";
import { IAuthAdmin } from "../interfaces/authAdmin/index.js";
import { FHIRResourceStore } from "../interfaces/fhirStore.js";
import { Store } from "../interfaces/index.js";
import { PostgresAuthAdmin } from "./authAdmin/index.js";
import { PostgresFHIRStore } from "./fhirStore.js";

export class PostgresStore<CTX extends Pick<IGUHealthServerCTX, "tenant">>
  implements Store<CTX>
{
  public auth: IAuthAdmin<CTX>;
  public fhir: FHIRResourceStore<CTX>;
  private readonly _pgClient: db.Queryable;

  constructor(pgClient: db.Queryable) {
    this.fhir = new PostgresFHIRStore<CTX>(pgClient);
    this.auth = new PostgresAuthAdmin<CTX>(pgClient);
    this._pgClient = pgClient;
  }

  getClient(): db.Queryable {
    return this._pgClient;
  }
}
