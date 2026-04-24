import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function createLazySupabase(url: string, key: string, options: any) {
  let client: any;
  return new Proxy({} as any, {
    get(_, prop) {
      if (!client) {
        client = createClient(url, key, options);
      }
      return client[prop];
    },
  });
}

export const supabase = createLazySupabase(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const supabaseAdmin = createLazySupabase(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Check if Supabase is connected
export const isSupabaseConnected = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-url');
};
