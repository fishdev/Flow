/*
 * Name: Akshath Jain
 * Date: 9/22/18
 * Purpose: motor as a generator (flow meter)
 */

int flowSensorPin = A0;
int flowRate = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  flowRate = analogRead(flowSensorPin);
  Serial.print(flowRate);
  delay(1000);
}
