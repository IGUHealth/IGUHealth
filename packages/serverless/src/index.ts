import serverless from "serverless-http";

import createServer from "@iguhealth/server";

const server = await createServer();
export const handler = serverless(server);
