import { ArrowUpRight, Plus, Check } from "lucide-react";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { PlatformBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getPlatformMeta } from "@/constants/platform";
import { getPlatformLabel } from "@/utils/dataHelpers";
import type { FullUserProfile, Platform } from "@/types";

interface ProfileHeroProps {
  user: FullUserProfile;
  platform: Platform | "unknown";
  isSelected: boolean;
  onListToggle: () => void;
}


export function ProfileHero({
  user,
  platform,
  isSelected,
  onListToggle,
}: ProfileHeroProps) {
  const meta = getPlatformMeta(platform);
  const isPlatformKnown = platform !== "unknown";

  return (
    <div
      className="glass-card"
      style={{
        padding: "clamp(24px, 4vw, 40px)",
        marginBottom: 24,
        animation: "fadeInUp 0.4s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background radial glow tied to the platform colour */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${meta.color}18 0%, transparent 70%)`,
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
        {/* ── Avatar ── */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={user.picture}
            alt={user.fullname}
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${meta.color}60`,
              boxShadow: `0 0 30px ${meta.color}30`,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.fullname
              )}&background=1e1e2e&color=a78bfa&size=96`;
            }}
          />
          {/* Platform label badge anchored to the avatar */}
          <div style={{ position: "absolute", bottom: -6, right: -8 }}>
            <PlatformBadge platform={platform} />
          </div>
        </div>

        {/* ── Info + actions ── */}
        <div style={{ flex: 1, minWidth: 200 }}>
          {/* Name row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            <h1
              style={{
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 800,
                color: "var(--text-heading)",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              @{user.username}
            </h1>
            <VerifiedBadge verified={user.is_verified} size={22} />
          </div>

          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 8 }}>
            {user.fullname}
          </p>

          {/* Bio */}
          {user.description && (
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: 560,
                marginBottom: 20,
              }}
            >
              {user.description}
            </p>
          )}

          {/* ── Action buttons ── */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              id="detail-add-to-list-btn"
              variant={isSelected ? "primary" : "outline"}
              size="md"
              onClick={onListToggle}
              disabled={!isPlatformKnown}
              aria-pressed={isSelected}
              aria-label={isSelected ? "Remove from list" : "Add to list"}
            >
              {isSelected ? (
                <>
                  <Check size={14} />
                  Added to List
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Add to List
                </>
              )}
            </Button>

            {user.url && (
              <a
                href={user.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ui-btn ui-btn-ghost ui-btn-md"
              >
                <ArrowUpRight size={14} />
                {isPlatformKnown
                  ? `View on ${getPlatformLabel(platform as Platform)}`
                  : "View Profile"}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
