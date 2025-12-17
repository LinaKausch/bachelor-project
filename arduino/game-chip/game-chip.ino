#include <Wire.h> 
#include "Nunchuk.h"

int up2 = 18;
int down2 =19;
int left2 = 4;
int right2 = 5;

int up1 = 6;
int down1 = 7;
int left1 = 8;
int right1 = 9;

int blueBtnPin = 10;
int yellowBtnPin = 16;


float smoothAX = 0;
float smoothAY = 0;
const float SMOOTHING = 0.15;

void setup() {
  Serial.begin(9600);

  pinMode(blueBtnPin, INPUT_PULLUP);
  pinMode(yellowBtnPin, INPUT_PULLUP);

  pinMode(up1, INPUT_PULLUP);
  pinMode(down1, INPUT_PULLUP);
  pinMode(left1, INPUT_PULLUP);
  pinMode(right1, INPUT_PULLUP);

  pinMode(up2, INPUT_PULLUP);
  pinMode(down2, INPUT_PULLUP);
  pinMode(left2, INPUT_PULLUP);
  pinMode(right2, INPUT_PULLUP);

  // while(!Serial.available()) {
  //   delay(100);
  // }
  delay(1000);
     Wire.begin(); 
	   nunchuk_init(); 
}

String getDirection(bool up, bool down, bool left, bool right) {
  if (up && left) return "up-left";
  if (up && right) return "up-right";
  if (down && left) return "down-left";
  if (down && right) return "down-right";
  if (up) return "up";
  if (down) return "down";
  if (left) return "left";
  if (right) return "right";
  return "none";
}

void loop() {

  bool p1u = !digitalRead(up1);
  bool p1d = !digitalRead(down1);
  bool p1l = !digitalRead(left1);
  bool p1r = !digitalRead(right1);
  String dir1 = getDirection(p1u, p1d, p1l, p1r);

  bool p2u = !digitalRead(up2);
  bool p2d = !digitalRead(down2);
  bool p2l = !digitalRead(left2);
  bool p2r = !digitalRead(right2);
  String dir2 = getDirection(p2u, p2d, p2l, p2r);


  int b2 = digitalRead(blueBtnPin) == LOW ? 1 : 0;
  int b1 = digitalRead(yellowBtnPin) == LOW ? 1 : 0;


 int ax = 0;
  int ay = 0;
  bool z = 0;

   if (nunchuk_read()) { 
	 int rawAX = nunchuk_accelX();
int rawAY = nunchuk_accelY();

smoothAX = smoothAX + (rawAX - smoothAX) * SMOOTHING;
smoothAY = smoothAY + (rawAY - smoothAY) * SMOOTHING;

ax = (int)smoothAX;
ay = (int)smoothAY;

     z = nunchuk_buttonZ();
   }

   Serial.print("{\"p1\":\"");
Serial.print(dir1);
Serial.print("\",\"p2\":\"");
Serial.print(dir2);
Serial.print("\",\"btn1\":");
Serial.print(b1);
Serial.print(",\"btn2\":");
Serial.print(b2);
Serial.print(",\"accX\":");
Serial.print(ax);
Serial.print(",\"accY\":");
Serial.print(ay);
Serial.print(",\"z\":");
Serial.print(z);
Serial.println("}");

  delay(50);
}

