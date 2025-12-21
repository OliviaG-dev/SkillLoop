type SparkleIconProps = {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
};

export function SparkleIcon({ className = '', size = 24, style }: SparkleIconProps) {
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
        d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 2L5.5 4.5L8 5L5.5 5.5L5 8L4.5 5.5L2 5L4.5 4.5L5 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 16L19.5 18.5L22 19L19.5 19.5L19 22L18.5 19.5L16 19L18.5 18.5L19 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

