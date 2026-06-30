import { useState, useMemo, useCallback } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized: recomputed only when platform changes
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);

  // Memoized: recomputed only when the list or query changes
  const filteredProfiles = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery(""); // clear search on platform switch
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

  return (
    <Layout title="Find Influencers">
      <p className="page-subtitle">
        Browse top creators across Instagram, YouTube, and TikTok
      </p>

      <PlatformFilter
        selected={platform}
        onChange={handlePlatformChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <p className="results-count" aria-live="polite">
        {searchQuery
          ? `${filteredProfiles.length} of ${allProfiles.length} results`
          : `${allProfiles.length} influencers`}
      </p>

      <ProfileList profiles={filteredProfiles} platform={platform} />
    </Layout>
  );
}
