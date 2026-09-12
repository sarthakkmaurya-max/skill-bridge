import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
const supabaseAnonKey = typeof rawKey === 'string' ? rawKey.trim() : '';

// Safe placeholder and absence detection
const isPlaceholderUrl =
  !supabaseUrl ||
  !supabaseUrl.startsWith('http') ||
  supabaseUrl.includes('your-project-ref') ||
  supabaseUrl.includes('your-project-id') ||
  supabaseUrl.includes('placeholder');

const isPlaceholderKey =
  !supabaseAnonKey ||
  supabaseAnonKey.includes('your-supabase') ||
  supabaseAnonKey.includes('anon-public-key') ||
  supabaseAnonKey.includes('placeholder') ||
  supabaseAnonKey === 'your-supabase-anon-key';

// True only when valid, non-placeholder Supabase credentials are provided
export const isSupabaseConfigured = Boolean(!isPlaceholderUrl && !isPlaceholderKey);

// Show a clear setup message in console only when these values are absent
if (!isSupabaseConfigured) {
  console.info(
    '%c[SkillBridge Auth Notice]%c Supabase local environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are absent in client/.env.\n' +
    '• Quick Sandbox Demo personas (Student, Recruiter, Admin) are fully enabled.\n' +
    '• To connect real Supabase Auth & Google Sign-In, copy client/.env.example to client/.env and provide your Project URL & public anon key.',
    'color: #38bdf8; font-weight: bold; font-size: 12px;',
    'color: inherit;'
  );
}

// Initialise Supabase correctly when values are present;
// Graceful fallback credentials ensure the application never crashes if local environment variables are missing
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
      detectSessionInUrl: isSupabaseConfigured,
    },
  }
);
