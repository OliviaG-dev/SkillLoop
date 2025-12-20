type CalendarIconProps = {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
};

export function CalendarIcon({ className = '', size = 24, style }: CalendarIconProps) {
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
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16 2V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 2V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 10H21"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

