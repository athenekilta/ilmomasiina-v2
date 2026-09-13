import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assertCurrentImageSelection,
  getDraftUpdate,
  isUnavailableError,
} from "./draftSync";
import { eventDraftSnapshot } from "./eventDraft";
import { signupDraftSnapshot } from "./signupDraft";
import { RegistrationDate } from "./utils";

const original = { title: "Original", imageId: "image-a" };
const changed = { title: "Changed", imageId: "image-b" };

test("initial and clean drafts adopt server snapshots", () => {
  assert.equal(getDraftUpdate(undefined, original, false, false), "adopt");
  assert.equal(getDraftUpdate(original, changed, false, false), "adopt");
});

test("dirty drafts and image-only edits require explicit conflict resolution", () => {
  assert.equal(getDraftUpdate(original, changed, true, false), "conflict");
  assert.equal(
    getDraftUpdate(original, { ...original, imageId: "image-b" }, true, false),
    "conflict",
  );
  assert.deepEqual(original, { title: "Original", imageId: "image-a" });
});

test("equivalent refetches do not reset a dirty draft", () => {
  assert.equal(getDraftUpdate(original, { ...original }, true, false), "none");
});

test("missing data and updates during submission do not adopt snapshots", () => {
  assert.equal(getDraftUpdate(original, undefined, true, false), "none");
  assert.equal(getDraftUpdate(original, changed, false, true), "none");
  assert.equal(getDraftUpdate(original, changed, true, true), "conflict");
  assert.equal(getDraftUpdate(undefined, original, false, true), "none");
});

test("explicitly accepted saved/reloaded baseline clears the conflict", () => {
  assert.equal(getDraftUpdate(changed, { ...changed }, false, false), "none");
  assert.equal(
    getDraftUpdate(changed, { ...changed, title: "Another edit" }, true, false),
    "conflict",
  );
});

test("obsolete image uploads cannot commit after replacement or reload", () => {
  assert.doesNotThrow(() => assertCurrentImageSelection(3, 3));
  assert.throws(() => assertCurrentImageSelection(3, 4), /Kuvavalinta muuttui/);
});

test("event snapshots ignore live counts but detect image and configuration changes", () => {
  const event = {
    date: new Date("2026-09-13T12:00:00Z"),
    registrationStartDate: new Date("2026-09-12T12:00:00Z"),
    registrationEndDate: new Date("2026-09-13T11:00:00Z"),
    title: "Event",
    imageId: "image-a",
    Quotas: [
      {
        id: "quota",
        title: "Quota",
        size: 10,
        sharedPlacesAllocation: "NEVER",
        sortId: 1,
        eventId: 1,
        signupCount: 2,
      },
    ],
    Questions: [],
  } as unknown as NonNullable<Parameters<typeof eventDraftSnapshot>[0]>;
  const baseline = eventDraftSnapshot(event);
  const refreshed = eventDraftSnapshot({
    ...event,
    Quotas: event.Quotas.map((quota) => ({ ...quota, signupCount: 8 })),
  });
  assert.equal("signupCount" in baseline.values.Quotas[0]!, false);
  assert.equal(getDraftUpdate(baseline, refreshed, true, false), "none");
  assert.equal(
    getDraftUpdate(
      baseline,
      eventDraftSnapshot({ ...event, imageId: "image-b" }),
      true,
      false,
    ),
    "conflict",
  );
  assert.throws(() => eventDraftSnapshot(null), /ei ole enää saatavilla/);
});

test("signup placement stays outside drafts while question changes require review", () => {
  const signup = {
    name: "Name",
    email: "name@example.com",
    questions: [
      {
        id: "q",
        question: "Question",
        type: "text",
        options: [],
        sortId: 1,
        required: true,
        public: false,
      },
    ],
    answers: [{ questionId: "q", answer: "Original" }],
    placement: { type: "QUEUE", position: 3 },
  } as unknown as Parameters<typeof signupDraftSnapshot>[0];
  const baseline = signupDraftSnapshot(signup);
  const moved = signupDraftSnapshot({
    ...signup,
    placement: { type: "QUEUE", position: 1 },
  });
  assert.equal(getDraftUpdate(baseline, moved, true, false), "none");
  const changed = signupDraftSnapshot({
    ...signup,
    questions: signup.questions.map((question) => ({
      ...question,
      question: "Revised",
    })),
  });
  assert.equal(getDraftUpdate(baseline, changed, true, false), "conflict");
  assert.equal(baseline.questions[0]?.question, "Question");
  assert.equal(baseline.values.answers[0]?.answer, "Original");
});

test("unavailable resources are distinct from transient refresh errors", () => {
  for (const code of ["NOT_FOUND", "FORBIDDEN", "UNAUTHORIZED"]) {
    assert.equal(isUnavailableError({ data: { code } }), true);
  }
  assert.equal(
    isUnavailableError({ data: { code: "INTERNAL_SERVER_ERROR" } }),
    false,
  );
  assert.equal(isUnavailableError(null), false);
});

test("registration opens at its start and closes at its end without new query data", () => {
  const event = {
    registrationStartDate: new Date("2026-09-13T12:00:00Z"),
    registrationEndDate: new Date("2026-09-13T13:00:00Z"),
  };
  const start = event.registrationStartDate.getTime();
  const end = event.registrationEndDate.getTime();
  assert.equal(RegistrationDate(event, start - 1).isRegistrationInFuture, true);
  assert.equal(RegistrationDate(event, start).isRegistrationOpen, true);
  assert.equal(RegistrationDate(event, end - 1).isRegistrationOpen, true);
  assert.equal(RegistrationDate(event, end).isRegistrationClosed, true);
  assert.equal(RegistrationDate(event, end).isRegistrationOpen, false);
  assert.equal(
    RegistrationDate(event, end + 60_000).isRegistrationClosed,
    true,
  );
});
