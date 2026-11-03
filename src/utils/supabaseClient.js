import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseUrl = rawSupabaseUrl
  .replace(/\/+(rest|auth)\/v1\/?$/i, "")
  .replace(/\/+$/, "");
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

export const ADMIN_AUTH_STORAGE_KEY = "noor_supabase_admin_auth";

export const isSupabaseAuthConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("[YOUR-PROJECT-REF]") &&
    !supabaseAnonKey.includes("your-supabase-anon")
);

export const supabase = isSupabaseAuthConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: ADMIN_AUTH_STORAGE_KEY,
      },
    })
  : null;
