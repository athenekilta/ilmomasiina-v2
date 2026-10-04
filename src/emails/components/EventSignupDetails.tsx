import { Section, Text } from "@react-email/components";
import { appTimeZone, intlLocale, type Locale } from "@/i18n/config";
import { getTranslations } from "@/i18n/messages";
import { emailMessages } from "@/i18n/messages/emails";

export type EventSignupDetailsProps = {
  locale: Locale;
  eventName: string;
  eventDate: Date | string;
  signupName: string;
  signupEmail: string;
  quotaName: string;
};

function formatEventDateTime(value: Date | string, locale: Locale) {
  const formatted = new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone: appTimeZone,
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

  return locale === "fi"
    ? formatted.charAt(0).toUpperCase() + formatted.slice(1)
    : formatted;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Text className="text-brand-dark m-0 px-4 py-3 text-sm last:border-b-0">
      <span className="text-brand-dark font-semibold">{label}:</span> {value}
    </Text>
  );
}

export function EventSignupDetails(props: EventSignupDetailsProps) {
  const messages = getTranslations(emailMessages, props.locale).details;

  return (
    <>
      <Text className="text-brand-secondary mt-6 mb-2 text-xs font-bold tracking-wide uppercase">
        {messages.event}
      </Text>
      <Section className="border-brand-sand bg-brand-light overflow-hidden rounded-lg border border-solid">
        <DetailRow label={messages.name} value={props.eventName} />
        <DetailRow
          label={messages.dateTime}
          value={formatEventDateTime(props.eventDate, props.locale)}
        />
      </Section>

      <Text className="text-brand-secondary mt-6 mb-2 text-xs font-bold tracking-wide uppercase">
        {messages.signup}
      </Text>
      <Section className="border-brand-sand bg-brand-light overflow-hidden rounded-lg border border-solid">
        <DetailRow label={messages.name} value={props.signupName} />
        <DetailRow label={messages.email} value={props.signupEmail} />
        <DetailRow label={messages.quota} value={props.quotaName} />
      </Section>
    </>
  );
}
