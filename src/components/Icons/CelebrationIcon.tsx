type CelebrationIconProps = {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
};

export function CelebrationIcon({ className = '', size = 24, style }: CelebrationIconProps) {
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
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 4L5 6L7 5L6 7L8 8L6 9L7 11L5 10L4 12L3 10L1 11L2 9L0 8L2 7L1 5L3 6L4 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 16L21 18L23 17L22 19L24 20L22 21L23 23L21 22L20 24L19 22L17 23L18 21L16 20L18 19L17 17L19 18L20 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

