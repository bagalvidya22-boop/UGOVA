import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function makeSafeClient(url: string, key: string, options: any): SupabaseClient | null {
  if (!url || url === 'your-supabase-url') return null;
  try {
    return createClient(url, key, options);
  } catch {
    return null;
  }
}

const _supabase = makeSafeClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

const _supabaseAdmin = makeSafeClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function createProxy(client: SupabaseClient | null): any {
  return new Proxy({} as any, {
    get(_, prop) {
      if (!client) {
        return () => Promise.resolve({ data: null, error: new Error('Supabase not configured') });
      }
      return (client as any)[prop];
    },
  });
}

export const supabase = createProxy(_supabase);
export const supabaseAdmin = createProxy(_supabaseAdmin);

export const isSupabaseConnected = () => {
  return !!(_supabase && supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-url');
};
