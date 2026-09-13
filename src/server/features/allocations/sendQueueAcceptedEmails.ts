import { emailTemplates } from "@/features/emailTemplates/emailTemplates";
import { createSignupEditUrl } from "@/server/features/userSession/service";

export type QueueAcceptedNotification = {
  eventId: number;
  eventName: string;
  eventDate: Date;
  signups: Array<{
    id: string;
    name: string;
    email: string;
    quotaName: string;
  }>;
};

export async function sendQueueAcceptedEmails({
  eventName,
  eventDate,
  signups,
}: QueueAcceptedNotification) {
  if (signups.length === 0) return;

  await Promise.all(
    signups
      .filter((signup) => !signup.email.endsWith("@example.invalid"))
      .map(async (signup) => {
        const editUrl = await createSignupEditUrl(signup.id);
        await (
          await emailTemplates.eventQueueAccepted({
            eventName,
            eventDate,
            signupName: signup.name,
            signupEmail: signup.email,
            quotaName: signup.quotaName,
            editUrl,
          })
        ).send({
          to: { displayName: signup.name, address: signup.email },
          from: "DoNotReply@athene.fi",
        });
      }),
  );
}
