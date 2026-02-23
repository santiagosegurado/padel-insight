# Tareas: Comandos de Voz para Entrenamiento

## Fase 1: Infraestructura y Base (Lógica pura)

- [ ] 1.1 Crear `src/utils/voiceCommandParser.ts` con la lógica de expresiones regulares o búsqueda de palabras clave para mapear frases en español ("drive", "revés", "buena", "mala", etc.) hacia objetos tipo `ParsedCommand`.
- [ ] 1.2 Crear el Custom Hook `src/hooks/useVoiceRecognition.ts` que inicialice el motor nativo de de `window.SpeechRecognition` (o su prefijo `webkit`).
- [ ] 1.3 Asegurar en `useVoiceRecognition.ts` la resiliencia: si el usuario no detuvo explícitamente el hook (estado interno `isRecording = true`), y ocurre un evento `onend`, debe volver a llamar a `recognition.start()` de inmediato.

## Fase 2: Implementación Core (UI y Conexión)

- [ ] 2.1 En `src/components/controls/TrainingControls.tsx`, importar y consumir el nuevo `useVoiceRecognition`.
- [ ] 2.2 Agregar un nuevo botón/toggle tipo "micrófono" en ambas vistas de `TrainingControls.tsx` (móvil y tablet/desktop) que llame a `startListening` y `stopListening`.
- [ ] 2.3 Implementar un `useEffect` en `TrainingControls.tsx` que escuche los cambios en la propiedad `transcript` devuelta por el hook.
- [ ] 2.4 Cuando llegue un nuevo `transcript`, pasarlo por `parseVoiceCommand`. Si es un comando válido de pádel, construir el objeto `Point` y llamar a `addTrainingPoint(point)`.

## Fase 3: Pruebas Globales / Refinamientos y Limpieza

- [ ] 3.1 Agregar algún pequeño feedback sonoro ligero (ej. un beep usando la Web Audio API o HTMLAudioElement) cuando un punto se registra exitosamente vía voz. Esto ayuda a quien entrena a no mirar la pantalla.
- [ ] 3.2 Probar de forma local usando `npm run dev` diciendo comandos y evaluando la respuesta visual del componente `TacticalCourt`.
