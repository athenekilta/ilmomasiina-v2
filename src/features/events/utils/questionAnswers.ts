export const CHOICE_ANSWER_SEPARATOR = "\n";

type ChoiceOption = string | { id: string };

export type AnswerQuestion = {
  type: "text" | "textarea" | "radio" | "checkbox";
  options: readonly ChoiceOption[];
  required: boolean;
};

export type IdentifiedAnswerQuestion = AnswerQuestion & { id: string };

export type SubmittedQuestionAnswer = {
  questionId: string;
  answer: string;
};

export type ChoiceConfigurationIssue = {
  index?: number;
  message: string;
};

export type AnswerValidationResult =
  | { success: true; answer: string }
  | { success: false; message: string };

export type QuestionAnswerValidationMessages = {
  atLeastTwoOptions: string;
  optionRequired: string;
  optionSingleLine: string;
  optionsUnique: string;
  answerRequired: string;
  invalidOption: string;
  duplicateOption: string;
  duplicateQuestion: string;
  unknownQuestion: string;
  requiredAnswerMissing: string;
};

const defaultMessages: QuestionAnswerValidationMessages = {
  atLeastTwoOptions: "Lisää vähintään kaksi vaihtoehtoa",
  optionRequired: "Vaihtoehto ei voi olla tyhjä",
  optionSingleLine: "Vaihtoehto ei voi sisältää rivinvaihtoa",
  optionsUnique: "Vaihtoehtojen on oltava yksilöllisiä",
  answerRequired: "Vastaus on pakollinen",
  invalidOption: "Valittu vaihtoehto ei ole kelvollinen",
  duplicateOption: "Sama vaihtoehto on valittu useita kertoja",
  duplicateQuestion: "Sama kysymys on vastattu useita kertoja",
  unknownQuestion: "Vastaus viittaa tuntemattomaan kysymykseen",
  requiredAnswerMissing: "Pakollinen vastaus puuttuu",
};

const choiceOptionId = (option: ChoiceOption) =>
  typeof option === "string" ? option : option.id;

export function normalizeChoiceOptions(options: readonly string[]): string[] {
  return options.map((option) => option.trim());
}

export function getChoiceConfigurationIssues(
  options: readonly string[],
  messages: QuestionAnswerValidationMessages = defaultMessages,
): ChoiceConfigurationIssue[] {
  const issues: ChoiceConfigurationIssue[] = [];
  if (options.length < 2) {
    issues.push({ message: messages.atLeastTwoOptions });
  }

  const normalized = normalizeChoiceOptions(options);
  normalized.forEach((option, index) => {
    if (option === "") {
      issues.push({ index, message: messages.optionRequired });
    } else if (/[\r\n]/.test(option)) {
      issues.push({ index, message: messages.optionSingleLine });
    }
    if (normalized.indexOf(option) !== index) {
      issues.push({ index, message: messages.optionsUnique });
    }
  });
  return issues;
}

export function decodeCheckboxAnswer(
  answer: string | null | undefined,
): string[] {
  if (!answer) return [];
  return answer
    .replace(/\r\n?/g, CHOICE_ANSWER_SEPARATOR)
    .split(CHOICE_ANSWER_SEPARATOR);
}

export function encodeCheckboxAnswer(
  selections: readonly string[],
  options: readonly ChoiceOption[] = selections,
): string {
  const selected = new Set(selections);
  return options
    .map(choiceOptionId)
    .filter((optionId) => selected.has(optionId))
    .join(CHOICE_ANSWER_SEPARATOR);
}

export function validateAndCanonicalizeQuestionAnswer(
  question: AnswerQuestion,
  answer: string,
  messages: QuestionAnswerValidationMessages = defaultMessages,
): AnswerValidationResult {
  if (question.type === "text" || question.type === "textarea") {
    if (question.required && answer.trim() === "") {
      return { success: false, message: messages.answerRequired };
    }
    return { success: true, answer };
  }

  if (answer === "") {
    return question.required
      ? { success: false, message: messages.answerRequired }
      : { success: true, answer: "" };
  }

  const optionIds = question.options.map(choiceOptionId);

  if (question.type === "radio") {
    if (!optionIds.includes(answer)) {
      return { success: false, message: messages.invalidOption };
    }
    return { success: true, answer };
  }

  const selections = decodeCheckboxAnswer(answer);
  if (new Set(selections).size !== selections.length) {
    return { success: false, message: messages.duplicateOption };
  }
  if (selections.some((selection) => !optionIds.includes(selection))) {
    return { success: false, message: messages.invalidOption };
  }

  return {
    success: true,
    answer: encodeCheckboxAnswer(selections, optionIds),
  };
}

export function validateAndCanonicalizeSignupAnswers(
  questions: readonly IdentifiedAnswerQuestion[],
  answers: readonly SubmittedQuestionAnswer[],
  messages: QuestionAnswerValidationMessages = defaultMessages,
):
  | { success: true; answers: SubmittedQuestionAnswer[] }
  | { success: false; message: string } {
  const questionById = new Map(
    questions.map((question) => [question.id, question]),
  );
  const answerByQuestionId = new Map<string, SubmittedQuestionAnswer>();

  for (const answer of answers) {
    if (answerByQuestionId.has(answer.questionId)) {
      return { success: false, message: messages.duplicateQuestion };
    }
    if (!questionById.has(answer.questionId)) {
      return { success: false, message: messages.unknownQuestion };
    }
    answerByQuestionId.set(answer.questionId, answer);
  }

  const canonicalAnswers: SubmittedQuestionAnswer[] = [];
  for (const question of questions) {
    const submitted = answerByQuestionId.get(question.id);
    if (!submitted) {
      if (question.required) {
        return { success: false, message: messages.requiredAnswerMissing };
      }
      continue;
    }

    const result = validateAndCanonicalizeQuestionAnswer(
      question,
      submitted.answer,
      messages,
    );
    if (!result.success) return result;
    canonicalAnswers.push({
      questionId: question.id,
      answer: result.answer,
    });
  }

  return { success: true, answers: canonicalAnswers };
}
