import Link from "next/link";
import { HeaderAccountMenu } from "./HeaderAccountMenu";

export const Header = () => {
  return (
    <nav className="bg-brand-primary shadow-soft flex h-14 items-center justify-between px-4 sm:px-6">
      <Link href="/" className="min-w-0 shrink focus-visible:outline-hidden">
        <h1 className="font-primary truncate text-xl font-extrabold tracking-tight text-white uppercase sm:text-2xl">
          Athenen Ilmomasiina
        </h1>
      </Link>

      <HeaderAccountMenu />
    </nav>
  );
};
