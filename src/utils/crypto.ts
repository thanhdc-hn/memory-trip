const SECRET =
  import.meta.env.VITE_SUPABASE_ADMIN_SECRET || 'fallback-secret-for-dev';

function xor(text: string, key: string): string {
  return Array.from(text)
    .map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)),
    )
    .join('');
}

export function encode(password: string): string {
  const salt = Math.random().toString(36).substring(2, 10);
  const combined = `${salt}:${password}`;
  const encrypted = xor(combined, SECRET);
  return btoa(encrypted);
}

export function decode(token: string): string | null {
  try {
    const encrypted = atob(token);
    const decrypted = xor(encrypted, SECRET);
    const parts = decrypted.split(':');
    if (parts.length < 2) return null;
    // Return everything after the first colon (the password)
    return parts.slice(1).join(':');
  } catch {
    return null;
  }
}
