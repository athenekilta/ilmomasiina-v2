import { MdEditor } from "md-editor-rt";
import { useState, useEffect } from "react";
import "md-editor-rt/lib/style.css";

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  return (
    <MdEditor
      modelValue={value}
      onChange={(value) => onChange(value)}
      language="en-US"
      placeholder="Kirjoita kuvaus"
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
