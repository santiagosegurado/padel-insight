# Propuesta: Comandos de Voz para el Modo Entrenamiento

## Intención

Actualmente, registrar un punto durante el entrenamiento requiere interactuar con la pantalla del celular para seleccionar el tipo de golpe, si fue de drive o revés, y si fue un error o acierto. Este flujo corta el foco y ritmo del jugador durante la práctica ya que demanda tocar físicamente el dispositivo tras cada golpe. Dado que el dispositivo suele estar colocado lejos en un trípode, tocar la pantalla es muy incómodo e impráctico.

Este cambio pretende permitir a los usuarios registrar golpes sin usar las manos (hands-free) mediante la voz en tiempo real, mejorando el ritmo de entrenamiento y agilizando la carga del volumen de datos sin fricción.

## Alcance (Scope)

### Dentro del Alcance (In Scope)
- Un nuevo hook `useVoiceRecognition` para manejar la interaccion con la Web Speech API del navegador.
- Un botón con un icono de micrófono en la vista móvil y de escritorio de `TrainingControls`.
- Lógica de parseo de palabras clave (keywords) para mapear lo que se dictó a los datos del punto (ej. "drive", "revés", "mala", "buena").
- Feedback visual o de audio (un pequeño pitido o toast) cuando se ha entendido y registrado un comando con éxito.

### Fuera del Alcance (Out of Scope)
- Comprensión completa de lenguaje natural mediante IA (ej. pedirle a Gemini que analice un párrafo).
- Uso de comandos de voz para llevar los puntos de un partido completo (Modo Estadísticas o Match).
- Palabras clave de activación personalizadas (Custom wake words tipo "Oye Siri").

## Enfoque (Approach)

Usaremos la **Web Speech API (`window.SpeechRecognition` o `window.webkitSpeechRecognition`)** nativa del navegador para escuchar comandos mientras el botón tipo *toggle* se encuentre activado. El hook `useVoiceRecognition` mantendrá el estado de grabación vivo, lo reactivará si se corta de forma automática (un comportamiento típico del navegador), leerá las transcripciones buscando ciertas palabras clave de pádel y finalmente disparará (dispatch) la adición de puntos a `useMatchStore`.

## Áreas Afectadas

| Área | Impacto | Descripción |
|------|--------|-------------|
| `src/hooks/useVoiceRecognition.ts` | Nuevo | Hook que envuelve a la Web Speech API y analiza comandos simples. |
| `src/components/controls/TrainingControls.tsx` | Modificado | Agrega un botón de Modo Voz para iniciar/detener la escucha del micrófono. |

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|------|------------|------------|
| Incompatibilidad con el navegador (ej., Safari en iOS limitando fuertemente el acceso pasivo al micrófono) | Medio | Revisar la disponibilidad de la API de forma segura mediante un chequeo en JavaScript y ocultar el botón si no está soportado. Depender en todo momento de los controles manuales si algo falla. |
| Entornos ruidosos provocando comandos falsos o ingresos erróneos | Alto | Implementar una estricta validación de palabras ("drive" y "mala" deben ir juntas) e ignorar coincidencias parciales de palabras. |
| La API se apaga o desactiva de forma inesperada sin avisar | Alto | Re-inicializar el reconocimiento cada vez que entre al evento `onend` si el interruptor en la UI sigue activado. |

## Plan de Fallback (Rollback)

Si por alguna razón el usar el micrófono desestabiliza la aplicación, hace que se cierre inesperadamente la web app o altera otros controles, se puede simplemente eliminar y borrar los imports de `useVoiceRecognition` dejándolo desactivado, por lo que no afectará la experiencia base de los modos manuales.

## Dependencias

- Sin dependencias externas. Confía y hace uso 100% de la Web Speech API estándar provista en navegadores Safari, Chrome o Firefox modernos.

## Criterios de Éxito

- [ ] Un usuario puede clickear un ícono o botón de "micrófono/Voz" en el modo Entrenamiento y se le pide permitir los permisos correspondientes.
- [ ] El usuario dice "drive mala" y la app registra correctamente un error de drive.
- [ ] El usuario dice "revés buena" y la app registra correctamente un winner u acierto de revés.
- [ ] La app avisa de forma audible o emite un sonido o visualiza cuando el golpe por micrófono ha sido guardado existosamente.
