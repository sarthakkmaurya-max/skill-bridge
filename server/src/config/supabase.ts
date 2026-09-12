import WebSocket from 'ws';

// Polyfill WebSocket for Node.js < 22 environments so Supabase Realtime client initializes gracefully
if (!globalThis.WebSocket) {
  (globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket = WebSocket;
}

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your-supabase')
);

// Regular client for user context (respects RLS)
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Admin client for backend-level operations (bypasses RLS)
export const supabaseAdmin: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseServiceRoleKey && !supabaseServiceRoleKey.includes('your-service')
    ? supabaseServiceRoleKey
    : (isSupabaseConfigured ? supabaseAnonKey : 'placeholder-admin-key'),
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

if (!isSupabaseConfigured) {
  console.warn('⚠️  [SkillBridge Server] Supabase environment variables not configured or using placeholders.');
  console.warn('⚠️  Please provide SUPABASE_URL and SUPABASE_ANON_KEY in .env to connect to your live project.');
}