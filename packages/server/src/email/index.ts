import { ConfigProvider } from "../config/provider/interface.js";
import { EmailProvider } from "./interface.js";
import SendGrid from "./providers/sendgrid.js";

export default async function createEmailProvider(
  config: ConfigProvider,
): Promise<EmailProvider | undefined> {
  switch (await config.get("EMAIL_PROVIDER")) {
    case "sendgrid": {
      if (!(await config.get("EMAIL_SENDGRID_API_KEY")))
        throw new Error("EMAIL_SENDGRID_API_KEY not set");
      return new SendGrid(
        (await config.get("EMAIL_SENDGRID_API_KEY")) as string,
      );
    }
    default:
      return undefined;
  }
}
