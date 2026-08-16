"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useUser } from "@/features/auth/hooks/useUser";
import { useGuestIdentityForm } from "@/features/events/hooks/useGuestIdentityForm";

/* Square by design — the event banners are 2:1, so a 1:1 image marks this
   card as something other than an event at a glance. */
const PROMPT_IMAGE = "/placeholders/paheenjohtaja.png";

/**
 * Sits between the heading and the event grid until the reader has an
 * identity stored (or is signed in), then disappears for good.
 *
 * It carries the form itself rather than pointing at the header menu: the
 * whole point is to get the two fields filled before the reader is standing
 * at a signup form with the clock running.
 */
export function IdentityPromptCard() {
  const [saved, setSaved] = useState(false);

  const sessionUser = useUser().data;
  const {
    register,
    formState: { errors },
    handleSubmit,
    storedUser,
    setUser,
  } = useGuestIdentityForm();

  const save = handleSubmit((data) => {
    setUser({ name: data.name, email: data.email });
    setSaved(true);
  });

  // Nothing to prompt for once the details exist.
  if (saved || sessionUser || storedUser?.email) return null;

  return (
    <section
      aria-labelledby="identity-prompt-title"
      className="rounded-card mb-4 w-full border border-stone-200 bg-white p-4 sm:p-5"
    >
      {/* The square stays small on mobile and sits beside the copy: given
          to the full width it would be a 375px tall block of picture above
          a two-line prompt. */}
      <div className="flex min-w-0 items-start gap-4">
        <div className="bg-brand-sand rounded-control relative size-20 shrink-0 overflow-hidden sm:size-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PROMPT_IMAGE}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2
            id="identity-prompt-title"
            className="text-brand-secondary text-base font-bold tracking-tight sm:text-lg"
          >
            Laita tietosi valmiiksi
          </h2>
          <p className="text-brand-dark mt-1 text-sm sm:text-base">
            Nimi ja sähköposti talteen nyt, niin ilmoittautuminen vie sekunnin
            — juuri silloin kun paikoista on kiire.
          </p>
        </div>
      </div>

      <form
        onSubmit={save}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <div className="min-w-0 flex-1">
          <Input
            {...register("name")}
            placeholder="Nimi"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </div>
        <div className="min-w-0 flex-1">
          <Input
            {...register("email")}
            type="email"
            placeholder="sinä@example.com"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </div>
        <Button
          type="submit"
          variant="filled"
          color="primary"
          className="justify-center sm:w-auto"
        >
          Tallenna
        </Button>
      </form>
    </section>
  );
}
