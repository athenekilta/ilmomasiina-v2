import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

export default function UserAccessPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get(
      "token",
    );
    window.history.replaceState(null, "", window.location.pathname);
    if (!token) {
      queueMicrotask(() => setError(true));
      return;
    }

    void fetch("/api/token/redeem", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Invalid link");
        return (await response.json()) as { redirectUrl: string };
      })
      .then(({ redirectUrl }) => router.replace(redirectUrl))
      .catch(() => setError(true));
  }, [router]);

  return (
    <Layout>
      <PageHead title="Ilmoittautumislinkki" />
      <div className="mx-auto w-full max-w-2xl px-1 sm:px-0">
        <div className="surface-panel p-8 text-center sm:p-10">
          {error ? (
            <p className="text-brand-dark font-medium">
              Ilmoittautumislinkki ei ole voimassa.
            </p>
          ) : (
            <div className="flex justify-center py-10">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
