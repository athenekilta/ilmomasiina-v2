import { Container, Heading } from "@react-email/components";
import { Email } from "./components/Email";

export type EventSignupEmailProps = {
  eventName: string;
  editUrl?: string;
};

const defaultProps: EventSignupEmailProps =
  process.env.NODE_ENV === "development"
    ? {
      eventName: "Test Event",
      editUrl: "http://localhost:3000/events/123/456",
    }
    : {
      eventName: "",
      editUrl: "",
    };

function getSubject(props: EventSignupEmailProps) {
  return `✅ Signup confirmed: ${props.eventName}`;
}

const EventSignupEmail = Object.assign(
  function EventSignupEmail(originalProps: EventSignupEmailProps) {
    const props = { ...defaultProps, ...originalProps };

    return (
      <Email
        title={getSubject(props)}
        preview={`Your signup for ${props.eventName} has been confirmed`}
      >
        <Heading as="h1" className="text-4xl font-bold">
          Signup Confirmed
        </Heading>
        <Container className="py-8">
          <Heading as="h2" className="text-2xl font-bold">
            {props.eventName}
          </Heading>
          <Container className="pt-4">
            <Container className="py-4">
              <Heading as="h3" className="text-lg font-bold">
                You can edit your signup using the link below:
              </Heading>
            </Container>
            <Container className="py-4">
              <a href={props.editUrl} className="text-blue-600 underline">
                {props.editUrl}
              </a>
            </Container>
          </Container>
        </Container>
      </Email>
    );
  },
  {
    getSubject,
  }
);

export default EventSignupEmail; 