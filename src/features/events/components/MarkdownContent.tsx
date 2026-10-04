import { MdPreview } from "md-editor-rt";
import { useLocale } from "@/i18n/I18nProvider";
import { markdownLanguage } from "@/features/events/utils/markdownLocale";

export function MarkdownContent({ value }: { value: string }) {
  const locale = useLocale();

  return (
    <MdPreview
      value={value}
      language={markdownLanguage(locale)}
      noKatex
      noMermaid
      className="event-description-markdown"
    />
  );
}
