import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_SECRET =
  process.env.VITE_SUPABASE_ADMIN_SECRET ||
  process.env.ADMIN_SECRET ||
  'fallback-secret-for-dev';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

function xor(text: string, key: string): string {
  return Array.from(text)
    .map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)),
    )
    .join('');
}

function decode(token: string): string | null {
  try {
    const encrypted = Buffer.from(token, 'base64').toString('binary');
    const decrypted = xor(encrypted, ADMIN_SECRET);
    const parts = decrypted.split(':');
    if (parts.length < 2) return null;
    return parts.slice(1).join(':');
  } catch (e) {
    return null;
  }
}

export function validateAdmin(event: any) {
  const authHeader = event.headers['x-admin-auth'];

  if (!authHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized: Missing auth header' }),
    };
  }

  const decodedPassword = decode(authHeader);

  if (!decodedPassword || decodedPassword !== ADMIN_PASSWORD) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized: Invalid credentials' }),
    };
  }

  return null;
}

export function errorResponse(error: any) {
  console.error('API Error:', error);
  return {
    statusCode: 500,
    body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
  };
}

export function successResponse(data: any) {
  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  };
}
