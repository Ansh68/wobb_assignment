import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const PLATFORM_META: Record<Platform, { emoji: string; color: string; dimColor: string }> = {
  instagram: { emoji: "📸", color: "#e1306c", dimColor: "rgba(225,48,108,0.15)" },
  youtube:   { emoji: "▶️", color: "#ff4444", dimColor: "rgba(255,68,68,0.15)" },
  tiktok:    { emoji: "🎵", color: "#69c9d0", dimColor: "rgba(105,201,208,0.15)" },
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Platform pills */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {PLATFORMS.map((p) => {
          const isSelected = selected === p;
          const meta = PLATFORM_META[p];
          return (
            <button
              key={p}
              id={`platform-tab-${p}`}
              type="button"
              onClick={() => onChange(p)}
              aria-pressed={isSelected}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: "var(--radius-full)",
                border: isSelected
                  ? `1px solid ${meta.color}60`
                  : "1px solid var(--border)",
                background: isSelected ? meta.dimColor : "var(--bg-elevated)",
                color: isSelected ? meta.color : "var(--text-secondary)",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all var(--transition)",
                fontFamily: "var(--font-sans)",
                boxShadow: isSelected ? `0 0 16px ${meta.color}20` : "none",
                transform: isSelected ? "translateY(-1px)" : "none",
              }}
            >
              <span style={{ fontSize: 16 }}>{meta.emoji}</span>
              {getPlatformLabel(p)}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      <div style={{ position: "relative", maxWidth: 480 }}>
        {/* Search icon */}
        <div
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        <input
          id="influencer-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name..."
          aria-label="Search influencers"
          style={{
            width: "100%",
            padding: "12px 40px 12px 42px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            fontSize: 14,
            fontFamily: "var(--font-sans)",
            outline: "none",
            transition: "all var(--transition)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--border-accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--accent-dim)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Clear button */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 22,
              height: 22,
              borderRadius: "var(--radius-full)",
              border: "none",
              background: "var(--text-muted)",
              color: "var(--bg-base)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
