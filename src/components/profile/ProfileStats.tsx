import {
  Users,
  TrendingUp,
  Heart,
  Image,
  ThumbsUp,
  MessageCircle,
  Eye,
  Video,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { formatFollowers, formatEngagementRate, formatInteger } from "@/utils/formatters";
import type { FullUserProfile } from "@/types";

interface ProfileStatsProps {
  user: FullUserProfile;
}

/**
 * Stats grid for the profile detail page.
 * Extracted from ProfileDetailPage to reduce file size.
 */
export function ProfileStats({ user }: ProfileStatsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 170px), 1fr))",
        gap: 12,
        animation: "fadeInUp 0.5s ease 0.1s both",
      }}
    >
      <StatCard
        label="Followers"
        value={formatFollowers(user.followers)}
        Icon={Users}
      />

      <StatCard
        label="Engagement Rate"
        value={formatEngagementRate(user.engagement_rate)}
        Icon={TrendingUp}
        accentColor="#22d3ee"
      />

      {user.engagements !== undefined && (
        <StatCard
          label="Engagements"
          value={formatInteger(user.engagements)}
          Icon={Heart}
          accentColor="#f43f5e"
        />
      )}

      {user.posts_count !== undefined && (
        <StatCard
          label="Posts"
          value={user.posts_count.toLocaleString()}
          Icon={Image}
          accentColor="#f59e0b"
        />
      )}

      {user.avg_likes !== undefined && (
        <StatCard
          label="Avg. Likes"
          value={formatFollowers(user.avg_likes)}
          Icon={ThumbsUp}
          accentColor="#ec4899"
        />
      )}

      {user.avg_comments !== undefined && (
        <StatCard
          label="Avg. Comments"
          value={user.avg_comments.toLocaleString()}
          Icon={MessageCircle}
          accentColor="#06b6d4"
        />
      )}

      {user.avg_views !== undefined && user.avg_views > 0 && (
        <StatCard
          label="Avg. Views"
          value={formatFollowers(user.avg_views)}
          Icon={Eye}
          accentColor="#8b5cf6"
        />
      )}

      {user.avg_reels_plays !== undefined && user.avg_reels_plays > 0 && (
        <StatCard
          label="Reel Plays"
          value={formatFollowers(user.avg_reels_plays)}
          Icon={Video}
          accentColor="#a855f7"
        />
      )}
    </div>
  );
}
