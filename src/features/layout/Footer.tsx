import { routes } from "@/utils/routes";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-800 p-4 text-center text-white flex flex-row justify-center gap-2">
      <Link href={routes.auth.login}>Hallinta</Link>
      <a href="https://athene.fi/hallinto/materiaalit/">Tietosuoja</a>
      <a href="https://athene.fi">Athene.fi</a>
    </footer>
  );
}
