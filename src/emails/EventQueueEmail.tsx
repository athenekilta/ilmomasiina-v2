import { Container, Heading } from "@react-email/components";
import { Email } from "./components/Email";

export type EventQueueEmailProps = {
  eventName: string;
  editUrl?: string;
};

const defaultProps: EventQueueEmailProps =
  process.env.NODE_ENV === "development"
    ? {
      eventName: "Test Event",
      editUrl: "http://localhost:3000/events/123/456",
    }
    : {
      eventName: "",
      editUrl: "",
    };

function getSubject(props: EventQueueEmailProps) {
  return `⏳ Queue position: ${props.eventName}`;
}

const EventQueueEmail = Object.assign(
  function EventQueueEmail(originalProps: EventQueueEmailProps) {
    const props = { ...defaultProps, ...originalProps };

    return (
      <Email
        title={getSubject(props)}
        preview={`You have been placed in queue for ${props.eventName}`}
      >
        <Heading as="h1" className="text-4xl font-bold">
          Queue Position
        </Heading>
        <Container className="py-8">
          <Heading as="h2" className="text-2xl font-bold">
            {props.eventName}
          </Heading>
          <Container className="pt-4">
            <Container className="py-4">
              <p className="text-base leading-relaxed text-black/70">
                You have been placed in the queue for this event. If a spot becomes available, you will be notified via email.
              </p>
            </Container>
            <Container className="py-4">
              <Heading as="h3" className="text-lg font-bold">
                You can check your queue status using the link below:
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

export default EventQueueEmail; 