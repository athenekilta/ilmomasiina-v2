import { routes } from "@/utils/routes";
import Link from "next/link";
import { useUser } from "../auth/hooks/useUser";

export function Footer() {
  const user = useUser()
  const isLoggedIn = user.data !== undefined
  
  return (
    <footer className="bg-gray-800 p-4 text-center text-white flex flex-row justify-center gap-2">
      <Link href={isLoggedIn ? routes.app._root : routes.auth.login}>Hallinta</Link>
      <a href="https://athene.fi/hallinto/materiaalit/">Tietosuoja</a>
      <a href="https://athene.fi">Athene.fi</a>
    </footer>
  );
}
