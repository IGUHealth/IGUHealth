import type { Logger } from "pino";

import {
  ResourceType,
  AResource,
  CapabilityStatement,
  canonical,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { FHIRClientAsync } from "@iguhealth/client/interface";

import { Lock } from "../synchronization/interfaces.js";
import { IOCache } from "../cache/interface.js";
import { TerminologyProvider } from "../terminology/interface.js";
import { EncryptionProvider } from "../encryption/provider/interface.js";

declare const __workspace: unique symbol;
export type Workspace = string & { [__workspace]: string };

declare const __author: unique symbol;
export type Author = string & { [__author]: string };

export interface FHIRServerCTX {
  encryptionProvider?: EncryptionProvider;
  inTransaction?: boolean;
  workspace: Workspace;
  author: Author;
  terminologyProvider: TerminologyProvider;
  // Services setup
  logger: Logger<unknown>;
  capabilities: CapabilityStatement;
  cache: IOCache<FHIRServerCTX>;
  client: FHIRClientAsync<FHIRServerCTX>;
  lock: Lock<unknown>;
  user_access_token?: string;
  resolveTypeToCanonical: (type: uri) => canonical | undefined;
  resolveCanonical: <T extends ResourceType>(
    type: T,
    url: string
  ) => AResource<T> | undefined;
}
