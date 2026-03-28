"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useUser } from "@/features/auth/hooks/useUser";
import { signOut } from "@/server/auth/auth-client";
import { routes } from "@/utils/routes";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";
import { useGuestIdentityForm } from "@/features/events/hooks/useGuestIdentityForm";

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
      className="bg-brand-light text-brand-dark rounded-control shadow-card absolute top-full right-0 z-300 mt-2 max-h-[min(85vh,calc(100vh-5rem))] w-[min(calc(100vw-24px),320px)] overflow-y-auto border border-stone-200 ring-1 ring-stone-900/10"
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
          className="text-brand-dark rounded-control focus-visible:ring-brand-secondary shrink-0 p-1 transition-colors hover:bg-stone-200 focus-visible:ring-2 focus-visible:outline-hidden"
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

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    storedUser,
    setUser,
    clearUser,
  } = useGuestIdentityForm();

  const [open, setOpen] = useState(false);
  const closePanel = useCallback(() => setOpen(false), []);

  const saveGuest = handleSubmit((data) => {
    setUser({ name: data.name, email: data.email });
    closePanel();
  });

  const clearGuest = () => {
    clearUser();
    reset({ name: "", email: "" });
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
        className="rounded-control h-9 w-28 shrink-0 bg-white/20 sm:w-36"
        aria-hidden
      />
    );
  }

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="rounded-control focus-visible:ring-offset-brand-primary flex max-w-[min(14rem,46vw)] items-center gap-1 py-1.5 pr-1.5 pl-2 text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:outline-hidden sm:max-w-xs sm:gap-1.5 sm:pl-2.5"
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
                  <span className="font-semibold">Nimi:</span>{" "}
                  {sessionUser.name}
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
          <form onSubmit={saveGuest} className="flex flex-col gap-3">
            <div>
              <label className="text-brand-dark mb-1 block text-xs font-semibold">
                Nimi
              </label>
              <Input
                {...register("name")}
                placeholder="Nimi"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </div>
            <div>
              <label className="text-brand-dark mb-1 block text-xs font-semibold">
                Sähköposti
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="sinä@example.com"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <Button
                type="submit"
                variant="filled"
                color="primary"
                className="w-full justify-center"
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
              <p className="mt-2 border-t border-stone-200 pt-3 text-center text-[0.65rem] text-stone-500 sm:text-xs">
                <Link
                  href={routes.auth.login}
                  onClick={closePanel}
                  className="text-brand-secondary focus-visible:ring-brand-secondary font-medium underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-hidden"
                >
                  Kirjaudu sisään
                </Link>
              </p>
            </div>
          </form>
        )}
      </AccountDropdownPanel>
    </div>
  );
}
