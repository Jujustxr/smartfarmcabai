#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// =====================
// WiFi Config
// =====================
const char* ssid = "H";
const char* password = "gedhangndeso";

// =====================
// Supabase Config
// =====================
String supabaseUrl = "https://torukaysucgikxnmphof.supabase.co";
String supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcnVrYXlzdWNnaWt4bm1waG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjQ3MjIsImV4cCI6MjA3NDMwMDcyMn0.SC85cW2NNJHfFq3qEnAou6acosYlZUbRByjigApFDBg";   // <-- ganti pakai API Key kamu
String supabaseTable = "sensor_data";

// =====================
// DHT Config
// =====================
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// =====================
// Soil & Water Config
// =====================
#define SOIL_PIN 34
#define WATER_PIN 35

// =====================
// Fungsi Setup
// =====================
void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  dht.begin();
}

// =====================
// Fungsi Kirim Data
// =====================
void sendDataToSupabase(float temperature, float humidity, int soilRaw, int soilPercent, String soilStatus, int waterADC, int waterPercent, String waterStatus) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = supabaseUrl + "/rest/v1/" + supabaseTable;
    http.begin(url.c_str());
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", supabaseKey);
    http.addHeader("Authorization", "Bearer " + supabaseKey);
    http.addHeader("Prefer", "return=representation");

    // Buat JSON
    DynamicJsonDocument doc(512);
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["soil_raw"] = soilRaw;
    doc["soil_percent"] = soilPercent;
    doc["soil_status"] = soilStatus;
    doc["water_adc"] = waterADC;
    doc["water_percent"] = waterPercent;
    doc["water_status"] = waterStatus;

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    String payload = http.getString();
    Serial.println("Response:");
    Serial.println(payload);

    http.end();
  } else {
    Serial.println("WiFi Disconnected!");
  }
}

// =====================
// Fungsi Loop
// =====================
void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  int soilRaw = analogRead(SOIL_PIN);
  int soilPercent = map(soilRaw, 4095, 1500, 0, 100);
  soilPercent = constrain(soilPercent, 0, 100);
  String soilStatus = (soilPercent < 40) ? "Kering" : "Lembab";

  int waterADC = analogRead(WATER_PIN);
  int waterPercent = map(waterADC, 0, 4095, 0, 100);
  waterPercent = constrain(waterPercent, 0, 100);
  String waterStatus = (waterPercent < 30) ? "Kosong" : "Terisi";

  Serial.println("Mengirim data...");
  sendDataToSupabase(temperature, humidity, soilRaw, soilPercent, soilStatus, waterADC, waterPercent, waterStatus);

  delay(000); 
}
