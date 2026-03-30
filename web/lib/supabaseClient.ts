import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Don't crash at build time if env vars are missing/placeholder.
// We'll handle "not configured" in the UI.
const supabaseUrlIsUsable =
  typeof supabaseUrl === "string" && supabaseUrl.startsWith("http");

// Reusable Supabase client for the browser/client components.
export const supabase =
  supabaseUrlIsUsable && typeof supabaseAnonKey === "string" && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

