import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (import.meta.env.DEV) {
  console.log("🔍 SUPABASE URL:", supabaseUrl);
  console.log("🔍 SUPABASE KEY:", supabaseAnonKey ? "✅ KEY LOADED" : "❌ NO KEY");
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase URL atau Key tidak ditemukan di .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
