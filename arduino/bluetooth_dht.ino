#include <SoftwareSerial.h>
#include <DHT.h>

#define DELAY 2000 //sleep 2s

#define DHT_TYPE DHT22
#define DHT_PIN 9
#define RX_PIN 10
#define TX_PIN 11
#define LED_PIN 13

DHT dht = DHT(DHT_PIN, DHT_TYPE);
SoftwareSerial bt = SoftwareSerial(RX_PIN, TX_PIN);

void setup() {
    Serial.begin(9600);
    Serial.println("start dht device");
    pinMode(LED_PIN, OUTPUT);
    bt.begin(9600);
    dht.begin();
}

void loop() {
    digitalWrite(LED_PIN, LOW);
    delay(DELAY);
    digitalWrite(LED_PIN, HIGH);
    
    Serial.println("read dht data");
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    if(isnan(temperature) || isnan(humidity)) {
      Serial.println("cannot read data from sensor");
      return;
    }
    String json = "{\"temperature\":" + String(temperature) + ",\"humidity\":" + String(humidity) + "}";
    Serial.println("send data : " + json);
    bt.println(json);
}
