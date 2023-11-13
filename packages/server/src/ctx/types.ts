import type { Logger } from "pino";

import {
  CapabilityStatement,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { FHIRClientAsync } from "@iguhealth/client/interface";

import { Lock } from "../synchronization/interfaces.js";
import { IOCache } from "../cache/interface.js";
import { TerminologyProvider } from "../terminology/interface.js";
import { EncryptionProvider } from "../encryption/interface.js";

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
  resolveSD: (type: string) => StructureDefinition | undefined;
}
