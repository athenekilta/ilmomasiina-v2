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
    return `⏳ Queue position: ${props.eventName}`;
}
const EventQueueEmail = Object.assign(function EventQueueEmail(originalProps) {
    const props = Object.assign(Object.assign({}, defaultProps), originalProps);
    return (<Email_1.Email title={getSubject(props)} preview={`You have been placed in queue for ${props.eventName}`}>
        <components_1.Heading as="h1" className="text-4xl font-bold">
          Queue Position
        </components_1.Heading>
        <components_1.Container className="py-8">
          <components_1.Heading as="h2" className="text-2xl font-bold">
            {props.eventName}
          </components_1.Heading>
          <components_1.Container className="pt-4">
            <components_1.Container className="py-4">
              <p className="text-base leading-relaxed text-black/70">
                You have been placed in the queue for this event. If a spot becomes available, you will be notified via email.
              </p>
            </components_1.Container>
            <components_1.Container className="py-4">
              <components_1.Heading as="h3" className="text-lg font-bold">
                You can check your queue status using the link below:
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
exports.default = EventQueueEmail;
