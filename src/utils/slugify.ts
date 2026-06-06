/**
 * Converts a string (including Vietnamese) to an ASCII slug.
 *
 * Steps:
 * - Lowercase + trim
 * - Map `đ`/`Đ` to `d` (these do not decompose via NFD)
 * - Decompose accented characters (NFD) and strip combining marks
 * - Replace any remaining non-alphanumeric runs with the separator
 * - Trim leading/trailing separators
 *
 * Examples:
 * - `Hà Nội`     -> `ha-noi`
 * - `Đà Nẵng`    -> `da-nang`
 * - `Hồ Chí Minh`-> `ho-chi-minh`
 *
 * @param input     The source text.
 * @param separator Separator between words (default `-`).
 */
export function slugify(input: string, separator = '-'): string {
  const sep = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return input
    .toLowerCase()
    .trim()
    .replace(/đ/g, 'd')
    .normalize('NFD') // split base char + diacritic
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritical marks
    .replace(/[^a-z0-9]+/g, separator) // non-alphanumeric -> separator
    .replace(new RegExp(`${sep}+`, 'g'), separator) // collapse repeats
    .replace(new RegExp(`^${sep}+|${sep}+$`, 'g'), ''); // trim separators
}
