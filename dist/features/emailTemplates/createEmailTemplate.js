"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmailTemplate = createEmailTemplate;
const components_1 = require("@react-email/components");
const react_1 = require("react");
const communication_email_1 = require("@azure/communication-email");
const server_mjs_1 = require("@/env/server.mjs");
const connectionString = `endpoint=https://ilmomasiina.europe.communication.azure.com/;accesskey=${server_mjs_1.env.MAIL_API_KEY}`;
const client = new communication_email_1.EmailClient(connectionString);
function createEmailTemplate(EmailComponent) {
    return async function instantiateEmail(props) {
        const element = (0, react_1.createElement)(EmailComponent, props);
        const html = await (0, components_1.render)(element, { pretty: true });
        const text = await (0, components_1.render)(element, { plainText: true });
        const subject = EmailComponent.getSubject(props);
        function send(options) {
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
