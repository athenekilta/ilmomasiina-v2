"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordChangeEmail = void 0;
const components_1 = require("@react-email/components");
const Email_1 = require("./components/Email");
const defautlProps = process.env.NODE_ENV === "development"
    ? {
        passwordChangeUrl: "http://localhost:3000/auth/password/change",
    }
    : {
        passwordChangeUrl: "",
    };
function getSubject() {
    return `🔒 Change your password`;
}
exports.PasswordChangeEmail = Object.assign(function PasswordChangeEmail(originalProps) {
    const props = Object.assign(Object.assign({}, defautlProps), originalProps);
    return (<Email_1.Email title={getSubject()} preview="A password change request has been made">
        <components_1.Heading as="h1" className="text-4xl font-bold">
          Change your password
        </components_1.Heading>

        <components_1.Container className="py-8">
          <components_1.Text className="text-base leading-relaxed text-black/70">
            A password change link was requested for your account. You can
            change your password from the link below or by opening the link{" "}
            <components_1.Link className="underline" href={props.passwordChangeUrl}>
              {props.passwordChangeUrl}
            </components_1.Link>{" "}
            directly.
          </components_1.Text>

          <div className="h-8"/>

          <components_1.Button className="rounded-lg bg-brand px-6 py-4 font-semibold text-white" href={props.passwordChangeUrl}>
            Change your password
          </components_1.Button>
        </components_1.Container>

        <components_1.Hr />

        <components_1.Text className="pt-8 text-black/60">
          This link is active for 7 days, after which it will stop working. If
          the link expires, you can get a new link by visiting the application.
        </components_1.Text>
      </Email_1.Email>);
}, {
    getSubject,
});
exports.default = exports.PasswordChangeEmail;
