import { faker } from "@faker-js/faker";
import moment from "moment";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

async function createFakeData() {
  // Clear existing data
  await prisma.answer.deleteMany({});
  await prisma.signup.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quota.deleteMany({});
  await prisma.event.deleteMany({});

  // Create Event
  const event = await prisma.event.create({
    data: {
      date: moment().subtract(3, "days").toDate(),
      registrationStartDate: moment().subtract(10, "days").toDate(),
      registrationEndDate: moment().subtract(5, "days").toDate(),
      price: "",
      location: "Smökki (Jämeräntaival 4, Espoo)",
      draft: false,
      signupsPublic: true,
      translations: {
        create: {
          locale: "fi",
          title: "Minuuttikalja 2024",
          description:
            "Legendaarinen wappufiiliksen pikakohottaja, Minuuttikalja",
          verificationEmail: faker.lorem.paragraphs(),
        },
      },
    },
  });

  console.log("Event record", event);

  // Create Quota
  const quotaRecord = await prisma.quota.create({
    data: {
      eventId: event.id,
      sortId: 1,
      size: 20,
      Translations: {
        create: { locale: "fi", title: "Minuuttikalja 2024" },
      },
    },
  });
  console.log("Quota record", quotaRecord);

  const questionRecord = await prisma.question.create({
    data: {
      id: "fake-data-table-request",
      eventId: event.id,
      sortId: 1,
      type: "text",
      required: true,
      public: false,
      Translations: {
        create: { locale: "fi", question: "Pöytätoive" },
      },
    },
  });

  console.log(questionRecord);
  const createdQuestions = await prisma.question.findMany({
    where: { eventId: event.id },
  });

  const createdQuotas = await prisma.quota.findMany({
    where: { eventId: event.id },
  });

  // Create Signups and Answers dynamically based on Quotas

  for (const quota of createdQuotas) {
    const size = quota.size || 0;

    for (let i = 0; i < size; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email().trim().toLowerCase();
      const identity = await prisma.identity.upsert({
        where: { email },
        update: {},
        create: { email, name },
      });
      const signup = await prisma.signup.create({
        data: {
          quotaId: quota.id, // Link to the correct quota ID
          originalQuotaId: quota.id,
          name,
          identityId: identity.id,
          completedAt: moment().subtract(1, "minutes").toDate(),
          status: "CONFIRMED",
        },
      });

      // Create Answers for each Signup
      for (const question of createdQuestions) {
        await prisma.answer.create({
          data: {
            questionId: question.id,
            signupId: signup.id,
            textValue: faker.lorem.sentence(),
          },
        });
      }
    }
  }

  console.log("Fake data inserted successfully");
}

createFakeData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
