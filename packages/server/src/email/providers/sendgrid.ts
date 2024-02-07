import { MailService } from "@sendgrid/mail";

import { HTTPResponse } from "../../fhir-http/index.js";
import { Email, EmailProvider } from "../interface.js";

export default class SendGrid implements EmailProvider {
  private sendgridClient: MailService;
  constructor(_sendgridAPIKey: string) {
    const sendgridClient = new MailService();
    sendgridClient.setApiKey(_sendgridAPIKey);
    this.sendgridClient = sendgridClient;
  }
  async sendEmail(email: Email): Promise<HTTPResponse> {
    const response = (await this.sendgridClient.send(email))[0];

    const httpResponse = {
      status: response.statusCode,
      body: response.body,
      headers: response.headers,
    };

    console.log(httpResponse);
    return httpResponse;
  }
}
