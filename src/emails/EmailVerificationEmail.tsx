import { Button, Heading, Text } from "@react-email/components";
import { Email } from "./components/Email";
import type { Locale } from "@/i18n/config";
import { getTranslations } from "@/i18n/messages";
import { emailMessages } from "@/i18n/messages/emails";

export type EmailVerificationEmailProps = {
  locale: Locale;
  verificationUrl?: string;
};

const defaultProps: Omit<EmailVerificationEmailProps, "locale"> = {
  verificationUrl: "http://localhost:3000/auth/email/verify",
};

function getSubject(props: EmailVerificationEmailProps) {
  return getTranslations(emailMessages, props.locale).emailVerification.subject;
}

const EmailVerificationEmail = Object.assign(
  function EmailVerificationEmail(originalProps: EmailVerificationEmailProps) {
    const props = { ...defaultProps, ...originalProps };
    const messages = getTranslations(
      emailMessages,
      props.locale,
    ).emailVerification;

    return (
      <Email
        locale={props.locale}
        title={getSubject(props)}
        preview={messages.preview}
      >
        <Heading as="h1" className="text-brand-dark m-0 text-3xl font-bold">
          {messages.heading}
        </Heading>
        <Text className="text-brand-dark mt-4 mb-0 text-base leading-7">
          {messages.body}
        </Text>

        {props.verificationUrl && (
          <Button
            className="bg-brand-primary mt-7 rounded-md px-6 py-3 text-center font-semibold text-white"
            href={props.verificationUrl}
          >
            {messages.button}
          </Button>
        )}

        <Text className="text-brand-dark mt-7 mb-0 text-sm leading-6">
          {messages.ignore}
        </Text>
      </Email>
    );
  },
  { getSubject },
);

export default EmailVerificationEmail;
