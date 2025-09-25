import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("🔍 SUPABASE URL:", supabaseUrl);
console.log("🔍 SUPABASE KEY:", supabaseAnonKey ? "KEY LOADED" : "NO KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
