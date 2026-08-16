/**
 * Additive test-data seed for the radical events grid prototype.
 *
 * Unlike `add-fake-data.ts`, this NEVER deletes anything — it only inserts
 * new events, tagged with TEST_EVENT_PREFIX, so it's safe to run against a
 * shared dev database. Pair with `unseed-radical-events.ts` to remove them
 * again.
 *
 * Covers the shapes the grid needs to demonstrate: several events with
 * registration open at once (multiple simultaneous "hero" squares), one
 * closing within hours (urgency badge), a next-upcoming event whose
 * registration hasn't opened yet, a content-rich event that earns "hero"
 * without being promoted, a draft, a zero-quota minimal event, a
 * long-title stress test, and a spread of plain small-square events.
 */
import dotenv from "dotenv";

dotenv.config();

import { faker } from "@faker-js/faker";
import moment from "moment";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { TEST_EVENT_PREFIX } from "./radical-events-shared";

// Built standalone (rather than importing the app's shared `prisma` client)
// so this script never pulls in the app's env/client validation module,
// which throws on missing NEXT_PUBLIC_* vars that a one-off script has no
// business requiring.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type QuotaSeed = { title: string; size: number | null; signups?: number };

type EventSeed = {
  title: string;
  date: moment.Moment;
  registrationStart: moment.Moment;
  registrationEnd: moment.Moment;
  description?: string;
  location?: string;
  draft?: boolean;
  quotas?: QuotaSeed[];
};

const now = moment();

const eventSeeds: EventSeed[] = [
  // --- Several events open for registration right now: should all become
  //     "hero" squares simultaneously, clustered together by the grid. ---
  {
    title: "Kevätkauden avajaisbileet",
    date: now.clone().add(5, "days").hour(18).minute(0),
    registrationStart: now.clone().subtract(2, "days"),
    registrationEnd: now.clone().add(3, "days"),
    description:
      "Avataan kevätkausi tyylillä — livemusiikkia, tanssia ja yllätysvieraita koko illaksi.",
    location: "Otaniemi, Dipoli",
    quotas: [
      { title: "Jäsenet", size: 80, signups: 42 },
      { title: "Ei-jäsenet", size: 40, signups: 12 },
    ],
  },
  {
    title: "Sitsit: Legendat palaavat",
    date: now.clone().add(9, "days").hour(19).minute(0),
    registrationStart: now.clone().subtract(1, "days"),
    registrationEnd: now.clone().add(1, "days").hour(23),
    description: "Perinteiset sitsit täynnä lauluja, ruokaa ja huumoria.",
    location: "Smökki",
    quotas: [{ title: "Pöytäpaikat", size: 60, signups: 55 }],
  },
  {
    title: "Lautapelitapahtuma",
    date: now.clone().add(2, "days").hour(17).minute(0),
    registrationStart: now.clone().subtract(4, "days"),
    registrationEnd: now.clone().add(6, "hours"), // closing soon badge
    description:
      "Rento ilta lautapelien parissa aloittelijoille ja konkareille.",
    location: "Kerhohuone A",
    quotas: [{ title: "Osallistujat", size: 24, signups: 24 }],
  },

  // --- Next upcoming event; registration hasn't opened yet. ---
  {
    title: "Kesäexcursio: Teollisuusvierailu",
    date: now.clone().add(1, "days").hour(9).minute(0),
    registrationStart: now.clone().add(2, "days"),
    registrationEnd: now.clone().add(4, "days"),
    description:
      "Tutustumme alan johtavaan yritykseen ja sen tuotantolaitokseen.",
    location: "Bussikuljetus Otaniemestä",
    quotas: [{ title: "Bussipaikat", size: 50 }],
  },

  // --- Content-rich but not otherwise promoted — earns "hero" purely by
  //     richness (quotas + description + location). ---
  {
    title: "Vuosijuhlat 2025 (arkisto)",
    date: now.clone().subtract(3, "days").hour(18).minute(0),
    registrationStart: now.clone().subtract(20, "days"),
    registrationEnd: now.clone().subtract(4, "days"),
    description: "Vuoden juhlavin ilta — cocktailtunti, illallinen ja jatkot.",
    location: "Kaupungintalo",
    quotas: [
      { title: "Illallinen", size: 100, signups: 100 },
      { title: "Vain jatkot", size: 60, signups: 38 },
    ],
  },

  // --- Plain small-square events: upcoming, low richness. ---
  {
    title: "Viikkopalaveri",
    date: now.clone().add(3, "days").hour(16).minute(0),
    registrationStart: now.clone().subtract(1, "days"),
    registrationEnd: now.clone().add(2, "days"),
  },
  {
    title: "Lautakunnan kokous",
    date: now.clone().add(6, "days").hour(16).minute(0),
    registrationStart: now.clone().subtract(1, "days"),
    registrationEnd: now.clone().add(5, "days"),
  },
  {
    title: "Fuksiaperitiivit",
    date: now.clone().add(12, "days").hour(17).minute(0),
    registrationStart: now.clone().add(3, "days"),
    registrationEnd: now.clone().add(11, "days"),
    location: "Kerhohuone B",
  },
  {
    title: "Saunailta",
    date: now.clone().add(15, "days").hour(19).minute(0),
    registrationStart: now.clone().add(5, "days"),
    registrationEnd: now.clone().add(14, "days"),
    quotas: [{ title: "Vuorot", size: 16 }],
  },
  {
    title: "Ilmoitusluontoinen tapahtuma",
    date: now.clone().add(8, "days").hour(12).minute(0),
    registrationStart: now.clone().subtract(1, "days"),
    registrationEnd: now.clone().add(7, "days"),
  },

  // --- Draft event: small square with a draft badge (admin view only). ---
  {
    title: "Suunnitteilla: Talvitapahtuma",
    date: now.clone().add(60, "days").hour(18).minute(0),
    registrationStart: now.clone().add(30, "days"),
    registrationEnd: now.clone().add(55, "days"),
    draft: true,
    description:
      "Ideointivaiheessa — tarkemmat tiedot julkaistaan myöhemmin.",
  },

  // --- Long title stress test. ---
  {
    title:
      "Erittäin pitkä ja monisanainen tapahtuman nimi joka testaa otsikon rivittymistä kortissa",
    date: now.clone().add(20, "days").hour(18).minute(0),
    registrationStart: now.clone().add(2, "days"),
    registrationEnd: now.clone().add(18, "days"),
  },

  // --- Recently past, closed, plain. ---
  {
    title: "Menneen viikon tapahtuma",
    date: now.clone().subtract(2, "days").hour(18).minute(0),
    registrationStart: now.clone().subtract(12, "days"),
    registrationEnd: now.clone().subtract(3, "days"),
    quotas: [{ title: "Osallistujat", size: 30, signups: 27 }],
  },
];

async function seed() {
  console.log(
    `Seeding ${eventSeeds.length} test events (prefix "${TEST_EVENT_PREFIX}")...`,
  );

  for (const seed of eventSeeds) {
    const event = await prisma.event.create({
      data: {
        title: TEST_EVENT_PREFIX + seed.title,
        date: seed.date.toDate(),
        registrationStartDate: seed.registrationStart.toDate(),
        registrationEndDate: seed.registrationEnd.toDate(),
        description: seed.description,
        location: seed.location,
        draft: seed.draft ?? false,
        signupsPublic: true,
      },
    });

    let sortId = 1;
    for (const quota of seed.quotas ?? []) {
      const createdQuota = await prisma.quota.create({
        data: {
          eventId: event.id,
          sortId: sortId++,
          title: quota.title,
          size: quota.size,
        },
      });

      const signupCount = Math.min(quota.signups ?? 0, quota.size ?? Infinity);
      for (let i = 0; i < signupCount; i++) {
        await prisma.signup.create({
          data: {
            quotaId: createdQuota.id,
            originalQuotaId: createdQuota.id,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            status: "CONFIRMED",
            completedAt: moment()
              .subtract(faker.number.int({ min: 1, max: 5000 }), "minutes")
              .toDate(),
          },
        });
      }
    }

    console.log(`  + ${event.title}`);
  }

  console.log(
    `Done. Run "npm run unseed-radical-events" to remove these again.`,
  );
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
