import createServer from "./server.js";

const server = await createServer();
const listener = server.listen(3000);
