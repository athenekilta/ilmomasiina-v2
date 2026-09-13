import { Button, Heading, Hr, Text } from "@react-email/components";
import { Email } from "./components/Email";

export type PasswordChangeEmailProps = {
  passwordChangeUrl?: string;
};

const defaultProps: PasswordChangeEmailProps = {
  passwordChangeUrl: "http://localhost:3000/auth/password/change",
};

function getSubject() {
  return "Vaihda salasanasi";
}

export const PasswordChangeEmail = Object.assign(
  function PasswordChangeEmail(originalProps: PasswordChangeEmailProps) {
    const props = { ...defaultProps, ...originalProps };

    return (
      <Email
        title={getSubject()}
        preview="Ilmomasiina-tilillesi pyydettiin salasanan vaihtoa"
      >
        <Heading as="h1" className="text-brand-dark m-0 text-3xl font-bold">
          Salasanan vaihto
        </Heading>
        <Text className="text-brand-dark mt-4 mb-0 text-base leading-7">
          Ilmomasiina-tilillesi pyydettiin salasanan vaihtoa. Voit asettaa uuden
          salasanan alla olevasta painikkeesta.
        </Text>

        {props.passwordChangeUrl && (
          <Button
            className="bg-brand-primary mt-7 rounded-md px-6 py-3 text-center font-semibold text-white"
            href={props.passwordChangeUrl}
          >
            Vaihda salasana
          </Button>
        )}

        <Hr className="border-brand-sand mt-8 mb-0" />
        <Text className="text-brand-dark mt-6 mb-0 text-sm leading-6">
          Linkki on voimassa seitsemän päivää. Jos et pyytänyt salasanan
          vaihtoa, voit jättää tämän viestin huomiotta.
        </Text>
      </Email>
    );
  },
  { getSubject },
);

export default PasswordChangeEmail;
