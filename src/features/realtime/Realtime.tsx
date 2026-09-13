import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/server/auth/auth-client";
import { api } from "@/utils/api";
import { clearRealtimeData, startRealtime } from "./client";
import { describeQuery, isRealtimeQuery, profileIdentity } from "./queries";

export function Realtime() {
  const client = useQueryClient();
  const session = useSession();
  const [disconnected, setDisconnected] = useState(false);
  const previousSession = useRef<string | undefined>(undefined);

  // Keep an authoritative profile observer even when the page has no useUser.
  // A failed/refreshed socket ticket alone is not evidence of a role downgrade.
  api.profile.get.useQuery(undefined, { retry: 1 });

  const userId = session.data?.user.id ?? null;
  const sessionId = session.data?.session.id ?? null;
  // Object identity and sliding expiry updates must not rotate the connection.
  const sessionKey = session.isPending
    ? undefined
    : JSON.stringify([userId, sessionId]);

  useEffect(() => {
    if (sessionKey === undefined) return;
    const cachedProfile = profileIdentity(
      client
        .getQueryCache()
        .getAll()
        .find((query) => describeQuery(query.queryKey).path === "profile.get")
        ?.state.data,
    );
    const accountChanged =
      previousSession.current !== undefined &&
      previousSession.current !== sessionKey;
    const staleIdentity =
      cachedProfile !== undefined && (cachedProfile?.id ?? null) !== userId;
    previousSession.current = sessionKey;
    if (accountChanged || staleIdentity) {
      clearRealtimeData(client, isRealtimeQuery);
      // Do not wait for the socket to recover before refreshing the profile.
      void client.refetchQueries({
        predicate: (query) =>
          describeQuery(query.queryKey).path === "profile.get",
        type: "active",
      });
    }
    return startRealtime(client, setDisconnected);
  }, [client, sessionKey, userId]);

  if (!disconnected) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-3 bottom-3 z-50 max-w-xs rounded-full border border-stone-200 bg-white/95 px-3 py-1.5 text-xs text-stone-600 shadow-sm"
      title="Yhteyttä yritetään uudelleen automaattisesti. Tiedot päivitetään yhteyskatkon aikana 30 sekunnin välein, kun sivu on näkyvissä ja verkkoyhteys on käytettävissä."
    >
      <span
        aria-hidden="true"
        className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"
      />
      Reaaliaikainen yhteys katkesi
    </div>
  );
}
