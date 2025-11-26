// =========================================================
// IoT Smart Farm with ESP32 + Supabase + DHT11 + Soil (Analog)
// + Water Level (Analog) + Relay Pump
// =========================================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// =====================
// WiFi Configuration
// =====================
const char* ssid = "omaga";
const char* password = "12345678";

// =====================
// Supabase Configuration
// =====================
String supabaseUrl = "https://torukaysucgikxnmphof.supabase.co";
String supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcnVrYXlzdWNnaWt4bm1waG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjQ3MjIsImV4cCI6MjA3NDMwMDcyMn0.SC85cW2NNJHfFq3qEnAou6acosYlZUbRByjigApFDBg";
String supabaseTable = "sensor_data";

// =====================
// Sensor Configuration (ESP32)
// =====================
#define DHTPIN 4      // DHT11 data pin
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define SOIL_PIN 32        // Soil sensor analog pin
#define WATER_LEVEL_PIN 33 // Water sensor analog pin

// =====================
// Relay Configuration
// =====================
#define RELAY_PIN 25
bool relayStatus = false;

// =====================
// Setup
// =====================
void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // HIGH = OFF

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.println(WiFi.localIP());

  dht.begin();
  Serial.println("DHT11 sensor started.");
}

// =====================
// Send data to Supabase
// =====================
void sendDataToSupabase(
  float temperature, float humidity,
  int soilRaw, int soilPercent, String soilStatus,
  int waterRaw, int waterPercent, String waterStatus,
  bool relayStatus
) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    String url = supabaseUrl + "/rest/v1/" + supabaseTable;
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", supabaseKey);
    http.addHeader("Authorization", "Bearer " + supabaseKey);
    http.addHeader("Prefer", "return=representation");

    DynamicJsonDocument doc(700);
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;

    doc["soil_raw"] = soilRaw;
    doc["soil_percent"] = soilPercent;
    doc["soil_status"] = soilStatus;

    doc["water_raw"] = waterRaw;
    doc["water_percent"] = waterPercent;
    doc["water_status"] = waterStatus;

    doc["relay_status"] = relayStatus ? "ON" : "OFF";

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    Serial.println(http.getString());

    http.end();
  } else {
    Serial.println("WiFi Disconnected!");
  }
}

// =====================
// Main Loop
// =====================
void loop() {

  // === Read DHT11 ===
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // === Read Soil Moisture (Analog: 0–4095) ===
  int soilRaw = analogRead(SOIL_PIN);
  int soilPercent = map(soilRaw, 4095, 1000, 0, 100); // sesuaikan min/max
  soilPercent = constrain(soilPercent, 0, 100);
  String soilStatus = (soilPercent < 40) ? "Kering" : "Lembab";

  // === Read Water Level (Analog) ===
  int waterRaw = analogRead(WATER_LEVEL_PIN);
  int waterPercent = map(waterRaw, 4095, 500, 0, 100);
  waterPercent = constrain(waterPercent, 0, 100);

  String waterStatus;
  if (waterPercent < 20)       waterStatus = "Kosong";
  else if (waterPercent < 80)  waterStatus = "Sebagian";
  else                         waterStatus = "Penuh";

  // ============================
  // Automate Relay Pump
  // ============================
  if (soilPercent < 40 && waterPercent > 20) {
    digitalWrite(RELAY_PIN, LOW);  // Pump ON
    relayStatus = true;
  } else {
    digitalWrite(RELAY_PIN, HIGH); // Pump OFF
    relayStatus = false;
  }

  // ============================
  // Debug Info
  // ============================
  Serial.println("\n=== Mengirim data ke Supabase ===");
  Serial.printf("Suhu: %.2f°C | Kelembapan: %.2f%%\n", temperature, humidity);
  Serial.printf("Soil: %d raw | %d%% (%s)\n", soilRaw, soilPercent, soilStatus.c_str());
  Serial.printf("Water: %d raw | %d%% (%s)\n", waterRaw, waterPercent, waterStatus.c_str());
  Serial.printf("Pompa: %s\n", relayStatus ? "ON" : "OFF");

  // ============================
  // Send Data
  // ============================
  sendDataToSupabase(
    temperature, humidity,
    soilRaw, soilPercent, soilStatus,
    waterRaw, waterPercent, waterStatus,
    relayStatus
  );

  delay(10000); // kirim setiap 10 detik
}
