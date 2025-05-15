#include <OneWire.h>
#include <DallasTemperature.h>

// Configuración de pines y constantes
#define SPEC_TRG A0
#define SPEC_ST A1
#define SPEC_CLK A2
#define SPEC_VIDEO A3
#define WHITE_LED A4
#define LASER_404 A5
#define SPEC_CHANNELS 288
#define PH_PIN A9

OneWire ourWire(11);
DallasTemperature sensors(&ourWire);
uint16_t data[SPEC_CHANNELS];
int relayPin1 = 20;
int relayPin2 = 4;
int relayPin3 = 14;
const int delayBombilla = 150;
const int VALVULA_PIN = 17;

// Variables de usuario
unsigned long TIEMPO_ENTRE_MUESTRAS, TIEMPO_LUZ, TIEMPO_OSCURIDAD;
float PORCENTAJE_BLANCA, PORCENTAJE_AZUL, PORCENTAJE_ROJA;

// Variables de control
unsigned long tiempoUltimaMuestra = 0, tiempoCicloInicio = 0, tiempoUltimaValvula = 0;
bool enCicloLuz = false, valvulaActiva = false;
bool luzBlancaEncendida = false;
int estadoRelayPin1, estadoRelayPin2, estadoRelayPin3;
const unsigned long VALVULA_ABIERTA = 2000, VALVULA_CERRADA = 60000;
bool midiendo = false; // Para rastrear si está en proceso de medición
String luzActual = ""; // Para rastrear el estado actual de la luz

// Variables para el cálculo del pH
int sensorValue;
float voltage, phValue;
float slope = -200;    // Pendiente en mV/pH
float intercept = 3900; // Intercepto en mV

// Función de reinicio del microcontrolador
void (*resetFunc)(void) = 0;

// Inicialización
void setupSystem() {
  pinMode(SPEC_VIDEO, INPUT);
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
  digitalWrite(VALVULA_PIN, HIGH);
  digitalWrite(SPEC_CLK, HIGH);
  digitalWrite(SPEC_ST, LOW);
  Serial.begin(9600);
}

// Lectura de sensores
float readPH() {
  const int numReadings = 10;
  long total = 0;
  for (int i = 0; i < numReadings; i++) {
    sensorValue = analogRead(PH_PIN);
    total += sensorValue;
    delay(10);
  }
  sensorValue = total / numReadings;
  voltage = sensorValue * (5.0 / 1023.0);
  phValue = (voltage - intercept / 1000) / (slope / 1000) + 7.0;
  return phValue;
}

void readSpectrometer() {
  const int dt = 1;
  digitalWrite(SPEC_CLK, LOW);
  delayMicroseconds(dt);
  digitalWrite(SPEC_CLK, HIGH);
  delayMicroseconds(dt);
  digitalWrite(SPEC_CLK, LOW);
  digitalWrite(SPEC_ST, HIGH);
  delayMicroseconds(dt);
  for (int i = 0; i < 15; i++) {
    digitalWrite(SPEC_CLK, HIGH);
    delayMicroseconds(dt);
    digitalWrite(SPEC_CLK, LOW);
    delayMicroseconds(dt);
  }
  digitalWrite(SPEC_ST, LOW);
  for (int i = 0; i < 85; i++) {
    digitalWrite(SPEC_CLK, HIGH);
    delayMicroseconds(dt);
    digitalWrite(SPEC_CLK, LOW);
    delayMicroseconds(dt);
  }
  digitalWrite(SPEC_CLK, HIGH); delayMicroseconds(dt); digitalWrite(SPEC_CLK, LOW); delayMicroseconds(dt);
  for (int i = 0; i < SPEC_CHANNELS; i++) {
    data[i] = analogRead(SPEC_VIDEO);
    digitalWrite(SPEC_CLK, HIGH); delayMicroseconds(dt); digitalWrite(SPEC_CLK, LOW); delayMicroseconds(dt);
  }
  digitalWrite(SPEC_ST, HIGH);
  for (int i = 0; i < 7; i++) {
    digitalWrite(SPEC_CLK, HIGH);
    delayMicroseconds(dt);
    digitalWrite(SPEC_CLK, LOW);
    delayMicroseconds(dt);
  }
  digitalWrite(SPEC_CLK, HIGH); delayMicroseconds(dt);
}

// Envío de datos
void sendData(float temp, float ph) {
  Serial.print("h,");
  for (int i = 0; i < SPEC_CHANNELS; i++) {
    Serial.print(data[i]);
    Serial.print(",");
  }
  Serial.print(temp, 2); Serial.print(",");
  Serial.print(ph, 2); Serial.print(",");
  Serial.println("a");
  delay(50);
}

// Encender luz blanca
void encenderLuzBlanca() {
  digitalWrite(relayPin1, HIGH); delay(delayBombilla);
  digitalWrite(relayPin2, HIGH); delay(delayBombilla);
  digitalWrite(relayPin3, HIGH); delay(delayBombilla);
  digitalWrite(relayPin3, LOW); delay(delayBombilla);
  digitalWrite(relayPin3, HIGH); delay(delayBombilla);
  digitalWrite(relayPin3, LOW); delay(delayBombilla);
  digitalWrite(relayPin3, HIGH); delay(delayBombilla);
  digitalWrite(relayPin3, LOW); delay(delayBombilla);
}

// Realizar medición
void realizarMedicion() {
  sensors.requestTemperatures();
  float temp = sensors.getTempCByIndex(0);
  readSpectrometer();
  float ph = readPH();
  sendData(temp, ph);
}

// Controlar ciclo luz/oscuridad
void controlarCicloLuz(unsigned long now, unsigned long& tiempoCicloInicio, bool& enCicloLuz,
                       int relayPin1, int relayPin2, int relayPin3,
                       unsigned long TIEMPO_LUZ, unsigned long TIEMPO_OSCURIDAD,
                       float PORCENTAJE_BLANCA, float PORCENTAJE_AZUL, float PORCENTAJE_ROJA) {
  unsigned long ciclo = now - tiempoCicloInicio;
  if (ciclo >= TIEMPO_LUZ + TIEMPO_OSCURIDAD) {
    tiempoCicloInicio = now;
    ciclo = 0;
    luzBlancaEncendida = false;
  }

  String luzNueva = ""; // Estado de luz propuesto

  if (ciclo < TIEMPO_LUZ) {
    enCicloLuz = true;
    unsigned long tBlanca = TIEMPO_LUZ * PORCENTAJE_BLANCA / 100;
    unsigned long tAzul = TIEMPO_LUZ * PORCENTAJE_AZUL / 100;
    unsigned long tRoja = TIEMPO_LUZ * PORCENTAJE_ROJA / 100;
    
    if (ciclo < tBlanca) {
      digitalWrite(relayPin1, HIGH);
      digitalWrite(relayPin2, HIGH);
      if (!luzBlancaEncendida) {
        encenderLuzBlanca();
        luzBlancaEncendida = true;
      }
      digitalWrite(relayPin3, LOW);
      luzNueva = "Luz blanca encendida";
    } else if (ciclo < tBlanca + tAzul) {
      luzBlancaEncendida = false;
      digitalWrite(relayPin1, LOW);
      digitalWrite(relayPin2, HIGH);
      digitalWrite(relayPin3, HIGH);
      luzNueva = "Luz azul encendida";
    } else {
      luzBlancaEncendida = false;
      digitalWrite(relayPin1, HIGH);
      digitalWrite(relayPin2, LOW);
      digitalWrite(relayPin3, HIGH);
      luzNueva = "Luz roja encendida";
    }
  } else {
    enCicloLuz = false;
    luzBlancaEncendida = false;
    digitalWrite(relayPin1, HIGH);
    digitalWrite(relayPin2, HIGH);
    digitalWrite(relayPin3, HIGH);
    luzNueva = "Luces apagadas (oscuridad)";
  }

  // Solo imprimir si el estado de la luz ha cambiado
  if (luzNueva != luzActual) {
    Serial.println(luzNueva);
    luzActual = luzNueva;
  }
}

// Función de reinicio general
void resetGeneral() {
  Serial.println("Iniciando reinicio general...");
  if (midiendo) {
    Serial.println("Esperando a que termine la medición actual...");
    while (midiendo) delay(100);
  }
  
  // Apagar todo
  digitalWrite(relayPin1, HIGH);
  digitalWrite(relayPin2, HIGH);
  digitalWrite(relayPin3, HIGH);
  digitalWrite(VALVULA_PIN, HIGH);
  digitalWrite(LASER_404, LOW);
  digitalWrite(WHITE_LED, LOW);
  Serial.println("Todo apagado.");
  Serial.println("Presiona cualquier tecla para reiniciar...");
  while (!Serial.available()) delay(100); // Esperar entrada del usuario
  while (Serial.available()) Serial.read(); // Limpiar buffer
  Serial.println("Reiniciando...");
  delay(500);
  resetFunc();
}

float getValidInput(String prompt) {
  float inputValue;
  while (true) {
    Serial.println(prompt);
    while (!Serial.available()) delay(100);
    inputValue = Serial.parseFloat();
    while (Serial.available()) Serial.read(); // Limpiar buffer
    if (inputValue >= 0 && inputValue <= 100) {
      return inputValue;
    } else {
      Serial.println("Error: El valor debe estar entre 0 y 100.");
    }
  }
}

// Configuración inicial
void setup() {
  setupSystem();
  sensors.begin();

  // Esperar a que el usuario presione una tecla para arrancar
  Serial.println("Sistema inicializado. Presiona cualquier tecla para arrancar el programa...");
  while (!Serial.available()) delay(100);
  while (Serial.available()) Serial.read(); // Limpiar buffer
  Serial.println("Arrancando programa...");

  // Calibración del blanco
  Serial.println("Antes de empezar el programa es necesario medir el blanco...");
  encenderLuzBlanca();
  for (int i = 0; i < 10; i++) {
    realizarMedicion();
  }
  digitalWrite(relayPin3, HIGH);
  Serial.println("Calibración del blanco completada.");

  // Configuración de parámetros para modo cíclico
  while (Serial.available()) Serial.read();
  Serial.println("¿Cuál es el tiempo entre medidas? (en minutos): ");
  while (!Serial.available()) delay(100);
  TIEMPO_ENTRE_MUESTRAS = Serial.parseInt() * 60000; // Convertir minutos a milisegundos
  while (Serial.available()) Serial.read();

  Serial.println("¿Cuál es el tiempo de luz? (en minutos): ");
  while (!Serial.available()) delay(100);
  TIEMPO_LUZ = Serial.parseInt() * 60000; // Convertir minutos a milisegundos
  while (Serial.available()) Serial.read();

  Serial.println("¿Cuál es el tiempo de oscuridad? (en minutos): ");
  while (!Serial.available()) delay(100);
  TIEMPO_OSCURIDAD = Serial.parseInt() * 60000; // Convertir minutos a milisegundos
  while (Serial.available()) Serial.read();

  bool valid = false;
 /* while (!valid) {*/
    
   PORCENTAJE_BLANCA = getValidInput("Porcentaje luz blanca (0-100): ");
   PORCENTAJE_AZUL = getValidInput("Porcentaje luz azul (0-100): ");
   PORCENTAJE_ROJA = getValidInput("Porcentaje luz roja (0-100): ");
    /*
    Serial.println("Porcentaje luz blanca (0-100): ");
    while (!Serial.available()) delay(100);
    PORCENTAJE_BLANCA = Serial.parseFloat();
    while (Serial.available()) Serial.read();

    Serial.println("Porcentaje luz azul (0-100): ");
    while (!Serial.available()) delay(100);
    PORCENTAJE_AZUL = Serial.parseFloat();
    while (Serial.available()) Serial.read();

    Serial.println("Porcentaje luz roja (0-100): ");
    while (!Serial.available()) delay(100);
    PORCENTAJE_ROJA = Serial.parseFloat();
    while (Serial.available()) Serial.read();
    

    if (abs(PORCENTAJE_BLANCA + PORCENTAJE_AZUL + PORCENTAJE_ROJA - 100) < 0.01) valid = true;
    else Serial.println("Error: Los porcentajes deben sumar 100.");*/
 // }

  Serial.println("Configuración completada. Iniciando programa...");
  Serial.println("Presiona 'M' en cualquier momento para tomar una muestra manual (si no está midiendo).");
  tiempoCicloInicio = millis();
  tiempoUltimaValvula = millis();
  delay(100);
}


// Bucle principal
void loop() {
  unsigned long now = millis();

  // Comprobar comandos desde Serial
  if (Serial.available() > 0) {
     char comando = Serial.read();
      if (comando == 'R' || comando == 'r') {
        Serial.println("¿Seguro que quieres reiniciar? Envía 'S' para confirmar o cualquier otra tecla para cancelar.");
       while (Serial.available() == 0) delay(100);
         char confirmacion = Serial.read();
          if (confirmacion == 'S' || confirmacion == 's') {
             resetGeneral();
          } else {
            Serial.println("Reinicio cancelado.");
            }
       while (Serial.available()) Serial.read();
    } else if (comando == 'M' || comando == 'm') {
      if (!midiendo) {
        Serial.println("Tomando muestra manual...");
        midiendo = true;
        estadoRelayPin1 = digitalRead(relayPin1);
        estadoRelayPin2 = digitalRead(relayPin2);
        estadoRelayPin3 = digitalRead(relayPin3);

        encenderLuzBlanca();
        for (int i = 0; i < 10; i++) {
          realizarMedicion();
        }
        digitalWrite(relayPin3, HIGH);

        digitalWrite(relayPin1, estadoRelayPin1);
        digitalWrite(relayPin2, estadoRelayPin2);
        digitalWrite(relayPin3, estadoRelayPin3);
        midiendo = false;
        Serial.println("Muestra manual completada.");
        resetGeneral();
      } else {
        Serial.println("No se puede tomar muestra manual: el sistema está midiendo.");
      }
      while (Serial.available()) Serial.read();
    }
  }

  // Modo cíclico (medición automática)
  if (now - tiempoUltimaMuestra >= TIEMPO_ENTRE_MUESTRAS) {
    midiendo = true;
    estadoRelayPin1 = digitalRead(relayPin1);
    estadoRelayPin2 = digitalRead(relayPin2);
    estadoRelayPin3 = digitalRead(relayPin3);
    unsigned long tiempoPausa = millis();

    encenderLuzBlanca();
    for (int i = 0; i < 10; i++) {
      realizarMedicion();
    }
    digitalWrite(relayPin3, HIGH);

    unsigned long tiempoFinMedicion = millis();
    unsigned long tiempoMedicion = tiempoFinMedicion - tiempoPausa;
    tiempoUltimaMuestra = tiempoFinMedicion;
    tiempoCicloInicio += tiempoMedicion;

    digitalWrite(relayPin1, estadoRelayPin1);
    digitalWrite(relayPin2, estadoRelayPin2);
    digitalWrite(relayPin3, estadoRelayPin3);
    midiendo = false;
  }

  // Control de válvula
  if (!valvulaActiva && now - tiempoUltimaValvula >= VALVULA_CERRADA) {
    digitalWrite(VALVULA_PIN, LOW);
    valvulaActiva = true;
    Serial.println("Valvula activada");
    tiempoUltimaValvula = now;
  } else if (valvulaActiva && now - tiempoUltimaValvula >= VALVULA_ABIERTA) {
    digitalWrite(VALVULA_PIN, HIGH);
    valvulaActiva = false;
    Serial.println("Valvula activada");
    tiempoUltimaValvula = now;
  }

  // Ciclo luz/oscuridad
  controlarCicloLuz(now, tiempoCicloInicio, enCicloLuz, relayPin1, relayPin2, relayPin3,
                    TIEMPO_LUZ, TIEMPO_OSCURIDAD, PORCENTAJE_BLANCA, PORCENTAJE_AZUL, PORCENTAJE_ROJA);
}
