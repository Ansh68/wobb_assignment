import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useListStore } from "@/store/useListStore";
import { SelectedListPanel } from "./SelectedListPanel.tsx";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const count = useListStore((s) => s.selectedProfiles.length);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Navbar ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(8, 8, 16, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                boxShadow: "0 0 16px rgba(139,92,246,0.4)",
              }}
            >
              ✦
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "-0.03em",
                color: "var(--text-heading)",
              }}
            >
              Wobb
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-muted)",
                marginLeft: -4,
              }}
            >
              Influencers
            </span>
          </Link>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* My List button */}
            <button
              id="open-list-panel-btn"
              onClick={() => setPanelOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                border: count > 0 ? "1px solid var(--border-accent)" : "1px solid var(--border)",
                background: count > 0 ? "var(--accent-dim)" : "transparent",
                color: count > 0 ? "var(--accent-bright)" : "var(--text-secondary)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all var(--transition)",
                fontFamily: "var(--font-sans)",
              }}
              aria-label={`Open selected list (${count} profiles)`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              My List
              {count > 0 && (
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)",
                    color: "#fff",
                    borderRadius: "var(--radius-full)",
                    fontSize: 11,
                    fontWeight: 700,
                    minWidth: 20,
                    height: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Page title ── */}
      {title && (
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "32px 24px 0",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-heading)",
              marginBottom: 4,
            }}
          >
            {title}
          </h1>
        </div>
      )}

      {/* ── Main content ── */}
      <main style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "0 24px 48px" }}>
        {children}
      </main>

      {/* ── Selected List Side Panel ── */}
      <SelectedListPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  );
}
