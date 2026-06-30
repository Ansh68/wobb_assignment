import { memo } from "react";
import { SearchX } from "lucide-react";
import { ProfileCard } from "@/components/ProfileCard";
import type { Platform, UserProfileSummary } from "@/types";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}


export const ProfileList = memo(function ProfileList({
  profiles,
  platform,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="profile-list-empty" role="status" aria-live="polite">
        <SearchX size={48} color="var(--text-muted)" />
        <h3 className="profile-list-empty-title">No influencers found</h3>
        <p className="profile-list-empty-desc">
          Try a different search term or switch to another platform.
        </p>
      </div>
    );
  }

  return (
    <div className="profile-grid">
      {profiles.map((profile, idx) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          animationDelay={idx * 40}
        />
      ))}
    </div>
  );
});
