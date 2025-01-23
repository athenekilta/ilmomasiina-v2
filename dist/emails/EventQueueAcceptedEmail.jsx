"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const components_1 = require("@react-email/components");
const Email_1 = require("./components/Email");
const defaultProps = process.env.NODE_ENV === "development"
    ? {
        eventName: "Test Event",
        editUrl: "http://localhost:3000/events/123/456",
    }
    : {
        eventName: "",
        editUrl: "",
    };
function getSubject(props) {
    return `✅ Moved from queue: ${props.eventName}`;
}
const EventQueueAcceptedEmail = Object.assign(function EventQueueAcceptedEmail(originalProps) {
    const props = Object.assign(Object.assign({}, defaultProps), originalProps);
    return (<Email_1.Email title={getSubject(props)} preview={`A spot has opened up for you in ${props.eventName}`}>
        <components_1.Heading as="h1" className="text-4xl font-bold">
          Spot Available!
        </components_1.Heading>
        <components_1.Container className="py-8">
          <components_1.Heading as="h2" className="text-2xl font-bold">
            {props.eventName}
          </components_1.Heading>
          <components_1.Container className="pt-4">
            <components_1.Container className="py-4">
              <p className="text-base leading-relaxed text-black/70">
                Good news! A spot has opened up and you have been moved from the queue to the confirmed participants list.
              </p>
            </components_1.Container>
            <components_1.Container className="py-4">
              <components_1.Heading as="h3" className="text-lg font-bold">
                You can view your signup details using the link below:
              </components_1.Heading>
            </components_1.Container>
            <components_1.Container className="py-4">
              <a href={props.editUrl} className="text-blue-600 underline">
                {props.editUrl}
              </a>
            </components_1.Container>
          </components_1.Container>
        </components_1.Container>
      </Email_1.Email>);
}, {
    getSubject,
});
exports.default = EventQueueAcceptedEmail;
