type LightbulbIconProps = {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
};

export function LightbulbIcon({ className = '', size = 24, style }: LightbulbIconProps) {
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
        d="M9 21H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3C8 3 5 6 5 10C5 13 7 15.5 9 17V18C9 18.5523 9.44772 19 10 19H14C14.5523 19 15 18.5523 15 18V17C17 15.5 19 13 19 10C19 6 16 3 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15H12.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

