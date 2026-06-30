import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, Plus, Check } from "lucide-react";
import toast from "react-hot-toast";

import { VerifiedBadge } from "@/components/VerifiedBadge";
import { PlatformBadge } from "@/components/ui/Badge";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { useListStore } from "@/store/useListStore";
import { getPlatformMeta } from "@/constants/platform";

import type { Platform, UserProfileSummary } from "@/types";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  animationDelay?: number;
}

/**
 * Displays a single influencer card in the search grid.
 *
 * Performance: wrapped in React.memo — only re-renders when its own
 * `isSelected` state changes (isolated Zustand selector) or when
 * profile data itself changes.
 */
export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  animationDelay = 0,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const platformMeta = getPlatformMeta(platform);

  // Isolated selector: only this card re-renders when ITS selection changes
  const isSelected = useListStore(
    (s) => s.selectedProfiles.some((p) => p.profile.user_id === profile.user_id)
  );
  const addProfile = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);

  const handleCardClick = useCallback(() => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, platform, profile.username]);

  const handleListToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSelected) {
        removeProfile(profile.user_id);
        toast(`Removed @${profile.username}`, {
          icon: "✕",
          style: { background: "#1e1e2e", color: "#f0f0ff", border: "1px solid rgba(255,255,255,0.08)" },
        });
      } else {
        addProfile(profile, platform);
        toast.success(`@${profile.username} added to list`, {
          style: { background: "#1e1e2e", color: "#f0f0ff", border: "1px solid rgba(139,92,246,0.4)" },
          iconTheme: { primary: "#8b5cf6", secondary: "#fff" },
        });
      }
    },
    [isSelected, addProfile, removeProfile, profile, platform]
  );

  return (
    <div
      className={`profile-card ${isSelected ? "profile-card--selected" : ""}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      aria-label={`View profile of ${profile.fullname}`}
    >
      {/* Selected accent bar */}
      {isSelected && <div className="profile-card-accent-bar" aria-hidden="true" />}

      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={profile.picture}
          alt={profile.fullname}
          className="profile-card-avatar"
          style={{ borderColor: `${platformMeta.color}40` }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.fullname
            )}&background=1e1e2e&color=a78bfa&size=54`;
          }}
        />
        {/* Platform dot */}
        <div
          className="profile-card-platform-dot"
          style={{ background: platformMeta.color }}
          aria-hidden="true"
        />
      </div>

      {/* Profile info */}
      <div className="profile-card-info">
        <div className="profile-card-name-row">
          <span className="profile-card-username">@{profile.username}</span>
          <VerifiedBadge verified={profile.is_verified} size={14} />
        </div>
        <div className="profile-card-fullname">{profile.fullname}</div>

        {/* Stats */}
        <div className="profile-card-stats">
          <span className="profile-card-stat">
            <Users size={11} style={{ color: "var(--text-muted)" }} />
            {formatFollowers(profile.followers)}
          </span>
          {profile.engagement_rate !== undefined && (
            <span className="profile-card-stat">
              <TrendingUp size={11} style={{ color: "var(--text-muted)" }} />
              {formatEngagementRate(profile.engagement_rate)} ER
            </span>
          )}
          <PlatformBadge platform={platform} />
        </div>
      </div>

      {/* Add / Remove button */}
      <button
        id={`add-to-list-${profile.user_id}`}
        onClick={handleListToggle}
        aria-label={isSelected ? `Remove ${profile.username} from list` : `Add ${profile.username} to list`}
        aria-pressed={isSelected}
        className={`profile-card-list-btn ${isSelected ? "profile-card-list-btn--active" : ""}`}
      >
        {isSelected ? <Check size={13} /> : <Plus size={13} />}
        <span>{isSelected ? "Added" : "Add"}</span>
      </button>
    </div>
  );
});
