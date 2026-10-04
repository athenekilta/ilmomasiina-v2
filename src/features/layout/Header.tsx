import Link from "next/link";
import { HeaderAccountMenu } from "./HeaderAccountMenu";
import { LanguageSelector } from "./LanguageSelector";

export const Header = () => {
  return (
    <nav className="bg-brand-primary shadow-soft fixed inset-x-0 top-0 z-200 h-14">
      {/* Same max width and padding as <main>, so the site title and the
          page heading below it sit on one vertical line at every width. */}
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="min-w-0 shrink focus-visible:outline-hidden">
          <h1 className="font-primary truncate text-xl font-extrabold tracking-tight text-white uppercase sm:text-2xl">
            Athenen Ilmomasiina
          </h1>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSelector />
          <HeaderAccountMenu />
        </div>
      </div>
    </nav>
  );
};
