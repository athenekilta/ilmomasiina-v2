import type { RouterOutputs } from "@/utils/api";
import { decodeCheckboxAnswer, encodeCheckboxAnswer } from "./questionAnswers";

type EditableSignup = RouterOutputs["signups"]["getSignupByID"];

export function signupDraftSnapshot(signup: EditableSignup) {
  // Freeze the question schema with the answers: array indexes must not be
  // rebound to different questions while somebody is typing.
  const questions = [...signup.questions]
    .sort((a, b) => a.sortId - b.sortId)
    .map(({ id, question, type, options, sortId, required, public: isPublic }) => ({
      id, question, type, options, sortId, required, public: isPublic,
    }));
  return {
    questions,
    values: {
      name: signup.name,
      email: signup.email,
      answers: questions.map((question) => {
        let answer = signup.answers.find((item) => item.questionId === question.id)?.answer ?? "";
        if (question.type === "checkbox") {
          answer = encodeCheckboxAnswer(
            decodeCheckboxAnswer(answer).filter((selection) => question.options.includes(selection)),
            question.options,
          );
        } else if (question.type === "radio" && !question.options.includes(answer)) {
          answer = "";
        }
        return { questionId: question.id, answer };
      }),
    },
  };
}
