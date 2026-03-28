"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useUser } from "@/features/auth/hooks/useUser";
import { signOut } from "@/server/auth/auth-client";
import { routes } from "@/utils/routes";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";
import useUserStore from "@/stores/userStore";

function AccountDropdownPanel({
  open,
  onClose,
  titleId,
  title,
  children,
  panelRef,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  children: ReactNode;
  panelRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: Event) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (triggerRef.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open, onClose, panelRef, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="border-stone-200 bg-brand-light text-brand-dark absolute top-full right-0 z-300 mt-2 max-h-[min(85vh,calc(100vh-5rem))] w-[min(calc(100vw-24px),320px)] overflow-y-auto rounded-control border shadow-card ring-1 ring-stone-900/10"
    >
      <div className="bg-brand-light sticky top-0 flex items-start justify-between gap-2 border-b border-stone-200 px-4 py-3">
        <h2
          id={titleId}
          className="text-brand-dark pr-2 text-sm font-bold tracking-tight"
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-brand-dark shrink-0 rounded-control p-1 transition-colors hover:bg-stone-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-secondary"
          aria-label="Sulje"
        >
          <Icon icon="close" className="block text-xl!" size={22} />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function HeaderAccountMenu() {
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const userQuery = useUser();
  const sessionUser = userQuery.data;
  const sessionLoading = userQuery.isLoading;

  const storedUser = useUserStore((s) => s.user);
  const setStoredUser = useUserStore((s) => s.setUser);
  const clearStoredUser = useUserStore((s) => s.clearUser);

  const [open, setOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const openPanel = useCallback(() => {
    if (!sessionUser) {
      setGuestName(storedUser?.name ?? "");
      setGuestEmail(storedUser?.email ?? "");
    }
    setOpen(true);
  }, [sessionUser, storedUser]);

  const closePanel = useCallback(() => setOpen(false), []);

  const saveGuest = () => {
    const n = guestName.trim();
    const e = guestEmail.trim();
    if (!n && !e) {
      clearStoredUser();
    } else {
      setStoredUser({
        name: n || undefined,
        email: e || undefined,
      });
    }
    closePanel();
  };

  const clearGuest = () => {
    clearStoredUser();
    setGuestName("");
    setGuestEmail("");
    closePanel();
  };

  const displayLine =
    sessionUser?.name?.trim() ||
    sessionUser?.email?.split("@")[0] ||
    storedUser?.name?.trim() ||
    storedUser?.email?.split("@")[0] ||
    null;

  const subLine = sessionUser?.email ?? storedUser?.email ?? null;

  const triggerLabel = sessionUser
    ? (displayLine ?? "Tili")
    : displayLine
      ? displayLine
      : "Ilmoittautuminen";

  const triggerSub = sessionUser
    ? subLine
    : (subLine ?? "Aseta nimi ja sähköposti");

  if (sessionLoading) {
    return (
      <div
        className="bg-white/20 h-9 w-28 shrink-0 rounded-control sm:w-36"
        aria-hidden
      />
    );
  }

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closePanel() : openPanel())}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="text-white flex max-w-[min(14rem,46vw)] items-center gap-1 rounded-control py-1.5 pr-1.5 pl-2 transition-colors hover:bg-white/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary sm:max-w-xs sm:gap-1.5 sm:pl-2.5"
      >
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-xs font-semibold sm:text-sm">
            {triggerLabel}
          </span>
          <span className="block truncate text-[0.65rem] text-white/75 sm:text-xs">
            {triggerSub}
          </span>
        </span>
        <Icon
          icon="expand_more"
          className={`shrink-0 text-white/90 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          size={20}
        />
      </button>

      <AccountDropdownPanel
        open={open}
        onClose={closePanel}
        titleId={titleId}
        title={sessionUser ? "Tilin tiedot" : "Ilmoittautumistiedot"}
        panelRef={panelRef}
        triggerRef={triggerRef}
      >
        {sessionUser ? (
          <>
            <div className="text-brand-dark space-y-3 text-sm">
              {sessionUser.name ? (
                <p>
                  <span className="font-semibold">Nimi:</span> {sessionUser.name}
                </p>
              ) : null}
              <p>
                <span className="font-semibold">Sähköposti:</span>{" "}
                {sessionUser.email}
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Button.Link
                href={routes.app.settings.user}
                variant="filled"
                color="primary"
                className="w-full justify-center"
                onClick={closePanel}
              >
                Asetukset
              </Button.Link>
              <Button
                type="button"
                variant="filled"
                color="secondary"
                className="w-full justify-center"
                onClick={() => {
                  void signOut();
                  closePanel();
                }}
              >
                Kirjaudu ulos
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-xs leading-relaxed text-gray-600 sm:text-sm">
              Näitä tietoja käytetään tapahtumaan ilmoittautuessasi ilman täyttä
              kirjautumista.
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-brand-dark mb-1 block text-xs font-semibold">
                  Nimi
                </label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Nimi"
                  fullWidth
                />
              </div>
              <div>
                <label className="text-brand-dark mb-1 block text-xs font-semibold">
                  Sähköposti
                </label>
                <Input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="sinä@example.com"
                  fullWidth
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Button
                type="button"
                variant="filled"
                color="primary"
                className="w-full justify-center"
                onClick={saveGuest}
              >
                Tallenna
              </Button>
              <Button
                type="button"
                variant="bordered"
                color="neutral"
                className="w-full justify-center"
                onClick={clearGuest}
              >
                Tyhjennä tiedot
              </Button>
              <p className="border-stone-200 text-stone-500 mt-4 border-t pt-3 text-center text-[0.65rem] leading-snug sm:text-xs">
                <span className="text-stone-400 block font-medium">
                  Ylläpito
                </span>
                <Link
                  href={routes.auth.login}
                  onClick={closePanel}
                  className="text-brand-secondary mt-0.5 inline-block font-medium underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-secondary"
                >
                  Kirjaudu sisään
                </Link>
              </p>
            </div>
          </>
        )}
      </AccountDropdownPanel>
    </div>
  );
}
