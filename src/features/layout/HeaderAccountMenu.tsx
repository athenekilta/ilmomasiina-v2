"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, RefreshCw, UserRound } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Icon } from "@/components/Icon";
import { useGuestIdentityForm } from "@/features/events/hooks/useGuestIdentityForm";

function HeaderDropdownPanel({
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
  title: ReactNode;
  children: ReactNode;
  panelRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: Event) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
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
      className="bg-brand-light text-brand-dark rounded-card shadow-card absolute top-full right-0 z-300 mt-2 max-h-[min(85vh,calc(100vh-5rem))] w-[min(calc(100vw-24px),320px)] overflow-y-auto border border-stone-200 ring-1 ring-stone-900/10"
    >
      <div className="bg-brand-light sticky top-0 flex items-center justify-between gap-2 border-b border-stone-200 px-4 py-3">
        <h2
          id={titleId}
          className="text-brand-dark pr-2 text-sm font-bold tracking-wide uppercase"
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-brand-dark rounded-control focus-visible:ring-brand-secondary shrink-0 cursor-pointer p-1 transition-colors hover:bg-stone-200 focus-visible:ring-2 focus-visible:outline-hidden"
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

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    storedUser,
    setUser,
    clearUser,
  } = useGuestIdentityForm();

  const [open, setOpen] = useState(false);
  const closePanel = useCallback(() => setOpen(false), []);

  const saveGuest = handleSubmit(async (data) => {
    await setUser({ name: data.name, email: data.email });
    closePanel();
  });

  const clearGuest = async () => {
    await clearUser();
    reset({ name: "", email: "" });
    closePanel();
  };

  const displayLine =
    storedUser?.name?.trim() || storedUser?.email?.split("@")[0] || null;
  const subLine = storedUser?.email ?? null;
  const triggerLabel = displayLine ?? "Ilmotiedot";
  const triggerSub = subLine ?? "Nimi ja sähköposti puuttuvat";

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          displayLine
            ? `Ilmotiedot: ${displayLine ?? subLine ?? ""}`
            : "Aseta ilmotiedot"
        }
        className="rounded-control focus-visible:ring-offset-brand-primary flex cursor-pointer items-center gap-1 p-2 text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:outline-hidden sm:max-w-xs sm:gap-1.5 sm:py-1.5 sm:pr-1.5 sm:pl-2.5"
      >
        <span className="relative shrink-0 sm:hidden">
          <UserRound size={24} strokeWidth={2.25} aria-hidden />
          {displayLine && (
            <span
              className="bg-brand-lime text-brand-secondary ring-brand-primary absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full ring-2"
              aria-hidden
            >
              <Check size={10} strokeWidth={4} />
            </span>
          )}
        </span>

        <span className="hidden min-w-0 flex-1 text-left sm:block">
          <span className="block truncate text-xs font-semibold sm:text-sm">
            {triggerLabel}
          </span>
          <span className="block truncate text-[0.65rem] text-white/75 sm:text-xs">
            {triggerSub}
          </span>
        </span>
        <Icon
          icon="expand_more"
          className={`hidden shrink-0 text-white/90 transition-transform duration-200 sm:block ${open ? "rotate-180" : ""}`}
          size={20}
        />
      </button>

      <HeaderDropdownPanel
        open={open}
        onClose={closePanel}
        titleId={titleId}
        title={
          storedUser?.email ? (
            <span className="flex items-center gap-1.5">
              <Check
                size={16}
                strokeWidth={3.5}
                className="text-brand-primary shrink-0"
                aria-hidden
              />
              Ilmotiedot kunnossa
            </span>
          ) : (
            "Ilmotiedot ei kunnossa"
          )
        }
        panelRef={panelRef}
        triggerRef={triggerRef}
      >
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
              disabled={!isDirty}
              startIcon={<RefreshCw size={18} strokeWidth={2.25} />}
              className="w-full cursor-pointer justify-center"
            >
              Päivitä
            </Button>
            <Button
              type="button"
              variant="bordered"
              color="neutral"
              className="w-full cursor-pointer justify-center"
              onClick={clearGuest}
            >
              Tyhjennä tiedot
            </Button>
          </div>
        </form>
      </HeaderDropdownPanel>
    </div>
  );
}
