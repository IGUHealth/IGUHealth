import { ConfigProvider } from "../../../config/provider/interface.js";
import { EmailProvider } from "../../../email/interface.js";

export async function sendAlertEmail(
  config: ConfigProvider,
  emailProvider: EmailProvider | undefined,
  subject: string,
  text: string,
): Promise<boolean> {
  if (!(await config.get("EMAIL_FROM")) || !emailProvider) {
    return false;
  }

  await emailProvider.sendEmail({
    from: (await config.get("EMAIL_FROM")) as string,
    to: (await config.get("EMAIL_FROM")) as string,
    subject,
    text,
  });

  return true;
}
