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
    /* Grid rather than a flex row, so the form can change which cells it
       occupies without moving in the DOM: on a narrow card it spans both
       columns (full-width fields), and once the card is wide enough it
       drops back beside the clock, which then spans both rows and keeps
       its full-card height. `@container` measures the card itself, not the
       viewport — the card is the thing that runs out of room. */
    <section
      aria-labelledby="identity-prompt-title"
      className="rounded-card @container mb-4 grid w-full grid-cols-[minmax(0,1fr)_auto] overflow-hidden border border-stone-200 bg-white"
    >
      <div className="col-start-1 row-start-1 min-w-0 p-4 pb-0 sm:p-5 sm:pb-0">
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
      </div>

      {/* Stands on the card's bottom edge: `object-bottom` puts the
          leftover space above the clock rather than splitting it evenly,
          and `contain` keeps the whole case visible — the image is 400×728,
          so cropping it to the column width cut its sides off. */}
      <div className="col-start-2 row-start-1 w-28 shrink-0 pt-6 pr-3 pl-1 @md:row-span-2 @md:w-44 @md:pt-8 @md:pr-4">
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

      <form
        onSubmit={save}
        className="col-span-2 col-start-1 row-start-2 flex flex-col gap-3 p-4 sm:p-5 @md:col-span-1 @3xl:flex-row @3xl:items-start"
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
          className="justify-center @3xl:w-auto"
        >
          Tallenna
        </Button>
      </form>
    </section>
  );
}
