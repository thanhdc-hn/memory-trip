/**
 * Formats seconds into a string label.
 * Format: mm:ss
 * If hours > 0: hh:mm:ss
 */
export function formatCooldown(seconds: number): string {
  if (seconds <= 0) return '';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }

  return `${pad(minutes)}:${pad(secs)}`;
}
