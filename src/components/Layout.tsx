import { type ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, LayoutList } from "lucide-react";
import { useListStore } from "@/store/useListStore";
import { SelectedListPanel } from "./SelectedListPanel";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const count = useListStore((s) => s.selectedProfiles.length);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" aria-label="Wobb home">
            <div className="navbar-logo-icon" aria-hidden="true">
              <Sparkles size={16} color="#fff" />
            </div>
            <span className="navbar-logo-text">Wobb</span>
            <span className="navbar-logo-sub">Influencers</span>
          </Link>

          {/* My List button */}
          <button
            id="open-list-panel-btn"
            onClick={() => setPanelOpen(true)}
            className={`navbar-list-btn ${count > 0 ? "navbar-list-btn--active" : ""}`}
            aria-label={`My list — ${count} profile${count !== 1 ? "s" : ""} selected`}
          >
            <LayoutList size={15} />
            <span>My List</span>
            {count > 0 && (
              <span className="navbar-list-count" aria-hidden="true">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Page title ── */}
      {title && (
        <div className="page-title-wrapper">
          <h1 className="page-title">{title}</h1>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="page-main">{children}</main>

      {/* ── Side Panel ── */}
      <SelectedListPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  );
}
