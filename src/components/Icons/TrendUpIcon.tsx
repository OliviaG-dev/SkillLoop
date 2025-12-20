type TrendUpIconProps = {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
};

export function TrendUpIcon({ className = '', size = 24, style }: TrendUpIconProps) {
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
      <path
        d="M23 6L13.5 15.5L8.5 10.5L1 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 6H23V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

