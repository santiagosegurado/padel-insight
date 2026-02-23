## Exploración: Comandos de Voz para el Modo Entrenamiento

### Estado Actual
Actualmente, registrar un punto durante el entrenamiento requiere interactuar con la pantalla del dispositivo móvil para seleccionar el tipo de golpe, la mano y si fue un error o un winner (punto ganador). Este flujo interrumpe la concentración y el ritmo del jugador durante la práctica, ya que exige interacción física tras cada golpe. El dispositivo suele estar colocado en un trípode o soporte, lo que hace que tocar la pantalla sea muy inconveniente.

### Áreas Afectadas
- `src/components/controls/TrainingControls.tsx` — Necesita un nuevo botón/interruptor en la interfaz para el modo de voz.
- `src/hooks/useAppHandlers.ts` o un nuevo hook `useVoiceRecognition.ts` — Requiere lógica para conectar con la API Web Speech y despachar (dispatch) acciones al estado global (store).
- `src/store/matchStore.ts` — Necesita manejar correctamente la adición de puntos disparados por voz.

### Enfoques
1. **Web Speech API (Reconocimiento de voz nativo del navegador)** 
   - Pros: Integrado en navegadores modernos (Chrome/Safari/Edge), sin coste, no requiere latencia de APIs externas ni tokens, funciona razonablemente bien para comandos simples.
   - Contras: La precisión en entornos ruidosos al aire libre (pistas de pádel) puede ser menor; requiere que la pantalla del dispositivo se mantenga encendida y activa; el soporte en Safari requiere prefijos(`webkitSpeechRecognition`).
   - Esfuerzo: Medio

2. **Grabación de Audio + Transcripción por API (ej. Gemini Audio / Whisper)**
   - Pros: Extremadamente preciso incluso en entornos ruidosos, puede procesar lenguaje natural ("le pegué un drive de fondo y fue mala").
   - Contras: Más difícil de construir para obtener feedback en tiempo real (requiere enviar el audio por chunks), consume cuota de API, añade latencia de red.
   - Esfuerzo: Alto

### Recomendación
**Web Speech API** es el enfoque recomendado para el Producto Mínimo Viable (MVP). Dado que el usuario quiere registrar los golpes *en tiempo real* durante el entrenamiento sin tocar el dispositivo, el feedback inmediato es crucial. Web Speech API nos permite escuchar continuamente y reaccionar al instante a palabras clave específicas (ej. "drive mala", "revés ganadora"). Si la precisión resulta ser demasiado baja en pruebas reales, podemos pivotar y cambiar a la Opción 2 en una futura iteración.

### Riesgos
- Ruido ambiental en la pista de pádel (ecos, otros jugadores hablando) causando falsos positivos o perdiendo comandos.
- Los permisos del micrófono del navegador pueden expirar o el sistema operativo puede suspender la pestaña del navegador si no se interactúa con ella.
- Soporte inconsistente entre navegadores móviles (especialmente iOS Safari, que tiene reglas muy estrictas sobre la grabación continua de audio en segundo plano).

### Listo para la Propuesta
Sí, el enfoque es lo suficientemente claro como para formular una propuesta concreta y un plan de implementación.
