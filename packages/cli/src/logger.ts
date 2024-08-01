import { pino } from "pino";

const logger = pino<string>({
  transport: {
    target: process.env.NODE_ENV !== "production" ? "pino-pretty" : "",
  },
});

export default logger;
