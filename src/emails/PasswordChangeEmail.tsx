import {
  Button,
  Container,
  Heading,
  Hr,
  Link,
  Text,
} from "@react-email/components";
import { Email } from "./components/Email";

export type PasswordChangeEmailProps = {
  passwordChangeUrl?: string;
};

const defautlProps: PasswordChangeEmailProps =
  process.env.NODE_ENV === "development"
    ? {
      passwordChangeUrl: "http://localhost:3000/auth/password/change",
    }
    : {
      passwordChangeUrl: "",
    };

function getSubject() {
  return `🔒 Change your password`;
}

export const PasswordChangeEmail = Object.assign(
  function PasswordChangeEmail(originalProps: PasswordChangeEmailProps) {
    const props = { ...defautlProps, ...originalProps };

    return (
      <Email
        title={getSubject()}
        preview="A password change request has been made"
      >
        <Heading as="h1" className="text-4xl font-bold">
          Change your password
        </Heading>

        <Container className="py-8">
          <Text className="text-base leading-relaxed text-black/70">
            A password change link was requested for your account. You can
            change your password from the link below or by opening the link{" "}
            <Link className="underline" href={props.passwordChangeUrl}>
              {props.passwordChangeUrl}
            </Link>{" "}
            directly.
          </Text>

          <div className="h-8" />

          <Button
            className="rounded-lg bg-brand px-6 py-4 font-semibold text-white"
            href={props.passwordChangeUrl}
          >
            Change your password
          </Button>
        </Container>

        <Hr />

        <Text className="pt-8 text-black/60">
          This link is active for 7 days, after which it will stop working. If
          the link expires, you can get a new link by visiting the application.
        </Text>
      </Email>
    );
  },
  {
    getSubject,
  }
);

export default PasswordChangeEmail;
