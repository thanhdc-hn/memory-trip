import { slugify } from '@/utils/slugify';

/**
 * Generates a URL-safe invite code from a team name.
 * Rules:
 * - Lowercase only
 * - Vietnamese accents transliterated to ASCII (e.g. `Hà Nội` -> `ha-noi`)
 * - Spaces and special characters become `-`
 * - Kebab-case
 */
export function generateInviteCode(name: string): string {
  return slugify(name);
}
