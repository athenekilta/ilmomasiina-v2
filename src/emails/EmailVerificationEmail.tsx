import { Container, Heading } from "@react-email/components";
import { Email } from "./components/Email";

export type EmailVerificationEmailProps = {
  verificationUrl?: string;
};

const defautlProps: EmailVerificationEmailProps =
  process.env.NODE_ENV === "development"
    ? {
      verificationUrl: "http://localhost:3000/auth/email/verify",
    }
    : {
      verificationUrl: "",
    };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSubject(props: EmailVerificationEmailProps) {
  return `📨 Verify your email`;
}

const EmailVerificationEmail = Object.assign(
  function EmailVerificationEmail(originalProps: EmailVerificationEmailProps) {
    const props = { ...defautlProps, ...originalProps };

    return (
      <Email title={getSubject(props)} preview="Verify your email">
        <Heading as="h1" className="text-4xl font-bold">
          Welcome to Ilmomasiina
        </Heading>
        <Container className="py-8">
          <Heading as="h2" className="text-2xl font-bold">
            Verify your email
          </Heading>
          <Container className="pt-4">
            <Container className="py-4">
              <Heading as="h3" className="text-lg font-bold">
                To verify your email, click the link below.
              </Heading>
            </Container>
            <Container className="py-4">
              <a
                href={props.verificationUrl}
                className="text-blue-600 underline"
              >
                {props.verificationUrl}
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

export default EmailVerificationEmail;
