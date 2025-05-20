import { EmailProvider } from "./interface.js";
import SendGrid from "./providers/sendgrid.js";

export default function createEmailProvider(): EmailProvider | undefined {
  switch (config.get("EMAIL_PROVIDER")) {
    case "sendgrid": {
      if (!config.get("EMAIL_SENDGRID_API_KEY"))
        throw new Error("EMAIL_SENDGRID_API_KEY not set");
      return new SendGrid(config.get("EMAIL_SENDGRID_API_KEY") as string);
    }
    default:
      return undefined;
  }
}
