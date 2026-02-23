# Proposal: Refactor App.tsx

## Intent

Limpiar el código de App.tsx que tiene ~320 líneas con lógica mezclada (handlers, state, UI). Separar responsabilidades en componentes y hooks para mejorar mantenibilidad y reducir carga cognitiva.

## Scope

### In Scope
- Extraer lógica de handlers a hooks personalizados
- Crear componente ShotSelector compartido entre modos stats/training
- Extraer controles de modo training a componente TrainingControls
- Reducir tamaño de App.tsx a ~150 líneas

### Out of Scope
- Cambios en el store de Zustand
- Nuevas funcionalidades de UI
- Tests automatizados

## Approach

1. Crear `useAppHandlers.ts` para extraer handleCourtClick, handleTokenDragEnd
2. Crear `src/components/controls/ShotSelector.tsx` para código duplicado en StatsControls y App.tsx (training mode)
3. Crear `src/components/controls/TrainingControls.tsx` para lógica de modo training
4. Refactorizar App.tsx para usar nuevos componentes

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/App.tsx` | Modified | Reducir de ~320 a ~150 líneas |
| `src/hooks/useAppHandlers.ts` | New | Extraer handlers |
| `src/components/controls/ShotSelector.tsx` | New | Componente compartido |
| `src/components/controls/TrainingControls.tsx` | New | Controles training |
| `src/components/controls/StatsControls.tsx` | Modified | Usar ShotSelector |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Introducir bugs al mover código | Medium | Testing manual después de cada extracción |
| Quebrar estilos existentes | Low | Verificar visualmente después de cada cambio |

## Rollback Plan

1. `git checkout src/App.tsx` para restaurar versión anterior
2. Eliminar archivos nuevos creados
3. El store y componentes existentes no se tocan

## Dependencies

- Ninguna dependencia externa

## Success Criteria

- [ ] App.tsx tiene menos de 180 líneas
- [ ] ShotSelector funciona en modos stats y training
- [ ] TrainingControls maneja toda la lógica del modo training
- [ ] Funcionalidad existente no se rompe (manual verification)
- [ ] Lint pasa sin errores
