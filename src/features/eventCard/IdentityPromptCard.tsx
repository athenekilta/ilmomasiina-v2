"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useUser } from "@/features/auth/hooks/useUser";
import { useGuestIdentityForm } from "@/features/events/hooks/useGuestIdentityForm";

/* Runs the full height of the card along its edge, so this card reads
   differently from an event card (which wears its image as a wide banner
   across the top). */
const PROMPT_IMAGE = "/placeholders/kaappikello.png";

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
      className="rounded-card mb-4 flex w-full overflow-hidden border border-stone-200 bg-white"
    >
      <div className="min-w-0 flex-1 p-4 sm:p-5">
        <h2
          id="identity-prompt-title"
          className="text-brand-secondary text-base font-bold tracking-tight sm:text-lg"
        >
          Konfiguroi ilmo-identiteettisi
        </h2>
        <p className="text-brand-dark mt-1 text-sm sm:text-base">
          Nimi ja sähköposti tähän selaimeen, niin oot valmiina tappeleen
          paikoista.
        </p>

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
      </div>

      {/* Flush to the card's edge and stretched to its full height — the
          card is a flex row, so this column takes whatever height the copy
          and the form end up needing. */}
      {/* `contain` rather than `cover`, with room around it: the clock is a
          tall object and cropping it to the column's width cut its sides
          off. No background of its own — it sits on the card. */}
      {/* Wide enough that the clock's height, not the column's width, is
          what limits it — the image is 400×728, so filling the card's
          height needs roughly 55% of that height in width. */}
      <div className="w-36 shrink-0 pt-2 pr-3 pl-1 sm:w-44 sm:pr-4">
        {/* Stands on the card's bottom edge and takes nearly its full
            height: `object-bottom` puts the leftover space above the clock
            rather than splitting it evenly, so the case never floats. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PROMPT_IMAGE}
          alt=""
          aria-hidden
          className="h-full w-full object-contain object-bottom"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    </section>
  );
}
