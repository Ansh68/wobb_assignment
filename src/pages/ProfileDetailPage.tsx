import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Loader2, ChevronLeft, AlertCircle, SearchX } from "lucide-react";
import toast from "react-hot-toast";

import { Layout } from "@/components/Layout";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { Button } from "@/components/ui/Button";

import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";

import type { ProfileDetailResponse, FullUserProfile, Platform } from "@/types";

type LoadingState = "loading" | "success" | "error";


export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") ?? "unknown") as Platform | "unknown";

  const [data, setData] = useState<ProfileDetailResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  // Zustand selectors — each component only subscribes to what it needs
  const addProfile = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);
  const isSelected = useListStore((s) =>
    data ? s.isSelected(data.data.user_profile.user_id) : false
  );

  // Load profile data (cancellable on unmount / username change)
  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    loadProfileByUsername(username).then((result) => {
      if (cancelled) return;
      setData(result);
      setLoadingState(result ? "success" : "error");
    });

    return () => {
      cancelled = true;
    };
  }, [username]);

  // Toggle Add / Remove from list with toast feedback
  const handleListToggle = useCallback(() => {
    if (!data || platform === "unknown") return;
    const user: FullUserProfile = data.data.user_profile;

    if (isSelected) {
      removeProfile(user.user_id);
      toast(`Removed @${user.username} from your list`, {
        icon: "✕",
        style: { background: "#1e1e2e", color: "#f0f0ff", border: "1px solid rgba(255,255,255,0.08)" },
      });
    } else {
      addProfile(user, platform as Platform);
      toast.success(`@${user.username} added to your list`, {
        style: { background: "#1e1e2e", color: "#f0f0ff", border: "1px solid rgba(139,92,246,0.4)" },
        iconTheme: { primary: "#8b5cf6", secondary: "#fff" },
      });
    }
  }, [isSelected, data, addProfile, removeProfile, platform]);

  // ── Invalid username ──
  if (!username) return <InvalidProfile />;

  // ── Loading ──
  if (loadingState === "loading") return <LoadingProfile username={username} />;

  // ── Error / not found ──
  if (loadingState === "error" || !data) return <NotFoundProfile username={username} />;

  const user: FullUserProfile = data.data.user_profile;

  return (
    <Layout>
      <div style={{ paddingTop: 28, marginBottom: 28 }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="ghost" size="sm">
            <ChevronLeft size={14} />
            Back to search
          </Button>
        </Link>
      </div>

      <ProfileHero
        user={user}
        platform={platform}
        isSelected={isSelected}
        onListToggle={handleListToggle}
      />

      <ProfileStats user={user} />
    </Layout>
  );
}



function InvalidProfile() {
  return (
    <Layout>
      <EmptyState
        icon={<AlertCircle size={48} color="var(--text-muted)" />}
        title="Invalid URL"
        description="This profile link is missing a username."
        action={<BackButton />}
      />
    </Layout>
  );
}

function LoadingProfile({ username }: { username: string }) {
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
        <Loader2
          size={40}
          color="var(--accent)"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Loading profile…
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );
}

function NotFoundProfile({ username }: { username: string }) {
  return (
    <Layout title={`@${username}`}>
      <EmptyState
        icon={<SearchX size={48} color="var(--text-muted)" />}
        title="Profile not found"
        description={`No detailed data available for @${username}.`}
        action={<BackButton />}
      />
    </Layout>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
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
      {icon}
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>
        {title}
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 300 }}>
        {description}
      </p>
      {action}
    </div>
  );
}

function BackButton() {
  return (
    <Link to="/" style={{ textDecoration: "none", marginTop: 8 }}>
      <Button variant="primary" size="md">
        <ChevronLeft size={14} />
        Back to search
      </Button>
    </Link>
  );
}
