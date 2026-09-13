import { Button, Heading, Text } from "@react-email/components";
import { Email } from "./components/Email";
import {
  EventSignupDetails,
  type EventSignupDetailsProps,
} from "./components/EventSignupDetails";

export type EventSignupAccessEmailProps = EventSignupDetailsProps & {
  editUrl: string;
};

function getSubject(props: EventSignupAccessEmailProps) {
  return `Muokkaa ilmoittautumistasi: ${props.eventName}`;
}

const EventSignupAccessEmail = Object.assign(
  function EventSignupAccessEmail(props: EventSignupAccessEmailProps) {
    return (
      <Email
        title={getSubject(props)}
        preview={`Linkki tapahtuman ${props.eventName} ilmoittautumiseen`}
      >
        <Heading as="h1" className="text-brand-dark m-0 text-3xl font-bold">
          Ilmolinkkisi
        </Heading>
        <Text className="text-brand-dark mt-4 mb-0 text-base leading-7">
          Avaa ilmosi alta olevasta painikkeesta.
        </Text>

        <EventSignupDetails {...props} />

        <Button
          className="bg-brand-primary mt-7 rounded-md px-6 py-3 text-center font-semibold text-white"
          href={props.editUrl}
        >
          Muokkaa ilmoa
        </Button>
      </Email>
    );
  },
  { getSubject },
);

export default EventSignupAccessEmail;
