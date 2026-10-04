import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/I18nProvider";
import { layoutMessages } from "@/i18n/messages/layout";

type EmailPreview = {
  id: string;
  name: string;
  locale: Locale;
  subject: string;
  html: string;
};

type EmailPreviewPageProps = {
  previews: EmailPreview[];
};

export default function EmailPreviewPage({
  previews = [],
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const messages = useTranslations(layoutMessages).emailPreview;
  const [selectedId, setSelectedId] = useState("");
  const selectedPreview =
    previews.find((preview) => preview.id === selectedId) ?? previews[0];

  return (
    <>
      <PageHead title={messages.title} />
      <Layout>
        <header className="mb-5">
          <p className="text-brand-primary mb-1 text-xs font-bold tracking-widest uppercase">
            {messages.developmentOnly}
          </p>
          <h1 className="text-brand-dark text-2xl font-bold">
            {messages.title}
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            {messages.description}
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <nav
            aria-label={messages.templates}
            className="surface-panel h-fit p-2"
          >
            {previews.map((preview) => {
              const isSelected = preview.id === selectedPreview?.id;

              return (
                <button
                  key={preview.id}
                  type="button"
                  aria-pressed={isSelected}
                  className={`w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? "bg-brand-darkgreen font-semibold text-white"
                      : "text-brand-dark hover:bg-brand-beige"
                  }`}
                  onClick={() => setSelectedId(preview.id)}
                >
                  {preview.name}
                </button>
              );
            })}
          </nav>

          {selectedPreview ? (
            <section className="min-w-0" aria-live="polite">
              <div className="surface-panel mb-3 px-4 py-3">
                <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
                  {messages.subject} ({selectedPreview.locale.toUpperCase()})
                </p>
                <p className="text-brand-dark mt-1 font-medium">
                  {selectedPreview.subject}
                </p>
              </div>
              <iframe
                key={selectedPreview.id}
                title={messages.previewTitle(selectedPreview.name)}
                srcDoc={selectedPreview.html}
                sandbox=""
                className="h-208 w-full rounded-xl border border-stone-300 bg-white shadow-sm"
              />
            </section>
          ) : (
            <div className="surface-panel p-6 text-sm text-stone-600">
              {messages.unavailable}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  EmailPreviewPageProps
> = async () => {
  if (process.env.NODE_ENV !== "development") {
    return { notFound: true };
  }

  const [
    { render },
    { createElement },
    { default: EmailVerificationEmail },
    { default: EventQueueAcceptedEmail },
    { default: EventQueueEmail },
    { default: EventSignupAccessEmail },
    { default: EventSignupEmail },
    { default: PasswordChangeEmail },
  ] = await Promise.all([
    import("@react-email/components"),
    import("react"),
    import("@/emails/EmailVerificationEmail"),
    import("@/emails/EventQueueAcceptedEmail"),
    import("@/emails/EventQueueEmail"),
    import("@/emails/EventSignupAccessEmail"),
    import("@/emails/EventSignupEmail"),
    import("@/emails/PasswordChangeEmail"),
  ]);

  const previewLocales: Locale[] = ["fi", "en"];
  const eventPropsByLocale = {
    fi: {
      locale: "fi",
      eventName: "Syysretki Nuuksioon",
      eventDate: new Date("2026-09-24T14:30:00Z"),
      signupName: "Matti Meikäläinen",
      signupEmail: "matti.meikalainen@example.com",
      quotaName: "Athenen jäsenet",
      editUrl: "http://localhost:3000/events/42/signup-123",
    },
    en: {
      locale: "en",
      eventName: "Autumn trip to Nuuksio",
      eventDate: new Date("2026-09-24T14:30:00Z"),
      signupName: "Matthew Example",
      signupEmail: "matthew.example@example.com",
      quotaName: "Athene members",
      editUrl: "http://localhost:3000/events/42/signup-123",
    },
  } satisfies Record<
    Locale,
    {
      locale: Locale;
      eventName: string;
      eventDate: Date;
      signupName: string;
      signupEmail: string;
      quotaName: string;
      editUrl: string;
    }
  >;
  const templateNames = {
    fi: {
      eventSignup: "Vahvistettu ilmo",
      eventQueue: "Jonopaikka",
      eventQueueAccepted: "Jonosta hyväksytty",
      eventSignupAccess: "Ilmoittautumislinkki",
      emailVerification: "Sähköpostin vahvistus",
      passwordChange: "Salasanan vaihto",
    },
    en: {
      eventSignup: "Confirmed registration",
      eventQueue: "Waiting list",
      eventQueueAccepted: "Accepted from waiting list",
      eventSignupAccess: "Registration link",
      emailVerification: "Email verification",
      passwordChange: "Password change",
    },
  } satisfies Record<Locale, Record<string, string>>;

  const definitions = previewLocales.flatMap((locale) => {
    const eventProps = eventPropsByLocale[locale];
    const names = templateNames[locale];
    const emailVerificationProps = {
      locale,
      verificationUrl: "http://localhost:3000/auth/email/verify?token=preview",
    };
    const passwordChangeProps = {
      locale,
      passwordChangeUrl:
        "http://localhost:3000/auth/password/change?token=preview",
    };

    return [
      {
        id: `${locale}-event-signup`,
        name: `${locale.toUpperCase()} – ${names.eventSignup}`,
        locale,
        subject: EventSignupEmail.getSubject(eventProps),
        element: createElement(EventSignupEmail, eventProps),
      },
      {
        id: `${locale}-event-queue`,
        name: `${locale.toUpperCase()} – ${names.eventQueue}`,
        locale,
        subject: EventQueueEmail.getSubject(eventProps),
        element: createElement(EventQueueEmail, eventProps),
      },
      {
        id: `${locale}-event-queue-accepted`,
        name: `${locale.toUpperCase()} – ${names.eventQueueAccepted}`,
        locale,
        subject: EventQueueAcceptedEmail.getSubject(eventProps),
        element: createElement(EventQueueAcceptedEmail, eventProps),
      },
      {
        id: `${locale}-event-signup-access`,
        name: `${locale.toUpperCase()} – ${names.eventSignupAccess}`,
        locale,
        subject: EventSignupAccessEmail.getSubject(eventProps),
        element: createElement(EventSignupAccessEmail, eventProps),
      },
      {
        id: `${locale}-email-verification`,
        name: `${locale.toUpperCase()} – ${names.emailVerification}`,
        locale,
        subject: EmailVerificationEmail.getSubject(emailVerificationProps),
        element: createElement(EmailVerificationEmail, emailVerificationProps),
      },
      {
        id: `${locale}-password-change`,
        name: `${locale.toUpperCase()} – ${names.passwordChange}`,
        locale,
        subject: PasswordChangeEmail.getSubject(passwordChangeProps),
        element: createElement(PasswordChangeEmail, passwordChangeProps),
      },
    ];
  });

  const rendered = await Promise.all(
    definitions.map((definition) =>
      render(definition.element, { pretty: true }),
    ),
  );

  return {
    props: {
      previews: definitions.map((definition, index) => ({
        id: definition.id,
        name: definition.name,
        locale: definition.locale,
        subject: definition.subject,
        html: rendered[index] ?? "",
      })),
    },
  };
};
