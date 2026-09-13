import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
} from "@react-email/components";
import tailwindConfig from "../../../tailwind.config.cjs";

const emailTailwindConfig = {
  theme: tailwindConfig.theme,
};

export type EmailProps = {
  children: React.ReactNode;
  title: string;
  preview: string;
};

export function Email(props: EmailProps) {
  return (
    <Tailwind config={emailTailwindConfig}>
      <Html lang="fi" dir="ltr">
        <Head>
          <title>{props.title}</title>
        </Head>
        <Preview>{props.preview}</Preview>
        <Body className="bg-brand-beige text-brand-dark m-0 px-4 py-8 font-sans">
          <Container className="border-brand-sand bg-brand-light mx-auto max-w-xl overflow-hidden rounded-xl border border-solid">
            <Section className="bg-brand-primary h-2" />
            <Section className="px-6 py-8 sm:px-10">{props.children}</Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
