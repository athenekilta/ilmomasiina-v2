import { Button, Heading, Hr, Text } from "@react-email/components";
import { Email } from "./components/Email";
import type { Locale } from "@/i18n/config";
import { getTranslations } from "@/i18n/messages";
import { emailMessages } from "@/i18n/messages/emails";

export type PasswordChangeEmailProps = {
  locale: Locale;
  passwordChangeUrl?: string;
};

const defaultProps: Omit<PasswordChangeEmailProps, "locale"> = {
  passwordChangeUrl: "http://localhost:3000/auth/password/change",
};

function getSubject(props: PasswordChangeEmailProps) {
  return getTranslations(emailMessages, props.locale).passwordChange.subject;
}

export const PasswordChangeEmail = Object.assign(
  function PasswordChangeEmail(originalProps: PasswordChangeEmailProps) {
    const props = { ...defaultProps, ...originalProps };
    const messages = getTranslations(
      emailMessages,
      props.locale,
    ).passwordChange;

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

        {props.passwordChangeUrl && (
          <Button
            className="bg-brand-primary mt-7 rounded-md px-6 py-3 text-center font-semibold text-white"
            href={props.passwordChangeUrl}
          >
            {messages.button}
          </Button>
        )}

        <Hr className="border-brand-sand mt-8 mb-0" />
        <Text className="text-brand-dark mt-6 mb-0 text-sm leading-6">
          {messages.notice}
        </Text>
      </Email>
    );
  },
  { getSubject },
);

export default PasswordChangeEmail;
