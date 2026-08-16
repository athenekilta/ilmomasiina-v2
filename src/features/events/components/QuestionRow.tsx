import type { Question } from "@/generated/prisma";
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
import { questionSchema } from "../utils/eventFormSchema";
import type { FieldErrorsImpl } from "react-hook-form";

export function QuestionRow({
  question,
  onChange,
  deleteQuestion,
  signupCount,
  errors,
}: {
  question: Question;
  onChange: (value: Question) => void;
  deleteQuestion: (id: string) => void;
  signupCount: number;
  errors: FieldErrorsImpl<Question> | undefined;
}) {
  const hasOptions =
    question.type === questionSchema.shape.type.enum.radio ||
    question.type === questionSchema.shape.type.enum.checkbox;

  const addOption = () => {
    onChange({
      ...question,
      options: [...question.options, ""],
    });
  };

  const deleteOption = (idx: number) => {
    const newOptions = [...question.options];
    newOptions.splice(idx, 1);
    onChange({
      ...question,
      options: newOptions,
    });
  };

  return (
    <div className="surface-muted flex flex-col gap-5 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <label
          htmlFor={`question-text-${question.id}`}
          className="text-brand-dark w-32 shrink-0 pt-2 text-sm font-semibold"
        >
          Kysymys
        </label>
        <Input
          id={`question-text-${question.id}`}
          title="Kysymys"
          value={question.question}
          fullWidth
          onChange={(value) =>
            onChange({ ...question, question: value.target.value })
          }
          error={!!errors?.question}
          helperText={errors?.question ? errors.question.message : undefined}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
        <label className="text-brand-dark w-32 shrink-0 pt-2 text-sm font-semibold">
          Tyyppi
        </label>
        <Select
          value={question.type}
          onValueChange={(value) => {
            onChange({ ...question, type: value as Question["type"] });
          }}
        >
          <SelectTrigger className="w-full sm:w-70">
            <SelectValue placeholder="Teksti (lyhyt)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={questionSchema.shape.type.enum.text}>
              Teksti (lyhyt)
            </SelectItem>
            <SelectItem value={questionSchema.shape.type.enum.checkbox}>
              Monivalinta (voi valita useita)
            </SelectItem>
            <SelectItem value={questionSchema.shape.type.enum.radio}>
              Monivalinta (voi valita vain yhden)
            </SelectItem>
            <SelectItem value={questionSchema.shape.type.enum.textarea}>
              Teksti (pitkä)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-6 sm:pl-36">
        <div className="flex items-center gap-2">
          <span className="text-brand-dark text-sm">Pakollinen</span>
          <Switch
            value={question.required}
            onChange={(value) => onChange({ ...question, required: value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-brand-dark text-sm">Julkinen</span>
            <Switch
              value={question.public}
              onChange={(value) => onChange({ ...question, public: value })}
            />
          </div>
          <p className="max-w-md text-xs leading-relaxed text-gray-600">
            Julkinen vastaus näkyy tapahtuman{" "}
            <strong>julkisessa osallistujalistassa</strong>, kun
            ilmoittautumiset on merkitty julkisiksi.
          </p>
        </div>
      </div>

      {hasOptions && (
        <div className="flex flex-col gap-3 sm:pl-36">
          {question.options.map((option, index) => (
            <div className="flex flex-row items-center gap-3" key={index}>
              <Input
                title={`Vaihtoehto ${index + 1}`}
                value={option}
                fullWidth
                onChange={(value) => {
                  const newOptions = [...question.options];
                  newOptions[index] = value.target.value;
                  onChange({ ...question, options: newOptions });
                }}
                error={!!errors?.options?.[index]}
                helperText={errors?.options?.[index]?.message}
              />
              <Button
                type="button"
                size="small"
                color="danger"
                onClick={() => deleteOption(index)}
              >
                Poista
              </Button>
            </div>
          ))}
          <Button type="button" size="small" onClick={() => addOption()}>
            Lisää vaihtoehto
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
          Poista kysymys
        </Button>
        {signupCount > 0 && (
          <p className="text-xs leading-relaxed text-gray-600">
            <strong>Huom!</strong> Kysymyksen poistaminen poistaa myös siihen
            saadut vastaukset pysyvästi.
          </p>
        )}
      </div>
    </div>
  );
}
