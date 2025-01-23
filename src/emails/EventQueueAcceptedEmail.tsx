import { Container, Heading } from "@react-email/components";
import { Email } from "./components/Email";

export type EventQueueAcceptedEmailProps = {
  eventName: string;
  editUrl?: string;
};

const defaultProps: EventQueueAcceptedEmailProps =
  process.env.NODE_ENV === "development"
    ? {
      eventName: "Test Event",
      editUrl: "http://localhost:3000/events/123/456",
    }
    : {
      eventName: "",
      editUrl: "",
    };

function getSubject(props: EventQueueAcceptedEmailProps) {
  return `✅ Moved from queue: ${props.eventName}`;
}

const EventQueueAcceptedEmail = Object.assign(
  function EventQueueAcceptedEmail(originalProps: EventQueueAcceptedEmailProps) {
    const props = { ...defaultProps, ...originalProps };

    return (
      <Email
        title={getSubject(props)}
        preview={`A spot has opened up for you in ${props.eventName}`}
      >
        <Heading as="h1" className="text-4xl font-bold">
          Spot Available!
        </Heading>
        <Container className="py-8">
          <Heading as="h2" className="text-2xl font-bold">
            {props.eventName}
          </Heading>
          <Container className="pt-4">
            <Container className="py-4">
              <p className="text-base leading-relaxed text-black/70">
                Good news! A spot has opened up and you have been moved from the queue to the confirmed participants list.
              </p>
            </Container>
            <Container className="py-4">
              <Heading as="h3" className="text-lg font-bold">
                You can view your signup details using the link below:
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

export default EventQueueAcceptedEmail; 