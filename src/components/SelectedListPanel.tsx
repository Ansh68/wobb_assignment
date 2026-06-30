import { useEffect, useRef } from "react";
import { useListStore } from "@/store/useListStore";
import { formatFollowers } from "@/utils/formatters";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { Link } from "react-router-dom";

interface SelectedListPanelProps {
  open: boolean;
  onClose: () => void;
}

const PLATFORM_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  instagram: { bg: "rgba(225,48,108,0.15)", text: "#e1306c" },
  youtube:   { bg: "rgba(255,68,68,0.15)",  text: "#ff6b6b" },
  tiktok:    { bg: "rgba(105,201,208,0.15)", text: "#69c9d0" },
};

export function SelectedListPanel({ open, onClose }: SelectedListPanelProps) {
  const { selectedProfiles, removeProfile, clearList } = useListStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Trap scroll on body when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          animation: "fadeIn 0.2s ease",
        }}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Selected influencer list"
        aria-modal="true"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
          background: "var(--bg-surface)",
          borderLeft: "1px solid var(--border-strong)",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              My List
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
              {selectedProfiles.length === 0
                ? "No profiles selected yet"
                : `${selectedProfiles.length} influencer${selectedProfiles.length !== 1 ? "s" : ""} selected`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all var(--transition)",
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {selectedProfiles.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                padding: "60px 0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 48 }}>🎯</div>
              <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 240 }}>
                Add influencers to your list from the search page.
              </p>
              <button
                onClick={onClose}
                className="btn btn-ghost"
                style={{ marginTop: 8 }}
              >
                Browse Influencers
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedProfiles.map(({ profile, platform }, idx) => {
                const badge = PLATFORM_BADGE_COLORS[platform] ?? { bg: "rgba(255,255,255,0.1)", text: "#fff" };
                return (
                  <div
                    key={profile.user_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      animation: "fadeInUp 0.25s ease both",
                      animationDelay: `${idx * 30}ms`,
                      transition: "border-color var(--transition)",
                    }}
                  >
                    {/* Avatar */}
                    <img
                      src={profile.picture}
                      alt={profile.fullname}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid var(--border-strong)",
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullname)}&background=1e1e2e&color=a78bfa`;
                      }}
                    />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Link
                          to={`/profile/${profile.username}?platform=${platform}`}
                          onClick={onClose}
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "var(--text-heading)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          @{profile.username}
                        </Link>
                        {profile.is_verified && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#8b5cf6" />
                            <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 7px",
                            borderRadius: "var(--radius-full)",
                            background: badge.bg,
                            color: badge.text,
                          }}
                        >
                          {getPlatformLabel(platform)}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {formatFollowers(profile.followers)} followers
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeProfile(profile.user_id)}
                      aria-label={`Remove ${profile.username} from list`}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        background: "rgba(239,68,68,0.08)",
                        color: "#f87171",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        fontSize: 14,
                        transition: "all var(--transition)",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {selectedProfiles.length > 0 && (
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <button
              onClick={clearList}
              className="btn btn-danger"
              style={{ flex: 1, justifyContent: "center" }}
              id="clear-list-btn"
            >
              Clear All
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
