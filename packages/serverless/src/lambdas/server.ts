import serverless from "serverless-http";

import createServer from "@iguhealth/server";

const server = await createServer();
const _handler = serverless(server);

export const handler: serverless.Handler = async (
  event: object,
  context: object,
) => {
  const response = await _handler(event, context);
  console.log("Response:", response);
  return response;
};
