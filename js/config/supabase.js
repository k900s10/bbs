/**
 * Supabase Client Configuration
 * Resolves configuration from window.ENV (local Bun server or GitHub Actions build)
 * with a resilient fallback.
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const env = window.ENV || {};

export const SUPABASE_URL = env.SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
