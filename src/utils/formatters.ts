/**
 * Format a follower/view count into a human-readable string.
 * e.g. 1200000 → "1.2M", 45000 → "45K"
 */
export function formatFollowers(count: number): string {
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(1) + "K";
  return count.toString();
}

/**
 * Format a raw count (followers, views, etc.) with M/K suffix.
 * Alias for formatFollowers for semantic clarity.
 */
export const formatCount = formatFollowers;

/**
 * Format an engagement rate (decimal fraction) as a percentage string.
 * e.g. 0.0121 → "1.21%"
 * Bug fix: was previously multiplied by 10000 (wrong), now correctly * 100.
 */
export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || rate === null) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}

/**
 * Format a large integer with comma separators.
 * e.g. 7786266 → "7,786,266"
 */
export function formatInteger(n: number): string {
  return n.toLocaleString();
}
