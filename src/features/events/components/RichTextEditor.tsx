import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";
import { markdownLanguage } from "@/features/events/utils/markdownLocale";

const MdEditor = dynamic(
  () => import("md-editor-rt").then((module) => module.MdEditor),
  {
    ssr: false,
    loading: () => <div className="h-96 animate-pulse bg-stone-100" />,
  },
);

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const locale = useLocale();
  const messages = useTranslations(eventAdminMessages);

  return (
    <MdEditor
      value={value}
      preview
      onChange={(value) => onChange(value)}
      language={markdownLanguage(locale)}
      placeholder={messages.editor.descriptionPlaceholder}
      toolbarsExclude={[
        "github",
        "htmlPreview",
        "save",
        "image",
        "mermaid",
        "pageFullscreen",
        "catalog",
        "codeRow",
        "code",
        "fullscreen",
        "sub",
        "sup",
      ]}
    />
  );
}
