export const CHOICE_ANSWER_SEPARATOR = "\n";

export type AnswerQuestion = {
  type: "text" | "textarea" | "radio" | "checkbox";
  options: readonly string[];
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

export function normalizeChoiceOptions(options: readonly string[]): string[] {
  return options.map((option) => option.trim());
}

export function getChoiceConfigurationIssues(
  options: readonly string[],
): ChoiceConfigurationIssue[] {
  const issues: ChoiceConfigurationIssue[] = [];
  if (options.length < 2) {
    issues.push({ message: "Lisää vähintään kaksi vaihtoehtoa" });
  }

  const normalized = normalizeChoiceOptions(options);
  normalized.forEach((option, index) => {
    if (option === "") {
      issues.push({ index, message: "Vaihtoehto ei voi olla tyhjä" });
    } else if (/[\r\n]/.test(option)) {
      issues.push({
        index,
        message: "Vaihtoehto ei voi sisältää rivinvaihtoa",
      });
    }
    if (normalized.indexOf(option) !== index) {
      issues.push({
        index,
        message: "Vaihtoehtojen on oltava yksilöllisiä",
      });
    }
  });
  return issues;
}

export function decodeCheckboxAnswer(answer: string): string[] {
  if (answer === "") return [];
  return answer
    .replace(/\r\n?/g, CHOICE_ANSWER_SEPARATOR)
    .split(CHOICE_ANSWER_SEPARATOR);
}

export function encodeCheckboxAnswer(
  selections: readonly string[],
  options: readonly string[] = selections,
): string {
  const selected = new Set(selections);
  return options
    .filter((option) => selected.has(option))
    .join(CHOICE_ANSWER_SEPARATOR);
}

export function validateAndCanonicalizeQuestionAnswer(
  question: AnswerQuestion,
  answer: string,
): AnswerValidationResult {
  if (question.type === "text" || question.type === "textarea") {
    if (question.required && answer.trim() === "") {
      return { success: false, message: "Vastaus on pakollinen" };
    }
    return { success: true, answer };
  }

  if (answer === "") {
    return question.required
      ? { success: false, message: "Vastaus on pakollinen" }
      : { success: true, answer: "" };
  }

  if (question.type === "radio") {
    if (!question.options.includes(answer)) {
      return {
        success: false,
        message: "Valittu vaihtoehto ei ole kelvollinen",
      };
    }
    return { success: true, answer };
  }

  const selections = decodeCheckboxAnswer(answer);
  if (new Set(selections).size !== selections.length) {
    return {
      success: false,
      message: "Sama vaihtoehto on valittu useita kertoja",
    };
  }
  if (selections.some((selection) => !question.options.includes(selection))) {
    return { success: false, message: "Valittu vaihtoehto ei ole kelvollinen" };
  }

  return {
    success: true,
    answer: encodeCheckboxAnswer(selections, question.options),
  };
}

export function validateAndCanonicalizeSignupAnswers(
  questions: readonly IdentifiedAnswerQuestion[],
  answers: readonly SubmittedQuestionAnswer[],
):
  | { success: true; answers: SubmittedQuestionAnswer[] }
  | { success: false; message: string } {
  const questionById = new Map(
    questions.map((question) => [question.id, question]),
  );
  const answerByQuestionId = new Map<string, SubmittedQuestionAnswer>();

  for (const answer of answers) {
    if (answerByQuestionId.has(answer.questionId)) {
      return {
        success: false,
        message: "Sama kysymys on vastattu useita kertoja",
      };
    }
    if (!questionById.has(answer.questionId)) {
      return {
        success: false,
        message: "Vastaus viittaa tuntemattomaan kysymykseen",
      };
    }
    answerByQuestionId.set(answer.questionId, answer);
  }

  const canonicalAnswers: SubmittedQuestionAnswer[] = [];
  for (const question of questions) {
    const submitted = answerByQuestionId.get(question.id);
    if (!submitted) {
      if (question.required) {
        return { success: false, message: "Pakollinen vastaus puuttuu" };
      }
      continue;
    }

    const result = validateAndCanonicalizeQuestionAnswer(
      question,
      submitted.answer,
    );
    if (!result.success) return result;
    canonicalAnswers.push({
      questionId: question.id,
      answer: result.answer,
    });
  }

  return { success: true, answers: canonicalAnswers };
}
