import { Section, Text } from "@react-email/components";
import { formatEventDateTime } from "@/utils/format";

export type EventSignupDetailsProps = {
  eventName: string;
  eventDate: Date | string;
  signupName: string;
  signupEmail: string;
  quotaName: string;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Text className="text-brand-dark m-0 px-4 py-3 text-sm last:border-b-0">
      <span className="text-brand-dark font-semibold">{label}:</span> {value}
    </Text>
  );
}

export function EventSignupDetails(props: EventSignupDetailsProps) {
  return (
    <>
      <Text className="text-brand-secondary mt-6 mb-2 text-xs font-bold tracking-wide uppercase">
        Tapahtuma
      </Text>
      <Section className="border-brand-sand bg-brand-light overflow-hidden rounded-lg border border-solid">
        <DetailRow label="Nimi" value={props.eventName} />
        <DetailRow
          label="Ajankohta"
          value={formatEventDateTime(props.eventDate)}
        />
      </Section>

      <Text className="text-brand-secondary mt-6 mb-2 text-xs font-bold tracking-wide uppercase">
        Ilmo
      </Text>
      <Section className="border-brand-sand bg-brand-light overflow-hidden rounded-lg border border-solid">
        <DetailRow label="Nimi" value={props.signupName} />
        <DetailRow label="Sähköposti" value={props.signupEmail} />
        <DetailRow label="Kiintiö" value={props.quotaName} />
      </Section>
    </>
  );
}
