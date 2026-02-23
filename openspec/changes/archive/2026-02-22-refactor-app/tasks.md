# Tasks: Refactor App.tsx

## Phase 1: Foundation

- [x] 1.1 Crear `src/hooks/useAppHandlers.ts` con interfaces y función useAppHandlers
- [x] 1.2 Crear `src/components/controls/ShotSelector.tsx` con props definidas en design
- [x] 1.3 Crear `src/components/controls/TrainingControls.tsx` con props definidas en design

## Phase 2: Core Implementation

- [x] 2.1 Modificar `StatsControls.tsx` para importar y usar ShotSelector
- [x] 2.2 Mover lógica de training mode desde App.tsx a TrainingControls.tsx
- [x] 2.3 Integrar useAppHandlers en App.tsx (handleCourtClick, handleTokenDragEnd)

## Phase 3: Integration

- [x] 3.1 Refactorizar App.tsx para usar TrainingControls en modo training
- [x] 3.2 Refactorizar App.tsx para usar ShotSelector en StatsControls
- [x] 3.3 Eliminar código duplicado de App.tsx ( ShotSelector inline, training controls inline)

## Phase 4: Verification

- [x] 4.1 Verificar modo stats funciona correctamente (clicks en court, score)
- [x] 4.2 Verificar modo training funciona correctamente (save, clear, undo)
- [x] 4.3 Verificar que ShotSelector funciona en ambos modos
- [x] 4.4 Ejecutar `npm run lint` y corregir errores
- [x] 4.5 Verificar línea count de App.tsx < 180
