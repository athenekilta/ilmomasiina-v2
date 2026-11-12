import assert from "node:assert/strict";
import test from "node:test";
import { localizedValue, translationRecord } from "./content";

for (const missing of [null, undefined, "", " \n\t "]) {
  test(`blank English fields fall back to Finnish (${JSON.stringify(missing)})`, () => {
    const translations = [
      { locale: "en", value: missing },
      { locale: "fi", value: "Suomenkielinen sisältö" },
    ];
    assert.equal(
      localizedValue(translations, "en", (row) => row.value),
      "Suomenkielinen sisältö",
    );
  });
}

test("event fields fall back independently without replacing existing English content", () => {
  const translations = [
    {
      locale: "fi",
      title: "Tapahtuma",
      badgeText: "Vuoden tapahtuma",
      description: "Suomenkielinen kuvaus",
      verificationEmail: "Tervetuloa!",
    },
    {
      locale: "en",
      title: "Event",
      badgeText: "",
      description: null,
      verificationEmail: " \n ",
    },
  ];
  assert.deepEqual(
    {
      title: localizedValue(translations, "en", (row) => row.title),
      badgeText: localizedValue(translations, "en", (row) => row.badgeText),
      description: localizedValue(translations, "en", (row) => row.description),
      verificationEmail: localizedValue(
        translations,
        "en",
        (row) => row.verificationEmail,
      ),
    },
    {
      title: "Event",
      badgeText: "Vuoden tapahtuma",
      description: "Suomenkielinen kuvaus",
      verificationEmail: "Tervetuloa!",
    },
  );
  assert.equal(
    localizedValue(translations, "fi", (row) => row.title),
    "Tapahtuma",
  );
});

test("question, option, and quota labels each fall back independently", () => {
  const question = [
    { locale: "fi", question: "Ruokavalio" },
    { locale: "en", question: "" },
  ];
  const options = [
    [
      { locale: "fi", label: "Kasvis" },
      { locale: "en", label: "Vegetarian" },
    ],
    [
      { locale: "fi", label: "Vegaaninen" },
      { locale: "en", label: " \t " },
    ],
    [{ locale: "fi", label: "Ei rajoituksia" }],
  ];
  const quota = [
    { locale: "fi", title: "Jäsenet" },
    { locale: "en", title: "" },
  ];

  assert.equal(
    localizedValue(question, "en", (row) => row.question),
    "Ruokavalio",
  );
  assert.deepEqual(
    options.map((translations) =>
      localizedValue(translations, "en", (row) => row.label),
    ),
    ["Vegetarian", "Vegaaninen", "Ei rajoituksia"],
  );
  assert.equal(localizedValue(quota, "en", (row) => row.title), "Jäsenet");
});

test("fallback preserves Markdown whitespace in either language", () => {
  const finnish = "  Suomenkielinen kuvaus  \n\n    koodi\n";
  const english = "  English description  \n\n    code\n";
  assert.equal(
    localizedValue([{ locale: "fi", value: finnish }], "en", (row) => row.value),
    finnish,
  );
  assert.equal(
    localizedValue(
      [
        { locale: "fi", value: finnish },
        { locale: "en", value: english },
      ],
      "en",
      (row) => row.value,
    ),
    english,
  );
});

test("fields missing in both languages remain empty", () => {
  assert.equal(localizedValue([], "en", () => "unused"), "");
  assert.equal(
    localizedValue(
      [
        { locale: "fi", value: null },
        { locale: "en", value: " \n " },
      ],
      "en",
      (row) => row.value,
    ),
    "",
  );
  assert.equal(
    localizedValue([{ locale: "en", value: null }], "en", (row) => row.value),
    "",
  );
});

test("display fallback does not populate missing editor translations or mutate data", () => {
  const translations = [
    { locale: "fi", title: "Tapahtuma" },
    { locale: "en", title: "" },
  ];
  const original = structuredClone(translations);

  assert.equal(
    localizedValue(translations, "en", (row) => row.title),
    "Tapahtuma",
  );
  assert.deepEqual(translationRecord(translations, (row) => row.title), {
    fi: "Tapahtuma",
    en: "",
  });
  assert.deepEqual(translationRecord([translations[0]!], (row) => row.title), {
    fi: "Tapahtuma",
    en: "",
  });
  assert.deepEqual(translations, original);
});
