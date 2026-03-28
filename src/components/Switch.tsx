import { forwardRef } from "react";
import { motion } from "framer-motion";

export interface SwitchProps {
  value: boolean;
  id?: string;
  onClick?(): void;
  onChange(b: boolean): void;
  disabled?: boolean;
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(props, ref) {
    return (
      <button
        ref={ref}
        id={props.id}
        type="button"
        className="inline-block w-fit rounded-full disabled:opacity-70 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-beige"
        disabled={props.disabled}
        onClick={() => {
          if (props.disabled) return;
          props.onClick?.();
          props.onChange(!props.value);
        }}
      >
        <div
          aria-disabled={props.disabled}
          aria-selected={props.value}
          className="group flex h-7 w-12 items-center rounded-full border border-stone-400 bg-stone-200 p-1 transition-colors aria-selected:border-brand-secondary aria-selected:bg-brand-lime"
        >
          <motion.div
            animate={{ x: props.value ? 20 : 0 }}
            transition={{ duration: 0.1 }}
            className="h-5 w-5 rounded-full border border-stone-300 bg-brand-light shadow-soft transition-colors group-aria-selected:border-brand-darkgreen group-aria-selected:bg-brand-secondary group-aria-selected:shadow-card group-aria-selected:group-aria-disabled:bg-stone-400 group-aria-selected:group-aria-disabled:border-stone-500"
          />
        </div>
      </button>
    );
  },
);
