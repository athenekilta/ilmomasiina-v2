-- Store language preferences used by account and signup communication.
ALTER TABLE "ManagementUser"
ADD COLUMN "preferredLocale" TEXT NOT NULL DEFAULT 'fi';

ALTER TABLE "Signup"
ADD COLUMN "communicationLocale" TEXT NOT NULL DEFAULT 'fi';

-- Localized event content. Locale values are BCP 47 language tags validated by
-- the application, rather than a database enum, so adding languages is additive.
CREATE TABLE "EventTranslation" (
    "eventId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "badgeText" TEXT,
    "description" TEXT,
    "verificationEmail" TEXT,
    CONSTRAINT "EventTranslation_pkey" PRIMARY KEY ("eventId", "locale")
);
CREATE INDEX "EventTranslation_locale_idx" ON "EventTranslation"("locale");
ALTER TABLE "EventTranslation"
ADD CONSTRAINT "EventTranslation_eventId_fkey"
FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "QuotaTranslation" (
    "quotaId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    CONSTRAINT "QuotaTranslation_pkey" PRIMARY KEY ("quotaId", "locale")
);
CREATE INDEX "QuotaTranslation_locale_idx" ON "QuotaTranslation"("locale");
ALTER TABLE "QuotaTranslation"
ADD CONSTRAINT "QuotaTranslation_quotaId_fkey"
FOREIGN KEY ("quotaId") REFERENCES "Quota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "QuestionTranslation" (
    "questionId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    CONSTRAINT "QuestionTranslation_pkey" PRIMARY KEY ("questionId", "locale")
);
CREATE INDEX "QuestionTranslation_locale_idx" ON "QuestionTranslation"("locale");
ALTER TABLE "QuestionTranslation"
ADD CONSTRAINT "QuestionTranslation_questionId_fkey"
FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Options receive stable identifiers. Their translated labels are display data;
-- answers refer to the stable option instead of a mutable translated label.
CREATE TABLE "QuestionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "sortId" INTEGER NOT NULL,
    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "QuestionOption_questionId_idx" ON "QuestionOption"("questionId");
CREATE UNIQUE INDEX "QuestionOption_questionId_sortId_key"
ON "QuestionOption"("questionId", "sortId");
ALTER TABLE "QuestionOption"
ADD CONSTRAINT "QuestionOption_questionId_fkey"
FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "QuestionOptionTranslation" (
    "optionId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "QuestionOptionTranslation_pkey" PRIMARY KEY ("optionId", "locale")
);
CREATE INDEX "QuestionOptionTranslation_locale_idx"
ON "QuestionOptionTranslation"("locale");
ALTER TABLE "QuestionOptionTranslation"
ADD CONSTRAINT "QuestionOptionTranslation_optionId_fkey"
FOREIGN KEY ("optionId") REFERENCES "QuestionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Answer" ADD COLUMN "textValue" TEXT;

CREATE TABLE "AnswerSelection" (
    "answerId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    CONSTRAINT "AnswerSelection_pkey" PRIMARY KEY ("answerId", "optionId")
);
CREATE INDEX "AnswerSelection_optionId_idx" ON "AnswerSelection"("optionId");
ALTER TABLE "AnswerSelection"
ADD CONSTRAINT "AnswerSelection_answerId_fkey"
FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnswerSelection"
ADD CONSTRAINT "AnswerSelection_optionId_fkey"
FOREIGN KEY ("optionId") REFERENCES "QuestionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Existing content is Finnish. English falls back to these rows until editors
-- add an explicit English translation.
INSERT INTO "EventTranslation" (
    "eventId", "locale", "title", "badgeText", "description", "verificationEmail"
)
SELECT "id", 'fi', "title", "badgeText", "description", "verificationEmail"
FROM "Event";

INSERT INTO "QuotaTranslation" ("quotaId", "locale", "title")
SELECT "id", 'fi', "title" FROM "Quota";

INSERT INTO "QuestionTranslation" ("questionId", "locale", "question")
SELECT "id", 'fi', "question" FROM "Question";

INSERT INTO "QuestionOption" ("id", "questionId", "sortId")
SELECT
    q."id" || ':option:' || option_index::text,
    q."id",
    option_index
FROM "Question" q
CROSS JOIN LATERAL generate_subscripts(q."options", 1) AS option_index;

INSERT INTO "QuestionOptionTranslation" ("optionId", "locale", "label")
SELECT
    q."id" || ':option:' || option_index::text,
    'fi',
    q."options"[option_index]
FROM "Question" q
CROSS JOIN LATERAL generate_subscripts(q."options", 1) AS option_index;

UPDATE "Answer" a
SET "textValue" = a."answer"
FROM "Question" q
WHERE a."questionId" = q."id"
  AND q."type" IN ('text', 'textarea');

-- Legacy choice answers contain labels rather than stable identifiers. Abort
-- instead of guessing if duplicate labels make a selection ambiguous.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "Question" q
        CROSS JOIN LATERAL generate_subscripts(q."options", 1) AS option_index
        WHERE q."type" IN ('radio', 'checkbox')
        GROUP BY q."id", q."options"[option_index]
        HAVING count(*) > 1
    ) THEN
        RAISE EXCEPTION 'Cannot migrate duplicate choice labels';
    END IF;
END
$$;

INSERT INTO "AnswerSelection" ("answerId", "optionId")
SELECT DISTINCT a."id", qo."id"
FROM "Answer" a
JOIN "Question" q ON q."id" = a."questionId"
CROSS JOIN LATERAL regexp_split_to_table(a."answer", E'\\r?\\n') AS selected_label
JOIN "QuestionOption" qo ON qo."questionId" = q."id"
JOIN "QuestionOptionTranslation" qot
  ON qot."optionId" = qo."id"
 AND qot."locale" = 'fi'
 AND qot."label" = selected_label
WHERE q."type" IN ('radio', 'checkbox')
  AND a."answer" <> '';

-- Refuse to drop legacy answers if any non-empty choice label failed to map.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "Answer" a
        JOIN "Question" q ON q."id" = a."questionId"
        CROSS JOIN LATERAL regexp_split_to_table(a."answer", E'\\r?\\n') AS selected_label
        WHERE q."type" IN ('radio', 'checkbox')
          AND a."answer" <> ''
          AND NOT EXISTS (
              SELECT 1
              FROM "QuestionOption" qo
              JOIN "QuestionOptionTranslation" qot
                ON qot."optionId" = qo."id"
               AND qot."locale" = 'fi'
              WHERE qo."questionId" = q."id"
                AND qot."label" = selected_label
          )
    ) THEN
        RAISE EXCEPTION 'Cannot migrate an unknown choice answer label';
    END IF;
END
$$;

-- Remove duplicated legacy content after it has been copied to normalized rows.
ALTER TABLE "Event"
DROP COLUMN "title",
DROP COLUMN "badgeText",
DROP COLUMN "description",
DROP COLUMN "verificationEmail";

ALTER TABLE "Quota" DROP COLUMN "title";

ALTER TABLE "Question"
DROP COLUMN "question",
DROP COLUMN "options";

ALTER TABLE "Answer" DROP COLUMN "answer";
