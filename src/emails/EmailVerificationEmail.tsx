import { Button, Heading, Text } from "@react-email/components";
import { Email } from "./components/Email";

export type EmailVerificationEmailProps = {
  verificationUrl?: string;
};

const defaultProps: EmailVerificationEmailProps = {
  verificationUrl: "http://localhost:3000/auth/email/verify",
};

function getSubject() {
  return "Vahvista sähköpostiosoitteesi";
}

const EmailVerificationEmail = Object.assign(
  function EmailVerificationEmail(originalProps: EmailVerificationEmailProps) {
    const props = { ...defaultProps, ...originalProps };

    return (
      <Email
        title={getSubject()}
        preview="Vahvista Ilmomasiina-tilisi sähköpostiosoite"
      >
        <Heading as="h1" className="text-brand-dark m-0 text-3xl font-bold">
          Vahvista sähköpostiosoitteesi
        </Heading>
        <Text className="text-brand-dark mt-4 mb-0 text-base leading-7">
          Viimeistele Ilmomasiina-tilisi käyttöönotto vahvistamalla
          sähköpostiosoitteesi.
        </Text>

        {props.verificationUrl && (
          <Button
            className="bg-brand-secondary mt-7 rounded-md px-6 py-3 text-center font-semibold text-white"
            href={props.verificationUrl}
          >
            Vahvista sähköpostiosoite
          </Button>
        )}

        <Text className="text-brand-dark mt-7 mb-0 text-sm leading-6">
          Jos et ole luonut tiliä, voit jättää tämän viestin huomiotta.
        </Text>
      </Email>
    );
  },
  { getSubject },
);

export default EmailVerificationEmail;
