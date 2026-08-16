import assert from "node:assert/strict";
import test from "node:test";
import {
  decodeCheckboxAnswer,
  encodeCheckboxAnswer,
  getChoiceConfigurationIssues,
  validateAndCanonicalizeSignupAnswers,
  type IdentifiedAnswerQuestion,
} from "./questionAnswers";

const questions: IdentifiedAnswerQuestion[] = [
  {
    id: "required-text",
    type: "text",
    options: [],
    required: true,
  },
  {
    id: "radio",
    type: "radio",
    options: ["First", "Second"],
    required: false,
  },
  {
    id: "checkbox",
    type: "checkbox",
    options: ["Alpha", "Beta", "Gamma"],
    required: true,
  },
];

test("checkbox answers encode canonically and decode line endings", () => {
  assert.equal(
    encodeCheckboxAnswer(["Gamma", "Alpha"], questions[2]!.options),
    "Alpha\nGamma",
  );
  assert.deepEqual(decodeCheckboxAnswer("Alpha\r\nGamma"), ["Alpha", "Gamma"]);
  assert.deepEqual(decodeCheckboxAnswer(""), []);
  assert.deepEqual(decodeCheckboxAnswer(undefined), []);
  assert.deepEqual(decodeCheckboxAnswer(null), []);
});

test("choice configuration requires two non-empty unique single-line options", () => {
  assert.deepEqual(getChoiceConfigurationIssues(["One", "Two"]), []);
  assert.ok(getChoiceConfigurationIssues(["One"]).length > 0);
  assert.ok(getChoiceConfigurationIssues(["One", " "]).length > 0);
  assert.ok(getChoiceConfigurationIssues(["One", " One "]).length > 0);
  assert.ok(getChoiceConfigurationIssues(["One", "Two\nThree"]).length > 0);
});

test("valid signup answers are canonicalized in question and option order", () => {
  const result = validateAndCanonicalizeSignupAnswers(questions, [
    { questionId: "checkbox", answer: "Gamma\nAlpha" },
    { questionId: "required-text", answer: "Hello" },
    { questionId: "radio", answer: "Second" },
  ]);

  assert.deepEqual(result, {
    success: true,
    answers: [
      { questionId: "required-text", answer: "Hello" },
      { questionId: "radio", answer: "Second" },
      { questionId: "checkbox", answer: "Alpha\nGamma" },
    ],
  });
});

test("missing required answers are rejected while optional answers may be omitted", () => {
  const missingRequired = validateAndCanonicalizeSignupAnswers(questions, [
    { questionId: "required-text", answer: "Hello" },
  ]);
  assert.equal(missingRequired.success, false);

  const optionalOmitted = validateAndCanonicalizeSignupAnswers(
    questions.filter((question) => question.id !== "checkbox"),
    [{ questionId: "required-text", answer: "Hello" }],
  );
  assert.equal(optionalOmitted.success, true);
});

test("duplicate and unknown question IDs are rejected", () => {
  assert.equal(
    validateAndCanonicalizeSignupAnswers(questions, [
      { questionId: "required-text", answer: "One" },
      { questionId: "required-text", answer: "Two" },
    ]).success,
    false,
  );
  assert.equal(
    validateAndCanonicalizeSignupAnswers(questions, [
      { questionId: "unknown", answer: "Anything" },
    ]).success,
    false,
  );
});

test("unknown radio and duplicate or unknown checkbox selections are rejected", () => {
  const base = [{ questionId: "required-text", answer: "Hello" }];

  assert.equal(
    validateAndCanonicalizeSignupAnswers(questions, [
      ...base,
      { questionId: "radio", answer: "Third" },
      { questionId: "checkbox", answer: "Alpha" },
    ]).success,
    false,
  );
  assert.equal(
    validateAndCanonicalizeSignupAnswers(questions, [
      ...base,
      { questionId: "checkbox", answer: "Alpha\nAlpha" },
    ]).success,
    false,
  );
  assert.equal(
    validateAndCanonicalizeSignupAnswers(questions, [
      ...base,
      { questionId: "checkbox", answer: "Unknown" },
    ]).success,
    false,
  );
});
