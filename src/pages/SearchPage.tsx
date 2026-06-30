import { useState, useMemo, useCallback } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized: only recompute when platform changes
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);

  // Memoized: only recompute when profiles list or query changes
  const filteredProfiles = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery(""); // reset search on platform switch
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

  // No-op: navigation is handled inside ProfileCard itself
  const handleProfileClick = useCallback(() => {}, []);

  return (
    <Layout title="Find Influencers">
      {/* Subtitle */}
      <p
        style={{
          fontSize: 15,
          color: "var(--text-secondary)",
          marginBottom: 32,
          marginTop: 8,
        }}
      >
        Browse top creators across Instagram, YouTube, and TikTok
      </p>

      {/* Filters */}
      <PlatformFilter
        selected={platform}
        onChange={handlePlatformChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Results count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {searchQuery
            ? `${filteredProfiles.length} of ${allProfiles.length} results`
            : `${allProfiles.length} influencers`}
        </p>
      </div>

      {/* Profile grid */}
      <ProfileList
        profiles={filteredProfiles}
        platform={platform}
        onProfileClick={handleProfileClick}
      />
    </Layout>
  );
}
