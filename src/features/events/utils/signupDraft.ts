import type { RouterOutputs } from "@/utils/api";
import { decodeCheckboxAnswer, encodeCheckboxAnswer } from "./questionAnswers";

type EditableSignup = RouterOutputs["signups"]["getSignupByID"];

export function signupDraftSnapshot(signup: EditableSignup) {
  const questions = [...signup.questions]
    .sort((a, b) => a.sortId - b.sortId)
    .map(
      ({
        id,
        question,
        type,
        options,
        sortId,
        required,
        public: isPublic,
      }) => ({
        id,
        question,
        type,
        options: [...options].sort((a, b) => a.sortId - b.sortId),
        sortId,
        required,
        public: isPublic,
      }),
    );
  return {
    questions,
    values: {
      name: signup.name,
      email: signup.email,
      answers: questions.map((question) => {
        let answer =
          signup.answers.find((item) => item.questionId === question.id)
            ?.answer ?? "";
        const optionIds = question.options.map((option) => option.id);
        if (question.type === "checkbox") {
          answer = encodeCheckboxAnswer(
            decodeCheckboxAnswer(answer).filter((selection) =>
              optionIds.includes(selection),
            ),
            optionIds,
          );
        } else if (question.type === "radio" && !optionIds.includes(answer)) {
          answer = "";
        }
        return { questionId: question.id, answer };
      }),
    },
  };
}
