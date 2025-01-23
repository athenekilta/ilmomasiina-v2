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
    return `✅ Signup confirmed: ${props.eventName}`;
}
const EventSignupEmail = Object.assign(function EventSignupEmail(originalProps) {
    const props = Object.assign(Object.assign({}, defaultProps), originalProps);
    return (<Email_1.Email title={getSubject(props)} preview={`Your signup for ${props.eventName} has been confirmed`}>
        <components_1.Heading as="h1" className="text-4xl font-bold">
          Signup Confirmed
        </components_1.Heading>
        <components_1.Container className="py-8">
          <components_1.Heading as="h2" className="text-2xl font-bold">
            {props.eventName}
          </components_1.Heading>
          <components_1.Container className="pt-4">
            <components_1.Container className="py-4">
              <components_1.Heading as="h3" className="text-lg font-bold">
                You can edit your signup using the link below:
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
exports.default = EventSignupEmail;
