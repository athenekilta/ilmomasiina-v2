import { useAlertStore } from "../utils/alertStore";
import { AlertStack } from "./AlertStack";

export interface AlertsProps {
  children?: React.ReactNode;
}

export function Alerts(props: AlertsProps) {
  const alerts = useAlertStore((state) => state.alerts);
  return (
    <>
      <AlertStack alerts={alerts} />
      {props.children}
    </>
  );
}
