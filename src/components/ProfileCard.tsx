import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { useListStore } from "@/store/useListStore";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  onProfileClick?: (username: string) => void;
  animationDelay?: number;
}

const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "#e1306c",
  youtube:   "#ff4444",
  tiktok:    "#69c9d0",
};

export function ProfileCard({
  profile,
  platform,
  onProfileClick,
  animationDelay = 0,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const addProfile  = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);
  const isSelected  = useListStore((s) => s.isSelected(profile.user_id));

  const platformColor = PLATFORM_COLORS[platform];

  const handleCardClick = useCallback(() => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, platform, profile.username, onProfileClick]);

  const handleListToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSelected) {
        removeProfile(profile.user_id);
      } else {
        addProfile(profile, platform);
      }
    },
    [isSelected, addProfile, removeProfile, profile, platform]
  );

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      aria-label={`View profile of ${profile.fullname}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px",
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: isSelected
          ? "1px solid var(--border-accent)"
          : "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        cursor: "pointer",
        transition: "all var(--transition)",
        animation: "fadeInUp 0.4s ease both",
        animationDelay: `${animationDelay}ms`,
        boxShadow: isSelected ? "var(--shadow-glow)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = isSelected ? "var(--shadow-glow)" : "var(--shadow-md)";
        el.style.borderColor = isSelected ? "var(--border-accent)" : "var(--border-strong)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = isSelected ? "var(--shadow-glow)" : "none";
        el.style.borderColor = isSelected ? "var(--border-accent)" : "var(--border)";
      }}
    >
      {/* Selected indicator bar */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: "linear-gradient(180deg, var(--accent) 0%, #7c3aed 100%)",
            borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)",
          }}
        />
      )}

      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={profile.picture}
          alt={profile.fullname}
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            objectFit: "cover",
            border: `2px solid ${platformColor}40`,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullname)}&background=1e1e2e&color=a78bfa&size=54`;
          }}
        />
        {/* Platform dot */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: platformColor,
            border: "2px solid var(--bg-surface)",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: "var(--text-heading)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            @{profile.username}
          </span>
          <VerifiedBadge verified={profile.is_verified} size={14} />
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {profile.fullname}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
              {formatFollowers(profile.followers)}
            </span>
          </div>
          {profile.engagement_rate !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
              </svg>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                {formatEngagementRate(profile.engagement_rate)} ER
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add to List button */}
      <button
        id={`add-to-list-${profile.user_id}`}
        onClick={handleListToggle}
        aria-label={isSelected ? `Remove ${profile.username} from list` : `Add ${profile.username} to list`}
        aria-pressed={isSelected}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          borderRadius: "var(--radius-md)",
          border: isSelected
            ? "1px solid var(--border-accent)"
            : "1px solid var(--border)",
          background: isSelected
            ? "var(--accent-dim)"
            : "var(--bg-elevated)",
          color: isSelected
            ? "var(--accent-bright)"
            : "var(--text-secondary)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          flexShrink: 0,
          transition: "all var(--transition)",
          fontFamily: "var(--font-sans)",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-dim)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-accent)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-bright)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          }
        }}
      >
        {isSelected ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Added
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add to List
          </>
        )}
      </button>
    </div>
  );
}
