import type { AlerData } from "../utils/alertStore";
import { Alert } from "./Alert";
import { motion, AnimatePresence } from "framer-motion";

export interface AlertStackProps {
  alerts: AlerData[];
}

export function AlertStack(props: AlertStackProps) {
  return (
    <motion.div
      data-active={props.alerts.length > 0}
      className="fixed bottom-0 left-0 z-[400] flex max-w-[60vw] flex-col items-start justify-start gap-4 p-8 d-inactive:pointer-events-none sm:max-w-sm sm:justify-end"
    >
      <AnimatePresence>
        {props.alerts.map((alert) => {
          return (
            <motion.div
              className="w-max list-none"
              layout="position"
              key={alert.id}
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50, type: "tween" }}
            >
              <Alert
                title={alert.title}
                description={alert.description}
                variant={alert.variant}
                timeoutMs={alert.timeoutMs}
                createdAt={alert.createdAt}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
