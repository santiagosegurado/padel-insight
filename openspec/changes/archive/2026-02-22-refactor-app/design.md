# Design: Refactor App.tsx

## Technical Approach

Extraer lógica de App.tsx en hooks y componentes reutilizables siguiendo el patrón existente del proyecto (componentes funcionales con TypeScript, Zustand para estado, Tailwind para estilos).

## Architecture Decisions

### Decision: ShotSelector como componente compartido

**Choice**: Crear `ShotSelector.tsx` con props de estado y setters
**Alternatives considered**: 
- Usar contexto de React para compartir estado
- Crear hook `useShotSelection` que retorna estado y handlers
**Rationale**: ShotSelector permite que cada componente padre controle su propio estado, más simple que contexto.StatsControls ya tiene el estado, TrainingControls también lo tendrá.

### Decision: TrainingControls como componente separado

**Choice**: Crear `TrainingControls.tsx` que recibe props del padre
**Alternatives considered**: 
- Mantener lógica inline en App.tsx
- Usar hook `useTrainingSession` para lógica de negocio
**Rationale**: Mantiene consistencia con StatsControls, facilita testing y cambio de UI sin modificar lógica.

### Decision: useAppHandlers para handlers de court

**Choice**: Crear hook que retorna funciones handler
**Alternatives considered**: 
- Crear un hook que maneje TODO el estado de la app
- Mantener handlers en App.tsx
**Rationale**: Handlers necesitan acceso a múltiples estados (mode, pointType, etc), un hook los hace reutilizables pero mantiene App.tsx limpio.

## Data Flow

```
App.tsx
    │
    ├── useMatchStore() ──────────────► Zustand Store
    │
    ├── useMatchControls() ──────────► Match operations
    │
    ├── useAppHandlers()
    │   ├── handleCourtClick ────────► addPoint / addTrainingPoint
    │   └── handleTokenDragEnd ──────► update tokens state
    │
    ├── StatsControls
    │   └── ShotSelector (winner/error, hand, shotType)
    │
    ├── TrainingControls
    │   ├── ShotSelector
    │   └── Training buttons (save, clear, undo)
    │
    └── TacticalCourt
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useAppHandlers.ts` | Create | Hook con handleCourtClick, handleTokenDragEnd |
| `src/components/controls/ShotSelector.tsx` | Create | Componente compartido para seleccionar shot |
| `src/components/controls/TrainingControls.tsx` | Create | Controles para modo training |
| `src/components/controls/StatsControls.tsx` | Modify | Usar ShotSelector |
| `src/App.tsx` | Modify | Usar nuevos componentes y hook |

## Interfaces / Contracts

```typescript
// ShotSelector
interface ShotSelectorProps {
    pointType: 'winner' | 'error';
    setPointType: (type: 'winner' | 'error') => void;
    shotType: string;
    setShotType: (type: string) => void;
    hand: string;
    setHand: (hand: string) => void;
}

// TrainingControls
interface TrainingControlsProps {
    pointType: 'winner' | 'error';
    setPointType: (type: 'winner' | 'error') => void;
    shotType: string;
    setShotType: (type: string) => void;
    hand: string;
    setHand: (hand: string) => void;
    showHeatmap: boolean;
    setShowHeatmap: (show: boolean) => void;
    trainingPoints: any[];
    addTrainingPoint: (point: any) => void;
    undoLastTrainingPoint: () => void;
    saveTrainingSession: (duration: number) => void;
    clearTrainingSession: () => void;
    setShowTrainingHistory: (show: boolean) => void;
    dimensions: { width: number; height: number };
}

// useAppHandlers
interface UseAppHandlersProps {
    mode: 'stats' | 'tactics' | 'training';
    pointType: 'winner' | 'error';
    shotType: string;
    hand: string;
    trainingPoints: any[];
    addPoint: (point: any) => void;
    addTrainingPoint: (point: any) => void;
    incrementScore: (team: 'us' | 'them') => void;
}

interface UseAppHandlersReturn {
    handleCourtClick: (e: any) => void;
    handleTokenDragEnd: (id: string, x: number, y: number) => void;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Manual | ShotSelector rendering | Verificar botones en stats y training |
| Manual | TrainingControls flow | Probar save, clear, undo |
| Manual | Court click handlers | Clickear en court y verificar punto agregado |
| Manual | Lint | `npm run lint` debe pasar |

## Migration / Rollback

No migration required - refactor puro sin cambios en datos o comportamiento.

## Open Questions

- [ ] None - el diseño es straightforward
