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
  /**
   * Signups waiting for a place rather than holding one. The event router
   * gathers these into the queue quota, so this is what puts a figure on the
   * "Jonossa" line.
   */
  waitlisted?: number;
  /**
   * Whether this quota may take from the event's jokeripaikat (extraCapacity)
   * once its own places run out — right away, only after registration closes,
   * or never. Defaults to NEVER, same as the admin form.
   */
  sharedPlaces?: "NEVER" | "IMMEDIATE" | "AFTER_REGISTRATION_CLOSE";
};

type EventSeed = {
  title: string;
  badgeText?: string;
  badgeTone?: "GREEN" | "PINK" | "DARK";
  date: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  /** Jokeripaikat: places outside every quota, shared by the quotas allowed to use them. */
  extraCapacity?: number;
  description?: string;
  price?: string;
  location?: string;
  webpageUrl?: string;
  draft?: boolean;
  signupsPublic?: boolean;
  quotas: QuotaSeed[];
  questions?: {
    id: string;
    question: string;
    type: "text" | "textarea" | "radio" | "checkbox";
    options?: { id: string; label: string }[];
    required?: boolean;
    public?: boolean;
  }[];
};

const days = (n: number) => moment().add(n, "days").toDate();
const hours = (n: number) => moment().add(n, "hours").toDate();

/**
 * Thirteen events covering every state the front page can render: open, opening
 * later, already closed, full with a queue, long titles, and an event
 * that already happened but is still inside the 7 day window.
 *
 * Every date is relative to the moment the script runs, so re-running it is
 * what refreshes "closes in 3 days" and friends — the rows themselves go
 * stale as real time passes.
 */
const eventSeeds: EventSeed[] = [
  {
    title: "Mobiiliesa-sitsit",
    badgeText: "Vuoden haippisin",
    badgeTone: "PINK",
    date: days(14),
    registrationStartDate: days(-3),
    registrationEndDate: days(7),
    extraCapacity: 5,
    description:
      "Perinteiset mobiiliesasitsit Smökillä. Sitsilaulut, sillis ja hyvä meininki.",
    price: "15 €",
    location: "Smökki",
    signupsPublic: true,
    // One event that exercises all three jokeripaikka policies at once.
    quotas: [
      { title: "Eemil", size: 1, signups: 1, sharedPlaces: "IMMEDIATE" },
      {
        title: "ConstantinNopoli",
        size: 6,
        signups: 3,
        sharedPlaces: "AFTER_REGISTRATION_CLOSE",
      },
      { title: "Lukkaristo", size: 4, signups: 0 },
      { title: "Muut", size: 0, signups: 2, sharedPlaces: "IMMEDIATE" },
    ],
    questions: [
      {
        id: "test-mobiiliesa-table-request",
        question: "Pöytätoive",
        type: "text",
        required: false,
        public: false,
      },
      {
        id: "test-mobiiliesa-diet",
        question: "Erityisruokavalio",
        type: "textarea",
        required: false,
        public: false,
      },
      {
        id: "test-mobiiliesa-afterparty",
        question: "Osallistutko jatkoille?",
        type: "radio",
        options: [
          { id: "test-mobiiliesa-afterparty-yes", label: "Kyllä" },
          { id: "test-mobiiliesa-afterparty-no", label: "Ei" },
        ],
        required: false,
        public: true,
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
    extraCapacity: 10,
    description: "Kylpylä varattu koko illaksi. Uikkarit mukaan!",
    price: "20 €",
    location: "Hervannan kylpylä",
    signupsPublic: true,
    quotas: [
      { title: "Athene", size: 30, signups: 30, sharedPlaces: "IMMEDIATE" },
      { title: "Tietokilta", size: 20, signups: 18, sharedPlaces: "IMMEDIATE" },
      { title: "Lukkaristo", size: 6, signups: 4 },
      // Avoin kaikille muille: ei omia paikkoja, vain nappi avoimeen.
      {
        title: "Muut",
        size: 0,
        signups: 14,
        sharedPlaces: "IMMEDIATE",
        waitlisted: 20,
      },
    ],
  },
  {
    title: "KOUVOLA-sitsit",
    badgeText: "Pääpäivä",
    badgeTone: "DARK",
    date: days(9),
    registrationStartDate: days(-20),
    registrationEndDate: days(-2), // ilmo sulkeutunut
    extraCapacity: 0,
    description: "Ilmo on jo sulkeutunut, tervetuloa paikalle.",
    price: "12 €",
    location: "Zoom",
    signupsPublic: true,
    quotas: [
      { title: "Athene", size: 24, signups: 24 },
      { title: "Muut killat", size: 12, signups: 9 },
      // Yksi rajaton kiintiö riittää sen tilan testaamiseen.
      { title: "Alumnit", size: null, signups: 3 },
    ],
  },
  {
    title: "Tietskari jengin flamingo pulikointi päivä",
    date: days(30),
    registrationStartDate: days(5), // ilmo aukeaa vasta
    registrationEndDate: days(25),
    extraCapacity: 8,
    description: "Ilmo aukeaa myöhemmin. Merkkaa kalenteriin!",
    price: "0 €",
    location: "Flamingo",
    signupsPublic: true,
    quotas: [
      { title: "Athene", size: 15, signups: 0, sharedPlaces: "IMMEDIATE" },
      { title: "Prodeko", size: 15, signups: 0, sharedPlaces: "IMMEDIATE" },
      { title: "Lukkaristo", size: 4, signups: 0 },
      { title: "Muut", size: 0, signups: 0, sharedPlaces: "IMMEDIATE" },
    ],
  },
  {
    title: "ESA-sitsit",
    date: days(3),
    registrationStartDate: days(-30),
    registrationEndDate: days(-10),
    extraCapacity: 0,
    description: "Loppuunmyyty klassikko.",
    price: "18 €",
    location: "Smökki",
    signupsPublic: false,
    quotas: [{ title: "Kaikki", size: 30, signups: 30 }],
  },
  {
    title: "Suositut sitsit 2026",
    badgeText: "Paikkoja rajoitetusti",
    badgeTone: "DARK",
    date: days(18),
    registrationStartDate: days(-2),
    registrationEndDate: days(10),
    extraCapacity: 6,
    description:
      "Fuksikiintiö on täynnä, mutta avoimissa paikoissa on vielä tilaa.",
    price: "25 €",
    location: "Ilmatorjuntamuseo",
    signupsPublic: true,
    quotas: [
      { title: "Fuksit", size: 20, signups: 20, sharedPlaces: "IMMEDIATE" },
      {
        title: "Vanhemmat opiskelijat",
        size: 10,
        signups: 9,
        sharedPlaces: "IMMEDIATE",
      },
      // Sama kiintiötyyppi kuin muiden tapahtumien "Muut", mutta nimi on
      // tapahtuman oma: vuosikurssi-ilmossa se on tämä. Siksi palkin nimi ei
      // voi tulla kiintiöltä.
      {
        title: "Muut vuosikurssit",
        size: 0,
        signups: 0,
        sharedPlaces: "IMMEDIATE",
      },
    ],
  },
  {
    title:
      "ConstantinNoPolinAppropriateOfCaribbeanRoyalPalaceOfVersaillesinPuutarhanHoitolaitosHuoltajanVuosijuhlat",
    date: days(45),
    registrationStartDate: days(-5),
    registrationEndDate: days(40),
    extraCapacity: 3,
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
        sharedPlaces: "AFTER_REGISTRATION_CLOSE",
      },
      { title: "aitosHuoltaja", size: 4, signups: 0 },
      {
        title: "Ulkopuolinen osallistuja",
        size: 0,
        signups: 2,
        sharedPlaces: "IMMEDIATE",
      },
    ],
  },
  {
    title: "Huomisen aamukahvit",
    badgeText: "Baristo",
    badgeTone: "DARK",
    date: days(1),
    registrationStartDate: days(-7),
    registrationEndDate: hours(20),
    extraCapacity: 5,
    description:
      "Ilmo sulkeutuu tänään — hyvä testi 'sulkeutuu pian' -tilalle.",
    price: "",
    location: "Kahvihuone",
    signupsPublic: true,
    quotas: [
      {
        title: "Kahvinjuojat",
        size: 25,
        signups: 18,
        sharedPlaces: "IMMEDIATE",
      },
    ],
  },
  /* Three events that exist to exercise the quota bars rather than the front
     page: the states that are hard to reach by accident are quotas that are
     nearly full, shared places that are nearly gone, and a full quota whose
     members can still get in through the shared ones. */
  {
    title: "Jokeripaikat: kiintiöt loppumassa",
    date: days(21),
    registrationStartDate: days(-2),
    registrationEndDate: days(9),
    extraCapacity: 14,
    location: "Otaniemi",
    description:
      "Molemmissa kiintiöissä on enää muutama oma paikka jäljellä, mutta yhteisiä paikkoja on runsaasti.",
    quotas: [
      { title: "Athene", size: 40, signups: 37, sharedPlaces: "IMMEDIATE" },
      { title: "Prodeko", size: 40, signups: 38, sharedPlaces: "IMMEDIATE" },
      { title: "Muut", size: 0, signups: 0, sharedPlaces: "IMMEDIATE" },
    ],
  },
  {
    title: "Jokeripaikat: yhteisiä enää pari",
    date: days(14),
    registrationStartDate: days(-4),
    registrationEndDate: days(3),
    extraCapacity: 10,
    location: "Otaniemi",
    description:
      "Molemmat kiintiöt ovat täynnä ja yli, joten yhteisistä paikoista on enää kaksi jäljellä.",
    quotas: [
      { title: "Athene", size: 40, signups: 44, sharedPlaces: "IMMEDIATE" },
      { title: "Prodeko", size: 40, signups: 44, sharedPlaces: "IMMEDIATE" },
    ],
  },
  {
    title: "Jokeripaikat: kaikki täynnä, jono käynnissä",
    date: days(18),
    registrationStartDate: days(-6),
    registrationEndDate: days(2),
    extraCapacity: 12,
    location: "Otaniemi",
    description:
      "Kiintiöt ja yhteiset paikat ovat kaikki täynnä, joten uudet ilmot menevät jonoon.",
    quotas: [
      {
        title: "Athene",
        size: 40,
        signups: 46,
        waitlisted: 7,
        sharedPlaces: "IMMEDIATE",
      },
      {
        title: "Prodeko",
        size: 40,
        signups: 46,
        waitlisted: 5,
        sharedPlaces: "IMMEDIATE",
      },
    ],
  },
  {
    title: "Jokeripaikat: neljä kiintiötä",
    date: days(28),
    registrationStartDate: days(-1),
    registrationEndDate: days(12),
    extraCapacity: 25,
    location: "Otaniemi",
    description:
      "Athene on täynnä mutta pääsee yhä avoimiin paikkoihin. Lukkarit ei pääse, joten sen rivi päättyy omaan palkkiinsa. Muut-kiintiöllä ei ole omia paikkoja lainkaan.",
    quotas: [
      { title: "Athene", size: 40, signups: 49, sharedPlaces: "IMMEDIATE" },
      { title: "Prodeko", size: 40, signups: 24, sharedPlaces: "IMMEDIATE" },
      { title: "Lukkarit ja valokuvaajat", size: 6, signups: 4 },
      // Kiintiö ilman omia paikkoja: se on olemassa vain nappina, josta
      // ilmotaan suoraan avoimeen. Ei omaa palkkia, koska ei omia paikkoja.
      { title: "Muut", size: 0, signups: 5, sharedPlaces: "IMMEDIATE" },
    ],
  },
  {
    title: "Menneet sitsit (3 pv sitten)",
    date: days(-3),
    registrationStartDate: days(-20),
    registrationEndDate: days(-6),
    extraCapacity: 0,
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
    where: {
      translations: {
        some: { locale: "fi", title: { in: titles } },
      },
    },
    select: {
      id: true,
      translations: {
        where: { locale: "fi", title: { in: titles } },
        select: { title: true },
      },
    },
  });
  const existingIds = existing.map((e) => e.id);
  // Keep each event's id across runs: re-seeding is how the dates are
  // refreshed, and an id that moved would leave every open tab, bookmark and
  // pasted link pointing at an event that no longer exists.
  const idByTitle = new Map<string, number>();
  for (const event of existing) {
    const title = event.translations[0]?.title;
    if (title) idByTitle.set(title, event.id);
  }

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
    await prisma.question.deleteMany({
      where: { eventId: { in: existingIds } },
    });
    await prisma.quota.deleteMany({ where: { eventId: { in: existingIds } } });

    console.log(`Tyhjennettiin ${existingIds.length} aiempaa testitapahtumaa`);
  }

  for (const seed of eventSeeds) {
    const { title, badgeText, description, quotas, questions, ...eventData } =
      seed;
    const data = {
      ...eventData,
      extraCapacity: eventData.extraCapacity ?? 0,
      draft: eventData.draft ?? false,
    };
    const translation = {
      title,
      badgeText: badgeText ?? null,
      description: description ?? null,
      verificationEmail: "Kiitos ilmoittautumisesta! Nähdään tapahtumassa.",
    };
    const existingId = idByTitle.get(title);

    const event = existingId
      ? await prisma.event.update({
          where: { id: existingId },
          data: {
            ...data,
            translations: {
              updateMany: {
                where: { locale: "fi" },
                data: translation,
              },
            },
          },
        })
      : await prisma.event.create({
          data: {
            ...data,
            translations: {
              create: { locale: "fi", ...translation },
            },
          },
        });

    const createdQuestions = questions?.length
      ? await Promise.all(
          questions.map((q, i) =>
            prisma.question.create({
              data: {
                id: q.id,
                eventId: event.id,
                sortId: i + 1,
                type: q.type,
                required: q.required ?? false,
                public: q.public ?? false,
                Translations: {
                  create: { locale: "fi", question: q.question },
                },
                Options: {
                  create: (q.options ?? []).map((option, optionIndex) => ({
                    id: option.id,
                    sortId: optionIndex + 1,
                    Translations: {
                      create: { locale: "fi", label: option.label },
                    },
                  })),
                },
              },
              include: { Options: { orderBy: { sortId: "asc" } } },
            }),
          ),
        )
      : [];

    for (const [i, quotaSeed] of quotas.entries()) {
      const quota = await prisma.quota.create({
        data: {
          eventId: event.id,
          sortId: i + 1,
          size: quotaSeed.size,
          sharedPlacesAllocation: quotaSeed.sharedPlaces ?? "NEVER",
          Translations: {
            create: { locale: "fi", title: quotaSeed.title },
          },
        },
      });

      const confirmed = quotaSeed.signups;
      const waitlisted = quotaSeed.waitlisted ?? 0;
      for (let s = 0; s < confirmed + waitlisted; s++) {
        const name = faker.person.fullName();
        const email = faker.internet.email().trim().toLowerCase();
        const identity = await prisma.identity.upsert({
          where: { email },
          update: {},
          create: { email, name },
        });
        const signup = await prisma.signup.create({
          data: {
            quotaId: quota.id,
            originalQuotaId: quota.id,
            name,
            identityId: identity.id,
            completedAt: moment()
              .subtract(faker.number.int({ min: 1, max: 5000 }), "minutes")
              .toDate(),
            status: s < confirmed ? "CONFIRMED" : "WAITLISTED",
          },
        });

        for (const question of createdQuestions) {
          const isChoice =
            question.type === "radio" || question.type === "checkbox";
          const selectedOptions = isChoice
            ? question.type === "radio"
              ? question.Options.slice(0, 1)
              : question.Options.slice(0, 2)
            : [];
          await prisma.answer.create({
            data: {
              questionId: question.id,
              signupId: signup.id,
              textValue: isChoice
                ? null
                : faker.lorem.words({ min: 1, max: 5 }),
              Selections: {
                create: selectedOptions.map((option) => ({
                  optionId: option.id,
                })),
              },
            },
          });
        }
      }
    }

    const signupTotal = quotas.reduce((sum, q) => sum + q.signups, 0);
    console.log(
      `✓ ${title} (id ${event.id}) — ${quotas.length} kiintiötä, ${signupTotal} ilmoittautumista`,
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
