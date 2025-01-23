import { render } from "@react-email/components";
import { createElement } from "react";
import { EmailClient } from "@azure/communication-email";
import { env } from "@/env/server.mjs";

const connectionString = `endpoint=https://ilmomasiina.europe.communication.azure.com/;accesskey=${env.MAIL_API_KEY}`;
const client = new EmailClient(connectionString);

export function createEmailTemplate<Props extends object>(
  EmailComponent: ((props: Props) => JSX.Element) & {
    getSubject(props: Props): string;
  }
) {
  return async function instantiateEmail(props: Props) {
    const element = createElement(EmailComponent, props) as unknown as JSX.Element;
    const html = await render(element, { pretty: true });
    const text = await render(element, { plainText: true });
    const subject = EmailComponent.getSubject(props);

    function send(options: {
      to:
        | { address: string; displayName?: string }
        | Array<{ address: string; displayName?: string }>;
      from: string;
      sendAt?: Date;
      replyTo?: string;
    }) {
      return Array.isArray(options.to)
        ? client.beginSend({
          senderAddress: options.from,
          content: {
            subject,
            plainText: text,
            html,
          },
          recipients: {
            to: options.to,
          },
        })
        : client.beginSend({
          senderAddress: options.from,
          content: {
            subject,
            plainText: text,
            html,
          },
          recipients: { to: [options.to] },
        });
    }
    return { html, text, subject, send };
  };
}
