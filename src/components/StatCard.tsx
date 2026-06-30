import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  Icon: LucideIcon;
  accentColor?: string;
}

/**
 * Displays a single metric: icon + label + value.
 * Used in the profile detail stats grid.
 */
export function StatCard({
  label,
  value,
  Icon,
  accentColor = "var(--accent-bright)",
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <Icon size={14} style={{ color: accentColor, flexShrink: 0 }} />
        <span className="stat-card-label">{label}</span>
      </div>
      <div className="stat-card-value">{value}</div>
    </div>
  );
}
