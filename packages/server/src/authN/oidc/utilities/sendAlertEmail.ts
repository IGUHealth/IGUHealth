import { EmailProvider } from "../../../email/interface.js";

export async function sendAlertEmail(
  emailProvider: EmailProvider | undefined,
  subject: string,
  text: string,
): Promise<boolean> {
  if (!process.env.EMAIL_FROM || !emailProvider) {
    return false;
  }

  await emailProvider.sendEmail({
    from: process.env.EMAIL_FROM as string,
    to: process.env.EMAIL_FROM as string,
    subject,
    text,
  });

  return true;
}
