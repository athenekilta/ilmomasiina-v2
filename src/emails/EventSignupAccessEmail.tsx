import { Container, Heading } from "@react-email/components";
import { Email } from "./components/Email";

export type EventSignupAccessEmailProps = {
  eventName: string;
  editUrl: string;
};

function getSubject(props: EventSignupAccessEmailProps) {
  return `Signup access: ${props.eventName}`;
}

const EventSignupAccessEmail = Object.assign(
  function EventSignupAccessEmail(props: EventSignupAccessEmailProps) {
    return (
      <Email
        title={getSubject(props)}
        preview={`Continue or edit your signup for ${props.eventName}`}
      >
        <Heading as="h1" className="text-4xl font-bold">
          Your signup link
        </Heading>
        <Container className="py-8">
          <Heading as="h2" className="text-2xl font-bold">
            {props.eventName}
          </Heading>
          <Container className="pt-4">
            <Heading as="h3" className="text-lg font-bold">
              Continue or edit your signup using the link below:
            </Heading>
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
  { getSubject },
);

export default EventSignupAccessEmail;
