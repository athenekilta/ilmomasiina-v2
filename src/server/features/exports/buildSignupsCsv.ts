import type { PrismaClient } from "@/generated/prisma/client";
import { stringify } from "csv-stringify/sync";

export async function createSignupsCsv(
  prisma: PrismaClient,
  eventId: number,
): Promise<string> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { Questions: true },
  });
  if (!event) throw new Error("Event not found");

  const signups = await prisma.signup.findMany({
    where: { Quota: { eventId } },
    orderBy: { createdAt: "asc" },
    include: {
      Quota: { select: { id: true, title: true } },
      Answers: true,
    },
  });

  const sortedQuestions = [...event.Questions].sort(
    (a, b) => a.sortId - b.sortId,
  );

  const questionHeaders = sortedQuestions.map((q) => q.question);
  const header = [
    "Järjestys",
    "Nimi",
    "Sähköposti",
    "Ilmoittautumisaika",
    "Kiintiö",
    ...questionHeaders,
  ];

  const rows = [
    header,
    ...signups.map((signup, index) => {
      const answers = sortedQuestions.map((q) => {
        const answer = signup.Answers.find((a) => a.questionId === q.id);
        return answer?.answer ?? "";
      });

      const date = new Date(signup.createdAt).toLocaleString("fi-FI");

      return [
        index + 1,
        signup.name,
        signup.email,
        date,
        signup.Quota?.title || signup.quotaId,
        ...answers,
      ];
    }),
  ];

  return stringify(rows);
}
