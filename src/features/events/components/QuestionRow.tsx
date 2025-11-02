import type { Question } from "@prisma/client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Switch } from "@/components/Switch";
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
  console.log(errors);
  return (
    <div className="my-1 gap-6 rounded-md border-2 border-slate-300 p-3 odd:bg-gray-100 even:bg-slate-100">
      <div className="mb-10 flex max-w-3/4 flex-col gap-6">
        <div className="flex flex-row items-center gap-2 px-7">
          <label htmlFor="name" className="w-28">
            Kysymys:
          </label>
          <Input
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
      </div>
      <div className="mt-4 mb-6 flex flex-row items-center gap-6 px-7">
        <label className="w-32">Tyyppi:</label>
        <Select
          onValueChange={(value) => {
            onChange({ ...question, type: value as Question["type"] });
          }}
        >
          <SelectTrigger className="w-[280px] bg-white">
            <SelectValue placeholder="Teksti (lyhyt)" />
          </SelectTrigger>
          <SelectContent className="bg-white">
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
        <p>Pakollinen</p>
        <Switch
          value={question.required}
          onChange={(value) => onChange({ ...question, required: value })}
        />
        <p>Julkinen</p>
        <Switch
          value={question.public}
          onChange={(value) => onChange({ ...question, public: value })}
        />
      </div>
      {question.type === questionSchema.shape.type.enum.radio ||
      question.type === questionSchema.shape.type.enum.checkbox ? (
        <div className="mb-7 flex flex-col gap-3 px-7">
          {question.options.map((option, index) => (
            <div className="flex flex-row items-center gap-5" key={index}>
              <span>Vaihtoehto:</span>
              <Input
                key={index}
                title={`Vaihtoehto ${index + 1}`}
                value={option}
                fullWidth
                onChange={(value) => {
                  const newOptions = [...question.options];
                  newOptions[index] = value.target.value;
                  onChange({ ...question, options: newOptions });
                }}
              />
              <Button
                type="button"
                color="danger"
                onClick={() => deleteOption(index)}
              >
                Poista
              </Button>
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex flex-row items-center gap-5">
        <Button
          onClick={() => deleteQuestion(question.id)}
          type="button"
          color="danger"
        >
          Poista kysymys
        </Button>
        {(question.type === questionSchema.shape.type.enum.radio ||
          question.type === questionSchema.shape.type.enum.checkbox) && (
          <Button type="button" onClick={() => addOption()}>
            Lisää vaihtoehto
          </Button>
        )}
        {signupCount > 0 && (
          <p>
            <b>
              HUOM! Kysymyksen poistaminen poistaa myös siihen saadut vastaukset
              pysyvästi.
            </b>
          </p>
        )}
      </div>
    </div>
  );
}
