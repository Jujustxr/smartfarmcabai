import { supabase } from "../../../lib/supabaseClient";

export async function checkSensorStatus() {
  const { data, error } = await supabase
    .from("sensor_data")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return "offline";

  const lastTime = new Date(data[0].created_at);
  const now = new Date();
  const diff = (now - lastTime) / 1000; // selisih dalam detik

  return diff <= 120 ? "online" : "offline"; // offline kalau >2 menit
}
