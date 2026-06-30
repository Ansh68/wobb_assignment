import { clsx, type ClassValue } from "clsx";

/**
 * Merges class names conditionally using clsx.
 * Use this anywhere you need conditional Tailwind / CSS class composition.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
