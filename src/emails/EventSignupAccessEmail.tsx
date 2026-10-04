import { Button, Heading, Text } from "@react-email/components";
import { Email } from "./components/Email";
import { getTranslations } from "@/i18n/messages";
import { emailMessages } from "@/i18n/messages/emails";
import {
  EventSignupDetails,
  type EventSignupDetailsProps,
} from "./components/EventSignupDetails";

export type EventSignupAccessEmailProps = EventSignupDetailsProps & {
  editUrl: string;
};

function getSubject(props: EventSignupAccessEmailProps) {
  return getTranslations(emailMessages, props.locale).eventSignupAccess.subject(
    props.eventName,
  );
}

const EventSignupAccessEmail = Object.assign(
  function EventSignupAccessEmail(props: EventSignupAccessEmailProps) {
    const messages = getTranslations(
      emailMessages,
      props.locale,
    ).eventSignupAccess;

    return (
      <Email
        locale={props.locale}
        title={getSubject(props)}
        preview={messages.preview(props.eventName)}
      >
        <Heading as="h1" className="text-brand-dark m-0 text-3xl font-bold">
          {messages.heading}
        </Heading>
        <Text className="text-brand-dark mt-4 mb-0 text-base leading-7">
          {messages.body}
        </Text>

        <EventSignupDetails {...props} />

        <Button
          className="bg-brand-primary mt-7 rounded-md px-6 py-3 text-center font-semibold text-white"
          href={props.editUrl}
        >
          {messages.button}
        </Button>
      </Email>
    );
  },
  { getSubject },
);

export default EventSignupAccessEmail;
