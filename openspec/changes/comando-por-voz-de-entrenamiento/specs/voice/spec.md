# Especificaciones: Comandos de Voz para Entrenamiento

## Propósito

Esta especificación describe el comportamiento y las reglas de negocio para la nueva funcionalidad del Modo de Voz en la pantalla de entrenamiento (`TrainingControls`).

## Requisitos Nuevos (ADDED)

### Requisito: Toggle de Modo Voz

El sistema DEBE proveer un control visual (botón/toggle) para iniciar y detener el reconocimiento de voz.

#### Escenario: Activación del micrófono
- DADO que el usuario está en la vista de Entrenamiento
- CUANDO el usuario presiona el botón de "Modo Voz"
- ENTONCES el sistema solicita permisos de micrófono (si no los tiene)
- Y el botón cambia visualmente a un estado "Escuchando..." u "On".

#### Escenario: Desactivación manual
- DADO que el Modo Voz está activo
- CUANDO el usuario presiona el botón de "Modo Voz" nuevamente
- ENTONCES el sistema detiene la escucha del micrófono
- Y el botón vuelve a su estado "Off".

### Requisito: Procesamiento de Comandos de Voz

El sistema DEBE parsear el texto transcripto para buscar combinaciones válidas de Tipo de Golpe y Resultado. No importa el orden exacto si ambas palabras clave están presentes.

**Palabras clave válidas (Golpe):**
- "Drive" / "Derecha" -> `shotType: 'fondo'`, `hand: 'drive'`
- "Revés" -> `shotType: 'fondo'`, `hand: 'reves'`
... (se pueden expandir a voleas, bandejas, etc., pero iniciaremos con las básicas para el MVP).

**Palabras clave válidas (Resultado):**
- "Buena" / "Ganadora" / "Winner" -> `pointType: 'winner'`
- "Mala" / "Error" / "Afuera" / "Red" -> `pointType: 'error'`

#### Escenario: Comando válido de error de drive
- DADO que el Modo Voz está activo
- CUANDO el sistema transcribe la frase "le pegué de drive y fue mala"
- ENTONCES el sistema procesa el comando
- Y añade un punto de tipo `error` con tipo de golpe `fondo` y mano `drive` al store del partido.
- Y emite algún tipo de feedback al usuario.

#### Escenario: Comando parcial o inválido
- DADO que el Modo Voz está activo
- CUANDO el sistema transcribe la frase "qué buen calor hace"
- ENTONCES el sistema ignora la frase porque no contiene comandos de pádel válidos.
- Y no añade ningún punto al store.

### Requisito: Resiliencia del Reconocimiento

El sistema DEBE intentar mantenerse escuchando continuamente mientras el botón toggle esté activo.

#### Escenario: Auto-parada del navegador
- DADO que el Modo Voz está activo
- CUANDO la Web Speech API se detiene automáticamente por silencio prolongado (dispara evento `onend`)
- ENTONCES el sistema comprueba si el toggle sigue activo
- Y re-inicia automáticamente el reconocimiento si el toggle sigue en estado `true`.
