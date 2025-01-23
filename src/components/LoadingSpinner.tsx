import { BarLoader, BeatLoader, PuffLoader } from "react-spinners";

export type LoadingSpinnerVariant = "puff" | "bar" | "beat";

export interface LoadingSpinnerProps {
  size?: number | string;
  height?: number | string;
  width?: number | string;
  variant?: LoadingSpinnerVariant;
  color?: string;
  className?: string;
}

export function LoadingSpinner(props: LoadingSpinnerProps) {
  const size = props.size ?? 36;
  const color = props.color ?? "#ffffff";

  switch (props.variant ?? "puff") {
    case "puff":
      return (
      <PuffLoader size={size} color={color} className={props.className} />
      );
    case "beat":
      return (
      <BeatLoader size={size} color={color} className={props.className} />
      );
    case "bar":
      return (
      <BarLoader
        width={props.width}
        height={props.height}
        color={color}
        style={{ width: "100%" }}
        className={props.className}
      />
      );
    default:
      throw new Error(
        `Provide a valid variant to LoadingSpinner. Invalid variant: ${JSON.stringify(
          props.variant
        )}`
      );
  }
}
