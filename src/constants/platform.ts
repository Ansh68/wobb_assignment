import type { Platform } from "@/types";

export interface PlatformMeta {
  label: string;
  color: string;
  dimBg: string;
  borderColor: string;
}

/**
 * Single source of truth for platform brand colors and labels.
 * Import this instead of re-defining colors in every component.
 */
export const PLATFORM_META: Record<Platform, PlatformMeta> = {
  instagram: {
    label: "Instagram",
    color: "#e1306c",
    dimBg: "rgba(225,48,108,0.12)",
    borderColor: "rgba(225,48,108,0.35)",
  },
  youtube: {
    label: "YouTube",
    color: "#ff4444",
    dimBg: "rgba(255,68,68,0.12)",
    borderColor: "rgba(255,68,68,0.35)",
  },
  tiktok: {
    label: "TikTok",
    color: "#69c9d0",
    dimBg: "rgba(105,201,208,0.12)",
    borderColor: "rgba(105,201,208,0.35)",
  },
};

export const UNKNOWN_PLATFORM_META: PlatformMeta = {
  label: "Platform",
  color: "var(--accent)",
  dimBg: "var(--accent-dim)",
  borderColor: "var(--border-accent)",
};

export function getPlatformMeta(platform: string): PlatformMeta {
  return PLATFORM_META[platform as Platform] ?? UNKNOWN_PLATFORM_META;
}
