import { ClientApplication } from "@iguhealth/fhir-types/r4/types";

import { ConfigProvider } from "../../../config/provider/interface.js";
import { ADMIN_APP } from "./admin-app.js";
import { PUBLIC_APP } from "./public-app.js";
import { SYSTEM_APP } from "./system-app.js";
import { WORKER_APP } from "./worker-app.js";

export default function getHardCodedClients(
  config: ConfigProvider,
): ClientApplication[] {
  return [ADMIN_APP(config), SYSTEM_APP, WORKER_APP, PUBLIC_APP].filter(
    (v): v is ClientApplication => v !== undefined,
  );
}
