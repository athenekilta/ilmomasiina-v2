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
          className="bg-active-overlay group aria-selected:bg-primary-50 flex h-7 w-12 items-center justify-start rounded-full border border-gray-400 p-1 transition-colors aria-selected:justify-end dark:border-gray-300"
        >
          <motion.div
            layout="position"
            transition={{ duration: 0.1 }}
            className="group-aria-selected:bg-brand-secondary group-aria-selected:group-aria-disabled:bg-primary-300 h-5 w-5 rounded-full bg-slate-500 transition-colors"
          />
        </div>
      </button>
    );
  },
);
