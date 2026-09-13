import { MdPreview } from "md-editor-rt";

export function MarkdownContent({ value }: { value: string }) {
  return (
    <MdPreview
      value={value}
      language="en-US"
      noKatex
      noMermaid
      className="event-description-markdown"
    />
  );
}
