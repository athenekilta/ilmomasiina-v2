"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = Email;
const components_1 = require("@react-email/components");
function Email(props) {
    return (<components_1.Tailwind>
      <components_1.Html lang="en" dir="ltr" className="bg-white p-8">
        <components_1.Head>
          <title>{props.title}</title>
        </components_1.Head>
        <components_1.Preview>{props.preview}</components_1.Preview>
        <components_1.Container>{props.children}</components_1.Container>
        <components_1.Container className="pt-4">
          <components_1.Container className="py-4">
            <components_1.Hr />
          </components_1.Container>
          <components_1.Text className="pt-2 text-black/40">
            Do not answer this email. This email has been automatically sent by
            Ilmomasiina.
          </components_1.Text>
        </components_1.Container>
      </components_1.Html>
    </components_1.Tailwind>);
}
