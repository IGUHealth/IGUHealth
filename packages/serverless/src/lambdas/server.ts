import serverless from "serverless-http";

import createServer from "@iguhealth/server";

const server = await createServer();
const _handler = serverless(server);

export const handler: serverless.Handler = (event: object, context: object) => {
  return _handler(event, context);
};
