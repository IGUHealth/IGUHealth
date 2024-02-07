import { HTTPResponse } from "../fhir-http/index.js";

export type Email = {
  to: string;
  from: string;
  subject?: string;
} & EmailContent;

type EmailContent = { text: string } | { html: string };

export interface EmailProvider {
  sendEmail: (email: Email) => Promise<HTTPResponse>;
}
