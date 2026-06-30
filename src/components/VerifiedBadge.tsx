import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
  size?: number;
}

/**
 * Shows a purple checkmark badge for verified accounts.
 * Uses Lucide's BadgeCheck icon for consistency.
 */
export function VerifiedBadge({ verified, size = 16 }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <BadgeCheck
      size={size}
      aria-label="Verified account"
      role="img"
      style={{ color: "var(--accent-bright)", flexShrink: 0 }}
    />
  );
}
