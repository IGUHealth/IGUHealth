import { FHIRURL } from "@genfhi/fhir-query";
import {
  ConcreteType,
  ResourceMap,
  AResource,
} from "@genfhi/fhir-types/r4/types";
import * as pg from "pg";
import { FHIRClientAsync } from "../types";

const client = new pg.Client();
class Postgres<CTX> implements FHIRClientAsync<CTX> {
  constructor(config: pg.ClientConfig) {}
  search(ctx: CTX, query: FHIRURL): Promise<ConcreteType[]> {
    throw new Error("Method not implemented.");
  }
  create<T extends ConcreteType>(ctx: CTX, resource: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  update<T extends ConcreteType>(ctx: CTX, resource: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  patch<T extends ConcreteType>(
    ctx: CTX,
    resource: T,
    patches: any
  ): Promise<T> {
    throw new Error("Method not implemented.");
  }
  read<T extends keyof ResourceMap>(
    ctx: CTX,
    resourceType: T,
    id: string
  ): Promise<AResource<T>> {
    throw new Error("Method not implemented.");
  }
  vread<T extends keyof ResourceMap>(
    ctx: CTX,
    resourceType: T,
    id: string,
    versionId: string
  ): Promise<AResource<T>> {
    throw new Error("Method not implemented.");
  }
  delete(ctx: CTX, resourceType: keyof ResourceMap, id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  historySystem(ctx: CTX): Promise<ConcreteType[]> {
    throw new Error("Method not implemented.");
  }
  historyType<T extends keyof ResourceMap>(
    ctx: CTX,
    resourceType: T
  ): Promise<AResource<T>[]> {
    throw new Error("Method not implemented.");
  }
  historyInstance<T extends keyof ResourceMap>(
    ctx: CTX,
    resourceType: T,
    id: string
  ): Promise<AResource<T>[]> {
    throw new Error("Method not implemented.");
  }
}
