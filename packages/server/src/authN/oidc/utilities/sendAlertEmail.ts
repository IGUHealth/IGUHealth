import { EmailProvider } from "../../../email/interface.js";

export async function sendAlertEmail(
  emailProvider: EmailProvider | undefined,
  subject: string,
  text: string,
): Promise<boolean> {
  if (!config.get("EMAIL_FROM") || !emailProvider) {
    return false;
  }

  await emailProvider.sendEmail({
    from: config.get("EMAIL_FROM") as string,
    to: config.get("EMAIL_FROM") as string,
    subject,
    text,
  });

  return true;
}
