/*
 * Name: Akshath Jain
 * Date: 9/22/18
 * Purpose: emulate water flow (pretty much just make the generator speed change every now and then)
 */

int waterPin = 3;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(waterPin, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(waterPin, HIGH);
  delay(1000);
  digitalWrite(waterPin, LOW);
}
