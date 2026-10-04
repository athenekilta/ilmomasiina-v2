import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Switch } from "@/components/Switch";
import { Divider } from "@/components/Divider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { eventFormSchema, questionSchema } from "../utils/eventFormSchema";
import type { FieldErrorsImpl } from "react-hook-form";
import type { z } from "zod";
import cuid from "cuid";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/I18nProvider";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";

type EventFormValues = z.input<typeof eventFormSchema>;
type QuestionValue = EventFormValues["Questions"][number];

export function QuestionRow({
  question,
  onChange,
  deleteQuestion,
  signupCount,
  errors,
  activeLanguage,
}: {
  question: QuestionValue;
  onChange: (value: QuestionValue) => void;
  deleteQuestion: (id: string) => void;
  signupCount: number;
  errors: FieldErrorsImpl<QuestionValue> | undefined;
  activeLanguage: Locale;
}) {
  const messages = useTranslations(eventAdminMessages);
  const hasOptions =
    question.type === questionSchema.shape.type.enum.radio ||
    question.type === questionSchema.shape.type.enum.checkbox;

  const addOption = () => {
    onChange({
      ...question,
      options: [
        ...question.options,
        {
          id: cuid(),
          sortId: question.options.length + 1,
          translations: { fi: "", en: "" },
        },
      ],
    });
  };

  const deleteOption = (idx: number) => {
    const newOptions = [...question.options];
    newOptions.splice(idx, 1);
    onChange({
      ...question,
      options: newOptions.map((option, index) => ({
        ...option,
        sortId: index + 1,
      })),
    });
  };

  return (
    <div className="surface-muted flex flex-col gap-5 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <label
          htmlFor={`question-text-${question.id}-${activeLanguage}`}
          className="text-brand-dark w-32 shrink-0 pt-2 text-sm font-semibold"
        >
          {messages.questions.question}
        </label>
        <Input
          id={`question-text-${question.id}-${activeLanguage}`}
          title={messages.questions.question}
          value={question.translations[activeLanguage]}
          fullWidth
          onChange={(event) =>
            onChange({
              ...question,
              translations: {
                ...question.translations,
                [activeLanguage]: event.target.value,
              },
            })
          }
          error={!!errors?.translations?.[activeLanguage]}
          helperText={errors?.translations?.[activeLanguage]?.message}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
        <span className="text-brand-dark w-32 shrink-0 pt-2 text-sm font-semibold">
          {messages.questions.type}
        </span>
        <Select
          value={question.type}
          onValueChange={(value) => {
            onChange({ ...question, type: value as QuestionValue["type"] });
          }}
        >
          <SelectTrigger className="w-full sm:w-70">
            <SelectValue placeholder={messages.questions.types.text} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={questionSchema.shape.type.enum.text}>
              {messages.questions.types.text}
            </SelectItem>
            <SelectItem value={questionSchema.shape.type.enum.checkbox}>
              {messages.questions.types.checkbox}
            </SelectItem>
            <SelectItem value={questionSchema.shape.type.enum.radio}>
              {messages.questions.types.radio}
            </SelectItem>
            <SelectItem value={questionSchema.shape.type.enum.textarea}>
              {messages.questions.types.textarea}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-6 sm:pl-36">
        <div className="flex items-center gap-2">
          <label
            htmlFor={`question-required-${question.id}`}
            className="text-brand-dark text-sm"
          >
            {messages.questions.required}
          </label>
          <Switch
            id={`question-required-${question.id}`}
            value={question.required}
            onChange={(value) => onChange({ ...question, required: value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <label
              htmlFor={`question-public-${question.id}`}
              className="text-brand-dark text-sm"
            >
              {messages.questions.public}
            </label>
            <Switch
              id={`question-public-${question.id}`}
              value={question.public}
              onChange={(value) => onChange({ ...question, public: value })}
            />
          </div>
          <p className="max-w-md text-xs leading-relaxed text-gray-600">
            {messages.questions.publicHelp}
          </p>
        </div>
      </div>

      {hasOptions && (
        <div className="flex flex-col gap-3 sm:pl-36">
          {question.options.map((option, index) => {
            const optionError =
              errors?.options?.[index]?.translations?.[activeLanguage];
            return (
              <div className="flex flex-row items-center gap-3" key={option.id}>
                <Input
                  title={messages.questions.option(index + 1)}
                  value={option.translations[activeLanguage]}
                  fullWidth
                  onChange={(event) => {
                    const newOptions = [...question.options];
                    newOptions[index] = {
                      ...option,
                      translations: {
                        ...option.translations,
                        [activeLanguage]: event.target.value,
                      },
                    };
                    onChange({ ...question, options: newOptions });
                  }}
                  error={!!optionError}
                  helperText={optionError?.message}
                />
                <Button
                  type="button"
                  size="small"
                  color="danger"
                  onClick={() => deleteOption(index)}
                >
                  {messages.questions.removeOption}
                </Button>
              </div>
            );
          })}
          <Button type="button" size="small" onClick={addOption}>
            {messages.questions.addOption}
          </Button>
          {errors?.options?.root?.message ? (
            <p className="text-sm text-red-600">
              {errors.options.root.message}
            </p>
          ) : null}
        </div>
      )}

      <Divider spacingY="none" />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => deleteQuestion(question.id)}
          type="button"
          size="small"
          color="danger"
        >
          {messages.questions.removeQuestion}
        </Button>
        {signupCount > 0 && (
          <p className="text-xs leading-relaxed text-gray-600">
            {messages.questions.deleteWarning}
          </p>
        )}
      </div>
    </div>
  );
}
