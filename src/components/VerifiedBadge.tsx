interface VerifiedBadgeProps {
  verified: boolean;
  size?: number;
}

export function VerifiedBadge({ verified, size = 16 }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Verified"
      role="img"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="12" fill="#8b5cf6" />
      <path
        d="M7 12.5l3.5 3.5 6.5-7"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
