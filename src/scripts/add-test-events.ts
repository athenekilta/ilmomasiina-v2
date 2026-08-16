import "dotenv/config";
import { faker } from "@faker-js/faker";
import moment from "moment";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

type QuotaSeed = {
  title: string;
  size: number | null;
  /** How many signups to generate into this quota. May exceed size (queue). */
  signups: number;
};

type EventSeed = {
  title: string;
  badgeText?: string;
  badgeTone?: "GREEN" | "PINK" | "DARK";
  date: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  openQuotaSize?: number;
  description?: string;
  price?: string;
  location?: string;
  webpageUrl?: string;
  draft?: boolean;
  signupsPublic?: boolean;
  raffleEnabled?: boolean;
  raffleStartTime?: Date;
  raffleEndTime?: Date;
  raffleStatus?: "NOT_STARTED" | "REGISTRATION_OPEN" | "SIMULATING" | "COMPLETED";
  quotas: QuotaSeed[];
  questions?: {
    question: string;
    type: "text" | "textarea" | "radio" | "checkbox";
    options?: string[];
    required?: boolean;
    public?: boolean;
  }[];
};

const days = (n: number) => moment().add(n, "days").toDate();
const hours = (n: number) => moment().add(n, "hours").toDate();

/**
 * Nine events covering every state the front page can render: open, opening
 * later, already closed, full with a queue, raffle, long titles, an event
 * that already happened but is still inside the 7 day window, and a draft.
 */
const eventSeeds: EventSeed[] = [
  {
    title: "Mobiiliesa-sitsit",
    badgeText: "Vuoden haippisin",
    badgeTone: "PINK",
    date: days(14),
    registrationStartDate: days(-3),
    registrationEndDate: days(7),
    openQuotaSize: 5,
    description:
      "Perinteiset mobiiliesasitsit Smökillä. Sitsilaulut, sillis ja hyvä meininki.",
    price: "15 €",
    location: "Smökki",
    signupsPublic: true,
    quotas: [
      { title: "Eemil", size: 1, signups: 1 },
      { title: "ConstantinNopoli", size: 6, signups: 3 },
      { title: "Lukkaristo", size: 4, signups: 0 },
    ],
    questions: [
      { question: "Pöytätoive", type: "text", required: false, public: true },
      {
        question: "Erityisruokavalio",
        type: "textarea",
        required: false,
        public: false,
      },
    ],
  },
  {
    title: "Tietskari-jengi party",
    badgeText: "Märkää raivolla",
    badgeTone: "PINK",
    date: days(21),
    registrationStartDate: days(-1),
    registrationEndDate: days(12),
    openQuotaSize: 10,
    description: "Kylpylä varattu koko illaksi. Uikkarit mukaan!",
    price: "20 €",
    location: "Hervannan kylpylä",
    signupsPublic: true,
    quotas: [
      { title: "Limee", size: 12, signups: 1 },
      { title: "ristokka", size: 6, signups: 36 },
      { title: "Lukkaristo", size: 4, signups: 69 },
      { title: "JEEEJEEJEE", size: 2, signups: 455 },
    ],
  },
  {
    title: "KOUVOLA-sitsit",
    badgeText: "Pääpäivä",
    badgeTone: "DARK",
    date: days(9),
    registrationStartDate: days(-20),
    registrationEndDate: days(-2), // ilmo sulkeutunut
    openQuotaSize: 0,
    description: "Ilmoittautuminen on jo sulkeutunut, tervetuloa paikalle.",
    price: "12 €",
    location: "Zoom",
    signupsPublic: true,
    quotas: [
      { title: "ESAt", size: 4, signups: 4 },
      { title: "ASEt", size: 6, signups: 5 },
      { title: "Untot", size: null, signups: 2 },
      { title: "Skitsofreenikot", size: null, signups: 0 },
      { title: "Allan paskoo ABC:n lavuaariin", size: null, signups: 1 },
    ],
  },
  {
    title: "Tietskari jengin flamingo pulikointi päivä",
    date: days(30),
    registrationStartDate: days(5), // ilmo aukeaa vasta
    registrationEndDate: days(25),
    openQuotaSize: 8,
    description: "Ilmoittautuminen aukeaa myöhemmin. Merkkaa kalenteriin!",
    price: "0 €",
    location: "Flamingo",
    signupsPublic: true,
    quotas: [
      { title: "Esa", size: 15, signups: 0 },
      { title: "Prodeko", size: 15, signups: 0 },
      { title: "Lukkaristo", size: 4, signups: 0 },
    ],
  },
  {
    title: "ESA-sitsit",
    date: days(3),
    registrationStartDate: days(-30),
    registrationEndDate: days(-10),
    openQuotaSize: 0,
    description: "Loppuunmyyty klassikko.",
    price: "18 €",
    location: "Smökki",
    signupsPublic: false,
    quotas: [{ title: "Kaikki", size: 30, signups: 30 }],
  },
  {
    title: "Arvontasitsit 2026",
    badgeText: "Arpa ratkaisee",
    badgeTone: "GREEN",
    date: days(18),
    registrationStartDate: days(-2),
    registrationEndDate: days(10),
    openQuotaSize: 0,
    description:
      "Paikat arvotaan ilmoittautuneiden kesken. Arvonta alkaa ilmoittautumisajan päätyttyä.",
    price: "25 €",
    location: "Ilmatorjuntamuseo",
    signupsPublic: true,
    raffleEnabled: true,
    raffleStartTime: hours(2),
    raffleEndTime: hours(4),
    raffleStatus: "REGISTRATION_OPEN",
    quotas: [
      { title: "Fuksit", size: 20, signups: 14 },
      { title: "Vanhemmat opiskelijat", size: 10, signups: 9 },
    ],
  },
  {
    title:
      "ConstantinNoPolinAppropriateOfCaribbeanRoyalPalaceOfVersaillesinPuutarhanHoitolaitosHuoltajanVuosijuhlat",
    date: days(45),
    registrationStartDate: days(-5),
    registrationEndDate: days(40),
    openQuotaSize: 3,
    description:
      "Tapahtuma pitkillä nimillä, jotta korttien tekstin katkaisu tulee testattua.",
    price: "1 000 000 €",
    location:
      "Erittäin pitkä paikannimi joka ei mahdu yhdelle riville millään näytöllä",
    signupsPublic: true,
    quotas: [
      {
        title:
          "ConstantinNoPolinAppropriateOfCaribbeanRoyalPalaceOfVersaillesinPuutarhanHoitoLaitosHuoltaja",
        size: 6,
        signups: 3,
      },
      { title: "aitosHuoltaja", size: 4, signups: 0 },
    ],
  },
  {
    title: "Huomisen aamukahvit",
    badgeText: "Nyt tai ei koskaan",
    badgeTone: "DARK",
    date: days(1),
    registrationStartDate: days(-7),
    registrationEndDate: hours(20),
    openQuotaSize: 5,
    description: "Ilmo sulkeutuu tänään — hyvä testi 'sulkeutuu pian' -tilalle.",
    price: "",
    location: "Kahvihuone",
    signupsPublic: true,
    quotas: [{ title: "Kahvinjuojat", size: 25, signups: 18 }],
  },
  {
    title: "Menneet sitsit (3 pv sitten)",
    date: days(-3),
    registrationStartDate: days(-20),
    registrationEndDate: days(-6),
    openQuotaSize: 0,
    description:
      "Tapahtuma on jo ollut, mutta näkyy vielä 7 vuorokauden ajan etusivulla.",
    price: "10 €",
    location: "Smökki",
    signupsPublic: true,
    quotas: [{ title: "Osallistujat", size: 12, signups: 12 }],
  },
];

async function addTestEvents() {
  // Poistetaan vain aiemmin tällä skriptillä luodut tapahtumat, jotta
  // skriptin voi ajaa uudestaan ilman duplikaatteja.
  const titles = eventSeeds.map((e) => e.title);
  const existing = await prisma.event.findMany({
    where: { title: { in: titles } },
    select: { id: true },
  });
  const existingIds = existing.map((e) => e.id);

  if (existingIds.length > 0) {
    const quotas = await prisma.quota.findMany({
      where: { eventId: { in: existingIds } },
      select: { id: true },
    });
    const quotaIds = quotas.map((q) => q.id);

    await prisma.answer.deleteMany({
      where: { Signup: { quotaId: { in: quotaIds } } },
    });
    await prisma.signup.deleteMany({ where: { quotaId: { in: quotaIds } } });
    await prisma.question.deleteMany({ where: { eventId: { in: existingIds } } });
    await prisma.quota.deleteMany({ where: { eventId: { in: existingIds } } });
    await prisma.raffleSimulation.deleteMany({
      where: { eventId: { in: existingIds } },
    });
    await prisma.event.deleteMany({ where: { id: { in: existingIds } } });

    console.log(`Poistettiin ${existingIds.length} aiempaa testitapahtumaa`);
  }

  for (const seed of eventSeeds) {
    const { quotas, questions, ...eventData } = seed;

    const event = await prisma.event.create({
      data: {
        ...eventData,
        openQuotaSize: eventData.openQuotaSize ?? 0,
        draft: eventData.draft ?? false,
        verificationEmail: "Kiitos ilmoittautumisesta! Nähdään tapahtumassa.",
      },
    });

    const createdQuestions = questions?.length
      ? await Promise.all(
          questions.map((q, i) =>
            prisma.question.create({
              data: {
                eventId: event.id,
                sortId: i + 1,
                question: q.question,
                type: q.type,
                options: q.options ?? [],
                required: q.required ?? false,
                public: q.public ?? false,
              },
            }),
          ),
        )
      : [];

    for (const [i, quotaSeed] of quotas.entries()) {
      const quota = await prisma.quota.create({
        data: {
          eventId: event.id,
          sortId: i + 1,
          title: quotaSeed.title,
          size: quotaSeed.size,
        },
      });

      for (let s = 0; s < quotaSeed.signups; s++) {
        const signup = await prisma.signup.create({
          data: {
            quotaId: quota.id,
            originalQuotaId: quota.id,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            completedAt: moment()
              .subtract(faker.number.int({ min: 1, max: 5000 }), "minutes")
              .toDate(),
            status: "CONFIRMED",
          },
        });

        for (const question of createdQuestions) {
          await prisma.answer.create({
            data: {
              questionId: question.id,
              signupId: signup.id,
              answer: faker.lorem.words({ min: 1, max: 5 }),
            },
          });
        }
      }
    }

    const signupTotal = quotas.reduce((sum, q) => sum + q.signups, 0);
    console.log(
      `✓ ${event.title} (id ${event.id}) — ${quotas.length} kiintiötä, ${signupTotal} ilmoittautumista`,
    );
  }

  console.log(`\nLuotiin ${eventSeeds.length} testitapahtumaa.`);
}

addTestEvents()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
