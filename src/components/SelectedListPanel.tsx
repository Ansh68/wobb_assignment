import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, Trash2, UserRound, ListX } from "lucide-react";
import { useListStore } from "@/store/useListStore";
import { formatFollowers } from "@/utils/formatters";
import { PlatformBadge } from "@/components/ui/Badge";

interface SelectedListPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SelectedListPanel({ open, onClose }: SelectedListPanelProps) {
  const { selectedProfiles, removeProfile, clearList } = useListStore();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when panel opens
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const isEmpty = selectedProfiles.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="panel-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Selected influencer list"
        aria-modal="true"
        className="panel"
      >
        {/* Header */}
        <div className="panel-header">
          <div>
            <h2 className="panel-title">My List</h2>
            <p className="panel-subtitle">
              {isEmpty
                ? "No profiles selected yet"
                : `${selectedProfiles.length} influencer${selectedProfiles.length !== 1 ? "s" : ""} selected`}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close panel"
            className="panel-close-btn"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="panel-body">
          {isEmpty ? (
            <PanelEmptyState onClose={onClose} />
          ) : (
            <div className="panel-list">
              {selectedProfiles.map(({ profile, platform }, idx) => (
                <div
                  key={profile.user_id}
                  className="panel-list-item"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <img
                    src={profile.picture}
                    alt={profile.fullname}
                    className="panel-list-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        profile.fullname
                      )}&background=1e1e2e&color=a78bfa`;
                    }}
                  />

                  <div className="panel-list-info">
                    <Link
                      to={`/profile/${profile.username}?platform=${platform}`}
                      onClick={onClose}
                      className="panel-list-username"
                    >
                      @{profile.username}
                    </Link>
                    <div className="panel-list-meta">
                      <PlatformBadge platform={platform} />
                      <span className="panel-list-followers">
                        {formatFollowers(profile.followers)} followers
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeProfile(profile.user_id)}
                    aria-label={`Remove ${profile.username} from list`}
                    className="panel-list-remove-btn"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="panel-footer">
            <button
              id="clear-list-btn"
              onClick={clearList}
              className="panel-clear-btn"
            >
              <Trash2 size={14} />
              Clear All ({selectedProfiles.length})
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function PanelEmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="panel-empty">
      <div className="panel-empty-icon">
        <UserRound size={32} color="var(--text-muted)" />
      </div>
      <p className="panel-empty-text">
        Add influencers to your list from the search page.
      </p>
      <button onClick={onClose} className="panel-empty-browse-btn">
        <ListX size={14} />
        Browse Influencers
      </button>
    </div>
  );
}
