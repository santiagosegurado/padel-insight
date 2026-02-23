# Diseño Técnico: Comandos de Voz para Entrenamiento

## Enfoque Técnico

Implementaremos la funcionalidad creando un Custom Hook de React (`useVoiceRecognition`) que encapsule toda la lógica imperativa de la `Web Speech API`. Este hook manejará los estados internos (escuchando, error, texto reconocido) y proveerá una función para analizar (parsear) el texto en busca de los comandos específicos del dominio del pádel. El componente UI (`TrainingControls`) simplemente consumirá los estados (para mostrar un botón Activo/Inactivo) y reaccionará a los comandos parseados despachando la acción de guardado al estado global de Zustand (`useMatchStore`).

## Decisiones de Arquitectura

### Decisión: Ubicación del parseo de comandos

**Elección**: El hook `useVoiceRecognition` solo devolverá el texto (transcript). El mapeo de "texto -> acción de pádel" se hará en un archivo de utilidades o en el componente.
**Alternativas consideradas**: Hacer que el hook devuelva directamente objetos de dominio (ej. `{ pointType: 'winner', hand: 'drive' }`).
**Razón**: Facilita la reutilización del hook para otros usos en el futuro (ej. modo Stats) sin acoplarlo fuertemente a la lógica de *Training*.

## Flujo de Datos

    Micrófono del dispositivo
         │ (Web Speech API)
         ▼
    useVoiceRecognition Hook
         │ (transcript string: "drive mala")
         ▼
    parseVoiceCommand(transcript)  ───►  Lógica de coincidencia de regex/keywords
         │ ({ pointType: 'error', hand: 'drive', shotType: 'fondo' })
         ▼
    useMatchStore.addTrainingPoint(point)
         │
         ▼
    Actualización Visual en el TacticalCourt

## Archivos Modificados

| Archivo | Acción | Descripción |
|------|--------|-------------|
| `src/hooks/useVoiceRecognition.ts` | Crear | Hook genérico para envolver SpeechRecognition. |
| `src/utils/voiceCommandParser.ts` | Crear | Lógica pura para extraer comandos de pádel desde un texto en español. |
| `src/components/controls/TrainingControls.tsx` | Modificar | Agregar el botón de encendido del micrófono y enlazar el hook con la store. |

## Interfaces / Contratos

```typescript
// useVoiceRecognition.ts export
export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
}

// voiceCommandParser.ts export
export interface ParsedCommand {
  isValid: boolean;
  pointType?: 'winner' | 'error';
  hand?: string;
  shotType?: string;
}
export function parseVoiceCommand(text: string): ParsedCommand;
```

## Estrategia de Pruebas

Dado el entorno del proyecto actual, se realizarán pruebas manuales exhaustivas.

| Capa | Qué probar | Criterios |
|-------|-------------|----------|
| Lógica (Unit) | `parseVoiceCommand` | Verificar manualmente que combinaciones como "derecha buena", "revés mala" retornan los atributos correctos. |
| Integración | `useVoiceRecognition` + `TrainingControls` | Activar el botón en el navegador de un móvil real, decir "drive mala" y verificar en el heatmap que aparece el marcador rojo (error) en el lado de drive. |

## Preguntas Abiertas

- Ninguna por el momento. El soporte en iOS es el único riesgo notable que se mitigará con pruebas en un dispositivo físico.
