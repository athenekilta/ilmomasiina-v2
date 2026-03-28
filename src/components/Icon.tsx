export type IconProps = {
	icon: string;
	size?: number;
	className?: string;
}

export function Icon(props: IconProps) {
  return <span className="flex relative items-center">
    <i
      className={[
        "material-icons-outlined font-normal leading-none select-none",
        props.className,
      ].join(" ")}
      style={{
        fontSize: props.size ?? 24,
        width: props.size ?? 24,
        height: props.size ?? 24
      }}
    >
      {props.icon}
    </i>
  </span>
}
