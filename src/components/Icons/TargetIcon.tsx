type TargetIconProps = {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
};

export function TargetIcon({ className = '', size = 24, style }: TargetIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="currentColor"
      />
    </svg>
  );
}

