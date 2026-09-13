import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

type EmailPreview = {
  id: string;
  name: string;
  subject: string;
  html: string;
};

type EmailPreviewPageProps = {
  previews: EmailPreview[];
};

export default function EmailPreviewPage({
  previews = [],
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [selectedId, setSelectedId] = useState("");
  const selectedPreview =
    previews.find((preview) => preview.id === selectedId) ?? previews[0];

  return (
    <>
      <PageHead title="Sähköpostien esikatselu" />
      <Layout>
        <header className="mb-5">
          <p className="text-brand-primary mb-1 text-xs font-bold tracking-widest uppercase">
            Vain kehitysympäristössä
          </p>
          <h1 className="text-brand-dark text-2xl font-bold">
            Sähköpostien esikatselu
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Esimerkkitiedot eivät lähetä sähköpostia tai käytä tietokantaa.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <nav
            aria-label="Sähköpostipohjat"
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
                  Aihe
                </p>
                <p className="text-brand-dark mt-1 font-medium">
                  {selectedPreview.subject}
                </p>
              </div>
              <iframe
                key={selectedPreview.id}
                title={`${selectedPreview.name} -esikatselu`}
                srcDoc={selectedPreview.html}
                sandbox=""
                className="h-208 w-full rounded-xl border border-stone-300 bg-white shadow-sm"
              />
            </section>
          ) : (
            <div className="surface-panel p-6 text-sm text-stone-600">
              Esikatseluita ei voitu ladata.
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

  const eventProps = {
    eventName: "Syysretki Nuuksioon",
    eventDate: new Date("2026-09-24T14:30:00Z"),
    signupName: "Matti Meikäläinen",
    signupEmail: "matti.meikalainen@example.com",
    quotaName: "Athenen jäsenet",
    editUrl: "http://localhost:3000/events/42/signup-123",
  };

  const definitions = [
    {
      id: "event-signup",
      name: "Vahvistettu ilmo",
      subject: EventSignupEmail.getSubject(eventProps),
      element: createElement(EventSignupEmail, eventProps),
    },
    {
      id: "event-queue",
      name: "Jonopaikka",
      subject: EventQueueEmail.getSubject(eventProps),
      element: createElement(EventQueueEmail, eventProps),
    },
    {
      id: "event-queue-accepted",
      name: "Jonosta hyväksytty",
      subject: EventQueueAcceptedEmail.getSubject(eventProps),
      element: createElement(EventQueueAcceptedEmail, eventProps),
    },
    {
      id: "event-signup-access",
      name: "Ilmoittautumislinkki",
      subject: EventSignupAccessEmail.getSubject(eventProps),
      element: createElement(EventSignupAccessEmail, eventProps),
    },
    {
      id: "email-verification",
      name: "Sähköpostin vahvistus",
      subject: EmailVerificationEmail.getSubject(),
      element: createElement(EmailVerificationEmail, {
        verificationUrl:
          "http://localhost:3000/auth/email/verify?token=preview",
      }),
    },
    {
      id: "password-change",
      name: "Salasanan vaihto",
      subject: PasswordChangeEmail.getSubject(),
      element: createElement(PasswordChangeEmail, {
        passwordChangeUrl:
          "http://localhost:3000/auth/password/change?token=preview",
      }),
    },
  ];

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
        subject: definition.subject,
        html: rendered[index] ?? "",
      })),
    },
  };
};
