import { Button, Heading, Text } from "@react-email/components";
import { Email } from "./components/Email";
import {
  EventSignupDetails,
  type EventSignupDetailsProps,
} from "./components/EventSignupDetails";

export type EventQueueEmailProps = EventSignupDetailsProps & {
  editUrl?: string;
};

const defaultProps: EventQueueEmailProps = {
  eventName: "Esimerkkitapahtuma",
  eventDate: new Date("2026-09-14T15:00:00Z"),
  signupName: "Matti Meikäläinen",
  signupEmail: "matti@example.com",
  quotaName: "Jäsenet",
  editUrl: "http://localhost:3000/events/123/456",
};

function getSubject(props: EventQueueEmailProps) {
  return `Olet jonossa: ${props.eventName}`;
}

const EventQueueEmail = Object.assign(
  function EventQueueEmail(originalProps: EventQueueEmailProps) {
    const props = { ...defaultProps, ...originalProps };

    return (
      <Email
        title={getSubject(props)}
        preview={`Ilmoittautumisesi tapahtumaan ${props.eventName} on jonossa`}
      >
        <Heading as="h1" className="text-brand-dark m-0 text-3xl font-bold">
          Ilmosi on jonossa
        </Heading>
        <Text className="text-brand-dark mt-4 mb-0 text-base leading-7">
          Tapahtuman paikat ovat tällä hetkellä täynnä. Ilmoitamme sinulle
          sähköpostitse, jos saat paikan.
        </Text>

        <EventSignupDetails {...props} />

        {props.editUrl && (
          <Button
            className="bg-brand-primary mt-7 rounded-md px-6 py-3 text-center font-semibold text-white"
            href={props.editUrl}
          >
            Muokkaa ilmoa
          </Button>
        )}
      </Email>
    );
  },
  { getSubject },
);

export default EventQueueEmail;
