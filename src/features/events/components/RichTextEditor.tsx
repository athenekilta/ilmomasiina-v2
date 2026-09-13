import dynamic from "next/dynamic";

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
  return (
    <MdEditor
      value={value}
      preview
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
