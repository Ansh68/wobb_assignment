import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  onProfileClick: (username: string) => void;
}

export function ProfileList({ profiles, platform, onProfileClick }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "80px 0",
          textAlign: "center",
          animation: "fadeInUp 0.4s ease",
        }}
      >
        <div style={{ fontSize: 52 }}>🔍</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>
          No influencers found
        </h3>
        <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 280 }}>
          Try a different search term or switch to another platform.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 520px), 1fr))",
        gap: 12,
      }}
    >
      {profiles.map((profile, idx) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          onProfileClick={onProfileClick}
          animationDelay={idx * 40}
        />
      ))}
    </div>
  );
}
