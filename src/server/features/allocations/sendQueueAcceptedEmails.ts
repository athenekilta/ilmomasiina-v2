import { emailTemplates } from "@/features/emailTemplates/emailTemplates";
import { prisma } from "@/server/external/prisma";
import { createSignupEditUrl } from "@/server/features/userSession/service";
import {
  communicationLocale,
  localizedValue,
} from "@/server/features/localization/content";

export type QueueAcceptedNotification = {
  eventId: number;
  signupIds: string[];
};

export async function sendQueueAcceptedEmails({
  eventId,
  signupIds,
}: QueueAcceptedNotification) {
  if (signupIds.length === 0) return;

  const signups = await prisma.signup.findMany({
    where: {
      id: { in: signupIds },
      Quota: { eventId },
    },
    include: {
      identity: { select: { email: true } },
      Quota: {
        include: {
          Translations: true,
          Event: { include: { translations: true } },
        },
      },
    },
  });

  await Promise.all(
    signups
      .filter((signup) => !signup.identity.email.endsWith("@example.invalid"))
      .map(async (signup) => {
        const locale = communicationLocale(signup.communicationLocale);
        const editUrl = await createSignupEditUrl(signup.id, locale);
        await (
          await emailTemplates.eventQueueAccepted({
            locale,
            eventName: localizedValue(
              signup.Quota.Event.translations,
              locale,
              (translation) => translation.title,
            ),
            eventDate: signup.Quota.Event.date,
            signupName: signup.name,
            signupEmail: signup.identity.email,
            quotaName: localizedValue(
              signup.Quota.Translations,
              locale,
              (translation) => translation.title,
            ),
            editUrl,
          })
        ).send({
          to: { displayName: signup.name, address: signup.identity.email },
          from: "DoNotReply@athene.fi",
        });
      }),
  );
}
