# Proposal: Cambiar "Winner" por "Aciertos" en Modo Entrenamiento

## Intent

Cambiar la terminología de "Winner" a "Aciertos" en el modo de entrenamiento, ya que "winner" es un término de match que no aplica cuando se practican golpes. En entrenamiento, un golpe exitoso es un "acierto", no un "winner".

## Scope

### In Scope
- Cambiar labels de UI de "Winner" a "Aciertos" en ShotSelector
- Cambiar labels en StatsControls para modo training
- Cambiar labels en TrainingHistoryModal
- Actualizar textos en Storage (localStorage keys si aplica)

### Out of Scope
- Cambios en modo stats/partido (solo entrenamiento)
- Cambios en colores (mantener verde para aciertos)

## Approach

Reemplazar textual de "winner" → "aciertos" y "error" → "errores" solo en componentes de training:
- ShotSelector.tsx: cambia label del botón
- TrainingControls.tsx: cambia textos de UI
- TrainingHistoryModal.tsx: cambia labels en estadísticas

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/controls/ShotSelector.tsx` | Modified | Cambiar label "Winner" por "Aciertos" |
| `src/components/controls/StatsControls.tsx` | Modified | Labels en modo training |
| `src/components/modals/TrainingHistoryModal.tsx` | Modified | Estadísticas de sesión |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Confusión si se cambia también en modo match | High | Solo cambiar en modo training, mantener "winner" en stats/match |

## Rollback Plan

- Revertir cambios textuales en los 3 archivos
- No requiere migración de datos

## Dependencies

- Ninguna

## Success Criteria

- [ ] ShotSelector muestra "Aciertos" en vez de "Winner"
- [ ] TrainingHistoryModal muestra "Aciertos" en estadísticas
- [ ] Modo match/stats sigue mostrando "Winner"
