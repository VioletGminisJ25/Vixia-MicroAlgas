#include <OneWire.h>
#include <DallasTemperature.h>

// Configuración de pines y constantes
#define SPEC_TRG A0
#define SPEC_ST A1
#define SPEC_CLK A2
#define SPEC_VIDEO A3
#define WHITE_LED A4
#define LASER_404 A5
#define RELAY 13
#define VALVULA_PIN 0
#define SPEC_CHANNELS 288
#define PH_PIN A9

OneWire ourWire(2);
DallasTemperature sensors(&ourWire);
uint16_t data[SPEC_CHANNELS];
int relayPin1 = 1, relayPin2 = 4, relayPin3 = 14;
const int delayBombilla = 150;

// Variables de usuario
unsigned long TIEMPO_ENTRE_MUESTRAS = 60000, TIEMPO_LUZ = 60000, TIEMPO_OSCURIDAD = 60000;
float PORCENTAJE_BLANCA = 33.33, PORCENTAJE_AZUL = 33.33, PORCENTAJE_ROJA = 33.33;

// Variables de control
unsigned long tiempoUltimaMuestra = 0, tiempoCicloInicio = 0, tiempoUltimaValvula = 0;
bool enCicloLuz = false, valvulaActiva = false;
const unsigned long VALVULA_INTERVALO = 60000, VALVULA_ON_TIME = 2000;

// Estado de configuración
enum ConfigState { INIT, TIEMPO_MUESTRAS, TIEMPO_LUZ_STATE, TIEMPO_OSCURIDAD_STATE, PORC_BLANCA, PORC_AZUL, PORC_ROJA, RUNNING };
ConfigState state = INIT;

// Inicialización
void setupSystem() {
  pinMode(SPEC_VIDEO, INPUT);
  pinMode(RELAY, OUTPUT);
  pinMode(SPEC_CLK, OUTPUT);
  pinMode(SPEC_ST, OUTPUT);
  pinMode(LASER_404, OUTPUT);
  pinMode(WHITE_LED, OUTPUT);
  pinMode(relayPin1, OUTPUT);
  pinMode(relayPin2, OUTPUT);
  pinMode(relayPin3, OUTPUT);
  pinMode(VALVULA_PIN, OUTPUT);
  digitalWrite(relayPin1, HIGH);
  digitalWrite(relayPin2, HIGH);
  digitalWrite(relayPin3, HIGH);
  digitalWrite(VALVULA_PIN, LOW);
  digitalWrite(SPEC_CLK, HIGH);
  digitalWrite(SPEC_ST, LOW);
  Serial.begin(115200);
  while (!Serial) delay(10); // Espera a que el serial esté listo
}

// Lectura de sensores
float readPH() {
  return (analogRead(PH_PIN) * (5.0 / 1023.0) - 3.9) / -0.2 + 7.0;
}

void readSpectrometer() {
  const int dt = 1;
  digitalWrite(SPEC_CLK, LOW); delayMicroseconds(dt);
  digitalWrite(SPEC_CLK, HIGH); delayMicroseconds(dt);
  digitalWrite(SPEC_CLK, LOW); digitalWrite(SPEC_ST, HIGH); delayMicroseconds(dt);
  for (int i = 0; i < 15; i++) { digitalWrite(SPEC_CLK, HIGH); delayMicroseconds(dt); digitalWrite(SPEC_CLK, LOW); delayMicroseconds(dt); }
  digitalWrite(SPEC_ST, LOW);
  for (int i = 0; i < 85; i++) { digitalWrite(SPEC_CLK, HIGH); delayMicroseconds(dt); digitalWrite(SPEC_CLK, LOW); delayMicroseconds(dt); }
  digitalWrite(SPEC_CLK, HIGH); delayMicroseconds(dt); digitalWrite(SPEC_CLK, LOW); delayMicroseconds(dt);
  for (int i = 0; i < SPEC_CHANNELS; i++) {
    data[i] = analogRead(SPEC_VIDEO);
    digitalWrite(SPEC_CLK, HIGH); delayMicroseconds(dt); digitalWrite(SPEC_CLK, LOW); delayMicroseconds(dt);
  }
  digitalWrite(SPEC_ST, HIGH);
  for (int i = 0; i < 7; i++) { digitalWrite(SPEC_CLK, HIGH); delayMicroseconds(dt); digitalWrite(SPEC_CLK, LOW); delayMicroseconds(dt); }
  digitalWrite(SPEC_CLK, HIGH); delayMicroseconds(dt);
}

// Envío de datos con timestamp
void sendData(float temp, float ph, unsigned long timestamp) {
  Serial.print("h,");
  for (int i = 0; i < SPEC_CHANNELS; i++) { Serial.print(data[i]); Serial.print(","); }
  Serial.print(temp, 2); Serial.print(",");
  Serial.print(ph, 2); Serial.print(",");
  Serial.print("a,");
  Serial.println(timestamp / 1000.0, 2);
}

// Medición con luz blanca (10 medidas consecutivas)
void medirConBlanca() {
  digitalWrite(relayPin1, HIGH); delay(delayBombilla);
  digitalWrite(relayPin2, HIGH); delay(delayBombilla);
  digitalWrite(relayPin3, HIGH); delay(delayBombilla);
  for (int i = 0; i < 3; i++) { digitalWrite(relayPin3, LOW); delay(delayBombilla); digitalWrite(relayPin3, HIGH); delay(delayBombilla); }
  digitalWrite(relayPin3, LOW); delay(delayBombilla);

  for (int i = 0; i < 10; i++) {
    sensors.requestTemperatures();
    float temp = sensors.getTempCByIndex(0);
    readSpectrometer();
    float ph = readPH();
    sendData(temp, ph, millis());
  }

  digitalWrite(relayPin3, HIGH);
}

// Configuración inicial
void setup() {
  setupSystem();
  sensors.begin();

  Serial.println("Antes de empezar el programa es necesario medir el blanco...");
  medirConBlanca();
  Serial.println("Calibración del blanco completada.");
  Serial.println("Escribe el tiempo entre medidas (en ms) y presiona Enter:");
}

// Bucle principal
void loop() {
  unsigned long now = millis();

  // Manejo de entrada del usuario
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    Serial.print("Recibí: ");
    Serial.println(input);

    switch (state) {
      case INIT:
      case TIEMPO_MUESTRAS:
        TIEMPO_ENTRE_MUESTRAS = (input.length() > 0) ? input.toInt() : 60000;
        state = TIEMPO_LUZ_STATE;
        Serial.println("Escribe el tiempo de luz (en ms) y presiona Enter:");
        break;

      case TIEMPO_LUZ_STATE:
        TIEMPO_LUZ = (input.length() > 0) ? input.toInt() : 60000;
        state = TIEMPO_OSCURIDAD_STATE;
        Serial.println("Escribe el tiempo de oscuridad (en ms) y presiona Enter:");
        break;

      case TIEMPO_OSCURIDAD_STATE:
        TIEMPO_OSCURIDAD = (input.length() > 0) ? input.toInt() : 60000;
        state = PORC_BLANCA;
        Serial.println("Escribe el porcentaje de luz blanca (0-100) y presiona Enter:");
        break;

      case PORC_BLANCA:
        PORCENTAJE_BLANCA = (input.length() > 0) ? input.toFloat() : 33.33;
        state = PORC_AZUL;
        Serial.println("Escribe el porcentaje de luz azul (0-100) y presiona Enter:");
        break;

      case PORC_AZUL:
        PORCENTAJE_AZUL = (input.length() > 0) ? input.toFloat() : 33.33;
        state = PORC_ROJA;
        Serial.println("Escribe el porcentaje de luz roja (0-100) y presiona Enter:");
        break;

      case PORC_ROJA:
        PORCENTAJE_ROJA = (input.length() > 0) ? input.toFloat() : 33.33;
        if (abs(PORCENTAJE_BLANCA + PORCENTAJE_AZUL + PORCENTAJE_ROJA - 100) < 0.01) {
          state = RUNNING;
          Serial.println("Configuración completada. Iniciando programa...");
          tiempoCicloInicio = millis();
          tiempoUltimaValvula = millis();
        } else {
          Serial.println("Error: Los porcentajes deben sumar 100. Intenta de nuevo.");
          state = PORC_BLANCA;
          Serial.println("Escribe el porcentaje de luz blanca (0-100) y presiona Enter:");
        }
        break;

      case RUNNING:
        // Ignora entradas adicionales una vez que está corriendo
        break;
    }

    // Limpia el buffer serial después de cada lectura
    while (Serial.available() > 0) Serial.read();
  }

  // Solo ejecuta el programa principal cuando la configuración esté completa
  if (state == RUNNING) {
    // Medición
    if (now - tiempoUltimaMuestra >= TIEMPO_ENTRE_MUESTRAS) {
      Serial.println("Tomando 10 medidas...");
      digitalWrite(VALVULA_PIN, LOW); // Cierra válvula antes de medir
      medirConBlanca();
      tiempoUltimaMuestra = now;
    }

    // Válvula
    if (!valvulaActiva && now - tiempoUltimaValvula >= VALVULA_INTERVALO) {
      digitalWrite(VALVULA_PIN, HIGH);
      valvulaActiva = true;
      tiempoUltimaValvula = now;
      Serial.println("Válvula abierta");
    } else if (valvulaActiva && now - tiempoUltimaValvula >= VALVULA_ON_TIME) {
      digitalWrite(VALVULA_PIN, LOW);
      valvulaActiva = false;
      tiempoUltimaValvula = now;
      Serial.println("Válvula cerrada");
    }

    // Ciclo luz/oscuridad
    unsigned long ciclo = now - tiempoCicloInicio;
    if (ciclo >= TIEMPO_LUZ + TIEMPO_OSCURIDAD) tiempoCicloInicio = now, ciclo = 0;

    if (ciclo < TIEMPO_LUZ) {
      enCicloLuz = true;
      unsigned long tBlanca = TIEMPO_LUZ * PORCENTAJE_BLANCA / 100;
      unsigned long tAzul = TIEMPO_LUZ * PORCENTAJE_AZUL / 100;
      if (ciclo < tBlanca) {
        digitalWrite(relayPin1, HIGH); digitalWrite(relayPin2, HIGH); digitalWrite(relayPin3, LOW);
      } else if (ciclo < tBlanca + tAzul) {
        digitalWrite(relayPin1, LOW); digitalWrite(relayPin2, HIGH); digitalWrite(relayPin3, HIGH);
      } else {
        digitalWrite(relayPin1, HIGH); digitalWrite(relayPin2, LOW); digitalWrite(relayPin3, HIGH);
      }
    } else {
      enCicloLuz = false;
      digitalWrite(relayPin1, HIGH); digitalWrite(relayPin2, HIGH); digitalWrite(relayPin3, HIGH);
    }
  }
}