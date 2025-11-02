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
        className={"inline-block w-fit rounded-full disabled:opacity-70"}
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
          className="border-white-bg-4 dark:border-black-bg-5 bg-active-overlay group flex h-7 w-12 items-center justify-start rounded-full border p-1 transition-colors aria-selected:justify-end aria-selected:bg-primary-50"
        >
          <motion.div
            layout="position"
            transition={{ duration: 0.1 }}
            className="h-5 w-5 rounded-full bg-slate-500 transition-colors group-aria-selected:bg-primary-500 group-aria-selected:group-aria-disabled:bg-primary-300"
          />
        </div>
      </button>
    );
  }
);
