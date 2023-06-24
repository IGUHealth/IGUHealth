import { FHIRURL } from "@genfhi/fhir-query";
import {
  ConcreteType,
  ResourceMap,
  AResource,
} from "@genfhi/fhir-types/r4/types";
import * as pg from "pg";
import { FHIRClient } from "../types";

const client = new pg.Client();
class Postgres implements FHIRClient {
  constructor(config: pg.ClientConfig) {}
  search(query: FHIRURL): Promise<ConcreteType[]> {
    throw new Error("Method not implemented.");
  }
  create<T extends ConcreteType>(resource: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  update<T extends ConcreteType>(resource: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  patch<T extends ConcreteType>(resource: T, patches: any): Promise<T> {
    throw new Error("Method not implemented.");
  }
  read<T extends keyof ResourceMap>(
    resourceType: T,
    id: string
  ): Promise<AResource<T>> {
    throw new Error("Method not implemented.");
  }
  vread<T extends keyof ResourceMap>(
    resourceType: T,
    id: string,
    versionId: string
  ): Promise<AResource<T>> {
    throw new Error("Method not implemented.");
  }
  delete(resourceType: keyof ResourceMap, id: string): void {
    throw new Error("Method not implemented.");
  }
  historySystem(): Promise<ConcreteType[]> {
    throw new Error("Method not implemented.");
  }
  historyType<T extends keyof ResourceMap>(
    resourceType: T
  ): Promise<AResource<T>[]> {
    throw new Error("Method not implemented.");
  }
  historyInstance<T extends keyof ResourceMap>(
    resourceType: T,
    id: string
  ): Promise<AResource<T>[]> {
    throw new Error("Method not implemented.");
  }
}
