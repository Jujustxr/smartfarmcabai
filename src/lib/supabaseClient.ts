import { createClient } from "@supabase/supabase-js";

// Read env vars with safe fallbacks so we never pass `undefined` to createClient
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? "").toString();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").toString();

if (import.meta.env.DEV) {
  console.log("🔍 SUPABASE URL:", supabaseUrl || "(missing)");
  console.log("🔍 SUPABASE KEY:", supabaseAnonKey ? "✅ KEY LOADED" : "❌ NO KEY");
}

// If either value is missing, log a clear, actionable message.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Supabase URL or Anon Key not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env and restart the dev server."
  );
  console.error(
    "    Example .env entries:\n    VITE_SUPABASE_URL=https://your-project.supabase.co\n    VITE_SUPABASE_ANON_KEY=eyJ..."
  );
}

// createClient expects strings; use the (possibly empty) values above so we don't pass undefined.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
