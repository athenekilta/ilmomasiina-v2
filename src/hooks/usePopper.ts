import { useState } from "react";
import { usePopper as useReactPopper } from "react-popper";

export type UsePopperOptions = NonNullable<
  Parameters<typeof useReactPopper>[2]
>;

export function usePopper(options?: UsePopperOptions) {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  return {
    popper: useReactPopper(referenceElement, popperElement, options),
    setReferenceElement,
    setPopperElement,
    referenceElement,
    popperElement,
  };
}
