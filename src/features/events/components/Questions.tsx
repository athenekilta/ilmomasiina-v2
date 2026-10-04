import { FieldSet } from "@/components/FieldSet";
import { Button } from "@/components/Button";
import { QuestionRow } from "./QuestionRow";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type { DragUpdate } from "@hello-pangea/dnd";
import cuid from "cuid";
import { eventFormSchema } from "../utils/eventFormSchema";
import type {
  FieldErrors,
  FieldErrorsImpl,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useCallback } from "react";
import type { z } from "zod";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/I18nProvider";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";

type EventFormValues = z.input<typeof eventFormSchema>;
type QuestionValue = EventFormValues["Questions"][number];

type QuestionsProps = {
  getValues: UseFormGetValues<EventFormValues>;
  setValue: UseFormSetValue<EventFormValues>;
  watch: UseFormWatch<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
  eventId?: number;
  signupCount: number;
  activeLanguage: Locale;
};

export function Questions({
  getValues,
  setValue,
  watch,
  errors,
  eventId,
  signupCount,
  activeLanguage,
}: QuestionsProps) {
  const messages = useTranslations(eventAdminMessages);
  const createQuestion = useCallback(() => {
    const questions = getValues("Questions");
    const id = cuid();
    const sortId = questions.length + 1;

    setValue("Questions", [
      ...questions,
      {
        id,
        translations: { fi: "", en: "" },
        type: "text",
        required: false,
        sortId,
        options: [],
        public: false,
        eventId: eventId ?? NaN,
      },
    ]);
  }, [eventId, getValues, setValue]);

  const deleteQuestion = useCallback(
    (id: string) => {
      const questions = getValues("Questions");
      const filtered = questions
        .filter((question) => question.id !== id)
        .map((question, index) => ({ ...question, sortId: index + 1 }));

      setValue("Questions", filtered);
    },
    [getValues, setValue],
  );

  const onDragEndQuestions = useCallback(
    (result: DragUpdate) => {
      if (!result.destination) return;

      const questions = [...getValues("Questions")];
      const [removed] = questions.splice(result.source.index, 1);
      if (!removed) return;

      questions.splice(result.destination.index, 0, removed);
      const sortedQuestions = questions.map((question, index) => ({
        ...question,
        sortId: index + 1,
      }));

      setValue("Questions", sortedQuestions);
    },
    [getValues, setValue],
  );

  return (
    <FieldSet title={messages.questions.title}>
      <div className="mt-2 mb-5 flex flex-row gap-4">
        <Button onClick={() => createQuestion()} type="button">
          {messages.questions.add}
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEndQuestions}>
        <Droppable droppableId="Questions">
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className="space-y-4"
            >
              {watch("Questions").map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <QuestionRow
                        key={question.id}
                        question={question}
                        onChange={(value) => {
                          const questions = [...getValues("Questions")];
                          questions[index] = value;
                          setValue("Questions", questions);
                        }}
                        deleteQuestion={deleteQuestion}
                        signupCount={signupCount}
                        activeLanguage={activeLanguage}
                        errors={
                          errors.Questions &&
                          (errors.Questions[index] as FieldErrorsImpl<QuestionValue>)
                        }
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </FieldSet>
  );
}
