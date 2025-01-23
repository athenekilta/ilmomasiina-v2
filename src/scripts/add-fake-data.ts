import { faker } from "@faker-js/faker";
import moment from "moment";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createFakeData() {
  // Clear existing data
  await prisma.answer.deleteMany({});
  await prisma.signup.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quota.deleteMany({});
  await prisma.event.deleteMany({});

  // Create Events
  const events = [
    {
      title: "Minuuttikalja 2024",
      date: moment().subtract(3, "days").toDate(),
      registrationStartDate: moment().subtract(10, "days").toDate(),
      registrationEndDate: moment().subtract(5, "days").toDate(),
      description: "Legendaarinen wappufiiliksen pikakohottaja, Minuuttikalja",
      price: "",
      location: "Smökki (Jämeräntaival 4, Espoo)",
      draft: false,
      verificationEmail: faker.lorem.paragraphs(),
      signupsPublic: true,
    },
    // Add more events as needed
  ];

  const eventRecords = await prisma.event.createMany({ data: events });

  console.log("Event records", eventRecords);

  const createdEvents = await prisma.event.findMany();
  const event = createdEvents[0];
  // Create Quotas
  const quotas = [
    {
      eventId: event?.id || 1,
      sortId: 1,
      title: "Minuuttikalja 2024",
      size: 20,
    },
    // Add more quotas as needed
  ];

  const quotaRecords = await prisma.quota.createMany({ data: quotas });
  console.log("Quota records", quotaRecords);
  
  const questionRecords = await prisma.question.createMany({
    data: [
      {
        eventId: event?.id || 1,
        sortId: 1,
        type: "text",
        question: "Pöytätoive",
        required: true,
        public: false,
      },
    ],
  });

  console.log(questionRecords);
  const createdQuestions = await prisma.question.findMany({
    where: {
      eventId: event?.id || 1,
    },
  });

  const createdQuotas = await prisma.quota.findMany({
    where: {
      eventId: event?.id || 1,
    },
  });

  // Create Signups and Answers dynamically based on Quotas

  for (const quota of createdQuotas) {
    const size = quota.size || 0;

    for (let i = 0; i < size; i++) {
      const signup = await prisma.signup.create({
        data: {
          quotaId: quota.id, // Link to the correct quota ID
          name: faker.person.fullName(),
          email: faker.internet.email(),
          confirmedAt: moment().subtract(1, "minutes").toDate(),
        },
      });

      // Create Answers for each Signup
      for (const question of createdQuestions) {
        await prisma.answer.create({
          data: {
            questionId: question.id,
            signupId: signup.id,
            answer: faker.lorem.sentence(),
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
