const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;

const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseServiceKey && 
    !supabaseUrl.includes('your-project-id') &&
    supabaseUrl.startsWith('https://')
  );
};

if (isSupabaseConfigured()) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        transport: WebSocket,
      },
    });
    console.log(`[Supabase] Successfully connected to project: ${supabaseUrl}`);
  } catch (err) {
    console.warn('[Supabase] Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('[Supabase] No live Supabase credentials configured. Running in hybrid/demo database mode.');
}

/**
 * Validates a Supabase Auth JWT token
 * @param {string} token Bearer access token from request
 * @returns {Promise<{ user: any, error: any }>}
 */
const verifySupabaseToken = async (token) => {
  if (!supabase) {
    return { user: null, error: new Error('Supabase client not initialized') };
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return { user: null, error: error || new Error('Invalid user token') };
    }
    return { user, error: null };
  } catch (err) {
    return { user: null, error: err };
  }
};

module.exports = {
  supabase,
  isSupabaseConfigured,
  verifySupabaseToken,
};