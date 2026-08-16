import { emailTemplates } from "@/features/emailTemplates/emailTemplates";

export type QueueAcceptedNotification = {
  eventId: number;
  eventName: string;
  signups: Array<{ id: string; name: string; email: string }>;
};

export async function sendQueueAcceptedEmails({
  eventId,
  eventName,
  signups,
}: QueueAcceptedNotification) {
  if (signups.length === 0) return;

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const nextAuthUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  await Promise.all(
    signups
      .filter((signup) => !signup.email.endsWith("@example.invalid"))
      .map(async (signup) => {
        const editUrl = `${nextAuthUrl}events/${eventId}/${signup.id}`;
        await (
          await emailTemplates.eventQueueAccepted({ eventName, editUrl })
        ).send({
          to: { displayName: signup.name, address: signup.email },
          from: "DoNotReply@athene.fi",
        });
      }),
  );
}
