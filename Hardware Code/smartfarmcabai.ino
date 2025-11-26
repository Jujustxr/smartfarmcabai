// =========================================================
// IoT Smart Farm with ESP32 + Supabase + DHT11 + Soil + Water + Relay
// FINAL VERSION (MATCHES Supabase schema: water_adc)
// =========================================================

#include <WiFiClientSecure.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// =====================
// WiFi Configuration
// =====================
const char* ssid = "wifi";
const char* password = "1123344444";

// =====================
// Supabase Configuration
// =====================
String supabaseUrl = "https://torukaysucgikxnmphof.supabase.co";
String supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcnVrYXlzdWNnaWt4bm1waG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjQ3MjIsImV4cCI6MjA3NDMwMDcyMn0.SC85cW2NNJHfFq3qEnAou6acosYlZUbRByjigApFDBg";
String supabaseTable = "sensor_data";

// =====================
// Sensor Configuration
// =====================
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define SOIL_PIN 32
#define WATER_LEVEL_PIN 33

// =====================
// Relay Configuration
// =====================
#define RELAY_PIN 25
bool relayState = false;
// Relay is active LOW: setting LOW energizes relay (pump ON), HIGH turns it OFF
const int PUMP_ON = LOW;
const int PUMP_OFF = HIGH;

// Configurable thresholds
const int SOIL_DRY_THRESHOLD = 40; // below this %, soil is considered dry
const int SOIL_HYSTERESIS = 5;     // hysteresis buffer to prevent rapid toggles
const int WATER_MIN_PERCENT = 20;  // water level percent required to operate pump

// =====================
// Setup
// =====================
void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Relay OFF (active LOW)

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.println(WiFi.localIP());

  dht.begin();
}

// =====================
// Send Data to Supabase
// =====================
void sendDataToSupabase(
  float temperature, float humidity,
  int soilRaw, int soilPercent, String soilStatus,
  int waterADC, int waterPercent, String waterStatus,
  String pumpStatus
) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // cloudflare TLS bypass

    HTTPClient http;
    String url = supabaseUrl + "/rest/v1/" + supabaseTable;
    http.begin(client, url);

    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", supabaseKey);
    http.addHeader("Authorization", "Bearer " + supabaseKey);
    http.addHeader("Prefer", "return=representation");

    DynamicJsonDocument doc(600);
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;

    doc["soil_raw"] = soilRaw;
    doc["soil_percent"] = soilPercent;
    doc["soil_status"] = soilStatus;

    doc["water_adc"] = waterADC;        // FIXED FIELD
    doc["water_percent"] = waterPercent;
    doc["water_status"] = waterStatus;
    doc["pump_status"] = pumpStatus;

    String requestBody;
    serializeJson(doc, requestBody);

    int httpCode = http.POST(requestBody);
    Serial.print("HTTP Response code: ");
    Serial.println(httpCode);
    Serial.println(http.getString());

    http.end();
  }
}

// =====================
// Main Loop
// =====================
void loop() {

  // === Read DHT ===
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // === Soil Sensor ===
  int soilRaw = analogRead(SOIL_PIN);
  int soilPercent = map(soilRaw, 4095, 1000, 0, 100);
  soilPercent = constrain(soilPercent, 0, 100);
  String soilStatus = soilPercent < 40 ? "Kering" : "Lembab";

  // === Water Level ===
  int waterADC = analogRead(WATER_LEVEL_PIN);
  int waterPercent = map(waterADC, 4095, 500, 0, 100);
  waterPercent = constrain(waterPercent, 0, 100);

  String waterStatus;
  if (waterPercent < 20)       waterStatus = "Kosong";
  else if (waterPercent < 80)  waterStatus = "Sebagian";
  else                         waterStatus = "Penuh";

  // === Relay Automation ===
  // Turn pump ON when soil is dry AND there's enough water in tank; otherwise ensure OFF
  // Hysteresis: if relay is currently ON, only turn OFF when soil is sufficiently wet
  // or water level is too low. If relay is OFF, turn ON when soil is below threshold and water is OK.
  if (relayState) {
    if (soilPercent > (SOIL_DRY_THRESHOLD + SOIL_HYSTERESIS) || waterPercent <= WATER_MIN_PERCENT) {
      digitalWrite(RELAY_PIN, PUMP_OFF);
      Serial.println("Pump turning OFF: conditions not met or water too low");
      relayState = false;
    }
    // else keep pumping
  } else {
    if (soilPercent < SOIL_DRY_THRESHOLD && waterPercent > WATER_MIN_PERCENT) {
      digitalWrite(RELAY_PIN, PUMP_ON);
      Serial.println("Pump turning ON: soil dry & water ok");
      relayState = true;
    }
  }

  // === Debug Monitor ===
  Serial.println("\n=== Mengirim data ke Supabase ===");
  Serial.printf("Suhu: %.2f°C | Hum: %.2f%%\n", temperature, humidity);
  Serial.printf("Soil: %d raw | %d%% (%s)\n", soilRaw, soilPercent, soilStatus.c_str());
  Serial.printf("Water: %d adc | %d%% (%s)\n", waterADC, waterPercent, waterStatus.c_str());
  Serial.printf("Pump: %s\n", relayState ? "ON" : "OFF");

  // === Send to Supabase ===
  String pumpStatus = relayState ? "ON" : "OFF";
  sendDataToSupabase(
    temperature, humidity,
    soilRaw, soilPercent, soilStatus,
    waterADC, waterPercent, waterStatus
    , pumpStatus
  );


  delay(10000);
}
