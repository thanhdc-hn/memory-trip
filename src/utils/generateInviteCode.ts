/**
 * Generates a URL-safe invite code from a team name.
 * Rules:
 * - Lowercase only
 * - Replace spaces with -
 * - Remove special characters
 * - Kebab-case
 */
export function generateInviteCode(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^a-z0-9-]/g, '') // Remove special characters except -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .replace(/^-+|-+$/g, ''); // Trim - from start and end
}
