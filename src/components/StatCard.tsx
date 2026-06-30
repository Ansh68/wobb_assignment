interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  accent?: string;
}

export function StatCard({ label, value, icon, accent = "var(--accent)" }: StatCardProps) {
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        transition: "border-color var(--transition)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-accent)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {icon && (
          <span style={{ fontSize: 14, color: accent }}>{icon}</span>
        )}
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "var(--text-heading)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}
