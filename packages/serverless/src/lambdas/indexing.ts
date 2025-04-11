import { indexingHandler } from "@iguhealth/server/consumer/handlers";

import createHandler from "./createHandler.js";

export const handler = await createHandler(indexingHandler);
