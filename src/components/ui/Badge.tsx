import { cn } from "@/lib/utils";
import { getPlatformMeta } from "@/constants/platform";

interface BadgeProps {
  platform: string;
  className?: string;
}

/**
 * Platform-branded badge showing platform name with its brand color.
 */
export function PlatformBadge({ platform, className }: BadgeProps) {
  const meta = getPlatformMeta(platform);

  return (
    <span
      className={cn("platform-badge", className)}
      style={{
        background: meta.dimBg,
        color: meta.color,
        border: `1px solid ${meta.borderColor}`,
      }}
    >
      {meta.label}
    </span>
  );
}
