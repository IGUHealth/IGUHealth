import type { Logger } from "pino";

import {
  ResourceType,
  AResource,
  CapabilityStatement,
} from "@iguhealth/fhir-types/r4/types";
import { FHIRClientAsync } from "@iguhealth/client/interface";

import { Lock } from "../synchronization/interfaces.js";
import { IOCache } from "../cache/interface.js";
import { TerminologyProvider } from "../terminology/interface.js";
import { EncryptionProvider } from "../encryption/provider/interface.js";

export interface FHIRServerCTX {
  encryptionProvider?: EncryptionProvider;
  inTransaction?: boolean;
  workspace: string;
  author: string;
  terminologyProvider: TerminologyProvider;
  // Services setup
  logger: Logger<unknown>;
  capabilities: CapabilityStatement;
  cache: IOCache<FHIRServerCTX>;
  client: FHIRClientAsync<FHIRServerCTX>;
  lock: Lock<unknown>;
  user_access_token?: string;
  resolveCanonical: <T extends ResourceType>(
    type: T,
    url: string
  ) => AResource<T> | undefined;
}
