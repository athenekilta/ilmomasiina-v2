import Link from "next/link";
import { HeaderAccountMenu } from "./HeaderAccountMenu";
import { LanguageSelector } from "./LanguageSelector";

export const Header = () => {
  return (
    <nav className="bg-brand-primary shadow-soft fixed inset-x-0 top-0 z-200 h-14">
      {/* Same max width and padding as <main>, so the site title and the
          page heading below it sit on one vertical line at every width. */}
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Athenen Ilmomasiina"
          className="flex min-w-0 items-baseline gap-3 rounded-sm text-brand-light focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary"
        >
          <span className="font-display text-4xl leading-none italic">athene.</span>
          <span className="font-secondary hidden text-xs font-extrabold tracking-[0.12em] uppercase md:inline">
            Ilmomasiina
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSelector />
          <HeaderAccountMenu />
        </div>
      </div>
    </nav>
  );
};
