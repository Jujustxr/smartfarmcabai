import { supabase } from "../../../lib/supabaseClient";

export async function fetchLatestSensorData() {
  const { data, error } = await supabase
    .from("sensor_data")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
    
  if (error) throw error;
  return data;
}

export async function fetchHistoricalData(limit = 100) {
  const { data, error } = await supabase
    .from("sensor_data")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(limit);
    
  if (error) throw error;
  return data;
}

export async function insertSensorData(data) {
  const { error } = await supabase
    .from('sensor_data')
    .insert({
      temperature: data.temperature,
      humidity: data.humidity,
      soil_percent: data.soilMoisture,
      pump_status: data.pumpStatus || 'Auto',
      created_at: new Date().toISOString()
    });
    
  if (error) throw error;
}

export function subscribeToSensorData(callback) {
  return supabase
    .channel('sensor_changes')
    .on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'sensor_data',
        filter: `created_at=gt.${new Date().toISOString()}`
      },
      (payload) => callback(payload.new)
    )
    .subscribe();
}