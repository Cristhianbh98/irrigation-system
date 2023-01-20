#include <DHT.h>

#define DHTTYPE DHT11
#define sensor_humedad_pin A0
#define fotorresistor_pin A5

//Declara una variable de tipo DHT de nombre dht y especifica que se trata de un sensor DHT11 conectado al pin 2
int pinDHT11 = 2;
DHT dht(pinDHT11, DHTTYPE); 

int fotorresistor_value = 0;
int agua_pin = 3;
int agua_speed = 255;

void setup() {
  //Inicia la comunicación serial a 9600 baudios
  Serial.begin(9600);
  //Inicia el sensor DHT
  dht.begin();
}

void loop() {
  //Lee la humedad y la temperatura del sensor DHT
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  //Verifica si la lectura del sensor es válida
  if (isnan(h) || isnan(t)){
    Serial.println("Error");
    delay(1500);
    return;
  }
  //Lee el valor del sensor de humedad del suelo y lo mapea a un rango de 0 a 100%
  int valor_humedad_tierra = map(analogRead(sensor_humedad_pin), 0, 1023, 100, 0);
  //Lee el valor del fotoresistor y lo mapea a un rango de 0 a 100%
  int fotorresistor_value = map(analogRead(fotorresistor_pin), 1023, 0, 100, 0);
  //Imprime los valores de temperatura, humedad, humedad del suelo y luz en una sola línea
  Serial.print("Temperatura: ");
  Serial.print(t);
  Serial.print("°C\t");
  Serial.print("Humedad: ");
  Serial.print(h);
  Serial.print("%\t");
  Serial.print("Humedad en el suelo: ");
  Serial.print(valor_humedad_tierra);
  Serial.print("%\t");
  Serial.print("Luz: ");
  Serial.print(fotorresistor_value);
  Serial.print("%\n");
  //Espera 30 segundos antes de volver a tomar una lectura
  delay(30000);
}
