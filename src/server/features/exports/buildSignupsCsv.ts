import type { PrismaClient } from "@/generated/prisma/client";
import { stringify } from "csv-stringify/sync";
import { nativeDate } from "@/utils/nativeDate";
import { localizedValue } from "../localization/content";

export async function createSignupsCsv(
  prisma: PrismaClient,
  eventId: number,
): Promise<string> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      Questions: {
        include: { Translations: true },
      },
    },
  });
  if (!event) throw new Error("Event not found");

  const signups = await prisma.signup.findMany({
    where: { Quota: { eventId } },
    orderBy: { createdAt: "asc" },
    include: {
      Quota: { include: { Translations: true } },
      Answers: {
        include: {
          Selections: {
            include: {
              Option: {
                include: { Translations: true },
              },
            },
          },
        },
      },
      identity: { select: { email: true } },
    },
  });

  const sortedQuestions = [...event.Questions].sort(
    (a, b) => a.sortId - b.sortId,
  );
  const questionHeaders = sortedQuestions.map((question) =>
    localizedValue(
      question.Translations,
      "fi",
      (translation) => translation.question,
    ),
  );
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
      const answers = sortedQuestions.map((question) => {
        const answer = signup.Answers.find(
          (candidate) => candidate.questionId === question.id,
        );
        if (!answer) return "";
        if (answer.textValue !== null) return answer.textValue;
        return [...answer.Selections]
          .sort((a, b) => a.Option.sortId - b.Option.sortId)
          .map((selection) =>
            localizedValue(
              selection.Option.Translations,
              "fi",
              (translation) => translation.label,
            ),
          )
          .join("\n");
      });

      return [
        index + 1,
        signup.name,
        signup.identity.email,
        nativeDate.stringify(new Date(signup.createdAt)),
        localizedValue(
          signup.Quota.Translations,
          "fi",
          (translation) => translation.title,
        ) || signup.quotaId,
        ...answers,
      ];
    }),
  ];

  return stringify(rows);
}
