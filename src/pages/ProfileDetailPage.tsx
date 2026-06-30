import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { StatCard } from "@/components/StatCard";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import {
  formatFollowers,
  formatEngagementRate,
  formatInteger,
} from "@/utils/formatters";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";
import type { Platform } from "@/types";

const PLATFORM_COLORS: Record<string, { color: string; bg: string }> = {
  instagram: { color: "#e1306c", bg: "rgba(225,48,108,0.12)" },
  youtube:   { color: "#ff4444", bg: "rgba(255,68,68,0.12)" },
  tiktok:    { color: "#69c9d0", bg: "rgba(105,201,208,0.12)" },
  unknown:   { color: "var(--accent)", bg: "var(--accent-dim)" },
};

type LoadingState = "idle" | "loading" | "success" | "error";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "unknown") as Platform | "unknown";

  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  const addProfile    = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);
  const isSelected    = useListStore((s) =>
    profileData ? s.isSelected(profileData.data.user_profile.user_id) : false
  );

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    loadProfileByUsername(username).then((data) => {
      if (cancelled) return;
      setProfileData(data);
      setLoadingState(data ? "success" : "error");
    });
    return () => { cancelled = true; };
  }, [username]);

  const handleListToggle = useCallback(() => {
    if (!profileData) return;
    const user = profileData.data.user_profile;
    if (isSelected) {
      removeProfile(user.user_id);
    } else if (platform !== "unknown") {
      addProfile(user, platform as Platform);
    }
  }, [isSelected, profileData, addProfile, removeProfile, platform]);

  // ── Invalid state ──
  if (!username) {
    return (
      <Layout>
        <p style={{ color: "var(--text-muted)" }}>Invalid profile URL.</p>
        <Link to="/" style={{ color: "var(--accent-bright)" }}>
          ← Back to search
        </Link>
      </Layout>
    );
  }

  // ── Loading ──
  if (loadingState === "loading" || loadingState === "idle") {
    return (
      <Layout title={`@${username}`}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: "80px 0",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid var(--border)",
              borderTopColor: "var(--accent)",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Loading profile…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Layout>
    );
  }

  // ── Error / not found ──
  if (loadingState === "error" || !profileData) {
    return (
      <Layout title={`@${username}`}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: "80px 0",
            textAlign: "center",
            animation: "fadeInUp 0.4s ease",
          }}
        >
          <div style={{ fontSize: 52 }}>😕</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-heading)" }}>
            Profile not found
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
            No detailed data available for{" "}
            <span style={{ color: "var(--text-primary)" }}>@{username}</span>.
          </p>
          <Link
            to="/"
            className="btn btn-primary"
            style={{ marginTop: 8, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            ← Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const platformTheme = PLATFORM_COLORS[platform] ?? PLATFORM_COLORS.unknown;

  return (
    <Layout>
      {/* Back link */}
      <div style={{ paddingTop: 28, marginBottom: 28 }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--text-secondary)",
            fontSize: 13,
            fontWeight: 500,
            transition: "color var(--transition)",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLAnchorElement).style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLAnchorElement).style.color = "var(--text-secondary)")
          }
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to search
        </Link>
      </div>

      {/* ── Hero Section ── */}
      <div
        style={{
          background: "var(--bg-glass)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "clamp(24px, 4vw, 40px)",
          marginBottom: 24,
          animation: "fadeInUp 0.4s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${platformTheme.color}20 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 28,
            alignItems: "flex-start",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src={user.picture}
              alt={user.fullname}
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${platformTheme.color}60`,
                boxShadow: `0 0 30px ${platformTheme.color}30`,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=1e1e2e&color=a78bfa&size=96`;
              }}
            />
            {/* Platform badge */}
            <div
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                padding: "3px 8px",
                borderRadius: "var(--radius-full)",
                background: platformTheme.bg,
                border: `1px solid ${platformTheme.color}40`,
                color: platformTheme.color,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {platform !== "unknown" ? getPlatformLabel(platform as Platform) : platform}
            </div>
          </div>

          {/* Profile info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <h1
                style={{
                  fontSize: "clamp(20px, 3vw, 28px)",
                  fontWeight: 800,
                  color: "var(--text-heading)",
                  letterSpacing: "-0.03em",
                }}
              >
                @{user.username}
              </h1>
              <VerifiedBadge verified={user.is_verified} size={22} />
            </div>

            <p
              style={{
                fontSize: 15,
                color: "var(--text-secondary)",
                marginBottom: 8,
              }}
            >
              {user.fullname}
            </p>

            {user.description && (
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  maxWidth: 560,
                  marginBottom: 16,
                }}
              >
                {user.description}
              </p>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {/* Add / Remove list */}
              <button
                id={`detail-add-to-list-btn`}
                onClick={handleListToggle}
                aria-pressed={isSelected}
                aria-label={isSelected ? "Remove from list" : "Add to list"}
                disabled={platform === "unknown"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  borderRadius: "var(--radius-md)",
                  border: isSelected
                    ? "1px solid var(--border-accent)"
                    : "1px solid var(--border)",
                  background: isSelected
                    ? "linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)"
                    : "var(--bg-elevated)",
                  color: isSelected ? "#fff" : "var(--text-primary)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: platform === "unknown" ? "not-allowed" : "pointer",
                  transition: "all var(--transition)",
                  fontFamily: "var(--font-sans)",
                  opacity: platform === "unknown" ? 0.5 : 1,
                  boxShadow: isSelected ? "0 0 20px rgba(139,92,246,0.35)" : "none",
                }}
              >
                {isSelected ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Added to List
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Add to List
                  </>
                )}
              </button>

              {/* View on platform */}
              {user.url && (
                <a
                  href={user.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  style={{ textDecoration: "none" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  View on {platform !== "unknown" ? getPlatformLabel(platform as Platform) : "Platform"}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 180px), 1fr))",
          gap: 12,
          animation: "fadeInUp 0.5s ease 0.1s both",
        }}
      >
        <StatCard
          label="Followers"
          value={formatFollowers(user.followers)}
          icon="👥"
        />

        <StatCard
          label="Engagement Rate"
          // Bug fix: was * 10000, now correctly * 100
          value={formatEngagementRate(user.engagement_rate)}
          icon="📈"
        />

        {user.engagements !== undefined && (
          <StatCard
            label="Engagements"
            // Bug fix: was showing rate instead of count
            value={formatInteger(user.engagements)}
            icon="❤️"
          />
        )}

        {user.posts_count !== undefined && (
          <StatCard
            label="Posts"
            value={user.posts_count.toLocaleString()}
            icon="📷"
          />
        )}

        {user.avg_likes !== undefined && (
          <StatCard
            label="Avg. Likes"
            value={formatFollowers(user.avg_likes)}
            icon="👍"
          />
        )}

        {user.avg_comments !== undefined && (
          <StatCard
            label="Avg. Comments"
            value={user.avg_comments.toLocaleString()}
            icon="💬"
          />
        )}

        {user.avg_views !== undefined && user.avg_views > 0 && (
          <StatCard
            label="Avg. Views"
            value={formatFollowers(user.avg_views)}
            icon="👁️"
          />
        )}

        {user.avg_reels_plays !== undefined && user.avg_reels_plays > 0 && (
          <StatCard
            label="Avg. Reel Plays"
            value={formatFollowers(user.avg_reels_plays)}
            icon="🎬"
          />
        )}
      </div>
    </Layout>
  );
}
