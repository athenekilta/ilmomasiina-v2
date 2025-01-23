"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const components_1 = require("@react-email/components");
const Email_1 = require("./components/Email");
const defautlProps = process.env.NODE_ENV === "development"
    ? {
        verificationUrl: "http://localhost:3000/auth/email/verify",
    }
    : {
        verificationUrl: "",
    };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSubject(props) {
    return `📨 Verify your email`;
}
const EmailVerificationEmail = Object.assign(function EmailVerificationEmail(originalProps) {
    const props = Object.assign(Object.assign({}, defautlProps), originalProps);
    return (<Email_1.Email title={getSubject(props)} preview="Verify your email">
        <components_1.Heading as="h1" className="text-4xl font-bold">
          Welcome to Ilmomasiina
        </components_1.Heading>
        <components_1.Container className="py-8">
          <components_1.Heading as="h2" className="text-2xl font-bold">
            Verify your email
          </components_1.Heading>
          <components_1.Container className="pt-4">
            <components_1.Container className="py-4">
              <components_1.Heading as="h3" className="text-lg font-bold">
                To verify your email, click the link below.
              </components_1.Heading>
            </components_1.Container>
            <components_1.Container className="py-4">
              <a href={props.verificationUrl} className="text-blue-600 underline">
                {props.verificationUrl}
              </a>
            </components_1.Container>
          </components_1.Container>
        </components_1.Container>
      </Email_1.Email>);
}, {
    getSubject,
});
exports.default = EmailVerificationEmail;
