import {
  Html,
  Tailwind,
  Head,
  Preview,
  Container,
  Hr,
  Text,
} from "@react-email/components";

export type EmailProps = {
  children: React.ReactNode;
  title: string;
  preview: string;
};

export function Email(props: EmailProps) {
  return (
    <Tailwind>
      <Html lang="en" dir="ltr" className="bg-white p-8">
        <Head>
          <title>{props.title}</title>
        </Head>
        <Preview>{props.preview}</Preview>
        <Container>{props.children}</Container>
        <Container className="pt-4">
          <Container className="py-4">
            <Hr />
          </Container>
          <Text className="pt-2 text-black/40">
            Do not answer this email. This email has been automatically sent by
            Ilmomasiina.
          </Text>
        </Container>
      </Html>
    </Tailwind>
  );
}
